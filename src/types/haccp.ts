export interface ColdRoomItem {
  id: string;
  name: string;
  code: string;
  icon: string;
  currentTemp: string;
  targetRange: string;
  isConforming: boolean;
  gradientFrom: string;
}

export interface SampleMeal {
  id: string;
  preparation: string;
  lot: string;
  dateTime: string;
  weight: string;
  expiryDateTime: string;
  status: "active" | "destroyed";
  statusLabel: string;
}
