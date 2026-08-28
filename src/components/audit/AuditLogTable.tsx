import React from "react";
import { Icon } from "../ui/Icon";
import { AUDIT_LOG_ENTRIES } from "../../data/mockAuditData";

export const AuditLogTable: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded flex flex-col h-full shadow-2xs">
      {/* Table Header / Card Title */}
      <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#191C20] flex items-center gap-2">
          <Icon name="history" className="text-[#0284C7] text-[22px]" />
          <span>Journal d&apos;Audit Temps Réel</span>
        </h3>
        <button
          type="button"
          title="Real-time sync active"
          aria-label="Real-time sync active"
          className="cursor-pointer"
        >
          <Icon
            name="sync"
            className="text-[#0284C7] animate-pulse text-[20px]"
          />
        </button>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8F9FF] text-[11px] leading-[16px] font-normal uppercase tracking-[0.06em] text-[#43474E]">
              <th scope="col" className="py-2.5 px-4 font-normal">Heure</th>
              <th scope="col" className="py-2.5 px-4 font-normal">Patient IPP</th>
              <th scope="col" className="py-2.5 px-4 font-normal">Agent</th>
              <th scope="col" className="py-2.5 px-4 font-normal">Contrôle SAS</th>
              <th scope="col" className="py-2.5 px-4 font-normal">Statut</th>
            </tr>
          </thead>
          <tbody className="text-[13px] leading-[18px] text-[#191C20] font-medium">
            {AUDIT_LOG_ENTRIES.map((entry) => {
              const isAlert = entry.isAlertRow;
              const isRealtime = entry.isRealtimeActive;

              return (
                <tr
                  key={entry.id}
                  className={`border-b border-[#E2E8F0] transition-colors h-[40px] ${
                    isAlert
                      ? "bg-[#FFDAD6]/20 hover:bg-[#FFDAD6]/30"
                      : "hover:bg-[#F1F5F9]"
                  } ${isRealtime ? "realtime-sync" : ""}`}
                >
                  {/* Heure */}
                  <td
                    className={`py-2 px-4 whitespace-nowrap ${
                      isAlert ? "text-[#E11D48] font-medium" : "text-[#191C20]"
                    }`}
                  >
                    {entry.time}
                  </td>

                  {/* Patient IPP */}
                  <td
                    className={`py-2 px-4 whitespace-nowrap font-bold ${
                      isAlert ? "text-[#E11D48]" : "text-[#191C20]"
                    }`}
                  >
                    {entry.patientIpp}
                  </td>

                  {/* Agent */}
                  <td className="py-2 px-4 whitespace-nowrap text-[#43474E] font-normal">
                    {entry.agent}
                  </td>

                  {/* Contrôle SAS */}
                  <td
                    className={`py-2 px-4 whitespace-nowrap ${
                      entry.sasControlStatus === "error"
                        ? "text-[#E11D48] font-bold"
                        : "text-[#10B981] font-medium"
                    }`}
                  >
                    {entry.sasControl}
                  </td>

                  {/* Statut Badge */}
                  <td className="py-2 px-4 whitespace-nowrap">
                    {entry.statusBadge.variant === "alert" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E11D48] text-white">
                        <Icon
                          name={entry.statusBadge.icon}
                          className="text-[12px] mr-1"
                        />
                        {entry.statusBadge.label}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E1E2E8] text-[#64748B]">
                        <Icon
                          name={entry.statusBadge.icon}
                          className="text-[12px] mr-1"
                        />
                        {entry.statusBadge.label}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
