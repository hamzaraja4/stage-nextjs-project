"use client";

import React, { useState } from "react";

interface StockItem {
  id: string;
  name: string;
  quantity: string;
  threshold: string;
  dlc: string;
  status: {
    label: string;
    bgClass: string;
    textClass: string;
  };
  rowClass?: string;
  qtyClass?: string;
}

interface PurchaseOrder {
  id: string;
  code: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  supplier: string;
  item: string;
  amount?: string;
  isTransmitted?: boolean;
}

const stockItems: StockItem[] = [
  {
    id: "1",
    name: "Pavé de Saumon Frais 140g",
    quantity: "4.20 Kg",
    threshold: "15.00 Kg",
    dlc: "21/08/2026 (J+2)",
    status: {
      label: "🔴 BC Généré Auto",
      bgClass: "bg-rose-100",
      textClass: "text-rose-800",
    },
    rowClass: "bg-rose-50/50",
    qtyClass: "text-rose-700 font-black",
  },
  {
    id: "2",
    name: "Blanc de Volaille Découpé",
    quantity: "8.50 Kg",
    threshold: "12.00 Kg",
    dlc: "22/08/2026 (J+3)",
    status: {
      label: "⚠️ Seuil Atteint",
      bgClass: "bg-amber-100",
      textClass: "text-amber-800",
    },
    rowClass: "bg-amber-50/40",
    qtyClass: "text-amber-700 font-bold",
  },
  {
    id: "3",
    name: "Riz Blanc Long Grain Extra",
    quantity: "45.00 Kg",
    threshold: "20.00 Kg",
    dlc: "15/12/2026",
    status: {
      label: "🟢 Confortable",
      bgClass: "bg-emerald-100",
      textClass: "text-emerald-800",
    },
    qtyClass: "text-slate-800",
  },
  {
    id: "4",
    name: "Yaourt Nature 125g",
    quantity: "120 Unités",
    threshold: "50 Unités",
    dlc: "28/08/2026",
    status: {
      label: "🟢 Confortable",
      bgClass: "bg-emerald-100",
      textClass: "text-emerald-800",
    },
    qtyClass: "text-slate-800",
  },
];

export default function StocksPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "1",
      code: "BC-2026-0891",
      badge: "BC_01 Généré",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
      supplier: "Marée Atlantique SARL",
      item: "Pavé Saumon (Qté : 25 Kg arrondis)",
      amount: "2,850.00 MAD",
      isTransmitted: false,
    },
    {
      id: "2",
      code: "BC-2026-0888",
      badge: "BC_02 Transmis",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-800",
      supplier: "Maraîcher du Sud",
      item: "Légumes Frais & Salades (40 Kg)",
      isTransmitted: true,
    },
  ]);

  const handleValidateBC = (code: string) => {
    alert(
      `🖨️ Bon de Commande ${code} validé. Impression du document et transmission au fournisseur lancées.`
    );
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.code === code
          ? {
              ...po,
              badge: "BC_01 Transmis",
              badgeBg: "bg-emerald-100",
              badgeText: "text-emerald-800",
              isTransmitted: true,
            }
          : po
      )
    );
  };

  return (
    <section id="view-stocks" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Table Articles & Seuils Critiques */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Niveaux de Stocks Denrées & Alertes FEFO
            </h3>
            <span className="text-xs text-slate-500">
              Déstockage automatique par recette
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Article Denrée</th>
                  <th className="p-3">Stock Physique</th>
                  <th className="p-3">Seuil Sécurité</th>
                  <th className="p-3">Prochaine DLC (FEFO)</th>
                  <th className="p-3 text-right">Statut Appro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {stockItems.map((item) => (
                  <tr
                    key={item.id}
                    className={item.rowClass || "hover:bg-slate-50"}
                  >
                    <td className="p-3 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className={`p-3 ${item.qtyClass}`}>
                      {item.quantity}
                    </td>
                    <td className="p-3">{item.threshold}</td>
                    <td className="p-3 font-mono text-slate-600">
                      {item.dlc}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${item.status.bgClass} ${item.status.textClass}`}
                      >
                        {item.status.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bons de Commande (BC) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800">
              Bons de Commande
            </h3>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
              En Attente
            </span>
          </div>

          {/* Cards BC */}
          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div
                key={po.id}
                className={`p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs transition ${
                  po.isTransmitted ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold ${
                      po.isTransmitted ? "text-slate-600" : "text-[#264DBF]"
                    }`}
                  >
                    {po.code}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 font-bold text-[9px] rounded ${po.badgeBg} ${po.badgeText}`}
                  >
                    {po.badge}
                  </span>
                </div>
                <div className={po.isTransmitted ? "text-slate-600 text-[11px]" : "text-slate-700"}>
                  <b>Fournisseur :</b> {po.supplier}
                  <br />
                  <b>Article :</b> {po.item}
                  {po.amount && (
                    <>
                      <br />
                      <b>Montant estimé :</b> {po.amount}
                    </>
                  )}
                </div>
                {!po.isTransmitted && (
                  <button
                    onClick={() => handleValidateBC(po.code)}
                    className="w-full py-1.5 bg-[#264DBF] hover:bg-[#1e3c99] text-white font-bold rounded text-xs flex items-center justify-center space-x-1 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-print mr-1"></i>
                    <span>Valider & Imprimer</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
