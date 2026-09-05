# Functionalities of Loading Library

This table details the functionalities of the `ng-hub-ui-loading` library and indicates which ones are covered by interactive examples.

The library ships two components: `hub-loading`, the activity indicator, and `hub-loading-bar`, the page-progress strip.

## Component (`hub-loading`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Display Modes** | Inline block (`mode="inline"`) | ✅ |
| | Container overlay (`mode="overlay"`) | ✅ |
| | Fullscreen overlay (`mode="fullscreen"`) | ✅ |
| | Backdrop layer (`backdrop`) | ✅ |
| | Backdrop disabled (`[backdrop]="false"`) | ✅ |
| **Indicators** | `spinner` variant | ✅ |
| | `dots` variant | ✅ |
| | `bars` variant | ✅ |
| | `pulse` variant | ✅ |
| | `ring` variant | ✅ |
| **Image / Branding** | Custom image or logo (`image`) | ✅ |
| | Image animation `none` | ✅ |
| | Image animation `spin` | ✅ |
| | Image animation `pulse` | ✅ |
| **Content** | Message text (`message`) | ✅ |
| | Projected content (`<ng-content>`) | ✅ |
| **Sizing & Colour** | Size steps (`sm` / `md` / `lg`) | ✅ |
| | Accent colour (`color`) | ✅ |
| **Accessibility** | `role="status"` / `aria-live` / `aria-busy` contract | ✅ |
| | Custom accessible name (`ariaLabel`) | ❌ |
| | `prefers-reduced-motion` fallback | ❌ |

## Service (`HubLoadingService`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Overlay Control** | `show(options?)` | ✅ |
| | `hide()` | ✅ |
| | `hideAll()` | ✅ |
| | `update(options)` | ✅ |
| **State** | `isLoading` signal | ✅ |
| **Semantics** | Reference-counted nested `show()` / `hide()` | ✅ |
| | SSR no-op without a DOM | ❌ |
| **Configuration** | `provideHubLoading(config?)` defaults | ❌ |
| | Defaults re-based for template `<hub-loading>` too | ❌ |
| | `HUB_LOADING_CONFIG` token provided directly | ❌ |
| | `HUB_LOADING_DEFAULT_CONFIG` export | ❌ |

## Styling

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **CSS Variables** | `--hub-loading-accent` | ✅ |
| | `--hub-loading-size` | ✅ |
| | `--hub-loading-speed` | ✅ |
| | `--hub-loading-gap` | ✅ |
| | `--hub-loading-text-color` | ✅ |
| | `--hub-loading-font-size` | ✅ |
| | `--hub-loading-backdrop-bg` | ✅ |
| | `--hub-loading-backdrop-blur` | ✅ |
| | `--hub-loading-z-index` | ✅ |
| | `--hub-loading-image-size` | ✅ |
| | `--hub-loading-thickness` | ✅ |
| **Sass** | `hub-loading-theme()` mixin | ✅ |
| **Structure** | BEM classes (`hub-loading__indicator`, `__image`, `__message`) | ❌ |

## Loading bar (`hub-loading-bar`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Placement** | In flow, reserving its own row (`mode="inline"`) | ✅ |
| | Attached to a positioned ancestor (`mode="overlay"`) | ✅ |
| | Pinned to the viewport (`mode="fixed"`) | ✅ |
| | Top edge (`placement="top"`) | ✅ |
| | Bottom edge (`placement="bottom"`) | ✅ |
| | Offset from the edge (`--hub-loading-bar-offset`) | ✅ |
| **Progress source** | Follows `HubLoadingBarService` when unbound | ✅ |
| | Consumer-driven (`[progress]="42"`) | ✅ |
| | Hidden (`[progress]="null"`) | ✅ |
| | Indeterminate sweep (`indeterminate`) | ✅ |
| **Appearance** | Leading-edge glow (`glow`) | ✅ |
| | Glow disabled (`[glow]="false"`) | ✅ |
| | Accent colour (`color`) | ✅ |
| **Accessibility** | `role="progressbar"` with static bounds | ✅ |
| | `aria-valuenow` published for a real value | ✅ |
| | `aria-valuenow` withheld while the value is invented | ✅ |
| | Custom accessible name (`ariaLabel`) | ✅ |
| | `aria-hidden` while the bar is not painted | ❌ |
| | `prefers-reduced-motion` sweep slowdown | ❌ |

## Loading bar service (`HubLoadingBarService`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Lifecycle** | `start()` / `complete()` | ✅ |
| | `completeAll()` | ✅ |
| | `reset()` | ❌ |
| **Manual control** | `set(value)` | ❌ |
| | `inc(amount?)` | ❌ |
| **State** | `progress` signal | ✅ |
| | `isActive` signal | ✅ |
| | `isVisible` signal | ✅ |
| **Semantics** | Reference-counted concurrent callers | ✅ |
| | Grace period: fast work paints no bar | ✅ |
| | Trickle decelerating towards `max` | ✅ |
| | Trickle disabled (`trickle: false`) | ❌ |
| | Custom `trickleFn` curve | ❌ |
| | Exported `hubLoadingBarTrickle()` default curve | ❌ |
| | No timers created during SSR | ❌ |
| | Timers run outside the Angular zone | ❌ |

## Loading bar integrations

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Router** | `provideHubLoadingBarRouter()` | ❌ |
| | Released on a guard-cancelled navigation | ❌ |
| **HTTP** | `hubLoadingBarInterceptor` | ❌ |
| | Released on error and on cancellation | ❌ |
| | `withoutHubLoadingBar()` opt-out | ❌ |
| | `HUB_LOADING_BAR_SKIP` context token | ❌ |
| **Configuration** | `provideHubLoadingBar(config?)` defaults | ❌ |
| | `HUB_LOADING_BAR_CONFIG` token provided directly | ❌ |
| | `HUB_LOADING_BAR_DEFAULT_CONFIG` export | ❌ |

## Loading bar styling

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **CSS Variables** | `--hub-loading-bar-accent` | ✅ |
| | `--hub-loading-bar-height` | ✅ |
| | `--hub-loading-bar-track-bg` | ✅ |
| | `--hub-loading-bar-radius` | ✅ |
| | `--hub-loading-bar-speed` | ✅ |
| | `--hub-loading-bar-fade` | ✅ |
| | `--hub-loading-bar-easing` | ✅ |
| | `--hub-loading-bar-glow-color` | ✅ |
| | `--hub-loading-bar-glow-blur` | ✅ |
| | `--hub-loading-bar-glow-spread` | ✅ |
| | `--hub-loading-bar-indeterminate-speed` | ✅ |
| | `--hub-loading-bar-offset` | ✅ |
| | `--hub-loading-bar-z-index` | ❌ |
| **Sass** | `hub-loading-bar-theme()` mixin | ✅ |
| **Structure** | BEM classes (`hub-loading-bar__indicator`) | ❌ |

---

_Note: ✅ indicates an active interactive example or playground control is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._
