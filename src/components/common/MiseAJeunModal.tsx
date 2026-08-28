"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export const MiseAJeunModal: React.FC = () => {
  const { isMiseAJeunModalOpen, closeMiseAJeunModal, triggerAJeun } = useApp();
  const [selectedPatient, setSelectedPatient] = useState(
    "Youssef EL AMRI (Chirurgie Ch. 104 Lit B)"
  );
  const [reason, setReason] = useState(
    "Intervention Bloc en Urgence reprogrammée"
  );

  if (!isMiseAJeunModalOpen) return null;

  const handleConfirm = () => {
    triggerAJeun(selectedPatient);
    alert(
      `🔴 Événement HIS propagé en 140ms : Le plateau de ${selectedPatient} a été immédiatement VERROUILLÉ en cuisine !`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center space-x-3 text-rose-600">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-xl font-bold">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-900">
              Simuler Événement HIS : Mise À Jeun
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronisation immédiate avec le Bloc Opératoire
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700">Sélectionner Patient :</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-lg p-2 bg-slate-50 font-medium text-slate-800 outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="Youssef EL AMRI (Chirurgie Ch. 104 Lit B)">
                Youssef EL AMRI (Chirurgie Ch. 104 Lit B)
              </option>
              <option value="Amine TAZI (Chirurgie Ch. 101 Lit A)">
                Amine TAZI (Chirurgie Ch. 101 Lit A)
              </option>
              <option value="Khadija BENJELLOUN (Médecine Ch. 208 Lit A)">
                Khadija BENJELLOUN (Médecine Ch. 208 Lit A)
              </option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700">Motif Médical :</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={closeMiseAJeunModal}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            Diffuser Consigne Immédiate
          </button>
        </div>
      </div>
    </div>
  );
};
