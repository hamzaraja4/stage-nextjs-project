"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/ui";
import type { IconName } from "@/components/ui";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  badge?: React.ReactNode;
  children?: NavChild[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();

  const {
    blockedCount,
    simulatedRole,
    setSimulatedRole,
  } = useApp();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const toggleGroup = (href: string) => {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const handleRoleChange = (newRole: string) => {
    setSimulatedRole(newRole);
    if (newRole === "chef") router.push("/distribution");
    else if (newRole === "soignant") router.push("/mobile");
    else if (newRole === "caisse") router.push("/pos");
    else if (newRole === "admin") router.push("/antifraude");
  };

  const NAV_GROUPS: NavGroup[] = [
    {
      title: "Pilotage Clinique",
      items: [
        {
          label: "Distribution",
          href: "/distribution",
          icon: "UtensilsCrossed",
          badge: (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {blockedCount} {blockedCount > 1 ? "Bloqués" : "Bloqué"}
            </span>
          ),
        },
        {
          label: "Menu & Répartition",
          href: "/production",
          icon: "CalendarDays",
          badge: (
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              10:00
            </span>
          ),
        },
        {
          label: "Départ Chariots",
          href: "/logistique",
          icon: "Truck",
          badge: (
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded">
              4 Chariots
            </span>
          ),
        },
      ],
    },
    {
      title: "Mobilité & Contrôle",
      items: [
        {
          label: "Terminal Mobile",
          href: "/mobile",
          icon: "Smartphone",
          badge: (
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block"></span>
          ),
        },
        {
          label: "Audit Anti-Fraude",
          href: "/antifraude",
          icon: "ShieldCheck",
          badge: (
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-1.5 py-0.5 rounded">
              0 Écart
            </span>
          ),
        },
      ],
    },
    {
      title: "Self, Stocks & HACCP",
      items: [
        {
          label: "Cantine Personnel",
          href: "/pos",
          icon: "CreditCard",
        },
        {
          label: "Stocks & Réapprov",
          href: "/stocks",
          icon: "Boxes",
          badge: (
            <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
              2 Alertes
            </span>
          ),
        },
        {
          label: "Contrôle Qualité",
          href: "/haccp",
          icon: "ThermometerSnowflake",
          badge: (
            <span className="bg-teal-400/30 text-teal-100 text-[10px] px-1.5 py-0.5 rounded">
              7j Ok
            </span>
          ),
        },
        {
          label: "Design System",
          href: "/design-system",
          icon: "Palette",
        },
      ],
    },
  ];

  return (
    <nav
      className={`flex h-full flex-col bg-primary text-primary-foreground transition-all duration-300 shrink-0 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
      aria-label="Menu principal de restauration hospitalière"
    >
      {/* Header / Toggle */}
      <div
        className={`flex items-center justify-between p-4 border-b border-white/10 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-wider uppercase text-white">
              HIS-Catering
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Ouvrir le menu" : "Fermer le menu"}
          title={collapsed ? "Ouvrir le menu" : "Fermer le menu"}
          className="grid size-8 place-items-center rounded-small text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white [&_svg]:shrink-0 [&_svg]:text-current cursor-pointer"
        >
          {collapsed ? (
            <Icon name="PanelLeftOpen" aria-hidden="true" />
          ) : (
            <Icon name="PanelLeftClose" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Grouped Navigation */}
      <div className="nav-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-3 custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold text-white/60 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = expanded[item.href];
              const isActive =
                pathname === item.href ||
                (item.children ?? []).some((child) => child.href === pathname);

              return (
                <div key={item.href} className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      hasChildren && !collapsed
                        ? toggleGroup(item.href)
                        : handleNavigate(item.href)
                    }
                    title={item.label}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    className={`flex items-center gap-3 rounded-small px-3 py-2 text-left text-body-medium transition-colors focus-visible:ring-2 focus-visible:ring-white [&_svg]:shrink-0 [&_svg]:text-current cursor-pointer ${
                      isActive
                        ? "bg-white/20 text-white font-semibold shadow-xs"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon name={item.icon} size="default" aria-hidden="true" />
                    {!collapsed && (
                      <span className="truncate flex-1 text-xs font-medium">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge}
                    {hasChildren && !collapsed && (
                      <Icon
                        name="ChevronDown"
                        size="small"
                        aria-hidden="true"
                        className={`ml-auto transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {hasChildren && !collapsed && isOpen && (
                    <div className="ml-8 flex flex-col gap-1 border-l border-white/20 pl-2">
                      {item.children!.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <button
                            key={child.href}
                            type="button"
                            onClick={() => handleNavigate(child.href)}
                            title={child.label}
                            className={`flex items-center rounded-small px-3 py-1.5 text-left text-small transition-colors focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                              isChildActive
                                ? "bg-white/20 text-white font-semibold"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span className="truncate">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role Selector Simulator in Footer */}
      {!collapsed ? (
        <div className="p-3 bg-black/15 border-t border-white/10">
          <label
            htmlFor="roleSelectorNav"
            className="block text-[10px] font-semibold text-white/70 mb-1"
          >
            Rôle Actif :
          </label>
          <select
            id="roleSelectorNav"
            value={simulatedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full bg-white/15 border border-white/25 text-white text-xs rounded p-1.5 focus:ring-1 focus:ring-white outline-none cursor-pointer"
          >
            <option value="chef" className="text-slate-800">Chef Cuisine / Économe</option>
            <option value="soignant" className="text-slate-800">Soignant d&apos;Étage (Infirmier)</option>
            <option value="caisse" className="text-slate-800">Agent Caisse Self</option>
            <option value="admin" className="text-slate-800">Direction Médicale & Qualité</option>
          </select>
        </div>
      ) : (
        <div className="p-2 text-center text-[10px] text-white/50 border-t border-white/10">
          HIS
        </div>
      )}
    </nav>
  );
}
