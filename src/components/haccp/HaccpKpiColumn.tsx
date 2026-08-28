import React from "react";
import { Icon } from "../ui/Icon";

export const HaccpKpiColumn: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* KPI 1 - Chambres Froides */}
      <div className="bg-white rounded-lg border border-[#C3C6CF] p-4 flex flex-col shadow-2xs hover:border-[#3A618B] transition-colors min-h-[160px]">
        <div className="flex justify-between items-start mb-2">
          <Icon name="ac_unit" className="text-[#002F4B] text-[22px]" />
          <span className="bg-[#EFF4FF] text-[#001932] px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 border border-[#C3C6CF]/40">
            <span className="w-2 h-2 rounded-full bg-[#001932] inline-block" />
            100%
          </span>
        </div>
        <h3 className="text-[13px] leading-[18px] text-[#43474E] uppercase tracking-wider mb-1">
          Chambres Froides
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] mt-auto tracking-[-0.02em]">
          2/2
        </div>
        <p className="text-[11px] text-[#43474E] mt-1 font-medium">Conformes</p>
      </div>

      {/* KPI 2 - Alertes Température */}
      <div className="bg-white rounded-lg border border-[#C3C6CF] p-4 flex flex-col shadow-2xs hover:border-[#3A618B] transition-colors relative overflow-hidden min-h-[160px]">
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#BA1A1A] to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="flex justify-between items-start mb-2 relative z-10">
          <Icon name="warning" className="text-[#BA1A1A] text-[22px]" />
          <span className="bg-[#FFDAD6] text-[#93000A] px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border border-[#BA1A1A]/20">
            0 Nvlles
          </span>
        </div>
        <h3 className="text-[13px] leading-[18px] text-[#43474E] uppercase tracking-wider mb-1 relative z-10">
          Alertes Température
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] mt-auto relative z-10 tracking-[-0.02em]">
          0
        </div>
        <p className="text-[11px] text-[#43474E] mt-1 font-medium relative z-10">
          Sur 24h glissantes
        </p>
      </div>

      {/* KPI 3 - Plats Témoins Actifs */}
      <div className="bg-white rounded-lg border border-[#C3C6CF] p-4 flex flex-col shadow-2xs hover:border-[#3A618B] transition-colors min-h-[160px]">
        <div className="flex justify-between items-start mb-2">
          <Icon name="science" className="text-[#3A618B] text-[22px]" />
          <span className="bg-[#EFF4FF] text-[#3A618B] px-2 py-1 rounded text-[11px] font-semibold border border-[#C3C6CF]/40">
            Lot A45
          </span>
        </div>
        <h3 className="text-[13px] leading-[18px] text-[#43474E] uppercase tracking-wider mb-1">
          Plats Témoins Actifs
        </h3>
        <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] mt-auto tracking-[-0.02em]">
          124
        </div>
        <p className="text-[11px] text-[#43474E] mt-1 font-medium">
          En conservation
        </p>
      </div>
    </div>
  );
};
