"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { MOCK_INVENTORY_ITEMS } from "../../data/mockStocksData";

interface InventoryTableProps {
  searchQuery?: string;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  searchQuery = "",
}) => {
  const [items] = useState(MOCK_INVENTORY_ITEMS);

  const filteredItems = items.filter((item) =>
    item.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#C3C6CF] rounded flex flex-col h-full shadow-2xs">
      {/* Table Header */}
      <div className="p-4 border-b border-[#C3C6CF] flex justify-between items-center bg-white">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#0B1C30]">
          Inventaire Global
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            title="Filtrer"
            className="p-1.5 text-[#43474E] border border-[#C3C6CF] rounded hover:bg-[#EFF4FF] transition-colors cursor-pointer"
          >
            <Icon name="filter_list" className="text-[18px]" />
          </button>
          <button
            type="button"
            title="Exporter CSV/Excel"
            className="p-1.5 text-[#43474E] border border-[#C3C6CF] rounded hover:bg-[#EFF4FF] transition-colors cursor-pointer"
          >
            <Icon name="download" className="text-[18px]" />
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#EFF4FF] text-[#43474E] text-[11px] leading-[16px] font-semibold uppercase tracking-[0.05em] border-b border-[#C3C6CF]">
              <th scope="col" className="py-3 px-4">Article</th>
              <th scope="col" className="py-3 px-4">Lot</th>
              <th scope="col" className="py-3 px-4 text-right">Quantité</th>
              <th scope="col" className="py-3 px-4">Unité</th>
              <th scope="col" className="py-3 px-4">DLC</th>
              <th scope="col" className="py-3 px-4">Fournisseur</th>
              <th scope="col" className="py-3 px-4 text-center">Statut</th>
              <th scope="col" className="py-3 px-4 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[13px] leading-[18px] text-[#0B1C30] divide-y divide-[#C3C6CF]/50">
            {filteredItems.map((item) => {
              const isWarning = item.status === "warning";
              const isError = item.status === "error";

              return (
                <tr
                  key={item.id}
                  className={`transition-colors h-[40px] ${
                    isError
                      ? "bg-red-50/40 hover:bg-red-50/70"
                      : isWarning
                      ? "bg-orange-50/40 hover:bg-orange-50/70"
                      : "hover:bg-[#EFF4FF]/50"
                  }`}
                >
                  {/* Article */}
                  <td className="py-2.5 px-4 font-medium">{item.article}</td>

                  {/* Lot */}
                  <td className="py-2.5 px-4 text-[#43474E] font-mono">{item.lot}</td>

                  {/* Quantité */}
                  <td
                    className={`py-2.5 px-4 text-right ${
                      isError
                        ? "font-bold text-[#BA1A1A]"
                        : isWarning
                        ? "font-bold text-orange-600"
                        : "font-normal text-[#0B1C30]"
                    }`}
                  >
                    {item.quantity.toFixed(1)}
                  </td>

                  {/* Unité */}
                  <td className="py-2.5 px-4 text-[#43474E]">{item.unit}</td>

                  {/* DLC */}
                  <td
                    className={`py-2.5 px-4 ${
                      isError ? "text-[#BA1A1A] font-medium" : "text-[#0B1C30]"
                    }`}
                  >
                    {item.dlc}
                  </td>

                  {/* Fournisseur */}
                  <td className="py-2.5 px-4 text-[#43474E]">{item.supplier}</td>

                  {/* Statut Pill */}
                  <td className="py-2.5 px-4 text-center">
                    {item.status === "ok" && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700"
                        title={item.statusTitle}
                      >
                        <Icon name="check" className="text-[14px]" />
                      </span>
                    )}
                    {item.status === "warning" && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700"
                        title={item.statusTitle}
                      >
                        <Icon name="warning" className="text-[14px]" />
                      </span>
                    )}
                    {item.status === "error" && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFDAD6] text-[#93000A]"
                        title={item.statusTitle}
                      >
                        <Icon name="error" className="text-[14px]" />
                      </span>
                    )}
                  </td>

                  {/* Actions Button */}
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      aria-label="Actions"
                      className="text-[#43474E] hover:text-[#001932] transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
                    >
                      <Icon name="more_vert" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-[#C3C6CF] bg-white flex justify-between items-center text-[13px] text-[#43474E] mt-auto">
        <span>Affichage de 1 à 5 sur 142 articles</span>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Page précédente"
            disabled
            className="p-1 disabled:opacity-40 hover:bg-[#EFF4FF] rounded cursor-pointer disabled:cursor-not-allowed"
          >
            <Icon name="chevron_left" className="text-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Page suivante"
            className="p-1 hover:bg-[#EFF4FF] rounded cursor-pointer"
          >
            <Icon name="chevron_right" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
