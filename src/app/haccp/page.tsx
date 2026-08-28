"use client";

import React, { useState } from "react";

interface HotTempLog {
  id: string;
  name: string;
  temp: string;
}

export default function HaccpPage() {
  const [hotTemps, setHotTemps] = useState<HotTempLog[]>([
    {
      id: "1",
      name: "Cuisson Saumon Four Vapeur",
      temp: "+72.0°C",
    },
    {
      id: "2",
      name: "Marmite Velouté de Légumes",
      temp: "+78.5°C",
    },
    {
      id: "3",
      name: "Chariot Bains-Marie Maintien",
      temp: "+67.2°C",
    },
  ]);

  const handleAddManualTemp = () => {
    const dish = prompt("Nom de la préparation ou équipement :", "Plat du Chef Chaud");
    if (!dish) return;
    const tempInput = prompt("Température mesurée (°C) :", "68.5");
    if (!tempInput) return;

    const formattedTemp = `+${parseFloat(tempInput).toFixed(1)}°C`;
    setHotTemps((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: dish,
        temp: formattedTemp,
      },
    ]);
    alert(`✅ Relevé de température enregistré pour ${dish} (${formattedTemp}).`);
  };

  return (
    <section id="view-haccp" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Relevés Chambres Froides */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Chambres Froides & Stockage
          </h3>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-emerald-900">
                Chambre Froide Positive #1 (Produits Frais)
              </div>
              <div className="text-[11px] text-emerald-700">
                Norme : +2°C à +4°C
              </div>
            </div>
            <div className="text-lg font-black text-emerald-800">+2.8°C</div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-emerald-900">
                Chambre Froide Négative #2 (Surgelés)
              </div>
              <div className="text-[11px] text-emerald-700">
                Norme : ≤ -18°C
              </div>
            </div>
            <div className="text-lg font-black text-emerald-800">-19.4°C</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-700">
              Dernier relevé automatique :
            </div>
            <div className="text-slate-500 text-[11px]">
              Aujourd&apos;hui à 08:00 par Sonde IoT Clinique
            </div>
          </div>
        </div>

        {/* Plats Témoins (7 Jours Légal) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800">
              Plats Témoins (Règle 7 Jours)
            </h3>
            <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">
              Scellés 100g
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  Déjeuner J (Mercredi)
                </div>
                <div className="text-[10px] text-slate-500">
                  Saumon / Volaille / Velouté
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700">
                J-7 Restant
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  Dîner J-1 (Mardi)
                </div>
                <div className="text-[10px] text-slate-500">
                  Gratin de courgettes & Bœuf
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700">
                J-6 Restant
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  Déjeuner J-2 (Lundi)
                </div>
                <div className="text-[10px] text-slate-500">
                  Tajine de dinde aux légumes
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700">
                J-5 Restant
              </span>
            </div>
          </div>
        </div>

        {/* Relevés Liaison Chaude Cuisines */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Liaison Chaude Cuisson (≥ +63°C)
          </h3>
          <div className="space-y-2 text-xs">
            {hotTemps.map((ht) => (
              <div
                key={ht.id}
                className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center"
              >
                <span>{ht.name}</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  {ht.temp} <i className="fa-solid fa-check text-[10px]"></i>
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddManualTemp}
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-xs transition cursor-pointer"
          >
            + Enregistrer Relevé Thermique Manuel
          </button>
        </div>
      </div>
    </section>
  );
}
