"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { MOCK_REORDER_SUGGESTIONS } from "../../data/mockStocksData";

export const AutoReorderPanel: React.FC = () => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    "reorder-1": 15,
    "reorder-2": 100,
  });

  const [validatedOrders, setValidatedOrders] = useState<{ [key: string]: boolean }>({});

  const handleQtyChange = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleValidateOrder = (id: string) => {
    setValidatedOrders((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setValidatedOrders((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  return (
    <div className="bg-white border border-[#C3C6CF] rounded flex flex-col h-full shadow-2xs">
      {/* Header */}
      <div className="p-4 border-b border-[#C3C6CF] bg-white">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#0B1C30] flex items-center gap-2">
          <Icon name="autorenew" className="text-[#001932] text-[22px]" />
          <span>Réappro. Auto</span>
        </h3>
        <p className="text-xs text-[#43474E] mt-1 font-normal">
          Suggestions basées sur les seuils d&apos;alerte.
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
        {MOCK_REORDER_SUGGESTIONS.map((sugg) => {
          const isError = sugg.statusType === "error";
          const isValidated = validatedOrders[sugg.id];

          return (
            <div
              key={sugg.id}
              className={`rounded p-3 relative transition-all border ${
                isError
                  ? "border-red-200 bg-red-50/30"
                  : "border-orange-200 bg-orange-50/30"
              }`}
            >
              {/* Alert Status Icon */}
              <div
                className={`absolute top-3 right-3 ${
                  isError ? "text-[#BA1A1A]" : "text-orange-500"
                }`}
              >
                <Icon
                  name={isError ? "error" : "warning"}
                  className="text-[18px]"
                />
              </div>

              {/* Title */}
              <h4 className="text-[14px] leading-[20px] text-[#0B1C30] font-semibold pr-6">
                {sugg.article}
              </h4>

              {/* Quantity vs Threshold */}
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs font-normal">
                  <span
                    className={`font-bold ${
                      isError ? "text-[#BA1A1A]" : "text-orange-600"
                    }`}
                  >
                    {sugg.currentQty.toFixed(1)} {sugg.unit}
                  </span>{" "}
                  <span className="text-[#43474E]">
                    / {sugg.thresholdQty.toFixed(1)} {sugg.unit} (Seuil)
                  </span>
                </div>
                <div className="text-xs text-[#43474E] font-medium uppercase tracking-wider">
                  {sugg.supplier}
                </div>
              </div>

              {/* Quantity Edit & Validation Button */}
              <div
                className={`mt-3 pt-3 border-t ${
                  isError ? "border-red-200/50" : "border-orange-200/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-[#0B1C30] font-medium">Qté suggérée:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={quantities[sugg.id] || 0}
                      onChange={(e) =>
                        handleQtyChange(sugg.id, parseInt(e.target.value) || 0)
                      }
                      className="w-16 h-8 text-right bg-white border border-[#C3C6CF] rounded p-1 text-sm focus:border-[#3A618B] focus:ring-1 focus:ring-[#3A618B] outline-none font-semibold"
                    />
                    <span className="text-[#43474E] text-xs font-medium">
                      {sugg.unit}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleValidateOrder(sugg.id)}
                  className={`w-full py-2 rounded text-xs font-bold uppercase tracking-[0.05em] transition-all cursor-pointer ${
                    isValidated
                      ? "bg-[#10B981] text-white"
                      : "bg-[#001932] text-white hover:bg-[#0B2E4F] active:scale-[0.99]"
                  }`}
                >
                  {isValidated
                    ? "Bon de Commande Validé ✓"
                    : "Valider Bon de Commande"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
