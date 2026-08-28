"use client";

import React from "react";
import { Icon } from "../ui/Icon";

interface TrayScanStepProps {
  isStep1Completed: boolean;
  isCompleted: boolean;
  onScanTray: () => void;
}

export const TrayScanStep: React.FC<TrayScanStepProps> = ({
  isStep1Completed,
  isCompleted,
  onScanTray,
}) => {
  const isEnabled = isStep1Completed;

  return (
    <div
      onClick={isEnabled ? onScanTray : undefined}
      className={`flex flex-col gap-2 relative transition-all ${
        !isEnabled
          ? "opacity-50 pointer-events-none"
          : "cursor-pointer group"
      }`}
    >
      {/* Step Header */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] leading-[16px] font-semibold text-[#0B1C30]">
          Étape 2
        </span>
        <span
          className={`text-[12px] leading-[16px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
            isCompleted
              ? "bg-[#10B981]/15 text-[#10B981]"
              : isEnabled
              ? "bg-[#D2E4FF] text-[#001932]"
              : "bg-[#D3E4FE] text-[#43474E]"
          }`}
        >
          {isCompleted ? "Plateau Validé ✓" : "Plateau"}
        </span>
      </div>

      {/* Tray Viewfinder */}
      <div
        className={`relative w-full h-32 bg-white border-2 border-dashed rounded-xl flex items-center justify-center transition-all shadow-2xs ${
          isCompleted
            ? "border-[#10B981] bg-[#10B981]/5 text-[#10B981]"
            : isEnabled
            ? "border-[#3A618B] hover:border-[#001932] text-[#3A618B] pulse-border"
            : "border-[#C3C6CF] text-[#C3C6CF]"
        }`}
      >
        <div className="flex flex-col items-center gap-1.5">
          <Icon
            name={isCompleted ? "check_circle" : "qr_code_scanner"}
            filled={isCompleted}
            className={`text-4xl transition-transform ${
              isEnabled && !isCompleted ? "group-hover:scale-110" : ""
            }`}
          />
          <span className="text-[12px] font-medium">
            {isCompleted
              ? "QR Code Plateau Conforme"
              : isEnabled
              ? "Scanner le QR Code du Plateau"
              : "En attente de l'étape 1"}
          </span>
        </div>
      </div>
    </div>
  );
};
