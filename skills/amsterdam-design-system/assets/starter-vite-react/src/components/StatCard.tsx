import { forwardRef, type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

/*
 * StatCard — example of a custom component built ON TOP of AMS tokens.
 *
 * Rules followed (see SKILL.md → "Custom Components"):
 *   • forwardRef + spread restProps
 *   • clsx (via cn helper) for className composition
 *   • BEM-style root class with `ams-` prefix would normally apply, but for
 *     a CVA-based variant component we use Tailwind utilities mapped to AMS
 *     tokens via tailwind.config.js — no hardcoded values
 *   • All colors and spacing reference --ams-* tokens, never raw hex
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
