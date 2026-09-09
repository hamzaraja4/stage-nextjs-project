type MetricTone =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

const TONE_BG: Record<MetricTone, string> = {
  default: "bg-muted",
  primary: "bg-primary",
  secondary: "bg-border-strong",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
};

/**
 * Barre de métrique compacte avec pourcentage.
 * Réutilisée par les tableaux de métriques et fiches détail.
 */
export default function MetricBar({
  value,
  tone,
}: {
  value: number;
  tone: MetricTone;
}) {
  const width = Math.min(100, Math.max(2, value));
  return (
    <div className="flex items-center gap-inline">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={`h-full rounded-full ${TONE_BG[tone]}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-small text-muted-foreground">
        {value.toFixed(0)} %
      </span>
    </div>
  );
}

export { type MetricTone };
