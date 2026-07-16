(function(){
/* ── Theory definitions and predicted angles ──────────────────────────────
 * Baseline: starlight aberrates by α = arctan(v/c) = 20.55″ before any tube.
 * Each water-telescope theory bends that ray to a different internal angle
 * θ_int; the air-calibrated micrometer then reads θ_int · n as a celestial arc.
 * Airy measured 20.55″ (no change from air). Match = reading ≈ 20.55″.
 * ------------------------------------------------------------------------- */
'use strict';
const AIY = window.AIY = window.AIY || {};

AIY.C     = 299792.458;                              // speed of light, km/s
AIY.V     = 29.87;                                   // Earth orbital speed, km/s (→ α = 20.55″)
AIY.N     = 1.33;                                    // refractive index of water
AIY.BETA  = AIY.V / AIY.C;                           // v/c
AIY.ALPHA = Math.atan(AIY.BETA) * 206264.806;        // air aberration, arcsec ≈ 20.55
AIY.L_PHYS= 37 * 0.0254;                             // Airy tube length, m

AIY.drift = arcsec => arcsec/206264.806 * AIY.L_PHYS * 1e6;   // internal angle → plate drift, µm

const A = AIY.ALPHA, N = AIY.N, C = AIY.C;

// scene:'sky' → orbital view; scene:'tube' → air-vs-water telescope.
// frames:true → water-at-rest vs water-in-motion toggle (frame-transform theories).
AIY.THEORIES = {
  air: {
    label:'Aberration — Air', scene:'sky',
    formula:'ŝ_app = normalize( c·ŝ + v⃗ )\nα = arctan(v/c) = 20.55″',
    blurb:'Starlight aberrates by α = arctan(v/c) before it reaches any telescope. Air adds nothing.'
  },
  emission: {
    label:'Emission theory', scene:'tube', speed:N*C,          // corpuscle |u| = n·c
    thetaInt:A/N, cite:'Newton; Watson 1911 §369',
    formula:'tan θ_int = β/n   (tangential velocity conserved)\nspeed in water = n·c = 1.33 c',
    blurb:'Corpuscular refraction is Snell, so the angle is right. It dies on speed: it needs 1.33 c, '
      +'and Foucault measured 0.75 c.'
  },
  undulatory: {
    label:'Undulatory (wave)', scene:'tube', speed:C/N,
    thetaInt:A*N, cite:'Klinkerfues 1867',
    formula:'tan θ_int = n·β = 27.33″\nspeed in water = c/n',
    blurb:'Wave slowed to c/n while the tube keeps moving. The internal tilt grows to 27.33″; reads 36.35″.'
  },
  snell: {
    label:'Snell (classical)', scene:'tube', speed:C/N,
    thetaInt:A*N, cite:'Snell in the moving tube',
    formula:'tan θ_int = n·β = 27.33″',
    blurb:'Identical to the wave prediction: 27.33″ inside, reads 36.35″.'
  },
  snellg: {
    label:'Snell × γ (velocity comp.)', scene:'tube', speed:C/N,
    thetaInt:A*N, cite:'relativistic velocity composition',
    formula:'tan θ_int = γ·n·β = 27.33″   (γ−1 ≈ 5×10⁻⁹)',
    blurb:'γ in front moves the answer by a ten-millionth of an arcsec. Still 27.33″, reads 36.35″.'
  },
  sr: {
    label:'Special Relativity', scene:'tube', speed:C/N, frames:true,
    rest:A/N, moving:A*(N-1/N), cite:'Lorentz transform of the wave four-vector',
    formula:'water at rest:  θ_int = β/n = 15.45″\nwater moving:  θ_int = β(n−1/n) = 11.88″',
    blurb:'Rest frame reproduces Airy: 15.45″ → 20.55″. Moving frame gives 11.88″ → 15.80″, never measured.'
  },
  pauli: {
    label:'Pauli 1921 §36γ', scene:'tube', speed:C/N, frames:true,
    rest:A/N, moving:A*(N-1/N), cite:'Pauli, Theory of Relativity, eq. (311b)',
    formula:'tan α = sin α′ √(1−β²) / (cos α′ + β·w′/c)\nrest 15.45″     moving 11.88″',
    blurb:'His own equation gives 15.45″ in the water’s rest frame. §36γ stops before the moving case.'
  },
  rosser: {
    label:'Rosser 1964 §4.4', scene:'tube', speed:C/N, frames:true,
    rest:A/N, moving:A*(N-1/N), cite:'Rosser, Introduction to the Theory of Relativity, eq. (4.30)',
    formula:'tan α′₁ = sin α √(1−β²) / (cos α + v/c)\nrest 15.45″     moving 11.88″',
    blurb:'§4.4.5 argues Airy in the water’s rest frame with no equation. Rest 15.45″, moving 11.88″.'
  },
  geo: {
    label:'Geocentric', scene:'tube', speed:C/N,
    thetaInt:A/N, cite:'Earth at rest, single frame',
    formula:'θ_int = arctan(β/n) = 15.45″   (water at rest, no drag term)',
    blurb:'Earth and water at rest. Ordinary Snell: 15.45″ inside, reads 20.55″. Matches, in one frame.'
  },
};

// Active internal angle for a theory + frame choice.
AIY.internalAngle = (t, frame) => t.frames ? (frame==='moving' ? t.moving : t.rest) : t.thetaInt;
})();
