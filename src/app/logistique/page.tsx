"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { exportReportPdf, exportToExcel, printHtmlDocument } from "@/lib/exportUtils";

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

interface FormState {
  code: string;
  serviceUnitCode: string;
  traysCount: string;
  tempHot: string;
  tempCold: string;
  agentName: string;
  status: string;
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
  const [stats, setStats] = useState({ total: 0, inDistribution: 0, completed: 0, trays: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [form, setForm] = useState<FormState>({ code: "", serviceUnitCode: "chirurgie", traysCount: "0", tempHot: "63", tempCold: "3", agentName: "", status: "PREPARATION" });
  const { showToast } = useToast();

  const loadLogistics = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ search, status: statusFilter, service: serviceFilter });
      const response = await fetch(`/api/logistique?${params.toString()}`);
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
      setStats(data.stats);
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
  }, [search, statusFilter, serviceFilter]);

  const handleNewDepartureScan = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/logistique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_CART_DEPARTURE",
          code: `ISO-${String(Date.now()).slice(-5)}`,
          serviceUnitCode: "maternite",
          traysCount: 24,
          tempHot: 67.5,
          tempCold: 2.4,
          agentName: "Agent Karim",
          status: "EN_DISTRIBUTION",
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

  const openCreate = () => { setEditingId(null); setForm({ code: `ISO-${String(Date.now()).slice(-5)}`, serviceUnitCode: "chirurgie", traysCount: "0", tempHot: "63", tempCold: "3", agentName: "", status: "PREPARATION" }); setFormOpen(true); };
  const openEdit = (cart: Chariot) => { setEditingId(cart.id); setForm({ code: cart.code.replace("Chariot ", ""), serviceUnitCode: cart.service.toLowerCase().includes("matern") ? "maternite" : cart.service.toLowerCase().includes("médec") ? "medecine" : "chirurgie", traysCount: String(cart.traysCount), tempHot: cart.tempHot.replace("+", "").split("°")[0], tempCold: cart.tempCold.replace("+", "").split("°")[0], agentName: cart.agent.replace("Scanné par ", ""), status: cart.status === "En Distribution" ? "EN_DISTRIBUTION" : "SCELLE_VALIDE" }); setFormOpen(true); };
  const saveCart = async (event: React.FormEvent) => {
    event.preventDefault(); setIsSaving(true);
    try {
      const response = await fetch(editingId ? `/api/logistique/${editingId}` : "/api/logistique", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, action: editingId ? undefined : "CREATE_CART_DEPARTURE" }) });
      const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error);
      setFormOpen(false); await loadLogistics(); showToast("success", editingId ? "Opération modifiée" : "Opération ajoutée", "Les données ont été enregistrées dans SQLite.");
    } catch { showToast("error", "Enregistrement impossible", "Vérifiez les champs logistiques."); } finally { setIsSaving(false); }
  };
  const deleteCart = async (cart: Chariot) => { if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return; const response = await fetch(`/api/logistique/${cart.id}`, { method: "DELETE" }); if (!response.ok) return showToast("error", "Suppression impossible", "Le chariot est peut-être lié à des plateaux."); await loadLogistics(); showToast("success", "Opération supprimée", "La suppression a été enregistrée dans SQLite."); };
  const exportLogistics = async (pdf = false) => { setIsExporting(true); try { const rows = chariots.map((cart) => [cart.code, cart.service, String(cart.traysCount), cart.tempHot, cart.tempCold, cart.agent, cart.status]); if (pdf) await exportReportPdf("RAPPORT LOGISTIQUE", ["Référence", "Service", "Plateaux", "Temp. chaude", "Temp. froide", "Responsable", "Statut"], rows, `logistique_${new Date().toISOString().slice(0, 10)}.pdf`); else await exportToExcel(`logistique_${new Date().toISOString().slice(0, 10)}.xlsx`, "Logistique", ["Référence", "Service", "Plateaux", "Temp. chaude", "Temp. froide", "Responsable", "Statut"], rows); showToast("success", pdf ? "PDF généré" : "Export Excel généré", "Les données affichées ont été exportées."); } catch { showToast("error", "Export impossible", "Le fichier n'a pas pu être généré."); } finally { setIsExporting(false); } };

  return (
    <section id="view-logistique" className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs text-slate-500">Total opérations</div><div className="text-2xl font-black text-slate-800">{stats.total}</div></div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm"><div className="text-xs text-emerald-600">En distribution</div><div className="text-2xl font-black text-emerald-700">{stats.inDistribution}</div></div>
        <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-sm"><div className="text-xs text-sky-600">Plateaux transportés</div><div className="text-2xl font-black text-sky-700">{stats.trays}</div></div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs text-slate-500">Terminées</div><div className="text-2xl font-black text-slate-700">{stats.completed}</div></div>
      </div>
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher code, service, responsable" className="flex-1 min-w-[220px] border border-slate-200 rounded p-2 text-xs" />
        <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)} className="border border-slate-200 rounded p-2 text-xs"><option value="">Tous les services</option><option value="chirurgie">Chirurgie</option><option value="medecine">Médecine</option><option value="maternite">Maternité</option></select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border border-slate-200 rounded p-2 text-xs"><option value="">Tous les statuts</option><option value="PREPARATION">Préparation</option><option value="SCELLE_VALIDE">Scellé validé</option><option value="EN_DISTRIBUTION">En distribution</option><option value="TERMINE">Terminée</option></select>
        <button onClick={() => { setSearch(""); setServiceFilter(""); setStatusFilter(""); }} className="px-3 py-2 bg-slate-100 text-slate-700 rounded text-xs font-bold">Réinitialiser</button>
        <button onClick={openCreate} className="px-3 py-2 bg-[#264DBF] text-white rounded text-xs font-bold"><i className="fa-solid fa-plus mr-1"></i> Ajouter</button>
        <button onClick={() => void loadLogistics()} disabled={isLoading} className="px-3 py-2 bg-slate-700 text-white rounded text-xs font-bold">Actualiser</button>
        <button onClick={() => void exportLogistics()} disabled={isExporting} className="px-3 py-2 bg-emerald-600 text-white rounded text-xs font-bold">Excel</button>
        <button onClick={() => void exportLogistics(true)} disabled={isExporting} className="px-3 py-2 bg-rose-700 text-white rounded text-xs font-bold">PDF</button>
        <button onClick={() => printHtmlDocument("Rapport logistique", chariots.map((cart) => `<p>${cart.code} - ${cart.service} - ${cart.traysCount} plateaux - ${cart.status}</p>`).join(""))} className="px-3 py-2 bg-slate-800 text-white rounded text-xs font-bold">Imprimer</button>
      </div>
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
                  <div className="flex gap-2 justify-end mt-2"><button onClick={() => openEdit(chariot)} className="text-[10px] text-sky-700 font-bold">Modifier</button><button onClick={() => void deleteCart(chariot)} className="text-[10px] text-rose-700 font-bold">Supprimer</button></div>
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
      {formOpen && <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"><form onSubmit={saveCart} className="bg-white rounded-xl p-5 w-full max-w-lg space-y-3 shadow-xl"><h3 className="font-bold text-slate-800">{editingId ? "Modifier l’opération logistique" : "Ajouter une opération logistique"}</h3><div className="grid grid-cols-2 gap-2"><label className="text-xs font-bold text-slate-700">Référence<input required value={form.code} disabled={Boolean(editingId)} onChange={(event) => setForm({ ...form, code: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Service<select value={form.serviceUnitCode} onChange={(event) => setForm({ ...form, serviceUnitCode: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal"><option value="chirurgie">Chirurgie</option><option value="medecine">Médecine</option><option value="maternite">Maternité</option></select></label><label className="text-xs font-bold text-slate-700">Plateaux<input required min="0" type="number" value={form.traysCount} onChange={(event) => setForm({ ...form, traysCount: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Responsable<input required value={form.agentName} onChange={(event) => setForm({ ...form, agentName: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Temp. chaude<input required type="number" step="0.1" value={form.tempHot} onChange={(event) => setForm({ ...form, tempHot: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Temp. froide<input required type="number" step="0.1" value={form.tempCold} onChange={(event) => setForm({ ...form, tempCold: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label></div><label className="text-xs font-bold text-slate-700">Statut<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal"><option value="PREPARATION">Préparation</option><option value="SCELLE_VALIDE">Scellé validé</option><option value="EN_DISTRIBUTION">En distribution</option><option value="TERMINE">Terminée</option></select></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setFormOpen(false)} className="px-3 py-2 bg-slate-100 rounded text-xs font-bold">Annuler</button><button type="submit" disabled={isSaving} className="px-3 py-2 bg-[#264DBF] text-white rounded text-xs font-bold disabled:opacity-50">{isSaving ? "Enregistrement..." : "Enregistrer"}</button></div></form></div>}
    </section>
  );
}
