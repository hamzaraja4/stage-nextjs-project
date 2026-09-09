/**
 * Entrée de timeline avec heure formatée et texte descriptif.
 */
export interface TimelineEntry {
  time: string;
  text: string;
}

/**
 * Liste d'historique avec heure et texte descriptif.
 * Réutilisée par les fiches incident et autres vues temporelles.
 */
export default function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ul className="space-y-component">
      {entries.map((entry, i) => (
        <li
          key={entry.time + "-" + entry.text + "-" + i}
          className="flex items-start gap-inline border-b border-border py-inline last:border-b-0"
        >
          <span className="w-20 shrink-0 font-mono text-body-medium text-muted-foreground">
            {entry.time}
          </span>
          <span className="min-w-0 flex-1 text-body-medium text-foreground">
            {entry.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
