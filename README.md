# ng-hub-ui-loading

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-loading.svg)](https://www.npmjs.com/package/ng-hub-ui-loading)
[![Angular](https://img.shields.io/badge/Angular-22%2B-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-loading.svg)](LICENSE)

Standalone loading block for Angular 22+ — an inline indicator, an overlay pinned over the container that is busy, or a fullscreen curtain, from a single `<hub-loading>` element. Five pure-CSS indicators, an optional logo or image instead of them, an optional message, and a counter-based `HubLoadingService` for the app-wide fullscreen case. Zero external dependencies; every colour and dimension is a `--hub-loading-*` CSS custom property.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/loading/overview/
- Live examples: https://hubui.dev/en/loading/examples/
- Hub UI: https://hubui.dev/en/

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

| Package | Use it when |
| --- | --- |
| **`ng-hub-ui-loading`** | You cannot say how far along the work is, and the shape of the result does not matter yet. An activity indicator — in place, over the busy container, or over the whole app. |
| [`ng-hub-ui-skeleton`](https://www.npmjs.com/package/ng-hub-ui-skeleton) | You already know the shape of what is coming and want the layout to hold its place — structural shimmer placeholders instead of a spinner. |
| [`ng-hub-ui-metrics`](https://www.npmjs.com/package/ng-hub-ui-metrics) | You know the progress figure — a determinate progress bar, meter or ring that reports a value. |

The three compose: a skeleton for the list that is arriving, a `<hub-loading mode="overlay">`
over the panel being refreshed, and a `<hub-progress>` for the upload that reports bytes.

## ✨ Features

- **Three modes in one component** — `inline`, container `overlay` and viewport `fullscreen`.
- **Five pure-CSS indicators** — `spinner`, `dots`, `bars`, `pulse` and `ring`; no JavaScript animation loop, no SVG sprite, no icon font.
- **Image / logo support** — swap the indicator for your own brand asset and animate it with `spin` or `pulse`.
- **Optional message and projected content** — a caption under the indicator plus an `<ng-content>` slot for anything else.
- **Programmatic overlays** — `HubLoadingService` mounts a fullscreen `<hub-loading>` on demand, with reference-counted `show()` / `hide()` so concurrent tasks cannot dismiss each other's overlay.
- **Application-wide defaults** — `provideHubLoading()` re-bases every input's default, for the service *and* for every `<hub-loading>` in a template, without touching a single markup file.
- **Any accent colour** — `color` accepts a semantic design-system name, a hex value, `oklch()` or a `var(...)` reference, resolved through `resolveHubAccent()` from `ng-hub-ui-utils`.
- **CSS-variable theming** — every colour, dimension and speed is a `--hub-loading-*` custom property, with a `hub-loading-theme()` Sass mixin for one-call re-skinning.
- **Accessible by default** — `role="status"`, `aria-live="polite"` and `aria-busy="true"`, with a configurable `ariaLabel` and a `prefers-reduced-motion` treatment that calms the motion instead of freezing it.
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

### Backdrop

`backdrop` paints the translucent layer behind the indicator. It applies to `overlay`
and `fullscreen` only — an inline block has nothing to cover — and is on by default.

```html
<hub-loading mode="overlay" [backdrop]="false" />
```

## 🎛️ Variants

Five indicators, all drawn with CSS. Pick with the `variant` input.

| Variant | Shape |
| --- | --- |
| `spinner` | Rotating arc (the default). |
| `dots` | Three dots pulsing in sequence. |
| `bars` | Bars rising and falling. |
| `pulse` | A single expanding, fading disc. |
| `ring` | A full ring with a travelling highlight. |

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

| `imageAnimation` | Effect |
| --- | --- |
| `none` | Static image (the default). |
| `spin` | Continuous rotation. |
| `pulse` | Rhythmic scale/opacity beat. |

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
site. It reaches **both** consumers: the service's overlays *and* every `<hub-loading>`
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

## 📖 API Reference

### `HubLoadingComponent`

Selector: `hub-loading`. Standalone, `OnPush`, signal inputs.

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'inline' \| 'overlay' \| 'fullscreen'` | `'inline'` | Where the block paints. `overlay` is absolutely positioned over the parent (which needs `position: relative`); `fullscreen` is fixed to the viewport. |
| `variant` | `'spinner' \| 'dots' \| 'bars' \| 'pulse' \| 'ring'` | `'spinner'` | Which pure-CSS indicator to draw. Ignored when `image` is set. |
| `image` | `string \| null` | `null` | URL or data URI rendered instead of the built-in indicator. |
| `imageAnimation` | `'none' \| 'spin' \| 'pulse'` | `'none'` | Animation applied to `image`. |
| `message` | `string \| null` | `null` | Text rendered under the indicator. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Indicator scale; maps onto `--hub-loading-size`, which always overrides it. |
| `color` | `string \| null` | `null` | Accent colour: semantic name, hex, `rgb()`, `oklch()` or `var(...)`. Resolved with `resolveHubAccent()`. |
| `backdrop` | `boolean` | `true` | Translucent layer behind the indicator. Applies to `overlay` and `fullscreen` only. Read with `booleanAttribute`, so the bare `backdrop` attribute also works. |
| `ariaLabel` | `string` | `'Loading'` | Accessible name of the status region. |

This component has no outputs. Content projected into it renders below the message.

> Every default except `mode`'s comes from the injected `HUB_LOADING_CONFIG`. The values in
> the table are the unconfigured ones; `provideHubLoading()` re-bases them application-wide.

### `HubLoadingService`

Injectable (`providedIn: 'root'`). Drives a single fullscreen overlay attached to `document.body`.

| Member | Signature | Description |
| --- | --- | --- |
| `show` | `(options?: HubLoadingOptions) => void` | Increments the counter and creates the overlay if it is not mounted yet. |
| `hide` | `() => void` | Decrements the counter; destroys the overlay when it reaches zero. |
| `hideAll` | `() => void` | Forces the counter to zero and destroys the overlay. |
| `update` | `(options: HubLoadingOptions) => void` | Applies new options to the visible overlay. |
| `isLoading` | `Signal<boolean>` | Whether an overlay is currently mounted. |

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

| Option | Type | Description |
| --- | --- | --- |
| `variant` | `'spinner' \| 'dots' \| 'bars' \| 'pulse' \| 'ring'` | Indicator to draw. |
| `image` | `string \| null` | Image or logo replacing the indicator. |
| `imageAnimation` | `'none' \| 'spin' \| 'pulse'` | Animation applied to `image`. |
| `message` | `string \| null` | Text under the indicator. |
| `size` | `'sm' \| 'md' \| 'lg'` | Indicator scale. |
| `color` | `string \| null` | Accent colour. |
| `backdrop` | `boolean` | Translucent layer behind the indicator. |
| `ariaLabel` | `string` | Accessible name of the status region. |

`HubLoadingConfig` is the same shape with every member required — it is what the injection
token holds once resolved.

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

The component declares its token defaults on `:where(.hub-loading)` — zero specificity, so
any consumer rule wins — and each one climbs the family's ladder: the semantic `--hub-sys-*`
layer first, the `--hub-ref-*` primitive next, a literal last. That is why the block already
matches your theme, and its dark mode, before you override anything. Values with no honest
counterpart in the design system (an indicator's diameter, a loop period, a blur radius)
carry a literal rather than borrowing a `sys` token that means something else.

Styles are deliberately unencapsulated, so a global stylesheet can retheme the indicator —
and so the service-mounted overlay, created outside any component's style scope, is painted.

| Variable | Default | Description |
| --- | --- | --- |
| `--hub-loading-accent` | `var(--hub-sys-color-primary, #0d6efd)` | Indicator colour. What the `color` input writes into. |
| `--hub-loading-size` | `2.5rem` | Indicator box size. What the `size` input maps onto. |
| `--hub-loading-thickness` | `calc(var(--hub-ref-border-width, 1px) * 3)` | Stroke width of the `spinner` and `ring` indicators. |
| `--hub-loading-speed` | `0.9s` | Duration of one animation cycle, for the indicators and the image animations. |
| `--hub-loading-gap` | `var(--hub-sys-gap-2, var(--hub-ref-space-2, 0.5rem))` | Space between indicator, message and projected content. |
| `--hub-loading-text-color` | `var(--hub-sys-text-primary, var(--hub-ref-color-gray-900, #212529))` | Message colour. |
| `--hub-loading-font-size` | `var(--hub-ref-font-size-sm, 0.875rem)` | Message font size. |
| `--hub-loading-backdrop-bg` | `color-mix(in srgb, var(--hub-sys-surface-page, #fff) 72%, transparent)` | Backdrop background in `overlay` / `fullscreen`. Follows the theme's own page surface, so the scrim is a white veil on light themes and a dark one on dark themes. |
| `--hub-loading-backdrop-blur` | `2px` | Backdrop blur radius. |
| `--hub-loading-z-index` | `var(--hub-sys-zindex-modal, 1055)` | Stack order of the `fullscreen` layer. |
| `--hub-loading-image-size` | `var(--hub-loading-size)` | Rendered size of the `image` asset — it follows the indicator size until you say otherwise. |

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

### BEM classes

The internal structure is stable and addressable, for the cases a token cannot reach:

| Class | Element |
| --- | --- |
| `.hub-loading` | Host block. |
| `.hub-loading--inline` · `--overlay` · `--fullscreen` | Mode modifiers. |
| `.hub-loading--sm` · `--md` · `--lg` | Size modifiers; each retunes the size, thickness and font-size tokens. |
| `.hub-loading--backdrop` | Present only when the scrim is painted (never in `inline` mode). |
| `.hub-loading__indicator` | The pure-CSS indicator, plus a `--spinner` / `--dots` / `--bars` / `--pulse` / `--ring` modifier. |
| `.hub-loading__dot` · `.hub-loading__bar` | The individual parts of the `dots` and `bars` indicators. |
| `.hub-loading__image` | The `image` asset, plus `--spin` / `--pulse` when animated. |
| `.hub-loading__message` | The message text. |

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

## 🖥️ Server-Side Rendering

- `<hub-loading>` is declarative markup and CSS with no browser API in the render path,
  so it renders on the server like any other component.
- `HubLoadingService` is safe to call during server rendering: `show()`, `update()`,
  `hide()` and `hideAll()` need no platform guard of their own. Only the DOM mount is
  skipped — the reference counter still runs, so `isLoading` stays truthful and hydration
  finds no orphan overlay markup.

## 📦 Peer Dependencies

```json
{
	"@angular/common": ">=21.0.0",
	"@angular/core": ">=21.0.0",
	"ng-hub-ui-utils": ">=22.8.0"
}
```

## 📊 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history, and
[BREAKING_CHANGES.md](./BREAKING_CHANGES.md) for migration notes.

## 🤝 Contribution

Contributions are welcome. Please open an issue to discuss substantial changes before
submitting a pull request, and make sure to document every library change in `CHANGELOG.md`.

## ☕ Support

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui/issues)
- **Author**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 📄 License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
