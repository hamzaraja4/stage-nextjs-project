import Icon from "./icon";
import type { IconSize } from "./icon";

export interface LoaderProps {
  /** Message displayed under the spinner (also announced to screen readers). */
  message?: string;
  /** Spinner size token (see Iconography). */
  size?: IconSize;
  /**
   * - "overlay" (default): absolute overlay over the nearest positioned
   *   (relative) parent — modal body, card, section…
   * - "inline": centered block in the normal flow — no positioning required.
   */
  variant?: "overlay" | "inline";
  /** Covers the whole viewport (fixed) — use for full-page data loading. */
  fullScreen?: boolean;
  className?: string;
}

/**
 * Chargement réutilisable — même visuel partout (page, modale, section…).
 * - `<Loader fullScreen message="…" />` : couvre tout l'écran (page dont les
 *   données sont en cours de chargement) ;
 * - `<Loader message="…" />` : superposition dans le parent positionné
 *   (`relative`) — corps de modale, carte, section ;
 * - `<Loader variant="inline" message="…" />` : bloc centré dans le flux.
 */
export default function Loader({
  message,
  size = "large",
  variant = "overlay",
  fullScreen = false,
  className = "",
}: LoaderProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-inline"
    >
      <Icon
        name="LoaderCircle"
        size={size}
        variant="primary"
        className="animate-spin"
        aria-hidden="true"
      />
      {message && <p className="text-small text-muted-foreground">{message}</p>}
      <span className="sr-only">{message ?? "Chargement en cours"}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm ${className}`}
      >
        {content}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex justify-center py-component ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm ${className}`}
    >
      {content}
    </div>
  );
}