import React from "react";

export const AuditHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-[28px] leading-[36px] font-semibold text-[#191C20] tracking-[-0.01em]">
          Audit Anti-Fraude &amp; Traçabilité
        </h2>
        <p className="text-[14px] leading-[20px] text-[#43474E] mt-1 font-normal">
          Écran de Contrôle Anti-Fraude &amp; Audit en Boucle Fermée
        </p>
      </div>
    </div>
  );
};
