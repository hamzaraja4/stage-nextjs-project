import React from "react";
import { MOCK_INTERCONNECTION } from "../../data/mockStocksData";

export const InterconnectionTopStrip: React.FC = () => {
  return (
    <div className="hidden md:flex items-center gap-6 px-4 md:px-8 h-8 bg-[#002F4B] text-[#369BDF] w-full shrink-0 z-30 text-[11px] leading-[16px] font-semibold uppercase tracking-[0.05em]">
      <span className="font-bold text-[#369BDF]">HIS Interconnection</span>
      <div className="flex gap-4 text-[#369BDF]/90">
        <span>Beds: {MOCK_INTERCONNECTION.beds}</span>
        <span>Discharges: {MOCK_INTERCONNECTION.discharges}</span>
        <span>Companion: {MOCK_INTERCONNECTION.companion}</span>
        <span>Latency: {MOCK_INTERCONNECTION.latencyMs}ms</span>
      </div>
    </div>
  );
};
