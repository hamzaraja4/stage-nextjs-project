import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_DAILY_MENUS } from "../../data/mockPlanificationData";

export const DailyMenuTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden flex flex-col shadow-2xs">
      {/* Card Header */}
      <div className="bg-[#ECEEF3] px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932] flex items-center">
          <Icon name="restaurant_menu" className="mr-2 text-[#0284C7] text-[20px]" />
          <span>Menu du Jour (Cyclique)</span>
        </h3>
        <span className="bg-white text-[#43474E] text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded border border-[#E2E8F0]">
          Cycle J-0
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-[#F2F3F9] border-b border-[#E2E8F0]">
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] w-1/5">
                Régime
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] w-1/5">
                Entrée
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] w-1/5">
                Plat
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] w-1/5">
                Garniture
              </th>
              <th scope="col" className="py-2.5 px-4 text-[11px] leading-[16px] font-bold uppercase tracking-[0.06em] text-[#43474E] w-1/5">
                Dessert
              </th>
            </tr>
          </thead>
          <tbody className="text-[14px] leading-[20px] text-[#191C20]">
            {MOCK_DAILY_MENUS.map((menu) => (
              <tr
                key={menu.id}
                className={`border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F1F5F9] transition-colors h-[40px] ${
                  menu.isHighlighted ? "border-l-2 border-l-[#0284C7]" : ""
                }`}
              >
                <td className="py-2 px-4 font-medium text-[#001932]">
                  {menu.diet}
                </td>
                <td className="py-2 px-4 text-[#191C20]">{menu.starter}</td>
                <td className="py-2 px-4 text-[#191C20]">{menu.mainCourse}</td>
                <td className="py-2 px-4 text-[#191C20]">{menu.sideDish}</td>
                <td className="py-2 px-4 text-[#191C20]">{menu.dessert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
