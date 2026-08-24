import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { HubLoadingConfig } from './models/loading.types';

/**
 * Neutral defaults applied when an application provides no configuration.
 *
 * These are the values documented as each input's default, so overriding the
 * token silently re-bases the whole application without touching a template.
 */
export const HUB_LOADING_DEFAULT_CONFIG: HubLoadingConfig = {
	message: null,
	variant: 'spinner',
	image: null,
	imageAnimation: 'none',
	size: 'md',
	color: null,
	backdrop: true,
	ariaLabel: 'Loading'
};

/**
 * Resolved defaults shared by `<hub-loading>` and `HubLoadingService`.
 *
 * Declared with a root factory so the token is always injectable, even when the
 * application never calls {@link provideHubLoading}.
 */
export const HUB_LOADING_CONFIG = new InjectionToken<HubLoadingConfig>('HUB_LOADING_CONFIG', {
	providedIn: 'root',
	factory: () => HUB_LOADING_DEFAULT_CONFIG
});

/**
 * Registers application-wide loading defaults — typically the brand image, the
 * preferred variant and a translated label — so individual call sites stay bare.
 *
 * @param config - Values overriding {@link HUB_LOADING_DEFAULT_CONFIG}; omitted keys keep their default.
 * @returns Environment providers for the application bootstrap.
 */
export function provideHubLoading(config: Partial<HubLoadingConfig> = {}): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_LOADING_CONFIG,
			useValue: { ...HUB_LOADING_DEFAULT_CONFIG, ...config }
		}
	]);
}
