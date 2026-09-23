# Changelog

## [22.2.2] - 2026-09-23

### Changed

- **The Angular peer range now says what the code needs, not a number somebody picked.** It asked
  for `>=21.0.0`, which nothing in this package justified. The newest Angular API the source uses is
  input(), which shipped in 17.1, and the partial-Ivy output the Angular linker checks carries no
  marker above it. The range is `>=17.1.0`, so applications on those versions can install this
  library instead of being turned away by a range that was never measured.
- **The floor is derived and checked from now on.** `npm run peers:floors` works it out from three
  things that can be verified — the Angular APIs the source calls, the `minVersion` markers in the
  compiled output, and the Angular types that reach the published `.d.ts` — and CI fails when a
  declaration drifts away from it again.

## [22.2.1] - 2026-09-16

### Changed

- The repository moved to the `hub-env` organization. Issues for every Hub UI package are now
  gathered in [hub-env/hub-ui](https://github.com/hub-env/hub-ui/issues), and the `repository`, `bugs`
  and README links point at the new addresses. GitHub redirects the old ones.

## [22.2.0] - 2026-09-08

### Changed

- **`<hub-loading>` and `<hub-loading-bar>` keep their stylesheets to themselves.** Both shipped with
  `ViewEncapsulation.None`, and the reason recorded for it no longer held. Two things were claimed:
  that a global stylesheet has to be able to retheme them, and that the overlay
  `HubLoadingService` mounts on `document.body` would otherwise go unpainted. The first is answered
  by the tokens, not by the encapsulation mode — they are declared on the host at zero specificity
  (`:where(:host)`), a custom property inherits down to every element inside, and a rule you write
  against `.hub-loading` still reaches the host from your own sheet, because the class is on the
  host element. The second was simply not true: the service mounts a real `HubLoadingComponent`
  through `createComponent()`, so the overlay carries the component's own marker attribute and its
  stylesheet with it. `BREAKING_CHANGES.md` records what does change.
- **The bar's RTL rule is written as `:host-context([dir='rtl'])`.** It was a hand-written pair —
  `[dir='rtl'] .hub-loading-bar` for the attribute on an ancestor, `.hub-loading-bar[dir='rtl']` for
  the attribute on the bar itself — because `dir` is inherited and both spellings are legitimate.
  `:host-context()` is exactly that pair, and under emulated encapsulation Angular now compiles it,
  which it never did while the component was unencapsulated. Same behaviour, one selector.

### Added

- **`ng-hub-ui-ds` is declared as an optional peer dependency** (`>=22.0.0`). Both stylesheets have
  always resolved their defaults through the `--hub-sys-*` / `--hub-ref-*` ladder, and nothing in
  the manifest said so — so a consumer reading the package on npm could not tell that installing the
  token package is what hands the indicator and the bar the family palette and its dark mode. It
  stays optional: every token carries a literal fallback and the library renders without it.

## [22.1.1] - 2026-09-06

### Added

- Both READMEs now document the loading bar's own BEM classes, and a new *Right-to-left* section explains that the `indeterminate` sweep reverses under `[dir='rtl']` so it travels with the text. Both have worked since 22.1.0 with nothing in the documentation to find them by, which is the same as not having them.

### Changed

- `rxjs` is now declared as a peer dependency. `hubLoadingBarInterceptor` imports `finalize` from it on the published path, and without the declaration a strict installer — pnpm with hoisting turned off — has no reason to resolve rxjs for this package. Nothing changes under npm or yarn, where rxjs arrives hoisted as a peer of `@angular/core`.

### Fixed

- The Angular badge and the opening line of both READMEs say 21+, the range `package.json` has always declared. Claiming 22+ turned an application on Angular 21 away from a library that supports it.
- `HubLoadingService.isLoading` is described as what it computes — the reference counter, not the mounted overlay. The README contradicted itself: its own SSR section already explained that on the server the counter runs while the mount is skipped.
- `FUNCTIONALITIES.md` marks `hub-loading`'s `ariaLabel` as covered, which the Inline playground control has made true since the page shipped, and adds the bar's RTL row so the file stops omitting behaviour the stylesheet has.
- Calling `HubLoadingService.hide()`, `HubLoadingBarService.complete()` or `HubLoadingBarService.inc()` from inside an `effect()` no longer subscribes that effect to the service's internal state. Each of those paths read a signal tracked to decide what to do next — the counter, whether the bar is on screen, the current fill — so the caller's effect woke up on state it does not own: anyone else's `show()` re-ran it and retired a reference it never registered, and `inc()` re-entered itself on every step. `HubLoadingBarService` already documented the hazard and guarded its counter; the same `untracked` read now covers the three places that were left out.
- The `indeterminate` sweep reverses when `dir="rtl"` sits on the bar itself, not only on an ancestor. The rule was written as `[dir='rtl'] .hub-loading-bar`, a descendant combinator, and the host element is the one that carries the class — so `<hub-loading-bar dir="rtl">` kept sweeping left to right and the fragment left the track instead of crossing it.

## [22.1.0] - 2026-09-05

### Added

- `HubLoadingBarComponent` (`hub-loading-bar`), the thin page-progress strip that sits under the navbar. Three placements from one element: `inline` in the document flow, reserving its own row so nothing shifts when it appears; `overlay` against the nearest positioned ancestor, which is how it hangs off a navbar's lower edge; and `fixed` to the viewport at `--hub-loading-bar-offset`, for a navbar that is itself fixed.
- `HubLoadingBarService`, the shared page-progress state. Callers are reference-counted, so a navigation and the requests its page fires cannot take the bar down from under each other — it completes when the last one does.
- An anti-flicker grace period (`delay`, 100 ms): work that finishes inside it never paints a bar at all. A cached route that flashes a progress bar for 40 ms reads as a glitch, not as speed. Setting it to `0` reveals the bar synchronously, so an application that opts out of the grace period still sees it for a navigation that settles inside its own task.
- A trickle that decelerates as it fills and stops at `max` (99). Nothing knows the real percentage of a page load, so only `complete()` may show 100%. The curve is `trickleFn`, swappable per application, and the default is exported as `hubLoadingBarTrickle()`.
- Determinate mode through the `progress` input, whose three states are the whole contract: unbound follows the service, a number drives the bar and is published as `aria-valuenow`, and `null` hides it. Plus an `indeterminate` sweep for work with no measurable progress.
- Accessibility contract on the bar: `role="progressbar"` with static bounds, a configurable `ariaLabel`, and `aria-hidden` while it is not painted. `aria-valuenow` is withheld whenever the number is invented — which is how ARIA marks an indeterminate progressbar, and better than announcing a made-up percentage.
- `provideHubLoadingBarRouter()`, which runs the bar for exactly the length of a navigation, including one a guard rejects and one an error ends. Navigations are tracked with a flag rather than by pairing events one for one, so a `NavigationStart` missed during bootstrap cannot strand an unmatched `complete()`.
- `hubLoadingBarInterceptor`, holding one reference for the lifetime of every HTTP request and balancing it in `finalize`, so an error or a cancelled request releases it too. `withoutHubLoadingBar()` and `HUB_LOADING_BAR_SKIP` take a poll or a heartbeat out of the count.
- `provideHubLoadingBar()` and the `HUB_LOADING_BAR_CONFIG` / `HUB_LOADING_BAR_DEFAULT_CONFIG` exports, re-basing the defaults application-wide for the component, the service and both integrations.
- Thirteen `--hub-loading-bar-*` CSS custom properties and the `hub-loading-bar-theme()` Sass mixin, shipped alongside `hub-loading-theme()` at `ng-hub-ui-loading/styles`.
- `prefers-reduced-motion` treatment that slows the `indeterminate` sweep while leaving the determinate fill alone — the fill is the value being reported, not decoration, and freezing it would leave a bar that says nothing.

### Changed

- `@angular/router` is declared as an **optional** peer dependency. Only `provideHubLoadingBarRouter()` touches it; every other export works without a router.

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
