import React from "react";

export const ReconciliationChartCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 shadow-2xs">
      <h3 className="text-[14px] leading-[20px] font-semibold text-[#191C20] mb-4">
        Réconciliation Matières
      </h3>

      {/* Chart Visualizer */}
      <div className="w-full h-40 bg-[#F8F9FF] rounded border border-[#E1E2E8] flex items-center justify-center relative overflow-hidden">
        {/* Background bars mimicking the chart */}
        <div
          className="absolute inset-0 flex items-end opacity-20 px-2"
          aria-hidden="true"
        >
          <div className="w-1/5 bg-[#0284C7] h-[60%] mx-1 rounded-t-xs" />
          <div className="w-1/5 bg-[#0284C7] h-[80%] mx-1 rounded-t-xs" />
          <div className="w-1/5 bg-[#0284C7] h-[70%] mx-1 rounded-t-xs" />
          <div className="w-1/5 bg-[#0284C7] h-[90%] mx-1 rounded-t-xs" />
          <div className="w-1/5 bg-[#E11D48] h-[30%] mx-1 rounded-t-xs" />
        </div>

        {/* Foreground label */}
        <span className="text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] z-10 select-none">
          [Graphique de Réconciliation]
        </span>
      </div>
    </div>
  );
};
