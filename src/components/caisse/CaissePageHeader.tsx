import React from "react";
import { Icon } from "../ui/Icon";

export const CaissePageHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
      <div>
        <h2 className="text-[28px] leading-[36px] font-semibold text-[#001932] tracking-tight">
          Caisse Self — Personnel
        </h2>
        <p className="text-[14px] leading-[20px] text-[#43474E] mt-1">
          Terminal de paiement automatisé par badge RFID pour le personnel médical.
        </p>
      </div>
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] select-none">
          <Icon name="wifi" className="text-[14px]" />
          Terminal En Ligne
        </span>
      </div>
    </div>
  );
};
