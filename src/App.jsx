import React, { useState } from 'react';
import { CANDIDATE_REGIONS } from './data/missionData';
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

  // Pipeline telemetry state
  const [pipelineCompleted, setPipelineCompleted] = useState(true); // default true so all screens show canonical data out of the box
  const [pipelineRunning, setPipelineRunning] = useState(false);

  // Global Map Layer Toggles
  const [activeLayers, setActiveLayers] = useState({
    terrain: true,
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

  const getPipelineState = () => {
    if (pipelineRunning) return 'running';
    if (pipelineCompleted) return 'completed';
    return 'idle';
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0E14] text-[#E6EDF3] overflow-hidden select-none">
      {/* 1. Persistent Top Telemetry Strip */}
      <TopTelemetryStrip
        selectedRegion={selectedRegion}
        pipelineState={getPipelineState()}
      />

      {/* 2. Middle Content Area: Sidebar + Screen View */}
      <div className="flex-1 flex flex-row min-h-0 relative overflow-hidden">
        {/* Sidebar Nav */}
        <SidebarNav
          activeScreen={activeScreen}
          onSelectScreen={setActiveScreen}
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
          pipelineCompleted={pipelineCompleted}
        />

        {/* Dynamic Screen Container */}
        <main className="flex-1 h-full min-w-0 relative bg-[#0A0E14] overflow-hidden flex flex-col">
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
              pipelineCompleted={pipelineCompleted}
              setPipelineCompleted={setPipelineCompleted}
              pipelineRunning={pipelineRunning}
              setPipelineRunning={setPipelineRunning}
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
      </div>

      {/* 3. Persistent Footer Strip with Required Note */}
      <FooterStrip />
    </div>
  );
}
