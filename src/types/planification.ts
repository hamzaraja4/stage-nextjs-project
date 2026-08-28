export interface DailyMenuRow {
  id: string;
  diet: string;
  starter: string;
  mainCourse: string;
  sideDish: string;
  dessert: string;
  isHighlighted?: boolean;
}

export interface CutOffServiceItem {
  id: string;
  title: string;
  time: string;
  statusLabel: string;
  statusType: "closed" | "active" | "open" | "urgent";
  icon: string;
}

export interface MaterialRequirementRow {
  id: string;
  ingredient: string;
  plannedNeedKg: number;
  actualStockKg: number;
  incomingOrderKg: number;
  availableStockKg: number;
  isCriticalDeficit?: boolean;
}
