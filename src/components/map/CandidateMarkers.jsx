import React from 'react';

export default function CandidateMarkers({
  regions = [],
  selectedRegion,
  onSelectRegion,
}) {
  return (
    <g id="candidate-regions">
      {regions.map((region) => {
        const isSelected = selectedRegion?.id === region.id;
        return (
          <g
            key={region.id}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectRegion) onSelectRegion(region);
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
  );
}
