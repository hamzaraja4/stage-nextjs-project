import React from "react";
import { Icon } from "../ui/Icon";
import { CONTROL_LEVELS } from "../../data/mockAuditData";

export const ControlLevelsCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 shadow-2xs">
      <h3 className="text-[18px] leading-[24px] font-semibold text-[#191C20] mb-4">
        5 Niveaux de Contrôle
      </h3>

      <div className="space-y-2">
        {CONTROL_LEVELS.map((level) => {
          const isWarning = level.statusType === "warning";

          return (
            <div
              key={level.id}
              className={`flex items-center justify-between p-2 rounded border transition-all ${
                isWarning
                  ? "bg-[#FFDAD6]/30 border-[#E11D48]/50 pulse-border"
                  : "bg-[#F8F9FF] border-[#E1E2E8]"
              }`}
            >
              {/* Level label with status icon */}
              <span className="text-[13px] leading-[18px] text-[#191C20] flex items-center gap-2 font-normal">
                <Icon
                  name={level.icon}
                  className={`text-[16px] ${
                    isWarning ? "text-[#E11D48]" : "text-[#10B981]"
                  }`}
                />
                {level.name}
              </span>

              {/* Status text */}
              <span
                className={`text-[13px] leading-[18px] font-medium ${
                  isWarning ? "text-[#E11D48] font-bold" : "text-[#10B981]"
                }`}
              >
                {level.statusLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
