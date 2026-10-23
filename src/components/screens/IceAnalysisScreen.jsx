import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Cpu, 
  Layers, 
  Radio, 
  Check, 
  AlertCircle, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Sliders,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { ICE_DETECTION_RESULTS } from '../../data/missionData';

export default function IceAnalysisScreen({ 
  selectedRegion, 
  pipelineCompleted, 
  setPipelineCompleted,
  pipelineRunning,
  setPipelineRunning,
  onNavigateToScreen
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(pipelineCompleted ? 4 : 0);
  const [pipelineProgress, setPipelineProgress] = useState(pipelineCompleted ? 100 : 0);
  const [activeTab, setActiveTab] = useState('decision'); // 'decision' | 'radar' | 'classification'
  const [scanBeamAngle, setScanBeamAngle] = useState(0);

  const pipelineStages = [
    { 
      id: 'dfsar', 
      name: 'DFSAR Dual-Band SAR', 
      detail: 'L-band (1.25 GHz) & S-band (2.5 GHz) full-polarimetric radar echo acquisition.',
      frequency: 'L/S Full-Pol',
      resolution: '1.25 m/px'
    },
    { 
      id: 'pol', 
      name: 'Polarimetric Analysis', 
      detail: 'Circular Polarization Ratio (CPR) and Degree of Polarization (DOP) Stokes Stokes decomposition.',
      frequency: 'S0, S1, S2, S3',
      resolution: 'm-χ Stokes vector'
    },
    { 
      id: 'ohrc', 
      name: 'OHRC Multi-Sensor Fusion', 
      detail: 'Sub-meter Optical High Resolution Camera illumination co-registration and shadow masking.',
      frequency: '0.25 m Optical',
      resolution: 'LOLA DEM coreg'
    },
    { 
      id: 'classify', 
      name: 'Ice Classification', 
      detail: 'Deep U-Net segmentation + Random Forest ensemble trained on simulated lunar cryogenic regolith.',
      frequency: 'U-Net + RF',
      resolution: '98.2% validation AUC'
    },
  ];

  // Rotate radar scan angle during analysis
  useEffect(() => {
    let animId;
    if (pipelineRunning) {
      const step = () => {
        setScanBeamAngle((prev) => (prev + 5) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [pipelineRunning]);

  const handleStartPipeline = () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setPipelineCompleted(false);
    setCurrentStepIndex(0);
    setPipelineProgress(5);

    // Sequence stages smoothly with realistic duration (~2.5 seconds total for snappy demo)
    const stageDuration = 600;

    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setPipelineProgress(30);
    }, stageDuration);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setPipelineProgress(60);
    }, stageDuration * 2);

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setPipelineProgress(85);
    }, stageDuration * 3);

    const timer4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setPipelineProgress(100);
      setPipelineRunning(false);
      setPipelineCompleted(true);
    }, stageDuration * 4);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleReset = () => {
    setPipelineCompleted(false);
    setPipelineRunning(false);
    setCurrentStepIndex(0);
    setPipelineProgress(0);
  };

  const results = ICE_DETECTION_RESULTS;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto p-4 lg:p-6 bg-[#0A0E14] select-none">
      {/* Page Title & Mission Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1B293C] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="telemetry-tag telemetry-tag-cyan font-mono text-[10px]">
              SCREEN 02 // HERO DETECTION
            </span>
            <span className="text-dim font-mono text-xs">|</span>
            <span className="text-secondary font-mono text-xs">
              TARGET: <strong className="text-primary">{selectedRegion.name}</strong>
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold font-display text-primary tracking-wide">
            ICE DETECTION & POLARIMETRIC CHARACTERIZATION
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartPipeline}
            disabled={pipelineRunning}
            className={`btn-mission py-2.5 px-5 text-xs ${
              pipelineCompleted ? 'btn-mission-secondary' : 'pulse-cyan'
            }`}
          >
            {pipelineRunning ? (
              <>
                <Radio className="w-4 h-4 text-cyan animate-spin" />
                <span>EXECUTING PIPELINE...</span>
              </>
            ) : pipelineCompleted ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>RE-RUN PIPELINE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-cyan text-cyan" />
                <span>ANALYZE REGION</span>
              </>
            )}
          </button>

          {pipelineCompleted && (
            <button
              onClick={handleReset}
              title="Reset results"
              className="p-2.5 rounded bg-[#131E2C] border border-[#21354C] text-secondary hover:text-cyan hover:border-cyan transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4-Stage Pipeline Execution Bar */}
      <div className="mission-panel corner-brackets p-4 mb-6 bg-[#0E1522]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan" />
            <span className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
              MULTI-SENSOR DETECTION PIPELINE ARCHITECTURE
            </span>
          </div>
          <span className="text-xs font-mono text-cyan">
            {pipelineProgress}% COMPLETED
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-[#142030] rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-cyan to-green transition-all duration-300"
            style={{ width: `${pipelineProgress}%` }}
          />
        </div>

        {/* 4 Pipeline Stages Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pipelineStages.map((stage, idx) => {
            const isFinished = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx && pipelineRunning;
            const isPending = currentStepIndex < idx;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded border transition-all ${
                  isFinished
                    ? 'bg-[rgba(0,230,118,0.06)] border-[rgba(0,230,118,0.4)] text-primary'
                    : isCurrent
                    ? 'bg-[rgba(0,217,255,0.12)] border-cyan text-cyan shadow-[0_0_12px_rgba(0,217,255,0.3)] animate-pulse'
                    : 'bg-[#0A1018] border-[#182638] text-secondary opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-dim font-bold">
                    STAGE 0{idx + 1}
                  </span>
                  {isFinished ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-green">
                      <Check className="w-3.5 h-3.5 text-green" />
                      COMPLETE
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-cyan animate-pulse">
                      <Radio className="w-3.5 h-3.5 animate-spin" />
                      PROCESSING
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-dim">PENDING</span>
                  )}
                </div>

                <div className="text-xs font-bold font-mono text-primary mb-1">
                  {stage.name}
                </div>
                <div className="text-[11px] text-secondary font-sans leading-relaxed mb-2">
                  {stage.detail}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-dim pt-2 border-t border-[#18283C]">
                  <span>{stage.frequency}</span>
                  <span className="text-cyan">{stage.resolution}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Results Section (Revealed when pipeline completes or in cached mode) */}
      {pipelineCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Hero Confidence Badge & Polarimetric Signature Matrix (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Hero Confidence Banner */}
            <div className="mission-panel corner-brackets p-4 bg-gradient-to-r from-[#0E1A29] to-[#0A1420] border-cyan">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-dim tracking-wider uppercase mb-1">
                    PRIMARY PREDICTION INFERENCE
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl lg:text-5xl font-mono font-bold text-green tracking-tight">
                      {results.confidence}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">ICE CONFIDENCE</span>
                      <span className="text-xs font-mono text-secondary">U-Net Ensemble Probability</span>
                    </div>
                  </div>
                </div>

                {/* Confirmed Indicator Seal */}
                <div className="p-3 rounded bg-[rgba(0,230,118,0.12)] border border-[rgba(0,230,118,0.4)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-[#05140B]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-green">
                      STATUS: CONFIRMED
                    </div>
                    <div className="text-[10px] font-mono text-secondary">
                      Cryogenic Water-Ice Deposition
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Polarimetric Signature Values Table */}
            <div className="mission-panel p-4 bg-[#0E1522]">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A293E] mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan" />
                  <h3 className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                    POLARIMETRIC SIGNATURE RADAR TELEMETRY
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-secondary">CH-2 DFSAR L+S</span>
              </div>

              <div className="flex flex-col gap-3">
                {results.signatures.map((sig) => (
                  <div 
                    key={sig.key}
                    className="p-3 rounded bg-[#0A111A] border border-[#162537] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-primary">
                          {sig.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131F2E] text-dim border border-[#1D3046]">
                          Threshold: {sig.threshold}
                        </span>
                      </div>
                      <div className="text-[11px] text-secondary font-sans mt-1">
                        {sig.desc}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-lg font-mono font-bold text-cyan">
                        {sig.value}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,230,118,0.2)] border border-green flex items-center justify-center text-green">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Explicit Decision Rule Panel as Requested */}
            <div className="mission-panel p-4 bg-[#0E1825] border-green">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-green" />
                  <h3 className="text-xs font-mono font-bold text-green tracking-wider uppercase">
                    EXPLICIT DETECTOR DECISION RULE (PHYSICAL VERIFICATION)
                  </h3>
                </div>
                <span className="telemetry-tag telemetry-tag-green">
                  VALIDATED
                </span>
              </div>

              {/* Explicit Decision Box */}
              <div className="p-3.5 rounded bg-[#070D14] border border-[#182C3D] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1.5 rounded bg-[rgba(0,230,118,0.15)] border border-green text-green font-bold text-sm flex items-center gap-1.5">
                    <span>CPR &gt; 1.0</span>
                    <Check className="w-4 h-4 text-green" />
                  </div>
                  <span className="text-dim font-bold">+</span>
                  <div className="px-3 py-1.5 rounded bg-[rgba(0,230,118,0.15)] border border-green text-green font-bold text-sm flex items-center gap-1.5">
                    <span>DOP &lt; 0.13</span>
                    <Check className="w-4 h-4 text-green" />
                  </div>
                  <span className="text-dim font-bold">→</span>
                  <div className="text-base font-bold text-green tracking-wider flex items-center gap-1.5">
                    <span>ICE SIGNATURE DETECTED</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-secondary font-sans leading-relaxed">
                <strong className="text-primary font-mono">Classification Rationale:</strong> Coherent backscatter opposition effect produces circular polarization ratio CPR = 1.42 &gt; 1 inside the crater floor with extreme depolarization DOP = 0.086 &lt; 0.13, definitively discriminating volume scattering in subsurface ice from rough rocky surface clutter.
              </div>
            </div>
          </div>

          {/* Right Column: Classification Table & Composition Visualization (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Material Classification Table */}
            <div className="mission-panel p-4 bg-[#0E1522]">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A293E] mb-3">
                <h3 className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                  MATERIAL CLASSIFICATION MATRIX
                </h3>
                <span className="text-[10px] font-mono text-cyan">PIXEL SEGMENTATION</span>
              </div>

              <table className="mission-table mb-4">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th className="text-right">Probability</th>
                    <th className="text-right">Band Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {results.classification.map((item) => (
                    <tr key={item.material}>
                      <td className="font-semibold flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-primary">{item.material}</span>
                      </td>
                      <td className="text-right font-bold text-base" style={{ color: item.color }}>
                        {item.probability}
                      </td>
                      <td className="text-right text-secondary text-xs">
                        {item.material === 'Water Ice' ? '1.42 (High)' : item.material === 'Regolith' ? '0.41 (Low)' : '0.82 (Mid)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Horizontal Bar Breakdown */}
              <div className="text-[10px] font-mono text-dim mb-1 flex justify-between">
                <span>VOLUMETRIC SURFACE RATIO</span>
                <span>TOTAL: 100.0%</span>
              </div>
              <div className="w-full h-4 rounded bg-[#101824] flex overflow-hidden border border-[#1E2E42] mb-3">
                <div style={{ width: '87.4%' }} className="bg-cyan h-full" title="Water Ice: 87.4%" />
                <div style={{ width: '8.2%' }} className="bg-[#8B98A5] h-full" title="Regolith: 8.2%" />
                <div style={{ width: '4.4%' }} className="bg-[#E6EDF3] h-full" title="Rock: 4.4%" />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-secondary">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan" />
                  <span>Ice (87.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B98A5]" />
                  <span>Regolith (8.2%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E6EDF3]" />
                  <span>Rock (4.4%)</span>
                </div>
              </div>
            </div>

            {/* Radar CPR Backscatter Spectrogram Simulation */}
            <div className="mission-panel p-4 bg-[#0E1522]">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A293E] mb-3">
                <span className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                  RADAR BACKSCATTER CROSS-SECTION (L+S BAND)
                </span>
                <span className="text-[10px] font-mono text-green">STOKES DECOMPOSED</span>
              </div>

              {/* Simulated Radar Waveform Oscilloscope Graphic */}
              <div className="h-28 bg-[#070B11] rounded border border-[#162436] p-2 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 scanline-overlay opacity-40 pointer-events-none" />
                
                {/* Simulated Radar Waveform Curves */}
                <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0, 217, 255, 0.4)" />
                      <stop offset="100%" stopColor="rgba(0, 217, 255, 0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#121D2B" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#121D2B" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#121D2B" strokeWidth="1" strokeDasharray="3 3" />

                  {/* CPR threshold line at 1.0 */}
                  <line x1="0" y1="35" x2="300" y2="35" stroke="#FFB020" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  <text x="5" y="32" fill="#FFB020" fontSize="7" fontFamily="var(--font-mono)">CPR 1.0 THRESHOLD</text>

                  {/* Volumetric Ice Peak Waveform */}
                  <path
                    d="M 0 65 Q 40 60, 80 50 T 150 15 T 220 52 T 300 68 L 300 80 L 0 80 Z"
                    fill="url(#waveGrad)"
                  />
                  <path
                    d="M 0 65 Q 40 60, 80 50 T 150 15 T 220 52 T 300 68"
                    fill="none"
                    stroke="#00D9FF"
                    strokeWidth="2"
                  />
                  {/* Peak Marker */}
                  <circle cx="150" cy="15" r="3" fill="#00E676" />
                  <text x="160" y="16" fill="#00E676" fontSize="8" fontFamily="var(--font-mono)" fontWeight="bold">
                    PEAK CPR: 1.42 (ICE)
                  </text>
                </svg>

                <div className="flex items-center justify-between text-[9px] font-mono text-dim pt-1">
                  <span>DISTANCE: 0 km (RIM)</span>
                  <span>10.6 km (CRATER FLOOR CENTER)</span>
                  <span>21.3 km (SOUTH RIM)</span>
                </div>
              </div>
            </div>

            {/* Advance to Screen 3 CTA */}
            <div className="mt-auto">
              <button
                onClick={() => onNavigateToScreen('resource')}
                className="btn-mission btn-mission-green w-full py-3 text-xs"
              >
                <span>Advance to Resource Estimation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standby State Before Pipeline Run */
        <div className="flex-1 flex flex-col items-center justify-center p-8 mission-panel text-center">
          <div className="w-16 h-16 rounded-full bg-[#111C2B] border border-cyan flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(0,217,255,0.25)]">
            <Radio className="w-8 h-8 text-cyan" />
            <div className="absolute inset-0 rounded-full border border-cyan pulse-cyan" />
          </div>

          <h3 className="text-lg font-bold text-primary font-display tracking-wider mb-2">
            STANDBY FOR DFSAR / OHRC INFERENCE SEQUENCE
          </h3>
          <p className="text-secondary text-xs max-w-md mb-6 leading-relaxed">
            Click <strong>"Analyze Region"</strong> to initiate polarimetric Stokes parameter decomposition and execute deep semantic segmentation on target candidate <span className="text-cyan font-mono">{selectedRegion.name}</span>.
          </p>

          <button
            onClick={handleStartPipeline}
            className="btn-mission py-3 px-8 text-sm"
          >
            <Play className="w-4 h-4 fill-cyan text-cyan" />
            <span>ANALYZE REGION NOW</span>
          </button>
        </div>
      )}
    </div>
  );
}
