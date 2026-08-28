"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { PatientTrayItem } from "../../types/kds";

interface PatientTrayCardProps {
  tray: PatientTrayItem;
}

export const PatientTrayCard: React.FC<PatientTrayCardProps> = ({ tray }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const isCritical = tray.isFastingBlocked;

  return (
    <div
      className={`rounded-lg p-5 flex flex-col gap-4 relative transition-all shadow-2xs ${
        isCritical
          ? "bg-[#BA1A1A]/5 border border-[#BA1A1A]"
          : "bg-white border border-[#C3C6CF] hover:border-[#3A618B]"
      }`}
    >
      {/* Card Header: Patient Name, Room & IPP */}
      <div
        className={`flex justify-between items-start border-b pb-3 ${
          isCritical ? "border-[#BA1A1A]/10" : "border-[#EFF4FF]"
        }`}
      >
        <div>
          <h3
            className={`text-[18px] leading-[24px] font-semibold ${
              isCritical ? "text-[#BA1A1A]" : "text-[#001932]"
            }`}
          >
            {tray.patientName}
          </h3>
          <div
            className={`text-[13px] leading-[18px] flex items-center gap-1 mt-1 ${
              isCritical ? "text-[#BA1A1A]/80" : "text-[#43474E]"
            }`}
          >
            <Icon name="local_hospital" className="text-[14px]" />
            <span>{tray.room}</span>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-[12px] font-bold uppercase tracking-[0.05em] ${
              isCritical ? "text-[#BA1A1A]/70" : "text-[#43474E]"
            }`}
          >
            IPP
          </div>
          <div
            className={`text-[13px] font-mono px-2 py-0.5 rounded mt-0.5 ${
              isCritical
                ? "bg-[#BA1A1A]/10 text-[#BA1A1A] font-bold"
                : "bg-[#EFF4FF] text-[#001932]"
            }`}
          >
            {tray.ipp}
          </div>
        </div>
      </div>

      {/* Middle Body */}
      <div className="flex-1 flex flex-col justify-center py-2">
        {isCritical ? (
          <div>
            <div className="inline-flex items-center gap-2 bg-[#BA1A1A] text-white px-3 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-[0.05em] w-fit mb-2 animate-pulse shadow-xs">
              <Icon name="no_meals" className="text-[16px]" />
              {tray.badgeLabel}
            </div>
            <p className="text-[13px] leading-[18px] text-[#BA1A1A]/80 mt-1 font-medium">
              {tray.blockedReason}
            </p>
          </div>
        ) : (
          <div>
            {/* Diet Pill */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${tray.dietDotColor}`} />
              <span className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#0B1C30]">
                {tray.dietName}
              </span>
            </div>

            {/* Feature Badge */}
            {tray.badgeType === "qr" && (
              <div className="inline-flex items-center gap-1.5 bg-[#D3E4FE] text-[#001932] px-2.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-[0.05em] w-fit">
                <Icon name="qr_code_scanner" className="text-[14px]" />
                {tray.badgeLabel}
              </div>
            )}

            {tray.badgeType === "companion" && (
              <div className="inline-flex items-center gap-1.5 bg-[#EFF4FF] text-[#001932] px-2.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-[0.05em] w-fit border border-[#C3C6CF]/40">
                <Icon name="group" className="text-[14px]" />
                {tray.badgeLabel}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div
        className={`mt-auto pt-3 border-t flex ${
          isCritical
            ? "border-[#BA1A1A]/10 justify-between items-center"
            : "border-[#EFF4FF] justify-end"
        }`}
      >
        {isCritical ? (
          <>
            <span className="text-[12px] font-bold text-[#BA1A1A]/70 flex items-center gap-1">
              <Icon name="sync_problem" className="text-[14px]" /> HIS Sync Alert
            </span>
            <button
              type="button"
              onClick={() => setIsAcknowledged(true)}
              className={`text-[12px] font-bold uppercase tracking-[0.05em] px-3 py-1.5 rounded transition-all cursor-pointer ${
                isAcknowledged
                  ? "bg-[#10B981] text-white"
                  : "bg-[#BA1A1A] text-white hover:opacity-90 active:scale-95"
              }`}
            >
              {isAcknowledged ? "Acquitté ✓" : "Acquitter"}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#3A618B] hover:bg-[#3A618B]/10 px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            Détails <Icon name="arrow_forward" className="text-[16px]" />
          </button>
        )}
      </div>
    </div>
  );
};
