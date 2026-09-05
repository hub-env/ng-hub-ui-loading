/**
 * Where the bar is placed relative to the document.
 *
 * `inline` takes part in normal flow and reserves its own strip, so the page never
 * shifts when the bar appears; `overlay` is absolutely positioned against the nearest
 * positioned ancestor — the classic "hanging off the bottom edge of a navbar" case, and
 * the consumer owns that containing block; `fixed` pins the bar to the viewport, offset
 * by `--hub-loading-bar-offset` so it can sit under a navbar that is itself fixed.
 */
export type HubLoadingBarMode = 'inline' | 'overlay' | 'fixed';

/** Which edge the `overlay` and `fixed` modes attach to; ignored by `inline`. */
export type HubLoadingBarPlacement = 'top' | 'bottom';

/**
 * Function deciding how much to advance on each trickle tick.
 *
 * Page loads have no honest percentage — the browser does not know how many bytes are
 * left, and a resolver knows even less. The bar therefore advances in steps that shrink
 * as it fills, so it always seems to be moving while never reaching the end on its own.
 *
 * @param progress - Current value, 0–100.
 * @returns Amount to add, in the same 0–100 scale. Return `0` to stall.
 */
export type HubLoadingBarTrickle = (progress: number) => number;

/**
 * Application-wide defaults for the loading bar.
 *
 * Fully resolved (no optional members) so the component, the service and the
 * integrations read a value without re-implementing the fallback chain at each call site.
 * Durations are milliseconds; progress values are on a 0–100 scale.
 */
export interface HubLoadingBarConfig {
	/**
	 * Value the bar jumps to the instant it appears.
	 *
	 * Never zero: a bar that starts empty reads as a bar that is not working. The jump is
	 * the acknowledgement that the request was received.
	 */
	min: number;

	/**
	 * Ceiling the trickle may not cross.
	 *
	 * Below 100 on purpose. Only {@link HubLoadingBarService.complete} knows the work is
	 * actually done, so a trickle that reached 100 would promise an ending it cannot
	 * deliver and then sit there, full and lying.
	 */
	max: number;

	/** Milliseconds between trickle ticks. */
	trickleSpeed: number;

	/** Whether the bar advances on its own while it waits. */
	trickle: boolean;

	/** Step function driving each tick; see {@link HubLoadingBarTrickle}. */
	trickleFn: HubLoadingBarTrickle;

	/**
	 * Grace period before the bar is painted at all.
	 *
	 * Work that finishes inside this window never shows a bar. A 40 ms navigation that
	 * flashes a progress bar looks broken, not fast — this is what keeps a cached route
	 * from flickering.
	 *
	 * `0` reveals the bar synchronously rather than on the next macrotask, so a caller who
	 * opted out of the grace period still sees it for work that settles within its own task.
	 */
	delay: number;

	/**
	 * How long the completed bar stays on screen at 100% before it fades away.
	 *
	 * Wants to be at least `--hub-loading-bar-speed`, or the bar is dismissed before its
	 * own fill animation has arrived at the end.
	 */
	completeDelay: number;

	/** Default accent: a semantic name, a colour literal or a `var(...)` reference. */
	color: string | null;

	/** Whether the leading edge carries the soft glow that suggests motion. */
	glow: boolean;

	/** Accessible name announced through `role="progressbar"`. */
	ariaLabel: string;
}
