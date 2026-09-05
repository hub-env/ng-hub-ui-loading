import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, NgZone, PLATFORM_ID, Signal, computed, inject, signal } from '@angular/core';
import { HUB_LOADING_BAR_CONFIG } from '../loading-bar-config';

/** The three timers the bar juggles; named so `clearTimer` reads at the call site. */
type HubLoadingBarTimer = 'reveal' | 'trickle' | 'complete';

/**
 * Drives the page-level loading bar: the thin strip under the navbar that says
 * "something is on its way" without pretending to know how long it will take.
 *
 * Three decisions shape the whole service, and each exists because the naive version is
 * worse:
 *
 * - **Reference counting, not a boolean.** A route change and the three requests its
 *   page fires are four independent callers. With a boolean, the first one to finish
 *   would take the bar down while the other three were still working. The bar completes
 *   when the count reaches zero, and {@link completeAll} is the escape hatch for a caller
 *   that never balanced its `start()`.
 * - **A grace period before anything is painted.** Work that finishes within `delay`
 *   never shows a bar at all. A cached route that flashes a progress bar for 40 ms reads
 *   as a glitch, not as speed.
 * - **A trickle that never reaches the end.** Nothing here knows the real percentage, so
 *   the bar advances in shrinking steps and stops at `max`. Only `complete()` may show
 *   100, because only `complete()` knows it is true.
 *
 * Timers run outside the Angular zone. Inside it, a 250 ms interval would trigger change
 * detection for the whole application on every tick and — far worse — would keep
 * `ApplicationRef.isStable` false forever, which hangs server-side rendering. The state
 * is signals, so change detection is still scheduled correctly when a value actually
 * changes. On the server no timer is created at all: the counter stays truthful and the
 * rendered HTML carries no bar to mismatch on hydration.
 *
 * @example
 * ```typescript
 * private readonly bar = inject(HubLoadingBarService);
 *
 * async import(): Promise<void> {
 *   this.bar.start();
 *   try {
 *     await this.api.import();
 *   } finally {
 *     this.bar.complete();
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class HubLoadingBarService {
	private readonly config = inject(HUB_LOADING_BAR_CONFIG);
	private readonly zone = inject(NgZone);
	private readonly platformId = inject(PLATFORM_ID);

	/** Number of callers currently waiting on something. */
	private readonly pending = signal(0);

	/** Current fill, 0–100. */
	private readonly _progress = signal(0);

	/** Whether the bar is painted right now; false during the grace period. */
	private readonly _visible = signal(false);

	/** Handles of the running timers, so each can be cancelled independently. */
	private readonly timers: Record<HubLoadingBarTimer, ReturnType<typeof setTimeout> | null> = {
		reveal: null,
		trickle: null,
		complete: null
	};

	/** Current fill, 0–100. Bound by `<hub-loading-bar>`; safe to read during SSR. */
	readonly progress: Signal<number> = this._progress.asReadonly();

	/**
	 * Whether the bar is on screen. Differs from {@link isActive} at both ends of a cycle:
	 * false while the grace period runs, and still true during the completion tail.
	 */
	readonly isVisible: Signal<boolean> = this._visible.asReadonly();

	/**
	 * Whether any caller is still waiting — the honest "is the page loading?" question,
	 * regardless of whether the bar has decided to show itself yet.
	 */
	readonly isActive: Signal<boolean> = computed(() => this.pending() > 0);

	constructor() {
		// A root service outlives most things, but not a TestBed reset or an HMR reload;
		// an orphan interval would keep ticking against a dead injector.
		inject(DestroyRef).onDestroy(() => this.clearAllTimers());
	}

	/**
	 * Registers one caller. The first one starts a cycle; the rest simply join the count.
	 */
	start(): void {
		const wasIdle = this.pending() === 0;
		this.pending.update((count) => count + 1);

		if (!wasIdle) {
			return;
		}

		if (this.timers.complete !== null) {
			// Interrupting the completion tail. Drop the bar before rewinding it: the
			// stylesheet only transitions the fill while the bar is visible, so rewinding
			// it on screen would animate the progress running backwards.
			this.clearTimer('complete');
			this._visible.set(false);
		}

		this._progress.set(this.config.min);

		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		// `delay: 0` has to mean "paint now", not "paint on the next macrotask". A router
		// navigation with no async guard settles inside the same task it started in, so a
		// deferred reveal would be cancelled by `complete()` before it ever ran and the bar
		// would be unreachable for anyone who opted out of the grace period.
		if (this.config.delay <= 0) {
			this.reveal();
			return;
		}

		this.schedule('reveal', this.config.delay, () => this.reveal());
	}

	/**
	 * Retires one caller. Once none are left the bar runs to 100% and fades away — or, if
	 * the grace period swallowed the whole operation, disappears without ever having been
	 * seen.
	 */
	complete(): void {
		this.pending.update((count) => Math.max(0, count - 1));

		if (this.pending() === 0) {
			this.finish();
		}
	}

	/** Drops every pending caller and completes the bar immediately. */
	completeAll(): void {
		this.pending.set(0);
		this.finish();
	}

	/**
	 * Moves the bar to an exact value and reveals it, bypassing the grace period.
	 *
	 * For work whose real percentage is known — a file upload, a paged import. The value
	 * is not capped at `max`, because a caller reporting a true 100 is not guessing;
	 * finishing the cycle is still {@link complete}'s job.
	 *
	 * @param value - Target fill, 0–100. Values outside the range are clamped.
	 */
	set(value: number): void {
		this.reveal();
		this._progress.set(Math.min(100, Math.max(0, value)));
	}

	/**
	 * Advances the bar and reveals it, bypassing the grace period.
	 *
	 * @param amount - Step to add. Omitted, the configured trickle curve decides, which is
	 * what makes an unknown wait keep moving without ever arriving.
	 */
	inc(amount?: number): void {
		this.reveal();
		this.advance(amount);
	}

	/**
	 * Cancels everything at once: no completion animation, no pending callers, nothing on
	 * screen. For an error handler that wants the bar gone rather than finished.
	 */
	reset(): void {
		this.clearAllTimers();
		this.pending.set(0);
		this._visible.set(false);
		this._progress.set(0);
	}

	/** Paints the bar and starts the trickle, if a caller is waiting on one. */
	private reveal(): void {
		this.clearTimer('reveal');
		this._visible.set(true);
		this.startTrickling();
	}

	/**
	 * Runs the completion, shared by {@link complete} and {@link completeAll}.
	 *
	 * The fill is deliberately left at 100 once the bar is hidden. `start()` rewinds it
	 * while the bar is invisible, where the stylesheet suppresses the transition, so the
	 * next cycle begins from `min` without the previous one being seen to unwind.
	 */
	private finish(): void {
		this.clearTimer('reveal');
		this.clearTimer('trickle');

		if (!this._visible()) {
			this._progress.set(0);
			return;
		}

		this._progress.set(100);
		this.schedule('complete', this.config.completeDelay, () => this._visible.set(false));
	}

	/** Starts the trickle interval, unless it is disabled, already running or unneeded. */
	private startTrickling(): void {
		if (!this.config.trickle || this.timers.trickle !== null || this.pending() === 0) {
			return;
		}

		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		this.zone.runOutsideAngular(() => {
			this.timers.trickle = setInterval(() => this.advance(), this.config.trickleSpeed);
		});
	}

	/** Adds one step, capped at `max` so the trickle can never claim to be finished. */
	private advance(amount?: number): void {
		const current = this._progress();
		const step = amount ?? this.config.trickleFn(current);

		this._progress.set(Math.min(this.config.max, Math.max(0, current + step)));
	}

	/** Schedules a one-shot timer outside the Angular zone, replacing any previous one. */
	private schedule(name: HubLoadingBarTimer, delay: number, action: () => void): void {
		this.clearTimer(name);

		this.zone.runOutsideAngular(() => {
			this.timers[name] = setTimeout(() => {
				this.timers[name] = null;
				action();
			}, delay);
		});
	}

	/** Cancels one timer if it is running. Safe to call for a timer that is not. */
	private clearTimer(name: HubLoadingBarTimer): void {
		const handle = this.timers[name];

		if (handle === null) {
			return;
		}

		this.timers[name] = null;
		// `setInterval` and `setTimeout` share a handle space in both runtimes, so one
		// clear covers the repeating trickle and the two one-shots alike.
		clearTimeout(handle);
		clearInterval(handle as ReturnType<typeof setInterval>);
	}

	/** Cancels every timer; used by `reset()` and on injector teardown. */
	private clearAllTimers(): void {
		this.clearTimer('reveal');
		this.clearTimer('trickle');
		this.clearTimer('complete');
	}
}
