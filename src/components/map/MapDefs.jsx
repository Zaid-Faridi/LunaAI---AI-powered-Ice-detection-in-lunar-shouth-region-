import React from 'react';

export default function MapDefs() {
  return (
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
  );
}
