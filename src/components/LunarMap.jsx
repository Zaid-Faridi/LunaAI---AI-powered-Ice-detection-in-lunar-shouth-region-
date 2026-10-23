import React, { useState, useRef } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Target, Radio, Compass, Navigation, Eye, EyeOff } from 'lucide-react';
import { CANDIDATE_REGIONS, COMPOSITE_SCORE, ROVER_MISSION_DATA } from '../data/missionData';

export default function LunarMap({
  selectedRegion,
  onSelectRegion,
  activeScreen,
  showRoverRoute = false,
  roverPlaybackIndex = null,
  activeLayers = {
    terrain: true,
    illumination: true,
    divinerThermal: true,
    radarCpr: true,
    candidates: true,
    landingZone: true,
  },
  onToggleLayer,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorTelemetry, setCursorTelemetry] = useState({
    lat: "89.90° S",
    lon: "0.00° E",
    elev: "-4.12 km",
    temp: "38.2 K",
    inPSR: true,
  });

  const svgRef = useRef(null);

  // Center of the 800x800 coordinate system represents the Lunar South Pole (90.00° S)
  const POLE_X = 400;
  const POLE_Y = 400;

  const handleMouseDown = (e) => {
    // Only drag on left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert screen coordinates to SVG viewBox coordinates
    const scaleX = 800 / rect.width;
    const scaleY = 800 / rect.height;
    const rawSvgX = clientX * scaleX;
    const rawSvgY = clientY * scaleY;

    // Undo zoom and pan
    const mapX = (rawSvgX - 400 - pan.x) / zoom + 400;
    const mapY = (rawSvgY - 400 - pan.y) / zoom + 400;

    // Calculate polar distance from South Pole (400, 400)
    const dx = mapX - POLE_X;
    const dy = mapY - POLE_Y;
    const distPx = Math.sqrt(dx * dx + dy * dy);

    // Scaling: 350px = 3 degrees of latitude (87°S to 90°S) => ~116.6px per degree
    const degFromPole = distPx / 116.6;
    const lat = Math.min(90, Math.max(86.5, 90.0 - degFromPole));

    // Longitude angle: 0° is along +Y axis (downward in polar projection or 0° meridian)
    let angleRad = Math.atan2(dx, dy);
    let lonDeg = (angleRad * 180) / Math.PI;
    if (lonDeg < 0) lonDeg += 360;

    let lonLabel = "";
    if (lonDeg >= 0 && lonDeg <= 180) {
      lonLabel = `${lonDeg.toFixed(2)}° E`;
    } else {
      lonLabel = `${(360 - lonDeg).toFixed(2)}° W`;
    }

    // Determine estimated elevation and temperature based on proximity to craters
    let inShackleton = distPx < 45;
    let tempK = inShackleton ? (38.0 + (distPx / 45) * 4).toFixed(1) : (45 + Math.min(120, distPx * 0.3)).toFixed(1);
    let elevationKm = inShackleton ? (-4.12 + (distPx / 45) * 3.8).toFixed(2) : (-1.2 + Math.sin(distPx * 0.1) * 2.1).toFixed(2);

    setCursorTelemetry({
      lat: `${lat.toFixed(2)}° S`,
      lon: lonLabel,
      elev: `${elevationKm} km`,
      temp: `${tempK} K`,
      inPSR: inShackleton || distPx < 60,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom((z) => Math.min(4, z + 0.3));
  const zoomOut = () => setZoom((z) => Math.max(0.8, z - 0.3));

  // Waypoints from mission data
  const waypoints = ROVER_MISSION_DATA.waypoints;
  const pathD = waypoints.map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`).join(' ');

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070B10] flex flex-col select-none">
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="mission-panel px-3 py-1.5 flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            LOLA-DEM // CH-2 POLAR STEREOGRAPHIC
          </span>
          <span className="text-dim">|</span>
          <span className="text-secondary">
            PROJECTION: <span className="text-primary">SOUTH POLAR 87°–90°S</span>
          </span>
        </div>
      </div>

      {/* Map Tools (Zoom, Reset, Layers) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <div className="mission-panel flex items-center p-1 gap-1">
          <button
            onClick={zoomIn}
            title="Zoom In (+)"
            className="p-1.5 text-secondary hover:text-cyan hover:bg-[#152335] rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            title="Zoom Out (-)"
            className="p-1.5 text-secondary hover:text-cyan hover:bg-[#152335] rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset View"
            className="p-1.5 text-secondary hover:text-cyan hover:bg-[#152335] rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Controls Dropdown/Pills */}
        <div className="mission-panel px-2 py-1 flex items-center gap-2 text-xs font-mono">
          <span className="text-dim flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan" />
            LAYERS:
          </span>
          <button
            onClick={() => onToggleLayer && onToggleLayer('terrain')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeLayers.terrain
                ? 'bg-[rgba(0,217,255,0.15)] text-cyan border border-[rgba(0,217,255,0.4)]'
                : 'text-dim hover:text-secondary'
            }`}
          >
            DEM
          </button>
          <button
            onClick={() => onToggleLayer && onToggleLayer('illumination')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeLayers.illumination
                ? 'bg-[rgba(255,176,32,0.15)] text-amber border border-[rgba(255,176,32,0.4)]'
                : 'text-dim hover:text-secondary'
            }`}
          >
            PSR/SOLAR
          </button>
          <button
            onClick={() => onToggleLayer && onToggleLayer('divinerThermal')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeLayers.divinerThermal
                ? 'bg-[rgba(0,180,255,0.2)] text-[#66D9FF] border border-[rgba(0,180,255,0.4)]'
                : 'text-dim hover:text-secondary'
            }`}
          >
            DIVINER 40K
          </button>
          <button
            onClick={() => onToggleLayer && onToggleLayer('radarCpr')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeLayers.radarCpr
                ? 'bg-[rgba(0,230,118,0.15)] text-green border border-[rgba(0,230,118,0.4)]'
                : 'text-dim hover:text-secondary'
            }`}
          >
            DFSAR CPR
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Map Canvas */}
      <div
        className="w-full h-full cursor-crosshair relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 800"
          className="w-full h-full block"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Thin Cyan Grid Pattern */}
            <pattern id="cyanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(0, 217, 255, 0.07)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="rgba(0, 217, 255, 0.25)" />
            </pattern>

            {/* Radial Gradient for South Pole Shading */}
            <radialGradient id="spaceBackdrop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0E1620" />
              <stop offset="60%" stopColor="#090E16" />
              <stop offset="100%" stopColor="#05080E" />
            </radialGradient>

            {/* Shackleton Crater Rim and Floor Gradient */}
            <radialGradient id="shackletonShading" cx="48%" cy="48%" r="50%">
              <stop offset="0%" stopColor="#030508" />
              <stop offset="55%" stopColor="#060C14" />
              <stop offset="85%" stopColor="#131E2C" />
              <stop offset="96%" stopColor="#30445C" />
              <stop offset="100%" stopColor="#0D1622" />
            </radialGradient>

            {/* Faustini Crater Gradient */}
            <radialGradient id="faustiniShading" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#04060A" />
              <stop offset="70%" stopColor="#0A121D" />
              <stop offset="95%" stopColor="#223347" />
              <stop offset="100%" stopColor="#0C1420" />
            </radialGradient>

            {/* Shoemaker Crater Gradient */}
            <radialGradient id="shoemakerShading" cx="49%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#030509" />
              <stop offset="75%" stopColor="#08101A" />
              <stop offset="96%" stopColor="#1E2E42" />
              <stop offset="100%" stopColor="#0C1420" />
            </radialGradient>

            {/* Haworth Crater Gradient */}
            <radialGradient id="haworthShading" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#04070C" />
              <stop offset="70%" stopColor="#09111C" />
              <stop offset="95%" stopColor="#203046" />
              <stop offset="100%" stopColor="#0B131E" />
            </radialGradient>

            {/* Thermal Diviner Cryogenic Cold Trap Gradient (<40K) */}
            <radialGradient id="cryoColdTrap" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 217, 255, 0.45)" />
              <stop offset="45%" stopColor="rgba(0, 150, 255, 0.25)" />
              <stop offset="80%" stopColor="rgba(0, 90, 200, 0.12)" />
              <stop offset="100%" stopColor="rgba(0, 50, 150, 0)" />
            </radialGradient>

            {/* DFSAR High-CPR Ice Anomaly Heatmap */}
            <radialGradient id="iceCprGlow" cx="47%" cy="47%" r="48%">
              <stop offset="0%" stopColor="rgba(0, 230, 118, 0.75)" />
              <stop offset="40%" stopColor="rgba(0, 217, 255, 0.55)" />
              <stop offset="75%" stopColor="rgba(0, 180, 240, 0.2)" />
              <stop offset="100%" stopColor="rgba(0, 217, 255, 0)" />
            </radialGradient>

            {/* Glow Filter for Landing Ellipse & Targets */}
            <filter id="cyanGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="greenGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Deep Space / Lunar Basemap Background */}
          <rect width="800" height="800" fill="url(#spaceBackdrop)" />

          {/* 2. Thin 1px Cyan Grid Behind the Map */}
          <rect width="800" height="800" fill="url(#cyanGrid)" />

          {/* 3. Polar Stereographic Concentric Coordinate Grid */}
          <g stroke="rgba(0, 217, 255, 0.12)" strokeWidth="1" fill="none">
            {/* Concentric Latitude Rings */}
            <circle cx="400" cy="400" r="350" strokeDasharray="3 4" />
            <circle cx="400" cy="400" r="233" strokeDasharray="3 4" />
            <circle cx="400" cy="400" r="116" strokeDasharray="3 4" />
            <circle cx="400" cy="400" r="58" stroke="rgba(0, 217, 255, 0.2)" />

            {/* Radial Meridians */}
            <line x1="400" y1="50" x2="400" y2="750" />
            <line x1="50" y1="400" x2="750" y2="400" />
            <line x1="152" y1="152" x2="648" y2="648" strokeDasharray="2 4" stroke="rgba(0, 217, 255, 0.08)" />
            <line x1="152" y1="648" x2="648" y2="152" strokeDasharray="2 4" stroke="rgba(0, 217, 255, 0.08)" />
          </g>

          {/* Degree Marks on Rings */}
          <g fill="rgba(0, 217, 255, 0.45)" fontSize="9" fontFamily="var(--font-mono)">
            <text x="408" y="75" textAnchor="start">87.0° S</text>
            <text x="408" y="190" textAnchor="start">88.0° S</text>
            <text x="408" y="305" textAnchor="start">89.0° S</text>
            <text x="408" y="358" textAnchor="start">89.5° S</text>

            <text x="400" y="42" textAnchor="middle">0.00° PRIME MERIDIAN</text>
            <text x="765" y="403" textAnchor="start">90.0° E</text>
            <text x="400" y="775" textAnchor="middle">180.0°</text>
            <text x="35" y="403" textAnchor="end">90.0° W</text>
          </g>

          {/* 4. Topographic Terrain & Regional Craters */}
          {activeLayers.terrain && (
            <g id="lunar-craters">
              {/* Surrounding Topographic Uplifts & High Ridges */}
              {/* Malapert Mountain Uplift */}
              <ellipse cx="250" cy="220" rx="60" ry="35" transform="rotate(-30 250 220)" fill="#141E2B" stroke="#25384E" strokeWidth="1.5" />
              <path d="M 220 200 Q 250 180 290 220" stroke="#3A5370" strokeWidth="2" fill="none" opacity="0.6" />
              <text x="250" y="210" fill="#71869E" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">MALAPERT MASSIF</text>

              {/* Nobile Crater */}
              <circle cx="580" cy="520" r="55" fill="#0C1520" stroke="#1F2F43" strokeWidth="1.5" />
              <circle cx="580" cy="520" r="45" fill="#080D15" />
              <text x="580" y="525" fill="#6A8098" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">NOBILE</text>

              {/* Amundsen Crater Rim (edge) */}
              <circle cx="680" cy="280" r="65" fill="#0A111A" stroke="#1A2839" strokeWidth="1" />
              <text x="680" y="285" fill="#586E85" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">AMUNDSEN</text>

              {/* Shoemaker Crater (Candidate C) */}
              <circle cx="475" cy="275" r="42" fill="url(#shoemakerShading)" stroke="#23354C" strokeWidth="1.5" />
              <path d="M 445 260 Q 480 240 510 270" stroke="#3F5A7B" strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Faustini Crater (Candidate B) */}
              <circle cx="520" cy="340" r="38" fill="url(#faustiniShading)" stroke="#22354B" strokeWidth="1.5" />
              <path d="M 495 325 Q 525 310 550 335" stroke="#3E5978" strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Haworth Crater (Candidate D) */}
              <circle cx="300" cy="370" r="40" fill="url(#haworthShading)" stroke="#213348" strokeWidth="1.5" />
              <path d="M 270 355 Q 300 340 330 365" stroke="#3D5876" strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Connecting Ridge between Shackleton and de Gerlache */}
              <path
                d="M 360 360 C 375 350, 395 365, 400 375"
                stroke="#4C6C92"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />

              {/* SHACKLETON CRATER (Hero Feature - exactly at South Pole 89.90°S) */}
              {/* Outer Crater Rim (elevated +1.2 km) */}
              <circle
                cx="400"
                cy="410"
                r="46"
                fill="url(#shackletonShading)"
                stroke="#3E597A"
                strokeWidth="2.5"
              />

              {/* Sunlit Connecting Ridge Rim Crest (High solar incidence ~86%) */}
              {activeLayers.illumination && (
                <path
                  d="M 365 390 C 375 370, 420 372, 435 390"
                  stroke="#FFB020"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.85"
                />
              )}

              {/* Permanent Shadow Region (PSR) Deep Floor (<0.3% illumination) */}
              {activeLayers.illumination && (
                <ellipse
                  cx="402"
                  cy="414"
                  rx="34"
                  ry="32"
                  fill="#020406"
                  stroke="rgba(0, 217, 255, 0.4)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
            </g>
          )}

          {/* 5. Diviner Cryogenic Thermal Cold-Trap Overlay (<40 K) */}
          {activeLayers.divinerThermal && (
            <g id="diviner-thermal-layer">
              {/* Cold trap overlay inside Shackleton floor (~38K) */}
              <ellipse
                cx="402"
                cy="414"
                rx="30"
                ry="28"
                fill="url(#cryoColdTrap)"
                opacity="0.75"
              />
              {/* Faustini Cold trap (~48K) */}
              <ellipse cx="520" cy="340" rx="22" ry="20" fill="url(#cryoColdTrap)" opacity="0.45" />
              {/* Shoemaker Cold trap (~42K) */}
              <ellipse cx="475" cy="275" rx="25" ry="24" fill="url(#cryoColdTrap)" opacity="0.55" />
            </g>
          )}

          {/* 6. DFSAR Polarimetric CPR Ice Anomalies (CPR > 1.0) */}
          {activeLayers.radarCpr && (
            <g id="dfsar-cpr-layer">
              {/* Shackleton Floor High-CPR Patch */}
              <ellipse
                cx="402"
                cy="415"
                rx="19"
                ry="18"
                fill="url(#iceCprGlow)"
                filter="url(#greenGlowEffect)"
                opacity="0.85"
              />
              {/* Small radar scatterers */}
              <circle cx="396" cy="408" r="4" fill="#00E676" opacity="0.8" />
              <circle cx="406" cy="418" r="5" fill="#00D9FF" opacity="0.75" />
              <circle cx="410" cy="411" r="3.5" fill="#00E676" opacity="0.85" />
            </g>
          )}

          {/* 7. Landing Zone Ellipse & Mission Planner Overlays */}
          {activeLayers.landingZone && (
            <g id="landing-zone-overlay">
              {/* Site A Recommended Landing Zone Ellipse */}
              <g transform="translate(378, 362) rotate(-32)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="26"
                  ry="13"
                  fill="rgba(0, 230, 118, 0.12)"
                  stroke="#00E676"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                  filter="url(#greenGlowEffect)"
                />
                <circle cx="0" cy="0" r="3" fill="#00E676" />
                <line x1="-32" y1="0" x2="32" y2="0" stroke="rgba(0, 230, 118, 0.5)" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="rgba(0, 230, 118, 0.5)" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>

              {/* Label for Landing Site */}
              <rect x="300" y="325" width="145" height="18" fill="rgba(17, 24, 35, 0.85)" stroke="#00E676" strokeWidth="0.8" rx="2" />
              <text x="305" y="337" fill="#00E676" fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold">
                ★ SITE A: LZ CONFIRMED (89.3%)
              </text>
            </g>
          )}

          {/* 8. A* Rover Route Trajectory (Active during Mission Planner or when toggled) */}
          {(showRoverRoute || activeScreen === 'mission') && (
            <g id="rover-route-layer">
              {/* A* Computed Path Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#00D9FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#cyanGlowEffect)"
              />
              <path
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeDasharray="4 3"
              />

              {/* Waypoints */}
              {waypoints.map((wp, idx) => {
                const isActiveWp = roverPlaybackIndex !== null && roverPlaybackIndex === idx;
                const isTargetSample = wp.id === 5 || wp.id === 6;
                return (
                  <g key={wp.id} transform={`translate(${wp.x}, ${wp.y})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={isTargetSample ? 5.5 : 4}
                      fill={isTargetSample ? "#00E676" : "#00D9FF"}
                      stroke="#0A0E14"
                      strokeWidth="1.5"
                    />
                    {isActiveWp && (
                      <circle
                        cx="0"
                        cy="0"
                        r="9"
                        fill="none"
                        stroke="#00D9FF"
                        strokeWidth="2"
                        className="pulse-cyan"
                      />
                    )}
                    {/* WP label */}
                    <text
                      x="7"
                      y="3"
                      fill={isTargetSample ? "#00E676" : "#E6EDF3"}
                      fontSize="8"
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                    >
                      {`WP${wp.id}`}
                    </text>
                  </g>
                );
              })}

              {/* Moving Rover Token if simulating */}
              {roverPlaybackIndex !== null && (
                <g transform={`translate(${waypoints[roverPlaybackIndex].x}, ${waypoints[roverPlaybackIndex].y})`}>
                  <circle cx="0" cy="0" r="14" fill="rgba(0, 217, 255, 0.25)" className="pulse-cyan" />
                  <rect x="-4" y="-4" width="8" height="8" fill="#00D9FF" transform="rotate(45)" />
                  <text x="0" y="-10" fill="#00D9FF" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">
                    ROVER-1
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 9. Candidate Regions Interactive Overlays */}
          {activeLayers.candidates && (
            <g id="candidate-regions">
              {CANDIDATE_REGIONS.map((region) => {
                const isSelected = selectedRegion?.id === region.id;
                return (
                  <g
                    key={region.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRegion(region);
                    }}
                  >
                    {/* Target Reticle Indicator */}
                    <circle
                      cx={region.mapX}
                      cy={region.mapY}
                      r={region.radius}
                      fill="none"
                      stroke={isSelected ? '#00D9FF' : 'rgba(0, 217, 255, 0.35)'}
                      strokeWidth={isSelected ? '2' : '1'}
                      strokeDasharray={isSelected ? 'none' : '4 3'}
                      filter={isSelected ? 'url(#cyanGlowEffect)' : undefined}
                    />

                    {/* Reticle Tick marks */}
                    <line
                      x1={region.mapX - region.radius - 4}
                      y1={region.mapY}
                      x2={region.mapX - region.radius + 4}
                      y2={region.mapY}
                      stroke={isSelected ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
                      strokeWidth="1.5"
                    />
                    <line
                      x1={region.mapX + region.radius - 4}
                      y1={region.mapY}
                      x2={region.mapX + region.radius + 4}
                      y2={region.mapY}
                      stroke={isSelected ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
                      strokeWidth="1.5"
                    />
                    <line
                      x1={region.mapX}
                      y1={region.mapY - region.radius - 4}
                      x2={region.mapX}
                      y2={region.mapY - region.radius + 4}
                      stroke={isSelected ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
                      strokeWidth="1.5"
                    />
                    <line
                      x1={region.mapX}
                      y1={region.mapY + region.radius - 4}
                      x2={region.mapX}
                      y2={region.mapY + region.radius + 4}
                      stroke={isSelected ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
                      strokeWidth="1.5"
                    />

                    {/* Center Target Dot */}
                    <circle
                      cx={region.mapX}
                      cy={region.mapY}
                      r="3"
                      fill={isSelected ? '#00D9FF' : 'rgba(0, 217, 255, 0.6)'}
                    />

                    {/* Callout Label Tag */}
                    <g transform={`translate(${region.mapX}, ${region.mapY - region.radius - 12})`}>
                      <rect
                        x="-75"
                        y="-10"
                        width="150"
                        height="18"
                        fill="rgba(10, 14, 20, 0.92)"
                        stroke={isSelected ? '#00D9FF' : '#1C2E42'}
                        strokeWidth="1"
                        rx="2"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill={isSelected ? '#00D9FF' : '#8B98A5'}
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {region.designation} // {region.priorIceProbability} ICE
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* South Pole True Axis Pin (90.00° S) */}
          <g transform="translate(400, 400)">
            <circle cx="0" cy="0" r="1.5" fill="#FFB020" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#FFB020" strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#FFB020" strokeWidth="0.8" opacity="0.6" />
            <text x="0" y="14" fill="#FFB020" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">
              LUNAR S-POLE [90.00° S]
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Live Cursor Telemetry Strip Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="mission-panel px-3 py-1.5 flex items-center gap-4 text-xs font-mono pointer-events-auto bg-[#0A0E14]/95 border-panel">
          <div className="flex items-center gap-1.5 text-secondary">
            <Navigation className="w-3.5 h-3.5 text-cyan" />
            <span>CURSOR:</span>
            <span className="text-cyan font-bold">{cursorTelemetry.lat}</span>
            <span className="text-cyan font-bold">{cursorTelemetry.lon}</span>
          </div>
          <span className="text-dim">|</span>
          <div className="flex items-center gap-1.5 text-secondary">
            <span>ELEV:</span>
            <span className="text-primary">{cursorTelemetry.elev}</span>
          </div>
          <span className="text-dim">|</span>
          <div className="flex items-center gap-1.5 text-secondary">
            <span>TEMP:</span>
            <span className="text-primary">{cursorTelemetry.temp}</span>
          </div>
          <span className="text-dim">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-secondary">ZONE:</span>
            {cursorTelemetry.inPSR ? (
              <span className="text-cyan font-semibold">PERMANENT SHADOW (PSR)</span>
            ) : (
              <span className="text-amber">PARTIAL ILLUMINATED RIM</span>
            )}
          </div>
        </div>

        {/* Selected Region Quick Pill */}
        <div className="mission-panel px-3 py-1.5 flex items-center gap-2 text-xs font-mono pointer-events-auto bg-[#0A0E14]/95">
          <Target className="w-3.5 h-3.5 text-green" />
          <span className="text-secondary">ACTIVE TARGET:</span>
          <span className="text-green font-bold">{selectedRegion.name}</span>
        </div>
      </div>
    </div>
  );
}
