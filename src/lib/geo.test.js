import { describe, it, expect } from 'vitest';
import {
  POLE_X,
  POLE_Y,
  SCALE_PX_PER_DEG,
  latLonToXY,
  xyToLatLon,
} from './geo.js';

describe('src/lib/geo.js polar stereographic projection', () => {
  it('exports expected constants', () => {
    expect(POLE_X).toBe(400);
    expect(POLE_Y).toBe(400);
    expect(SCALE_PX_PER_DEG).toBeCloseTo(116.6667, 3);
  });

  it('projects 87.0°S onto radius 350px', () => {
    const { x, y } = latLonToXY(-87.0, 0);
    expect(x).toBeCloseTo(400, 2);
    expect(y).toBeCloseTo(50, 2); // 400 - 350 = 50
    const r = Math.hypot(x - POLE_X, y - POLE_Y);
    expect(r).toBeCloseTo(350, 2);
  });

  it('maps longitude conventions: 0° top, 90°E right, 180° bottom, 90°W left', () => {
    const r = 100;
    const lat = -(90.0 - r / SCALE_PX_PER_DEG);

    // 0° Prime Meridian -> top
    const top = latLonToXY(lat, 0);
    expect(top.x).toBeCloseTo(400, 2);
    expect(top.y).toBeCloseTo(300, 2);
    expect(xyToLatLon(top.x, top.y).lonStr).toBe('0.00° E');

    // 90° E -> right
    const right = latLonToXY(lat, 90);
    expect(right.x).toBeCloseTo(500, 2);
    expect(right.y).toBeCloseTo(400, 2);
    expect(xyToLatLon(right.x, right.y).lonStr).toBe('90.00° E');

    // 180° -> bottom
    const bottom = latLonToXY(lat, 180);
    expect(bottom.x).toBeCloseTo(400, 2);
    expect(bottom.y).toBeCloseTo(500, 2);
    expect(xyToLatLon(bottom.x, bottom.y).lonStr).toBe('180.00°');

    // 90° W (-90°) -> left
    const left = latLonToXY(lat, -90);
    expect(left.x).toBeCloseTo(300, 2);
    expect(left.y).toBeCloseTo(400, 2);
    expect(xyToLatLon(left.x, left.y).lonStr).toBe('90.00° W');
  });

  it('performs exact roundtrip conversions for all four candidate regions', () => {
    const candidates = [
      { name: 'Shackleton', lat: -89.90, lon: 0.00, statedLat: '89.90° S', statedLon: '0.00° E' },
      { name: 'Faustini', lat: -87.30, lon: 77.00, statedLat: '87.30° S', statedLon: '77.00° E' },
      { name: 'Shoemaker', lat: -88.10, lon: 45.40, statedLat: '88.10° S', statedLon: '45.40° E' },
      { name: 'Haworth', lat: -87.40, lon: -5.10, statedLat: '87.40° S', statedLon: '5.10° W' },
    ];

    for (const c of candidates) {
      const { x, y } = latLonToXY(c.lat, c.lon);
      const converted = xyToLatLon(x, y);

      expect(converted.latDeg).toBeCloseTo(c.lat, 2);
      expect(converted.lonDeg).toBeCloseTo(c.lon, 2);
      expect(converted.latStr).toBe(c.statedLat);
      expect(converted.lonStr).toBe(c.statedLon);
    }
  });

  it('handles positive latitude input as south latitude magnitude', () => {
    const pt1 = latLonToXY(-88.5, 30);
    const pt2 = latLonToXY(88.5, 30);
    expect(pt1.x).toBeCloseTo(pt2.x, 4);
    expect(pt1.y).toBeCloseTo(pt2.y, 4);
  });
});
