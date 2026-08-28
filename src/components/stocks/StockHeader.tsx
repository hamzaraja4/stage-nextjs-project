"use client";

import React from "react";
import { Icon } from "../ui/Icon";

interface StockHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onToggleSidebar?: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleSidebar,
}) => {
  return (
    <header className="flex justify-between items-center px-4 md:px-8 h-16 bg-white text-[#001932] border-b border-[#E2E8F0] w-full shrink-0 z-30 sticky top-0">
      {/* Left Brand & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Menu"
          className="md:hidden p-2 text-[#43474E] hover:bg-[#EFF4FF] rounded-full transition-all cursor-pointer"
        >
          <Icon name="menu" className="text-[22px]" />
        </button>
        <div className="text-[18px] leading-[24px] font-black text-[#001932] hidden md:block tracking-tight">
          HIS-CATERING
        </div>
      </div>

      {/* Centered Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:flex">
        <div className="relative w-full">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#43474E] text-[18px]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un article, un lot..."
            className="w-full bg-[#EFF4FF] border border-[#C3C6CF] rounded-full py-2 pl-10 pr-4 text-[13px] leading-[18px] text-[#0B1C30] placeholder-[#43474E] focus:border-[#369BDF] focus:ring-1 focus:ring-[#369BDF] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 mr-2 hidden lg:flex">
          <button
            aria-label="timer"
            type="button"
            className="p-2 text-[#43474E] hover:bg-[#EFF4FF] rounded-full transition-colors cursor-pointer"
          >
            <Icon name="timer" className="text-[20px]" />
          </button>
          <button
            aria-label="notifications"
            type="button"
            className="p-2 text-[#43474E] hover:bg-[#EFF4FF] rounded-full transition-colors relative cursor-pointer"
          >
            <Icon name="notifications" className="text-[20px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BA1A1A] rounded-full" />
          </button>
          <button
            aria-label="sync"
            type="button"
            className="p-2 text-[#43474E] hover:bg-[#EFF4FF] rounded-full transition-colors cursor-pointer"
          >
            <Icon name="sync" className="text-[20px]" />
          </button>
        </div>

        <button
          type="button"
          className="hidden md:block px-4 py-2 border border-[#3A618B] text-[#3A618B] rounded text-[11px] leading-[16px] font-bold uppercase tracking-[0.05em] hover:bg-[#EFF4FF] transition-colors cursor-pointer"
        >
          Déjeuner
        </button>

        <button
          type="button"
          className="bg-[#001932] text-white px-4 py-2 rounded text-[11px] leading-[16px] font-bold uppercase tracking-[0.05em] hover:bg-[#0B2E4F] transition-colors shadow-2xs cursor-pointer"
        >
          Déclencher À JEUN
        </button>
      </div>
    </header>
  );
};
