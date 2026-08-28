export interface AuditLogEntry {
  id: string;
  time: string;
  patientIpp: string;
  agent: string;
  sasControl: string;
  sasControlStatus: "success" | "error";
  statusBadge: {
    label: string;
    icon: string;
    variant: "standard" | "alert";
  };
  isRealtimeActive?: boolean;
  isAlertRow?: boolean;
}

export interface ControlLevel {
  id: string;
  name: string;
  statusLabel: string;
  statusType: "success" | "warning";
  icon: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  labelColor?: string;
  hasCriticalRightBar?: boolean;
}

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

export interface RoleQuickSwitch {
  id: string;
  icon: string;
  title: string;
}
