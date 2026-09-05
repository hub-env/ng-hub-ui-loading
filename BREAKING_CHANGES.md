# Breaking Changes

This file documents breaking changes and migration steps for `ng-hub-ui-loading`.

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
