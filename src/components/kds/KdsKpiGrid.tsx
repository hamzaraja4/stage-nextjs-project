import React from "react";
import { Icon } from "../ui/Icon";

export const KdsKpiGrid: React.FC = () => {
  return (
    <section
      aria-label="Indicateurs de production KDS"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {/* KPI 1 - Total Plateaux */}
      <div className="bg-white border border-[#C3C6CF] rounded-lg p-4 flex flex-col justify-between shadow-2xs">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.05em] text-[#43474E]">
            Total Plateaux
          </span>
          <Icon name="restaurant_menu" className="text-[#43474E] text-[20px]" />
        </div>
        <div className="text-[40px] leading-[48px] font-bold text-[#001932] tracking-[-0.02em]">
          88
        </div>
      </div>

      {/* KPI 2 - Dressés */}
      <div className="bg-white border border-[#C3C6CF] rounded-lg p-4 flex flex-col justify-between relative overflow-hidden shadow-2xs">
        <div
          className="absolute inset-0 w-full h-full opacity-10 bg-gradient-to-tr from-[#3A618B]/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.05em] text-[#43474E]">
              Dressés
            </span>
            <Icon name="check_circle" className="text-[#3A618B] text-[20px]" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-[40px] leading-[48px] font-bold text-[#3A618B] tracking-[-0.02em]">
              62
            </div>
            <div className="text-[14px] leading-[20px] text-[#43474E] font-normal">
              / 88
            </div>
          </div>
          <div className="w-full bg-[#E5EEFF] h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-[#3A618B] h-full rounded-full transition-all duration-500"
              style={{ width: "70%" }}
            />
          </div>
        </div>
      </div>

      {/* KPI 3 - Statut À JEUN */}
      <div className="bg-[#FFDAD6] border border-[#BA1A1A]/30 rounded-lg p-4 flex flex-col justify-between shadow-2xs">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.05em] text-[#93000A]">
            Statut À JEUN
          </span>
          <Icon name="warning" className="text-[#BA1A1A] text-[20px]" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-[40px] leading-[48px] font-bold text-[#93000A] tracking-[-0.02em]">
            1
          </div>
          <div className="text-[14px] leading-[20px] text-[#BA1A1A] font-semibold">
            Critique
          </div>
        </div>
      </div>

      {/* KPI 4 - Stock Tampon */}
      <div className="bg-white border border-[#C3C6CF] rounded-lg p-4 flex flex-col justify-between shadow-2xs">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.05em] text-[#43474E]">
            Stock Tampon
          </span>
          <Icon name="inventory_2" className="text-[#43474E] text-[20px]" />
        </div>
        <div className="text-[40px] leading-[48px] font-bold text-[#001932] tracking-[-0.02em]">
          5
        </div>
      </div>
    </section>
  );
};
