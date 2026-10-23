import React from 'react';
import { ROVER_MISSION_DATA } from '../../data/missionData';

export default function LandingZoneLayer({ waypoints = ROVER_MISSION_DATA.waypoints }) {
  const wp1 = waypoints && waypoints.length > 0 ? waypoints[0] : { x: 399.78, y: 374.34 };
  const lzX = wp1.x;
  const lzY = wp1.y;

  return (
    <g id="landing-zone-overlay">
      {/* Site A Recommended Landing Zone Ellipse */}
      <g transform={`translate(${lzX}, ${lzY}) rotate(-32)`}>
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
        <line
          x1="-32"
          y1="0"
          x2="32"
          y2="0"
          stroke="rgba(0, 230, 118, 0.5)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <line
          x1="0"
          y1="-18"
          x2="0"
          y2="18"
          stroke="rgba(0, 230, 118, 0.5)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
      </g>

      {/* Label for Landing Site */}
      <rect
        x={lzX - 78}
        y={lzY - 37}
        width="156"
        height="18"
        fill="rgba(17, 24, 35, 0.85)"
        stroke="#00E676"
        strokeWidth="0.8"
        rx="2"
      />
      <text
        x={lzX}
        y={lzY - 24}
        textAnchor="middle"
        fill="#00E676"
        fontSize="11"
        fontFamily="var(--font-mono)"
        fontWeight="bold"
      >
        ★ SITE A: LZ CONFIRMED (89.3%)
      </text>
    </g>
  );
}
