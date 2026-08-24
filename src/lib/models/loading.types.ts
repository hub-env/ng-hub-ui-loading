/**
 * Where the indicator is placed relative to the document.
 *
 * `overlay` positions absolutely, so the **parent must establish a containing
 * block** (`position: relative`); `fullscreen` is fixed to the viewport and is
 * what {@link HubLoadingService} mounts on `document.body`.
 */
export type HubLoadingMode = 'inline' | 'overlay' | 'fullscreen';

/** Built-in pure-CSS activity indicators, so the library ships no image assets. */
export type HubLoadingVariant = 'spinner' | 'dots' | 'bars' | 'pulse' | 'ring';

/** Size step mapped to `--hub-loading-size`; the token stays overridable on its own. */
export type HubLoadingSize = 'sm' | 'md' | 'lg';

/** Motion applied to a branding image that replaces the built-in indicator. */
export type HubLoadingImageAnimation = 'none' | 'spin' | 'pulse';

/**
 * Per-call presentation options accepted by {@link HubLoadingService}.
 *
 * Every field is optional: omitted values fall back to the application-wide
 * {@link HubLoadingConfig}, so a caller only states what it wants to change.
 * `mode` is deliberately absent — the service always renders fullscreen.
 */
export interface HubLoadingOptions {
	/** Text rendered under the indicator; `null` renders no message. */
	message?: string | null;

	/** Which built-in indicator to render when no {@link image} is supplied. */
	variant?: HubLoadingVariant;

	/** URL or data URI replacing the built-in indicator with a brand mark. */
	image?: string | null;

	/** Motion applied to {@link image}; ignored when no image is set. */
	imageAnimation?: HubLoadingImageAnimation;

	/** Size step driving `--hub-loading-size`. */
	size?: HubLoadingSize;

	/** Accent colour: a semantic name, a hex/`oklch()` literal or a `var(...)` reference. */
	color?: string | null;

	/** Paints the translucent scrim; honoured in overlay and fullscreen modes only. */
	backdrop?: boolean;

	/** Accessible label announced through `role="status"`. */
	ariaLabel?: string;
}

/**
 * Application-wide defaults for every loading indicator.
 *
 * Fully resolved (no optional members) so the component and the service can read
 * a value without re-implementing the fallback chain at each call site.
 */
export interface HubLoadingConfig {
	/** Default text under the indicator. */
	message: string | null;

	/** Default built-in indicator. */
	variant: HubLoadingVariant;

	/** Default branding image, if the whole application uses one. */
	image: string | null;

	/** Default motion for the branding image. */
	imageAnimation: HubLoadingImageAnimation;

	/** Default size step. */
	size: HubLoadingSize;

	/** Default accent colour, or `null` to keep the stylesheet's own accent. */
	color: string | null;

	/** Default scrim visibility for overlay and fullscreen modes. */
	backdrop: boolean;

	/** Default accessible label. */
	ariaLabel: string;
}
