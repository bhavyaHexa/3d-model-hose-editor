import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../hooks/useMainContext';

export const Sidebar: React.FC = observer(() => {
  const { configuratorStore } = useMainContext();
  const data = configuratorStore.hoseData;

  if (!data) {
    return (
      <div className="sidebar">
        <h3 className="sidebar-title">Model Explorer</h3>
        <p>Loading data...</p>
      </div>
    );
  }

  const seriesOptions = data.hoseSeries || [];
  const selectedSeries = seriesOptions.find((s: any) => s.id === configuratorStore.selectedSeriesId);
  const braidOptions = selectedSeries?.braids || [];
  const selectedBraid = braidOptions.find((b: any) => b.id === configuratorStore.selectedBraidId);
  const sizeOptions = selectedBraid?.sizes || [];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Hose Explorer</h3>

      <div className="form-group">
        <label>Select Hose Series</label>
        <select 
          value={configuratorStore.selectedSeriesId || ""} 
          onChange={(e) => configuratorStore.setSeriesId(Number(e.target.value))}
        >
          {seriesOptions.map((series: any) => (
            <option key={series.id} value={series.id}>{series.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Braid Type</label>
        <select 
          value={configuratorStore.selectedBraidId || ""} 
          onChange={(e) => configuratorStore.setBraidId(Number(e.target.value))}
          disabled={braidOptions.length === 0}
        >
          {braidOptions.map((braid: any) => (
            <option key={braid.id} value={braid.id}>{braid.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Size</label>
        <select 
          value={configuratorStore.selectedSizeId || ""} 
          onChange={(e) => configuratorStore.setSizeId(Number(e.target.value))}
          disabled={sizeOptions.length === 0}
        >
          {sizeOptions.map((size: any) => (
            <option key={size.id} value={size.id}>{size.value}</option>
          ))}
        </select>
      </div>
    </div>
  );
});
