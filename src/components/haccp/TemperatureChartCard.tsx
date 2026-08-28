import React from "react";
import { Icon } from "../ui/Icon";

export const TemperatureChartCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[#C3C6CF] p-5 shadow-2xs h-64 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#0B1C30]">
          Historique Températures (24h)
        </h3>
        <button
          type="button"
          className="text-[#3A618B] hover:text-[#001932] text-[11px] font-semibold uppercase tracking-wider hover:underline cursor-pointer"
        >
          Exporter PDF
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 bg-[#F8F9FF] border border-[#C3C6CF]/50 rounded flex items-center justify-center text-[#43474E] text-[13px] relative overflow-hidden">
        {/* Visual Chart Bars Representation */}
        <div
          className="absolute bottom-0 left-0 w-full h-full flex items-end px-4 gap-2 opacity-25"
          aria-hidden="true"
        >
          <div className="w-full h-1/3 bg-[#0284C7] rounded-t" />
          <div className="w-full h-1/2 bg-[#0284C7] rounded-t" />
          <div className="w-full h-2/5 bg-[#0284C7] rounded-t" />
          <div className="w-full h-3/4 bg-[#0284C7] rounded-t" />
          <div className="w-full h-1/2 bg-[#0284C7] rounded-t" />
          <div className="w-full h-1/3 bg-[#0284C7] rounded-t" />
        </div>

        {/* Center Label */}
        <span className="relative z-10 flex items-center gap-2 font-medium">
          <Icon name="show_chart" className="text-[#3A618B] text-[20px]" />
          Zone Graphique (Intégration composant externe)
        </span>
      </div>
    </div>
  );
};
