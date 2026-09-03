"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

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

interface Fridge {
  id: string;
  name: string;
  capacityTrays: number;
  availableTrays: number;
  lastConsumedInfo: string | null;
}

export default function LogistiquePage() {
  const [chariots, setChariots] = useState<Chariot[]>([]);
  const [fridges, setFridges] = useState<Fridge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  const loadLogistics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/logistique");
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);

      setChariots(
        data.carts.map((cart: {
          id: string;
          code: string;
          serviceUnit: { name: string; floor: string };
          traysCount: number;
          scannedBy: string | null;
          tempHot: number;
          tempCold: number;
          status: string;
          departureTime: string | null;
        }) => ({
          id: cart.id,
          code: `Chariot ${cart.code}`,
          floor: cart.serviceUnit.floor,
          service: cart.serviceUnit.name,
          traysCount: cart.traysCount,
          agent: cart.scannedBy ? `Scanné par ${cart.scannedBy}` : "Contrôle en cours",
          tempHot: `+${cart.tempHot.toFixed(1)}°C`,
          tempCold: `+${cart.tempCold.toFixed(1)}°C`,
          status: cart.status === "EN_DISTRIBUTION" ? "En Distribution" : "Scellé Validé",
          departureTime: cart.departureTime
            ? `Départ : ${new Date(cart.departureTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
            : undefined,
          statusNote: cart.status === "SCELLE_VALIDE" ? "Prêt au départ" : undefined,
        }))
      );
      setFridges(data.fridges);
    } catch {
      showToast("error", "Chargement impossible", "Les données logistiques n'ont pas pu être récupérées.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLogistics();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleNewDepartureScan = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/logistique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_CART_DEPARTURE",
          serviceUnitCode: "maternite",
          traysCount: 24,
          tempHot: 67.5,
          tempCold: 2.4,
          agentName: "Agent Karim",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      showToast("success", "Départ enregistré", "Le chariot a été créé et autorisé au départ.");
      await loadLogistics();
    } catch {
      showToast("error", "Départ non enregistré", "La création du chariot a échoué.");
    } finally {
      setIsCreating(false);
    }
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
              disabled={isCreating}
              className="px-2.5 py-1 bg-[#264DBF] text-white rounded text-xs font-bold hover:bg-[#1e3c99] transition cursor-pointer"
            >
              {isCreating ? "Enregistrement..." : "+ Nouveau Contrôle & Départ"}
            </button>
          </div>

          {/* List Chariots */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="p-4 text-xs text-slate-500">Chargement des chariots...</div>
            ) : chariots.length === 0 ? (
              <div className="p-4 text-xs text-slate-500">Aucun chariot enregistré.</div>
            ) : chariots.map((chariot) => (
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
            {fridges.map((fridge) => (
            <div key={fridge.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  {fridge.name}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Capacité : {fridge.capacityTrays} plateaux froids
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">
                  {fridge.availableTrays} / {fridge.capacityTrays} Disponibles
                </div>
                <div className="text-[10px] text-rose-600 font-semibold">
                  {fridge.lastConsumedInfo || "Aucun mouvement de nuit"}
                </div>
              </div>
            </div>
            ))}

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
