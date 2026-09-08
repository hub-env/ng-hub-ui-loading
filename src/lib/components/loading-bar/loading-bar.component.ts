import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { resolveHubAccent } from 'ng-hub-ui-utils';
import { HUB_LOADING_BAR_CONFIG } from '../../loading-bar-config';
import { HubLoadingBarMode, HubLoadingBarPlacement } from '../../models/loading-bar.types';
import { HubLoadingBarService } from '../../services/loading-bar.service';

/**
 * The thin strip that reports page-level progress — the bar under the navbar.
 *
 * By default the component draws whatever {@link HubLoadingBarService} is doing, which is
 * what makes a single `<hub-loading-bar />` in the shell enough for the whole
 * application: the router integration and the HTTP interceptor drive the service, and
 * this element follows. Bind `progress` to take it over instead, for a bar reporting one
 * known quantity — an upload, an import — independently of everything else.
 *
 * The `progress` input therefore has three meanings, and the difference matters:
 * unbound (`undefined`) follows the service; a number drives the bar directly; `null`
 * hides it. This mirrors how `HubLoadingService` already reads `undefined` as "leave it
 * alone" and `null` as "clear it".
 *
 * Note the deliberate gap in the accessibility contract. While the service is trickling,
 * the number on screen is invented — nothing knows the real percentage of a page load —
 * so `aria-valuenow` is withheld, which is exactly how ARIA spells an indeterminate
 * progressbar. Announcing a made-up "43%" would be worse than announcing nothing. The
 * value is published only when a caller has bound a real one.
 *
 * Every `--hub-loading-bar-*` token is declared on the host at zero specificity, so a
 * consumer retheming the bar from a global stylesheet wins without out-specifying anything.
 *
 * @example
 * ```html
 * <!-- Hanging off the bottom edge of a navbar, driven by the service -->
 * <nav class="navbar position-relative">
 *   …
 *   <hub-loading-bar mode="overlay" placement="bottom" />
 * </nav>
 *
 * <!-- Reporting one known quantity -->
 * <hub-loading-bar [progress]="uploaded()" color="success" />
 * ```
 */
@Component({
	selector: 'hub-loading-bar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './loading-bar.component.html',
	styleUrl: './loading-bar.component.scss',
	host: {
		class: 'hub-loading-bar',
		role: 'progressbar',
		'aria-valuemin': '0',
		'aria-valuemax': '100',
		'[class]': '_modifierClasses()',
		'[class.hub-loading-bar--visible]': '_visible()',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.aria-valuenow]': '_announcedValue()',
		'[attr.aria-hidden]': '_visible() ? null : "true"',
		'[style.--hub-loading-bar-progress]': '_fill()',
		'[style.--hub-loading-bar-accent]': '_accent()'
	}
})
export class HubLoadingBarComponent {
	/** Application-wide defaults; also the source of every input's default value. */
	private readonly config = inject(HUB_LOADING_BAR_CONFIG);

	/** The shared page-level state this bar renders unless `progress` is bound. */
	private readonly service = inject(HubLoadingBarService);

	/**
	 * Placement of the strip. `overlay` needs a positioned ancestor to attach to;
	 * `fixed` pins it to the viewport at `--hub-loading-bar-offset`.
	 */
	readonly mode = input<HubLoadingBarMode>('inline');

	/** Edge the `overlay` and `fixed` modes attach to; `inline` ignores it. */
	readonly placement = input<HubLoadingBarPlacement>('top');

	/**
	 * Takes the bar over. Leave it unbound to follow {@link HubLoadingBarService}; bind a
	 * number (0–100) to drive it directly, or `null` to hide it.
	 */
	readonly progress = input<number | null | undefined>(undefined);

	/**
	 * Sweeps a fragment back and forth instead of filling.
	 *
	 * The honest choice when there is no percentage worth inventing — a long stream, a
	 * job with no reported stages.
	 */
	readonly indeterminate = input(false, { transform: booleanAttribute });

	/** Soft glow trailing the leading edge, which is what reads as movement. */
	readonly glow = input(this.config.glow, { transform: booleanAttribute });

	/**
	 * Accent for the fill. Accepts a semantic name (`primary`), a CSS colour literal or a
	 * `var(...)` reference — normalised by `resolveHubAccent()` into the single
	 * `--hub-loading-bar-accent` slot.
	 */
	readonly color = input<string | null>(this.config.color);

	/** Accessible name for the host's `role="progressbar"`. */
	readonly ariaLabel = input<string>(this.config.ariaLabel);

	/** Whether a caller has taken the bar over rather than following the service. */
	private readonly _manual = computed(() => this.progress() !== undefined);

	/** Current fill, from whichever source is in charge. */
	private readonly _value = computed(() => (this._manual() ? (this.progress() ?? 0) : this.service.progress()));

	/** Whether the strip is painted at all. */
	protected readonly _visible = computed(() => (this._manual() ? this.progress() !== null : this.service.isVisible()));

	/** Fill as a CSS length, consumed by the stylesheet's single runtime slot. */
	protected readonly _fill = computed(() => `${this._value()}%`);

	/**
	 * The value published to assistive technology: only ever a real one.
	 *
	 * `null` removes the attribute, which is how ARIA marks a progressbar indeterminate —
	 * the correct answer both while the service trickles an invented number and while the
	 * `indeterminate` sweep is running. A bar that is not painted publishes nothing either:
	 * the host is `aria-hidden` by then, so a stale value would only ever be misleading.
	 */
	protected readonly _announcedValue = computed(() =>
		this._visible() && this._manual() && !this.indeterminate() ? this._value() : null
	);

	/** Mode and placement modifiers; kept as one binding so neither can drop the other. */
	protected readonly _modifierClasses = computed(() => {
		const classes = [`hub-loading-bar--${this.mode()}`];

		if (this.mode() !== 'inline') {
			classes.push(`hub-loading-bar--${this.placement()}`);
		}
		if (this.indeterminate()) {
			classes.push('hub-loading-bar--indeterminate');
		}
		if (this.glow()) {
			classes.push('hub-loading-bar--glow');
		}

		return classes.join(' ');
	});

	/**
	 * Single accent slot consumed by the stylesheet. `null` leaves the binding off
	 * entirely, so the token's own cascade default stays in effect.
	 */
	protected readonly _accent = computed(() => resolveHubAccent(this.color()));
}
