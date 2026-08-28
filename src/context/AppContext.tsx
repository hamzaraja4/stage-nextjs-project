"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AuditEntry {
  id: string;
  time: string;
  patient: string;
  ipp: string;
  location: string;
  agent: string;
  mealType: string;
  scanResult: string;
  scanDuration: string;
  status: "Certifié" | "Fraude" | "En attente";
}

export interface QRModalData {
  patient: string;
  loc: string;
  regime: string;
  token: string;
}

interface AppContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // A JEUN Alert state
  aJeunAlertActive: boolean;
  triggerAJeun: (patientName: string) => void;
  dismissAJeun: () => void;
  blockedCount: number;

  // Modals
  qrModal: QRModalData | null;
  openQRModal: (data: QRModalData) => void;
  closeQRModal: () => void;
  
  isMiseAJeunModalOpen: boolean;
  openMiseAJeunModal: () => void;
  closeMiseAJeunModal: () => void;

  // Role simulation
  simulatedRole: string;
  setSimulatedRole: (role: string) => void;

  // POS State
  posBalance: number;
  rechargePosBalance: (amount: number) => void;
  debitPosBalance: (amount: number) => boolean;

  // Audit logs state
  auditLogs: AuditEntry[];
  addAuditLog: (entry: AuditEntry) => void;
}

const initialAuditLogs: AuditEntry[] = [
  {
    id: "1",
    time: "11:58:12",
    patient: "Amine TAZI",
    ipp: "2026-9812",
    location: "Chirurgie • Ch. 101 Lit A",
    agent: "Inf. Fatima Zahra",
    mealType: "Déjeuner Normal",
    scanResult: "Conforme",
    scanDuration: "320ms",
    status: "Certifié",
  },
  {
    id: "2",
    time: "11:54:02",
    patient: "Khadija BENJELLOUN",
    ipp: "2026-8831",
    location: "Médecine • Ch. 208 Lit A",
    agent: "Inf. Rachid N.",
    mealType: "Sans Sel + Extra Acc.",
    scanResult: "Conforme",
    scanDuration: "280ms",
    status: "Certifié",
  },
  {
    id: "3",
    time: "11:42:19",
    patient: "Mohamed CHRAIBI",
    ipp: "2026-7719",
    location: "Maternité • Ch. 302 Lit B",
    agent: "Inf. Salma K.",
    mealType: "Déjeuner Normal",
    scanResult: "Conforme",
    scanDuration: "410ms",
    status: "Certifié",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aJeunAlertActive, setAJeunAlertActive] = useState(false);
  const [blockedCount, setBlockedCount] = useState(1);
  const [qrModal, setQrModal] = useState<QRModalData | null>(null);
  const [isMiseAJeunModalOpen, setIsMiseAJeunModalOpen] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState("chef");
  const [posBalance, setPosBalance] = useState(145.0);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(initialAuditLogs);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const triggerAJeun = (_patientName: string) => {
    setAJeunAlertActive(true);
    setBlockedCount(2);
    setIsMiseAJeunModalOpen(false);
  };

  const dismissAJeun = () => {
    setAJeunAlertActive(false);
  };

  const openQRModal = (data: QRModalData) => setQrModal(data);
  const closeQRModal = () => setQrModal(null);

  const openMiseAJeunModal = () => setIsMiseAJeunModalOpen(true);
  const closeMiseAJeunModal = () => setIsMiseAJeunModalOpen(false);

  const rechargePosBalance = (amount: number) => {
    setPosBalance((prev) => prev + amount);
  };

  const debitPosBalance = (amount: number) => {
    if (posBalance >= amount) {
      setPosBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addAuditLog = (entry: AuditEntry) => {
    setAuditLogs((prev) => [entry, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        aJeunAlertActive,
        triggerAJeun,
        dismissAJeun,
        blockedCount,
        qrModal,
        openQRModal,
        closeQRModal,
        isMiseAJeunModalOpen,
        openMiseAJeunModal,
        closeMiseAJeunModal,
        simulatedRole,
        setSimulatedRole,
        posBalance,
        rechargePosBalance,
        debitPosBalance,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
