# Amsterdam Design System — Icon Reference

Icons from `@amsterdam/design-system-react-icons` (v2.0.0+, 345+ icons).

## Installation

```bash
npm install @amsterdam/design-system-react-icons
```

## Usage Patterns

```tsx
import { Icon, Button, IconButton } from "@amsterdam/design-system-react"
import { SearchIcon, CloseIcon } from "@amsterdam/design-system-react-icons"

{/* Standalone decorative icon */}
<Icon svg={SearchIcon} />
<Icon svg={SearchIcon} size="large" />
<Icon svg={SearchIcon} size="heading-3" />
<Icon svg={SearchIcon} color="inverse" />
<Icon svg={SearchIcon} square />

{/* Button with icon */}
<Button icon={SearchIcon}>Zoeken</Button>
<Button icon={SearchIcon} iconBefore>Zoeken</Button>

{/* Icon-only button — label required for accessibility */}
<IconButton svg={CloseIcon} label="Sluiten" />
<IconButton svg={CloseIcon} label="Sluiten" size="large" />

{/* With other components */}
<StandaloneLink href="/search" icon={SearchIcon}>Zoek op de website</StandaloneLink>
<Badge label="Nieuw" icon={StarIcon} color="azure" />
```

## Icon Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `svg` | `Function \| ReactNode` | required | Icon component or SVG element |
| `size` | `'small' \| 'large' \| 'heading-1' \| 'heading-2' \| 'heading-3' \| 'heading-4' \| 'heading-5'` | — | Size aligned to text line heights |
| `color` | `'inverse'` | — | White icon for dark backgrounds |
| `square` | `boolean` | `false` | Square bounding box |

Sizes `heading-0` and `heading-6` are deprecated.

## Design Guidelines

### When to Use Icons

- Icons accompany text in buttons and links for quick visual communication
- Standalone icons only for universal conventions: hamburger menu, search (magnifying glass), playback controls
- Icons direct attention to interactive elements

### Color

- **Default:** Black or white matching container's color scheme
- **Interactive state:** Blue
- **Disabled state:** Grey
- Must maintain WCAG-compliant contrast ratios equivalent to typography standards

### Alignment & Sizing

- Icons align to the left of text by default
- Vertically centered to the first line of text
- Built-in whitespace matches text line heights
- Size options correspond to body text (small/large) or heading levels (1-5)

### Accessibility

- The `Icon` component renders a `<span hidden>` — icons are decorative by default
- For meaningful standalone icons, use `IconButton` with a `label` prop
- Always pair icons with text when possible
- WCAG contrast requirements apply same as typography

## Naming Conventions

- **Functional icons:** Verb-based names — `Save`, `Close`, `Download`
- **Descriptive icons:** Noun-based names — `Calendar`, `Document`, `Phone`
- **Compound icons:** Main concept first — `DocumentEdit` (not `EditDocument`)
- **Natural terms:** Two-word terms kept as-is — `BankCard`
- **Shape additions:** Follow concept — `Plus`, `PlusCircle`
- **Direction:** Use `Backward`/`Forward` (not left/right) for RTL support
- **Interaction:** Use `With` — `DocumentWithPencil`, `HandWithPlant`
- **Fill variants:** Most icons have outline + fill — `CalendarIcon` / `CalendarFillIcon`

## v2.0.0 Breaking Renames

| Old name | New name |
|----------|----------|
| `BellIcon` / `BellFillIcon` | `NotificationIcon` / `NotificationFillIcon` |
| `PersonCircleIcon` / `PersonCircleFillIcon` | `UserAccountIcon` / `UserAccountFillIcon` |
| `TrashBinIcon` | `DeleteIcon` |
| `CogwheelIcon` | `SettingsIcon` |
| `CheckMarkCircleIcon` | `SuccessIcon` |
| `LinkedinIcon` | `LinkedInIcon` (capitalization fix) |

## Available Icons

Most icons have a regular variant and a `Fill` variant (e.g., `CalendarIcon` and `CalendarFillIcon`). Only the base name is listed; append `FillIcon` for the filled version where available.

### Navigation & Directional

| Icon | Import |
|------|--------|
| Arrow backward | `ArrowBackwardIcon` |
| Arrow forward | `ArrowForwardIcon` |
| Arrow down | `ArrowDownIcon` |
| Arrow up | `ArrowUpIcon` |
| Chevron backward | `ChevronBackwardIcon` |
| Chevron forward | `ChevronForwardIcon` |
| Chevron down | `ChevronDownIcon` |
| Chevron up | `ChevronUpIcon` |
| Next | `NextIcon` |
| Previous | `PreviousIcon` |
| External link | `ExternalLinkIcon` |
| Expand | `ExpandIcon` |

### UI Controls & Actions

| Icon | Import |
|------|--------|
| Close | `CloseIcon` |
| Menu (hamburger) | `MenuIcon` |
| Search | `SearchIcon` |
| Plus | `PlusIcon` |
| Minus | `MinusIcon` |
| Check mark | `CheckMarkIcon` / `CheckMarkFillIcon` |
| Copy | `CopyIcon` |
| Delete | `DeleteIcon` |
| Download | `DownloadIcon` |
| Upload | `UploadIcon` |
| Edit / Pencil | `EditIcon` |
| Filter | `FilterIcon` |
| Sort | `SortIcon` |
| Share | `ShareIcon` |
| Settings | `SettingsIcon` |
| Login | `LoginIcon` |
| Logout | `LogoutIcon` |
| Save | `SaveIcon` |
| Refresh | `RefreshIcon` |
| Undo | `UndoIcon` |
| Redo | `RedoIcon` |

### Communication

| Icon | Import |
|------|--------|
| Email / Mail | `EmailIcon` / `EmailFillIcon` |
| Phone | `PhoneIcon` / `PhoneFillIcon` |
| Chat | `ChatIcon` / `ChatFillIcon` |
| Notification | `NotificationIcon` / `NotificationFillIcon` |

### Objects & Concepts

| Icon | Import |
|------|--------|
| Calendar | `CalendarIcon` / `CalendarFillIcon` |
| Clock | `ClockIcon` / `ClockFillIcon` |
| Document | `DocumentIcon` / `DocumentFillIcon` |
| Documents | `DocumentsIcon` |
| Document check mark | `DocumentCheckMarkIcon` |
| Document euro | `DocumentEuroIcon` |
| Document percent | `DocumentPercentIcon` |
| Document question mark | `DocumentQuestionMarkIcon` |
| Document with pencil | `DocumentWithPencilIcon` |
| Home | `HomeIcon` / `HomeFillIcon` |
| Location | `LocationIcon` / `LocationFillIcon` |
| Map | `MapIcon` |
| Person | `PersonIcon` / `PersonFillIcon` |
| User account | `UserAccountIcon` / `UserAccountFillIcon` |
| Lock | `LockIcon` / `LockFillIcon` |
| Unlock | `UnlockIcon` |
| Clipboard | `ClipboardIcon` |
| Certificate | `CertificateIcon` |
| Bank card | `BankCardIcon` |
| City pass | `CityPassIcon` |
| Shopping cart | `ShoppingCartIcon` |
| Cookie | `CookieIcon` |
| Key | `KeyIcon` |

### Status & Feedback

| Icon | Import |
|------|--------|
| Success | `SuccessIcon` |
| Error | `ErrorIcon` |
| Info | `InfoIcon` / `InfoFillIcon` |
| Warning / Alert | `AlertIcon` / `AlertFillIcon` |
| Star | `StarIcon` / `StarFillIcon` |
| Heart | `HeartIcon` / `HeartFillIcon` |
| Eye (visibility) | `EyeIcon` / `EyeFillIcon` |
| Eye off | `EyeOffIcon` |

### Media

| Icon | Import |
|------|--------|
| Camera | `CameraIcon` / `CameraFillIcon` |
| Image | `ImageIcon` / `ImageFillIcon` |
| Play | `PlayIcon` / `PlayFillIcon` |
| Pause | `PauseIcon` |
| Microphone | `MicrophoneIcon` |

### Transportation

| Icon | Import |
|------|--------|
| Airplane | `AirplaneIcon` |
| Bike | `BikeIcon` |
| Bus | `BusIcon` |
| Car | `CarIcon` |
| Charging station | `ChargingStationIcon` |
| Train | `TrainIcon` |

### Data & Analytics

| Icon | Import |
|------|--------|
| Bar chart | `BarChartIcon` |
| Database | `DatabaseIcon` |
| Databases | `DatabasesIcon` |
| Connected circles | `ConnectedCirclesIcon` |

### Buildings & Places

| Icon | Import |
|------|--------|
| Building | `BuildingIcon` |
| Buildings | `BuildingsIcon` |
| Bed | `BedIcon` |
| Construction | `ConstructionIcon` |
| Park | `ParkIcon` |
| Area | `AreaIcon` |

### Social Media

| Icon | Import |
|------|--------|
| Facebook | `FacebookIcon` |
| Instagram | `InstagramIcon` |
| LinkedIn | `LinkedInIcon` |
| Mastodon | `MastodonIcon` |
| WhatsApp | `WhatsAppIcon` |
| X (Twitter) | `XIcon` |

### Amsterdam-Specific

| Icon | Import |
|------|--------|
| Amsterdam logo mark | `LogoIcon` |
| Earth / Globe | `EarthIcon` |
| Contrast | `ContrastIcon` |

## Custom SVG Icons

When the icon set doesn't cover your need, use custom SVGs:

```tsx
{/* As inline SVG */}
<Icon svg={
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
} />

{/* As React component */}
function CustomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
    </svg>
  )
}

<Icon svg={CustomIcon} size="large" />
```

Custom SVGs must:
- Use `viewBox="0 0 24 24"` (AMS icon grid)
- Use `fill="currentColor"` for color inheritance
- Not include `width`/`height` attributes (controlled by `Icon` component)

## Icon in Component Context

```tsx
{/* Navigation with icons */}
<StandaloneLink href="/search" icon={SearchIcon}>
  Zoek op de website
</StandaloneLink>

{/* Call-to-action with icon */}
<CallToActionLink href="/apply">
  Aanvragen
</CallToActionLink>

{/* Badge with icon */}
<Badge label="Nieuw" icon={StarIcon} color="azure" />

{/* Dialog close button */}
<IconButton svg={CloseIcon} label="Sluiten" />
```
