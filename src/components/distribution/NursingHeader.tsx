"use client";

import React from "react";
import { Icon } from "../ui/Icon";

interface NursingHeaderProps {
  onToggleMenu?: () => void;
}

export const NursingHeader: React.FC<NursingHeaderProps> = ({
  onToggleMenu,
}) => {
  return (
    <header className="border-b border-[#BA1A1A] shadow-xs bg-[#F8F9FF] flex justify-between items-center px-4 h-14 w-full sticky top-0 z-50 transition-all shrink-0">
      <h1 className="text-[24px] leading-[32px] font-bold text-[#001932] tracking-tight">
        Nursing App
      </h1>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label="Menu"
          className="p-1.5 text-[#001932] hover:bg-[#D3E4FE]/40 active:bg-[#D3E4FE] rounded-full transition-colors cursor-pointer"
        >
          <Icon name="menu" className="text-[22px]" />
        </button>

        <button
          type="button"
          aria-label="User Profile"
          className="p-1.5 text-[#001932] hover:bg-[#D3E4FE]/40 active:bg-[#D3E4FE] rounded-full transition-colors cursor-pointer"
        >
          <Icon name="person" className="text-[22px]" />
        </button>

        <button
          type="button"
          aria-label="Emergency"
          className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] active:scale-95 rounded-full transition-all cursor-pointer"
        >
          <Icon name="emergency" filled className="text-[22px]" />
        </button>
      </div>
    </header>
  );
};
