/**
 * Scientific calculation utilities for LunarPath AI
 */

/**
 * Calculates volumetric ice yield within the active regolith layer.
 * @param {number} areaM2 - Analysis surface area in m²
 * @param {number} depthM - Active ice-bearing thickness in meters (excluding dry lag)
 * @param {number} fraction - Volumetric ice concentration (either decimal e.g. 0.047 or percentage e.g. 4.7)
 * @returns {number} Ice volume in m³
 */
export function iceVolume(areaM2, depthM, fraction) {
  if (areaM2 <= 0 || depthM <= 0 || fraction <= 0) return 0;
  // Support both 0.047 and 4.7 (if > 1, treat as percentage)
  const normalizedFraction = fraction > 1 ? fraction / 100 : fraction;
  return areaM2 * depthM * normalizedFraction;
}

/**
 * Calculates water-equivalent mass from ice volume using cryogenic solid ice density.
 * @param {number} volume - Ice volume in m³
 * @param {number} [density=920] - Ice density in kg/m³ (default: 920 kg/m³ at ~38K cryogenic hex ice)
 * @returns {number} Water-equivalent mass in kg
 */
export function waterMass(volume, density = 920) {
  if (volume <= 0 || density <= 0) return 0;
  return volume * density;
}

/**
 * Calculates lower and upper uncertainty bounds for a given value.
 * @param {number} value - Nominal value
 * @param {number} [pct=0.30] - Uncertainty fraction or percentage (e.g. 0.30 or 30 for ±30%)
 * @returns {{ min: number, max: number }} Range with min and max bounds
 */
export function uncertaintyRange(value, pct = 0.30) {
  const normalizedPct = pct > 1 ? pct / 100 : pct;
  const delta = value * normalizedPct;
  return {
    min: Math.max(0, value - delta),
    max: value + delta,
  };
}

/**
 * Calculates total route distance along a sequence of 2D waypoints.
 * @param {Array<{ x: number, y: number }>} waypoints - Ordered array of waypoints
 * @param {number} kmPerUnit - Scale factor converting coordinate units (pixels) to kilometers
 * @returns {number} Total distance in kilometers
 */
export function routeDistanceKm(waypoints, kmPerUnit) {
  if (!Array.isArray(waypoints) || waypoints.length < 2 || !kmPerUnit || kmPerUnit <= 0) {
    return 0;
  }
  let totalUnits = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    totalUnits += Math.hypot(dx, dy);
  }
  return totalUnits * kmPerUnit;
}

/**
 * Calculates rover transit time given distance and average velocity.
 * @param {number} distanceKm - Total traversal distance in km
 * @param {number} speedKmh - Cruise speed in km/h
 * @returns {number} Estimated duration in hours
 */
export function routeTimeHours(distanceKm, speedKmh) {
  if (distanceKm <= 0 || speedKmh <= 0) return 0;
  return distanceKm / speedKmh;
}

/**
 * Computes composite suitability score from weighted criteria factors.
 * @param {Array<{ score: number, weight: number }>} factors - Criteria factors with individual scores and weights
 * @returns {number} Weighted composite score (0-100)
 */
export function compositeScore(factors) {
  if (!Array.isArray(factors) || factors.length === 0) return 0;
  const totalWeight = factors.reduce((sum, f) => sum + (f.weight || 0), 0);
  if (totalWeight <= 0) return 0;
  const weightedSum = factors.reduce((sum, f) => sum + ((f.score || 0) * (f.weight || 0)), 0);
  return weightedSum / totalWeight;
}
