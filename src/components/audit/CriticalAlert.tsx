import React from "react";
import { Icon } from "../ui/Icon";

interface CriticalAlertProps {
  title?: string;
  description?: string;
  onIntervene?: () => void;
}

export const CriticalAlert: React.FC<CriticalAlertProps> = ({
  title = "🚨 PLATEAU NON IDENTIFIÉ",
  description = "Écart détecté au SAS Cuisine - Scan manquant.",
  onIntervene,
}) => {
  return (
    <div className="bg-[#610017] text-white border border-[#E11D48] rounded p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pulse-border shadow-xs">
      <div className="flex items-center space-x-3">
        <Icon name="warning" className="text-[32px] text-white shrink-0" />
        <div>
          <h3 className="text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em]">
            {title}
          </h3>
          <p className="text-[13px] leading-[18px] text-white/90 mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={onIntervene}
        type="button"
        className="px-4 py-2 bg-white text-[#610017] rounded text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] hover:bg-[#E1E2E8] transition-colors shrink-0 active:scale-95 cursor-pointer"
      >
        INTERVENIR
      </button>
    </div>
  );
};
