import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	ViewEncapsulation
} from '@angular/core';
import { resolveHubAccent } from 'ng-hub-ui-utils';
import { HUB_LOADING_CONFIG } from '../../loading-config';
import { HubLoadingImageAnimation, HubLoadingMode, HubLoadingSize, HubLoadingVariant } from '../../models/loading.types';

/**
 * Activity indicator rendered inline, over its container or over the viewport.
 *
 * Every input defaults to the injected `HUB_LOADING_CONFIG`, so `provideHubLoading()`
 * re-bases an entire application (brand image, variant, translated label) without
 * touching a single template, while a per-instance binding still wins locally.
 *
 * Styles are unencapsulated on purpose: the host carries the `hub-loading` class and
 * the token block, so consumers can retheme the indicator from a global stylesheet —
 * and so the service-mounted overlay, created outside any component's style scope,
 * is still painted.
 *
 * @example
 * ```html
 * <hub-loading variant="dots" message="Loading orders…" />
 *
 * <div style="position: relative">
 *   <hub-loading mode="overlay" color="primary" />
 * </div>
 * ```
 */
@Component({
	selector: 'hub-loading',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	templateUrl: './loading.component.html',
	styleUrl: './loading.component.scss',
	host: {
		class: 'hub-loading',
		role: 'status',
		'aria-live': 'polite',
		'aria-busy': 'true',
		'[class]': '_modifierClasses()',
		'[class.hub-loading--backdrop]': '_showsBackdrop()',
		'[attr.aria-label]': 'ariaLabel()',
		'[style.--hub-loading-accent]': '_accent()'
	}
})
export class HubLoadingComponent {
	/** Application-wide defaults; also the source of every input's default value. */
	private readonly config = inject(HUB_LOADING_CONFIG);

	/**
	 * Placement of the indicator. `overlay` needs a positioned ancestor to cover;
	 * `fullscreen` is fixed to the viewport and layered at `--hub-loading-z-index`.
	 */
	readonly mode = input<HubLoadingMode>('inline');

	/** Built-in CSS indicator rendered when no {@link image} is supplied. */
	readonly variant = input<HubLoadingVariant>(this.config.variant);

	/** URL or data URI shown instead of the built-in indicator. */
	readonly image = input<string | null>(this.config.image);

	/** Motion applied to {@link image}; inert while no image is set. */
	readonly imageAnimation = input<HubLoadingImageAnimation>(this.config.imageAnimation);

	/** Text rendered below the indicator. */
	readonly message = input<string | null>(this.config.message);

	/** Size step feeding `--hub-loading-size`; the token remains overridable on its own. */
	readonly size = input<HubLoadingSize>(this.config.size);

	/**
	 * Accent for the indicator. Accepts a semantic name (`primary`), a CSS colour
	 * literal (`#0d6efd`, `oklch(...)`) or a `var(...)` reference — normalised by
	 * `resolveHubAccent()` into the single `--hub-loading-accent` slot.
	 */
	readonly color = input<string | null>(this.config.color);

	/** Paints the translucent scrim. Ignored in `inline` mode, which covers nothing. */
	readonly backdrop = input(this.config.backdrop, { transform: booleanAttribute });

	/** Accessible label announced by the host's `role="status"` live region. */
	readonly ariaLabel = input<string>(this.config.ariaLabel);

	/** Mode and size modifiers; kept as one binding so a size change cannot drop the mode. */
	protected readonly _modifierClasses = computed(() => `hub-loading--${this.mode()} hub-loading--${this.size()}`);

	/**
	 * The scrim only exists where the indicator actually covers something, so an
	 * inline block never paints a background it would have no reason to own.
	 */
	protected readonly _showsBackdrop = computed(() => this.backdrop() && this.mode() !== 'inline');

	/**
	 * Single accent slot consumed by the stylesheet. `null` leaves the binding off
	 * entirely, so the token's own cascade default stays in effect.
	 */
	protected readonly _accent = computed(() => resolveHubAccent(this.color()));

	/** Motion modifier for the branding image; `none` adds no class at all. */
	protected readonly _imageClasses = computed(() =>
		this.imageAnimation() === 'none' ? '' : `hub-loading__image--${this.imageAnimation()}`
	);
}
