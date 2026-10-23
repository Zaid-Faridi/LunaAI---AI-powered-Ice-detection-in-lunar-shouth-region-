import React, { useState } from 'react';
import { CANDIDATE_REGIONS } from './data/missionData';
import { usePipeline } from './hooks/usePipeline';
import ErrorBoundary from './components/ErrorBoundary';
import TopTelemetryStrip from './components/TopTelemetryStrip';
import SidebarNav from './components/SidebarNav';
import FooterStrip from './components/FooterStrip';
import PsrExplorerScreen from './components/screens/PsrExplorerScreen';
import IceAnalysisScreen from './components/screens/IceAnalysisScreen';
import ResourceEstimationScreen from './components/screens/ResourceEstimationScreen';
import MissionPlannerScreen from './components/screens/MissionPlannerScreen';

export default function App() {
  // Navigation state: 'explorer' | 'analysis' | 'resource' | 'mission'
  const [activeScreen, setActiveScreen] = useState('explorer');

  // Selected region state (defaults to Shackleton Crater — Candidate Region A)
  const [selectedRegion, setSelectedRegion] = useState(CANDIDATE_REGIONS[0]);

  // Single unified pipeline engine lifted into App
  const pipeline = usePipeline(true);

  // Collapsible sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Map Layer Toggles (with separate psr and illumination toggles)
  const [activeLayers, setActiveLayers] = useState({
    terrain: true,
    psr: true,
    illumination: true,
    divinerThermal: true,
    radarCpr: true,
    candidates: true,
    landingZone: true,
  });

  const handleToggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
  };

  const getTelemetryPipelineState = () => {
    if (pipeline.isRunning) return 'running';
    if (pipeline.isDone) return 'completed';
    return 'idle';
  };

  return (
    <div className="w-full min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-[#0A0E14] text-[#E6EDF3]">
      {/* 1. Persistent Top Telemetry Strip */}
      <TopTelemetryStrip
        selectedRegion={selectedRegion}
        pipelineState={getTelemetryPipelineState()}
      />

      {/* 2. Middle Content Area: Sidebar + Screen View */}
      <div className="flex-1 flex flex-row min-h-0 relative overflow-hidden">
        {/* Sidebar Nav (collapsible desktop + mobile bottom tab bar) */}
        <SidebarNav
          activeScreen={activeScreen}
          onSelectScreen={setActiveScreen}
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
          pipelineCompleted={pipeline.isDone}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Dynamic Screen Container wrapped in ErrorBoundary */}
        <ErrorBoundary>
          <main className="flex-1 h-full min-w-0 relative bg-[#0A0E14] overflow-hidden flex flex-col pb-14 md:pb-0">
            {activeScreen === 'explorer' && (
              <PsrExplorerScreen
                selectedRegion={selectedRegion}
                onSelectRegion={handleSelectRegion}
                onNavigateToScreen={setActiveScreen}
                activeLayers={activeLayers}
                onToggleLayer={handleToggleLayer}
              />
            )}

            {activeScreen === 'analysis' && (
              <IceAnalysisScreen
                selectedRegion={selectedRegion}
                pipeline={pipeline}
                onNavigateToScreen={setActiveScreen}
              />
            )}

            {activeScreen === 'resource' && (
              <ResourceEstimationScreen
                selectedRegion={selectedRegion}
                onNavigateToScreen={setActiveScreen}
              />
            )}

            {activeScreen === 'mission' && (
              <MissionPlannerScreen
                selectedRegion={selectedRegion}
                onSelectRegion={handleSelectRegion}
                activeLayers={activeLayers}
                onToggleLayer={handleToggleLayer}
              />
            )}
          </main>
        </ErrorBoundary>
      </div>

      {/* 3. Persistent Footer Strip with Required Note */}
      <FooterStrip />
    </div>
  );
}
