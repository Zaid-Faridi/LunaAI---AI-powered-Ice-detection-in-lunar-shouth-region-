import React from 'react';

export default function RoverRouteLayer({ waypoints = [], roverPlaybackIndex = null }) {
  if (!waypoints || waypoints.length === 0) return null;

  const pathD = waypoints.map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`).join(' ');

  return (
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
              y="4"
              fill={isTargetSample ? "#00E676" : "#E6EDF3"}
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="bold"
            >
              {`WP${wp.id}`}
            </text>
          </g>
        );
      })}

      {/* Moving Rover Token if simulating */}
      {roverPlaybackIndex !== null && waypoints[roverPlaybackIndex] && (
        <g transform={`translate(${waypoints[roverPlaybackIndex].x}, ${waypoints[roverPlaybackIndex].y})`}>
          <circle cx="0" cy="0" r="14" fill="rgba(0, 217, 255, 0.25)" className="pulse-cyan" />
          <rect x="-4" y="-4" width="8" height="8" fill="#00D9FF" transform="rotate(45)" />
          <text
            x="0"
            y="-10"
            fill="#00D9FF"
            fontSize="11"
            fontFamily="var(--font-mono)"
            textAnchor="middle"
            fontWeight="bold"
          >
            ROVER-1
          </text>
        </g>
      )}
    </g>
  );
}
