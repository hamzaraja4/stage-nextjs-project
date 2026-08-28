import React from "react";
import { Icon } from "../ui/Icon";
import { StrategicKpiItem } from "../../types/pilotage";

interface StrategicKpiCardProps {
  kpi: StrategicKpiItem;
}

export const StrategicKpiCard: React.FC<StrategicKpiCardProps> = ({ kpi }) => {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-2 relative overflow-hidden group shadow-2xs transition-all hover:shadow-xs ${
        kpi.isAlert ? "border-l-4 border-l-[#E11D48]" : ""
      }`}
    >
      {/* Giant Watermark Icon */}
      <div
        className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity select-none pointer-events-none"
        aria-hidden="true"
      >
        <Icon
          name={kpi.watermarkIcon}
          className={`text-6xl ${kpi.watermarkColorClass}`}
        />
      </div>

      {/* Label */}
      <span className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-wider">
        {kpi.label}
      </span>

      {/* Value and Unit */}
      <div className="flex items-baseline gap-2">
        <span
          className={`text-[40px] leading-[48px] font-bold tracking-[-0.02em] ${
            kpi.valueColorClass || "text-[#001932]"
          }`}
        >
          {kpi.value}
        </span>
        <span className="text-[14px] leading-[20px] text-[#43474E] font-normal">
          {kpi.unit}
        </span>
      </div>

      {/* Trend / Status Indicator */}
      <div className={`flex items-center gap-1.5 ${kpi.trend.colorClass} mt-1`}>
        <Icon name={kpi.trend.icon} className="text-[16px]" />
        <span className="text-[13px] leading-[18px] font-medium font-mono">
          {kpi.trend.label}
        </span>
      </div>
    </div>
  );
};
