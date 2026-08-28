"use client";

import React from "react";

export default function ProductionPage() {
  return (
    <section id="view-production" className="space-y-6">
      {/* Horaires Limites de Validation */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-800">
            Horaires Limites de Validation
          </h2>
          <span className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-bold border border-sky-200">
            Cycle Semaine 3 / Jour 4 (Mercredi)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* 1. Petit-déjeuner */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Petit-déjeuner
            </div>
            <div className="text-xs text-slate-400">07:30 - 08:00</div>
            <div className="mt-2 text-xs font-bold text-slate-800">
              Clôture : J-1 19:30
            </div>
            <div className="text-[10px] text-slate-500">Tardif : J 06:30</div>
            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
              Service clos / Verrouillé
            </span>
          </div>

          {/* 2. Déjeuner */}
          <div className="p-3 rounded-lg border-2 border-sky-500 bg-sky-50/50 relative shadow-sm">
            <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
              En cours
            </span>
            <div className="text-[11px] font-bold text-sky-800 uppercase">
              Déjeuner
            </div>
            <div className="text-xs text-sky-600">12:00 - 12:30</div>
            <div className="mt-2 text-xs font-bold text-sky-900">
              Clôture : J 10:00
            </div>
            <div className="text-[10px] text-sky-700">
              Tardif : J 11:00 (+5% Tampon)
            </div>
            <span className="inline-block mt-2 px-2 py-0.5 bg-sky-600 text-white text-[10px] font-bold rounded">
              Production Active
            </span>
          </div>

          {/* 3. Collation */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Collation
            </div>
            <div className="text-xs text-slate-400">15:30 - 16:00</div>
            <div className="mt-2 text-xs font-bold text-slate-800">
              Clôture : J 14:00
            </div>
            <div className="text-[10px] text-slate-500">Tardif : J 14:30</div>
            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
              En Attente
            </span>
          </div>

          {/* 4. Dîner */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Dîner
            </div>
            <div className="text-xs text-slate-400">18:30 - 19:00</div>
            <div className="mt-2 text-xs font-bold text-slate-800">
              Clôture : J 16:00
            </div>
            <div className="text-[10px] text-slate-500">Tardif : J 17:30</div>
            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
              En Attente
            </span>
          </div>

          {/* 5. Garde Médicale */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Garde Médicale
            </div>
            <div className="text-xs text-slate-400">20:00 - 21:00</div>
            <div className="mt-2 text-xs font-bold text-slate-800">
              Clôture : J 17:00
            </div>
            <div className="text-[10px] text-slate-500">Tardif : J 18:30</div>
            <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
              12 Médecins Garde
            </span>
          </div>
        </div>
      </div>

      {/* Matrice des Menus Cycliques & Déclinaisons */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3 w-36">Régime</th>
                <th className="p-3 w-24 text-center">Plateaux</th>
                <th className="p-3">Entrée</th>
                <th className="p-3">Plat Protéiné</th>
                <th className="p-3">Garniture & Légumes</th>
                <th className="p-3">Dessert / Laitage</th>
                <th className="p-3 bg-blue-50/80 text-blue-900 text-right w-28 font-black">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* 1. Normal Standard */}
              <tr className="hover:bg-slate-50/80 transition">
                <td className="p-3 align-top">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md font-extrabold text-xs block w-max">
                    Normal Standard
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Texture : Normale
                  </div>
                </td>
                <td className="p-3 align-top text-center">
                  <div className="font-extrabold text-slate-800 text-sm">46</div>
                  <div className="text-[10px] text-slate-400">repas</div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">Salade composée</div>
                  <div className="text-[11px] text-slate-500">
                    Crudités (80g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-blue-700 bg-sky-50 px-1.5 py-0.5 rounded inline-block border border-sky-200">
                    Total : 3.68 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">Pavé de saumon</div>
                  <div className="text-[11px] text-slate-500">
                    Beurre fin (140g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-blue-700 bg-sky-50 px-1.5 py-0.5 rounded inline-block border border-sky-200">
                    Total : 6.44 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Riz pilaf & Haricots
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Riz (120g) + Haricots (100g)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-blue-700 bg-sky-50 px-1.5 py-0.5 rounded inline-block border border-sky-200">
                    Riz : 5.52 Kg | Haricots : 4.60 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">Yaourt aux fruits</div>
                  <div className="text-[11px] text-slate-500">
                    Pot (125g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-blue-700 bg-sky-50 px-1.5 py-0.5 rounded inline-block border border-sky-200">
                    Total : 46 pots (5.75 Kg)
                  </div>
                </td>
                <td className="p-3 align-top bg-blue-50/40 text-right font-mono border-l border-slate-200">
                  <div className="font-black text-sm text-blue-900">
                    25.99 Kg
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    565g/plt
                  </div>
                </td>
              </tr>

              {/* 2. Diabétique */}
              <tr className="hover:bg-slate-50/80 transition">
                <td className="p-3 align-top">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md font-extrabold text-xs block w-max">
                    Diabétique
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Sans sucre ajouté
                  </div>
                </td>
                <td className="p-3 align-top text-center">
                  <div className="font-extrabold text-slate-800 text-sm">18</div>
                  <div className="text-[10px] text-slate-400">repas</div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">Salade verte</div>
                  <div className="text-[11px] text-slate-500">
                    Vinaigrette allégée (60g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded inline-block border border-purple-200">
                    Total : 1.08 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Blanc de volaille
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Poché aux herbes (140g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded inline-block border border-purple-200">
                    Total : 2.52 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Haricots verts vapeur
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Fibres & IG bas (180g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded inline-block border border-purple-200">
                    Total : 3.24 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Compote ss sucre
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pomme nature (100g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded inline-block border border-purple-200">
                    Total : 1.80 Kg
                  </div>
                </td>
                <td className="p-3 align-top bg-blue-50/40 text-right font-mono border-l border-slate-200">
                  <div className="font-black text-sm text-blue-900">8.64 Kg</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    480g/plt
                  </div>
                </td>
              </tr>

              {/* 3. Sans Sel Strict */}
              <tr className="hover:bg-slate-50/80 transition">
                <td className="p-3 align-top">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-extrabold text-xs block w-max">
                    Sans Sel Strict
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Hyposodé
                  </div>
                </td>
                <td className="p-3 align-top text-center">
                  <div className="font-extrabold text-slate-800 text-sm">12</div>
                  <div className="text-[10px] text-slate-400">repas</div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">Carottes râpées</div>
                  <div className="text-[11px] text-slate-500">
                    Citron ss sel (80g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block border border-amber-200">
                    Total : 0.96 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Pavé saumon vapeur
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cuisson vapeur (140g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block border border-amber-200">
                    Total : 1.68 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Riz & Courgettes
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Riz (120g) + Courgettes (100g)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block border border-amber-200">
                    Riz : 1.44 Kg | Courgettes : 1.20 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Fruit de saison
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Calibré frais (150g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block border border-amber-200">
                    Total : 12 pcs (1.80 Kg)
                  </div>
                </td>
                <td className="p-3 align-top bg-blue-50/40 text-right font-mono border-l border-slate-200">
                  <div className="font-black text-sm text-blue-900">7.08 Kg</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    590g/plt
                  </div>
                </td>
              </tr>

              {/* 4. Mixé / Lisse */}
              <tr className="hover:bg-slate-50/80 transition">
                <td className="p-3 align-top">
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-md font-extrabold text-xs block w-max">
                    Mixé / Lisse
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Texture lisse
                  </div>
                </td>
                <td className="p-3 align-top text-center">
                  <div className="font-extrabold text-slate-800 text-sm">8</div>
                  <div className="text-[10px] text-slate-400">repas</div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Velouté de légumes
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Texture lisse (150 ml / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block border border-teal-200">
                    Total : 1.20 L
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Mixé lisse de veau
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Hachage fin (120g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block border border-teal-200">
                    Total : 0.96 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">
                    Purée de carottes
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Texture homogène (180g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block border border-teal-200">
                    Total : 1.44 Kg
                  </div>
                </td>
                <td className="p-3 align-top">
                  <div className="font-bold text-slate-800">Crème dessert</div>
                  <div className="text-[11px] text-slate-500">
                    Mixée lisse (100g / port.)
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block border border-teal-200">
                    Total : 0.80 Kg
                  </div>
                </td>
                <td className="p-3 align-top bg-blue-50/40 text-right font-mono border-l border-slate-200">
                  <div className="font-black text-sm text-blue-900">4.40 Kg</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    550g/plt
                  </div>
                </td>
              </tr>

              {/* Ligne de Synthèse Totale */}
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <td className="p-3 text-slate-900 font-extrabold">
                  TOTAL DU SERVICE
                </td>
                <td className="p-3 text-center">
                  <div className="text-blue-600 font-black text-base">84</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    plateaux
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-slate-800 font-extrabold">
                    Total Entrées :
                  </div>
                  <div className="font-mono text-blue-700 font-bold">
                    6.92 Kg / L
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-slate-800 font-extrabold">
                    Total Protéines :
                  </div>
                  <div className="font-mono text-blue-700 font-bold">
                    11.60 Kg
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-slate-800 font-extrabold">
                    Total Garnitures :
                  </div>
                  <div className="font-mono text-blue-700 font-bold">
                    17.44 Kg
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-slate-800 font-extrabold">
                    Total Desserts :
                  </div>
                  <div className="font-mono text-blue-700 font-bold">
                    10.15 Kg
                  </div>
                </td>
                <td className="p-3 bg-blue-100 text-right font-mono border-l border-slate-200">
                  <div className="text-[10px] text-blue-800 uppercase font-bold">
                    Total
                  </div>
                  <div className="text-sm font-black text-blue-900 mt-0.5">
                    46.11 Kg
                  </div>
                  <div className="text-[9px] text-slate-600 font-semibold">
                    + extras
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
