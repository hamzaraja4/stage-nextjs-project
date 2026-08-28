"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

interface NavLinkItem {
  href: string;
  label: string;
  badge?: React.ReactNode;
  labelClass?: string;
  highlight?: boolean;
}

interface NavGroupItem {
  section: string;
  links: NavLinkItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    blockedCount,
    simulatedRole,
    setSimulatedRole,
  } = useApp();

  const handleRoleChange = (newRole: string) => {
    setSimulatedRole(newRole);
    if (newRole === "chef") {
      router.push("/distribution");
    } else if (newRole === "soignant") {
      router.push("/mobile");
    } else if (newRole === "caisse") {
      router.push("/pos");
    } else if (newRole === "admin") {
      router.push("/antifraude");
    }
  };

  const navItems: NavGroupItem[] = [
    {
      section: "Pilotage Clinique",
      links: [
        {
          href: "/distribution",
          label: "Distribution",
          badge: (
            <span
              className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              id="badge-a-jeun-count"
            >
              {blockedCount} {blockedCount > 1 ? "Bloqués" : "Bloqué"}
            </span>
          ),
          highlight: true,
        },
        {
          href: "/production",
          label: "Menu du Jour & Répartition",
          badge: (
            <span className="bg-sky-500/20 text-sky-200 text-[10px] px-2 py-0.5 rounded font-mono">
              10:00
            </span>
          ),
        },
        {
          href: "/logistique",
          label: "Contrôle & Départ Chariots",
          badge: (
            <span className="bg-blue-800 text-slate-200 text-[10px] px-1.5 py-0.5 rounded">
              4 Chariots
            </span>
          ),
        },
      ],
    },
    {
      section: "Mobilité Soignante & Contrôle",
      links: [
        {
          href: "/mobile",
          label: "Terminal Mobile Soignant",
          labelClass: "font-semibold text-purple-200",
          badge: (
            <span className="animate-ping w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
          ),
        },
        {
          href: "/antifraude",
          label: "Audit Anti-Fraude",
          badge: (
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded">
              0 Ecart
            </span>
          ),
        },
      ],
    },
    {
      section: "Self, Stocks & HACCP",
      links: [
        {
          href: "/pos",
          label: "Cantine Personnel",
        },
        {
          href: "/stocks",
          label: "Stocks & Réapprov",
          badge: (
            <span
              className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded"
              id="badge-po-count"
            >
              2 Alertes
            </span>
          ),
        },
        {
          href: "/haccp",
          label: "Contrôle Qualité",
          badge: (
            <span className="bg-teal-500/20 text-teal-300 text-[10px] px-1.5 py-0.5 rounded">
              7j Ok
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <aside
      id="app-sidebar"
      className={`w-72 text-white flex flex-col flex-shrink-0 z-30 shadow-xl select-none ${
        sidebarCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Header App / Uniquement le Titre */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-blue-700/40 bg-[#264DBF]">
        <div className="overflow-hidden">
          <Link
            href="/distribution"
            className="font-extrabold text-base tracking-wider uppercase truncate block text-white hover:text-blue-100"
          >
            Restauration
          </Link>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-blue-200 hover:text-white transition p-1 cursor-pointer"
          title="Replier le menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m16 15-3-3 3-3"></path>
          </svg>
        </button>
      </div>

      {/* Navigation Links (Sans icônes, conforme à la maquette) */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1.5 text-xs font-medium">
        {navItems.map((group, groupIdx) => (
          <div key={group.section} className={groupIdx > 0 ? "pt-3" : ""}>
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-blue-200 uppercase tracking-wider">
              {group.section}
            </div>
            {group.links.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname === "/" && link.href === "/distribution");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition mb-1 ${
                    isActive
                      ? "bg-blue-800 text-white font-bold"
                      : "text-slate-100 hover:bg-blue-800/60"
                  }`}
                >
                  <span
                    className={
                      link.labelClass
                        ? link.labelClass
                        : link.highlight
                        ? "font-semibold"
                        : ""
                    }
                  >
                    {link.label}
                  </span>
                  {link.badge}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Simulation Switcher */}
      <div className="p-3 bg-[#1e3c99] border-t border-blue-700/40">
        <label
          htmlFor="roleSelector"
          className="block text-[10px] font-semibold text-blue-200 mb-1"
        >
          Simuler Rôle Utilisateur :
        </label>
        <select
          id="roleSelector"
          value={simulatedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-full bg-[#1b3588] border border-blue-600/60 text-slate-100 text-xs rounded p-1.5 focus:ring-1 focus:ring-sky-400 outline-none cursor-pointer"
        >
          <option value="chef">Chef Cuisine / Économe</option>
          <option value="soignant">Soignant d&apos;Étage (Infirmier)</option>
          <option value="caisse">Agent Caisse Self & Restauration</option>
          <option value="admin">Direction Médicale & Qualité</option>
        </select>
      </div>
    </aside>
  );
};
