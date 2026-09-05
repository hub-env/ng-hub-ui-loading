import { DestroyRef, EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import {
	Event as RouterNavigationEvent,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationSkipped,
	NavigationStart,
	Router
} from '@angular/router';
import { HubLoadingBarService } from '../services/loading-bar.service';

/** Every way a navigation can stop, successful or not. All four must release the bar. */
function isNavigationSettled(event: RouterNavigationEvent): boolean {
	return (
		event instanceof NavigationEnd ||
		event instanceof NavigationCancel ||
		event instanceof NavigationError ||
		event instanceof NavigationSkipped
	);
}

/**
 * Drives the loading bar from router navigation, which is the "page is loading" the bar
 * is named after: it starts when a navigation begins and completes when it settles —
 * including when it is cancelled by a guard or fails, because a bar left running after a
 * rejected navigation is a bar that never goes away.
 *
 * Navigations are tracked with a flag rather than by pairing events one-to-one. The
 * router's event sequence varies with configuration (a blocking initial navigation, a
 * redirect, a skipped same-URL navigation), and the flag guarantees exactly one
 * `start()` / `complete()` pair per navigation whatever order the events arrive in — a
 * missed `NavigationStart` during bootstrap can no longer leave an unmatched `complete()`
 * decrementing somebody else's count.
 *
 * Combine with {@link hubLoadingBarInterceptor} when routes fetch their own data: the
 * navigation settles as soon as the component is created, so without the interceptor the
 * bar finishes while the page is still empty.
 *
 * @returns Environment providers for the application bootstrap.
 *
 * @example
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [provideRouter(routes), provideHubLoadingBarRouter()]
 * });
 * ```
 */
export function provideHubLoadingBarRouter(): EnvironmentProviders {
	return makeEnvironmentProviders([
		provideAppInitializer(() => {
			const router = inject(Router);
			const bar = inject(HubLoadingBarService);
			let navigating = false;

			const subscription = router.events.subscribe((event) => {
				if (event instanceof NavigationStart) {
					if (!navigating) {
						navigating = true;
						bar.start();
					}
					return;
				}

				if (isNavigationSettled(event) && navigating) {
					navigating = false;
					bar.complete();
				}
			});

			inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
		})
	]);
}
