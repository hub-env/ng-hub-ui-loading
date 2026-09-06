import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	ApplicationRef,
	ComponentRef,
	Injectable,
	PLATFORM_ID,
	Signal,
	computed,
	createComponent,
	inject,
	signal,
	untracked
} from '@angular/core';
import { HubLoadingComponent } from '../components/loading/loading.component';
import { HUB_LOADING_CONFIG } from '../loading-config';
import { HubLoadingOptions } from '../models/loading.types';

/**
 * Drives a single application-wide fullscreen loading overlay.
 *
 * Concurrency is handled with a reference counter rather than a boolean, because
 * independent callers overlap constantly (two parallel requests, a resolver plus a
 * component): the overlay appears on the first `show()` and only disappears once
 * every caller has balanced it with a `hide()`. A caller that forgets to hide would
 * strand the overlay, so {@link hideAll} exists as the explicit escape hatch — use it
 * from an error handler or a route change, never as a substitute for balanced calls.
 *
 * Server-side there is no DOM to mount into, so only the counter runs: `isLoading`
 * stays truthful and hydration finds no orphan overlay markup.
 *
 * @example
 * ```typescript
 * private readonly loading = inject(HubLoadingService);
 *
 * async save(): Promise<void> {
 *   this.loading.show({ message: 'Saving…' });
 *   try {
 *     await this.api.save();
 *   } finally {
 *     this.loading.hide();
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class HubLoadingService {
	private readonly appRef = inject(ApplicationRef);
	private readonly document = inject(DOCUMENT);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly config = inject(HUB_LOADING_CONFIG);

	/**
	 * Number of callers currently requesting the overlay.
	 *
	 * Read through `untracked` wherever it steers this service's own logic. A caller is not
	 * necessarily outside a reactive context — `hide()` from inside an `effect()` is ordinary
	 * code — and a tracked read there subscribes that effect to the counter, so anyone else's
	 * `show()` re-runs it and retires a reference it never registered, taking the overlay down
	 * while other callers are still waiting. Only `isLoading` reads it tracked, and that one is
	 * meant to: it exists to be watched.
	 */
	private readonly pending = signal(0);

	/** Live reference to the mounted overlay; `null` whenever nothing is showing. */
	private overlayRef: ComponentRef<HubLoadingComponent> | null = null;

	/**
	 * Options accumulated by the active `show()` / `update()` calls, layered over
	 * `HUB_LOADING_CONFIG`. Reset once the counter reaches zero so a later overlay
	 * never inherits a stale message from a finished operation.
	 */
	private options: HubLoadingOptions = {};

	/** True while at least one caller is still waiting. Safe to read during SSR. */
	readonly isLoading: Signal<boolean> = computed(() => this.pending() > 0);

	/**
	 * Registers one caller and mounts the overlay if it is not up yet.
	 *
	 * @param options - Presentation overrides merged over the application defaults;
	 * only the keys supplied are changed, so nested calls compose instead of resetting.
	 */
	show(options: HubLoadingOptions = {}): void {
		this.mergeOptions(options);
		this.pending.update((count) => count + 1);
		this.mount();
	}

	/**
	 * Retires one caller, tearing the overlay down once none are left.
	 * Extra calls are harmless: the counter is clamped at zero rather than going
	 * negative, so a stray `hide()` cannot make a later `show()` a no-op.
	 */
	hide(): void {
		this.pending.update((count) => Math.max(0, count - 1));

		if (untracked(this.pending) === 0) {
			this.unmount();
		}
	}

	/** Drops every pending caller and removes the overlay immediately. */
	hideAll(): void {
		this.pending.set(0);
		this.unmount();
	}

	/**
	 * Re-dresses the overlay while it stays up — a progress message that changes
	 * mid-operation, a variant swap — without touching the reference counter.
	 *
	 * @param options - Presentation overrides merged over the active ones.
	 */
	update(options: HubLoadingOptions): void {
		this.mergeOptions(options);
		this.applyOptions();
	}

	/**
	 * Copies only the keys the caller actually supplied.
	 *
	 * A plain spread would let an `undefined` property erase a configured default,
	 * which would make `{ message: undefined }` and `{ message: null }` behave the
	 * same; here `undefined` means "leave it alone" and `null` means "clear it".
	 */
	private mergeOptions(options: HubLoadingOptions): void {
		for (const [key, value] of Object.entries(options)) {
			if (value !== undefined) {
				(this.options as Record<string, unknown>)[key] = value;
			}
		}
	}

	/**
	 * Creates the overlay on `document.body` once, outside any component subtree, so
	 * it is never clipped by an ancestor's `overflow` or stacking context.
	 */
	private mount(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		if (this.overlayRef) {
			this.applyOptions();
			return;
		}

		// A `show()` racing application teardown (a destroyed TestBed, an HMR reload)
		// would otherwise touch a dead environment injector and throw NG0205.
		if (this.appRef.destroyed) {
			return;
		}

		const ref = createComponent(HubLoadingComponent, { environmentInjector: this.appRef.injector });
		this.overlayRef = ref;
		this.appRef.attachView(ref.hostView);
		this.document.body.appendChild(ref.location.nativeElement);
		this.applyOptions();
	}

	/** Destroys the overlay and forgets the accumulated options. */
	private unmount(): void {
		const ref = this.overlayRef;
		this.overlayRef = null;
		this.options = {};

		if (!ref) {
			return;
		}

		this.appRef.detachView(ref.hostView);
		ref.destroy();
		// `destroy()` tears down the view but leaves the host node where we put it.
		ref.location.nativeElement.remove();
	}

	/**
	 * Pushes the resolved options onto the overlay.
	 *
	 * Change detection is run by hand: a view attached through `attachView()` sits
	 * outside the signal graph's "mark ancestors dirty" traversal, so it would not
	 * repaint on its own when an input changes.
	 */
	private applyOptions(): void {
		const ref = this.overlayRef;

		if (!ref) {
			return;
		}

		const resolved = { ...this.config, ...this.options };
		ref.setInput('mode', 'fullscreen');
		ref.setInput('variant', resolved.variant);
		ref.setInput('image', resolved.image);
		ref.setInput('imageAnimation', resolved.imageAnimation);
		ref.setInput('message', resolved.message);
		ref.setInput('size', resolved.size);
		ref.setInput('color', resolved.color);
		ref.setInput('backdrop', resolved.backdrop);
		ref.setInput('ariaLabel', resolved.ariaLabel);
		ref.changeDetectorRef.detectChanges();
	}
}
