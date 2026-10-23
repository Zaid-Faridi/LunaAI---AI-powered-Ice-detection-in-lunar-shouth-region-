import React, { useState } from 'react';
import { 
  Database, 
  Calculator, 
  FileText, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  Info,
  Droplets,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { RESOURCE_ESTIMATION } from '../../data/missionData';
import ResourceReportModal from '../ResourceReportModal';

export default function ResourceEstimationScreen({ 
  selectedRegion, 
  onNavigateToScreen 
}) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculated, setCalculated] = useState(true); // default true for immediate inspection, can re-calculate
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Canonical baseline values
  const base = RESOURCE_ESTIMATION;

  // Interactive sensitivity slider adjustments
  const [depthMax, setDepthMax] = useState(5.0); // 0-5m default
  const [iceVolFraction, setIceVolFraction] = useState(4.7); // 4.7% default

  // Calculate dynamic outputs based on sliders
  // When depthMax = 5 and iceVolFraction = 4.7, values match canonical values exactly!
  const depthFactor = depthMax / 5.0;
  const concFactor = iceVolFraction / 4.7;
  const effectiveMultiplier = depthFactor * concFactor;

  const currentVolumeNum = (1.84 * effectiveMultiplier).toFixed(2);
  const currentMassNum = (1.69 * effectiveMultiplier).toFixed(2);

  const volMin = (1.29 * effectiveMultiplier).toFixed(2);
  const volMax = (2.39 * effectiveMultiplier).toFixed(2);

  const massMin = (1.18 * effectiveMultiplier).toFixed(2);
  const massMax = (2.20 * effectiveMultiplier).toFixed(2);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setCalculated(true);
    }, 700);
  };

  const handleResetBaseline = () => {
    setDepthMax(5.0);
    setIceVolFraction(4.7);
  };

  const isBaseline = depthMax === 5.0 && iceVolFraction === 4.7;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto p-4 lg:p-6 bg-[#0A0E14] select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1B293C] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="telemetry-tag telemetry-tag-cyan font-mono text-[10px]">
              SCREEN 03 // QUANTITATIVE ESTIMATION
            </span>
            <span className="text-dim font-mono text-xs">|</span>
            <span className="text-secondary font-mono text-xs">
              ZONE: <strong className="text-primary">{selectedRegion.name}</strong>
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold font-display text-primary tracking-wide">
            CRYOGENIC VOLATILE & WATER-EQUIVALENT RESOURCE MODEL
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="btn-mission py-2.5 px-5 text-xs"
          >
            {isCalculating ? (
              <>
                <Calculator className="w-4 h-4 animate-spin" />
                <span>COMPUTING INTEGRALS...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>CALCULATE RESOURCE ESTIMATE</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="btn-mission btn-mission-green py-2.5 px-4 text-xs flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>GENERATE RESOURCE REPORT</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Canonical Resource Cards & Stratigraphic Model */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left: Canonical Primary Estimations Grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Key Metric Highlights (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Ice Concentration */}
            <div className="mission-panel p-4 bg-[#0E1624]">
              <div className="text-[10px] font-mono text-dim tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>ICE CONCENTRATION</span>
                <span className="text-cyan font-mono">RADAR VOLUMETRIC</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-cyan">
                  {isBaseline ? base.iceConcentration : `${iceVolFraction}%`}
                </span>
                <span className="text-xs font-mono text-secondary">
                  {base.iceConcentrationUnit}
                </span>
              </div>
              <div className="text-[11px] text-secondary mt-2">
                Subsurface pore-filling cryogenic regolith matrix.
              </div>
            </div>

            {/* 2. Depth Range */}
            <div className="mission-panel p-4 bg-[#0E1624]">
              <div className="text-[10px] font-mono text-dim tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>DEPTH RANGE</span>
                <span className="text-green font-mono">STRATUM 1</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-primary">
                  {isBaseline ? base.depthRange : `0–${depthMax} m`}
                </span>
                <span className="text-xs font-mono text-secondary">
                  below lunar surface
                </span>
              </div>
              <div className="text-[11px] text-secondary mt-2">
                Excludes top 0.5m solar-sublimated desiccated lag.
              </div>
            </div>

            {/* 3. Estimated Ice Volume */}
            <div className="mission-panel p-4 bg-[#0E1624] border-[rgba(0,217,255,0.3)]">
              <div className="text-[10px] font-mono text-dim tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>ESTIMATED ICE VOLUME</span>
                <span className="telemetry-tag telemetry-tag-amber text-[9px]">
                  {base.volumeUncertainty} BAND
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-mono font-bold text-cyan">
                {isBaseline ? base.estimatedIceVolume : `${currentVolumeNum} × 10⁶ m³`}
              </div>
              <div className="text-xs font-mono text-amber mt-2 flex items-center gap-1.5">
                <span>Uncertainty (±30%):</span>
                <strong className="text-primary font-bold">
                  {isBaseline ? `${base.volumeRangeMin} – ${base.volumeRangeMax}` : `${volMin}×10⁶ – ${volMax}×10⁶ m³`}
                </strong>
              </div>
            </div>

            {/* 4. Water-Equivalent Mass */}
            <div className="mission-panel p-4 bg-[#0E1624] border-[rgba(0,230,118,0.3)]">
              <div className="text-[10px] font-mono text-dim tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>WATER-EQUIVALENT MASS</span>
                <span className="telemetry-tag telemetry-tag-green text-[9px]">
                  ISRU YIELD
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-mono font-bold text-green">
                {isBaseline ? base.waterEquivalentMass : `${currentMassNum} × 10⁹ kg`}
              </div>
              <div className="text-xs font-mono text-amber mt-2 flex items-center gap-1.5">
                <span>Mass Range (±30%):</span>
                <strong className="text-primary font-bold">
                  {isBaseline ? `${base.massRangeMin} – ${base.massRangeMax}` : `${massMin}×10⁹ – ${massMax}×10⁹ kg`}
                </strong>
              </div>
            </div>
          </div>

          {/* Physical Consistency & Ice-Density Validation Callout Box */}
          <div className="mission-panel corner-brackets p-4 bg-[#101A27] border-green">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green" />
              <h3 className="text-xs font-mono font-bold text-green uppercase tracking-wider">
                PHYSICAL VALIDATION: DENSITY RECONCILIATION
              </h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans mb-3">
              {base.densityExplanation}
            </p>
            <div className="p-3 bg-[#080E16] rounded border border-[#16273B] font-mono text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-secondary">
                <span>Solid Water-Ice Density applied:</span>
                <span className="text-cyan font-bold">~920 kg/m³ (@ 38K hex ice)</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span>Direct Mathematical Product:</span>
                <span className="text-green font-bold">
                  1.84 × 10⁶ m³ × 920 kg/m³ = 1.6928 × 10⁹ kg
                </span>
              </div>
              <div className="flex items-center justify-between text-dim text-[11px] pt-1 border-t border-[#142335]">
                <span>Ordinary Liquid Water density (1,000 kg/m³) discarded:</span>
                <span className="text-amber font-semibold">Prevents +8.7% liquid overestimation</span>
              </div>
            </div>
          </div>

          {/* Interactive Scenario Parameter Sliders */}
          <div className="mission-panel p-4 bg-[#0E1522]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A293E] mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan" />
                <span className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                  DRILL DEPTH & CONCENTRATION SENSITIVITY SIMULATOR
                </span>
              </div>
              {!isBaseline && (
                <button
                  onClick={handleResetBaseline}
                  className="text-[11px] font-mono text-cyan hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  RESET TO BASELINE
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-secondary">Drill Exploration Depth:</span>
                  <span className="text-cyan font-bold">{depthMax.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={depthMax}
                  onChange={(e) => setDepthMax(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-secondary">Volumetric Ice Fraction:</span>
                  <span className="text-cyan font-bold">{iceVolFraction.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={iceVolFraction}
                  onChange={(e) => setIceVolFraction(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Regolith Stratigraphy & ISRU Cross-Section (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Stratigraphic Depth Cross-Section Diagram */}
          <div className="mission-panel p-4 bg-[#0E1522]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A293E] mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan" />
                <h3 className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                  REGOLITH STRATIGRAPHY & ICE BURIAL MODEL
                </h3>
              </div>
              <span className="text-[10px] font-mono text-secondary">0–10m PROFILE</span>
            </div>

            {/* Visual Cross Section Diagram */}
            <div className="w-full flex flex-col gap-2 font-mono text-xs">
              {/* Layer 1: Dry Lag Overburden */}
              <div className="p-3 rounded bg-gradient-to-r from-[#2A241C] to-[#1C1814] border border-[#483B2E] text-secondary relative">
                <div className="flex items-center justify-between font-bold text-amber">
                  <span>LAYER 01: DESICCATED DRY LAG</span>
                  <span>0.0 – 0.5 m</span>
                </div>
                <div className="text-[11px] text-[#A69788] font-sans mt-0.5">
                  Solar wind sputtered volatile-depleted surface regolith layer (0.0% ice).
                </div>
              </div>

              {/* Layer 2: Ice-Cemented Permafrost (Hero Target) */}
              <div className="p-4 rounded bg-gradient-to-r from-[#0C2433] to-[#081822] border-2 border-cyan text-primary relative shadow-[0_0_15px_rgba(0,217,255,0.15)]">
                <div className="flex items-center justify-between font-bold text-cyan">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan animate-pulse" />
                    LAYER 02: ICE-CEMENTED VOLATILE HORIZON
                  </span>
                  <span className="text-base text-green">0.5 – 5.0 m</span>
                </div>
                <div className="text-[11px] text-[#8ACADE] font-sans mt-1">
                  Primary exploration deposit. Pore ice interspersed in anorthositic grain matrix (<strong className="text-cyan">{isBaseline ? '4.7%' : `${iceVolFraction}%`} volume concentration</strong>).
                </div>
                <div className="mt-2 text-[10px] font-mono text-green flex items-center justify-between pt-2 border-t border-[#16384E]">
                  <span>RECOVERABLE MASS: {isBaseline ? base.waterEquivalentMass : `${currentMassNum}×10⁹ kg`}</span>
                  <span>TEMP: ~38K</span>
                </div>
              </div>

              {/* Layer 3: Bedrock Basement */}
              <div className="p-3 rounded bg-gradient-to-r from-[#141B26] to-[#0D121B] border border-[#202E42] text-secondary">
                <div className="flex items-center justify-between font-bold text-dim">
                  <span>LAYER 03: FRACTURED MEGAREGOLITH / BEDROCK</span>
                  <span>&gt; 5.0 m</span>
                </div>
                <div className="text-[11px] text-dim font-sans mt-0.5">
                  Dense impact melt sheet and fractured anorthosite bedrock basement.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mission Report Summary Callout */}
          <div className="mission-panel p-4 bg-[#0E1522]">
            <div className="text-xs font-mono font-bold text-cyan tracking-wider uppercase mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan" />
              <span>OFFICIAL MISSION SPECIFICATION SHEET</span>
            </div>
            <p className="text-xs text-secondary font-sans leading-relaxed mb-4">
              Click below to view and print the complete ISRO Technical Dossier with cryptographic verification hash, crater breakdown, and Gaganyaan propellant translation.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="btn-mission w-full py-2.5 text-xs"
            >
              <span>OPEN FULL TECHNICAL REPORT</span>
            </button>
          </div>

          {/* Advance to Screen 4 CTA */}
          <div className="mt-auto">
            <button
              onClick={() => onNavigateToScreen('mission')}
              className="btn-mission btn-mission-green w-full py-3 text-xs"
            >
              <span>Advance to Mission Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Report Component */}
      <ResourceReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedRegion={selectedRegion}
        calculationData={base}
      />
    </div>
  );
}
