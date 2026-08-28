"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { MOCK_STAFF_PROFILE } from "../../data/mockCaisseData";

export const StaffProfileCard: React.FC = () => {
  const [balance, setBalance] = useState(MOCK_STAFF_PROFILE.balance);
  const [isDebited, setIsDebited] = useState(false);

  const handleDebit = () => {
    if (balance >= 45) {
      setBalance((prev) => +(prev - 45).toFixed(2));
      setIsDebited(true);
      setTimeout(() => setIsDebited(false), 2000);
    }
  };

  return (
    <div className="bg-white border-2 border-[#0284C7] rounded-lg shadow-[0_4px_20px_-4px_rgba(2,132,199,0.15)] overflow-hidden relative">
      {/* Left blue accent strip */}
      <div
        className="absolute top-0 left-0 w-1 h-full bg-[#0284C7]"
        aria-hidden="true"
      />

      {/* Staff Profile Header */}
      <div className="p-6 border-b border-[#E2E8F0] bg-[#F8F9FF] flex items-start gap-4">
        <img
          className="w-16 h-16 rounded object-cover border border-[#E2E8F0] shrink-0"
          alt={MOCK_STAFF_PROFILE.name}
          src={MOCK_STAFF_PROFILE.avatarUrl}
        />
        <div>
          <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932] leading-tight mb-1">
            {MOCK_STAFF_PROFILE.name}
          </h3>
          <div className="text-[11px] leading-[16px] font-bold text-[#0284C7] uppercase tracking-[0.06em] mb-2">
            {MOCK_STAFF_PROFILE.role}
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#F2F3F9] border border-[#E2E8F0] text-[#43474E] text-[11px] font-medium font-mono">
            ID: {MOCK_STAFF_PROFILE.empId}
          </span>
        </div>
      </div>

      {/* RFID Balance Indicator */}
      <div className="p-6 flex flex-col gap-2">
        <div className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.06em] flex justify-between items-center">
          <span>Solde Compte RFID</span>
          <span className="text-[#10B981] flex items-center gap-1">
            <Icon name="check_circle" className="text-[14px]" /> Actif
          </span>
        </div>

        {/* Balance Pill */}
        <div className="bg-[#F2F3F9] border border-[#E2E8F0] rounded-full py-3 px-6 flex items-center justify-between shadow-inner">
          <Icon name="contactless" className="text-[#0284C7] text-[24px]" />
          <div className="text-[32px] leading-tight font-bold text-[#001932] text-right">
            {balance.toFixed(2)}
            <span className="text-[16px] text-[#43474E] font-normal ml-1">
              {MOCK_STAFF_PROFILE.currency}
            </span>
          </div>
        </div>

        {/* Overdraft Indicator Note */}
        <div className="mt-2 flex items-start gap-2 bg-[#E1E2E8]/50 p-2 rounded border border-[#E2E8F0]/50">
          <Icon name="info" className="text-[#64748B] text-[16px] shrink-0 mt-0.5" />
          <p className="text-[13px] leading-[18px] text-[#43474E] leading-tight font-normal">
            {MOCK_STAFF_PROFILE.overdraftLimitDescription}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F2F3F9] flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDebit}
          className="w-full bg-[#0284C7] hover:bg-[#006398] active:scale-[0.99] text-white text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] py-4 rounded transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon name="payments" className="text-[20px]" />
          {isDebited ? "Compte Débité avec Succès !" : "Débiter le Compte (45 MAD)"}
        </button>

        <button
          type="button"
          className="w-full bg-white hover:bg-[#E1E2E8] active:scale-[0.99] text-[#001932] border border-[#E2E8F0] text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] py-3 rounded transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon name="add_card" className="text-[20px]" />
          Recharger Compte
        </button>
      </div>
    </div>
  );
};
