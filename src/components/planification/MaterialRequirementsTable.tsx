import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_MATERIAL_REQUIREMENTS } from "../../data/mockPlanificationData";

export const MaterialRequirementsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="bg-[#ECEEF3] px-4 py-3 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932] flex items-center">
          <Icon name="calculate" className="mr-2 text-[#0284C7] text-[20px]" />
          <span>Calcul des Besoins Matières (J-0)</span>
        </h3>
        <div className="text-[11px] leading-[16px] font-bold text-[#43474E] bg-white px-2 py-1 rounded border border-[#E2E8F0]">
          FORMULE: DISPO = RÉEL + EN COURS - PLANIFIÉ
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F2F3F9] border-b border-[#E2E8F0]">
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E]">
                Ingrédient
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] text-right">
                Besoin Planifié (Kg)
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] text-right">
                Stock Réel (Kg)
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] text-right">
                Cmd en cours (Kg)
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] text-right bg-[#ECEEF3]">
                Stock Disponible
              </th>
            </tr>
          </thead>
          <tbody className="font-mono text-[13px] leading-[18px]">
            {MOCK_MATERIAL_REQUIREMENTS.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F1F5F9] transition-colors h-[40px]"
              >
                <td className="py-2 px-4 text-[#191C20] font-sans font-semibold">
                  {row.ingredient}
                </td>
                <td className="py-2 px-4 text-right text-[#191C20]">
                  {row.plannedNeedKg.toFixed(1)}
                </td>
                <td className="py-2 px-4 text-right text-[#191C20]">
                  {row.actualStockKg.toFixed(1)}
                </td>
                <td className="py-2 px-4 text-right text-[#191C20]">
                  {row.incomingOrderKg.toFixed(1)}
                </td>
                <td
                  className={`py-2 px-4 text-right font-bold ${
                    row.isCriticalDeficit
                      ? "bg-[#FFDAD6] text-[#BA1A1A]"
                      : row.availableStockKg > 0
                      ? "bg-[#ECEEF3] text-[#10B981]"
                      : "bg-[#ECEEF3] text-[#43474E]"
                  }`}
                >
                  {row.availableStockKg > 0
                    ? `+${row.availableStockKg.toFixed(1)}`
                    : row.availableStockKg.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
