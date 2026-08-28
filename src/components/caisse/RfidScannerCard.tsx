"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";

export const RfidScannerCard: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div
      onClick={handleSimulateScan}
      className="bg-white border border-[#E2E8F0] rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group cursor-pointer hover:border-[#0284C7] transition-all shadow-2xs"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F2F3F9]/50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Radar / Pulse Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <div
          className="absolute inset-0 border-2 border-[#0284C7]/20 rounded-full animate-ping"
          aria-hidden="true"
        />
        <div
          className="absolute inset-2 border-2 border-[#0284C7]/40 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
          aria-hidden="true"
        />
        <div className="w-20 h-20 bg-white border-2 border-[#0284C7] text-[#0284C7] rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-[#0284C7]/20 group-hover:scale-105 transition-transform">
          <Icon
            name="contactless"
            className={`text-[40px] ${isScanning ? "animate-pulse" : ""}`}
          />
        </div>
      </div>

      {/* Scan Text */}
      <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932] text-center mb-2">
        Scanner Badge RFID
      </h3>
      <p className="text-[14px] leading-[20px] text-[#43474E] text-center max-w-md">
        Approchez la carte professionnelle du lecteur pour identifier le collaborateur et accéder à son compte.
      </p>

      {/* Status Pill */}
      <div className="mt-6 flex items-center gap-2 text-[11px] leading-[16px] font-bold text-[#0284C7] uppercase bg-[#0284C7]/10 px-4 py-2 rounded-full select-none">
        <Icon
          name="sensors"
          className="text-[16px] animate-pulse"
        />
        {isScanning ? "Lecture du badge en cours..." : "Attente de lecture..."}
      </div>
    </div>
  );
};
