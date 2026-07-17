(function(){
/* ── Tube scene: starlight through an air tube vs a water tube ──────────────
 * Same aberrated ray (α = 20.55″) enters both. The air tube passes it straight;
 * the water tube refracts it to the theory's internal angle θ_int. Angle arcs
 * show the bend at the surface; a micrometer grid at the bottom shows where the
 * star transits, and the reading θ_int·n. Photon speed = light speed in medium.
 * ------------------------------------------------------------------------- */
'use strict';
const AIY = window.AIY = window.AIY || {};

const EXAGG = 800;                                      // arcsec → radians on screen
const H = 300, W = 84, LIN = 140;                       // tube height, width, incoming ray length
const disp = a => a/206264.806 * EXAGG;                 // display angle, radians
// font scale: ≥1.1× base, grows with the monitor so labels stay readable
const fscale = () => Math.min(2.0, Math.max(1.1, Math.min(innerWidth/1366, innerHeight/768)));

// position along a poly-path at parameter s∈[0,1] (photon travel)
function along(pts, s){
  let seg=[], tot=0;
  for(let i=0;i<pts.length-1;i++){ const l=Math.hypot(pts[i+1].x-pts[i].x,pts[i+1].y-pts[i].y); seg.push(l); tot+=l; }
  let d=s*tot;
  for(let i=0;i<seg.length;i++){ if(d<=seg[i]||i===seg.length-1){ const f=seg[i]?d/seg[i]:0;
    return {x:pts[i].x+(pts[i+1].x-pts[i].x)*f, y:pts[i].y+(pts[i+1].y-pts[i].y)*f}; } d-=seg[i]; }
  return pts[pts.length-1];
}

// arc between two screen angles (radians), tied to the real ray directions
function arcBetween(ctx, c, r, a, b, color){
  ctx.strokeStyle=color; ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.arc(c.x, c.y, r, Math.min(a,b), Math.max(a,b)); ctx.stroke();
}

// micrometer plate: ruled grid + centre wire + landing spot.
// tick spacing is the telescope's own scale — the water plate is n× finer (Airy p.39),
// so the closer-in water landing lands on the SAME tick count as air → same reading.
function micrometer(ctx, xc, gy, landingX, tickPx, fine){
  const half=W/2+36;
  ctx.strokeStyle='rgba(220,230,245,.55)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(xc-half,gy); ctx.lineTo(xc+half,gy); ctx.stroke();
  ctx.strokeStyle='rgba(200,215,235,.4)'; ctx.lineWidth=1;
  for(let x=-half; x<=half; x+=tickPx){ const tall=Math.abs(x)<tickPx/2; ctx.beginPath();
    ctx.moveTo(xc+x, gy); ctx.lineTo(xc+x, gy+(tall?9:5)); ctx.stroke(); }
  AIY.disc(ctx, {x:landingX,y:gy}, 4.5, '#3fe0d0');      // where the star transits
  if(fine) AIY.text(ctx, '× n finer scale', xc, gy-11, '#9fd4ff', Math.round(11*fscale())+'px system-ui', 'center');
}

// one telescope
function drawTube(ctx, xc, o, time){
  const topY=o.topY, plateY=topY+H;
  const S=fscale(), f=(n,b)=>(b?'bold ':'')+Math.round(n*S)+'px system-ui', dy=n=>n*S;
  const entry={x:xc, y:topY};
  const thExt=disp(AIY.ALPHA), thInt=disp(o.thetaIntArc);
  const landing={x:xc + H*Math.tan(thInt), y:plateY};
  const start={x:entry.x - LIN*Math.sin(thExt), y:entry.y - LIN*Math.cos(thExt)};

  // tube body + water fill + object-glass surface
  ctx.lineWidth=1.5; ctx.strokeStyle='rgba(150,175,215,.55)';
  if(o.water){ ctx.fillStyle='rgba(70,150,210,.12)'; ctx.beginPath(); ctx.roundRect(xc-W/2,topY,W,H,7); ctx.fill(); }
  ctx.beginPath(); ctx.roundRect(xc-W/2,topY,W,H,7); ctx.stroke();
  ctx.strokeStyle='rgba(120,200,255,.85)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(xc-W/2,topY); ctx.lineTo(xc+W/2,topY); ctx.stroke();

  // dashed tube axis (vertical reference)
  ctx.setLineDash([4,4]); ctx.strokeStyle='rgba(200,210,230,.3)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(xc,topY); ctx.lineTo(xc,topY+96); ctx.stroke(); ctx.setLineDash([]);

  // rays: incoming (yellow) then internal (cyan)
  ctx.lineCap='round'; ctx.lineWidth=2;
  ctx.strokeStyle='#f2c14e'; ctx.beginPath(); ctx.moveTo(start.x,start.y); ctx.lineTo(entry.x,entry.y); ctx.stroke();
  ctx.strokeStyle='#3fe0d0'; ctx.beginPath(); ctx.moveTo(entry.x,entry.y); ctx.lineTo(landing.x,landing.y); ctx.stroke();

  // angles derived from the real line intersections at the boundary (update with frame):
  //   θ_ext = incoming ray vs the axis, drawn OUTSIDE (above the surface)
  //   θ_int = refracted ray vs the axis, drawn INSIDE (below the surface, at the top)
  const incUp = Math.atan2(start.y-entry.y, start.x-entry.x);   // incoming, pointing up out of the tube
  const inDn  = Math.atan2(landing.y-entry.y, landing.x-entry.x);// refracted, pointing down the tube
  arcBetween(ctx, entry, 30, -Math.PI/2, incUp, '#f2c14e');     // external, above boundary
  arcBetween(ctx, entry, 30,  Math.PI/2, inDn,  '#3fe0d0');     // internal, below boundary
  AIY.text(ctx, 'θ_ext '+AIY.ALPHA.toFixed(2)+'″', entry.x-10, topY-30, '#f2c14e', f(12), 'right');
  AIY.text(ctx, 'θ_int '+o.thetaIntArc.toFixed(2)+'″', entry.x+28, topY+20, '#3fe0d0', f(12), 'left');

  micrometer(ctx, xc, plateY, landing.x, o.tickPx, o.water);

  // photon position is precomputed (o.photonS) so both tubes share one cycle
  const ph=along([start,entry,landing], o.photonS);
  ctx.save(); ctx.shadowBlur=12; ctx.shadowColor='#fff'; AIY.disc(ctx,ph,4.5,'#fff'); ctx.restore();

  // labels
  const fmt=(v,u)=> u==='µm' ? v.toFixed(1)+' µm' : v.toFixed(2)+'″';
  AIY.text(ctx, o.title, xc, topY-LIN-16, '#e9eef6', f(14,1), 'center');
  if(o.water){                                            // theory PREDICTION vs Airy's lab-frame value
    const col=o.matches?'#5fd07a':'#ff6a78';
    AIY.text(ctx, (o.matches?'✓ ':'✗ ')+'predicted '+fmt(o.showVal,o.unit), xc, plateY+dy(24), col, f(14,1), 'center');
    AIY.text(ctx, "Airy's lab frame value ("+o.tag+") "+fmt(o.labVal,o.unit), xc, plateY+dy(44), '#5fd07a', f(13), 'center');
  } else {                                                // the measured baseline
    AIY.text(ctx, fmt(o.showVal,o.unit), xc, plateY+dy(24), '#cfe0f0', f(14,1), 'center');
    AIY.text(ctx, 'air reference', xc, plateY+dy(44), '#9fb0c6', f(13), 'center');
  }
  AIY.text(ctx, o.aux.label+' '+fmt(o.aux.val,o.aux.unit), xc, plateY+dy(64), '#9fb0c6', f(13), 'center');
  AIY.text(ctx, o.mediumLabel, xc, plateY+dy(82), '#9fb0c6', f(13), 'center');
  if(o.speedNote) AIY.text(ctx, o.speedNote, xc, plateY+dy(100), '#ff9aa2', f(13), 'center');
}

AIY.drawTube = (ctx, st, time) => {
  const t = AIY.THEORIES[st.theory];
  const thetaIntArc = AIY.internalAngle(t, st.frame);
  const view = st.view || 'cali';
  const V = AIY.viewData(t, st.frame, view);                // predicted value + Airy's value for this view
  const airV = AIY.viewVals(AIY.ALPHA, view);               // air baseline in the same view
  const topY = AIY.view.cy - 170, midX = AIY.view.cx;

  AIY.text(ctx, 'incoming starlight, aberrated by α = 20.55″', midX, topY-LIN-40,
           '#f2c14e', Math.round(14*fscale())+'px system-ui', 'center');

  // Shared cycle: photon speed ∝ light speed in the medium. The cycle lasts as long as the
  // SLOWER beam takes to reach the plate; the faster one clamps at the bottom and waits, so
  // neither repeats until both have transited.
  const rateAir = 0.4, rateWater = 0.4*(t.speed/AIY.C), minRate = Math.min(rateAir, rateWater);
  const g = (time*minRate) % 1;                          // 0→1 over one shared cycle
  const sAir = Math.min(1, g*rateAir/minRate), sWater = Math.min(1, g*rateWater/minRate);

  drawTube(ctx, midX-155, {                              // air (baseline): scale = 37.0 in
    title:'AIR TUBE', mediumLabel:'n = 1', water:false, topY, tickPx:12,
    thetaIntArc:AIY.ALPHA, photonS:sAir,
    showVal:airV.val, unit:airV.unit, aux:airV.aux, speed:AIY.C
  }, time);

  drawTube(ctx, midX+155, {                              // water (theory): scale n× finer (27.8 in)
    title:'WATER TUBE', mediumLabel:'n = 1.33', water:true, topY, tickPx:12/AIY.N,
    thetaIntArc, photonS:sWater,
    showVal:V.wv, labVal:V.lab, matches:V.match, unit:V.unit, tag:V.tag, aux:V.aux, speed:t.speed,
    speedNote: t.speed>AIY.C ? 'needs 1.33 c — Foucault measured 0.75 c' : null
  }, time);
};
})();
