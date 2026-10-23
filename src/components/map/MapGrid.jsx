import React from 'react';
import { POLE_X, POLE_Y } from '../../lib/geo';

export default function MapGrid() {
  return (
    <g id="map-grid">
      {/* 1. Deep Space / Lunar Basemap Background */}
      <rect width="800" height="800" fill="url(#spaceBackdrop)" />

      {/* 2. Thin 1px Cyan Grid Behind the Map */}
      <rect width="800" height="800" fill="url(#cyanGrid)" />

      {/* 3. Polar Stereographic Concentric Coordinate Grid */}
      <g stroke="rgba(0, 217, 255, 0.12)" strokeWidth="1" fill="none">
        {/* Concentric Latitude Rings */}
        <circle cx={POLE_X} cy={POLE_Y} r="350" strokeDasharray="3 4" />
        <circle cx={POLE_X} cy={POLE_Y} r="233" strokeDasharray="3 4" />
        <circle cx={POLE_X} cy={POLE_Y} r="116" strokeDasharray="3 4" />
        <circle cx={POLE_X} cy={POLE_Y} r="58" stroke="rgba(0, 217, 255, 0.2)" />

        {/* Radial Meridians */}
        <line x1={POLE_X} y1="50" x2={POLE_X} y2="750" />
        <line x1="50" y1={POLE_Y} x2="750" y2={POLE_Y} />
        <line x1="152" y1="152" x2="648" y2="648" strokeDasharray="2 4" stroke="rgba(0, 217, 255, 0.08)" />
        <line x1="152" y1="648" x2="648" y2="152" strokeDasharray="2 4" stroke="rgba(0, 217, 255, 0.08)" />
      </g>

      {/* Degree Marks on Rings */}
      <g fill="rgba(0, 217, 255, 0.45)" fontSize="11" fontFamily="var(--font-mono)">
        <text x="408" y="75" textAnchor="start">87.0° S</text>
        <text x="408" y="190" textAnchor="start">88.0° S</text>
        <text x="408" y="305" textAnchor="start">89.0° S</text>
        <text x="408" y="358" textAnchor="start">89.5° S</text>

        <text x="400" y="42" textAnchor="middle">0.00° PRIME MERIDIAN</text>
        <text x="765" y="403" textAnchor="start">90.0° E</text>
        <text x="400" y="775" textAnchor="middle">180.0°</text>
        <text x="35" y="403" textAnchor="end">90.0° W</text>
      </g>

      {/* South Pole True Axis Pin (90.00° S) */}
      <g transform={`translate(${POLE_X}, ${POLE_Y})`}>
        <circle cx="0" cy="0" r="1.5" fill="#FFB020" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#FFB020" strokeWidth="0.8" opacity="0.6" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#FFB020" strokeWidth="0.8" opacity="0.6" />
        <text x="0" y="15" fill="#FFB020" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle">
          LUNAR S-POLE [90.00° S]
        </text>
      </g>
    </g>
  );
}
