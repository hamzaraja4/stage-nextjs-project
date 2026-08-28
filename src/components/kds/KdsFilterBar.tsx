import React from "react";
import { Department, DietType } from "../../types/kds";

interface KdsFilterBarProps {
  selectedDept: Department;
  onSelectDept: (dept: Department) => void;
  selectedDiet: DietType;
  onSelectDiet: (diet: DietType) => void;
}

export const KdsFilterBar: React.FC<KdsFilterBarProps> = ({
  selectedDept,
  onSelectDept,
  selectedDiet,
  onSelectDiet,
}) => {
  const departments: Department[] = ["Chirurgie", "Médecine", "Maternité"];

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      {/* Department Tabs */}
      <div className="flex bg-[#EFF4FF] p-1 rounded-lg border border-[#C3C6CF]/50">
        {departments.map((dept) => {
          const isActive = selectedDept === dept;
          return (
            <button
              key={dept}
              type="button"
              onClick={() => onSelectDept(dept)}
              className={`px-4 py-2 rounded-md text-[12px] font-bold uppercase tracking-[0.05em] transition-all cursor-pointer ${
                isActive
                  ? "bg-white shadow-2xs text-[#001932]"
                  : "text-[#43474E] hover:bg-[#E5EEFF]/60 hover:text-[#001932]"
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* Diet Selector Dropdown */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="diet-select"
          className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#43474E]"
        >
          Régime:
        </label>
        <select
          id="diet-select"
          value={selectedDiet}
          onChange={(e) => onSelectDiet(e.target.value as DietType)}
          className="bg-white border border-[#C3C6CF] text-sm rounded-md py-1.5 pl-3 pr-8 focus:ring-[#3A618B] focus:border-[#3A618B] outline-none text-[#0B1C30] cursor-pointer"
        >
          <option value="Tous les régimes">Tous les régimes</option>
          <option value="Normal">Normal</option>
          <option value="Sans Sel Strict">Sans Sel Strict</option>
          <option value="Diabétique">Diabétique</option>
        </select>
      </div>
    </section>
  );
};
