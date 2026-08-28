import { StrategicKpiItem } from "../types/pilotage";

export const STRATEGIC_KPIS: StrategicKpiItem[] = [
  {
    id: "kpi-cost",
    label: "Coût Moyen par Plateau",
    value: "4.82",
    unit: "€",
    watermarkIcon: "euro",
    watermarkColorClass: "text-[#0284C7]",
    trend: {
      label: "-2.4% vs M-1",
      icon: "trending_down",
      colorClass: "text-[#10B981]",
    },
  },
  {
    id: "kpi-haccp",
    label: "Taux de Conformité HACCP",
    value: "99.8",
    unit: "%",
    watermarkIcon: "verified",
    watermarkColorClass: "text-[#10B981]",
    trend: {
      label: "Objectif atteint",
      icon: "check_circle",
      colorClass: "text-[#10B981]",
    },
  },
  {
    id: "kpi-scan",
    label: "Taux Double Scan",
    value: "94.5",
    unit: "%",
    watermarkIcon: "qr_code_scanner",
    watermarkColorClass: "text-[#0284C7]",
    trend: {
      label: "+1.2% (semaine)",
      icon: "trending_up",
      colorClass: "text-[#43474E]",
    },
  },
  {
    id: "kpi-waste",
    label: "Gaspillage Alimentaire",
    value: "12.4",
    unit: "% vol.",
    watermarkIcon: "delete_sweep",
    watermarkColorClass: "text-[#E11D48]",
    valueColorClass: "text-[#E11D48]",
    isAlert: true,
    trend: {
      label: "Seuil d'alerte > 10%",
      icon: "warning",
      colorClass: "text-[#E11D48]",
    },
  },
];
