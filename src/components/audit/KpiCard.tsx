import React from "react";
import { KpiMetric } from "../../types/audit";

interface KpiCardProps {
  metric: KpiMetric;
}

export const KpiCard: React.FC<KpiCardProps> = ({ metric }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] p-6 rounded flex flex-col justify-center relative overflow-hidden shadow-2xs">
      {metric.hasCriticalRightBar && (
        <div
          className="absolute right-0 top-0 bottom-0 w-2 bg-[#E11D48]"
          aria-hidden="true"
        />
      )}
      <span
        className={`text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] mb-2 ${
          metric.labelColor || "text-[#10B981]"
        }`}
      >
        {metric.label}
      </span>
      <div className="text-[40px] leading-[48px] font-bold text-[#191C20] tracking-[-0.02em]">
        {metric.value}
      </div>
      <span className="text-[13px] leading-[18px] text-[#43474E] mt-2 font-normal">
        {metric.description}
      </span>
    </div>
  );
};
