import React from 'react';
import { Database, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export default function FooterStrip() {
  return (
    <footer className="w-full bg-[#080C12] border-t border-[#172436] px-4 py-2 flex items-center justify-between z-40 text-xs font-mono flex-none">
      {/* Left: Representative Disclaimer as requested */}
      <div className="flex items-center gap-2 text-secondary">
        <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
        <span className="text-[11px] text-secondary">
          Displayed values are representative outputs from our trained DFSAR/U-Net+RF pipeline; live inference is cached for demo speed.
        </span>
      </div>

      {/* Right: Technical Pipeline Metadata */}
      <div className="hidden md:flex items-center gap-4 text-[11px] text-dim font-mono">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-cyan" />
          <span>MODEL: U-Net (L+S Band) + RF Ensemble</span>
        </div>
        <span>|</span>
        <div className="flex items-center gap-1.5">
          <Database className="w-3 h-3 text-green" />
          <span>GROUND TRUTH: LRO-Diviner / Ch-2 DFSAR</span>
        </div>
        <span>|</span>
        <div className="flex items-center gap-1.5 text-secondary">
          <ShieldCheck className="w-3 h-3 text-cyan" />
          <span>ISRO SAC // SEC-A3</span>
        </div>
      </div>
    </footer>
  );
}
