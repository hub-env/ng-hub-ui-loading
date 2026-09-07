import { effect } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HUB_LOADING_BAR_DEFAULT_CONFIG, hubLoadingBarTrickle, provideHubLoadingBar } from '../loading-bar-config';
import { HubLoadingBarService } from './loading-bar.service';

const { delay, completeDelay, trickleSpeed, min, max } = HUB_LOADING_BAR_DEFAULT_CONFIG;

describe('HubLoadingBarService', () => {
	let service: HubLoadingBarService;

	beforeEach(() => {
		vi.useFakeTimers();
		TestBed.configureTestingModule({});
		service = TestBed.inject(HubLoadingBarService);
	});

	afterEach(() => {
		service.reset();
		vi.useRealTimers();
	});

	describe('grace period', () => {
		it('is idle until somebody starts', () => {
			expect(service.isActive()).toBe(false);
			expect(service.isVisible()).toBe(false);
			expect(service.progress()).toBe(0);
		});

		it('registers the caller immediately but paints nothing yet', () => {
			service.start();

			expect(service.isActive()).toBe(true);
			expect(service.isVisible()).toBe(false);
		});

		it('paints the bar at the minimum once the grace period elapses', () => {
			service.start();

			vi.advanceTimersByTime(delay);

			expect(service.isVisible()).toBe(true);
			expect(service.progress()).toBe(min);
		});

		it('paints immediately when the grace period is turned off', () => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({ providers: [provideHubLoadingBar({ delay: 0 })] });
			service = TestBed.inject(HubLoadingBarService);

			service.start();

			// Synchronously, with no timer advanced: a navigation that settles inside its own
			// task would otherwise cancel a deferred reveal before it ever ran.
			expect(service.isVisible()).toBe(true);
			expect(service.progress()).toBe(min);
		});

		it('never shows a bar for work that finishes inside the grace period', () => {
			service.start();
			vi.advanceTimersByTime(delay - 1);

			service.complete();
			vi.advanceTimersByTime(delay + completeDelay);

			expect(service.isVisible()).toBe(false);
			expect(service.progress()).toBe(0);
		});
	});

	/**
	 * A caller inside a reactive context must not be made to depend on the counter.
	 *
	 * `start()` and `complete()` read `pending` to decide what to do, and a read inside an
	 * effect is a subscription. An interceptor is not untracked by Angular, so a request
	 * fired from an effect used to subscribe that effect to the counter, and every
	 * subsequent request re-ran it — a request loop with the bar as the feedback path. A
	 * consumer measured 3.985 calls to one endpoint in a second before it was traced here.
	 */
	describe('reads of its own counter', () => {
		it("does not subscribe a caller's effect to the count", () => {
			let ejecuciones = 0;

			TestBed.runInInjectionContext(() => {
				effect(() => {
					ejecuciones++;

					// The guard is the test's seatbelt, not part of the contract: with the
					// tracked read in place this effect re-enters without end, and a spec
					// that hangs says less than one that fails.
					if (ejecuciones > 3) {
						return;
					}

					service.start();
				});
			});
			TestBed.tick();

			expect(ejecuciones).toBe(1);
		});

		it("does not subscribe a caller's effect to the bar's visibility", () => {
			let ejecuciones = 0;
			service.start();

			TestBed.runInInjectionContext(() => {
				effect(() => {
					ejecuciones++;

					if (ejecuciones > 3) {
						return;
					}

					// The last caller leaves, so `complete()` reaches `finish()`, which reads
					// whether the bar is on screen.
					service.complete();
				});
			});
			TestBed.tick();
			expect(ejecuciones).toBe(1);

			// An unrelated caller opens a cycle. Revealing the bar must not wake the effect,
			// which would complete a cycle it never started.
			service.start();
			vi.advanceTimersByTime(delay);
			TestBed.tick();

			expect(ejecuciones).toBe(1);
			expect(service.isActive()).toBe(true);
			expect(service.isVisible()).toBe(true);
		});

		it("does not subscribe a caller's effect to the progress", () => {
			let ejecuciones = 0;

			TestBed.runInInjectionContext(() => {
				effect(() => {
					ejecuciones++;

					if (ejecuciones > 3) {
						return;
					}

					// `inc()` reads the current fill to compute the next one; tracked, the step
					// it writes re-enters the effect and the bar runs away on its own.
					service.inc(10);
				});
			});
			TestBed.tick();

			expect(ejecuciones).toBe(1);
			expect(service.progress()).toBe(10);
		});
	});

	describe('reference counter', () => {
		it('keeps the bar running until every caller has completed', () => {
			service.start();
			service.start();
			vi.advanceTimersByTime(delay);

			service.complete();
			expect(service.isActive()).toBe(true);
			expect(service.progress()).toBeLessThan(100);

			service.complete();
			expect(service.isActive()).toBe(false);
			expect(service.progress()).toBe(100);
		});

		it('clamps at zero so a stray complete cannot swallow the next start', () => {
			service.complete();
			service.complete();
			expect(service.isActive()).toBe(false);

			service.start();
			expect(service.isActive()).toBe(true);
		});

		it('completeAll drops every pending caller at once', () => {
			service.start();
			service.start();
			service.start();
			vi.advanceTimersByTime(delay);

			service.completeAll();

			expect(service.isActive()).toBe(false);
			expect(service.progress()).toBe(100);
		});
	});

	describe('trickle', () => {
		it('advances on its own while it waits', () => {
			service.start();
			vi.advanceTimersByTime(delay);
			const initial = service.progress();

			vi.advanceTimersByTime(trickleSpeed);

			expect(service.progress()).toBeGreaterThan(initial);
		});

		it('never reaches the end on its own, however long it waits', () => {
			service.start();
			vi.advanceTimersByTime(delay + trickleSpeed * 400);

			expect(service.progress()).toBeLessThanOrEqual(max);
			expect(service.progress()).toBeGreaterThan(90);
		});

		it('stops advancing once the bar has completed', () => {
			service.start();
			vi.advanceTimersByTime(delay);
			service.complete();

			vi.advanceTimersByTime(trickleSpeed * 10);

			expect(service.progress()).toBe(100);
		});

		it('does not tick at all when the configuration turns it off', () => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({ providers: [provideHubLoadingBar({ trickle: false })] });
			service = TestBed.inject(HubLoadingBarService);

			service.start();
			vi.advanceTimersByTime(delay + trickleSpeed * 10);

			expect(service.progress()).toBe(min);
		});
	});

	describe('completion', () => {
		it('holds the finished bar on screen before fading it out', () => {
			service.start();
			vi.advanceTimersByTime(delay);

			service.complete();
			expect(service.isVisible()).toBe(true);

			vi.advanceTimersByTime(completeDelay);
			expect(service.isVisible()).toBe(false);
		});

		it('rewinds only after the bar is off screen, so nothing is seen running backwards', () => {
			service.start();
			vi.advanceTimersByTime(delay);
			service.complete();
			vi.advanceTimersByTime(completeDelay);

			expect(service.progress()).toBe(100);

			service.start();
			expect(service.progress()).toBe(min);
		});

		it('drops the bar before rewinding when a new cycle interrupts the completion tail', () => {
			service.start();
			vi.advanceTimersByTime(delay);
			service.complete();

			service.start();

			expect(service.isVisible()).toBe(false);
			expect(service.progress()).toBe(min);

			vi.advanceTimersByTime(delay);
			expect(service.isVisible()).toBe(true);
		});
	});

	describe('manual control', () => {
		it('set reveals the bar immediately, without waiting out the grace period', () => {
			service.set(42);

			expect(service.isVisible()).toBe(true);
			expect(service.progress()).toBe(42);
		});

		it('set clamps to the 0-100 range but is not capped at max', () => {
			service.set(140);
			expect(service.progress()).toBe(100);

			service.set(-10);
			expect(service.progress()).toBe(0);
		});

		it('inc adds an explicit amount', () => {
			service.set(30);

			service.inc(15);

			expect(service.progress()).toBe(45);
		});

		it('inc follows the trickle curve when given no amount', () => {
			service.set(30);

			service.inc();

			expect(service.progress()).toBe(30 + hubLoadingBarTrickle(30));
		});

		it('inc respects the trickle ceiling', () => {
			service.set(98);

			service.inc(50);

			expect(service.progress()).toBe(max);
		});
	});

	describe('reset', () => {
		it('cancels everything without a completion animation', () => {
			service.start();
			service.start();
			vi.advanceTimersByTime(delay);

			service.reset();

			expect(service.isActive()).toBe(false);
			expect(service.isVisible()).toBe(false);
			expect(service.progress()).toBe(0);
		});

		it('leaves no timer behind to resurrect the bar', () => {
			service.start();
			vi.advanceTimersByTime(delay);
			service.reset();

			vi.advanceTimersByTime(delay + trickleSpeed * 10);

			expect(service.isVisible()).toBe(false);
			expect(service.progress()).toBe(0);
		});
	});

	describe('configuration', () => {
		beforeEach(() => {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				providers: [provideHubLoadingBar({ min: 25, max: 60, delay: 0, trickleFn: () => 100 })]
			});
			service = TestBed.inject(HubLoadingBarService);
		});

		it('starts from the configured minimum', () => {
			service.start();
			vi.advanceTimersByTime(0);

			expect(service.progress()).toBe(25);
		});

		it('honours a custom trickle function up to the configured ceiling', () => {
			service.start();
			vi.advanceTimersByTime(trickleSpeed);

			expect(service.progress()).toBe(60);
		});
	});
});
