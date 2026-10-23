import React from 'react';
import { 
  Compass, 
  Cpu, 
  Database, 
  MapPin, 
  ChevronRight, 
  Target, 
  Layers, 
  Radio, 
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CANDIDATE_REGIONS } from '../data/missionData';

export default function SidebarNav({ 
  activeScreen, 
  onSelectScreen, 
  selectedRegion, 
  onSelectRegion,
  pipelineCompleted
}) {
  const screens = [
    {
      id: 'explorer',
      label: 'PSR Explorer',
      sublabel: 'Interactive Lunar South Pole Map',
      icon: Compass,
      status: 'OVERVIEW / ACTIVE',
    },
    {
      id: 'analysis',
      label: 'Ice Analysis',
      sublabel: 'DFSAR Polarimetry & Classification',
      icon: Cpu,
      status: pipelineCompleted ? '87.4% CONFIRMED' : 'READY TO ANALYZE',
      badge: pipelineCompleted ? 'CONFIRMED' : null,
      badgeColor: 'text-green',
    },
    {
      id: 'resource',
      label: 'Resource Estimation',
      sublabel: 'Volumetric & Water-Equivalent Mass',
      icon: Database,
      status: '1.69×10⁹ kg ESTIMATED',
    },
    {
      id: 'mission',
      label: 'Mission Planner',
      sublabel: 'Landing Suitability & Rover Route',
      icon: MapPin,
      status: 'SITE A // A* ROUTE',
    },
  ];

  return (
    <aside className="w-64 bg-[#0A0E14] border-r border-[#1B293C] flex flex-col justify-between select-none z-30 flex-none h-full">
      {/* Top Nav Header / Screen Selector */}
      <div className="flex flex-col">
        {/* Navigation Category Label */}
        <div className="px-4 py-3 border-b border-[#14202F] flex items-center justify-between">
          <span className="text-[11px] font-mono text-dim tracking-wider uppercase">
            EXPLORATION DIRECTORY
          </span>
          <span className="text-[10px] font-mono text-cyan bg-[rgba(0,217,255,0.1)] px-1.5 py-0.5 rounded border border-[rgba(0,217,255,0.3)]">
            4 PHASES
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col">
          {screens.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`nav-item group relative text-left transition-all ${
                  isActive ? 'active' : ''
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded transition-colors ${
                    isActive 
                      ? 'bg-[rgba(0,217,255,0.15)] text-cyan shadow-[0_0_8px_rgba(0,217,255,0.3)]' 
                      : 'bg-[#111A26] text-secondary group-hover:text-primary group-hover:bg-[#162334]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold tracking-wide ${
                        isActive ? 'text-cyan font-bold' : 'text-primary group-hover:text-cyan'
                      }`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[rgba(0,230,118,0.15)] text-green border border-[rgba(0,230,118,0.4)]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-secondary truncate mt-0.5 font-mono">
                      {item.status}
                    </div>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-cyan translate-x-0.5' : 'text-dim group-hover:text-secondary'
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Candidate Target Quick Switcher */}
        <div className="p-3 border-t border-b border-[#14202F] mt-2">
          <div className="text-[10px] font-mono text-dim tracking-wider uppercase mb-2 flex items-center justify-between">
            <span>PSR TARGET REGIONS</span>
            <span className="text-secondary font-mono">{CANDIDATE_REGIONS.length} MAPPED</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {CANDIDATE_REGIONS.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => onSelectRegion(reg)}
                  className={`px-2.5 py-1.5 rounded text-left flex items-center justify-between transition-all font-mono text-xs border ${
                    isSelected
                      ? 'bg-[rgba(0,217,255,0.12)] border-cyan text-cyan'
                      : 'bg-[#0E1622] border-[#182638] text-secondary hover:border-[#273E5B] hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Target className={`w-3 h-3 flex-none ${isSelected ? 'text-cyan animate-spin' : 'text-dim'}`} />
                    <span className="truncate text-[11px] font-medium">{reg.shortName}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${
                    isSelected ? 'text-green' : 'text-dim'
                  }`}>
                    {reg.priorIceProbability}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Mission Metadata Box */}
      <div className="p-3 border-t border-[#14202F] bg-[#0C121B] font-mono text-[11px] text-secondary flex flex-col gap-2">
        <div className="flex items-center justify-between text-dim text-[10px]">
          <span>MISSION DIRECTIVE</span>
          <span className="text-green">LIP-2026-CH2</span>
        </div>
        <div className="text-primary text-[11px] leading-relaxed">
          ISRO Polar Lunar Exploration // In-situ Cryogenic Water Characterization
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-[#162232] text-[10px] text-dim">
          <Radio className="w-3 h-3 text-cyan animate-pulse" />
          <span>ORBITER: 100km POLAR CIR</span>
        </div>
      </div>
    </aside>
  );
}
