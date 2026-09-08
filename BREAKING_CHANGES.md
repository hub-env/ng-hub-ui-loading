# Breaking Changes

This file documents breaking changes and migration steps for `ng-hub-ui-loading`.

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
