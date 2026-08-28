import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_MEAL_ITEMS } from "../../data/mockCaisseData";

export const MealSelectionCard: React.FC = () => {
  const total = MOCK_MEAL_ITEMS.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg flex flex-col shadow-2xs">
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8F9FF] flex justify-between items-center">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932] flex items-center gap-2">
          <Icon name="restaurant_menu" className="text-[#0284C7] text-[22px]" />
          <span>Sélection Repas</span>
        </h3>
      </div>

      {/* Meal Items List */}
      <div className="p-0 divide-y divide-[#E2E8F0]">
        {MOCK_MEAL_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-[#F1F5F9] transition-colors border-l-2 border-transparent hover:border-[#0284C7] group"
          >
            {/* Left Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F2F3F9] rounded border border-[#E2E8F0] flex items-center justify-center text-[#43474E] shrink-0">
                <Icon name={item.icon} className="text-[24px]" />
              </div>
              <div>
                <div className="text-[14px] leading-[20px] font-semibold text-[#001932]">
                  {item.title}
                </div>
                <div className="text-[11px] leading-[16px] font-bold text-[#43474E] uppercase tracking-[0.06em] mt-1">
                  {item.subtitle}
                </div>
              </div>
            </div>

            {/* Right Quantity & Price */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-[13px] leading-[18px] font-medium text-[#001932] bg-[#F2F3F9] px-3 py-1 rounded border border-[#E2E8F0]">
                x{item.quantity}
              </div>
              <div className="text-[24px] leading-tight font-bold text-[#001932] w-24 text-right">
                {item.price.toFixed(2)}
                <span className="text-[14px] text-[#43474E] font-normal ml-1">
                  {item.currency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F2F3F9] flex justify-between items-center rounded-b-lg">
        <div className="text-[18px] leading-[24px] font-semibold text-[#001932] uppercase tracking-tight">
          Total à régler
        </div>
        <div className="text-[32px] leading-tight font-bold text-[#001932]">
          {total.toFixed(2)}
          <span className="text-[16px] text-[#43474E] font-normal ml-1">
            MAD
          </span>
        </div>
      </div>
    </div>
  );
};
