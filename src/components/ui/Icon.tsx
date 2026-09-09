import type { SVGProps } from "react";
import { icons, type LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Icon - centralized interface icon                                  */
/*                                                                     */
/*  Single source of truth for icons. Only pick `name`, `variant` and  */
/*  `size` from the allowed values defined by the Design System.       */
/* ------------------------------------------------------------------ */

/** Available icon sizes from the Iconography section. */
export type IconSize = "small" | "default" | "large" | "display";

/** Available icon variants, aligned with the Design System colors. */
export type IconVariant =
  | "default"
  | "muted"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "white";

/** Every exported Lucide icon name (e.g. "Search", "ArrowRight"). */
export type IconName = keyof typeof icons;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "size"> {
  /** The Lucide icon name to render. */
  name: IconName;
  /** Color variant; defaults to a neutral foreground icon. */
  variant?: IconVariant;
  /** Size variant following the Iconography tokens. */
  size?: IconSize;
  /** Overrides the Design System default stroke weight (1.8). */
  strokeWidth?: number;
  className?: string;
}

/** Fallback base class: keeps the icon from shrinking inside flex rows. */
const BASE_CLASS = "shrink-0";

const SIZE_CLASS: Record<IconSize, string> = {
  small: "size-[var(--icon-small)]",
  default: "size-[var(--icon-default)]",
  large: "size-[var(--icon-large)]",
  display: "size-[var(--icon-display)]",
};

const VARIANT_CLASS: Record<IconVariant, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  /* White icon intended for colored surfaces (nav items, brand badges). */
  white: "text-white",
};

export default function Icon({
  name,
  variant = "default",
  size = "default",
  strokeWidth = 1.8,
  className = "",
  ...props
}: IconProps) {
  const IconComponent: LucideIcon = icons[name];

  return (
    <IconComponent
      aria-hidden="true"
      strokeWidth={strokeWidth}
      className={`${BASE_CLASS} ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}