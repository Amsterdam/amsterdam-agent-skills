import { forwardRef, type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

/*
 * StatCard — canonical example of the Tailwind-bridge alternative described
 * in SKILL.md → "Custom Components" → "Tailwind-bridge alternative".
 *
 * Rules followed:
 *   • forwardRef + spread restProps
 *   • cn() (clsx + tailwind-merge) for className composition
 *   • CVA variants in place of BEM modifiers — sanctioned by SKILL.md when
 *     the Tailwind + ADS bridge is in use (see references/tailwind-bridge.md)
 *   • Every color/spacing utility (bg-ams-*, p-ams-*, border-l-ams-*) is
 *     backed by an --ams-* token in tailwind.config.js — no raw hex/px
 *   • displayName set
 *
 * The `accent` variant is the discipline-doc principle in code: ONE highlight
 * token per page, applied to a single element.
 */

const statCard = cva(
  "flex flex-col gap-ams-xs p-ams-m bg-ams-bg border border-ams-separator",
  {
    variants: {
      accent: {
        none: "",
        azure: "border-l-4 border-l-ams-azure",
        magenta: "border-l-4 border-l-ams-magenta",
        lime: "border-l-4 border-l-ams-lime",
        orange: "border-l-4 border-l-ams-orange",
      },
    },
    defaultVariants: {
      accent: "none",
    },
  },
)

type StatCardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statCard> & {
    label: string
    value: string | number
  }

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, accent, className, ...restProps }, ref) => (
    <div
      ref={ref}
      className={cn(statCard({ accent }), className)}
      {...restProps}
    >
      <span className="text-sm font-ams text-ams-text-secondary uppercase tracking-wider">
        {label}
      </span>
      <span className="text-3xl font-extrabold font-ams text-ams-text">
        {value}
      </span>
    </div>
  ),
)

StatCard.displayName = "StatCard"
