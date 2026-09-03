"use client";

import React, { useEffect, useState } from "react";
import { exportToExcel, printHtmlDocument } from "@/lib/exportUtils";
import { useToast } from "@/context/ToastContext";

interface ProductionRun {
  id: string;
  code: string;
  mealService: string;
  quantity: number;
  status: string;
  productionDate: string;
  diet: { name: string; texture: string };
}

export default function ProductionPage() {
  const [runs, setRuns] = useState<ProductionRun[]>([]);
  const [stats, setStats] = useState({ total: 0, planned: 0, completed: 0 });
  const [search, setSearch] = useState("");
  const [mealService, setMealService] = useState("Déjeuner");
  const [dietCode, setDietCode] = useState("normal");
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadProduction = async (query = search) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/production?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setRuns(data.runs);
      setStats(data.stats);
    } catch {
      showToast("error", "Production indisponible", "Impossible de récupérer les productions SQLite.");
    } finally { setIsLoading(false); }
  };

  useEffect(() => { const timer = window.setTimeout(() => void loadProduction(""), 0); return () => window.clearTimeout(timer); }, []);

  const createRun = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/production", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "CREATE", mealService, dietCode, quantity }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setQuantity("1");
      await loadProduction();
      showToast("success", "Production créée", "La production a été enregistrée dans SQLite.");
    } catch { showToast("error", "Création refusée", "Vérifiez le régime et la quantité."); }
  };

  const updateRun = async (run: ProductionRun) => {
    const status = run.status === "TERMINEE" ? "PLANIFIEE" : "TERMINEE";
    const response = await fetch("/api/production", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE", id: run.id, quantity: run.quantity, status }) });
    if (!response.ok) return showToast("error", "Statut non modifié", "La production n'a pas été mise à jour.");
    await loadProduction();
    showToast("success", "Statut modifié", `${run.code} est maintenant ${status}.`);
  };

  const deleteRun = async (run: ProductionRun) => {
    if (!window.confirm(`Supprimer ${run.code} ?`)) return;
    const response = await fetch("/api/production", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "DELETE", id: run.id }) });
    if (!response.ok) return showToast("error", "Suppression impossible", "La production n'a pas été supprimée.");
    await loadProduction();
    showToast("success", "Production supprimée", `${run.code} a été supprimée.`);
  };

  const exportProduction = async () => {
    await exportToExcel(`production-${new Date().toISOString().slice(0, 10)}.xlsx`, "Production", ["Code", "Service", "Régime", "Quantité", "Statut", "Date"], runs.map((run) => [run.code, run.mealService, run.diet.name, run.quantity, run.status, new Date(run.productionDate).toLocaleDateString("fr-FR")]));
    showToast("success", "Export Excel généré", "Les productions affichées ont été exportées.");
  };

  return <section id="view-production" className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-semibold text-slate-500">Quantité totale</div><div className="text-2xl font-extrabold text-slate-800 mt-1">{stats.total}</div><div className="text-[11px] text-sky-600 mt-1">Plateaux planifiés en base</div></div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-semibold text-slate-500">Productions planifiées</div><div className="text-2xl font-extrabold text-blue-600 mt-1">{stats.planned}</div></div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-semibold text-slate-500">Productions terminées</div><div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.completed}</div></div>
    </div>
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3"><h2 className="text-base font-extrabold text-slate-800">Planification de production</h2><div className="flex gap-2"><button onClick={() => void exportProduction()} className="px-3 py-2 bg-emerald-600 text-white rounded text-xs font-bold">Excel</button><button onClick={() => printHtmlDocument("Rapport production", runs.map((run) => `<p>${run.code} - ${run.mealService} - ${run.quantity} plateaux - ${run.status}</p>`).join(""))} className="px-3 py-2 bg-slate-700 text-white rounded text-xs font-bold">Imprimer</button></div></div>
      <form onSubmit={createRun} className="grid grid-cols-1 md:grid-cols-4 gap-2"><input required value={mealService} onChange={(event) => setMealService(event.target.value)} placeholder="Service repas" className="border border-slate-200 rounded p-2 text-xs" /><select value={dietCode} onChange={(event) => setDietCode(event.target.value)} className="border border-slate-200 rounded p-2 text-xs"><option value="normal">Normal</option><option value="diabetique">Diabétique</option><option value="sans-sel">Sans Sel</option><option value="post-partum">Post-Partum</option></select><input required min="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="border border-slate-200 rounded p-2 text-xs" /><button type="submit" className="bg-[#264DBF] text-white rounded p-2 text-xs font-bold">+ Nouvelle production</button></form>
      <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void loadProduction()} placeholder="Rechercher par code ou service" className="border border-slate-200 rounded p-2 text-xs w-full" />
      <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Code</th><th className="p-3">Service</th><th className="p-3">Régime</th><th className="p-3">Quantité</th><th className="p-3">Statut</th><th className="p-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">{isLoading ? <tr><td colSpan={6} className="p-4 text-slate-500">Chargement...</td></tr> : runs.length === 0 ? <tr><td colSpan={6} className="p-4 text-slate-500">Aucune production disponible.</td></tr> : runs.map((run) => <tr key={run.id} className="hover:bg-slate-50"><td className="p-3 font-mono font-bold text-[#264DBF]">{run.code}</td><td className="p-3">{run.mealService}</td><td className="p-3">{run.diet.name}</td><td className="p-3 font-bold">{run.quantity}</td><td className="p-3"><span className="px-2 py-1 rounded bg-sky-100 text-sky-800 font-bold">{run.status}</span></td><td className="p-3 text-right space-x-2"><button onClick={() => void updateRun(run)} className="text-sky-700 font-bold">Changer statut</button><button onClick={() => void deleteRun(run)} className="text-rose-700 font-bold">Supprimer</button></td></tr>)}</tbody></table></div>
    </div>
  </section>;
}
