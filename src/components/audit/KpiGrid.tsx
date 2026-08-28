import React from "react";
import { KpiCard } from "./KpiCard";
import { KPI_METRICS } from "../../data/mockAuditData";

export const KpiGrid: React.FC = () => {
  return (
    <section aria-label="Indicateurs clés de performance" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {KPI_METRICS.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </section>
  );
};
