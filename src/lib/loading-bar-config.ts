import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { HubLoadingBarConfig } from './models/loading-bar.types';

/**
 * Default trickle curve: large steps early, then progressively smaller ones.
 *
 * The shape is what makes an invented number believable. Moving fast at the start
 * matches the part of a page load that really is fast (the request goes out, the shell
 * responds); slowing near the end matches the part nobody can predict, and leaves room
 * for `complete()` to arrive without the bar having to jump backwards.
 *
 * Exported so a consumer can wrap it rather than rewrite it.
 *
 * @param progress - Current value, 0–100.
 * @returns Amount to add on this tick.
 */
export function hubLoadingBarTrickle(progress: number): number {
	if (progress < 20) {
		return 10;
	}
	if (progress < 50) {
		return 4;
	}
	if (progress < 80) {
		return 2;
	}
	if (progress < 99) {
		return 0.5;
	}
	return 0;
}

/**
 * Neutral defaults applied when an application provides no configuration.
 *
 * These are the values documented as each input's default, so overriding the token
 * silently re-bases the whole application without touching a template.
 */
export const HUB_LOADING_BAR_DEFAULT_CONFIG: HubLoadingBarConfig = {
	min: 8,
	max: 99,
	trickleSpeed: 250,
	trickle: true,
	trickleFn: hubLoadingBarTrickle,
	delay: 100,
	completeDelay: 300,
	color: null,
	glow: true,
	ariaLabel: 'Loading'
};

/**
 * Resolved defaults shared by `<hub-loading-bar>` and `HubLoadingBarService`.
 *
 * Declared with a root factory so the token is always injectable, even when the
 * application never calls {@link provideHubLoadingBar}.
 */
export const HUB_LOADING_BAR_CONFIG = new InjectionToken<HubLoadingBarConfig>('HUB_LOADING_BAR_CONFIG', {
	providedIn: 'root',
	factory: () => HUB_LOADING_BAR_DEFAULT_CONFIG
});

/**
 * Registers application-wide loading-bar defaults — the accent, the pacing, the
 * translated label — so individual call sites stay bare.
 *
 * @param config - Values overriding {@link HUB_LOADING_BAR_DEFAULT_CONFIG}; omitted keys keep their default.
 * @returns Environment providers for the application bootstrap.
 */
export function provideHubLoadingBar(config: Partial<HubLoadingBarConfig> = {}): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_LOADING_BAR_CONFIG,
			useValue: { ...HUB_LOADING_BAR_DEFAULT_CONFIG, ...config }
		}
	]);
}
