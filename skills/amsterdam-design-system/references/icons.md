# Amsterdam Design System — Icon Reference

Icons from `@amsterdam/design-system-react-icons` **v2.3.0** (October 2026).

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
| `svg` | `ReactElement<SVGProps> \| (props: SVGProps) => ReactElement` | required | Icon component, a rendered `<svg>` element, or a function returning one |
| `size` | `'small' \| 'large' \| 'heading-1' \| 'heading-2' \| 'heading-3' \| 'heading-4' \| 'heading-5'` | — | Size aligned to text line heights |
| `color` | `'inverse'` | — | White icon for dark backgrounds |
| `square` | `boolean` | `false` | Square bounding box |

Sizes `heading-0` and `heading-6` were removed in v4.0.0 — use `heading-1` and `heading-5`.

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

## Available Icons

<!-- Generated from @amsterdam/design-system-react-icons 2.3.0 dist/index.d.ts and the @deprecated tags in dist/*.d.ts. Regenerate rather than edit by hand. -->

359 current exports (220 icons, most with a `Fill` variant) plus 14 deprecated aliases. Import each as `<Name>Icon`; a **+F** marks a `<Name>FillIcon` variant.

| | Icons |
|---|---|
| **A** | Airplane, Apple **+F**, ArchiveBox **+F**, Area **+F**, ArrowBackward, ArrowDown, ArrowForward, ArrowUp, AwardRibbon **+F** |
| **B** | BabyBottle **+F**, Ball, BankCard **+F**, BarChart **+F**, Bed, Bike, BirdHouse **+F**, Box **+F**, Bread **+F**, Bridge **+F**, Broom, Brush **+F**, Building **+F**, Buildings **+F**, Bus **+F** |
| **C** | Cake **+F**, Calendar **+F**, Camera **+F**, Car **+F**, Certificate **+F**, ChargingStation **+F**, CheckMark, ChevronBackward, ChevronDoubleBackward, ChevronDoubleForward, ChevronDown, ChevronForward, ChevronUp, CityPass **+F**, Clipboard **+F**, Clock **+F**, Close, ConnectedCircles **+F**, Construction, Contrast **+F**, Cookie **+F**, Copy **+F**, CrossHair **+F** |
| **D** | Database **+F**, Databases **+F**, Delete **+F**, Document **+F**, DocumentCheckMark **+F**, DocumentEuro **+F**, DocumentMusicalNote **+F**, DocumentPercent **+F**, DocumentQuestionMark **+F**, DocumentWithPencil **+F**, Documents **+F**, Download, Duplicate **+F** |
| **E** | Earth **+F**, Edit **+F**, Ellipsis, Embed, Error **+F**, Euro, EuroCoins **+F**, EyeClosed **+F**, EyeOpen **+F** |
| **F** | FaceHappy **+F**, FaceNeutral **+F**, FaceSad **+F**, Facebook, FastForward, Filter **+F**, Flower **+F**, Folder **+F**, FontSize, ForkAndKnife **+F**, FormattingBold, FormattingItalic, FormattingStrikethrough, FormattingUnderline, FullScreenClose, FullScreenOpen |
| **G** | GasolinePump **+F**, Gavel **+F**, GraduateHat **+F**, Grid **+F** |
| **H** | HandWithPlant **+F**, Handshake, Heart **+F**, HeartBroken **+F**, History, House **+F**, HouseCanal **+F**, HouseWithFlag **+F** |
| **I** | IdentityCard **+F**, Image **+F**, Incognito **+F**, Info **+F**, Instagram |
| **K** | KeyboardKeyCommand, KeyboardKeyControl, KeyboardKeyEnter, KeyboardKeyShift |
| **L** | LaptopBroken, Layers **+F**, Leaf **+F**, LightBulb **+F**, Lightning **+F**, LineChartDown, LineChartUp, Link, LinkExternal **+F**, LinkedIn, List, LitterBin **+F**, LockClosed **+F**, LockOpen **+F**, LogIn, LogOut |
| **M** | MagnifyingGlassWithEye **+F**, Mail **+F**, Map **+F**, MapMarker **+F**, MapMarkerOnMap **+F**, MarketStall **+F**, Mastodon, Maximize, MedicalKit **+F**, Megaphone **+F**, Menu, Minimize, Minus, MinusCircle **+F**, Monitor, Monument **+F** |
| **N** | Next, Notification **+F** |
| **O** | OrganisationChart |
| **P** | Park **+F**, Parking **+F**, ParkingBike, ParkingGarage, Passport **+F**, Pause, Pen **+F**, Person **+F**, PersonAtDesk **+F**, PersonInWheelchair, PersonInWheelchairMoving, PersonPraying, PersonSwimming **+F**, Persons **+F**, PersonsWithEuroCoin **+F**, Phone **+F**, PieChart **+F**, PiggyBank **+F**, Placeholder, Plant **+F**, Play, Plus, PlusCircle **+F**, PowerPlug **+F**, PowerPlugWithSocket **+F**, Pregnant **+F**, Previous, Print **+F** |
| **Q** | QuestionMarkCircle **+F**, QuotationMarkClose, QuotationMarkOpen |
| **R** | Redo, Refresh, Replay, Rewind, RotateClockwise **+F**, RotateCounterclockwise **+F**, Ruler **+F** |
| **S** | SaintAndrewsCrosses, Save **+F**, Search, Settings **+F**, Share, SpeechBalloon **+F**, SpeechBalloonEllipsis **+F**, SpeechBalloonNotification **+F**, SpeechBalloonQuestionMark **+F**, SportsField **+F**, StandBy, Star **+F**, Stroller **+F**, Student **+F**, Success **+F**, Suitcase **+F**, SunbedParasol **+F**, Syringe **+F** |
| **T** | Table **+F**, TaxLetter **+F**, TheatricalMasks **+F**, ThumbsDown **+F**, ThumbsUp **+F**, TrashBag **+F**, Tree **+F**, TreeWide **+F** |
| **U** | Undo, Upload, UserAccount **+F** |
| **V** | Video **+F**, VolumeOff **+F**, VolumeOn **+F**, VotingBallot |
| **W** | Wallet **+F**, Warning **+F**, WaterLadder, Whatsapp, WiFi |
| **X** | X |
| **Z** | ZoomIn **+F**, ZoomOut **+F** |

### Deprecated names (still exported, will be removed)

| Deprecated | Use instead |
|---|---|
| `BellFillIcon` | `NotificationFillIcon` |
| `BellIcon` | `NotificationIcon` |
| `CheckMarkCircleFillIcon` | `SuccessFillIcon` |
| `CheckMarkCircleIcon` | `SuccessIcon` |
| `CogwheelFillIcon` | `SettingsFillIcon` |
| `CogwheelIcon` | `SettingsIcon` |
| `HandWithEuroCoinIcon` | `PersonsWithEuroCoinIcon` |
| `LinkedinIcon` | `LinkedInIcon` |
| `PencilFillIcon` | `EditFillIcon` |
| `PencilIcon` | `EditIcon` |
| `PersonCircleFillIcon` | `UserAccountFillIcon` |
| `PersonCircleIcon` | `UserAccountIcon` |
| `TrashBinFillIcon` | `DeleteFillIcon` |
| `TrashBinIcon` | `DeleteIcon` |

Deprecated names log a removal date in their type definitions; replace them when you touch the code.

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
