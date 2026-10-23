import { describe, it, expect } from 'vitest';
import {
  iceVolume,
  waterMass,
  uncertaintyRange,
  routeDistanceKm,
  routeTimeHours,
  compositeScore,
} from './calc.js';

describe('src/lib/calc.js scientific calculations', () => {
  describe('iceVolume', () => {
    it('calculates ice volume correctly for decimal fraction', () => {
      // 8.70 km² = 8.70e6 m², 4.5 m ice thickness, 0.047 (4.7%)
      const vol = iceVolume(8.70e6, 4.5, 0.047);
      expect(vol).toBeCloseTo(1840050, 0);
      expect(vol / 1e6).toBeCloseTo(1.84, 2);
    });

    it('calculates ice volume correctly when fraction is given as percentage (>1)', () => {
      const vol = iceVolume(8.70e6, 4.5, 4.7);
      expect(vol).toBeCloseTo(1840050, 0);
      expect(vol / 1e6).toBeCloseTo(1.84, 2);
    });

    it('returns 0 for negative or zero inputs', () => {
      expect(iceVolume(0, 5, 0.047)).toBe(0);
      expect(iceVolume(8.7e6, 0, 0.047)).toBe(0);
      expect(iceVolume(8.7e6, 5, 0)).toBe(0);
      expect(iceVolume(-100, 5, 0.047)).toBe(0);
    });
  });

  describe('waterMass', () => {
    it('calculates water mass with default cryogenic ice density (920 kg/m³)', () => {
      const vol = 1.84e6;
      const mass = waterMass(vol, 920);
      expect(mass).toBeCloseTo(1.6928e9, -4);
      expect(mass / 1e9).toBeCloseTo(1.69, 2);
    });

    it('handles custom density and zero volume', () => {
      expect(waterMass(1000, 1000)).toBe(1000000);
      expect(waterMass(0, 920)).toBe(0);
      expect(waterMass(100, -10)).toBe(0);
    });
  });

  describe('uncertaintyRange', () => {
    it('calculates ±30% bounds correctly for decimal 0.30', () => {
      const { min, max } = uncertaintyRange(1.84e6, 0.30);
      expect(min).toBeCloseTo(1.288e6, -2);
      expect(max).toBeCloseTo(2.392e6, -2);
      expect(min / 1e6).toBeCloseTo(1.29, 2);
      expect(max / 1e6).toBeCloseTo(2.39, 2);
    });

    it('supports percentage input (30 instead of 0.30)', () => {
      const { min, max } = uncertaintyRange(1.69e9, 30);
      expect(min / 1e9).toBeCloseTo(1.18, 2);
      expect(max / 1e9).toBeCloseTo(2.20, 2);
    });

    it('ensures min does not drop below 0', () => {
      const { min } = uncertaintyRange(100, 150);
      expect(min).toBe(0);
    });
  });

  describe('routeDistanceKm', () => {
    it('computes Euclidean route distance along waypoints sequence', () => {
      const waypoints = [
        { x: 0, y: 0 },
        { x: 3, y: 4 }, // dist = 5
        { x: 3, y: 16 }, // dist = 12
      ];
      // Total units = 5 + 12 = 17
      const kmPerUnit = 0.1;
      expect(routeDistanceKm(waypoints, kmPerUnit)).toBeCloseTo(1.7, 4);
    });

    it('computes canonical rover route distance as ~2.84 km with scale 0.0216', () => {
      const waypoints = [
        { x: 375, y: 360 },
        { x: 382, y: 375 },
        { x: 390, y: 390 },
        { x: 396, y: 405 },
        { x: 402, y: 415 },
        { x: 412, y: 410 },
        { x: 400, y: 380 },
        { x: 378, y: 365 },
      ];
      const dist = routeDistanceKm(waypoints, 0.0216);
      expect(dist).toBeCloseTo(2.84, 2);
    });

    it('returns 0 for empty or single waypoint', () => {
      expect(routeDistanceKm([], 0.0216)).toBe(0);
      expect(routeDistanceKm([{ x: 1, y: 1 }], 0.0216)).toBe(0);
    });
  });

  describe('routeTimeHours', () => {
    it('calculates duration in hours at 0.5 km/h cruise speed', () => {
      const hours = routeTimeHours(2.84, 0.5);
      expect(hours).toBeCloseTo(5.68, 2);
      expect(hours.toFixed(1)).toBe('5.7');
    });

    it('returns 0 for zero or invalid velocity', () => {
      expect(routeTimeHours(10, 0)).toBe(0);
      expect(routeTimeHours(0, 0.5)).toBe(0);
    });
  });

  describe('compositeScore', () => {
    it('computes weighted composite score from criteria factors', () => {
      const factors = [
        { factor: "Ice potential", score: 92, weight: 30 },
        { factor: "Terrain safety", score: 88, weight: 20 },
        { factor: "Communication", score: 95, weight: 20 },
        { factor: "Illumination", score: 76, weight: 15 },
        { factor: "Rover accessibility", score: 91, weight: 15 },
      ];
      const score = compositeScore(factors);
      expect(score).toBeCloseTo(89.25, 2);
      expect(score.toFixed(1)).toBe('89.3');
    });

    it('returns 0 for empty factors array', () => {
      expect(compositeScore([])).toBe(0);
    });
  });
});
