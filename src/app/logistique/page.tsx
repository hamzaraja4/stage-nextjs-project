"use client";

import React, { useState } from "react";

interface Chariot {
  id: string;
  code: string;
  floor: string;
  service: string;
  traysCount: number;
  agent: string;
  tempHot: string;
  tempCold: string;
  status: "En Distribution" | "Scellé Validé" | "Prêt au départ";
  departureTime?: string;
  statusNote?: string;
}

export default function LogistiquePage() {
  const [chariots, setChariots] = useState<Chariot[]>([
    {
      id: "1",
      code: "Chariot ISO-01",
      floor: "Étage 1",
      service: "Chirurgie",
      traysCount: 28,
      agent: "Scanné par Agent Omar",
      tempHot: "+66.4°C (≥63°C)",
      tempCold: "+2.8°C (≤3°C)",
      status: "En Distribution",
      departureTime: "Départ : 11:50",
    },
    {
      id: "2",
      code: "Chariot ISO-02",
      floor: "Étage 2",
      service: "Médecine",
      traysCount: 32,
      agent: "Contrôle de départ en cours",
      tempHot: "+65.1°C",
      tempCold: "+2.5°C",
      status: "Scellé Validé",
      statusNote: "Prêt au départ",
    },
  ]);

  const handleNewDepartureScan = () => {
    alert(
      "🛒 Contrôle & Départ Cuisine : Scan des plateaux du Chariot ISO-03 terminé. Liaison chaude validée à +67.5°C. Départ autorisé."
    );
    const newChariot: Chariot = {
      id: String(chariots.length + 1),
      code: `Chariot ISO-0${chariots.length + 1}`,
      floor: "Étage 3",
      service: "Maternité",
      traysCount: 24,
      agent: "Scanné par Agent Karim",
      tempHot: "+67.5°C",
      tempCold: "+2.4°C",
      status: "En Distribution",
      departureTime: `Départ : ${new Date().toTimeString().slice(0, 5)}`,
    };
    setChariots((prev) => [...prev, newChariot]);
  };

  return (
    <section id="view-logistique" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chariots Isothermes en Tournée */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Chariots Isothermes & Liaison Thermique
              </h3>
              <p className="text-xs text-slate-500">
                Validation et contrôle au départ cuisine centrale
              </p>
            </div>
            <button
              onClick={handleNewDepartureScan}
              className="px-2.5 py-1 bg-[#264DBF] text-white rounded text-xs font-bold hover:bg-[#1e3c99] transition cursor-pointer"
            >
              + Nouveau Contrôle & Départ
            </button>
          </div>

          {/* List Chariots */}
          <div className="space-y-3">
            {chariots.map((chariot) => (
              <div
                key={chariot.id}
                className={`p-3.5 rounded-lg border flex items-center justify-between transition ${
                  chariot.status === "En Distribution"
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg text-white flex items-center justify-center text-lg ${
                      chariot.status === "En Distribution"
                        ? "bg-emerald-500"
                        : "bg-sky-600"
                    }`}
                  >
                    <i className="fa-solid fa-truck-ramp-box"></i>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">
                      {chariot.code} • {chariot.floor} ({chariot.service})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {chariot.traysCount} plateaux scellés | {chariot.agent}
                    </div>
                    <div
                      className={`text-[10px] font-semibold mt-0.5 ${
                        chariot.status === "En Distribution"
                          ? "text-emerald-700"
                          : "text-sky-700"
                      }`}
                    >
                      Chaud : {chariot.tempHot} • Froid : {chariot.tempCold}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 font-bold text-[10px] rounded-full ${
                      chariot.status === "En Distribution"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {chariot.status}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {chariot.departureTime || chariot.statusNote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frigos Relais d'Urgence d'Étage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Frigos Relais d&apos;Urgence Nocturne (Post-20h)
              </h3>
              <p className="text-xs text-slate-500">
                Dotations fixes d&apos;étage pour admissions non planifiées
              </p>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
              Réassort Auto J+1
            </span>
          </div>

          {/* Table des Frigos d'Étage */}
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  Frigo Relais Urgences / Chirurgie
                </div>
                <div className="text-slate-500 text-[11px]">
                  Capacité : 4 plateaux froids + 4 collations
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">
                  3 / 4 Disponibles
                </div>
                <div className="text-[10px] text-rose-600 font-semibold">
                  1 consommé à 23:14 (Ch. 109)
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  Frigo Relais Médecine / Maternité
                </div>
                <div className="text-slate-500 text-[11px]">
                  Capacité : 4 plateaux froids + 4 collations
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">4 / 4 Complet</div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  Aucun mouvement de nuit
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
              <i className="fa-solid fa-circle-info text-sky-600 mr-1"></i>
              <b>Procédure de nuit :</b> Le soignant scanne le bracelet du
              patient admis d&apos;urgence pour ouvrir et imputer le plateau. La
              cuisine reçoit l&apos;ordre de réassort à 06h00.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
