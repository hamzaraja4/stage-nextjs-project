"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import QRCode from "qrcode";
import { downloadDataUrl, printHtmlDocument } from "@/lib/exportUtils";

export const QRPreviewModal: React.FC = () => {
  const { qrModal, closeQRModal } = useApp();
  const [qrImage, setQrImage] = useState<{ token: string; url: string } | null>(null);

  useEffect(() => {
    if (!qrModal) return;

    void QRCode.toDataURL(`HIS-CATERING-${qrModal.token}-VALID`, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "H",
    }).then((url) => setQrImage({ token: qrModal.token, url }));
  }, [qrModal]);

  if (!qrModal) return null;

  const qrImageUrl = qrImage?.token === qrModal.token ? qrImage.url : null;

  const printQr = () => {
    printHtmlDocument(
      `Étiquette QR ${qrModal.token}`,
      `<div style="text-align:center"><h1>${qrModal.patient}</h1><p>${qrModal.loc}</p>${
        qrImageUrl ? `<img src="${qrImageUrl}" width="280" height="280" alt="QR Code" />` : ""
      }<p>Token : #${qrModal.token}</p><p>Régime : ${qrModal.regime}</p></div>`
    );
  };

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
          {qrImageUrl ? (
            <img src={qrImageUrl} alt="QR Code" width={140} height={140} className="mx-auto rounded" />
          ) : (
            <div className="w-[140px] h-[140px] flex items-center justify-center text-xs text-slate-500">Génération...</div>
          )}
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

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => qrImageUrl && downloadDataUrl(`qr-${qrModal.token}.png`, qrImageUrl)}
            disabled={!qrImageUrl}
            className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
          >
            <i className="fa-solid fa-download mr-1"></i> Télécharger
          </button>
          <button
            onClick={printQr}
            disabled={!qrImageUrl}
            className="py-2 bg-[#264DBF] hover:bg-[#1e3c99] text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
          >
            <i className="fa-solid fa-print mr-1"></i> Imprimer
          </button>
        </div>
        <button onClick={closeQRModal} className="w-full py-2 text-slate-500 hover:text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
          Fermer l&apos;Aperçu
        </button>
      </div>
    </div>
  );
};
