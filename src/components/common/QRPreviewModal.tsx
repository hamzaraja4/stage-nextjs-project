"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export const QRPreviewModal: React.FC = () => {
  const { qrModal, closeQRModal } = useApp();

  if (!qrModal) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=HIS-CATERING-${encodeURIComponent(
    qrModal.token
  )}-VALID`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in duration-150">
        <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xl mx-auto">
          <i className="fa-solid fa-qrcode"></i>
        </div>
        <div>
          <h3 className="font-black text-base text-slate-900">{qrModal.patient}</h3>
          <p className="text-xs text-sky-700 font-semibold">{qrModal.loc}</p>
        </div>

        {/* QR Box Simulator */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="QR Code"
            width={140}
            height={140}
            className="mx-auto rounded"
          />
          <div className="font-mono font-bold text-xs text-slate-700 mt-2">
            Token : #{qrModal.token}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-left bg-slate-100 p-2.5 rounded-lg space-y-0.5">
          <div>
            <b>Régime :</b> <span>{qrModal.regime}</span>
          </div>
          <div>
            <b>Date & Heure :</b> 19/08/2026 - Déjeuner
          </div>
          <div>
            <b>Sécurité :</b> Crypté à usage unique (Anti-Fraude)
          </div>
        </div>

        <button
          onClick={closeQRModal}
          className="w-full py-2 bg-[#264DBF] hover:bg-[#1e3c99] text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          Fermer l&apos;Aperçu
        </button>
      </div>
    </div>
  );
};
