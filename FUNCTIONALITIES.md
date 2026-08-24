# Functionalities of Loading Library

This table details the functionalities of the `ng-hub-ui-loading` library and indicates which ones are covered by interactive examples.

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

---

_Note: ✅ indicates an active interactive example is available in the documentation. ❌ indicates functionality exists but no example yet._
