"use client";


import { usePathname, useRouter } from "next/navigation";
import { ClickableButton, Icon } from "@/components/ui";


const HEADER_META: Record<string, { title: string; description?: string }> = {
  "/": {
    title: "Distribution des Plateaux",
    description: "Ordonnancement, régimes diététiques et scellé par QR Code cryptographique.",
  },
  "/distribution": {
    title: "Distribution des Plateaux",
    description: "Ordonnancement, régimes diététiques et scellé par QR Code cryptographique.",
  },
  "/production": {
    title: "Menu du Jour & Répartition",
    description: "Planification culinaire en cuisine centrale et décompte des portions par régime.",
  },
  "/logistique": {
    title: "Contrôle & Départ Chariots",
    description: "Suivi des chariots isothermes, respect des liaisons thermiques et frigos relais.",
  },
  "/mobile": {
    title: "Terminal Mobile Soignant",
    description: "Procédure inviolable de double scan au chevet du patient (IPP + QR Plateau).",
  },
  "/antifraude": {
    title: "Audit Anti-Fraude",
    description: "Journal d'audit temps réel infalsifiable et réconciliation des repas servis.",
  },
  "/pos": {
    title: "Cantine Personnel & Caisse POS",
    description: "Identification par badge RFID, débit instantané et formule de garde de nuit.",
  },
  "/stocks": {
    title: "Stocks & Réapprovisionnement",
    description: "Suivi des denrées en économat selon la méthode FEFO et bons de commande automatiques.",
  },
  "/haccp": {
    title: "Contrôle Qualité & HACCP",
    description: "Surveillance IoT des chambres froides, liaison chaude et plats témoins 7 jours.",
  },
  "/design-system": {
    title: "Design System",
    description: "Catalogue des fondations visuelles, tokens sémantiques et composants réutilisables.",
  },
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const meta =
    HEADER_META[pathname] ?? {
      title: "HIS-Catering",
      description: "Système de Restauration Hospitalière & Sécurité Alimentaire",
    };

  const handleRefresh = () => {
    router.refresh();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="flex items-center justify-between bg-surface border-b border-border px-component py-control shrink-0">
      <div className="flex min-w-0 items-center gap-inline">
        <ClickableButton
          type="button"
          onClick={handleBack}
          variant="ghost"
          aria-label="Revenir à la page précédente"
          title="Page précédente"
          className="shrink-0 px-2"
        >
          <Icon name="ArrowLeft" aria-hidden="true" />
        </ClickableButton>
        <div className="min-w-0">
          <h1 className="truncate text-component-title font-bold text-foreground">
            {meta.title}
          </h1>
          {meta.description && (
            <p className="truncate text-small text-muted-foreground hidden sm:block">
              {meta.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-inline">
        <ClickableButton
          type="button"
          onClick={handleRefresh}
          variant="secondary"
          size="sm"
        >
          <Icon name="RefreshCw" size="small" aria-hidden="true" />
          Actualiser
        </ClickableButton>
      </div>
    </header>
  );
}
