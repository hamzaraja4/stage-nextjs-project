import type { SVGProps } from "react";
import { icons, type LucideIcon } from "lucide-react";

export type IconSize = "small" | "default" | "large" | "display";

export type IconVariant =
  | "default"
  | "muted"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "white";

export type IconName = keyof typeof icons | (string & {});

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "size"> {
  name: IconName;
  variant?: IconVariant;
  size?: IconSize;
  strokeWidth?: number;
  filled?: boolean;
  className?: string;
}

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
  white: "text-white",
};

function Icon({
  name,
  variant = "default",
  size = "default",
  strokeWidth = 1.8,
  filled = false,
  className = "",
  ...props
}: IconProps) {
  const IconComponent: LucideIcon =
    icons[name as keyof typeof icons] ?? icons.Info;

  return (
    <IconComponent
      aria-hidden="true"
      strokeWidth={strokeWidth}
      fill={filled ? "currentColor" : undefined}
      className={`${BASE_CLASS} ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}

export { Icon };
export default Icon;
