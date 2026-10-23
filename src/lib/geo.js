// South Polar Stereographic Projection for Lunar South Pole (87°S – 90°S)
// Center of projection: South Pole (90.00° S) at (POLE_X, POLE_Y) = (400, 400)
// Reference ring: 87.00° S is at radius 350 px
// Scale: 350 px / 3.0° = 116.66666666666667 px per degree of latitude from pole
// Longitude convention: 0.00° Prime Meridian at top (-Y), East to the right (+X), 180° at bottom (+Y), 90°W to the left (-X)

export const POLE_X = 400;
export const POLE_Y = 400;
export const SCALE_PX_PER_DEG = 350 / 3; // 116.66666666666667 px/deg

/**
 * Converts South Lunar latitude and longitude to map SVG (x, y) coordinates.
 * @param {number} latDeg - Latitude in degrees (e.g. -89.90 or 89.90 for South)
 * @param {number} lonDeg - Longitude in degrees (-180 to +180 or 0 to 360, +East, -West)
 * @returns {{ x: number, y: number }}
 */
export function latLonToXY(latDeg, lonDeg) {
  const degFromPole = 90.0 - Math.abs(latDeg);
  const r = degFromPole * SCALE_PX_PER_DEG;
  const thetaRad = (lonDeg * Math.PI) / 180;

  const x = POLE_X + r * Math.sin(thetaRad);
  const y = POLE_Y - r * Math.cos(thetaRad);

  return { x, y };
}

/**
 * Converts map SVG (x, y) coordinates to South Lunar latitude and longitude.
 * @param {number} x - Map X coordinate
 * @param {number} y - Map Y coordinate
 * @returns {{ latDeg: number, lonDeg: number, latStr: string, lonStr: string, lat: number, lon: number }}
 */
export function xyToLatLon(x, y) {
  const dx = x - POLE_X;
  const dy = y - POLE_Y;
  const r = Math.hypot(dx, dy);

  const degFromPole = r / SCALE_PX_PER_DEG;
  const latMagnitude = 90.0 - degFromPole;
  const latDeg = -latMagnitude;

  // 0° is North (top, -dy > 0), 90° is East (right, dx > 0)
  let lonDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;

  if (lonDeg > 180) lonDeg -= 360;
  if (lonDeg <= -180) lonDeg += 360;

  const latStr = `${Math.abs(latMagnitude).toFixed(2)}° S`;
  let lonStr = "";
  if (Math.abs(lonDeg) < 0.005) {
    lonStr = "0.00° E";
  } else if (Math.abs(Math.abs(lonDeg) - 180) < 0.005) {
    lonStr = "180.00°";
  } else if (lonDeg > 0) {
    lonStr = `${lonDeg.toFixed(2)}° E`;
  } else {
    lonStr = `${Math.abs(lonDeg).toFixed(2)}° W`;
  }

  return {
    latDeg,
    lonDeg,
    lat: latDeg,
    lon: lonDeg,
    latStr,
    lonStr,
  };
}
