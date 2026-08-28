import { PatientRecord } from "../types/distribution";

export const MOCK_PATIENT_NORMAL: PatientRecord = {
  id: "pat-102",
  name: "Amine TAZI",
  room: "Chb 102",
  ipp: "IPP-883921",
  isFasting: false,
  trayMatched: true,
};

export const MOCK_PATIENT_FASTING: PatientRecord = {
  id: "pat-105",
  name: "Amine TAZI",
  room: "Chb 105",
  ipp: "IPP-992011",
  isFasting: true,
  fastingReason: "Intervention chirurgicale prévue",
  trayMatched: false,
};
