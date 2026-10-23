// Lunar South Pole Candidate Regions & Polarimetric Ground Truth

import {
  iceVolume,
  waterMass,
  uncertaintyRange,
  routeDistanceKm,
  routeTimeHours,
  compositeScore,
} from '../lib/calc.js';

export const CANDIDATE_REGIONS = [
  {
    id: "shackleton-a",
    name: "Shackleton Crater — Candidate Region A",
    shortName: "Shackleton Crater (Site A)",
    designation: "PSR-SKL-01A",
    latitude: "89.90° S",
    longitude: "0.00° E",
    latNum: -89.90,
    lonNum: 0.00,
    illumination: "0.3%",
    illuminationNote: "Residual scattered light — true PSR floor",
    temperature: "~38 K",
    psrArea: "21.3 km²",
    priorIceProbability: "87.4%",
    elevation: "-4.12 km",
    elevationRelief: "4,120 m rim-to-floor",
    rimIllumination: "86.2% (Connecting Ridge peak)",
    divinerThermalMin: "36.8 K",
    divinerThermalMax: "41.5 K",
    radarBackscatter: "High circular polarization ratio (CPR > 1.4)",
    instrumentHeritage: "Chandrayaan-2 DFSAR + LRO Diviner + LOLA DEM",
    status: "PRIMARY TARGET",
    recommendedLandingZone: true,
    landingZoneName: "Connecting Ridge Site A",
    mapX: 400, // center of stereographic projection
    mapY: 410,
    radius: 45
  },
  {
    id: "faustini-b",
    name: "Faustini Crater — Candidate Region B",
    shortName: "Faustini Crater (Site B)",
    designation: "PSR-FST-02B",
    latitude: "87.30° S",
    longitude: "77.00° E",
    latNum: -87.30,
    lonNum: 77.00,
    illumination: "0.8%",
    illuminationNote: "Deep floor shadow pocket",
    temperature: "~48 K",
    psrArea: "18.6 km²",
    priorIceProbability: "68.2%",
    elevation: "-3.40 km",
    elevationRelief: "3,400 m rim-to-floor",
    rimIllumination: "71.0%",
    divinerThermalMin: "44.2 K",
    divinerThermalMax: "52.0 K",
    radarBackscatter: "Moderate CPR (1.08)",
    instrumentHeritage: "Chandrayaan-2 DFSAR + Diviner",
    status: "SECONDARY TARGET",
    recommendedLandingZone: false,
    landingZoneName: "Faustini Rim Plateau",
    mapX: 520,
    mapY: 340,
    radius: 38
  },
  {
    id: "shoemaker-c",
    name: "Shoemaker Crater — Candidate Region C",
    shortName: "Shoemaker Crater (Site C)",
    designation: "PSR-SMK-03C",
    latitude: "88.10° S",
    longitude: "45.40° E",
    latNum: -88.10,
    lonNum: 45.40,
    illumination: "0.5%",
    illuminationNote: "Partial secondary crater rim shielding",
    temperature: "~42 K",
    psrArea: "34.1 km²",
    priorIceProbability: "74.8%",
    elevation: "-3.75 km",
    elevationRelief: "3,750 m",
    rimIllumination: "74.5%",
    divinerThermalMin: "39.5 K",
    divinerThermalMax: "46.0 K",
    radarBackscatter: "Elevated CPR (1.21)",
    instrumentHeritage: "Chandrayaan-2 DFSAR + Diviner",
    status: "CONTINGENCY TARGET",
    recommendedLandingZone: false,
    landingZoneName: "Shoemaker Northeast Bench",
    mapX: 475,
    mapY: 275,
    radius: 42
  },
  {
    id: "haworth-d",
    name: "Haworth Crater — Candidate Region D",
    shortName: "Haworth Crater (Site D)",
    designation: "PSR-HWT-04D",
    latitude: "87.40° S",
    longitude: "5.10° W",
    latNum: -87.40,
    lonNum: -5.10,
    illumination: "0.6%",
    illuminationNote: "Deep south wall PSR",
    temperature: "~44 K",
    psrArea: "27.8 km²",
    priorIceProbability: "71.3%",
    elevation: "-3.90 km",
    elevationRelief: "3,900 m",
    rimIllumination: "78.4%",
    divinerThermalMin: "41.0 K",
    divinerThermalMax: "47.2 K",
    radarBackscatter: "Moderate-high CPR (1.15)",
    instrumentHeritage: "Chandrayaan-2 DFSAR + Diviner",
    status: "CONTINGENCY TARGET",
    recommendedLandingZone: false,
    landingZoneName: "Haworth Ridge Terrace",
    mapX: 300,
    mapY: 370,
    radius: 40
  }
];

// Ice Detection Ground Truth & Pipeline Telemetry
export const ICE_DETECTION_RESULTS = {
  confidence: "87.4%",
  classification: [
    { material: "Water Ice", probability: "87.4%", color: "#00D9FF", fill: "rgba(0, 217, 255, 0.85)" },
    { material: "Regolith", probability: "8.2%", color: "#8B98A5", fill: "rgba(139, 152, 165, 0.85)" },
    { material: "Rock", probability: "4.4%", color: "#E6EDF3", fill: "rgba(230, 237, 243, 0.85)" }
  ],
  signatures: [
    { name: "Circular Polarization Ratio (CPR)", key: "CPR", value: "1.42", threshold: "> 1.0", pass: true, desc: "Volumetric coherent backscatter characteristic of low-loss dielectric ice deposits." },
    { name: "Degree of Polarization (DOP)", key: "DOP", value: "0.086", threshold: "< 0.13", pass: true, desc: "Depolarization indicator; low DOP verifies non-specular multiple internal scattering." },
    { name: "Dielectric Constant (ε')", key: "Dielectric Constant", value: "3.21", threshold: "3.0 – 3.3", pass: true, desc: "Relative permittivity matching solid ice + low-loss silicates mixture." }
  ],
  decisionRule: {
    rule1: "CPR > 1.0",
    rule1Passed: true,
    rule2: "DOP < 0.13",
    rule2Passed: true,
    verdict: "ICE SIGNATURE DETECTED",
    status: "CONFIRMED",
    confidenceInterval: "95% CI [84.1% - 90.7%]",
    detectionRationale: "Both CPR threshold (>1.0) and depolarizing Stokes parameter DOP (<0.13) criteria satisfied concurrently. Distinct from surface roughness rock scattering."
  }
};

// Map scale constant for tactical rover coordinates (km per pixel)
// Waypoint sequence total Euclidean path = 131.4887 px.
// 131.4887 px * 0.02160033 km/px = 2.84 km
export const MAP_SCALE_KM_PER_PIXEL = 0.0216;

// Resource Estimation Telemetry
// Baseline calculation:
// Total Shackleton Crater floor (PSR) is 21.3 km². Volumetric ice detection applies
// to the high-probability cold trap sub-area: analysisAreaKm2 = 8.70 km² (~40.8% of floor).
// At total exploratory depth 5.0 m, excluding 0.5 m desiccated dry lag, the active
// ice-cemented layer thickness is 4.5 m.
// At 4.7% volumetric concentration:
// Volume = 8.70e6 m² × 4.5 m × 0.047 = 1,840,050 m³ (≈ 1.84 × 10⁶ m³)
// Water mass = 1,840,050 m³ × 920 kg/m³ = 1,692,846,000 kg (≈ 1.69 × 10⁹ kg)
// ±30% volume range: 1.288 × 10⁶ – 2.392 × 10⁶ m³ (≈ 1.29 × 10⁶ – 2.39 × 10⁶ m³)
// ±30% mass range: 1.185 × 10⁹ – 2.201 × 10⁹ kg (≈ 1.18 × 10⁹ – 2.20 × 10⁹ kg)
const BASELINE_ANALYSIS_AREA_KM2 = 8.70;
const BASELINE_DEPTH_MAX_M = 5.0;
const BASELINE_DRY_LAG_M = 0.5;
const BASELINE_ICE_THICKNESS_M = BASELINE_DEPTH_MAX_M - BASELINE_DRY_LAG_M; // 4.5 m
const BASELINE_ICE_FRACTION_PCT = 4.7;

const baselineVolume = iceVolume(BASELINE_ANALYSIS_AREA_KM2 * 1e6, BASELINE_ICE_THICKNESS_M, BASELINE_ICE_FRACTION_PCT);
const baselineMass = waterMass(baselineVolume, 920);
const baselineVolRange = uncertaintyRange(baselineVolume, 0.30);
const baselineMassRange = uncertaintyRange(baselineMass, 0.30);

export const RESOURCE_ESTIMATION = {
  analysisAreaKm2: BASELINE_ANALYSIS_AREA_KM2,
  analysisAreaNote: "High-probability ice-bearing sub-area of the PSR cold trap (~40.8% of 21.3 km² PSR floor)",
  dryLagDepthM: BASELINE_DRY_LAG_M,
  iceConcentration: `${BASELINE_ICE_FRACTION_PCT}%`,
  iceConcentrationUnit: "by volume",
  depthRange: `0–${BASELINE_DEPTH_MAX_M} m`,
  depthRangeMin: 0,
  depthRangeMax: BASELINE_DEPTH_MAX_M,
  estimatedIceVolume: `${(baselineVolume / 1e6).toFixed(2)} × 10⁶ m³`,
  estimatedIceVolumeValue: baselineVolume,
  volumeUncertainty: "±30%",
  volumeRangeMin: `${(baselineVolRange.min / 1e6).toFixed(2)} × 10⁶ m³`,
  volumeRangeMax: `${(baselineVolRange.max / 1e6).toFixed(2)} × 10⁶ m³`,
  waterEquivalentMass: `${(baselineMass / 1e9).toFixed(2)} × 10⁹ kg`,
  waterEquivalentMassValue: baselineMass,
  massUncertainty: "±30%",
  massRangeMin: `${(baselineMassRange.min / 1e9).toFixed(2)} × 10⁹ kg`,
  massRangeMax: `${(baselineMassRange.max / 1e9).toFixed(2)} × 10⁹ kg`,
  iceDensityUsed: "~920 kg/m³ (water-ice solid density)",
  densityExplanation: "Calculated using cryogenic hexagonal ice density (920 kg/m³ @ 38K) rather than standard liquid water density (1000 kg/m³), ensuring physical fidelity."
};

// Mission Planner Landing Site Factors & Weights
// Factor contributions are computed dynamically in code from (score * weight) / 100
export const SUITABILITY_FACTORS = [
  { factor: "Ice potential", score: 92, weight: 30, desc: "Coincident high CPR and Diviner <40K cold trap" },
  { factor: "Terrain safety", score: 88, weight: 20, desc: "Slope < 7.5° on ridge terrace, boulder density < 2%" },
  { factor: "Communication", score: 95, weight: 20, desc: "Direct-to-Earth (DTE) line-of-sight availability 84% orbital cycle" },
  { factor: "Illumination", score: 76, weight: 15, desc: "Peak of Eternal Light vicinity on connecting ridge" },
  { factor: "Rover accessibility", score: 91, weight: 15, desc: "Continuous low-grade ingress corridor into PSR basin" }
].map(item => ({
  ...item,
  get contribution() {
    return (this.score * this.weight) / 100;
  }
}));

const derivedCompositeValue = compositeScore(SUITABILITY_FACTORS);

export const COMPOSITE_SCORE = {
  site: "Site A (Shackleton Connecting Ridge)",
  score: `${derivedCompositeValue.toFixed(1)}%`,
  scoreValue: derivedCompositeValue,
  status: "RECOMMENDED LANDING ZONE",
  landingEllipse: {
    lat: "89.78° S",
    lon: "0.50° W",
    semiMajorKm: 1.2,
    semiMinorKm: 0.6,
    orientationDeg: 32
  }
};

// Rover Trajectory Waypoints & Telemetry
const RAW_WAYPOINTS = [
  { id: 1, name: "WP-01: Lander Touchdown", x: 375, y: 360, lat: "89.78° S", lon: "0.50° W", elev: "-3.20 km", slope: "2.1°", iceProb: "12%", phase: "DEPLOYMENT" },
  { id: 2, name: "WP-02: Ridge Ingress Crest", x: 382, y: 375, lat: "89.81° S", lon: "0.35° W", elev: "-3.45 km", slope: "4.8°", iceProb: "24%", phase: "INGRESS" },
  { id: 3, name: "WP-03: Shadow Transition Gate", x: 390, y: 390, lat: "89.85° S", lon: "0.15° W", elev: "-3.75 km", slope: "6.2°", iceProb: "58%", phase: "PSR ENTRY" },
  { id: 4, name: "WP-04: Ice Deposit Margin", x: 396, y: 405, lat: "89.88° S", lon: "0.05° W", elev: "-3.95 km", slope: "3.5°", iceProb: "84%", phase: "TARGET SURVEY" },
  { id: 5, name: "WP-05: High-CPR Core Zone", x: 402, y: 415, lat: "89.90° S", lon: "0.00° E", elev: "-4.12 km", slope: "1.8°", iceProb: "87.4%", phase: "PRIMARY SAMPLING" },
  { id: 6, name: "WP-06: Secondary Trench Site", x: 412, y: 410, lat: "89.89° S", lon: "0.20° E", elev: "-4.05 km", slope: "2.4°", iceProb: "81%", phase: "TRENCH EXTRACTION" },
  { id: 7, name: "WP-07: Egress Ramp Incline", x: 400, y: 380, lat: "89.83° S", lon: "0.10° E", elev: "-3.50 km", slope: "5.1°", iceProb: "36%", phase: "EGRESS" },
  { id: 8, name: "WP-08: Comm Relay Haven (Return)", x: 378, y: 365, lat: "89.79° S", lon: "0.40° W", elev: "-3.22 km", slope: "1.9°", iceProb: "15%", phase: "SAMPLE TRANSIT" }
];

const derivedRouteDistanceKm = routeDistanceKm(RAW_WAYPOINTS, MAP_SCALE_KM_PER_PIXEL);
const cruiseSpeedKmh = 0.5;
const derivedRouteTimeHrs = routeTimeHours(derivedRouteDistanceKm, cruiseSpeedKmh);
const derivedEnergyPct = Math.round((derivedRouteDistanceKm / 2.84) * 64);

export const ROVER_MISSION_DATA = {
  kmPerPixel: MAP_SCALE_KM_PER_PIXEL,
  cruiseSpeedKmh: cruiseSpeedKmh,
  distanceKm: derivedRouteDistanceKm,
  timeHours: derivedRouteTimeHrs,
  energyPct: derivedEnergyPct,
  distance: `${derivedRouteDistanceKm.toFixed(2)} km`,
  time: `${derivedRouteTimeHrs.toFixed(1)} h`,
  avgSpeed: `≈ ${cruiseSpeedKmh} km/h`,
  energyConsumption: `${derivedEnergyPct}%`,
  waypointsCount: RAW_WAYPOINTS.length,
  terrainRisk: "LOW",
  conceptLabel: "Next-gen high-speed rover concept",
  conceptNote: "Autonomous hazard-avoidance path planning enables 0.5 km/h cruise velocity (~14× faster than Chandrayaan-3's Pragyan ~1 cm/s benchmark). Powered by radioisotope thermoelectric generator (RTG) and high-density cryogenic battery.",
  waypoints: RAW_WAYPOINTS
};
