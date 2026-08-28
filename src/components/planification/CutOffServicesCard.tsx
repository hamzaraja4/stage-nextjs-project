import React from "react";
import { Icon } from "../ui/Icon";
import { MOCK_CUTOFF_SERVICES } from "../../data/mockPlanificationData";

export const CutOffServicesCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] flex flex-col shadow-2xs h-full">
      {/* Card Header */}
      <div className="bg-[#ECEEF3] px-4 py-3 border-b border-[#E2E8F0]">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#001932] flex items-center">
          <Icon name="timeline" className="mr-2 text-[#0284C7] text-[20px]" />
          <span>Cut-Off Services</span>
        </h3>
      </div>

      {/* Services List */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {MOCK_CUTOFF_SERVICES.map((service) => {
          if (service.statusType === "active") {
            return (
              <div
                key={service.id}
                className="flex items-center p-3 border-2 border-[#0284C7] rounded bg-[#ABC9F2]/20 relative shadow-2xs"
              >
                <div
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0284C7] animate-pulse"
                  aria-hidden="true"
                />
                <div className="w-10 text-[#0284C7] flex flex-col items-center mr-3">
                  <Icon name={service.icon} className="text-[20px]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-mono text-[#001932] font-bold">
                    {service.title} ({service.time})
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#0284C7]">
                    {service.statusLabel}
                  </div>
                </div>
              </div>
            );
          }

          if (service.statusType === "urgent") {
            return (
              <div
                key={service.id}
                className="flex items-center p-3 border border-[#FFDAD6] rounded bg-[#FFDAD6]/30 shadow-2xs"
              >
                <div className="w-10 text-[#BA1A1A] flex flex-col items-center mr-3">
                  <Icon name={service.icon} className="text-[20px]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-mono text-[#BA1A1A] font-bold">
                    {service.title}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#BA1A1A]">
                    {service.statusLabel}
                  </div>
                </div>
              </div>
            );
          }

          if (service.statusType === "closed") {
            return (
              <div
                key={service.id}
                className="flex items-center p-3 border border-[#E2E8F0] rounded bg-[#F8F9FF] opacity-75"
              >
                <div className="w-10 text-[#64748B] flex flex-col items-center mr-3">
                  <Icon name={service.icon} className="text-[20px]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-mono text-[#191C20] font-semibold">
                    {service.title} ({service.time})
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#64748B]">
                    {service.statusLabel}
                  </div>
                </div>
              </div>
            );
          }

          // Open state
          return (
            <div
              key={service.id}
              className="flex items-center p-3 border border-[#E2E8F0] rounded bg-[#F8F9FF]"
            >
              <div className="w-10 text-[#43474E] flex flex-col items-center mr-3">
                <Icon name={service.icon} className="text-[20px]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-mono text-[#191C20]">
                  {service.title} ({service.time})
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#43474E]">
                  {service.statusLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
