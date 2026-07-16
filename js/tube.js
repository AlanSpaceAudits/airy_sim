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

// micrometer plate: ruled grid + centre wire + landing spot
function micrometer(ctx, xc, gy, landingX){
  const half=W/2+36;
  ctx.strokeStyle='rgba(220,230,245,.55)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(xc-half,gy); ctx.lineTo(xc+half,gy); ctx.stroke();
  ctx.strokeStyle='rgba(200,215,235,.4)'; ctx.lineWidth=1;
  for(let x=-half; x<=half; x+=12){ const tall=Math.abs(x)<1; ctx.beginPath();
    ctx.moveTo(xc+x, gy); ctx.lineTo(xc+x, gy+(tall?9:5)); ctx.stroke(); }
  AIY.disc(ctx, {x:landingX,y:gy}, 4.5, '#3fe0d0');      // where the star transits
}

// one telescope
function drawTube(ctx, xc, o, time){
  const topY=o.topY, plateY=topY+H;
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
  AIY.text(ctx, 'θ_ext '+AIY.ALPHA.toFixed(2)+'″', entry.x-10, topY-30, '#f2c14e', '11px system-ui', 'right');
  AIY.text(ctx, 'θ_int '+o.thetaIntArc.toFixed(2)+'″', entry.x+28, topY+20, '#3fe0d0', '11px system-ui', 'left');

  micrometer(ctx, xc, plateY, landing.x);

  // photon at the medium's light speed
  const rate=0.4*(o.speed/AIY.C), ph=along([start,entry,landing],(time*rate)%1);
  ctx.save(); ctx.shadowBlur=12; ctx.shadowColor='#fff'; AIY.disc(ctx,ph,4.5,'#fff'); ctx.restore();

  // labels
  const F='12px system-ui', FB='bold 13px system-ui';
  AIY.text(ctx, o.title, xc, topY-LIN-16, '#e9eef6', FB, 'center');
  AIY.text(ctx, 'reads '+o.reading.toFixed(2)+'″', xc, plateY+22, o.matches?'#5fd07a':'#ff6a78', FB, 'center');
  AIY.text(ctx, o.matches?'✓ matches Airy':'✗ vs 20.55″', xc, plateY+40, o.matches?'#5fd07a':'#ff6a78', F, 'center');
  AIY.text(ctx, 'drift '+AIY.drift(o.thetaIntArc).toFixed(1)+' µm', xc, plateY+58, '#9fb0c6', F, 'center');
  AIY.text(ctx, o.mediumLabel, xc, plateY+76, '#9fb0c6', F, 'center');
  if(o.speedNote) AIY.text(ctx, o.speedNote, xc, plateY+94, '#ff9aa2', F, 'center');
}

AIY.drawTube = (ctx, st, time) => {
  const t = AIY.THEORIES[st.theory];
  const thetaIntArc = AIY.internalAngle(t, st.frame);
  const reading = thetaIntArc * AIY.N;
  const matches = Math.abs(reading-AIY.ALPHA) < 0.5;
  const topY = AIY.view.cy - 170, midX = AIY.view.cx;

  AIY.text(ctx, 'incoming starlight, aberrated by α = 20.55″', midX, topY-LIN-40,
           '#f2c14e', '13px system-ui', 'center');

  drawTube(ctx, midX-155, {                              // air (baseline)
    title:'AIR TUBE', mediumLabel:'n = 1', water:false, topY,
    thetaIntArc:AIY.ALPHA,
    reading:AIY.ALPHA, matches:true, speed:AIY.C
  }, time);

  drawTube(ctx, midX+155, {                              // water (theory)
    title:'WATER TUBE', mediumLabel:'n = 1.33', water:true, topY,
    thetaIntArc,
    reading, matches, speed:t.speed,
    speedNote: t.speed>AIY.C ? 'needs 1.33 c — Foucault measured 0.75 c' : null
  }, time);
};
})();
