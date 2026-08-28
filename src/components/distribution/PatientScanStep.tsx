"use client";

import React from "react";
import { Icon } from "../ui/Icon";

interface PatientScanStepProps {
  isCompleted: boolean;
  onScanPatient: () => void;
  patientName?: string;
}

export const PatientScanStep: React.FC<PatientScanStepProps> = ({
  isCompleted,
  onScanPatient,
  patientName,
}) => {
  return (
    <div
      onClick={onScanPatient}
      className="flex flex-col gap-2 relative group cursor-pointer"
    >
      {/* Step Header */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] leading-[16px] font-semibold text-[#0B1C30]">
          Étape 1
        </span>
        <span
          className={`text-[12px] leading-[16px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
            isCompleted
              ? "bg-[#10B981]/15 text-[#10B981]"
              : "bg-[#D2E4FF] text-[#001932]"
          }`}
        >
          {isCompleted ? "Patient Validé ✓" : "Patient"}
        </span>
      </div>

      {/* Camera Viewfinder */}
      <div
        className={`relative w-full h-48 bg-[#EFF4FF] border-2 border-dashed rounded-xl overflow-hidden transition-all shadow-2xs ${
          isCompleted
            ? "border-[#10B981] bg-[#10B981]/5"
            : "border-[#C3C6CF] pulse-border hover:border-[#3A618B]"
        }`}
      >
        {/* Camera Feed Simulation Overlay */}
        <div className="absolute inset-0 bg-[#3A618B]/5" aria-hidden="true" />
        {!isCompleted && (
          <div className="absolute inset-0 scan-overlay" aria-hidden="true" />
        )}

        {/* Target Reticle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-[#3A618B]/50 rounded-lg relative">
            {/* Corner Marks */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#001932]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#001932]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#001932]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#001932]" />

            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center text-[#10B981] animate-scale-in">
                <Icon name="check_circle" filled className="text-[44px]" />
              </div>
            )}
          </div>
        </div>

        {/* Overlay Text Pill */}
        <div className="absolute bottom-4 left-0 w-full text-center">
          <p className="text-[13px] leading-[18px] text-[#3A618B] bg-[#F8F9FF]/90 px-3 py-1 rounded-full inline-block backdrop-blur-xs shadow-xs font-medium">
            {isCompleted
              ? `Bracelet Validé : ${patientName || "Amine TAZI"}`
              : "Scanner Bracelet Patient"}
          </p>
        </div>
      </div>
    </div>
  );
};
