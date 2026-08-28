import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_STOCK_KPIS } from "../../data/mockStocksData";

export const StockKpiGrid: React.FC = () => {
  return (
    <section
      aria-label="Indicateurs de Stock"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2"
    >
      {/* KPI 1 - Valeur Stock */}
      <div className="bg-white border border-[#C3C6CF] rounded p-4 relative overflow-hidden shadow-2xs transition-shadow hover:shadow-xs">
        <div
          className="absolute -right-4 -top-4 w-24 h-24 bg-[#D3E4FE] rounded-full opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        <h3 className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.05em] mb-2">
          VALEUR STOCK
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] tracking-[-0.02em]">
          24.5k€
        </div>
        <div className="mt-2 text-xs text-[#0284C7] flex items-center gap-1 font-medium">
          <Icon name="trending_up" className="text-[16px]" />
          <span>+2.4% cette semaine</span>
        </div>
      </div>

      {/* KPI 2 - Articles sous seuil */}
      <div className="bg-white border border-[#C3C6CF] border-l-4 border-l-orange-500 rounded p-4 shadow-2xs transition-shadow hover:shadow-xs">
        <h3 className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.05em] mb-2 flex items-center justify-between">
          <span>ARTICLES SOUS SEUIL</span>
          <Icon name="warning" className="text-orange-500 text-[18px]" />
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] tracking-[-0.02em]">
          08
        </div>
        <div className="mt-2">
          <span className="text-xs text-orange-600 font-semibold bg-orange-50 inline-block px-2 py-0.5 rounded">
            2 alertes critiques
          </span>
        </div>
      </div>

      {/* KPI 3 - DLC < J-3 */}
      <div className="bg-white border border-[#C3C6CF] rounded p-4 shadow-2xs transition-shadow hover:shadow-xs">
        <h3 className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.05em] mb-2">
          DLC &lt; J-3
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] tracking-[-0.02em]">
          14
        </div>
        <div className="mt-2 text-xs text-[#43474E]">
          Lots à utiliser prioritairement
        </div>
      </div>

      {/* KPI 4 - Cmdes en cours */}
      <div className="bg-white border border-[#C3C6CF] rounded p-4 shadow-2xs transition-shadow hover:shadow-xs">
        <h3 className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.05em] mb-2">
          CMDES EN COURS
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] tracking-[-0.02em]">
          05
        </div>
        <div className="mt-2 text-xs text-[#43474E] flex items-center gap-1">
          <Icon name="local_shipping" className="text-[16px]" />
          <span>2 livraisons prévues auj.</span>
        </div>
      </div>
    </section>
  );
};
