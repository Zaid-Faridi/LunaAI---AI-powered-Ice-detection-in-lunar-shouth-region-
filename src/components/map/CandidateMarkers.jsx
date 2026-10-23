import React, { useState } from 'react';

export default function CandidateMarkers({
  regions = [],
  selectedRegion,
  onSelectRegion,
}) {
  const [focusedRegionId, setFocusedRegionId] = useState(null);

  return (
    <g id="candidate-regions">
      {regions.map((region) => {
        const isSelected = selectedRegion?.id === region.id;
        const isFocused = focusedRegionId === region.id;

        const handleSelect = (e) => {
          e.stopPropagation();
          if (onSelectRegion) onSelectRegion(region);
        };

        const handleKeyDown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            if (onSelectRegion) onSelectRegion(region);
          }
        };

        return (
          <g
            key={region.id}
            role="button"
            tabIndex={0}
            aria-label={`${region.name}, ice probability ${region.priorIceProbability}`}
            className="cursor-pointer outline-none focus:outline-none"
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocusedRegionId(region.id)}
            onBlur={() => setFocusedRegionId(null)}
          >
            {/* Keyboard Focus Ring */}
            {isFocused && (
              <circle
                cx={region.mapX}
                cy={region.mapY}
                r={region.radius + 8}
                fill="none"
                stroke="#00D9FF"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="pulse-cyan"
              />
            )}

            {/* Target Reticle Indicator */}
            <circle
              cx={region.mapX}
              cy={region.mapY}
              r={region.radius}
              fill="none"
              stroke={isSelected || isFocused ? '#00D9FF' : 'rgba(0, 217, 255, 0.35)'}
              strokeWidth={isSelected || isFocused ? '2' : '1'}
              strokeDasharray={isSelected ? 'none' : '4 3'}
              filter={isSelected || isFocused ? 'url(#cyanGlowEffect)' : undefined}
            />

            {/* Reticle Tick marks */}
            <line
              x1={region.mapX - region.radius - 4}
              y1={region.mapY}
              x2={region.mapX - region.radius + 4}
              y2={region.mapY}
              stroke={isSelected || isFocused ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
              strokeWidth="1.5"
            />
            <line
              x1={region.mapX + region.radius - 4}
              y1={region.mapY}
              x2={region.mapX + region.radius + 4}
              y2={region.mapY}
              stroke={isSelected || isFocused ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
              strokeWidth="1.5"
            />
            <line
              x1={region.mapX}
              y1={region.mapY - region.radius - 4}
              x2={region.mapX}
              y2={region.mapY - region.radius + 4}
              stroke={isSelected || isFocused ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
              strokeWidth="1.5"
            />
            <line
              x1={region.mapX}
              y1={region.mapY + region.radius - 4}
              x2={region.mapX}
              y2={region.mapY + region.radius + 4}
              stroke={isSelected || isFocused ? '#00D9FF' : 'rgba(0, 217, 255, 0.5)'}
              strokeWidth="1.5"
            />

            {/* Center Target Dot */}
            <circle
              cx={region.mapX}
              cy={region.mapY}
              r="3"
              fill={isSelected || isFocused ? '#00D9FF' : 'rgba(0, 217, 255, 0.6)'}
            />

            {/* Callout Label Tag */}
            <g transform={`translate(${region.mapX}, ${region.mapY - region.radius - 12})`}>
              <rect
                x="-80"
                y="-10"
                width="160"
                height="20"
                fill="rgba(10, 14, 20, 0.92)"
                stroke={isSelected || isFocused ? '#00D9FF' : '#1C2E42'}
                strokeWidth="1"
                rx="2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill={isSelected || isFocused ? '#00D9FF' : '#8B98A5'}
                fontSize="11"
                fontFamily="var(--font-mono)"
                fontWeight={isSelected || isFocused ? 'bold' : 'normal'}
              >
                {region.designation} // {region.priorIceProbability} ICE
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
