export interface StrategicKpiItem {
  id: string;
  label: string;
  value: string;
  unit: string;
  watermarkIcon: string;
  watermarkColorClass: string;
  trend: {
    label: string;
    icon: string;
    colorClass: string;
  };
  valueColorClass?: string;
  isAlert?: boolean;
}
