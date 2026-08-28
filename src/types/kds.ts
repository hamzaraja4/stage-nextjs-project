export type Department = "Chirurgie" | "Médecine" | "Maternité";

export type DietType =
  | "Tous les régimes"
  | "Normal"
  | "Sans Sel Strict"
  | "Diabétique";

export interface PatientTrayItem {
  id: string;
  patientName: string;
  room: string;
  service: Department;
  ipp: string;
  dietName: string;
  dietDotColor: string;
  badgeType: "qr" | "fasting_blocked" | "companion";
  badgeLabel: string;
  badgeIcon: string;
  isFastingBlocked?: boolean;
  blockedReason?: string;
  hasCompanion?: boolean;
}
