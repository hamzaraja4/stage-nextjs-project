"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

export default function MobilePage() {
  const { addAuditLog } = useApp();
  const { showToast } = useToast();
  const [scanStep, setScanStep] = useState<number>(0); // 0: initial, 1: patient scanned, 2: tray scanned
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScanPatient = () => {
    setScanStep(1);
    setShowError(false);
  };

  const handleScanTray = async () => {
    if (scanStep !== 1) return;
    setIsScanning(true);
    setShowError(false);
    try {
      const response = await fetch("/api/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_DOUBLE_SCAN",
          patientIpp: "2026-9812",
          trayToken: "9812-7A",
          agentName: "Inf. Fatima Zahra (Mobile)",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "La validation du double scan a échoué.");
        setShowError(true);
        showToast("error", "Distribution refusée", data.error);
        return;
      }
      setScanStep(2);
      if (data.auditEntry) {
        const entry = data.auditEntry;
        addAuditLog({
          id: entry.id,
          time: new Date(entry.timestamp).toTimeString().split(" ")[0],
          patient: entry.patientName,
          ipp: entry.ipp,
          location: entry.location,
          agent: entry.agentName,
          mealType: entry.mealType,
          scanResult: entry.scanResult,
          scanDuration: entry.scanDuration,
          status: "Certifié",
        });
      }
      showToast("success", "Distribution certifiée", "Le double scan a été enregistré dans l’audit.");
    } catch {
      setErrorMessage("Le serveur est indisponible. Réessayez dans quelques instants.");
      setShowError(true);
      showToast("error", "Scan impossible", "La connexion au serveur a échoué.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanFraudMismatch = async () => {
    setIsScanning(true);
    setScanStep(0);
    try {
      const response = await fetch("/api/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_DOUBLE_SCAN",
          patientIpp: "2026-9812",
          trayToken: "8831-2B",
          agentName: "Inf. Fatima Zahra (Mobile)",
          isSimulatedMismatch: true,
        }),
      });
      const data = await response.json();
      setErrorMessage(data.error || "Discordance détectée.");
      setShowError(true);
      showToast("warning", "Discordance enregistrée", "L’alerte anti-fraude a été ajoutée à l’audit.");
    } catch {
      setErrorMessage("Le serveur est indisponible. Réessayez dans quelques instants.");
      setShowError(true);
      showToast("error", "Alerte non enregistrée", "La connexion au serveur a échoué.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setScanStep(0);
    setShowError(false);
    setErrorMessage("");
  };

  return (
    <section id="view-mobile" className="space-y-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden">
        {/* Smartphone Notch & Top Bar */}
        <div className="bg-slate-900 text-white px-5 pt-3 pb-2 flex items-center justify-between text-xs">
          <span>09:41</span>
          <div className="w-20 h-3.5 bg-black rounded-full mx-auto"></div>
          <div className="flex items-center space-x-1.5">
            <i className="fa-solid fa-wifi text-[10px]"></i>
            <i className="fa-solid fa-battery-full text-[11px]"></i>
          </div>
        </div>

        {/* App Header */}
        <div className="bg-[#264DBF] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <h3 className="font-bold text-xs">HIS Mobile • Double Scan</h3>
              <p className="text-[10px] text-sky-200">
                Infirmier : Fatima Zahra (Étage 1)
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-mono">
            En ligne
          </span>
        </div>

        {/* Simulator Body */}
        <div className="p-5 space-y-4 bg-slate-50 text-xs">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Validation de remise du plateau
            </span>
            <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">
              Procédure Inviolable en Boucle Fermée
            </h4>
          </div>

          {/* Step 1: Scan Bracelet Patient */}
          <div className="p-3.5 bg-white rounded-xl border-2 border-dashed border-sky-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Scan Bracelet Patient (IPP)</span>
              </span>
              <span
                id="scan-step-1-badge"
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  scanStep >= 1
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {scanStep >= 1 ? "IPP Validé" : "En attente"}
              </span>
            </div>

            {scanStep >= 1 && (
              <div
                id="scan-patient-data"
                className="p-2 bg-sky-50 rounded border border-sky-200 text-[11px] text-sky-900 animate-in fade-in"
              >
                👤 <b>Patient :</b> Amine TAZI | IPP: 2026-9812
                <br />
                📍 <b>Lit :</b> Chirurgie Ch. 101 Lit A | Régime: Normal
              </div>
            )}

            <button
              onClick={handleScanPatient}
              id="btn-scan-patient"
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <i className="fa-solid fa-barcode"></i>
              <span>Scanner Bracelet Patient</span>
            </button>
          </div>

          {/* Step 2: Scan QR Plateau */}
          <div
            id="step-2-box"
            className={`p-3.5 bg-white rounded-xl border-2 border-dashed space-y-2 transition-all ${
              scanStep >= 1
                ? "border-sky-400 opacity-100"
                : "border-slate-300 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-600 text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Scan QR Code Plateau-Repas</span>
              </span>
              <span
                id="scan-step-2-badge"
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  scanStep === 2
                    ? "bg-emerald-100 text-emerald-800"
                    : scanStep === 1
                    ? "bg-sky-100 text-sky-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {scanStep === 2
                  ? "QR Conforme"
                  : scanStep === 1
                  ? "Prêt à scanner"
                  : "Verrouillé"}
              </span>
            </div>

            {scanStep === 2 && (
              <div
                id="scan-tray-data"
                className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-900 animate-in fade-in"
              >
                🍱 <b>Plateau :</b> Token #9812-7A | Conforme Standard
              </div>
            )}

            <button
              onClick={handleScanTray}
              id="btn-scan-tray"
              disabled={scanStep < 1 || isScanning}
              className={`w-full py-2 font-bold rounded-lg flex items-center justify-center space-x-2 transition ${
                scanStep >= 1
                  ? "bg-[#264DBF] hover:bg-[#1e3c99] text-white cursor-pointer"
                  : "bg-slate-400 text-white cursor-not-allowed"
              }`}
            >
              <i className="fa-solid fa-qrcode"></i>
              <span>{isScanning ? "Validation en cours..." : "Scanner Plateau-Repas"}</span>
            </button>
          </div>

          {/* Test Mismatch / Error Button */}
          <button
            onClick={handleScanFraudMismatch}
            disabled={isScanning}
            id="btn-scan-fraud"
            className="w-full py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] rounded-lg border border-rose-200 transition cursor-pointer"
          >
            <i className="fa-solid fa-bug mr-1"></i> Simuler Test de
            Discordance / Fraude
          </button>

          {/* Result Box: Success */}
          {scanStep === 2 && !showError && (
            <div
              id="scan-success-banner"
              className="p-3.5 bg-emerald-600 text-white rounded-xl text-center space-y-1 shadow-lg animate-bounce"
            >
              <i className="fa-solid fa-circle-check text-2xl"></i>
              <div className="font-black text-sm">
                DISTRIBUTION CONFORME VALIDÉE !
              </div>
              <div className="text-[10px] text-emerald-100">
                Horodatage certifié • Débit décrémenté • Latence 120ms
              </div>
            </div>
          )}

          {/* Result Box: Error */}
          {showError && (
            <div
              id="scan-error-banner"
              className="p-3.5 bg-rose-600 text-white rounded-xl text-center space-y-1 shadow-lg animate-in fade-in"
            >
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              <div className="font-black text-sm">
                ALERTE : DISCORDANCE MAJEURE !
              </div>
              <div className="text-[10px] text-rose-100" id="scan-error-text">
                {errorMessage ||
                  "Le plateau scanné ne correspond pas à l'identité ou au régime prescrit !"}
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full py-1.5 text-slate-500 hover:text-slate-700 text-[11px] font-medium underline cursor-pointer"
          >
            Réinitialiser la démonstration mobile
          </button>
        </div>
      </div>
    </section>
  );
}
