import React, { useState, useEffect } from 'react';
import { Activity, Clock, Globe, Radio, ShieldCheck, Sparkles, Satellite } from 'lucide-react';

export const MISSION_EPOCH = new Date("2026-10-12T00:00:00Z");

export default function TopTelemetryStrip({ selectedRegion, pipelineState }) {
  const [utcTime, setUtcTime] = useState('');
  const [istTime, setIstTime] = useState('');
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setNowMs(now.getTime());
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
      
      // IST time (UTC + 5:30)
      const istOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', istOptions).format(now) + ' IST');
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const missionElapsedSecs = Math.max(0, Math.floor((nowMs - MISSION_EPOCH.getTime()) / 1000));

  const formatMET = (totalSecs) => {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `T+ ${String(days).padStart(2, '0')}D:${String(hours).padStart(2, '0')}H:${String(mins).padStart(2, '0')}M:${String(secs).padStart(2, '0')}S`;
  };

  return (
    <header className="w-full bg-[#0E1520] border-b border-[#1B293C] px-4 py-2 flex items-center justify-between z-40 text-xs font-mono">
      {/* Left: ISRO Branding & System Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-[#1F2F44]">
          {/* Stylized ISRO / Lunar Icon */}
          <div className="w-7 h-7 rounded bg-[#131F2E] border border-cyan flex items-center justify-center relative shadow-[0_0_8px_rgba(0,217,255,0.4)]">
            <Satellite className="w-4 h-4 text-cyan" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wider text-primary font-display">ISRO</span>
              <span className="text-dim">|</span>
              <span className="text-cyan font-bold text-xs">SAC & IIRS</span>
            </div>
            <div className="text-[11px] text-secondary tracking-wider">
              LUNAR ICE INTELLIGENCE SYSTEM
            </div>
          </div>
        </div>

        {/* Mission Clock Displays */}
        <div className="flex items-center gap-4 text-secondary">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan" />
            <span className="text-dim">SIMULATED MET:</span>
            <span className="text-cyan font-semibold">{formatMET(missionElapsedSecs)}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-dim">UTC:</span>
            <span className="text-primary">{utcTime || 'SYNCING...'}</span>
          </div>
          <div className="hidden xl:flex items-center gap-1.5">
            <span className="text-dim">IST:</span>
            <span className="text-secondary">{istTime || 'SYNCING...'}</span>
          </div>
        </div>
      </div>

      {/* Center: Persistent Active Region Telemetry */}
      <div className="flex items-center gap-2 bg-[#090F17] px-3 py-1 rounded border border-[#1A283B]">
        <span className="text-dim text-[11px]">ACTIVE REGION:</span>
        <span className="text-green font-bold tracking-wider">{selectedRegion.shortName}</span>
        <span className="text-dim">|</span>
        <span className="text-cyan">{selectedRegion.latitude}</span>
        <span className="text-cyan">{selectedRegion.longitude}</span>
        <span className="text-dim">|</span>
        <span className="text-amber">{selectedRegion.temperature}</span>
      </div>

      {/* Right: Pipeline Status & Uplink */}
      <div className="flex items-center gap-3">
        {/* Pipeline Telemetry State */}
        <div className="flex items-center gap-2">
          <span className="text-dim">PIPELINE:</span>
          {pipelineState === 'running' ? (
            <span className="telemetry-tag telemetry-tag-amber animate-pulse">
              <Activity className="w-3 h-3 animate-spin" />
              RUNNING INFERENCE...
            </span>
          ) : pipelineState === 'completed' ? (
            <span className="telemetry-tag telemetry-tag-green">
              <ShieldCheck className="w-3 h-3" />
              INFERENCE VERIFIED
            </span>
          ) : (
            <span className="telemetry-tag telemetry-tag-cyan">
              <Sparkles className="w-3 h-3" />
              CACHED // READY
            </span>
          )}
        </div>

        {/* Chandrayaan DFSAR Uplink Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-secondary border-l border-[#1F2F44] pl-3">
          <Radio className="w-3.5 h-3.5 text-green animate-pulse" />
          <span className="text-dim">DFSAR UPLINK:</span>
          <span className="text-green font-semibold">484 MHz NOMINAL</span>
        </div>
      </div>
    </header>
  );
}
