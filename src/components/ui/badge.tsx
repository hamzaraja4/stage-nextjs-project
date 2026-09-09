import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-muted-foreground",
  primary: "bg-primary-light text-primary",
  secondary: "bg-surface text-foreground border border-border",
  success: "bg-success-light text-success-foreground",
  warning: "bg-warning-light text-warning-foreground",
  danger: "bg-danger-light text-danger-foreground",
  info: "bg-info-light text-info-foreground",
  accent: "bg-accent-light text-accent",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-component py-micro text-label whitespace-nowrap ${badgeStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

