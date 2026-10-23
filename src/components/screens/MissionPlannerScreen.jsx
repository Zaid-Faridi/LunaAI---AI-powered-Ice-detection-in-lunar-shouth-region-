import React, { useState, useEffect, useReducer } from 'react';
import { 
  MapPin, 
  Navigation, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Route, 
  Check, 
  AlertTriangle, 
  Info,
  Radio,
  Sparkles,
  Mountain
} from 'lucide-react';
import { SUITABILITY_FACTORS, COMPOSITE_SCORE, ROVER_MISSION_DATA, MAP_SCALE_KM_PER_PIXEL } from '../../data/missionData';
import { routeDistanceKm, routeTimeHours, compositeScore } from '../../lib/calc';
import LunarMap from '../LunarMap';

function roverPlaybackReducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isPlaying: true,
        index: state.index >= action.maxIndex ? 0 : state.index,
      };
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
      };
    case 'TOGGLE':
      if (state.isPlaying) {
        return { ...state, isPlaying: false };
      }
      return {
        ...state,
        isPlaying: true,
        index: state.index >= action.maxIndex ? 0 : state.index,
      };
    case 'STEP':
      if (state.index >= action.maxIndex) {
        return {
          ...state,
          isPlaying: false,
        };
      }
      return {
        ...state,
        index: state.index + 1,
      };
    case 'RESET':
      return {
        isPlaying: false,
        index: 0,
      };
    default:
      return state;
  }
}

export default function MissionPlannerScreen({ 
  selectedRegion, 
  onSelectRegion,
  activeLayers,
  onToggleLayer
}) {
  const [routePlanned, setRoutePlanned] = useState(true); // default true for instant richness
  const [playback, dispatchPlayback] = useReducer(roverPlaybackReducer, {
    isPlaying: false,
    index: 0,
  });

  const waypoints = ROVER_MISSION_DATA.waypoints;
  const maxWaypointIndex = waypoints.length - 1;
  const rawFactors = SUITABILITY_FACTORS;
  const composite = COMPOSITE_SCORE;
  const roverData = ROVER_MISSION_DATA;

  // 1. Compute suitability contributions and composite score dynamically in code
  const factors = rawFactors.map((f) => ({
    ...f,
    contribution: (f.score * f.weight) / 100,
  }));
  const computedCompositeScore = compositeScore(factors);

  // 2. Derive route distance, time, and energy from waypoints using calc.js
  const scale = roverData.kmPerPixel || MAP_SCALE_KM_PER_PIXEL || 0.0216;
  const derivedDistanceKm = routeDistanceKm(waypoints, scale);
  const derivedCruiseSpeed = roverData.cruiseSpeedKmh || 0.5;
  const derivedTimeHours = routeTimeHours(derivedDistanceKm, derivedCruiseSpeed);
  // Energy consumption: baseline is 64% at 2.84 km
  const derivedEnergyPct = Math.round((derivedDistanceKm / 2.84) * 64);

  const displayDistance = `${derivedDistanceKm.toFixed(2)} km`;
  const displayTime = `${derivedTimeHours.toFixed(1)} h`;
  const displayEnergy = `${derivedEnergyPct}%`;

  // Advance playback cleanly with timer and dispatch without nested setState side effects
  useEffect(() => {
    if (!playback.isPlaying) return;

    const interval = setInterval(() => {
      dispatchPlayback({ type: 'STEP', maxIndex: maxWaypointIndex });
    }, 1200);

    return () => clearInterval(interval);
  }, [playback.isPlaying, maxWaypointIndex]);

  const handlePlanRoute = () => {
    setRoutePlanned(true);
    // Note: Plan route only displays the route; a separate Play button initiates playback
  };

  const currentWp = waypoints[playback.index] || waypoints[0];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row relative overflow-hidden bg-[#0A0E14]">
      {/* Left: Interactive Tactical Polar Map with A* Route & Landing Ellipse (60% width on large screens) */}
      <div className="flex-1 h-[50%] lg:h-full relative min-w-0 border-b lg:border-b-0 lg:border-r border-[#1B293C]">
        <LunarMap
          selectedRegion={selectedRegion}
          onSelectRegion={onSelectRegion}
          activeScreen="mission"
          showRoverRoute={routePlanned}
          roverPlaybackIndex={routePlanned ? playback.index : null}
          activeLayers={activeLayers}
          onToggleLayer={onToggleLayer}
        />

        {/* Floating Route Simulation HUD overlay on map */}
        {routePlanned && (
          <div className="absolute top-16 left-3 z-30 mission-panel p-3 max-w-xs bg-[#0A0F17]/95 border-cyan font-mono text-xs shadow-lg">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1A2A3E] mb-2">
              <span className="text-[11px] text-cyan font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-cyan" />
                A* TRAVERSAL TELEMETRY
              </span>
              <span className="telemetry-tag telemetry-tag-green text-[11px]">
                WP 0{playback.index + 1}/08
              </span>
            </div>

            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-secondary">CURRENT WP:</span>
                <span className="text-primary font-bold">{currentWp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">COORDINATES:</span>
                <span className="text-cyan">{currentWp.lat}, {currentWp.lon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">SLOPE INCLINE:</span>
                <span className="text-green font-bold">{currentWp.slope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">MISSION PHASE:</span>
                <span className="text-amber font-bold">{currentWp.phase}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#18283C]">
              <button
                onClick={() => dispatchPlayback({ type: 'TOGGLE', maxIndex: maxWaypointIndex })}
                className="btn-mission py-1.5 px-3 text-[11px] flex items-center gap-1 flex-1"
                aria-label={playback.isPlaying ? 'Pause rover simulation' : 'Start rover simulation'}
              >
                {playback.isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>PAUSE SIM</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-cyan" />
                    <span>{playback.index > 0 ? (playback.index >= maxWaypointIndex ? 'REPLAY' : 'RESUME') : 'PLAY SIMULATION'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => dispatchPlayback({ type: 'RESET' })}
                title="Reset Rover to Lander"
                aria-label="Reset Rover to Lander"
                className="p-1.5 bg-[#121E2C] border border-[#23354C] rounded text-secondary hover:text-cyan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Landing Site Suitability Model & Rover Route Specifications (40% width) */}
      <div className="w-full lg:w-[480px] xl:w-[520px] h-[50%] lg:h-full bg-[#0D141F] flex flex-col overflow-y-auto p-4 lg:p-5 flex-none border-t lg:border-t-0 border-[#1B293C]">
        {/* Screen Title */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1B293C] mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="telemetry-tag telemetry-tag-cyan text-[11px]">
                SCREEN 04 // FLIGHT PLANNING
              </span>
              <span className="text-dim font-mono text-xs">|</span>
              <span className="text-secondary font-mono text-xs">SITE A RECONNAISSANCE</span>
            </div>
            <h2 className="text-base lg:text-lg font-bold text-primary font-display tracking-wide uppercase">
              LANDING SITE SUITABILITY & ROVER ROUTING
            </h2>
          </div>
        </div>

        {/* Section 1: Weighted Landing-Site Suitability Table */}
        <div className="mission-panel p-4 bg-[#0E1522] mb-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A293E] mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan" />
              <h3 className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                LANDING SITE SUITABILITY MODEL (WEIGHTED)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-secondary">MULTI-CRITERIA EVAL</span>
          </div>

          <table className="mission-table mb-3">
            <thead>
              <tr>
                <th>Factor</th>
                <th className="text-right">Score</th>
                <th className="text-right">Weight</th>
                <th className="text-right">Contrib.</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((item) => (
                <tr key={item.factor}>
                  <td className="font-semibold text-primary">
                    <div>{item.factor}</div>
                    <div className="text-[11px] text-dim font-normal font-sans">{item.desc}</div>
                  </td>
                  <td className="text-right font-mono font-bold text-cyan text-sm">
                    {item.score}%
                  </td>
                  <td className="text-right font-mono text-secondary">
                    {item.weight}%
                  </td>
                  <td className="text-right font-mono font-bold text-green">
                    {item.contribution.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Composite Score Banner */}
          <div className="p-3 rounded bg-[#09111C] border border-green flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-dim tracking-wider uppercase">
                COMPOSITE SUITABILITY — {composite.site}
              </div>
              <div className="text-2xl font-mono font-bold text-green mt-0.5">
                {computedCompositeScore.toFixed(1)}%
              </div>
            </div>

            <div className="p-2 rounded bg-[rgba(0,230,118,0.15)] border border-green text-green font-mono font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,230,118,0.3)]">
              <Check className="w-4 h-4 text-green" />
              <span>{composite.status}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Rover Route Planning & High-Speed Concept */}
        <div className="mission-panel p-4 bg-[#0E1522] mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1A293E] mb-3">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan" />
              <h3 className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                A* ROVER TRAVERSAL TRAJECTORY
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlanRoute}
                className="btn-mission py-1.5 px-3 text-[11px] flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>PLAN ROVER ROUTE</span>
              </button>

              {routePlanned && (
                <button
                  onClick={() => dispatchPlayback({ type: 'TOGGLE', maxIndex: maxWaypointIndex })}
                  className={`btn-mission py-1.5 px-3 text-[11px] flex items-center gap-1.5 ${
                    playback.isPlaying ? 'btn-mission-secondary' : 'btn-mission-green'
                  }`}
                  aria-label={playback.isPlaying ? 'Pause rover route playback' : 'Play rover route playback'}
                >
                  {playback.isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{playback.index >= maxWaypointIndex ? 'REPLAY' : 'PLAY'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="text-xs font-mono text-cyan mb-3">
            SEQUENCE: <span className="text-primary font-bold">Start → Ice Deposit → Sampling Zone → Return</span>
          </div>

          {/* Telemetry Metrics Grid as Specified */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 font-mono text-xs">
            <div className="p-2.5 bg-[#090F17] border border-[#162538] rounded">
              <div className="text-dim text-[11px]">DISTANCE</div>
              <div className="text-base font-bold text-primary">{displayDistance}</div>
            </div>

            <div className="p-2.5 bg-[#090F17] border border-[#162538] rounded">
              <div className="text-dim text-[11px]">ESTIMATED TIME</div>
              <div className="text-base font-bold text-cyan">{displayTime}</div>
              <div className="text-[11px] text-dim">{roverData.avgSpeed}</div>
            </div>

            <div className="p-2.5 bg-[#090F17] border border-[#162538] rounded">
              <div className="text-dim text-[11px]">ENERGY BUDGET</div>
              <div className="text-base font-bold text-green">{displayEnergy}</div>
              <div className="text-[11px] text-dim">RTG + 840Wh Batt</div>
            </div>

            <div className="p-2.5 bg-[#090F17] border border-[#162538] rounded">
              <div className="text-dim text-[11px]">WAYPOINTS</div>
              <div className="text-base font-bold text-primary">{roverData.waypointsCount} STATIONS</div>
            </div>

            <div className="p-2.5 bg-[#090F17] border border-[#162538] rounded col-span-2 sm:col-span-2">
              <div className="text-dim text-[11px]">TERRAIN RISK</div>
              <div className="text-base font-bold text-green flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green" />
                <span>{roverData.terrainRisk} (MAX GRADE 6.2°)</span>
              </div>
            </div>
          </div>

          {/* Prominent High-Speed Rover Concept Label Callout as Requested */}
          <div className="p-3.5 rounded bg-[#101A27] border border-cyan/40">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="telemetry-tag telemetry-tag-cyan font-bold text-[11px]">
                {roverData.conceptLabel}
              </span>
              <span className="text-[11px] font-mono text-secondary">ARCHITECTURAL DESIGN</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              <strong className="text-primary font-mono">Benchmark Reconciliation:</strong> Traversal cruise speed <span className="text-cyan font-mono">≈ 0.5 km/h</span> is ~14× faster than Chandrayaan-3's <em>Pragyan</em> rover (~1 cm/s). Enabled by autonomous real-time stereo visual odometry, active hazard avoidance path planning, brushless direct-drive hub motors, and continuous radioisotope thermal power.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
