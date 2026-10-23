import React from 'react';

export default function CprLayer({ regions = [] }) {
  const shackleton = regions.find((r) => r.id === 'shackleton-a') || { mapX: 400, mapY: 388.33 };

  return (
    <g id="dfsar-cpr-layer">
      {/* Shackleton Floor High-CPR Patch */}
      <ellipse
        cx={shackleton.mapX + 2}
        cy={shackleton.mapY + 5}
        rx="19"
        ry="18"
        fill="url(#iceCprGlow)"
        filter="url(#greenGlowEffect)"
        opacity="0.85"
      />
      {/* Small radar scatterers */}
      <circle cx={shackleton.mapX - 4} cy={shackleton.mapY - 2} r="4" fill="#00E676" opacity="0.8" />
      <circle cx={shackleton.mapX + 6} cy={shackleton.mapY + 8} r="5" fill="#00D9FF" opacity="0.75" />
      <circle cx={shackleton.mapX + 10} cy={shackleton.mapY + 1} r="3.5" fill="#00E676" opacity="0.85" />
    </g>
  );
}
