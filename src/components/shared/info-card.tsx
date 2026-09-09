import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import type { IconName } from "@/components/ui";

/**
 * Carte d'information des fiches détail : en-tête icône + titre, corps libre.
 * Réutilisée par les fiches équipement, service et incident.
 */
export default function InfoCard({
  icon,
  title,
  children,
  scrollable = false,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
  /** Bout par défaut. Quand true, le corps est borné (max-h) et défile à l'intérieur de la carte au lieu de faire déborder / scroller la page ou le panneau qui regroupe les cartes. */
  scrollable?: boolean;
}) {
  return (
    <section className={scrollable ? "flex min-h-0 flex-col rounded-large border border-border bg-surface p-component" : "rounded-large border border-border bg-surface p-component"}>
      <header className={scrollable ? "shrink-0 flex items-center gap-inline" : "flex items-center gap-inline"}>
        <Icon name={icon} variant="muted" aria-hidden="true" />
        <h3 className="text-component-title text-foreground">{title}</h3>
      </header>
      <div
        className={scrollable ? "mt-component min-h-0 flex-1 overflow-y-auto" : "mt-component"}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * Liste label/valeur compacte affichée dans les cartes d'information.
 */
export function InfoList({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <dl>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-inline border-b border-border py-inline last:border-b-0"
        >
          <dt className="text-label text-muted-foreground">{row.label}</dt>
          <dd className="max-w-[60%] text-right text-body-medium text-foreground break-all">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}