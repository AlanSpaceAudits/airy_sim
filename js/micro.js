(function(){
/* ── Micrometer scene: γ Draconis meridian transit, Airy's water telescope ──
 * You look up the tube at the eyepiece: a round field ruled with the micrometer
 * grid, a bold meridian wire. γ Draconis drifts to the wire and is CAUGHT at the
 * predicted transit instant, stopping short by the aberration.
 *
 * Airy did NOT measure an angle. He read the star's PLATE POSITION at the transit
 * moment (a micrometer displacement) and converted it to a celestial arc. The
 * internal tilt is only known AFTER that, by implication. So the chain reads:
 *     micrometer displacement (measured)  →  celestial arc = displacement ÷ focal
 *     →  internal tilt (implied) = displacement ÷ physical tube length
 * Air (tube 706 mm) and water (tube 940 mm) both land at the same displacement,
 * so both read the same 20.55″. That is the null.
 *
 * Everything scales off S (tied to the eyepiece radius) so fonts and spacing grow
 * together at any window size or browser zoom.
 * ------------------------------------------------------------------------- */
'use strict';
const AIY = window.AIY = window.AIY || {};

const AS   = 206264.806;
const T_E  = 6.0, HOLD = 2.6;      // expected transit time / caught pause, s
const KAPPA= 20.55;               // aberration constant → the arc it settles on
const F_MM = 27.8*25.4;            // focal length (air-equivalent), mm
const ease = p => p<1 ? 1-Math.pow(1-p,2.3) : 1;

// γ Draconis (Eltanin) transits ~0.9′ from the zenith at Greenwich — Airy's star.
AIY.microData = frame => {
  const water = frame==='water';
  const thInt = water ? KAPPA/AIY.N : KAPPA;           // 15.45″ or 20.55″
  const Lmm   = water ? 37.0*25.4 : 27.8*25.4;         // physical tube length, mm
  const xMm   = thInt/AS * Lmm;                        // plate displacement, mm (~0.070)
  const read  = xMm/F_MM * AS;                         // celestial arc ≈ 20.55″
  return {water, thInt, Lmm, xMm, read};
};

// Lay the eyepiece and the formula panel out as one centred pair, so the panel
// sits right beside the eyepiece instead of pinned to the far edge. Shared by
// the canvas (eyepiece position) and main.js (panel's left edge).
AIY.microLayout = () => {
  const R = Math.max(150, Math.min(240, Math.min(innerWidth,innerHeight)*0.26));
  const S = Math.max(0.95, Math.min(1.55, R/165));
  const PANEL_W = 418, GAP = 44, leftUI = 396;          // panel total width, gap, controls
  const pairW = 2*R + GAP + PANEL_W;
  const blockLeft = leftUI + Math.max(0, (innerWidth - leftUI - pairW)/2);
  const Ex = blockLeft + R;
  return { R, S, Ex, panelLeft: Ex + R + GAP };
};

AIY.drawMicrometer = (ctx, st, clock) => {
  const water = st.frame==='water', d = AIY.microData(st.frame);

  // one scale for the whole widget: tie it to the eyepiece radius so fonts and
  // spacing grow together (fixes overlap at high-res / different zoom levels).
  const L = AIY.microLayout(), R = L.R, S = L.S;
  const f = (n,b)=>(b?'bold ':'')+Math.round(n*S)+'px system-ui';
  const g = n => n*S;                                   // vertical spacing unit

  const E = {x: L.Ex, y: AIY.view.cy + g(6)};
  const merX = E.x;

  // transit clock → progress
  const tc=clock%(T_E+HOLD), tcur=Math.min(tc,T_E), p=ease(tcur/T_E), held=tc>=T_E;
  const liveMm = d.xMm*p, liveArc = d.read*p;

  const offPx = R*0.42;                                 // caught offset from the wire, px
  const startX= E.x - R*0.86, stopX = merX - offPx;
  const starX = startX + (stopX-startX)*p, starY = E.y;

  // ── eyepiece body + grid ───────────────────────────────────────────────────
  ctx.save();
  const bg=ctx.createRadialGradient(E.x,E.y,8,E.x,E.y,R);
  bg.addColorStop(0,'#0a1522'); bg.addColorStop(1,'#050a12');
  ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(E.x,E.y,R,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(E.x,E.y,R,0,7); ctx.clip();
  if(water){ ctx.fillStyle='rgba(70,150,210,.10)'; ctx.fillRect(E.x-R,E.y-R,2*R,2*R); }
  const tick=R/10*(water?1/AIY.N:1);                   // water plate is n× finer
  ctx.lineWidth=1;
  for(let x=-R;x<=R;x+=tick){ ctx.strokeStyle='rgba(200,215,235,.13)';
    ctx.beginPath(); ctx.moveTo(E.x+x,E.y-R); ctx.lineTo(E.x+x,E.y+R); ctx.stroke(); }
  for(let y=-R;y<=R;y+=tick){ ctx.strokeStyle='rgba(200,215,235,.06)';
    ctx.beginPath(); ctx.moveTo(E.x-R,E.y+y); ctx.lineTo(E.x+R,E.y+y); ctx.stroke(); }
  ctx.strokeStyle='rgba(220,230,245,.3)'; ctx.lineWidth=1.3;               // drift track
  ctx.beginPath(); ctx.moveTo(E.x-R,E.y); ctx.lineTo(E.x+R,E.y); ctx.stroke();
  ctx.strokeStyle='#ff8a94'; ctx.lineWidth=2.4;                            // meridian wire
  ctx.beginPath(); ctx.moveTo(merX,E.y-R); ctx.lineTo(merX,E.y+R); ctx.stroke();
  AIY.text(ctx,'meridian',merX+g(7),E.y-R+g(15),'#ff8a94',f(11.5),'left');

  // top bracket = the micrometer scale reading (measured displacement, counting);
  // bottom bracket = the celestial arc it converts to (Reads, green).
  if(p>0.03){
    bracket(ctx, starX, merX, starY-g(30), held?'#e9eef6':'#9fd4ff',
            'micrometer  '+(liveMm*1000).toFixed(1)+' µm', f(13.5,held), 'up', g);
    bracket(ctx, starX, merX, starY+g(30), held?'#5fd07a':'#3fe0d0',
            (held?'reads ':'')+liveArc.toFixed(2)+'″'+(held?' ✓':''), f(13.5,held), 'down', g);
  }
  ctx.save(); ctx.shadowBlur=14; ctx.shadowColor='#fff'; AIY.disc(ctx,{x:starX,y:starY},g(4.5),'#fff'); ctx.restore();
  ctx.restore();

  ctx.strokeStyle='rgba(120,200,255,.85)'; ctx.lineWidth=3;                // rim
  ctx.beginPath(); ctx.arc(E.x,E.y,R,0,7); ctx.stroke();

  // ── titles ──────────────────────────────────────────────────────────────
  AIY.text(ctx,(water?'WATER-FILLED':'AIR')+' TELESCOPE — eyepiece', E.x, E.y-R-g(50),'#e9eef6',f(17,1),'center');
  AIY.text(ctx,'γ Draconis  ·  δ +51°29′  ·  Greenwich φ +51°28′', E.x, E.y-R-g(30),'#9fb0c6',f(13),'center');
  AIY.text(ctx,'transits 0.9′ from the zenith — Airy’s chosen star', E.x, E.y-R-g(13),'#9fb0c6',f(12.5),'center');

  // ── transit clock ─────────────────────────────────────────────────────────
  const cY=E.y+R+g(28);
  AIY.text(ctx,'current',E.x-R*0.5,cY,'#9fb0c6',f(13),'center');
  AIY.text(ctx,tcur.toFixed(2)+' s',E.x-R*0.5,cY+g(21),held?'#5fd07a':'#f2c14e',f(17,1),'center');
  AIY.text(ctx,'expected transit',E.x+R*0.5,cY,'#9fb0c6',f(13),'center');
  AIY.text(ctx,T_E.toFixed(2)+' s',E.x+R*0.5,cY+g(21),'#e9eef6',f(17,1),'center');
  const bw=R*1.3,bx=E.x-bw/2,by=cY+g(38);
  ctx.strokeStyle='rgba(159,176,198,.4)'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,g(6));
  ctx.fillStyle=held?'#5fd07a':'#f2c14e'; ctx.fillRect(bx,by,bw*(tcur/T_E),g(6));
  if(held) AIY.text(ctx,'★ caught at transit — plate position is the measurement',E.x,by+g(24),'#5fd07a',f(13,1),'center');
};

// the conversion, rendered as a real HTML panel (not canvas) for readability.
AIY.microPanelHTML = frame => {
  const d = AIY.microData(frame), k = '206265″';
  const xUm = (d.xMm*1000).toFixed(1);                 // plate displacement, µm
  const fUm = (F_MM*1000).toFixed(0);                  // focal length in µm (for the division)
  const LUm = (d.Lmm*1000).toFixed(0);                 // tube length in µm
  return `
  <h3>${AIY.L('MICROMETER READING → CELESTIAL ARC')}</h3>

  <div class="mstep measured">
    <div class="lbl">${AIY.L('1 · measured on the plate')}</div>
    <div class="eq"><span class="v">x</span> = <span class="res">${xUm} µm</span></div>
    <div class="lbl">${AIY.L("the star's offset from the meridian wire at transit")}</div>
  </div>

  <div class="mstep reads">
    <div class="lbl">${AIY.L('2 · convert to a sky angle — the reading')}</div>
    <div class="eq">arc = ( <span class="v">x</span> &divide; <span class="v">f</span> ) &times; <span class="v">k</span></div>
    <div class="eq sm">= ( ${xUm} &divide; ${fUm} ) &times; ${k}</div>
    <div class="eq"><span class="res">= ${d.read.toFixed(2)}&Prime;</span> &nbsp;${AIY.L("Airy's reading")}</div>
  </div>

  <div class="mstep implied">
    <div class="lbl">${AIY.L('3 · internal tilt — implied afterward (or via Snell)')}</div>
    <div class="eq">&theta;_int = ( <span class="v">x</span> &divide; <span class="v">L</span> ) &times; <span class="v">k</span></div>
    <div class="eq sm">= ( ${xUm} &divide; ${LUm} ) &times; ${k}</div>
    <div class="eq"><span class="res">= ${d.thInt.toFixed(2)}&Prime;</span></div>
  </div>

  <div class="mdefs">
    <div class="d"><b>x</b><span>${AIY.L('plate displacement, measured (µm)')}</span></div>
    <div class="d"><b>f</b><span>${AIY.L('focal length, air-equivalent = 706 mm')}</span></div>
    <div class="d"><b>L</b><span>${AIY.L('physical tube length — air 706 mm, water 940 mm')}</span></div>
    <div class="d"><b>k</b><span>206265&Prime; per radian — the number of arcseconds in one radian (1 rad = 180/&pi; &times; 3600&Prime;)</span></div>
  </div>

  <div class="mnull">air &amp; water reach the same displacement <b>x</b> &rarr; both read 20.55&Prime;</div>`;
};


// bracket spanning [a,b] at height y, tick ends, label outside
function bracket(ctx, a, b, y, color, label, font, dir, g){
  ctx.strokeStyle=color; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(a,y); ctx.lineTo(b,y);
  ctx.moveTo(a,y-g(4)); ctx.lineTo(a,y+g(4)); ctx.moveTo(b,y-g(4)); ctx.lineTo(b,y+g(4)); ctx.stroke();
  AIY.text(ctx, label, (a+b)/2, y+(dir==='up'?-g(10):g(12)), color, font, 'center');
}

})();
