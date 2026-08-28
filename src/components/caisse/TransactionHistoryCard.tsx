import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_TRANSACTIONS } from "../../data/mockCaisseData";

export const TransactionHistoryCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg flex flex-col shadow-2xs">
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center">
        <h4 className="text-[14px] leading-[20px] font-semibold text-[#001932] uppercase tracking-wider">
          Derniers Débits
        </h4>
        <a
          href="#"
          className="text-[#0284C7] text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] hover:underline"
        >
          Voir tout
        </a>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col divide-y divide-[#E2E8F0]/60">
        {MOCK_TRANSACTIONS.map((tx) => {
          const isCredit = tx.type === "credit";

          return (
            <div
              key={tx.id}
              className="flex justify-between items-center p-3 hover:bg-[#F1F5F9] transition-colors"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3">
                <span
                  className={`p-1.5 rounded ${
                    isCredit ? "text-[#10B981] bg-[#10B981]/10" : "text-[#43474E]"
                  }`}
                >
                  <Icon name={tx.icon} className="text-[18px]" />
                </span>
                <div>
                  <div className="text-[13px] leading-[18px] font-medium text-[#001932] font-mono">
                    {tx.date}
                  </div>
                  <div className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.06em]">
                    {tx.label}
                  </div>
                </div>
              </div>

              {/* Right Amounts */}
              <div className="text-right">
                <div
                  className={`text-[13px] leading-[18px] font-bold font-mono ${
                    isCredit ? "text-[#10B981]" : "text-[#E11D48]"
                  }`}
                >
                  {isCredit ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)}
                </div>
                <div className="text-[11px] leading-[16px] text-[#43474E] font-normal">
                  Solde: {tx.balanceAfter.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
