import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	effect,
	ElementRef,
	inject,
	input,
	PLATFORM_ID
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
 * Every `--hub-loading-*` token is declared on the host at zero specificity, so a
 * consumer retheming the indicator from a global stylesheet wins without having to
 * out-specify anything. The overlay `HubLoadingService` mounts on `document.body` is a
 * regular instance of this component, so it carries the same stylesheet with it.
 *
 * A `fullscreen` indicator moves to `<body>` for the same reason the service mounts there —
 * see {@link appendTo}.
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
	 * `fullscreen` is fixed to the viewport, layered at `--hub-loading-z-index`, and moved to
	 * {@link appendTo} so neither of those is decided by an ancestor.
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

	/**
	 * CSS selector of the element a `fullscreen` indicator is re-parented to; `null` leaves it
	 * where the template declares it.
	 *
	 * `position: fixed` measures from the viewport only while no ancestor applies layout
	 * containment, a transform or a filter, and it paints over the page only while no ancestor
	 * opens a stacking context. A shell cannot promise either — `<hub-side-panel-container>`
	 * opens one on purpose, and any card with a `transform` breaks the first — so an indicator
	 * declared deep in a page covered its own corner of it rather than the window. Leaving the
	 * subtree is the only fix that does not depend on what every ancestor happens to declare, and
	 * it is what the family already does with anything that has to float (a select panel, the
	 * service's own overlay). `inline` and `overlay` are never moved: they exist to sit where the
	 * consumer put them.
	 *
	 * A selector that matches nothing leaves the indicator in place rather than guessing at
	 * another parent.
	 */
	readonly appendTo = input<string | null>('body');

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

	constructor() {
		const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
		const document = inject(DOCUMENT);
		const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

		/** Where the template put the node, remembered on the first move so it can be put back. */
		let home: { parent: Node; before: Node | null } | null = null;

		effect(() => {
			const selector = this.mode() === 'fullscreen' ? this.appendTo() : null;

			// The server renders the indicator where it is written; hydration finds it there and
			// the move happens once on the client, after the first change detection.
			if (!isBrowser) {
				return;
			}

			const target = selector ? document.querySelector(selector) : null;

			if (!target) {
				if (home) {
					// The anchor may be gone if the surrounding view was rebuilt, and inserting
					// before a node that moved throws; appending to the old parent still lands the
					// indicator back in the block it came from.
					home.parent.insertBefore(host, home.before?.parentNode === home.parent ? home.before : null);
					home = null;
				}
				return;
			}

			if (target === host.parentNode) {
				return;
			}

			if (host.parentNode) {
				home ??= { parent: host.parentNode, before: host.nextSibling };
			}
			target.appendChild(host);
		});

		inject(DestroyRef).onDestroy(() => {
			// Angular removes the host node it created, but this one no longer hangs from the view
			// being torn down, so nothing else would take it off the page.
			if (home) {
				host.remove();
			}
		});
	}
}
