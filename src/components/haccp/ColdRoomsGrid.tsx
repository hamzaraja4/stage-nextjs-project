import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_COLD_ROOMS } from "../../data/mockHaccpData";

export const ColdRoomsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {MOCK_COLD_ROOMS.map((room) => (
        <div
          key={room.id}
          className="bg-white rounded-lg border border-[#C3C6CF] p-5 shadow-2xs relative group overflow-hidden transition-all hover:shadow-xs"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#C3C6CF]/60 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#EFF4FF] flex items-center justify-center text-[#001932]">
                <Icon name={room.icon} className="text-[18px]" />
              </div>
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0B1C30]">
                {room.name} ({room.code})
              </h3>
            </div>

            <span className="bg-[#EFF4FF] text-[#001932] px-2 py-1 rounded text-[11px] font-semibold border border-[#001932]/20 flex items-center gap-1">
              <Icon name="check_circle" className="text-[14px]" />
              Conforme
            </span>
          </div>

          {/* Temperature Display */}
          <div className="flex items-end gap-4">
            <div className="text-[40px] leading-[48px] font-bold text-[#0B1C30] tracking-[-0.02em]">
              {room.currentTemp}
              <span className="text-2xl text-[#73777F] font-normal ml-0.5">
                °C
              </span>
            </div>
            <div className="text-[13px] leading-[18px] text-[#43474E] mb-2 font-normal">
              {room.targetRange}
            </div>
          </div>

          {/* Bottom Accent Gradient Line */}
          <div
            className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${room.gradientFrom} to-transparent opacity-60 group-hover:opacity-100 transition-opacity`}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
};
