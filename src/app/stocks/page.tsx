"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { exportToExcel, printHtmlDocument } from "@/lib/exportUtils";

interface StockItem {
  id: string;
  name: string;
  physicalStock: number;
  thresholdStock: number;
  unit: string;
  dlc: string;
  statusAlert: string;
}

interface PurchaseOrder {
  id: string;
  code: string;
  supplier: string;
  itemDetails: string;
  amount: number | null;
  status: string;
}

export default function StocksPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadStocks = async (query = search) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stocks?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setStockItems(data.items);
      setPurchaseOrders(data.purchaseOrders);
    } catch {
      showToast("error", "Chargement impossible", "Les stocks SQLite ne sont pas disponibles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadStocks(""), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleValidateBC = async (order: PurchaseOrder) => {
    setIsSubmitting(order.id);
    try {
      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TRANSMIT_ORDER", id: order.id }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      await loadStocks();
      showToast("success", "Bon de commande transmis", `${order.code} est maintenant transmis au fournisseur.`);
      printHtmlDocument(`Bon de commande ${order.code}`, `<h1>${order.code}</h1><p>Fournisseur : ${order.supplier}</p><p>Article : ${order.itemDetails}</p>`);
    } catch {
      showToast("error", "Transmission impossible", "Le bon de commande n'a pas été modifié.");
    } finally {
      setIsSubmitting(null);
    }
  };

  const exportStocks = async () => {
    await exportToExcel(
      `stocks-${new Date().toISOString().slice(0, 10)}.xlsx`,
      "Stocks",
      ["Article", "Stock physique", "Seuil sécurité", "Unité", "DLC", "Statut"],
      stockItems.map((item) => [item.name, item.physicalStock, item.thresholdStock, item.unit, new Date(item.dlc).toLocaleDateString("fr-FR"), item.statusAlert])
    );
    showToast("success", "Export Excel généré", "Les stocks affichés ont été exportés.");
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
            <div className="flex items-center gap-2">
              <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void loadStocks()} placeholder="Rechercher" className="px-2 py-1 border border-slate-200 rounded text-xs" />
              <button onClick={exportStocks} disabled={isLoading} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold disabled:opacity-50"><i className="fa-solid fa-file-excel mr-1"></i> Excel</button>
            </div>
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
                {isLoading ? <tr><td colSpan={5} className="p-4 text-slate-500">Chargement des stocks...</td></tr> : stockItems.length === 0 ? <tr><td colSpan={5} className="p-4 text-slate-500">Aucun stock trouvé.</td></tr> : stockItems.map((item) => {
                  const isLow = item.physicalStock <= item.thresholdStock;
                  return (
                  <tr
                    key={item.id}
                    className={isLow ? "bg-amber-50/40" : "hover:bg-slate-50"}
                  >
                    <td className="p-3 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className={`p-3 ${isLow ? "text-amber-700 font-bold" : "text-slate-800"}`}>
                      {item.physicalStock.toFixed(2)} {item.unit}
                    </td>
                    <td className="p-3">{item.thresholdStock.toFixed(2)} {item.unit}</td>
                    <td className="p-3 font-mono text-slate-600">
                      {new Date(item.dlc).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${isLow ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
                      >
                        {item.statusAlert}
                      </span>
                    </td>
                  </tr>
                  );
                })}
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
                  po.status === "TRANSMIS" ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold ${
                      po.status === "TRANSMIS" ? "text-slate-600" : "text-[#264DBF]"
                    }`}
                  >
                    {po.code}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 font-bold text-[9px] rounded ${po.status === "TRANSMIS" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                  >
                    {po.status === "TRANSMIS" ? "Transmis" : "Généré"}
                  </span>
                </div>
                <div className={po.status === "TRANSMIS" ? "text-slate-600 text-[11px]" : "text-slate-700"}>
                  <b>Fournisseur :</b> {po.supplier}
                  <br />
                  <b>Article :</b> {po.itemDetails}
                  {po.amount !== null && (
                    <>
                      <br /><b>Montant estimé :</b> {po.amount.toFixed(2)} MAD
                    </>
                  )}
                </div>
                {po.status !== "TRANSMIS" && (
                  <button
                    onClick={() => void handleValidateBC(po)}
                    disabled={isSubmitting === po.id}
                    className="w-full py-1.5 bg-[#264DBF] hover:bg-[#1e3c99] text-white font-bold rounded text-xs flex items-center justify-center space-x-1 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-print mr-1"></i>
                    <span>{isSubmitting === po.id ? "Transmission..." : "Valider & Imprimer"}</span>
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
