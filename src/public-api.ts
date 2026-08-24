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
