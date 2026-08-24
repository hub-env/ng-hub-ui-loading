# Changelog

## [22.0.0] - 2026-08-24

### Added

- `HubLoadingComponent` (`hub-loading`), a standalone `OnPush` block with signal inputs that renders in three modes from a single element: `inline` in the document flow, `overlay` absolutely positioned over its parent, and `fullscreen` fixed to the viewport.
- Five pure-CSS activity indicators — `spinner`, `dots`, `bars`, `pulse` and `ring` — with no JavaScript animation loop and no icon or SVG dependency.
- Optional `image` input that replaces the built-in indicator with a logo or any URL / data URI, animated with `imageAnimation` (`none`, `spin`, `pulse`).
- Optional `message` under the indicator plus an `<ng-content>` slot rendered below it for extra context or an escape hatch.
- `size` steps (`sm`, `md`, `lg`) mapped onto `--hub-loading-size`, and a `color` input accepting a semantic accent name, a literal colour or a `var(...)` reference through `resolveHubAccent()` from `ng-hub-ui-utils`.
- `backdrop` toggle for the translucent layer behind the indicator in the `overlay` and `fullscreen` modes.
- Accessibility contract on the block: `role="status"`, `aria-live="polite"`, `aria-busy="true"` and a configurable `ariaLabel`, with the indicator and the branding image marked decorative so nothing is announced twice.
- `prefers-reduced-motion` treatment that calms the animation instead of freezing it — a frozen loader reads as a hung UI — by slowing the cycle and swapping every rotation or scale for a plain fade.
- `HubLoadingService`, which mounts a single fullscreen overlay on `document.body` with reference-counted `show()` / `hide()`, plus `hideAll()`, in-place `update()` and an `isLoading` signal. Only the DOM mount is skipped where there is no DOM, so it is safe to call during server-side rendering and `isLoading` stays truthful.
- `provideHubLoading()` and the `HUB_LOADING_CONFIG` / `HUB_LOADING_DEFAULT_CONFIG` exports, which re-base the defaults application-wide for the service and for every `<hub-loading>` written in a template.
- Eleven `--hub-loading-*` CSS custom properties following the design-system token ladder, and the `hub-loading-theme()` Sass mixin shipped as a package asset for one-call re-skinning.
