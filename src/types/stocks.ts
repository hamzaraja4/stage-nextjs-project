export interface StockKpi {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trendIcon?: string;
  trendText?: string;
  badgeText?: string;
  isOrangeAlert?: boolean;
}

export interface InventoryItem {
  id: string;
  article: string;
  lot: string;
  quantity: number;
  unit: string;
  dlc: string;
  supplier: string;
  status: "ok" | "warning" | "error";
  statusTitle: string;
}

export interface ReorderSuggestion {
  id: string;
  article: string;
  currentQty: number;
  thresholdQty: number;
  unit: string;
  supplier: string;
  suggestedQty: number;
  statusType: "warning" | "error";
}

export interface InterconnectionMetrics {
  beds: number;
  discharges: number;
  companion: number;
  latencyMs: number;
}
