"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export const AJeunAlertStrip: React.FC = () => {
  const { aJeunAlertActive, dismissAJeun } = useApp();

  if (!aJeunAlertActive) return null;

  return (
    <div
      id="a-jeun-alert-strip"
      className="bg-rose-600 text-white px-8 py-3 text-xs flex items-center justify-between animate-pulse shadow-md flex-shrink-0 z-20"
    >
      <div className="flex items-center space-x-3">
        <i className="fa-solid fa-triangle-exclamation text-xl"></i>
        <span className="font-bold text-sm">
          ALERTE IMMÉDIATE : Patient Youssef EL AMRI (Chirurgie Ch. 104 - Lit B) est passé « À JEUN » par le Bloc !
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="bg-black/30 px-3 py-1 rounded text-[11px] font-mono">
          Plateau n° PLT-8492 bloqué en cuisine
        </span>
        <button
          onClick={dismissAJeun}
          className="px-3 py-1 bg-white text-rose-700 font-extrabold rounded-lg hover:bg-rose-50 shadow-sm cursor-pointer transition"
        >
          Acquitter
        </button>
      </div>
    </div>
  );
};
