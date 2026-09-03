"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { exportToExcel, printHtmlDocument } from "@/lib/exportUtils";

interface HotTempLog {
  id: string;
  dishOrDevice: string;
  temperature: number;
  isCompliant: boolean;
}

export default function HaccpPage() {
  const [hotTemps, setHotTemps] = useState<HotTempLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dishOrDevice, setDishOrDevice] = useState("");
  const [temperature, setTemperature] = useState("68.5");
  const { showToast } = useToast();

  const loadHaccp = async () => {
    try {
      const response = await fetch("/api/haccp");
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setHotTemps(data.hotTemps);
    } catch {
      showToast("error", "Chargement impossible", "Les relevés HACCP ne sont pas disponibles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadHaccp(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAddManualTemp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/haccp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_TEMPERATURE", dishOrDevice, temperature }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setHotTemps((previous) => [data.hotTemp, ...previous]);
      setDishOrDevice("");
      setIsModalOpen(false);
      showToast("success", "Relevé enregistré", "Le contrôle thermique est conservé dans SQLite.");
    } catch {
      showToast("error", "Relevé refusé", "Vérifiez la préparation et la température saisies.");
    }
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
            {isLoading ? <div className="text-slate-500">Chargement des relevés...</div> : hotTemps.map((ht) => (
              <div
                key={ht.id}
                className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center"
              >
                <span>{ht.dishOrDevice}</span>
                <span className={`font-bold flex items-center gap-1 ${ht.isCompliant ? "text-emerald-700" : "text-rose-700"}`}>
                  {ht.temperature > 0 ? "+" : ""}{ht.temperature.toFixed(1)}°C <i className={`fa-solid ${ht.isCompliant ? "fa-check" : "fa-xmark"} text-[10px]`}></i>
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-xs transition cursor-pointer"
          >
            + Enregistrer Relevé Thermique Manuel
          </button>
          <button onClick={() => void exportToExcel(`haccp-${new Date().toISOString().slice(0, 10)}.xlsx`, "HACCP", ["Préparation", "Température", "Conforme"], hotTemps.map((item) => [item.dishOrDevice, item.temperature, item.isCompliant ? "Oui" : "Non"]))} className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded text-xs transition cursor-pointer">Exporter Excel</button>
          <button onClick={() => printHtmlDocument("Relevés HACCP", hotTemps.map((item) => `<p>${item.dishOrDevice} : ${item.temperature}°C</p>`).join(""))} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition cursor-pointer">Imprimer</button>
        </div>
      </div>
      {isModalOpen && <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"><form onSubmit={handleAddManualTemp} className="bg-white rounded-xl p-5 w-full max-w-sm space-y-3 shadow-xl"><h3 className="font-bold text-slate-800">Nouveau relevé thermique</h3><input required value={dishOrDevice} onChange={(event) => setDishOrDevice(event.target.value)} placeholder="Préparation ou équipement" className="w-full border border-slate-200 rounded p-2 text-xs" /><input required type="number" step="0.1" value={temperature} onChange={(event) => setTemperature(event.target.value)} placeholder="Température °C" className="w-full border border-slate-200 rounded p-2 text-xs" /><div className="flex gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded text-xs font-bold">Annuler</button><button type="submit" className="flex-1 py-2 bg-slate-800 text-white rounded text-xs font-bold">Enregistrer</button></div></form></div>}
    </section>
  );
}
