import React from 'react';

export default function TerrainLayer({ regions = [], activeLayers = {} }) {
  const shackleton = regions.find((r) => r.id === 'shackleton-a') || { mapX: 400, mapY: 388.33, radius: 45 };
  const faustini = regions.find((r) => r.id === 'faustini-b') || { mapX: 706.93, mapY: 329.14, radius: 38 };
  const shoemaker = regions.find((r) => r.id === 'shoemaker-c') || { mapX: 557.83, mapY: 244.36, radius: 42 };
  const haworth = regions.find((r) => r.id === 'haworth-d') || { mapX: 373.04, mapY: 97.87, radius: 40 };

  return (
    <g id="lunar-craters">
      {/* 1. Surrounding Topographic Uplifts & High Ridges (DEM Elevation Layer) */}
      {activeLayers.terrain && (
        <g id="dem-topography">
          {/* Malapert Mountain Uplift */}
          <ellipse
            cx="250"
            cy="220"
            rx="60"
            ry="35"
            transform="rotate(-30 250 220)"
            fill="#141E2B"
            stroke="#25384E"
            strokeWidth="1.5"
          />
          <path
            d="M 220 200 Q 250 180 290 220"
            stroke="#3A5370"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <text
            x="250"
            y="210"
            fill="#7E91A6"
            fontSize="11"
            fontFamily="var(--font-mono)"
            textAnchor="middle"
          >
            MALAPERT MASSIF
          </text>

          {/* Nobile Crater */}
          <circle cx="580" cy="520" r="55" fill="#0C1520" stroke="#1F2F43" strokeWidth="1.5" />
          <circle cx="580" cy="520" r="45" fill="#080D15" />
          <text
            x="580"
            y="525"
            fill="#7E91A6"
            fontSize="11"
            fontFamily="var(--font-mono)"
            textAnchor="middle"
          >
            NOBILE
          </text>

          {/* Amundsen Crater Rim (edge) */}
          <circle cx="680" cy="280" r="65" fill="#0A111A" stroke="#1A2839" strokeWidth="1" />
          <text
            x="680"
            y="285"
            fill="#7E91A6"
            fontSize="11"
            fontFamily="var(--font-mono)"
            textAnchor="middle"
          >
            AMUNDSEN
          </text>
        </g>
      )}

      {/* 2. Candidate Craters (Independent of DEM toggle) */}
      {/* Shoemaker Crater (Candidate C) */}
      <circle
        cx={shoemaker.mapX}
        cy={shoemaker.mapY}
        r={shoemaker.radius}
        fill="url(#shoemakerShading)"
        stroke="#23354C"
        strokeWidth="1.5"
      />
      <path
        d={`M ${shoemaker.mapX - 30} ${shoemaker.mapY - 15} Q ${shoemaker.mapX + 5} ${shoemaker.mapY - 35} ${shoemaker.mapX + 35} ${shoemaker.mapY - 5}`}
        stroke="#3F5A7B"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      {/* Faustini Crater (Candidate B) */}
      <circle
        cx={faustini.mapX}
        cy={faustini.mapY}
        r={faustini.radius}
        fill="url(#faustiniShading)"
        stroke="#22354B"
        strokeWidth="1.5"
      />
      <path
        d={`M ${faustini.mapX - 25} ${faustini.mapY - 15} Q ${faustini.mapX + 5} ${faustini.mapY - 30} ${faustini.mapX + 30} ${faustini.mapY - 5}`}
        stroke="#3E5978"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      {/* Haworth Crater (Candidate D) */}
      <circle
        cx={haworth.mapX}
        cy={haworth.mapY}
        r={haworth.radius}
        fill="url(#haworthShading)"
        stroke="#213348"
        strokeWidth="1.5"
      />
      <path
        d={`M ${haworth.mapX - 30} ${haworth.mapY - 15} Q ${haworth.mapX} ${haworth.mapY - 30} ${haworth.mapX + 30} ${haworth.mapY - 5}`}
        stroke="#3D5876"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      {/* Connecting Ridge between Shackleton and de Gerlache */}
      <path
        d={`M ${shackleton.mapX - 40} ${shackleton.mapY - 28} C ${shackleton.mapX - 25} ${shackleton.mapY - 38}, ${shackleton.mapX - 5} ${shackleton.mapY - 23}, ${shackleton.mapX} ${shackleton.mapY - 13}`}
        stroke="#4C6C92"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* SHACKLETON CRATER (Hero Feature - exactly at South Pole 89.90°S) */}
      <circle
        cx={shackleton.mapX}
        cy={shackleton.mapY}
        r={shackleton.radius + 1}
        fill="url(#shackletonShading)"
        stroke="#3E597A"
        strokeWidth="2.5"
      />

      {/* Sunlit Connecting Ridge Rim Crest (High solar incidence ~86%) - SOLAR Toggle */}
      {activeLayers.illumination && (
        <path
          d={`M ${shackleton.mapX - 35} ${shackleton.mapY - 20} C ${shackleton.mapX - 25} ${shackleton.mapY - 40}, ${shackleton.mapX + 20} ${shackleton.mapY - 38}, ${shackleton.mapX + 35} ${shackleton.mapY - 20}`}
          stroke="#FFB020"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      )}

      {/* Permanent Shadow Region (PSR) Deep Floor (<0.3% illumination) - PSR Toggle */}
      {activeLayers.psr && (
        <ellipse
          cx={shackleton.mapX + 2}
          cy={shackleton.mapY + 4}
          rx="34"
          ry="32"
          fill="#020406"
          stroke="rgba(0, 217, 255, 0.4)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}
    </g>
  );
}
