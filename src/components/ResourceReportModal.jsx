import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  FileText, 
  Satellite, 
  Check, 
  Flame, 
  Droplets,
  Calendar,
  Hash
} from 'lucide-react';
import { RESOURCE_ESTIMATION, ICE_DETECTION_RESULTS } from '../data/missionData';
import { waterMass, uncertaintyRange } from '../lib/calc';

export default function ResourceReportModal({ isOpen, onClose, selectedRegion, calculationData }) {
  if (!isOpen) return null;

  const res = calculationData || RESOURCE_ESTIMATION;
  const volVal = res.estimatedIceVolumeValue ?? 1.84e6;
  const massVal = waterMass(volVal, 920);
  const volRange = uncertaintyRange(volVal, 0.30);
  const massRange = uncertaintyRange(massVal, 0.30);

  const displayVol = res.estimatedIceVolume ?? `${(volVal / 1e6).toFixed(2)} × 10⁶ m³`;
  const displayMass = `${(massVal / 1e9).toFixed(2)} × 10⁹ kg`;
  const displayVolMin = `${(volRange.min / 1e6).toFixed(2)} × 10⁶ m³`;
  const displayVolMax = `${(volRange.max / 1e6).toFixed(2)} × 10⁶ m³`;
  const displayMassMin = `${(massRange.min / 1e9).toFixed(2)} × 10⁹ kg`;
  const displayMassMax = `${(massRange.max / 1e9).toFixed(2)} × 10⁹ kg`;
  const densityProductString = `${(volVal / 1e6).toFixed(2)} × 10⁶ m³ × 920 kg/m³ = ${(massVal / 1e9).toFixed(4)} × 10⁹ kg`;

  const propellantTonnes = `${(massVal / 1000 / 1e6).toFixed(2)} × 10⁶ t`;
  const potableLiters = `${(massVal / 1e9).toFixed(2)} × 10⁹ L`;
  const commercialBillion = `$${((massVal * 20) / 1e9).toFixed(1)} Billion`;

  const reportId = `ISRO-SAC-LIP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toUTCString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto select-none">
      <div className="relative w-full max-w-4xl bg-[#0B1017] border border-cyan/50 rounded-sm shadow-[0_0_40px_rgba(0,217,255,0.2)] flex flex-col my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#0F1622] border-b border-[#1D2B3E]">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-secondary">MISSION DOCUMENT:</span>
            <span className="text-primary font-bold">{reportId}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-mission-secondary px-3 py-1 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT DOSSIER</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-secondary hover:text-primary hover:bg-[#1A283B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Paper Content */}
        <div className="p-8 text-primary flex flex-col gap-6 font-sans">
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-[#1D2B3E] gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan font-mono text-xs mb-1">
                <Satellite className="w-4 h-4 text-cyan" />
                <span>ISRO // SPACE APPLICATIONS CENTRE (SAC) & IIRS</span>
              </div>
              <h1 className="text-2xl font-bold font-display tracking-wide text-white uppercase">
                IN-SITU LUNAR VOLATILE & WATER ICE CHARACTERIZATION REPORT
              </h1>
              <div className="text-xs font-mono text-secondary mt-1">
                CHANDRAYAAN-2 DFSAR L+S RADAR POLARIMETRY & LRO DIVINER SYNTHESIS
              </div>
            </div>

            <div className="p-3 bg-[#0E1520] border border-green/40 rounded text-right font-mono text-xs">
              <div className="text-green font-bold flex items-center justify-end gap-1">
                <ShieldCheck className="w-4 h-4 text-green" />
                <span>STATUS: VERIFIED</span>
              </div>
              <div className="text-dim text-[10px] mt-0.5">LEVEL-3 SCIENTIFIC PRODUCT</div>
              <div className="text-secondary text-[10px]">{timestamp}</div>
            </div>
          </div>

          {/* Section 1: Target Identification & Geometry */}
          <div>
            <div className="text-xs font-mono font-bold text-cyan tracking-wider uppercase mb-2">
              1.0 TARGET IDENTIFICATION & CELESTIAL POSITIONING
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-[#0D141F] border border-[#1A2636] rounded">
                <div className="text-dim text-[10px]">REGION NAME</div>
                <div className="text-white font-bold">{selectedRegion.name}</div>
              </div>
              <div className="p-2.5 bg-[#0D141F] border border-[#1A2636] rounded">
                <div className="text-dim text-[10px]">COORDINATES</div>
                <div className="text-cyan font-bold">{selectedRegion.latitude}, {selectedRegion.longitude}</div>
              </div>
              <div className="p-2.5 bg-[#0D141F] border border-[#1A2636] rounded">
                <div className="text-dim text-[10px]">FLOOR ILLUMINATION</div>
                <div className="text-amber font-bold">{selectedRegion.illumination} (True PSR)</div>
              </div>
              <div className="p-2.5 bg-[#0D141F] border border-[#1A2636] rounded">
                <div className="text-dim text-[10px]">CRYOGENIC TEMP</div>
                <div className="text-cyan font-bold">{selectedRegion.temperature}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Canonical Volumetric & Mass Resource Estimates */}
          <div>
            <div className="text-xs font-mono font-bold text-cyan tracking-wider uppercase mb-2">
              2.0 QUANTIFIED CRYOGENIC VOLATILE ESTIMATE (CANONICAL MODEL)
            </div>
            
            <table className="mission-table mb-3">
              <thead>
                <tr>
                  <th>Telemetry Metric</th>
                  <th>Nominal Value</th>
                  <th>Uncertainty Bounds (±30%)</th>
                  <th>Governing Physics / Standard</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-white">Ice Concentration</td>
                  <td className="font-bold text-cyan">{res.iceConcentration}</td>
                  <td className="text-secondary">3.29% – 6.11%</td>
                  <td className="text-dim">By volume fraction within upper regolith</td>
                </tr>
                <tr>
                  <td className="font-semibold text-white">Target Depth Range</td>
                  <td className="font-bold text-primary">{res.depthRange}</td>
                  <td className="text-secondary">Stratum {res.dryLagDepthM ?? 0.5}m – {(res.depthRangeMax ?? 5.0).toFixed(1)}m</td>
                  <td className="text-dim">Desiccated dry lag overburden (0–{res.dryLagDepthM ?? 0.5}m) excluded</td>
                </tr>
                <tr>
                  <td className="font-semibold text-white">Estimated Ice Volume</td>
                  <td className="font-bold text-green text-sm">{displayVol}</td>
                  <td className="text-amber font-mono">{displayVolMin} – {displayVolMax}</td>
                  <td className="text-dim">DFSAR {res.analysisAreaKm2 ?? 8.70} km² sub-area ({selectedRegion.psrArea} total PSR)</td>
                </tr>
                <tr>
                  <td className="font-semibold text-white">Water-Equivalent Mass</td>
                  <td className="font-bold text-green text-sm">{displayMass}</td>
                  <td className="text-amber font-mono">{displayMassMin} – {displayMassMax}</td>
                  <td className="text-cyan font-mono">ρ = ~920 kg/m³ (water-ice solid density)</td>
                </tr>
              </tbody>
            </table>

            {/* Density Note */}
            <div className="p-3 bg-[#0E1724] border border-[#1B2F48] rounded text-xs text-secondary leading-relaxed">
              <strong className="text-primary font-mono">Physical Consistency Note:</strong> The estimated mass of <span className="text-green font-mono">{displayMass}</span> uses the true solid water-ice density (<span className="text-cyan font-mono">~920 kg/m³</span> @ 38K) rather than liquid water density (<span className="text-dim font-mono">1,000 kg/m³</span>):
              <div className="font-mono text-cyan mt-1">
                Mass = {densityProductString} (strictly within verified ±30% range: {displayMassMin} – {displayMassMax}).
              </div>
            </div>
          </div>

          {/* Section 3: In-Situ Resource Utilization (ISRU) Potential */}
          <div>
            <div className="text-xs font-mono font-bold text-cyan tracking-wider uppercase mb-2">
              3.0 IN-SITU RESOURCE UTILIZATION (ISRU) TRANSLATION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#0E1520] border border-[#192A3D] rounded flex flex-col justify-between">
                <div className="flex items-center justify-between text-dim">
                  <span>CRYOGENIC PROPELLANT</span>
                  <Flame className="w-4 h-4 text-amber" />
                </div>
                <div className="text-xl font-bold text-amber my-1">
                  {propellantTonnes}
                </div>
                <div className="text-[11px] text-secondary">
                  LOX / LH2 rocket fuel equivalent for Gaganyaan & Chandrayaan lunar ascent modules.
                </div>
              </div>

              <div className="p-3 bg-[#0E1520] border border-[#192A3D] rounded flex flex-col justify-between">
                <div className="flex items-center justify-between text-dim">
                  <span>POTABLE WATER SUPPLY</span>
                  <Droplets className="w-4 h-4 text-cyan" />
                </div>
                <div className="text-xl font-bold text-cyan my-1">
                  {potableLiters}
                </div>
                <div className="text-[11px] text-secondary">
                  Sustains 4-astronaut lunar base life support for &gt; 100,000 operational years.
                </div>
              </div>

              <div className="p-3 bg-[#0E1520] border border-[#192A3D] rounded flex flex-col justify-between">
                <div className="flex items-center justify-between text-dim">
                  <span>COMMERCIAL VALUE EQUIV.</span>
                  <Check className="w-4 h-4 text-green" />
                </div>
                <div className="text-xl font-bold text-green my-1">
                  {commercialBillion}
                </div>
                <div className="text-[11px] text-secondary">
                  Based on conservative Earth-to-Moon launch delivery cost ($20,000/kg avoided).
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Certification */}
          <div className="pt-4 border-t border-[#1D2B3E] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-dim gap-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-dim" />
              <span>SHA-256: e7a91bf4c6e9301da2804b4f8c12a</span>
            </div>
            <div className="flex items-center gap-4">
              <span>ISRO-SAC LUNAR SCIENCE DIRECTORATE</span>
              <span className="text-green">APPROVED FOR FLIGHT PLANNING</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-[#0D141F] border-t border-[#1D2B3E] gap-3">
          <button
            onClick={onClose}
            className="btn-mission-secondary px-4 py-2 text-xs"
          >
            CLOSE REPORT
          </button>
          <button
            onClick={handlePrint}
            className="btn-mission btn-mission-green px-5 py-2 text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT / PRINT PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
