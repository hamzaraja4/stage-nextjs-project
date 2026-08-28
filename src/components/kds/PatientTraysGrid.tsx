import React from "react";
import { PatientTrayCard } from "./PatientTrayCard";
import { PatientTrayItem } from "../../types/kds";

interface PatientTraysGridProps {
  trays: PatientTrayItem[];
}

export const PatientTraysGrid: React.FC<PatientTraysGridProps> = ({ trays }) => {
  return (
    <section
      aria-label="Grille des plateaux patients KDS"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {trays.map((tray) => (
        <PatientTrayCard key={tray.id} tray={tray} />
      ))}
    </section>
  );
};
