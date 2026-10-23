import React from 'react';
import { 
  Compass, 
  Thermometer, 
  Sun, 
  Maximize2, 
  Target, 
  Cpu, 
  ArrowRight, 
  Info, 
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  Mountain
} from 'lucide-react';
import LunarMap from '../LunarMap';

export default function PsrExplorerScreen({ 
  selectedRegion, 
  onSelectRegion, 
  onNavigateToScreen,
  activeLayers,
  onToggleLayer
}) {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row relative overflow-hidden bg-[#0A0E14]">
      {/* Central Interactive Map Container (70-75% width on large screens) */}
      <div className="flex-1 h-[55%] lg:h-full relative min-w-0 border-b lg:border-b-0 lg:border-r border-[#1B293C]">
        <LunarMap
          selectedRegion={selectedRegion}
          onSelectRegion={onSelectRegion}
          activeScreen="explorer"
          activeLayers={activeLayers}
          onToggleLayer={onToggleLayer}
        />
      </div>

      {/* Right Side Telemetry & Region Inspector Panel */}
      <div className="w-full lg:w-[380px] xl:w-[420px] h-[45%] lg:h-full bg-[#0D141F] flex flex-col overflow-y-auto p-4 flex-none border-t lg:border-t-0 border-[#1B293C]">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1B293C] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[rgba(0,217,255,0.12)] border border-[rgba(0,217,255,0.3)] text-cyan">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary font-display tracking-wide uppercase">
                PSR REGION TELEMETRY
              </h2>
              <div className="text-[11px] font-mono text-secondary">
                LUNAR SOUTH POLE COLD TRAP SURVEY
              </div>
            </div>
          </div>
          <span className="telemetry-tag telemetry-tag-cyan">
            {selectedRegion.designation}
          </span>
        </div>

        {/* Selected Region Hero Title Card */}
        <div className="mission-panel corner-brackets p-3.5 mb-4 bg-[#111A26]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono text-dim tracking-wider uppercase">
                SELECTED TARGET
              </div>
              <h3 className="text-base font-bold text-primary mt-0.5">
                {selectedRegion.name}
              </h3>
            </div>
            <span className="telemetry-tag telemetry-tag-green">
              {selectedRegion.status}
            </span>
          </div>

          <div className="mt-2 text-xs text-secondary leading-relaxed font-sans">
            Prime candidate for in-situ resource utilization. Floor remains in perpetual celestial shadow shielded by elevated rim massifs.
          </div>
        </div>

        {/* Canonical Telemetry Key-Value Grid as Specified */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-[10px] font-mono text-dim tracking-wider uppercase mb-0.5">
            SURFACE & RADIOMETRIC READOUTS
          </div>

          {/* Latitude */}
          <div className="flex items-center justify-between p-2.5 bg-[#0F1824] border border-[#192A3D] rounded">
            <span className="text-xs text-secondary font-sans">Latitude</span>
            <span className="text-sm font-mono font-bold text-primary">{selectedRegion.latitude}</span>
          </div>

          {/* Longitude */}
          <div className="flex items-center justify-between p-2.5 bg-[#0F1824] border border-[#192A3D] rounded">
            <span className="text-xs text-secondary font-sans">Longitude</span>
            <span className="text-sm font-mono font-bold text-primary">{selectedRegion.longitude}</span>
          </div>

          {/* Illumination with explicit scientific note */}
          <div className="p-2.5 bg-[#0F1824] border border-[#192A3D] rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber" />
                <span className="text-xs text-secondary font-sans">Illumination</span>
              </div>
              <span className="text-sm font-mono font-bold text-amber">{selectedRegion.illumination}</span>
            </div>
            <div className="text-[11px] font-mono text-cyan mt-1 pl-5">
              ↳ {selectedRegion.illuminationNote}
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between p-2.5 bg-[#0F1824] border border-[#192A3D] rounded">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan" />
              <span className="text-xs text-secondary font-sans">Temperature</span>
            </div>
            <span className="text-sm font-mono font-bold text-cyan">{selectedRegion.temperature}</span>
          </div>

          {/* PSR Area */}
          <div className="flex items-center justify-between p-2.5 bg-[#0F1824] border border-[#192A3D] rounded">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs text-secondary font-sans">PSR Area (analysis window)</span>
            </div>
            <span className="text-sm font-mono font-bold text-primary">{selectedRegion.psrArea}</span>
          </div>

          {/* Prior Ice Probability */}
          <div className="flex items-center justify-between p-2.5 bg-[#0F1824] border border-[rgba(0,230,118,0.3)] rounded bg-[rgba(0,230,118,0.04)]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-green" />
              <span className="text-xs text-secondary font-sans">Prior Ice Probability</span>
            </div>
            <span className="text-base font-mono font-bold text-green">{selectedRegion.priorIceProbability}</span>
          </div>
        </div>

        {/* Physical Consistency Audit Note */}
        <div className="p-3 rounded bg-[#101A27] border border-[#1E3048] mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-cyan font-mono text-[11px] font-semibold mb-1">
            <Info className="w-3.5 h-3.5 text-cyan flex-none" />
            <span>PHYSICAL CONSISTENCY VERIFIED</span>
          </div>
          <p className="text-secondary text-[11px] leading-relaxed">
            Illumination reading <strong className="text-primary font-mono">{selectedRegion.illumination}</strong> is near-zero, strictly consistent with celestial PSR thermodynamics (<span className="text-amber">38 K</span> cryogenic volatile cold trapping).
          </p>
        </div>

        {/* Proceed to Ice Analysis CTA Button */}
        <div className="mt-auto pt-2">
          <button
            onClick={() => onNavigateToScreen('analysis')}
            className="btn-mission w-full py-3 text-xs"
          >
            <span>Proceed to Ice Characterization</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
