import { AuditLogEntry, ControlLevel, KpiMetric, NavItem, RoleQuickSwitch } from "../types/audit";

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    label: "Production & Patients",
    icon: "clinical_notes",
    href: "#",
    isActive: false,
  },
  {
    label: "Mobility & Control",
    icon: "precision_manufacturing",
    href: "#",
    isActive: false,
  },
  {
    label: "Self & Stocks",
    icon: "inventory_2",
    href: "#",
    isActive: false,
  },
  {
    label: "Admin",
    icon: "admin_panel_settings",
    href: "#",
    isActive: true,
  },
];

export const ROLE_QUICK_SWITCHES: RoleQuickSwitch[] = [
  { id: "1", icon: "medical_services", title: "Médical" },
  { id: "2", icon: "restaurant", title: "Restauration" },
  { id: "3", icon: "person", title: "Personnel" },
  { id: "4", icon: "receipt_long", title: "Facturation" },
  { id: "5", icon: "manage_accounts", title: "Administration" },
];

export const KPI_METRICS: KpiMetric[] = [
  {
    id: "unidentified",
    label: "Non Identifiés",
    value: "0",
    description: "Plateau non identifié",
    labelColor: "text-[#10B981]",
  },
  {
    id: "double_scan",
    label: "Double Scan",
    value: "0",
    description: "Double scan invalide",
    labelColor: "text-[#10B981]",
  },
  {
    id: "material_discrepancy",
    label: "Écart Matières",
    value: "1,2%",
    description: "Sur la journée courante",
    labelColor: "text-[#43474E]",
    hasCriticalRightBar: true,
  },
];

export const AUDIT_LOG_ENTRIES: AuditLogEntry[] = [
  {
    id: "log-1",
    time: "12:45:32",
    patientIpp: "IPP-883921",
    agent: "Durand, M.",
    sasControl: "OK - 12:30",
    sasControlStatus: "success",
    statusBadge: {
      label: "PLT_06",
      icon: "done_all",
      variant: "standard",
    },
    isRealtimeActive: true,
  },
  {
    id: "log-2",
    time: "12:42:15",
    patientIpp: "IPP-992011",
    agent: "Martin, L.",
    sasControl: "OK - 12:28",
    sasControlStatus: "success",
    statusBadge: {
      label: "PLT_05",
      icon: "local_shipping",
      variant: "standard",
    },
  },
  {
    id: "log-3",
    time: "12:39:05",
    patientIpp: "INCONNU",
    agent: "Automatisé",
    sasControl: "ÉCHEC SAS",
    sasControlStatus: "error",
    statusBadge: {
      label: "ALERTE",
      icon: "error",
      variant: "alert",
    },
    isAlertRow: true,
  },
];

export const CONTROL_LEVELS: ControlLevel[] = [
  {
    id: "ctrl-1",
    name: "QR Code Unique",
    statusLabel: "Validé",
    statusType: "success",
    icon: "check_circle",
  },
  {
    id: "ctrl-2",
    name: "SAS Cuisine",
    statusLabel: "Validé",
    statusType: "success",
    icon: "check_circle",
  },
  {
    id: "ctrl-3",
    name: "Double Scan",
    statusLabel: "Validé",
    statusType: "success",
    icon: "check_circle",
  },
  {
    id: "ctrl-4",
    name: "Timeout 45m",
    statusLabel: "Actif",
    statusType: "success",
    icon: "check_circle",
  },
  {
    id: "ctrl-5",
    name: "Audit Matières",
    statusLabel: "1,2% Écart",
    statusType: "warning",
    icon: "warning",
  },
];
