import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { HubLoadingBarService } from '../services/loading-bar.service';

/**
 * Marks a request as invisible to the loading bar.
 *
 * The escape hatch is not a nicety. A poll on a timer, a heartbeat, an autosave — any
 * request the reader did not ask for — would otherwise hold the bar open forever, and a
 * progress bar that never finishes is worse than none.
 */
export const HUB_LOADING_BAR_SKIP = new HttpContextToken<boolean>(() => false);

/**
 * Builds the `HttpContext` that hides one request from the loading bar.
 *
 * @param context - Existing context to extend; a fresh one by default.
 * @returns The context, with the skip flag set.
 *
 * @example
 * ```typescript
 * this.http.get('/api/notifications', { context: withoutHubLoadingBar() });
 * ```
 */
export function withoutHubLoadingBar(context: HttpContext = new HttpContext()): HttpContext {
	return context.set(HUB_LOADING_BAR_SKIP, true);
}

/**
 * Holds the loading bar open for the lifetime of every HTTP request.
 *
 * The bar's reference counter is what makes this safe to combine with the router
 * integration and with hand-written `start()` calls: six parallel requests are six
 * callers, and the bar completes when the last of them does, not the first.
 *
 * `finalize` is the balancing point rather than a `tap` on success, because it also fires
 * when the request errors and when the caller unsubscribes — a cancelled typeahead is the
 * commonest way a naive interceptor strands the bar at 90%.
 *
 * Opt a request out with {@link withoutHubLoadingBar}.
 *
 * @example
 * ```typescript
 * provideHttpClient(withInterceptors([hubLoadingBarInterceptor]))
 * ```
 */
export const hubLoadingBarInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.context.get(HUB_LOADING_BAR_SKIP)) {
		return next(req);
	}

	const bar = inject(HubLoadingBarService);
	bar.start();

	return next(req).pipe(finalize(() => bar.complete()));
};
