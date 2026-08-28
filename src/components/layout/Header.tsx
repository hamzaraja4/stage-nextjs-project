"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, openMiseAJeunModal } = useApp();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
      case "/distribution":
        return "Distribution";
      case "/production":
        return "Menu du Jour & Répartition";
      case "/logistique":
        return "Contrôle & Départ Chariots";
      case "/mobile":
        return "Terminal Mobile Soignant";
      case "/antifraude":
        return "Audit Anti-Fraude";
      case "/pos":
        return "Cantine Personnel";
      case "/stocks":
        return "Stocks & Réapprovisionnement";
      case "/haccp":
        return "Contrôle Qualité";
      default:
        return "Distribution";
    }
  };

  const isClinical =
    pathname === "/" ||
    pathname === "/distribution" ||
    pathname === "/production" ||
    pathname === "/logistique";

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
      <div className="flex items-center space-x-5">
        {/* Bouton Toggle Sidebar */}
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-sm border border-slate-200 cursor-pointer"
          title="Afficher/Masquer le menu"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m16 15-3-3 3-3"></path>
          </svg>
        </button>

        <h1
          id="view-title"
          className="text-xl font-extrabold text-slate-900 tracking-tight"
        >
          {getPageTitle()}
        </h1>

        {/* Badge Service Actif (Conditionnel aux vues cliniques) */}
        {isClinical && (
          <div id="header-service-group" className="flex items-center space-x-2.5">
            <span className="h-8 w-px bg-slate-200"></span>
            <span className="text-xs font-semibold text-slate-500">
              Service actif :
            </span>
            <span className="px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-extrabold border border-amber-200/80 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Déjeuner (12:00 - 12:30)
            </span>
          </div>
        )}
      </div>

      {/* Quick Action Triggers & Status Indicators */}
      <div className="flex items-center space-x-4">
        {/* Live Heure Limite Timer */}
        {isClinical && (
          <div
            id="header-cutoff-timer"
            className="flex items-center space-x-3 px-4 py-2 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-medium"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-sm">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Heure Limite
              </div>
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span>10:00</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  Reste 42 min
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Trigger Emergency "Mise à Jeun" Demo Modal */}
        {isClinical && (
          <button
            id="header-jeun-btn"
            onClick={openMiseAJeunModal}
            className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold text-xs rounded-xl border border-rose-200/90 transition flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <i className="fa-solid fa-triangle-exclamation text-rose-600 text-sm"></i>
            <span>Déclencher « À JEUN »</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition text-base relative cursor-pointer"
            title="Notifications"
          >
            <i className="fa-regular fa-bell"></i>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
