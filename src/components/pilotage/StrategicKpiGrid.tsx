import React from "react";
import { StrategicKpiCard } from "./StrategicKpiCard";
import { STRATEGIC_KPIS } from "../../data/mockPilotageData";

export const StrategicKpiGrid: React.FC = () => {
  return (
    <section
      aria-label="Indicateurs Stratégiques"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {STRATEGIC_KPIS.map((kpi) => (
        <StrategicKpiCard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
};
