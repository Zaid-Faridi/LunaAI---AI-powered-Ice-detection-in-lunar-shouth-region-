import React, { useState } from 'react';
import { 
  Compass, 
  Cpu, 
  Database, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Target, 
  Layers, 
  Radio, 
  ShieldAlert,
  Flame,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { CANDIDATE_REGIONS } from '../data/missionData';

export default function SidebarNav({ 
  activeScreen, 
  onSelectScreen, 
  selectedRegion, 
  onSelectRegion,
  pipelineCompleted,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledOnToggleCollapse
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = controlledOnToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const screens = [
    {
      id: 'explorer',
      label: 'PSR Explorer',
      shortLabel: 'Explorer',
      sublabel: 'Interactive Lunar South Pole Map',
      icon: Compass,
      status: 'OVERVIEW / ACTIVE',
    },
    {
      id: 'analysis',
      label: 'Ice Analysis',
      shortLabel: 'Analysis',
      sublabel: 'DFSAR Polarimetry & Classification',
      icon: Cpu,
      status: pipelineCompleted ? '87.4% CONFIRMED' : 'READY TO ANALYZE',
      badge: pipelineCompleted ? 'CONFIRMED' : null,
      badgeColor: 'text-green',
    },
    {
      id: 'resource',
      label: 'Resource Estimation',
      shortLabel: 'Resources',
      sublabel: 'Volumetric & Water-Equivalent Mass',
      icon: Database,
      status: '1.69×10⁹ kg ESTIMATED',
    },
    {
      id: 'mission',
      label: 'Mission Planner',
      shortLabel: 'Mission',
      sublabel: 'Landing Suitability & Rover Route',
      icon: MapPin,
      status: 'SITE A // A* ROUTE',
    },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (Collapsible: w-64 expanded, w-16 collapsed) */}
      <aside 
        aria-label="Mission Exploration Sidebar"
        className={`hidden md:flex flex-col justify-between bg-[#0A0E14] border-r border-[#1B293C] z-30 flex-none h-full transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Top Nav Header / Screen Selector */}
        <div className="flex flex-col min-h-0">
          {/* Navigation Category Label & Collapse Toggle */}
          <div className="px-3 py-3 border-b border-[#14202F] flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-[11px] font-mono text-dim tracking-wider uppercase truncate">
                EXPLORATION DIRECTORY
              </span>
            )}
            <button
              onClick={toggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded hover:bg-[#131F2E] text-secondary hover:text-cyan transition-colors mx-auto"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col py-1">
            {screens.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  title={item.label}
                  aria-label={`${item.label} - ${item.sublabel}`}
                  className={`nav-item group relative text-left transition-all ${
                    isActive ? 'active' : ''
                  } ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'}`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
                    <div className={`p-2 rounded transition-colors relative ${
                      isActive 
                        ? 'bg-[rgba(0,217,255,0.15)] text-cyan shadow-[0_0_8px_rgba(0,217,255,0.3)]' 
                        : 'bg-[#111A26] text-secondary group-hover:text-primary group-hover:bg-[#162334]'
                    }`}>
                      <Icon className="w-4 h-4" />
                      {isCollapsed && item.badge && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold tracking-wide ${
                              isActive ? 'text-cyan font-bold' : 'text-primary group-hover:text-cyan'
                            }`}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="text-[11px] font-mono px-1 py-0.2 rounded bg-[rgba(0,230,118,0.15)] text-green border border-[rgba(0,230,118,0.4)]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-secondary truncate mt-0.5 font-mono">
                            {item.status}
                          </div>
                        </div>

                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-cyan translate-x-0.5' : 'text-dim group-hover:text-secondary'
                        }`} />
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Candidate Target Quick Switcher (Shown when expanded) */}
          {!isCollapsed && (
            <div className="p-3 border-t border-b border-[#14202F] mt-2 overflow-y-auto">
              <div className="text-[11px] font-mono text-dim tracking-wider uppercase mb-2 flex items-center justify-between">
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
                      aria-label={`Select candidate region: ${reg.name}`}
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
                      <span className={`text-[11px] font-bold ${
                        isSelected ? 'text-green' : 'text-dim'
                      }`}>
                        {reg.priorIceProbability}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Mission Metadata Box */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-[#14202F] bg-[#0C121B] font-mono text-[11px] text-secondary flex flex-col gap-2">
            <div className="flex items-center justify-between text-dim text-[11px]">
              <span>MISSION DIRECTIVE</span>
              <span className="text-green">LIP-2026-CH2</span>
            </div>
            <div className="text-primary text-[11px] leading-relaxed">
              ISRO Polar Lunar Exploration // In-situ Cryogenic Water Characterization
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[#162232] text-[11px] text-dim">
              <Radio className="w-3 h-3 text-cyan animate-pulse" />
              <span>ORBITER: 100km POLAR CIR</span>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-[#14202F] flex justify-center text-cyan">
            <Radio className="w-4 h-4 animate-pulse" title="Orbiter 100km Polar Cir" />
          </div>
        )}
      </aside>

      {/* 2. Mobile Layout: Bottom Navigation Tab Bar (< 768px) */}
      <nav 
        aria-label="Mobile Screen Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E14]/95 backdrop-blur-md border-t border-[#1B293C] flex items-center justify-around py-1 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      >
        {screens.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded transition-colors ${
                isActive 
                  ? 'text-cyan bg-[rgba(0,217,255,0.08)]' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan' : 'text-secondary'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green" />
                )}
              </div>
              <span className={`text-[11px] font-mono mt-1 tracking-tight truncate ${
                isActive ? 'text-cyan font-bold' : 'text-secondary'
              }`}>
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
