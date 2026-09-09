import type { ButtonHTMLAttributes, ReactNode } from "react";
import Icon from "./icon";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "bare"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ClickableButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Controls the height, padding and radius of the button. */
  size?: ButtonSize;
  /** Optional leading icon (replaced by a spinner while `loading`). */
  leftIcon?: ReactNode;
  /** Optional trailing icon. */
  rightIcon?: ReactNode;
  /** Shows a spinner, disables the button and prevents interactions. */
  loading?: boolean;
  /** Text displayed while `loading` (defaults to `children`). */
  loadingText?: string;
  /** Expands the button to fill the available width. */
  fullWidth?: boolean;
}

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-medium text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0 [&_svg]:text-current";

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-5",
  /* Icon-only button: square, no horizontal padding. */
  icon: "h-10 w-10 px-0",
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary",
  secondary:
    "border border-border bg-surface text-foreground hover:border-primary hover:text-primary focus-visible:ring-primary",
  ghost:
    "bg-transparent text-muted-foreground hover:text-primary focus-visible:ring-primary",
  success:
    "bg-success text-white hover:brightness-90 active:brightness-80 focus-visible:ring-success",
  warning:
    "bg-warning text-white hover:brightness-90 active:brightness-80 focus-visible:ring-warning",
  danger:
    "bg-danger text-white hover:brightness-90 active:brightness-80 focus-visible:ring-danger",
  info: "bg-info text-white hover:brightness-90 active:brightness-80 focus-visible:ring-info",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover active:brightness-80 focus-visible:ring-accent",
  /* No built-in styles: the caller provides everything via className. */
  bare: "",
};

export default function ClickableButton({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  loadingText,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ClickableButtonProps) {
  const isDisabled = disabled || loading;
  const resolvedLabel = loading && loadingText ? loadingText : children;

  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Icon
          name="LoaderCircle"
          size="small"
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {resolvedLabel}
      {!loading && rightIcon}
    </button>
  );
}