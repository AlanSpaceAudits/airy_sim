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
  klinkerfues: {
    label:'Klinkerfues 1867', scene:'tube', speed:C/N,
    thetaInt:A*N, cite:'Klinkerfues 1867, Die Aberration der Fixsterne nach der Wellentheorie',
    formula:'α = g/v ,  v′ = v/n  (wave slows)\nθ_int = nα = 27.33″ ,  measured n²α = 36.35″',
    blurb:'The original 1867 wave prediction Airy tested. Light slows to v/n, so the water telescope should '
      +'read n²α = 36.35″. Airy measured 20.55″, unchanged. Falsified by a factor of n².'
  },
  undulatory: {
    label:'Undulatory (wave)', scene:'tube', speed:C/N,
    thetaInt:A*N, cite:'wave theory, undragged ether',
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
  jones: {
    label:'Jones 1972 (transverse drag, measured)', scene:'tube', speed:C/N,
    thetaInt:A*(N-1/N), cite:'Jones 1972, Proc. R. Soc. Lond. A 328, 337',
    formula:'δ = (v/c)·L·(n − 1/n)  →  θ_int = β(n − 1/n) = 11.88″\nmeasured 6.174 nm vs Fresnel 6.175 nm  (0.02%)',
    blurb:'The moving-frame transverse drag, measured directly in Airy’s geometry to 0.02%. θ_int = 11.88″ '
      +'reads 15.80″, not 20.55″. Read as a speed the moving frame needs 1.73c; the real speed is 0.75c.'
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

// Display views. Each theory's number is a PREDICTION; the lab value is what Airy read.
//   cali     — calibrated reading (θ_int · n); Airy published 20.55″
//   raw      — raw air-scale reading (= θ_int)
//   thetaint — the predicted internal angle (= θ_int)
//   micro    — the physical plate drift in µm (∝ θ_int); angle becomes the supporting figure
// val(θ_int) is the headline number; aux(θ_int) is the related figure shown greyed.
AIY.VIEWS = {
  cali:     {name:'Reads — calibrated (θ_int × n)',  tag:'cali',  labWord:'measured', unit:'″',
             val:th=>th*AIY.N, aux:th=>({label:'drift', val:AIY.drift(th), unit:'µm'})},
  raw:      {name:'Reads — raw (air scale)',         tag:'raw',   labWord:'requires', unit:'″',
             val:th=>th,       aux:th=>({label:'drift', val:AIY.drift(th), unit:'µm'})},
  thetaint: {name:'θ_int — predicted internal angle', tag:'θ_int', labWord:'requires', unit:'″',
             val:th=>th,       aux:th=>({label:'drift', val:AIY.drift(th), unit:'µm'})},
  micro:    {name:'Micrometer — plate drift (µm)',   tag:'micro', labWord:'requires', unit:'µm',
             val:th=>AIY.drift(th), aux:th=>({label:'θ_int', val:th, unit:'″'})},
};
AIY.viewVals = (thInt, view) => {
  const V = AIY.VIEWS[view] || AIY.VIEWS.cali;
  return {val:V.val(thInt), unit:V.unit, aux:V.aux(thInt)};
};
AIY.viewData = (t, frame, view) => {
  const thInt = AIY.internalAngle(t, frame), V = AIY.VIEWS[view] || AIY.VIEWS.cali;
  const ref = AIY.ALPHA/AIY.N;                          // internal angle Airy's reading implies
  const wv = V.val(thInt), lab = V.val(ref), eps = V.unit==='µm' ? 1 : 0.5;
  return {thInt, wv, lab, unit:V.unit, tag:V.tag, labWord:V.labWord,
          aux:V.aux(thInt), match:Math.abs(wv-lab)<eps, name:V.name};
};
})();
