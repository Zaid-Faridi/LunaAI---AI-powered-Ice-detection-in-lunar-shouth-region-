import React from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Radio } from 'lucide-react';

export default function MapControls({
  zoomBy,
  onResetView,
  activeLayers = {},
  onToggleLayer,
}) {
  const layerButtons = [
    { id: 'terrain', label: 'DEM', activeClass: 'bg-[rgba(0,217,255,0.15)] text-cyan border border-[rgba(0,217,255,0.4)]' },
    { id: 'illumination', label: 'PSR/SOLAR', activeClass: 'bg-[rgba(255,176,32,0.15)] text-amber border border-[rgba(255,176,32,0.4)]' },
    { id: 'divinerThermal', label: 'DIVINER 40K', activeClass: 'bg-[rgba(0,180,255,0.2)] text-[#66D9FF] border border-[rgba(0,180,255,0.4)]' },
    { id: 'radarCpr', label: 'DFSAR CPR', activeClass: 'bg-[rgba(0,230,118,0.15)] text-green border border-[rgba(0,230,118,0.4)]' },
  ];

  return (
    <>
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="mission-panel px-3 py-1.5 flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            LOLA-DEM // CH-2 POLAR STEREOGRAPHIC
          </span>
          <span className="text-dim">|</span>
          <span className="text-secondary">
            PROJECTION: <span className="text-primary">SOUTH POLAR 87°–90°S</span>
          </span>
        </div>
      </div>

      {/* Map Tools (Zoom, Reset, Layers) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <div className="mission-panel flex items-center p-1 gap-1">
          <button
            onClick={() => zoomBy(1.25)}
            title="Zoom In (+)"
            className="p-1.5 text-secondary hover:text-cyan hover:bg-[#152335] rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomBy(0.8)}
            title="Zoom Out (-)"
            className="p-1.5 text-secondary hover:text-cyan hover:bg-[#152335] rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onResetView}
            title="Reset View"
            className="p-1.5 text-secondary hover:text-cyan hover:bg-[#152335] rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Controls Dropdown/Pills */}
        <div className="mission-panel px-2 py-1 flex items-center gap-2 text-xs font-mono">
          <span className="text-dim flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan" />
            LAYERS:
          </span>
          {layerButtons.map(({ id, label, activeClass }) => (
            <button
              key={id}
              onClick={() => onToggleLayer && onToggleLayer(id)}
              className={`px-2 py-0.5 rounded transition-all ${
                activeLayers[id] ? activeClass : 'text-dim hover:text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
