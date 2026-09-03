"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { exportDistributionPdf, exportToExcel, printHtmlDocument } from "@/lib/exportUtils";

interface TrayItem {
  id: string;
  patientId: string;
  dietId: string;
  patient: string;
  ipp: string;
  service: "chirurgie" | "medecine" | "maternite";
  serviceLabel: string;
  roomBed: string;
  regime: "normal" | "diabetique" | "sans-sel" | "mixe";
  regimeLabel: string;
  textureLabel: string;
  extraLabel?: string;
  isBlocked?: boolean;
  statusBadge: {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  };
  menuDetails: {
    starter?: string;
    main?: string;
    side?: string;
    dessert?: string;
    patientMenu?: string;
    extraMenu?: string;
    blockedNote?: string;
  };
  allergens: string;
  token: string;
  tokenColorClass?: string;
  timestamp?: string;
}

interface FormState {
  patientId: string;
  dietId: string;
  qrToken: string;
  mealService: string;
  starter: string;
  mainCourse: string;
  sideDish: string;
  dessert: string;
  allergens: string;
}

interface OptionItem { id: string; name: string; }

export default function DistributionPage() {
  const { openQRModal } = useApp();
  const { showToast } = useToast();
  const [trays, setTrays] = useState<TrayItem[]>([]);
  const [patients, setPatients] = useState<OptionItem[]>([]);
  const [diets, setDiets] = useState<OptionItem[]>([]);
  const [stats, setStats] = useState({ total: 0, dressed: 0, blocked: 0, buffer: 0 });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("all");
  const [selectedRegime, setSelectedRegime] = useState("all");
  const [displayMode, setDisplayMode] = useState<"cards" | "table">("cards");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ patientId: "", dietId: "", qrToken: "", mealService: "Déjeuner", starter: "", mainCourse: "", sideDish: "", dessert: "", allergens: "Aucun" });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadDistribution = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/distribution");
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      const mapped: TrayItem[] = data.trays.map((tray: {
        id: string; patientId: string; dietId: string; qrToken: string; status: string; isBlocked: boolean; allergens: string | null;
        isExtraAccompagnant: boolean; extraDescription: string | null; starter: string | null; mainCourse: string | null; sideDish: string | null; dessert: string | null;
        patient: { firstName: string; lastName: string; ipp: string; isAJeun: boolean; serviceUnit: { code: string; name: string }; bed: { code: string; room: { number: string } }; diet: { code: string; name: string; texture: string } };
      }) => ({
        id: tray.id,
        patientId: tray.patientId,
        dietId: tray.dietId,
        patient: `${tray.patient.firstName} ${tray.patient.lastName}`,
        ipp: tray.patient.ipp,
        service: tray.patient.serviceUnit.code as TrayItem["service"],
        serviceLabel: tray.patient.serviceUnit.name,
        roomBed: `Ch. ${tray.patient.bed.room.number} • ${tray.patient.bed.code}`,
        regime: tray.patient.diet.code as TrayItem["regime"],
        regimeLabel: tray.patient.diet.name,
        textureLabel: tray.patient.diet.texture,
        isBlocked: tray.isBlocked || tray.patient.isAJeun || tray.status === "A_JEUN_BLOQUE",
        statusBadge: { label: tray.status.replaceAll("_", " "), bgClass: tray.isBlocked ? "bg-rose-100" : "bg-emerald-100", textClass: tray.isBlocked ? "text-rose-800" : "text-emerald-800", borderClass: tray.isBlocked ? "border-rose-300" : "border-emerald-300" },
        menuDetails: { starter: tray.starter || undefined, main: tray.mainCourse || undefined, side: tray.sideDish || undefined, dessert: tray.dessert || undefined, blockedNote: "PLATEAU BLOQUÉ - Consigné À JEUN." },
        allergens: tray.allergens || "Aucun",
        token: tray.qrToken,
        extraLabel: tray.isExtraAccompagnant ? "+1 Extra Accompagnant" : undefined,
        tokenColorClass: "text-sky-600",
      }));
      setTrays(mapped);
      setStats(data.stats);
      setPatients(data.patients.map((patient: { id: string; firstName: string; lastName: string }) => ({ id: patient.id, name: `${patient.firstName} ${patient.lastName}` })));
      setDiets(data.diets);
    } catch { showToast("error", "Chargement impossible", "Les distributions SQLite ne sont pas disponibles."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { const timer = window.setTimeout(() => void loadDistribution(), 0); return () => window.clearTimeout(timer); }, []);

  const filteredTrays = trays.filter((tray) => {
    const serviceMatch =
      selectedService === "all" || tray.service === selectedService;
    const regimeMatch =
      selectedRegime === "all" || tray.regime === selectedRegime;
    const searchMatch = !search || `${tray.patient} ${tray.ipp} ${tray.token}`.toLowerCase().includes(search.toLowerCase());
    return serviceMatch && regimeMatch && searchMatch;
  });

  const handlePrintBatch = () => {
    printHtmlDocument("Lot de distributions", filteredTrays.map((tray) => `<p>${tray.patient} - ${tray.token} - ${tray.statusBadge.label}</p>`).join(""));
  };

  const handleBlockedAlert = () => {
    alert(
      "Action impossible : levée médicale requise via le module Bloc/Dossier Patient"
    );
  };

  const handleReadyDeparture = async (patient: string) => {
    const tray = trays.find((item) => item.patient === patient);
    if (!tray || tray.isBlocked) return handleBlockedAlert();
    const response = await fetch("/api/distribution", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_STATUS", trayId: tray.id, status: "PRET_DEPART" }) });
    if (!response.ok) return showToast("error", "Statut non modifié", "Le plateau n'a pas pu être mis au départ.");
    showToast("success", "Plateau prêt au départ", `${patient} a été enregistré dans SQLite.`);
    await loadDistribution();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ patientId: patients[0]?.id || "", dietId: diets[0]?.id || "", qrToken: "", mealService: "Déjeuner", starter: "", mainCourse: "", sideDish: "", dessert: "", allergens: "Aucun" });
    setFormOpen(true);
  };

  const openEdit = (tray: TrayItem) => {
    setEditingId(tray.id);
    setForm({ patientId: tray.patientId, dietId: tray.dietId, qrToken: tray.token, mealService: "Déjeuner", starter: tray.menuDetails.starter || "", mainCourse: tray.menuDetails.main || "", sideDish: tray.menuDetails.side || "", dessert: tray.menuDetails.dessert || "", allergens: tray.allergens });
    setFormOpen(true);
  };

  const saveDistribution = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId && !window.confirm("Voulez-vous vraiment modifier cette distribution ?")) return;
    setIsSaving(true);
    try {
      const response = await fetch(editingId ? `/api/distribution/${editingId}` : "/api/distribution", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, action: editingId ? undefined : "CREATE" }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error);
      setFormOpen(false);
      await loadDistribution();
      showToast("success", editingId ? "Distribution modifiée" : "Distribution créée", "Les données ont été enregistrées dans SQLite.");
    } catch { showToast("error", "Enregistrement impossible", "Vérifiez les champs obligatoires et le token QR."); }
    finally { setIsSaving(false); }
  };

  const deleteDistribution = async (tray: TrayItem) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette distribution ?")) return;
    const response = await fetch(`/api/distribution/${tray.id}`, { method: "DELETE" });
    if (!response.ok) return showToast("error", "Suppression impossible", "La distribution n'a pas été supprimée.");
    await loadDistribution();
    showToast("success", "Distribution supprimée", "La suppression a été enregistrée dans SQLite.");
  };

  const exportDistribution = async () => {
    setIsExporting(true);
    try {
      const rows = filteredTrays.map((tray) => [tray.patient, tray.ipp, tray.serviceLabel, tray.regimeLabel, tray.token, tray.statusBadge.label]);
      await exportToExcel(`distribution_${new Date().toISOString().slice(0, 10)}.xlsx`, "Distribution", ["Patient", "IPP", "Service", "Régime", "Token", "Statut"], rows);
      showToast("success", "Export Excel généré", "Les distributions filtrées ont été exportées.");
    } catch { showToast("error", "Export impossible", "Le fichier Excel n'a pas pu être généré."); }
    finally { setIsExporting(false); }
  };

  const exportPdf = async () => {
    setIsExporting(true);
    try { await exportDistributionPdf(filteredTrays.map((tray) => [tray.patient, tray.ipp, tray.serviceLabel, tray.regimeLabel, tray.token, tray.statusBadge.label])); showToast("success", "PDF généré", "Le rapport a été téléchargé."); }
    catch { showToast("error", "PDF impossible", "Le rapport n'a pas pu être généré."); }
    finally { setIsExporting(false); }
  };

  return (
    <section id="view-kds" className="space-y-6">
      {/* Quick KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total Plateaux Déjeuner */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Total Plateaux Déjeuner
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.total}{" "}
              <span className="text-xs font-medium text-slate-400">
                / 88 lits & extras
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <i className="fa-solid fa-check"></i> 84 Patients + 4 Accompagnants
            </div>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-utensils"></i>
          </div>
        </div>

        {/* Card 2: Dressés & Scellés QR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Dressés & Scellés QR
            </div>
            <div
              className="text-2xl font-extrabold text-blue-600 mt-1"
              id="kds-dressed-count"
            >
              {stats.dressed}
            </div>
            <div className="text-[11px] text-sky-600 font-medium mt-1">
              Progression : 70.4%
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-qrcode"></i>
          </div>
        </div>

        {/* Card 3: Statut À JEUN */}
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between bg-rose-50/40">
          <div>
            <div className="text-xs font-semibold text-rose-600">
              🔴 Statut « À JEUN » (Bloqués)
            </div>
            <div
              className="text-2xl font-extrabold text-rose-700 mt-1"
              id="kds-blocked-count"
            >
              {stats.blocked}
            </div>
            <div className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
              <i className="fa-solid fa-ban"></i> Interdiction de départ
            </div>
          </div>
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center text-xl pulse-danger">
            <i className="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>

        {/* Card 4: Stock Tampon Sécurité */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Stock Tampon Sécurité (+5%)
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.buffer}{" "}
              <span className="text-xs font-medium text-slate-400">
                plateaux
              </span>
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Pour Commandes Tardives & Urgences
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-shield-heart"></i>
          </div>
        </div>
      </div>

      {/* Filter & Control Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher patient, IPP ou token" className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50" />
          {/* Dropdown Filtre Services */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-filter text-sky-600"></i> Service :
            </span>
            <select
              id="service-select-filter"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 shadow-sm transition cursor-pointer"
            >
              <option value="all">Tous les services (88)</option>
              <option value="chirurgie">Chirurgie (Étage 1)</option>
              <option value="medecine">Médecine Interne (Étage 2)</option>
              <option value="maternite">Maternité (Étage 3)</option>
            </select>
          </div>

          {/* Dropdown Filtre Régimes */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-filter text-sky-600"></i> Régime :
            </span>
            <select
              value={selectedRegime}
              onChange={(e) => setSelectedRegime(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 shadow-sm transition cursor-pointer"
            >
              <option value="all">Tous régimes confondus</option>
              <option value="normal">Normal (Standard)</option>
              <option value="diabetique">Diabétique</option>
              <option value="sans-sel">Sans Sel Strict</option>
              <option value="mixe">Mixé / Lisse</option>
            </select>
          </div>
        </div>

        {/* Options de Visualisation Ergonomiques */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 space-x-1">
            <button
              id="btn-view-cards"
              onClick={() => setDisplayMode("cards")}
              className={`w-9 h-8 flex items-center justify-center rounded-md transition cursor-pointer ${
                displayMode === "cards"
                  ? "bg-white text-[#264DBF] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vue Grille"
            >
              <i className="fa-solid fa-table-cells-large text-xs"></i>
            </button>
            <button
              id="btn-view-table"
              onClick={() => setDisplayMode("table")}
              className={`w-9 h-8 flex items-center justify-center rounded-md transition cursor-pointer ${
                displayMode === "table"
                  ? "bg-white text-[#264DBF] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vue Tableau"
            >
              <i className="fa-solid fa-table-list text-xs"></i>
            </button>
          </div>

          {isLoading && <span className="text-xs text-slate-500">Chargement...</span>}
          <button onClick={openCreate} className="px-3.5 py-2 bg-[#264DBF] hover:bg-[#1e3c99] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer"><i className="fa-solid fa-plus"></i><span>Nouvelle distribution</span></button>
          <button
            onClick={handlePrintBatch}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
          >
            <i className="fa-solid fa-print"></i>
            <span>Imprimer Lot QR Codes</span>
          </button>
          <button onClick={() => void exportDistribution()} disabled={isExporting} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"><i className="fa-solid fa-file-excel"></i><span>{isExporting ? "Génération..." : "Excel"}</span></button>
          <button onClick={() => void exportPdf()} disabled={isExporting} className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"><i className="fa-solid fa-file-pdf"></i><span>PDF</span></button>
        </div>
      </div>

      {/* OPTION 1 : VISUALISATION GRILLE / CANEVAS (CARDS) */}
      {displayMode === "cards" && (
        <div
          id="distribution-cards-container"
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {filteredTrays.map((tray) => {
            if (tray.isBlocked) {
              return (
                <div
                  key={tray.id}
                  id="card-plateau-blocked"
                  className="kds-tray-card bg-rose-50/30 rounded-xl border-2 border-rose-500 shadow-md overflow-hidden flex flex-col"
                  data-service={tray.service}
                >
                  <div className="p-4 bg-rose-500 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">
                        {tray.serviceLabel} • {tray.roomBed}
                      </span>
                      <h3 className="text-sm font-bold mt-0.5">
                        {tray.patient}{" "}
                        <span className="text-xs font-normal text-rose-200">
                          (IPP: {tray.ipp})
                        </span>
                      </h3>
                    </div>
                    <span className="px-2 py-1 bg-white text-rose-700 font-black text-[10px] rounded-full uppercase tracking-wider shadow">
                      {tray.statusBadge.label}
                    </span>
                  </div>
                  <div className="p-4 space-y-3 flex-1 text-xs">
                    <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-lg text-rose-900 font-bold text-center">
                      <i className="fa-solid fa-ban text-rose-600 text-base mb-1 block"></i>
                      {tray.menuDetails.blockedNote}
                    </div>
                    <div className="text-slate-500 line-through text-[11px]">
                      {tray.menuDetails.main}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 border-t border-rose-200 flex items-center justify-between">
                    <span className="text-[10px] text-rose-700 font-mono">
                      Horodatage : {tray.timestamp || "09:14:22"}
                    </span>
                    <button
                      onClick={handleBlockedAlert}
                      className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold opacity-60 cursor-not-allowed"
                    >
                      Départ Interdit
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={tray.id}
                className="kds-tray-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-sky-300 transition flex flex-col"
                data-service={tray.service}
              >
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        tray.service === "maternite"
                          ? "text-pink-700"
                          : "text-sky-700"
                      }`}
                    >
                      {tray.serviceLabel} • {tray.roomBed}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                      {tray.patient}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        (IPP: {tray.ipp})
                      </span>
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 font-bold text-[10px] rounded-full border ${tray.statusBadge.bgClass} ${tray.statusBadge.textClass} ${tray.statusBadge.borderClass}`}
                  >
                    {tray.statusBadge.label}
                  </span>
                </div>
                <div className="p-4 space-y-3 flex-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Régime :{" "}
                      <strong
                        className={
                          tray.regime === "sans-sel"
                            ? "text-amber-700"
                            : "text-slate-800"
                        }
                      >
                        {tray.regimeLabel}
                      </strong>
                    </span>
                    <span>
                      Texture :{" "}
                      <strong className="text-slate-800">
                        {tray.textureLabel}
                      </strong>
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                    {tray.menuDetails.starter && (
                      <div>
                        🥗 <b>Entrée :</b> {tray.menuDetails.starter}
                      </div>
                    )}
                    {tray.menuDetails.main && (
                      <div>
                        🐟 <b>Plat :</b> {tray.menuDetails.main}
                      </div>
                    )}
                    {tray.menuDetails.side && (
                      <div>
                        🍚 <b>Garniture :</b> {tray.menuDetails.side}
                      </div>
                    )}
                    {tray.menuDetails.dessert && (
                      <div>
                        🍓 <b>Dessert :</b> {tray.menuDetails.dessert}
                      </div>
                    )}
                    {tray.menuDetails.patientMenu && (
                      <div>
                        🥕 <b>Plateau Patient :</b> {tray.menuDetails.patientMenu}
                      </div>
                    )}
                    {tray.menuDetails.extraMenu && (
                      <div className="border-t border-slate-200 pt-1 text-emerald-700 font-medium">
                        👥 <b>Plateau Extra Facturé :</b> {tray.menuDetails.extraMenu}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      Allergènes :{" "}
                      <span className="text-slate-700 font-semibold">
                        {tray.allergens}
                      </span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        tray.tokenColorClass || "text-sky-600"
                      }`}
                    >
                      QR Token : #{tray.token}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      openQRModal({
                        patient: tray.patient,
                        loc: `${tray.serviceLabel} ${tray.roomBed}`,
                        regime: tray.regimeLabel,
                        token: tray.token,
                      })
                    }
                    className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-eye"></i>{" "}
                    <span>
                      {tray.extraLabel
                        ? "Aperçu 2 QR Codes"
                        : "Aperçu Étiquette QR"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleReadyDeparture(tray.patient)}
                    className="px-3 py-1 bg-[#264DBF] text-white rounded text-xs font-bold hover:bg-[#1e3c99] transition cursor-pointer"
                  >
                    <i className="fa-solid fa-check mr-1"></i> Prêt au Départ
                  </button>
                  <button onClick={() => openEdit(tray)} className="text-sky-700 text-xs font-bold cursor-pointer" title="Modifier"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => void deleteDistribution(tray)} className="text-rose-700 text-xs font-bold cursor-pointer" title="Supprimer"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OPTION 2 : VISUALISATION TABLEAU (TABLE VIEW) */}
      {displayMode === "table" && (
        <div
          id="distribution-table-container"
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3.5 w-44">Patient & IPP</th>
                  <th className="p-3.5 w-40">Localisation</th>
                  <th className="p-3.5 w-36">Régime & Texture</th>
                  <th className="p-3.5">Composition du Plateau</th>
                  <th className="p-3.5 w-28 text-center">QR Token</th>
                  <th className="p-3.5 w-32 text-center">Statut</th>
                  <th className="p-3.5 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTrays.map((tray) => {
                  if (tray.isBlocked) {
                    return (
                      <tr
                        key={tray.id}
                        className="kds-tray-row hover:bg-rose-50/50 bg-rose-50/30 transition"
                        data-service={tray.service}
                      >
                        <td className="p-3.5 align-middle">
                          <div className="font-extrabold text-rose-900 text-sm">
                            {tray.patient}
                          </div>
                          <div className="text-[10px] text-rose-600 font-mono">
                            IPP : {tray.ipp}
                          </div>
                        </td>
                        <td className="p-3.5 align-middle">
                          <div className="font-bold text-rose-700">
                            {tray.serviceLabel}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {tray.roomBed}
                          </div>
                        </td>
                        <td className="p-3.5 align-middle">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px] block w-max">
                            {tray.regimeLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">
                            {tray.textureLabel}
                          </span>
                        </td>
                        <td className="p-3.5 align-middle">
                          <div className="text-[11px] text-rose-700 font-bold">
                            🔴 PLATEAU BLOQUÉ - Consigné À JEUN par le Bloc
                            Opératoire
                          </div>
                        </td>
                        <td className="p-3.5 align-middle text-center font-mono text-slate-400">
                          Bloqué
                        </td>
                        <td className="p-3.5 align-middle text-center">
                          <span className="px-2 py-1 bg-rose-100 text-rose-800 font-black text-[10px] rounded-full border border-rose-300">
                            🔴 À JEUN
                          </span>
                        </td>
                        <td className="p-3.5 align-middle text-right">
                          <button
                            onClick={handleBlockedAlert}
                            className="px-2.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold opacity-60 cursor-not-allowed"
                          >
                            Départ Interdit
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={tray.id}
                      className="kds-tray-row hover:bg-slate-50/80 transition"
                      data-service={tray.service}
                    >
                      <td className="p-3.5 align-middle">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {tray.patient}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          IPP : {tray.ipp}
                        </div>
                      </td>
                      <td className="p-3.5 align-middle">
                        <div
                          className={`font-bold ${
                            tray.service === "maternite"
                              ? "text-pink-700"
                              : "text-sky-700"
                          }`}
                        >
                          {tray.serviceLabel}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {tray.roomBed}
                        </div>
                      </td>
                      <td className="p-3.5 align-middle">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] block w-max ${
                            tray.regime === "sans-sel"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tray.regimeLabel}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          {tray.extraLabel || tray.textureLabel}
                        </span>
                      </td>
                      <td className="p-3.5 align-middle">
                        <div className="text-[11px] text-slate-700 leading-snug">
                          {tray.menuDetails.starter && (
                            <span>{tray.menuDetails.starter} • </span>
                          )}
                          {tray.menuDetails.main && (
                            <span>{tray.menuDetails.main} • </span>
                          )}
                          {tray.menuDetails.side && (
                            <span>{tray.menuDetails.side} • </span>
                          )}
                          {tray.menuDetails.dessert && (
                            <span>{tray.menuDetails.dessert}</span>
                          )}
                          {tray.menuDetails.patientMenu && (
                            <>
                              <b>Patient :</b> {tray.menuDetails.patientMenu}
                              <br />
                              <span className="text-emerald-700 font-medium">
                                <b>Accompagnant :</b> {tray.menuDetails.extraMenu}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td
                        className={`p-3.5 align-middle text-center font-mono font-bold ${
                          tray.tokenColorClass || "text-sky-700"
                        }`}
                      >
                        #{tray.token}
                      </td>
                      <td className="p-3.5 align-middle text-center">
                        <span
                          className={`px-2 py-1 font-bold text-[10px] rounded-full border ${tray.statusBadge.bgClass} ${tray.statusBadge.textClass} ${tray.statusBadge.borderClass}`}
                        >
                          {tray.statusBadge.label}
                        </span>
                      </td>
                      <td className="p-3.5 align-middle text-right space-x-1">
                        <button
                          onClick={() =>
                            openQRModal({
                              patient: tray.patient,
                              loc: `${tray.serviceLabel} ${tray.roomBed}`,
                              regime: tray.regimeLabel,
                              token: tray.token,
                            })
                          }
                          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer"
                          title="Aperçu QR Code"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleReadyDeparture(tray.patient)}
                          className="px-2.5 py-1.5 bg-[#264DBF] text-white rounded-lg text-xs font-bold hover:bg-[#1e3c99] shadow-sm transition cursor-pointer"
                        >
                          Prêt Départ
                        </button>
                        <button onClick={() => openEdit(tray)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer" title="Modifier"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => void deleteDistribution(tray)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer" title="Supprimer"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {formOpen && <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"><form onSubmit={saveDistribution} className="bg-white rounded-xl p-5 w-full max-w-lg space-y-3 shadow-xl"><div className="flex items-center justify-between"><h3 className="font-bold text-slate-800">{editingId ? "Modifier la distribution" : "Nouvelle distribution"}</h3><button type="button" onClick={() => setFormOpen(false)} className="text-slate-500 cursor-pointer"><i className="fa-solid fa-xmark"></i></button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-xs font-bold text-slate-700">Patient<select required disabled={Boolean(editingId)} value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal">{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Régime<select required disabled={Boolean(editingId)} value={form.dietId} onChange={(event) => setForm({ ...form, dietId: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal">{diets.map((diet) => <option key={diet.id} value={diet.id}>{diet.name}</option>)}</select></label></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-xs font-bold text-slate-700">Token QR<input required disabled={Boolean(editingId)} value={form.qrToken} onChange={(event) => setForm({ ...form, qrToken: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Service repas<input required value={form.mealService} onChange={(event) => setForm({ ...form, mealService: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{([['starter','Entrée'],['mainCourse','Plat'],['sideDish','Garniture'],['dessert','Dessert']] as const).map(([key, label]) => <label key={key} className="text-xs font-bold text-slate-700">{label}<input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label>)}</div><label className="text-xs font-bold text-slate-700">Allergènes<input value={form.allergens} onChange={(event) => setForm({ ...form, allergens: event.target.value })} className="mt-1 w-full border border-slate-200 rounded p-2 font-normal" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setFormOpen(false)} className="px-3 py-2 bg-slate-100 rounded text-xs font-bold cursor-pointer">Annuler</button><button type="submit" disabled={isSaving} className="px-3 py-2 bg-[#264DBF] text-white rounded text-xs font-bold cursor-pointer disabled:opacity-50">{isSaving ? "Enregistrement..." : "Enregistrer"}</button></div></form></div>}
    </section>
  );
}
