import type { ReactNode } from "react";
import { Badge, Icon } from "@/components/ui";
import type { IconName } from "@/components/ui";

/**
 * Section de page avec en-tête (icône + titre + compteur) et contenu libre.
 * Réutilisée par les onglets équipement et autres sections de tableau.
 */
export default function TableSection({
  icon,
  title,
  count,
  children,
}: {
  icon: IconName;
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-inline">
        <div className="flex items-center gap-inline">
          <Icon name={icon} variant="muted" aria-hidden="true" />
          <h3 className="text-component-title text-foreground">{title}</h3>
        </div>
        {typeof count === "number" && (
          <Badge variant="secondary">{count}</Badge>
        )}
      </div>
      <div className="mt-component flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </section>
  );
}
