import React from "react";
import { Icon } from "../ui/Icon";
import { ValidationStatus } from "../../types/distribution";

interface ScanFeedbackCardProps {
  status: ValidationStatus;
  patientName?: string;
  room?: string;
  fastingReason?: string;
}

export const ScanFeedbackCard: React.FC<ScanFeedbackCardProps> = ({
  status,
  patientName = "Amine TAZI",
  room = "Chb 102",
  fastingReason = "Intervention chirurgicale prévue",
}) => {
  if (status === "idle") return null;

  if (status === "success") {
    return (
      <div className="mt-2 p-4 bg-[#F8F9FF] border border-[#C3C6CF] rounded-xl shadow-xs transition-all animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#001932]/10 rounded-full flex items-center justify-center text-[#001932] shrink-0">
            <Icon name="check_circle" filled className="text-[26px]" />
          </div>
          <div>
            <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932]">
              Plateau Conforme
            </h3>
            <p className="text-[13px] leading-[18px] text-[#43474E]">
              {patientName} • {room}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "warning_fasting") {
    return (
      <div className="mt-2 p-4 bg-[#FFDAD6] border-2 border-[#BA1A1A] rounded-xl shadow-xs pulse-border transition-all animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#BA1A1A]/10 rounded-full flex items-center justify-center text-[#BA1A1A] shrink-0">
            <Icon name="warning" filled className="text-[26px]" />
          </div>
          <div>
            <h3 className="text-[18px] leading-[24px] font-bold text-[#BA1A1A]">
              PATIENT À JEUN
            </h3>
            <p className="text-[13px] leading-[18px] text-[#93000A] font-medium">
              {fastingReason}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
