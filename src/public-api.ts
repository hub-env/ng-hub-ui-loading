/** Public API surface of ng-hub-ui-loading. */
export { HubLoadingComponent } from './lib/components/loading/loading.component';
export { HubLoadingService } from './lib/services/loading.service';
export { HUB_LOADING_CONFIG, HUB_LOADING_DEFAULT_CONFIG, provideHubLoading } from './lib/loading-config';
export type {
	HubLoadingConfig,
	HubLoadingImageAnimation,
	HubLoadingMode,
	HubLoadingOptions,
	HubLoadingSize,
	HubLoadingVariant
} from './lib/models/loading.types';

export { HubLoadingBarComponent } from './lib/components/loading-bar/loading-bar.component';
export { HubLoadingBarService } from './lib/services/loading-bar.service';
export {
	HUB_LOADING_BAR_CONFIG,
	HUB_LOADING_BAR_DEFAULT_CONFIG,
	hubLoadingBarTrickle,
	provideHubLoadingBar
} from './lib/loading-bar-config';
export {
	HUB_LOADING_BAR_SKIP,
	hubLoadingBarInterceptor,
	withoutHubLoadingBar
} from './lib/integrations/loading-bar-interceptor';
export { provideHubLoadingBarRouter } from './lib/integrations/loading-bar-router';
export type {
	HubLoadingBarConfig,
	HubLoadingBarMode,
	HubLoadingBarPlacement,
	HubLoadingBarTrickle
} from './lib/models/loading-bar.types';
