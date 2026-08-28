import {
  StockKpi,
  InventoryItem,
  ReorderSuggestion,
  InterconnectionMetrics,
} from "../types/stocks";

export const MOCK_INTERCONNECTION: InterconnectionMetrics = {
  beds: 242,
  discharges: 12,
  companion: 48,
  latencyMs: 14,
};

export const MOCK_STOCK_KPIS: StockKpi[] = [
  {
    id: "kpi-value",
    title: "VALEUR STOCK",
    value: "24.5k€",
    subtitle: "+2.4% cette semaine",
    trendIcon: "trending_up",
    trendText: "+2.4% cette semaine",
  },
  {
    id: "kpi-threshold",
    title: "ARTICLES SOUS SEUIL",
    value: "08",
    subtitle: "2 alertes critiques",
    badgeText: "2 alertes critiques",
    isOrangeAlert: true,
  },
  {
    id: "kpi-dlc",
    title: "DLC < J-3",
    value: "14",
    subtitle: "Lots à utiliser prioritairement",
  },
  {
    id: "kpi-orders",
    title: "CMDES EN COURS",
    value: "05",
    subtitle: "2 livraisons prévues auj.",
    trendIcon: "local_shipping",
    trendText: "2 livraisons prévues auj.",
  },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "inv-1",
    article: "Bœuf haché 5%",
    lot: "L-9021",
    quantity: 45.0,
    unit: "kg",
    dlc: "12/10/2023",
    supplier: "Viandes & Co",
    status: "ok",
    statusTitle: "OK",
  },
  {
    id: "inv-2",
    article: "Saumon frais entier",
    lot: "L-8832",
    quantity: 8.0,
    unit: "kg",
    dlc: "09/10/2023",
    supplier: "Marée Bleue",
    status: "warning",
    statusTitle: "Sous seuil (10kg)",
  },
  {
    id: "inv-3",
    article: "Pommes de terre grenailles",
    lot: "L-7741",
    quantity: 120.0,
    unit: "kg",
    dlc: "25/10/2023",
    supplier: "Agri-Local",
    status: "ok",
    statusTitle: "OK",
  },
  {
    id: "inv-4",
    article: "Lait demi-écrémé UHT",
    lot: "L-6522",
    quantity: 24.0,
    unit: "L",
    dlc: "08/10/2023",
    supplier: "Laiterie Centrale",
    status: "error",
    statusTitle: "DLC Critique / Sous seuil",
  },
  {
    id: "inv-5",
    article: "Carottes râpées",
    lot: "L-5510",
    quantity: 35.5,
    unit: "kg",
    dlc: "11/10/2023",
    supplier: "Agri-Local",
    status: "ok",
    statusTitle: "OK",
  },
];

export const MOCK_REORDER_SUGGESTIONS: ReorderSuggestion[] = [
  {
    id: "reorder-1",
    article: "Saumon frais entier",
    currentQty: 8.0,
    thresholdQty: 10.0,
    unit: "kg",
    supplier: "Marée Bleue",
    suggestedQty: 15,
    statusType: "warning",
  },
  {
    id: "reorder-2",
    article: "Lait demi-écrémé UHT",
    currentQty: 24.0,
    thresholdQty: 50.0,
    unit: "L",
    supplier: "Laiterie Cent.",
    suggestedQty: 100,
    statusType: "error",
  },
];
