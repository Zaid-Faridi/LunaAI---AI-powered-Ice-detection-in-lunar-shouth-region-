import React from 'react';

export default function ThermalLayer({ regions = [] }) {
  const shackleton = regions.find((r) => r.id === 'shackleton-a') || { mapX: 400, mapY: 388.33 };
  const faustini = regions.find((r) => r.id === 'faustini-b') || { mapX: 706.93, mapY: 329.14 };
  const shoemaker = regions.find((r) => r.id === 'shoemaker-c') || { mapX: 557.83, mapY: 244.36 };

  return (
    <g id="diviner-thermal-layer">
      {/* Cold trap overlay inside Shackleton floor (~38K) */}
      <ellipse
        cx={shackleton.mapX + 2}
        cy={shackleton.mapY + 4}
        rx="30"
        ry="28"
        fill="url(#cryoColdTrap)"
        opacity="0.75"
      />
      {/* Faustini Cold trap (~48K) */}
      <ellipse
        cx={faustini.mapX}
        cy={faustini.mapY}
        rx="22"
        ry="20"
        fill="url(#cryoColdTrap)"
        opacity="0.45"
      />
      {/* Shoemaker Cold trap (~42K) */}
      <ellipse
        cx={shoemaker.mapX}
        cy={shoemaker.mapY}
        rx="25"
        ry="24"
        fill="url(#cryoColdTrap)"
        opacity="0.55"
      />
    </g>
  );
}
