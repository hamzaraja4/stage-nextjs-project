"use client";

import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { MOCK_SAMPLE_MEALS } from "../../data/mockHaccpData";

export const SampleMealsTable: React.FC = () => {
  const [lotFilter, setLotFilter] = useState("");
  const [meals, setMeals] = useState(MOCK_SAMPLE_MEALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPrep, setNewPrep] = useState("");
  const [newLot, setNewLot] = useState("");

  const filteredMeals = meals.filter(
    (item) =>
      item.lot.toLowerCase().includes(lotFilter.toLowerCase()) ||
      item.preparation.toLowerCase().includes(lotFilter.toLowerCase())
  );

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrep || !newLot) return;

    setMeals((prev) => [
      {
        id: `sample-${Date.now()}`,
        preparation: newPrep,
        lot: newLot,
        dateTime: "Aujourd'hui 12:00",
        weight: "130g",
        expiryDateTime: "Dans 5j 12:00",
        status: "active",
        statusLabel: "Actif (J+5)",
      },
      ...prev,
    ]);

    setNewPrep("");
    setNewLot("");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg border border-[#C3C6CF] shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#C3C6CF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#F8F9FF]">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#0B1C30] flex items-center gap-2">
          <Icon name="takeout_dining" className="text-[#3A618B] text-[22px]" />
          <span>Registre Plats Témoins</span>
        </h3>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search by Lot */}
          <div className="relative flex-1 sm:w-56">
            <Icon
              name="search"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#73777F] text-[16px]"
            />
            <input
              type="text"
              value={lotFilter}
              onChange={(e) => setLotFilter(e.target.value)}
              placeholder="Filtrer par lot..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#C3C6CF] rounded focus:border-[#3A618B] focus:ring-1 focus:ring-[#3A618B] outline-none transition-colors"
            />
          </div>

          {/* Add New Sample Meal */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-[#001932] text-white text-[11px] font-semibold uppercase tracking-wider rounded hover:bg-[#0B2E4F] transition-colors shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Icon name="add" className="text-[16px]" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-[#EFF4FF] border-b border-[#C3C6CF] text-[11px] leading-[16px] font-semibold uppercase tracking-[0.05em] text-[#43474E]">
              <th scope="col" className="px-4 py-3">Préparation</th>
              <th scope="col" className="px-4 py-3">Lot</th>
              <th scope="col" className="px-4 py-3">Date/Heure</th>
              <th scope="col" className="px-4 py-3">Poids</th>
              <th scope="col" className="px-4 py-3">Conservation jusqu&apos;au</th>
              <th scope="col" className="px-4 py-3 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="text-[13px] leading-[18px] text-[#0B1C30] divide-y divide-[#C3C6CF]/50">
            {filteredMeals.map((meal) => {
              const isDestroyed = meal.status === "destroyed";

              return (
                <tr
                  key={meal.id}
                  className={`hover:bg-[#EFF4FF]/40 transition-colors h-10 ${
                    isDestroyed ? "opacity-70 bg-slate-50/50" : ""
                  }`}
                >
                  {/* Préparation */}
                  <td className="px-4 py-2.5 font-medium">{meal.preparation}</td>

                  {/* Lot */}
                  <td className="px-4 py-2.5">
                    <span className="bg-[#EFF4FF] px-2 py-0.5 rounded text-xs font-mono font-semibold text-[#0B1C30]">
                      {meal.lot}
                    </span>
                  </td>

                  {/* Date/Heure */}
                  <td className="px-4 py-2.5 text-[#43474E]">{meal.dateTime}</td>

                  {/* Poids */}
                  <td className="px-4 py-2.5">{meal.weight}</td>

                  {/* Conservation */}
                  <td className="px-4 py-2.5 text-[#43474E]">
                    {meal.expiryDateTime}
                  </td>

                  {/* Statut Badge */}
                  <td className="px-4 py-2.5 text-right">
                    {meal.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#EFF4FF] text-[#001932] text-[10px] font-bold uppercase tracking-wider border border-[#C3C6CF]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#001932]" />
                        {meal.statusLabel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white text-[#73777F] text-[10px] font-bold uppercase tracking-wider border border-[#C3C6CF]">
                        <Icon name="delete" className="text-[12px]" />
                        {meal.statusLabel}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simple Modal for Adding a Sample Meal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#C3C6CF]">
            <h3 className="text-lg font-bold text-[#0B1C30] mb-4 flex items-center gap-2">
              <Icon name="takeout_dining" className="text-[#3A618B]" />
              Enregistrer un Plat Témoin
            </h3>

            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#43474E] mb-1">
                  Nom du plat / Préparation
                </label>
                <input
                  type="text"
                  required
                  value={newPrep}
                  onChange={(e) => setNewPrep(e.target.value)}
                  placeholder="Ex: Gratin Dauphinois"
                  className="w-full border border-[#C3C6CF] rounded p-2 text-sm focus:border-[#3A618B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#43474E] mb-1">
                  Numéro de Lot
                </label>
                <input
                  type="text"
                  required
                  value={newLot}
                  onChange={(e) => setNewLot(e.target.value)}
                  placeholder="Ex: A45-14"
                  className="w-full border border-[#C3C6CF] rounded p-2 text-sm focus:border-[#3A618B] outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-[#43474E] hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-[#001932] text-white hover:bg-[#0B2E4F]"
                >
                  Enregistrer l&apos;Échantillon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
