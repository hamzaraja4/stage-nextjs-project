"use client";

import React, { useEffect, useState } from "react";
import { exportToExcel, printHtmlDocument } from "@/lib/exportUtils";
import { useToast } from "@/context/ToastContext";

export default function AntiFraudePage() {
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; timestamp: string; patientName: string; ipp: string; location: string; agentName: string; mealType: string; scanResult: string; scanDuration: string; status: string }>>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadAudit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/antifraude?search=${encodeURIComponent(search)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setAuditLogs(data.logs);
    } catch { showToast("error", "Audit indisponible", "Impossible de récupérer les événements SQLite."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { const timer = window.setTimeout(() => void loadAudit(), 0); return () => window.clearTimeout(timer); }, [search]);

  const exportAudit = async () => {
    await exportToExcel(`antifraude-${new Date().toISOString().slice(0, 10)}.xlsx`, "Audit", ["Date", "Patient", "IPP", "Lieu", "Agent", "Repas", "Résultat", "Statut"], auditLogs.map((entry) => [entry.timestamp, entry.patientName, entry.ipp, entry.location, entry.agentName, entry.mealType, entry.scanResult, entry.status]));
    showToast("success", "Export Excel généré", "Les événements d’audit ont été exportés.");
  };

  return (
    <section id="view-antifraude" className="space-y-6">
      {/* 5 Piliers Anti-Fraude Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Pilier 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
            1
          </div>
          <h4 className="font-bold text-xs text-slate-800">
            QR Code Unique Cryptographique
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Généré uniquement sur lit actif ou facturation d&apos;extra validée.
            Réimpression sous mot de passe responsable avec annulation du jeton
            précédent.
          </p>
        </div>

        {/* Pilier 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
            2
          </div>
          <h4 className="font-bold text-xs text-slate-800">
            Contrôle Départ & Scellé Chariot
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Scan de chaque plateau lors de l&apos;intégration au chariot isotherme.
            Alarme sonore et blocage immédiat si un plateau surnuméraire est
            détecté.
          </p>
        </div>

        {/* Pilier 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
            3
          </div>
          <h4 className="font-bold text-xs text-slate-800">Double Scan au Lit</h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Scan simultané IPP Bracelet + QR Plateau. Vérification en moins de
            500 ms de l&apos;adéquation identité, régime et statut « À JEUN ».
          </p>
        </div>

        {/* Pilier 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
            4
          </div>
          <h4 className="font-bold text-xs text-slate-800">Timeout 45 Minutes</h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Tout plateau sorti de cuisine non scanné au lit dans les 45 min
            déclenche une alerte rouge automatique sur le tableau de bord
            direction.
          </p>
        </div>

        {/* Pilier 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
            5
          </div>
          <h4 className="font-bold text-xs text-slate-800">
            Audit Journalier Rendement
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Rapprochement automatique matières déstockées vs portions
            déclarées. Tout écart &gt; 3% génère un rapport transmis au Directeur
            Financier.
          </p>
        </div>
      </div>

      {/* Live Reconciliation Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Journal d&apos;Audit en Temps Réel des Scans & Distributions
          </h3>
          <div className="flex items-center gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher" className="px-2 py-1 border border-slate-200 rounded text-xs" /><button onClick={() => void exportAudit()} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Excel</button><button onClick={() => printHtmlDocument("Audit anti-fraude", auditLogs.map((entry) => `<p>${entry.patientName} - ${entry.scanResult} - ${entry.status}</p>`).join(""))} className="px-2 py-1 bg-slate-700 text-white rounded text-xs font-bold">Imprimer</button></div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
            <i className="fa-solid fa-lock"></i> Registre Inviolable Non
            Modifiable
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Horodatage</th>
                <th className="p-3">Patient / IPP</th>
                <th className="p-3">Chambre / Lit</th>
                <th className="p-3">Agent Soignant</th>
                <th className="p-3">Type Repas</th>
                <th className="p-3">Résultat Double Scan</th>
                <th className="p-3 text-right">Statut Fraude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium" id="audit-log-body">
              {isLoading ? <tr><td colSpan={7} className="p-4 text-slate-500">Chargement de l’audit...</td></tr> : auditLogs.length === 0 ? <tr><td colSpan={7} className="p-4 text-slate-500">Aucun événement trouvé.</td></tr> : auditLogs.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="p-3 font-mono text-slate-500">{new Date(entry.timestamp).toLocaleTimeString("fr-FR")}</td>
                  <td className="p-3 font-bold text-slate-800">
                    {entry.patientName} ({entry.ipp})
                  </td>
                  <td className="p-3">{entry.location}</td>
                  <td className="p-3">{entry.agentName}</td>
                  <td className="p-3">{entry.mealType}</td>
                  <td className="p-3 text-emerald-600 font-bold">
                    <i className="fa-solid fa-check-double mr-1"></i>{" "}
                    {entry.scanResult} ({entry.scanDuration})
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
