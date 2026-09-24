# ng-hub-ui-loading

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-loading.svg)](https://www.npmjs.com/package/ng-hub-ui-loading)
[![Angular](https://img.shields.io/badge/Angular-21%2B-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-loading.svg)](LICENSE)

Standalone loading block for Angular 21+ — an inline indicator, an overlay pinned over the container that is busy, or a fullscreen curtain, from a single `<hub-loading>` element. Five pure-CSS indicators, an optional logo or image instead of them, an optional message, and a counter-based `HubLoadingService` for the app-wide fullscreen case. Alongside it, `<hub-loading-bar>` — the thin page-progress strip that sits under the navbar, wired to the router and to `HttpClient`. Zero external dependencies; every colour and dimension is a `--hub-loading-*` CSS custom property.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/loading/overview/
- Live examples: https://hubui.dev/en/loading/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI on GitHub (issues, roadmap and contributing): https://github.com/hub-env/hub-ui

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-badges**](https://www.npmjs.com/package/ng-hub-ui-badges)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-buttons**](https://www.npmjs.com/package/ng-hub-ui-buttons)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-icons**](https://www.npmjs.com/package/ng-hub-ui-icons)
- [**ng-hub-ui-loading**](https://www.npmjs.com/package/ng-hub-ui-loading) ← You are here
- [**ng-hub-ui-metrics**](https://www.npmjs.com/package/ng-hub-ui-metrics)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-signature**](https://www.npmjs.com/package/ng-hub-ui-signature)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Table of Contents

- [📦 Description](#-description)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🎯 Modes](#-modes)
- [🎛️ Variants](#️-variants)
- [🖼️ Image and Branding](#️-image-and-branding)
- [🧰 Programmatic API](#-programmatic-api)
- [📊 Page Progress Bar](#-page-progress-bar)
- [📖 API Reference](#-api-reference)
- [🎨 Styling / CSS Variables](#-styling--css-variables)
- [♿ Accessibility](#-accessibility)
- [🖥️ Server-Side Rendering](#️-server-side-rendering)
- [📦 Peer Dependencies](#-peer-dependencies)
- [📊 Changelog](#-changelog)
- [🤝 Contribution](#-contribution)
- [☕ Support](#-support)
- [📄 License](#-license)

## 📦 Description

`ng-hub-ui-loading` fills the gap between the family's other "something is happening"
primitives and the spinner that used to be trapped inside a button: a standalone block
that shows an activity indicator, an optional image or logo and an optional message,
and that can render in flow, over its own container, or over the whole viewport.

### When to reach for which library

| Package                                                                  | Use it when                                                                                                                                                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ng-hub-ui-loading`**                                                  | You cannot say how far along the work is, and the shape of the result does not matter yet. An activity indicator — in place, over the busy container, or over the whole app. |
| [`ng-hub-ui-skeleton`](https://www.npmjs.com/package/ng-hub-ui-skeleton) | You already know the shape of what is coming and want the layout to hold its place — structural shimmer placeholders instead of a spinner.                                   |
| [`ng-hub-ui-metrics`](https://www.npmjs.com/package/ng-hub-ui-metrics)   | You know the progress figure — a determinate progress bar, meter or ring that reports a value.                                                                               |

> **`<hub-loading-bar>` versus `<hub-progress>`.** They look alike and answer different questions. `hub-progress`, in `ng-hub-ui-metrics`, _displays a value you already know_: it is a data component, and its number is true. `hub-loading-bar` reports that something is happening when nobody knows how long it will take — it invents the number and never lets it reach the end. Use the metrics one for an upload that reports bytes; use this one for the strip under the navbar.

The three compose: a skeleton for the list that is arriving, a `<hub-loading mode="overlay">`
over the panel being refreshed, and a `<hub-progress>` for the upload that reports bytes.

## ✨ Features

- **Three modes in one component** — `inline`, container `overlay` and viewport `fullscreen`.
- **Five pure-CSS indicators** — `spinner`, `dots`, `bars`, `pulse` and `ring`; no JavaScript animation loop, no SVG sprite, no icon font.
- **Image / logo support** — swap the indicator for your own brand asset and animate it with `spin` or `pulse`.
- **Optional message and projected content** — a caption under the indicator plus an `<ng-content>` slot for anything else.
- **Programmatic overlays** — `HubLoadingService` mounts a fullscreen `<hub-loading>` on demand, with reference-counted `show()` / `hide()` so concurrent tasks cannot dismiss each other's overlay.
- **Application-wide defaults** — `provideHubLoading()` re-bases every input's default, for the service _and_ for every `<hub-loading>` in a template, without touching a single markup file.
- **Any accent colour** — `color` accepts a semantic design-system name, a hex value, `oklch()` or a `var(...)` reference, resolved through `resolveHubAccent()` from `ng-hub-ui-utils`.
- **CSS-variable theming** — every colour, dimension and speed is a `--hub-loading-*` custom property, with a `hub-loading-theme()` Sass mixin for one-call re-skinning.
- **Accessible by default** — `role="status"`, `aria-live="polite"` and `aria-busy="true"`, with a configurable `ariaLabel` and a `prefers-reduced-motion` treatment that calms the motion instead of freezing it.
- **Page progress bar** — `<hub-loading-bar>`, the thin strip under the navbar: in flow, attached to a positioned ancestor, or fixed to the viewport at an offset you choose.
- **Router and HTTP wiring** — `provideHubLoadingBarRouter()` runs the bar for exactly the length of a navigation (including one a guard rejects), `hubLoadingBarInterceptor` for the lifetime of every request, and `withoutHubLoadingBar()` keeps polls and heartbeats out of the count.
- **A trickle that does not lie** — the bar advances in shrinking steps and stops short of the end, never paints at all for work that finishes inside its grace period, and withholds `aria-valuenow` while the number is invented.
- **Standalone, `OnPush`, signal inputs** — and SSR-safe: on the server the counter still runs, only the DOM mount is skipped.

## 🚀 Quick Start

### 1. Install

```bash
npm install ng-hub-ui-loading ng-hub-ui-utils
```

> **Theming (recommended):** install the shared design tokens so the loading block —
> and every other ng-hub-ui library — reads the same palette and dark-mode colours:
>
> ```bash
> npm install ng-hub-ui-ds
> ```
>
> ```css
> @import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
> ```
>
> It is an **optional** peer dependency: the component ships sensible CSS fallbacks
> and works without it.

### 2. Import the standalone component

```typescript
import { HubLoadingComponent } from 'ng-hub-ui-loading';

@Component({
	standalone: true,
	imports: [HubLoadingComponent],
	template: `
		@if (isLoading()) {
			<hub-loading message="Loading results…" />
		}
	`
})
export class ResultsComponent {
	readonly isLoading = signal(true);
}
```

## 🎯 Modes

The `mode` input decides where the block paints. Everything else — variant, image,
message, size, colour — works identically in all three.

### `inline` (default)

Renders in the document flow, like any other block. Use it inside the empty area it
is standing in for: a panel body, a table placeholder, a card that has not resolved yet.

```html
<hub-loading message="Fetching invoices…" />
```

### `overlay`

Absolutely positioned over its parent, so the stale content stays visible underneath
while the refresh runs.

> The parent must establish a positioning context — give it `position: relative`.

```html
<section class="panel" style="position: relative">
	<article>…already rendered content…</article>

	@if (refreshing()) {
	<hub-loading mode="overlay" variant="ring" message="Refreshing…" />
	}
</section>
```

### `fullscreen`

Fixed to the viewport, covering the application. Declare it in a template when the
component owns the state, or let [`HubLoadingService`](#-programmatic-api) mount it for you.

```html
@if (booting()) {
<hub-loading mode="fullscreen" variant="pulse" message="Starting up…" />
}
```

**It moves to `<body>` to get there.** `position: fixed` only measures from the viewport
while no ancestor applies layout containment, a transform or a filter, and only paints over
the page while no ancestor opens a stacking context — neither of which a page can promise.
Written inside a card with a `transform`, or inside a shell that isolates its stacking
context, the indicator would cover that box instead of the window. So it leaves the subtree,
exactly as `HubLoadingService` and `hub-select` already do.

`appendTo` names the target; it defaults to `'body'`, takes any CSS selector, and takes
`null` to leave the indicator where the template puts it. A selector that matches nothing
also leaves it in place. `inline` and `overlay` are never moved.

```html
<hub-loading mode="fullscreen" appendTo="#overlay-root" /> <hub-loading mode="fullscreen" [appendTo]="null" />
```

> The element moves, the component does not: a `viewChild` still finds it, inputs and
> projected content work as before. What no longer reaches it is a stylesheet rule written
> against an ancestor, and a `--hub-*` token set on an ancestor rather than on `:root`.

### Backdrop

`backdrop` paints the translucent layer behind the indicator. It applies to `overlay`
and `fullscreen` only — an inline block has nothing to cover — and is on by default.

```html
<hub-loading mode="overlay" [backdrop]="false" />
```

## 🎛️ Variants

Five indicators, all drawn with CSS. Pick with the `variant` input.

| Variant   | Shape                                    |
| --------- | ---------------------------------------- |
| `spinner` | Rotating arc (the default).              |
| `dots`    | Three dots pulsing in sequence.          |
| `bars`    | Bars rising and falling.                 |
| `pulse`   | A single expanding, fading disc.         |
| `ring`    | A full ring with a travelling highlight. |

```html
<hub-loading variant="dots" />
<hub-loading variant="bars" size="lg" color="success" />
<hub-loading variant="ring" color="#7c3aed" />
```

`size` picks between `sm`, `md` (default) and `lg`. Each step retunes the tokens rather
than hard-coding dimensions — `--hub-loading-size` (`1.5rem` / `2.5rem` / `4rem`), the
indicator `--hub-loading-thickness` and the message `--hub-loading-font-size` — so any
value outside those three steps is one CSS custom property away:

```css
.hero-loading {
	--hub-loading-size: 6rem;
}
```

`color` accepts a semantic accent name (`primary`, `success`, `brand`…), a literal colour
(`#7c3aed`, `rgb(...)`, `oklch(...)`) or a `var(...)` reference. Barewords resolve to the
design-system token `var(--hub-sys-color-<name>, <name>)`, so unregistered names and CSS
named colours still paint.

## 🖼️ Image and Branding

Set `image` to a URL or a data URI and it replaces the built-in indicator — the usual
case being a product logo on the boot screen. `imageAnimation` gives it motion.

```html
<hub-loading mode="fullscreen" image="/assets/logo.svg" imageAnimation="pulse" message="Preparing your workspace…" />
```

| `imageAnimation` | Effect                       |
| ---------------- | ---------------------------- |
| `none`           | Static image (the default).  |
| `spin`           | Continuous rotation.         |
| `pulse`          | Rhythmic scale/opacity beat. |

Size the asset with `--hub-loading-image-size`, and use `--hub-loading-speed` to keep the
animation in step with the rest of your brand's motion.

Anything projected into the component renders below the message, which is where extra
context or an escape hatch belongs:

```html
<hub-loading mode="fullscreen" message="Importing 12,480 rows…">
	<button type="button" (click)="cancel()">Cancel import</button>
</hub-loading>
```

## 🧰 Programmatic API

`HubLoadingService` covers the case the declarative component cannot: work that starts
in a service, a route guard or an effect, where no template owns the flag. It mounts a
single fullscreen `<hub-loading>` on `document.body` the first time it is needed.

```typescript
import { inject } from '@angular/core';
import { HubLoadingService } from 'ng-hub-ui-loading';

@Injectable({ providedIn: 'root' })
export class ReportService {
	private readonly loading = inject(HubLoadingService);

	async export(): Promise<void> {
		this.loading.show({ message: 'Building the report…' });
		try {
			await this.buildReport();
		} finally {
			this.loading.hide();
		}
	}
}
```

### Reference counting

`show()` increments an internal counter and `hide()` decrements it; the overlay is
destroyed only when the counter reaches zero. Two concurrent tasks can therefore each
call `show()` / `hide()` without the first one to finish tearing down the overlay the
second still needs. `hideAll()` forces the counter to zero — the right call from a
global error handler or a route change, where the pending `hide()` calls may never arrive.

```typescript
this.loading.show(); // counter 1 — overlay appears
this.loading.show(); // counter 2 — same overlay
this.loading.hide(); // counter 1 — overlay stays
this.loading.hide(); // counter 0 — overlay is destroyed
```

The counter is clamped at zero, so a stray extra `hide()` is harmless — it cannot push
the count negative and turn a later `show()` into a no-op.

### Updating a live overlay

`update()` changes the visible overlay in place — typically the message, as a long task
moves through its phases.

```typescript
this.loading.show({ variant: 'ring', message: 'Connecting…' });
this.loading.update({ message: 'Downloading…' });
this.loading.update({ message: 'Almost there…' });
this.loading.hide();
```

Options accumulate rather than replace, and the two empty values mean different things:
an **omitted** key (or `undefined`) leaves the current value alone, while `null` clears it.
`{ message: null }` therefore removes the caption; `{ message: undefined }` keeps it.
The accumulated options are dropped once the counter reaches zero, so the next overlay
never inherits a stale message from a finished operation.

`isLoading` is a signal, so the rest of the application can react to the same state:

```typescript
readonly busy = this.loading.isLoading; // Signal<boolean>
```

### Defaults with `provideHubLoading()`

Register the provider once to re-base the defaults for the whole application — the brand
image, the preferred variant, a translated label — instead of repeating them at each call
site. It reaches **both** consumers: the service's overlays _and_ every `<hub-loading>`
written in a template, because each component input falls back to the same configuration.
A per-instance binding still wins locally, and individual `show()` / `update()` options are
merged on top.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHubLoading } from 'ng-hub-ui-loading';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHubLoading({
			variant: 'ring',
			color: 'brand',
			backdrop: true,
			ariaLabel: 'Loading, please wait'
		})
	]
};
```

The configuration is backed by the `HUB_LOADING_CONFIG` injection token, which you can
provide directly if you need to compute it from another dependency. Its unconfigured
value is exported as `HUB_LOADING_DEFAULT_CONFIG` — the same values listed as each input's
default below.

## 📊 Page Progress Bar

`<hub-loading-bar>` is the other half of "something is happening": not _this region is
busy_, but _the page itself is on its way_. It is the thin strip you already know from
under a navbar, and it is driven by `HubLoadingBarService`.

### The three decisions that make it believable

- **It counts its callers.** A navigation and the three requests the page fires on arrival
  are four references. The bar finishes when the last one does, not the first — with a
  boolean, the fastest request would take the bar down while the page was still empty.
- **It waits before painting anything.** Work that finishes inside `delay` (100 ms by
  default) never shows a bar at all. A cached route that flashes a progress bar for 40 ms
  reads as a glitch, not as speed.
- **Its trickle never arrives.** Nothing here knows the real percentage, so the bar
  advances in steps that shrink as it fills and stops at `max` (99). Only `complete()` may
  show 100%, because only `complete()` knows it is true.

### Placement

```html
<!-- Hanging off the bottom edge of a navbar. position: relative on the navbar is what
     confines the bar to it — exactly the contract of <hub-loading mode="overlay">. -->
<nav class="navbar" style="position: relative">
	…
	<hub-loading-bar mode="overlay" placement="bottom" />
</nav>
```

```html
<!-- Under a navbar that is itself fixed: pin the bar to the viewport and push it down. -->
<hub-loading-bar mode="fixed" style="--hub-loading-bar-offset: 56px" />
```

```html
<!-- In the flow. Reserves its own 3px row, so nothing shifts when it appears. -->
<hub-loading-bar />
```

### Wiring it to the page

The two integrations are opt-in and compose through the counter, so neither needs to know
about the other.

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { hubLoadingBarInterceptor, provideHubLoadingBar, provideHubLoadingBarRouter } from 'ng-hub-ui-loading';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(routes),

		// One reference per navigation, released when it settles — including when a guard
		// rejects it or an error ends it, the two cases that normally strand a bar.
		provideHubLoadingBarRouter(),

		// One reference per request. finalize() balances it on success, on error and on
		// cancellation alike, so a cancelled typeahead cannot leave the bar at 90%.
		provideHttpClient(withInterceptors([hubLoadingBarInterceptor])),

		provideHubLoadingBar({ color: 'primary', delay: 120 })
	]
});
```

Without the interceptor the bar finishes the moment the navigation settles — which is when
the component is created, not when its data arrives. With both, it spans the whole wait.

Keep the requests the reader never asked about out of the count, or the bar never finishes:

```typescript
this.http.get('/api/heartbeat', { context: withoutHubLoadingBar() });
```

### Driving it by hand

```typescript
private readonly bar = inject(HubLoadingBarService);

async import(): Promise<void> {
	this.bar.start();
	try {
		await this.api.import();
	} finally {
		this.bar.complete(); // every start() needs exactly one complete()
	}
}
```

When the percentage is real, bind it instead and the bar stops following the service:

```html
<!-- A number drives the bar and is published as aria-valuenow -->
<hub-loading-bar [progress]="uploaded()" color="success" />

<!-- null hides it; leaving the input unbound hands the bar back to the service -->
<hub-loading-bar [progress]="null" />
```

And when there is no percentage worth inventing, sweep instead of filling:

```html
<hub-loading-bar indeterminate [progress]="100" />
```

## 📖 API Reference

### `HubLoadingComponent`

Selector: `hub-loading`. Standalone, `OnPush`, signal inputs.

| Input            | Type                                                 | Default     | Description                                                                                                                                                                                                                                                             |
| ---------------- | ---------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`           | `'inline' \| 'overlay' \| 'fullscreen'`              | `'inline'`  | Where the block paints. `overlay` is absolutely positioned over the parent (which needs `position: relative`); `fullscreen` is fixed to the viewport.                                                                                                                   |
| `variant`        | `'spinner' \| 'dots' \| 'bars' \| 'pulse' \| 'ring'` | `'spinner'` | Which pure-CSS indicator to draw. Ignored when `image` is set.                                                                                                                                                                                                          |
| `image`          | `string \| null`                                     | `null`      | URL or data URI rendered instead of the built-in indicator.                                                                                                                                                                                                             |
| `imageAnimation` | `'none' \| 'spin' \| 'pulse'`                        | `'none'`    | Animation applied to `image`.                                                                                                                                                                                                                                           |
| `message`        | `string \| null`                                     | `null`      | Text rendered under the indicator.                                                                                                                                                                                                                                      |
| `size`           | `'sm' \| 'md' \| 'lg'`                               | `'md'`      | Indicator scale; maps onto `--hub-loading-size`, which always overrides it.                                                                                                                                                                                             |
| `color`          | `string \| null`                                     | `null`      | Accent colour: semantic name, hex, `rgb()`, `oklch()` or `var(...)`. Resolved with `resolveHubAccent()`.                                                                                                                                                                |
| `backdrop`       | `boolean`                                            | `true`      | Translucent layer behind the indicator. Applies to `overlay` and `fullscreen` only. Read with `booleanAttribute`, so the bare `backdrop` attribute also works.                                                                                                          |
| `ariaLabel`      | `string`                                             | `'Loading'` | Accessible name of the status region.                                                                                                                                                                                                                                   |
| `appendTo`       | `string \| null`                                     | `'body'`    | CSS selector of the element a `fullscreen` indicator is re-parented to, so it is not trapped by an ancestor's containment or stacking context. `null` keeps it where it is declared; a selector that matches nothing does the same. Ignored for `inline` and `overlay`. |

This component has no outputs. Content projected into it renders below the message.

> Every default except `mode`'s comes from the injected `HUB_LOADING_CONFIG`. The values in
> the table are the unconfigured ones; `provideHubLoading()` re-bases them application-wide.

### `HubLoadingService`

Injectable (`providedIn: 'root'`). Drives a single fullscreen overlay attached to `document.body`.

| Member      | Signature                               | Description                                                                                                                                                      |
| ----------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `show`      | `(options?: HubLoadingOptions) => void` | Increments the counter and creates the overlay if it is not mounted yet.                                                                                         |
| `hide`      | `() => void`                            | Decrements the counter; destroys the overlay when it reaches zero.                                                                                               |
| `hideAll`   | `() => void`                            | Forces the counter to zero and destroys the overlay.                                                                                                             |
| `update`    | `(options: HubLoadingOptions) => void`  | Applies new options to the visible overlay.                                                                                                                      |
| `isLoading` | `Signal<boolean>`                       | `true` while at least one caller still holds a reference — the counter, not the mount. During server rendering it is truthful even though no overlay is mounted. |

### `provideHubLoading(config?)`

Environment provider that registers the defaults every indicator starts from, through the
`HUB_LOADING_CONFIG` injection token. Omitted keys keep their `HUB_LOADING_DEFAULT_CONFIG`
value.

```typescript
function provideHubLoading(config?: Partial<HubLoadingConfig>): EnvironmentProviders;
```

### `HubLoadingOptions`

The visual options accepted by `show()` and `update()`, and by `provideHubLoading()` as
application-wide defaults. They mirror the component inputs, minus `mode` — a programmatic
overlay is always fullscreen.

| Option           | Type                                                 | Description                             |
| ---------------- | ---------------------------------------------------- | --------------------------------------- |
| `variant`        | `'spinner' \| 'dots' \| 'bars' \| 'pulse' \| 'ring'` | Indicator to draw.                      |
| `image`          | `string \| null`                                     | Image or logo replacing the indicator.  |
| `imageAnimation` | `'none' \| 'spin' \| 'pulse'`                        | Animation applied to `image`.           |
| `message`        | `string \| null`                                     | Text under the indicator.               |
| `size`           | `'sm' \| 'md' \| 'lg'`                               | Indicator scale.                        |
| `color`          | `string \| null`                                     | Accent colour.                          |
| `backdrop`       | `boolean`                                            | Translucent layer behind the indicator. |
| `ariaLabel`      | `string`                                             | Accessible name of the status region.   |

`HubLoadingConfig` is the same shape with every member required — it is what the injection
token holds once resolved.

### `HubLoadingBarComponent`

Selector: `hub-loading-bar`. Standalone, `OnPush`, signal inputs.

| Input           | Type                               | Default     | Description                                                                                                                                                                                                   |
| --------------- | ---------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`          | `'inline' \| 'overlay' \| 'fixed'` | `'inline'`  | Where the strip sits. `inline` reserves its own row in the flow; `overlay` is absolutely positioned against the nearest positioned ancestor; `fixed` is pinned to the viewport at `--hub-loading-bar-offset`. |
| `placement`     | `'top' \| 'bottom'`                | `'top'`     | Edge the `overlay` and `fixed` modes attach to. `inline` ignores it.                                                                                                                                          |
| `progress`      | `number \| null \| undefined`      | `undefined` | Three meanings. Unbound: follow `HubLoadingBarService`. A number (0–100): drive the bar directly, and publish it as `aria-valuenow`. `null`: hide the bar.                                                    |
| `indeterminate` | `boolean`                          | `false`     | Sweep a fragment across instead of filling. Read with `booleanAttribute`, so the bare attribute works.                                                                                                        |
| `glow`          | `boolean`                          | `true`      | Soft glow trailing the leading edge.                                                                                                                                                                          |
| `color`         | `string \| null`                   | `null`      | Accent for the fill: semantic name, hex, `oklch()` or `var(...)`. Resolved with `resolveHubAccent()`.                                                                                                         |
| `ariaLabel`     | `string`                           | `'Loading'` | Accessible name of the progressbar.                                                                                                                                                                           |

This component has no outputs and projects no content.

> Every default except `mode`'s and `placement`'s comes from the injected
> `HUB_LOADING_BAR_CONFIG`; `provideHubLoadingBar()` re-bases them application-wide.

### `HubLoadingBarService`

Injectable (`providedIn: 'root'`). Owns the shared page-progress state that every unbound
`<hub-loading-bar>` renders. Provide it on a component instead to give one bar its own
state.

| Member        | Signature                   | Description                                                                                                          |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `start`       | `() => void`                | Registers one caller. The first begins a cycle — after the grace period, not immediately.                            |
| `complete`    | `() => void`                | Retires one caller. At zero the bar runs to 100% and fades, or disappears unseen if it never got painted.            |
| `completeAll` | `() => void`                | Drops every pending caller and completes the bar at once.                                                            |
| `set`         | `(value: number) => void`   | Moves the bar to an exact value and reveals it without waiting out the grace period. Clamped to 0–100, not to `max`. |
| `inc`         | `(amount?: number) => void` | Advances the bar and reveals it. Without an amount the configured trickle curve decides. Capped at `max`.            |
| `reset`       | `() => void`                | Cancels everything: no completion animation, no pending callers, nothing on screen.                                  |
| `progress`    | `Signal<number>`            | Current fill, 0–100.                                                                                                 |
| `isActive`    | `Signal<boolean>`           | Whether any caller is still waiting — true even during the grace period.                                             |
| `isVisible`   | `Signal<boolean>`           | Whether the bar is actually painted — false during the grace period, still true through the completion tail.         |

### `provideHubLoadingBar(config?)`

Environment provider registering the defaults the bar starts from, through the
`HUB_LOADING_BAR_CONFIG` injection token. Omitted keys keep their
`HUB_LOADING_BAR_DEFAULT_CONFIG` value.

```typescript
function provideHubLoadingBar(config?: Partial<HubLoadingBarConfig>): EnvironmentProviders;
```

### `HubLoadingBarConfig`

| Key             | Type                           | Default                | Description                                                                                                                                                                 |
| --------------- | ------------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `min`           | `number`                       | `8`                    | Value the bar jumps to when it appears. Never zero — an empty bar reads as a bar that is not working.                                                                       |
| `max`           | `number`                       | `99`                   | Ceiling the trickle may not cross, so it cannot promise an ending it does not know about.                                                                                   |
| `trickleSpeed`  | `number`                       | `250`                  | Milliseconds between trickle ticks.                                                                                                                                         |
| `trickle`       | `boolean`                      | `true`                 | Whether the bar advances on its own while it waits.                                                                                                                         |
| `trickleFn`     | `(progress: number) => number` | `hubLoadingBarTrickle` | Step function. The exported default returns 10 / 4 / 2 / 0.5 as the bar fills.                                                                                              |
| `delay`         | `number`                       | `100`                  | Grace period before anything is painted. Work finishing inside it shows no bar. `0` reveals the bar synchronously, so work that settles within its own task is still shown. |
| `completeDelay` | `number`                       | `300`                  | How long the completed bar stays at 100% before fading. Wants to be at least `--hub-loading-bar-speed`.                                                                     |
| `color`         | `string \| null`               | `null`                 | Default accent.                                                                                                                                                             |
| `glow`          | `boolean`                      | `true`                 | Default glow.                                                                                                                                                               |
| `ariaLabel`     | `string`                       | `'Loading'`            | Default accessible name.                                                                                                                                                    |

### `provideHubLoadingBarRouter()`

Environment provider that runs the bar for exactly the length of each navigation, including
one a guard cancels and one an error ends. Navigations are tracked with a flag rather than
by pairing events one for one, so a `NavigationStart` missed during bootstrap cannot leave
an unmatched `complete()` behind.

Requires `@angular/router`, declared as an **optional** peer dependency: nothing else in the
package touches it.

### `hubLoadingBarInterceptor` and `withoutHubLoadingBar()`

A functional `HttpInterceptorFn` that holds one reference for the lifetime of every request,
balanced in `finalize` so an error or a cancellation releases it too. `withoutHubLoadingBar()`
builds the `HttpContext` that takes one request out of the count — reach for it on anything
the reader did not ask for, or the bar never finishes. `HUB_LOADING_BAR_SKIP` is the
underlying `HttpContextToken`.

### Exported types

```typescript
type HubLoadingMode = 'inline' | 'overlay' | 'fullscreen';
type HubLoadingVariant = 'spinner' | 'dots' | 'bars' | 'pulse' | 'ring';
type HubLoadingSize = 'sm' | 'md' | 'lg';
type HubLoadingImageAnimation = 'none' | 'spin' | 'pulse';
```

Also exported: `HubLoadingOptions`, `HubLoadingConfig`, `HUB_LOADING_CONFIG` and
`HUB_LOADING_DEFAULT_CONFIG`.

## 🎨 Styling / CSS Variables

The component declares its token defaults on its own host element at zero specificity
(`:where(:host)`), so any consumer rule wins — and each one climbs the family's ladder: the semantic `--hub-sys-*`
layer first, the `--hub-ref-*` primitive next, a literal last. That is why the block already
matches your theme, and its dark mode, before you override anything. Values with no honest
counterpart in the design system (an indicator's diameter, a loop period, a blur radius)
carry a literal rather than borrowing a `sys` token that means something else.

Styles are encapsulated, and rethemeing from a global stylesheet is unaffected by that: the
`hub-loading` class sits on the host element, so a rule you write against `.hub-loading` reaches
it exactly as before, and a custom property set there inherits down to every element inside.
The overlay `HubLoadingService` mounts on `document.body` is a real component instance created
through `createComponent()`, so it carries this stylesheet with it.

| Variable                      | Default                                                                  | Description                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--hub-loading-accent`        | `var(--hub-sys-color-primary, #0d6efd)`                                  | Indicator colour. What the `color` input writes into.                                                                                                              |
| `--hub-loading-size`          | `2.5rem`                                                                 | Indicator box size. What the `size` input maps onto.                                                                                                               |
| `--hub-loading-thickness`     | `calc(var(--hub-ref-border-width, 1px) * 3)`                             | Stroke width of the `spinner` and `ring` indicators.                                                                                                               |
| `--hub-loading-speed`         | `0.9s`                                                                   | Duration of one animation cycle, for the indicators and the image animations.                                                                                      |
| `--hub-loading-gap`           | `var(--hub-sys-gap-2, var(--hub-ref-space-2, 0.5rem))`                   | Space between indicator, message and projected content.                                                                                                            |
| `--hub-loading-text-color`    | `var(--hub-sys-text-primary, var(--hub-ref-color-gray-900, #212529))`    | Message colour.                                                                                                                                                    |
| `--hub-loading-font-size`     | `var(--hub-ref-font-size-sm, 0.875rem)`                                  | Message font size.                                                                                                                                                 |
| `--hub-loading-backdrop-bg`   | `color-mix(in srgb, var(--hub-sys-surface-page, #fff) 72%, transparent)` | Backdrop background in `overlay` / `fullscreen`. Follows the theme's own page surface, so the scrim is a white veil on light themes and a dark one on dark themes. |
| `--hub-loading-backdrop-blur` | `2px`                                                                    | Backdrop blur radius.                                                                                                                                              |
| `--hub-loading-z-index`       | `var(--hub-sys-zindex-modal, 1055)`                                      | Stack order of the `fullscreen` layer.                                                                                                                             |
| `--hub-loading-image-size`    | `var(--hub-loading-size)`                                                | Rendered size of the `image` asset — it follows the indicator size until you say otherwise.                                                                        |

```css
hub-loading {
	--hub-loading-accent: var(--hub-sys-color-brand);
	--hub-loading-size: 3rem;
	--hub-loading-speed: 1.2s;
	--hub-loading-backdrop-blur: 4px;
}
```

### The `hub-loading-theme()` Sass mixin

For Sass projects, `hub-loading-theme()` re-skins the block in a single include. Every
parameter is optional and defaults to `null`, so only the ones you pass are emitted as
`--hub-loading-*` overrides — the rest keep the component defaults. It is token-based and
self-contained (no Bootstrap dependency).

```scss
@use 'ng-hub-ui-loading/styles' as hub;

.app-shell {
	@include hub.hub-loading-theme(
		$accent: var(--hub-sys-color-brand),
		$size: 3.5rem,
		$speed: 1.2s,
		$backdrop-bg: rgba(15, 23, 42, 0.72),
		$backdrop-blur: 4px
	);
}
```

Available parameters: `$accent`, `$size`, `$thickness`, `$speed`, `$gap`, `$text-color`,
`$font-size`, `$backdrop-bg`, `$backdrop-blur`, `$z-index`, `$image-size`.

### The loading bar's variables

Declared on the bar's own host element (`:where(:host)`), same zero-specificity contract. The two durations
are literals rather than `--hub-sys-transition-*`: the fill has to arrive roughly as the
next trickle tick lands, so it is coupled to `trickleSpeed`, and borrowing the application's
transition scale would let a slow theme leave the bar a tick behind the number it is drawing.

| Variable                                | Default                                 | Description                                                                                              |
| --------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--hub-loading-bar-accent`              | `var(--hub-sys-color-primary, #0d6efd)` | Fill colour. What the `color` input writes into.                                                         |
| `--hub-loading-bar-height`              | `3px`                                   | Thickness of the strip.                                                                                  |
| `--hub-loading-bar-track-bg`            | `transparent`                           | Unfilled track. Transparent so an idle bar draws no permanent line under the navbar.                     |
| `--hub-loading-bar-radius`              | `0`                                     | Corner radius of the strip and its fill.                                                                 |
| `--hub-loading-bar-speed`               | `200ms`                                 | How long the fill takes to catch up with a new value.                                                    |
| `--hub-loading-bar-fade`                | `300ms`                                 | Fade in and out of the whole strip.                                                                      |
| `--hub-loading-bar-easing`              | `linear`                                | Easing of the fill. Linear reads as steady progress rather than as a flourish.                           |
| `--hub-loading-bar-glow-color`          | `var(--hub-loading-bar-accent)`         | Colour of the glow at the leading edge.                                                                  |
| `--hub-loading-bar-glow-blur`           | `10px`                                  | Blur radius of that glow.                                                                                |
| `--hub-loading-bar-glow-spread`         | `1px`                                   | Spread radius of that glow.                                                                              |
| `--hub-loading-bar-indeterminate-speed` | `1.6s`                                  | Period of one `indeterminate` sweep. Calmed under `prefers-reduced-motion`.                              |
| `--hub-loading-bar-offset`              | `0px`                                   | Distance from the edge the `overlay` and `fixed` modes attach to — how far under a navbar the bar hangs. |
| `--hub-loading-bar-z-index`             | `var(--hub-sys-zindex-sticky, 1020)`    | Stack order of the positioned modes. Chrome level, deliberately below dialogs and toasts.                |

```css
hub-loading-bar {
	--hub-loading-bar-accent: var(--hub-sys-color-brand);
	--hub-loading-bar-height: 2px;
	--hub-loading-bar-offset: 56px;
}
```

`hub-loading-bar-theme()` is the matching Sass mixin, with the same optional-parameter
contract as `hub-loading-theme()`.

### BEM classes

The internal structure is stable and addressable, for the cases a token cannot reach:

| Class                                                 | Element                                                                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.hub-loading`                                        | Host block.                                                                                       |
| `.hub-loading--inline` · `--overlay` · `--fullscreen` | Mode modifiers.                                                                                   |
| `.hub-loading--sm` · `--md` · `--lg`                  | Size modifiers; each retunes the size, thickness and font-size tokens.                            |
| `.hub-loading--backdrop`                              | Present only when the scrim is painted (never in `inline` mode).                                  |
| `.hub-loading__indicator`                             | The pure-CSS indicator, plus a `--spinner` / `--dots` / `--bars` / `--pulse` / `--ring` modifier. |
| `.hub-loading__dot` · `.hub-loading__bar`             | The individual parts of the `dots` and `bars` indicators.                                         |
| `.hub-loading__image`                                 | The `image` asset, plus `--spin` / `--pulse` when animated.                                       |
| `.hub-loading__message`                               | The message text.                                                                                 |

The bar has its own set, and it is worth knowing because most of it is state you can style
against rather than structure you have to reach into:

| Class                                                | Element                                                                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `.hub-loading-bar`                                   | Host block.                                                                                                                      |
| `.hub-loading-bar--inline` · `--overlay` · `--fixed` | Mode modifiers.                                                                                                                  |
| `.hub-loading-bar--top` · `--bottom`                 | Placement modifiers; emitted only by the two positioned modes, so they can never reach an inline bar.                            |
| `.hub-loading-bar--visible`                          | Present only while the bar is painted. The fill transition is scoped to it, so a rewind between cycles never animates backwards. |
| `.hub-loading-bar--indeterminate`                    | The sweep is running instead of a fill.                                                                                          |
| `.hub-loading-bar--glow`                             | The leading-edge glow is on — the shipped default, unless `[glow]="false"` or a re-based `provideHubLoadingBar()` turns it off.  |
| `.hub-loading-bar__indicator`                        | The fill itself; its `::after` paints the glow.                                                                                  |

### Right-to-left

Under `[dir='rtl']` the `indeterminate` sweep reverses, so it travels with the text instead
of against it. Nothing to switch on: the stylesheet reads the direction from the bar itself
or from any ancestor carrying the attribute, which is where an RTL application already sets
it. The determinate fill needs no such rule — it is laid out with logical properties and
mirrors on its own.

## ♿ Accessibility

- The block is a **status region**: `role="status"`, `aria-live="polite"` and
  `aria-busy="true"`. A polite live region is announced at the next natural pause, so
  starting a load never interrupts what the user is reading.
- `ariaLabel` (default `'Loading'`) names that region. Give it something specific when the
  page can have several — `"Loading invoices"` beats a second generic "Loading".
- Because `message` lives inside the live region, changing it — including through
  `HubLoadingService.update()` — is announced, which is what makes a phased task readable
  without sight.
- The indicator and the `image` are decorative (`aria-hidden`, empty `alt`), so nothing is
  announced twice. What carries the meaning is `ariaLabel` and the `message`.
- Render the block only while the work is actually running. A permanently mounted
  `aria-busy="true"` region tells assistive technology the app is forever loading.
- Under `prefers-reduced-motion: reduce` the animation is **calmed, not frozen** — a frozen
  loader reads as a hung UI. The cycle slows to `2.4s` and every rotation or scale is
  swapped for a plain fade, so nothing spins or jumps.

### The loading bar

- The bar is a `role="progressbar"` with static `aria-valuemin` / `aria-valuemax`, named by
  `ariaLabel`, and `aria-hidden` while it is not painted.
- **`aria-valuenow` is withheld unless the value is real.** While the service trickles, the
  number on screen is invented — nothing knows the real percentage of a page load — and a
  progressbar without `aria-valuenow` is exactly how ARIA spells "indeterminate". Announcing
  a made-up "43%" would be worse than announcing nothing. The value appears only when a
  caller has bound one, and is withheld again under `indeterminate`.
- Under `prefers-reduced-motion: reduce` the `indeterminate` sweep slows considerably. The
  determinate fill is left alone on purpose: it is not decoration, it is the value being
  reported, and freezing it would leave a bar that says nothing.

## 🖥️ Server-Side Rendering

- `<hub-loading>` is declarative markup and CSS with no browser API in the render path,
  so it renders on the server like any other component.
- `HubLoadingService` is safe to call during server rendering: `show()`, `update()`,
  `hide()` and `hideAll()` need no platform guard of their own. Only the DOM mount is
  skipped — the reference counter still runs, so `isLoading` stays truthful and hydration
  finds no orphan overlay markup.

- `HubLoadingBarService` creates **no timer at all** on the server. This matters more than
  it looks: a repeating interval inside Angular's zone would keep `ApplicationRef.isStable`
  false forever and hang the render. The counter still runs, so `isActive` stays truthful,
  and the bar is never painted server-side, so there is nothing to mismatch on hydration.
  In the browser the timers run outside the zone, where signal writes still schedule change
  detection but a 250 ms tick does not drive a whole application's worth of it.

## 📦 Peer Dependencies

```json
{
	"@angular/common": ">=17.3.0",
	"@angular/core": ">=17.3.0",
	"@angular/router": ">=17.3.0",
	"ng-hub-ui-utils": ">=22.8.0",
	"rxjs": ">=7.5.0"
}
```

`@angular/router` is **optional** (`peerDependenciesMeta`). Only
`provideHubLoadingBarRouter()` touches it; everything else in the package works without a
router.

## 📊 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history, and
[BREAKING_CHANGES.md](./BREAKING_CHANGES.md) for migration notes.

## 🤝 Contribution

Contributions are welcome. Please open an issue to discuss substantial changes before
submitting a pull request, and make sure to document every library change in `CHANGELOG.md`.

## ☕ Support

- **Issues**: [GitHub Issues](https://github.com/hub-env/hub-ui/issues)
- **Author**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 💼 Commercial support

These libraries are maintained by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com), a freelance frontend architect working with teams that build and maintain Angular applications.

If your team depends on Hub-UI and needs more than an issue thread can solve, that is my day job: architecture audits, design systems, Angular migrations and team mentoring. For projects that also need design and a full team, I run them through [Frog Hub](https://froghub.es), my development studio.

Have a look at [the services](https://www.carlosmorcillo.com/en/services/) or [tell me about your project](https://www.carlosmorcillo.com/en/contact/).

## 📄 License

MIT © [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)
