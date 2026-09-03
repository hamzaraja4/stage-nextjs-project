"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

interface PosArticle {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  price: number;
  isNightShift?: boolean;
}

export default function PosPage() {
  const { posBalance, setPosBalance } = useApp();
  const { showToast } = useToast();
  const [posArticles, setPosArticles] = useState<PosArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<PosArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch("/api/pos").then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error);
        setPosArticles(data.articles);
        setSelectedArticle(data.articles[0] || null);
        if (data.staff?.balance !== undefined) setPosBalance(data.staff.balance);
      }).catch(() => showToast("error", "Chargement impossible", "Les articles POS ne sont pas disponibles.")).finally(() => setIsLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRecharge = async (amount: number) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/pos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "RECHARGE", amount }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setPosBalance(data.newBalance);
      showToast("success", "Compte rechargé", `+${amount} MAD ajoutés au badge.`);
    } catch { showToast("error", "Recharge impossible", "Le compte n'a pas été modifié."); }
    finally { setIsSubmitting(false); }
  };

  const handleDebit = async () => {
    if (!selectedArticle) return;
    setIsSubmitting(true);
    if (selectedArticle.price === 0) {
      showToast("success", "Plateau garde validé", "Pris en charge à 100% par la clinique.");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch("/api/pos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "DEBIT", amount: selectedArticle.price, articleId: selectedArticle.id }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setPosBalance(data.newBalance);
      showToast("success", "Débit validé", `${selectedArticle.price.toFixed(2)} MAD débités.`);
    } catch { showToast("error", "Débit refusé", "Solde insuffisant ou erreur serveur."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <section id="view-pos" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Gauche : Badge RFID & Compte Employé */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Identification Badge RFID / RH
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-2xl mx-auto shadow-inner">
              <i className="fa-solid fa-id-card-clip"></i>
            </div>
            <div>
              <div
                className="font-extrabold text-slate-800 text-sm"
                id="pos-emp-name"
              >
                Dr. Mehdi ALAMI
              </div>
              <div className="text-xs text-slate-500">
                Chirurgien • Matricule : RH-4091
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] text-slate-400 font-medium">
                Solde Porte-Monnaie Prépayé
              </div>
              <div
                className="text-2xl font-black text-[#264DBF]"
                id="pos-emp-balance"
              >
                {posBalance.toFixed(2)}{" "}
                <span className="text-xs font-semibold">MAD</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                Découvert autorisé : 1 repas (35 MAD)
              </div>
            </div>
          </div>

          {/* Recharge Express */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Recharger le compte :
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRecharge(100)}
                className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition cursor-pointer"
              >
                +100 MAD
              </button>
              <button
                onClick={() => handleRecharge(200)}
                className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition cursor-pointer"
              >
                +200 MAD
              </button>
              <button
                onClick={() => handleRecharge(500)}
                className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition cursor-pointer"
              >
                +500 MAD
              </button>
            </div>
            <div className="text-[10px] text-slate-400 text-center">
              Recharge directe par CB, Espèces ou Retenue Paie RH
            </div>
          </div>
        </div>

        {/* Colonne Centrale & Droite : Caisse Tactile du Personnel */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800">
              Sélection Menu & Débit Automatique
            </h3>
            <span className="text-xs bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded">
              Caisse Principale Personnel
            </span>
          </div>

          {/* Articles Grille Tactile */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {isLoading ? <div className="col-span-3 text-xs text-slate-500">Chargement des articles...</div> : posArticles.map((article) => {
              const isSelected = selectedArticle?.id === article.id;
              if (article.isNightShift) {
                return (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`p-3 rounded-xl text-left transition cursor-pointer border ${
                      isSelected
                        ? "bg-purple-100 border-purple-400 shadow-sm ring-2 ring-purple-400"
                        : "bg-purple-50 hover:bg-purple-100 border-purple-200"
                    }`}
                  >
                    <div className="text-base">{article.icon}</div>
                    <div className="font-bold text-xs text-purple-900 mt-1">
                      Plateau Garde de Nuit
                    </div>
                    <div className="text-[10px] text-purple-700">
                      {article.subtitle}
                    </div>
                    <div className="font-black text-purple-800 text-xs mt-1">
                      0.00 MAD (Pris en charge)
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`p-3 rounded-xl text-left transition cursor-pointer border ${
                    isSelected
                      ? "bg-sky-50 border-sky-400 shadow-sm ring-2 ring-sky-400"
                      : "bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="text-base">{article.icon}</div>
                  <div className="font-bold text-xs text-slate-800 mt-1">
                    {article.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {article.subtitle}
                  </div>
                  <div className="font-black text-[#264DBF] text-xs mt-1">
                    {article.price.toFixed(2)} MAD
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cart Summary & Validation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Article sélectionné :{" "}
                <strong
                  id="pos-selected-item"
                  className="text-slate-800 font-bold"
                >
                  {selectedArticle?.name || "Aucun article sélectionné"}
                </strong>
              </span>
              <span
                className="font-bold text-sm text-[#264DBF]"
                id="pos-selected-price"
              >
                {(selectedArticle?.price || 0).toFixed(2)} MAD
              </span>
            </div>
            <button
              onClick={() => void handleDebit()}
              disabled={isSubmitting || !selectedArticle}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
            >
              <i className="fa-solid fa-credit-card"></i>
              <span>Débiter Badge RFID (Instantané)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
