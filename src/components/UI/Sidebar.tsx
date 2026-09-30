import React from "react";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const Sidebar: React.FC = observer(() => {
  const { configuratorStore } = useMainContext();
  const data = configuratorStore.hoseData;

  if (!data) {
    return (
      <div className="sidebar">
        {/* <h3 className="sidebar-title"></h3> */}
        <p className="sidebar-loading">Loading data...</p>
      </div>
    );
  }

  const selectedSeries = data.hoseSeries.find(
    (s: any) => s.id === configuratorStore.selectedSeriesId,
  );
  const braidOptions = selectedSeries?.braids || [];
  const selectedBraid = braidOptions.find(
    (b: any) => b.id === configuratorStore.selectedBraidId,
  );
  const selectedSize = selectedBraid?.sizes?.find(
    (s: any) => s.id === configuratorStore.selectedSizeId,
  );

  return (
    <div className="sidebar">
      {/* <h3 className="sidebar-title">Hose Explorer</h3> */}

      {/* Static info block */}
      <div className="info-block">
        <div className="series-name">{selectedSeries?.name ?? "—"}</div>
        <div className="size-label">
          Size : <span>{selectedSize?.value ?? "—"}</span>
        </div>
      </div>

      {/* Braid type cards */}
      <div className="braid-section">
        <p className="braid-section-label left">Select Braid Type</p>
        <div className="braid-list">
          {braidOptions.map((braid: any) => (
            <button
              key={braid.id}
              className={`braid-card ${braid.id === configuratorStore.selectedBraidId ? "active" : ""}`}
              onClick={() => configuratorStore.setBraidId(braid.id)}
            >
              {braid.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
