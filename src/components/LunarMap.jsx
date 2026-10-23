import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Target, Navigation } from 'lucide-react';
import { CANDIDATE_REGIONS, ROVER_MISSION_DATA } from '../data/missionData';
import { xyToLatLon } from '../lib/geo';
import MapDefs from './map/MapDefs';
import MapGrid from './map/MapGrid';
import MapControls from './map/MapControls';
import TerrainLayer from './map/TerrainLayer';
import ThermalLayer from './map/ThermalLayer';
import CprLayer from './map/CprLayer';
import LandingZoneLayer from './map/LandingZoneLayer';
import RoverRouteLayer from './map/RoverRouteLayer';
import CandidateMarkers from './map/CandidateMarkers';

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
    elev: "-4.12 km (interpolated)",
    temp: "~38 K (interpolated)",
    inPSR: true,
  });

  const svgRef = useRef(null);
  const viewportGroupRef = useRef(null);
  const mapContainerRef = useRef(null);
  const pointersRef = useRef(new Map());
  const pinchStartRef = useRef(null);

  const updateCursorTelemetry = useCallback((clientX, clientY) => {
    if (!svgRef.current || !viewportGroupRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = viewportGroupRef.current.getScreenCTM();
    if (!ctm) return;
    const { x: mapX, y: mapY } = pt.matrixTransform(ctm.inverse());

    const { latStr, lonStr } = xyToLatLon(mapX, mapY);
    const insideRegion = CANDIDATE_REGIONS.find(
      (r) => Math.hypot(mapX - r.mapX, mapY - r.mapY) <= r.radius
    );

    setCursorTelemetry({
      lat: latStr,
      lon: lonStr,
      elev: insideRegion ? `${insideRegion.elevation} (interpolated)` : "—",
      temp: insideRegion ? `${insideRegion.temperature} (interpolated)` : "—",
      inPSR: Boolean(insideRegion),
    });
  }, []);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartRef.current = { dist, midX: (pts[0].x + pts[1].x) / 2, midY: (pts[0].y + pts[1].y) / 2, zoom, pan };
    }
  };

  const handlePointerMove = (e) => {
    updateCursorTelemetry(e.clientX, e.clientY);
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1 && isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (pointersRef.current.size === 2 && pinchStartRef.current && svgRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const newDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const newZoom = Math.min(5, Math.max(0.8, pinchStartRef.current.zoom * (newDist / pinchStartRef.current.dist)));

      const svgCtm = svgRef.current.getScreenCTM();
      if (svgCtm) {
        const pt = svgRef.current.createSVGPoint();
        pt.x = pinchStartRef.current.midX;
        pt.y = pinchStartRef.current.midY;
        const svgP = pt.matrixTransform(svgCtm.inverse());
        const mapX = (svgP.x - pinchStartRef.current.pan.x) / pinchStartRef.current.zoom;
        const mapY = (svgP.y - pinchStartRef.current.pan.y) / pinchStartRef.current.zoom;

        const curPt = svgRef.current.createSVGPoint();
        curPt.x = (pts[0].x + pts[1].x) / 2;
        curPt.y = (pts[0].y + pts[1].y) / 2;
        const curSvgP = curPt.matrixTransform(svgCtm.inverse());

        setZoom(newZoom);
        setPan({ x: curSvgP.x - newZoom * mapX, y: curSvgP.y - newZoom * mapY });
      }
    }
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) {
      setIsDragging(false);
      pinchStartRef.current = null;
    } else if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      setDragStart({ x: remaining.x - pan.x, y: remaining.y - pan.y });
      pinchStartRef.current = null;
    }
  };

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (!svgRef.current || !viewportGroupRef.current) return;
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;

      const ctm = viewportGroupRef.current.getScreenCTM();
      const svgCtm = svgRef.current.getScreenCTM();
      if (!ctm || !svgCtm) return;

      const mapP = pt.matrixTransform(ctm.inverse());
      const svgP = pt.matrixTransform(svgCtm.inverse());
      const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const newZoom = Math.min(5, Math.max(0.8, zoom * zoomFactor));

      setZoom(newZoom);
      setPan({ x: svgP.x - newZoom * mapP.x, y: svgP.y - newZoom * mapP.y });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom]);

  const zoomBy = (factor) => {
    const newZoom = Math.min(5, Math.max(0.8, zoom * factor));
    setZoom(newZoom);
    setPan({ x: 400 - newZoom * ((400 - pan.x) / zoom), y: 400 - newZoom * ((400 - pan.y) / zoom) });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070B10] flex flex-col">
      <MapControls
        zoomBy={zoomBy}
        onResetView={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        activeLayers={activeLayers}
        onToggleLayer={onToggleLayer}
      />

      {/* Main Interactive SVG Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full cursor-crosshair relative overflow-hidden touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg ref={svgRef} viewBox="0 0 800 800" className="w-full h-full block">
          <MapDefs />
          <g
            id="map-viewport"
            ref={viewportGroupRef}
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          >
            <MapGrid />
            <TerrainLayer regions={CANDIDATE_REGIONS} activeLayers={activeLayers} />
            {activeLayers.divinerThermal && <ThermalLayer regions={CANDIDATE_REGIONS} />}
            {activeLayers.radarCpr && <CprLayer regions={CANDIDATE_REGIONS} />}
            {activeLayers.landingZone && <LandingZoneLayer waypoints={ROVER_MISSION_DATA.waypoints} />}
            {(showRoverRoute || activeScreen === 'mission') && (
              <RoverRouteLayer waypoints={ROVER_MISSION_DATA.waypoints} roverPlaybackIndex={roverPlaybackIndex} />
            )}
            {activeLayers.candidates && (
              <CandidateMarkers regions={CANDIDATE_REGIONS} selectedRegion={selectedRegion} onSelectRegion={onSelectRegion} />
            )}
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
              <span className="text-amber">HIGHLAND TERRAIN</span>
            )}
          </div>
        </div>

        {/* Selected Region Quick Pill */}
        <div className="mission-panel px-3 py-1.5 flex items-center gap-2 text-xs font-mono pointer-events-auto bg-[#0A0E14]/95">
          <Target className="w-3.5 h-3.5 text-green" />
          <span className="text-secondary">ACTIVE TARGET:</span>
          <span className="text-green font-bold">{selectedRegion?.name || 'SHACKLETON'}</span>
        </div>
      </div>
    </div>
  );
}
