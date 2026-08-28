export type ScanStepNumber = 1 | 2 | 3;

export type ValidationStatus = "idle" | "success" | "warning_fasting";

export interface PatientRecord {
  id: string;
  name: string;
  room: string;
  ipp: string;
  isFasting: boolean;
  fastingReason?: string;
  trayMatched: boolean;
}
