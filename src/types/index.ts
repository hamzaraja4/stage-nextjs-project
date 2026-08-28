export type RoleType =
  | "CHEF_CUISINE"
  | "SOIGNANT_ETAGE"
  | "AGENT_CAISSE"
  | "DIRECTION_QUALITE";

export type TrayStatus =
  | "PREPARATION"
  | "SCELLE_QR"
  | "A_JEUN_BLOQUE"
  | "PRET_DEPART"
  | "EN_DISTRIBUTION"
  | "LIVRE_CONFORME"
  | "DISCORDANCE";

export type CartStatus =
  | "PREPARATION"
  | "CONTROLE_EN_COURS"
  | "SCELLE_VALIDE"
  | "EN_DISTRIBUTION"
  | "TERMINE";

export interface PatientDto {
  id: string;
  ipp: string;
  firstName: string;
  lastName: string;
  service: string;
  room: string;
  bed: string;
  diet: string;
  isAJeun: boolean;
  aJeunReason?: string;
}

export interface TrayDto {
  id: string;
  patientId: string;
  patientName: string;
  ipp: string;
  service: string;
  roomBed: string;
  diet: string;
  texture: string;
  status: TrayStatus;
  qrToken: string;
  mealService: string;
  starter?: string;
  mainCourse?: string;
  sideDish?: string;
  dessert?: string;
  allergens?: string;
  isExtraAccompagnant?: boolean;
  extraDescription?: string;
  isBlocked?: boolean;
}

export interface CartDto {
  id: string;
  code: string;
  service: string;
  floor: string;
  traysCount: number;
  tempHot: number;
  tempCold: number;
  status: CartStatus;
  scannedBy?: string;
  departureTime?: string;
}

export interface AuditLogDto {
  id: string;
  timestamp: string;
  patient: string;
  ipp: string;
  location: string;
  agent: string;
  mealType: string;
  scanResult: string;
  scanDuration: string;
  status: string;
}

export interface PosArticleDto {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  icon: string;
  isNightShift?: boolean;
}

export interface StockItemDto {
  id: string;
  name: string;
  physicalStock: number;
  unit: string;
  thresholdStock: number;
  dlc: string;
  statusAlert: string;
}

export interface PurchaseOrderDto {
  id: string;
  code: string;
  supplier: string;
  itemDetails: string;
  amount?: number;
  status: "GENERE" | "TRANSMIS" | "RECU";
}

export interface HaccpColdRoomDto {
  id: string;
  name: string;
  type: string;
  temperature: number;
  normMin: number;
  normMax: number;
  lastCheckAt: string;
}

export interface SampleMealDto {
  id: string;
  mealService: string;
  content: string;
  daysLeft: number;
  isSealed: boolean;
}

export interface HotTempLogDto {
  id: string;
  dishOrDevice: string;
  temperature: number;
  isCompliant: boolean;
  recordedAt: string;
}
