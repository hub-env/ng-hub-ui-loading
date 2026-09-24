# Breaking Changes

This file documents breaking changes and migration steps for `ng-hub-ui-loading`.

## [22.4.0] - 2026-09-23

### A `fullscreen` indicator is moved to `<body>`

- **Change**: `<hub-loading mode="fullscreen">` re-parents its host element to `document.body` once
  it renders. The new `appendTo` input names the target — `'body'` by default, `null` to keep the
  old placement, any selector to send it elsewhere. `inline` and `overlay` are unaffected.

- **Why**: `position: fixed` measures from the viewport only while no ancestor applies layout
  containment, a transform or a filter, and paints above the page only while no ancestor opens a
  stacking context. Neither is something a page can promise, and both are broken by ordinary
  layout: a card with a `transform`, a shell that isolates its stacking context. Declared inside
  one, the indicator covered that box rather than the window, and `--hub-loading-z-index` was
  clamped to whatever level the ancestor sat at. It is the same reason `HubLoadingService` has
  always mounted its overlay on `document.body`, and the same reason `hub-select` appends its panel
  there; the declarative form was the one place in the family still trusting its ancestors.

- **Impact — the TypeScript surface is untouched and the DOM position changes.** The component
  instance is the same object, a `viewChild` still finds it, inputs and content projection work as
  before. What moves with the node:

    - A rule written against an ancestor — `.wizard hub-loading { … }` — stops matching.
    - A `--hub-loading-*` or `--hub-sys-*` token declared on an ancestor rather than on `:root`
      stops being inherited, so a locally rethemed subtree loses its theme on the fullscreen
      indicator only.
    - A test asserting the element is under the fixture root fails; query the document instead.

- **Migration**: theme through `:root` or through the `color` / token inputs, which is the
  documented route anyway. To keep the old placement, bind `[appendTo]="null"` — and then give the
  indicator an ancestor chain that declares no containment, transform, filter or stacking context,
  because that is what it was relying on.

## [22.3.0] - 2026-09-23

### Angular below 17.3.0 is no longer supported

- **Change**: the `@angular/*` peer ranges move from `>=17.1.0` to `>=17.3.0`.

- **Why**: Its published `.d.ts` names `InputSignalWithTransform` or `OutputEmitterRef`, which Angular did not ship until 17.3.

- **Impact — an application below 17.3.0 gets a peer warning where it used to get a build error.**
  Nothing that worked stops working: those versions never compiled against this package. Upgrade
  Angular to 17.3.0 or stay on the previous release.

## [22.2.0]

### The stylesheets no longer reach outside their components

- **Change**: `<hub-loading>` and `<hub-loading-bar>` dropped `ViewEncapsulation.None`. Every rule
  they emit now carries the component's own marker attribute — `.hub-loading__dot` ships as
  `.hub-loading__dot[_ngcontent-…]`, and the modifier blocks as
  `.hub-loading-bar--fixed[_nghost-…]`.

- **Impact**: the TypeScript API is untouched — same inputs, same services, same classes on the
  host — and two things change in CSS, neither of which announces itself.

    - Markup that is not the component's stops being painted. A `<div class="hub-loading-bar">` of
      your own picked up the strip's geometry for free; it now renders as a bare div.
    - The library's rules weigh one attribute selector more than before, (0,2,0) where they were
      (0,1,0). An override that won by adding a single class — `.app-shell .hub-loading__dot { … }` —
      now ties with the library and loses on source order, because component styles are injected
      after the stylesheet your application ships.

- **Migration**: theme through the tokens rather than through the internals, which is what the two
  mixins have always done and the only route that was ever documented. Every `--hub-loading-*` and
  `--hub-loading-bar-*` token is still reachable from a global rule against `.hub-loading` or
  `.hub-loading-bar`: those classes sit on the host element, which your stylesheet reaches exactly
  as it did before — encapsulation only stamps the rules the library itself emits.

    ```scss
    // Before — one extra class was enough to win
    .app-shell .hub-loading-bar__indicator {
    	background: var(--brand);
    }

    // After — set the token the indicator reads
    .app-shell {
    	@include hub-loading-bar-theme($accent: var(--brand));
    }
    ```

    The service-mounted overlay needs nothing: it is a real `HubLoadingComponent` created through
    `createComponent()`, so it carries the stylesheet with it onto `document.body`.

## [22.1.0]

No breaking changes. The release is purely additive: `hub-loading-bar` and its service,
providers and tokens are new exports, and nothing in the existing `hub-loading` surface
moved. `@angular/router` becomes an optional peer dependency, so an application without a
router is unaffected.

## [22.0.0]

Initial release. No breaking changes.

The major version starts at `22` to match the rest of the `ng-hub-ui` family, whose
major always tracks the targeted Angular major — it does not imply twenty-one earlier
releases of this library.
