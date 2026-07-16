(function(){
/* ── Sky scene: stellar aberration in air (the orbital view) ───────────────
 * apparent = star + (v/c)·(perp component of v to the line of sight).
 * The star-latitude slider tilts the star off the ecliptic pole, so the annual
 * aberration ellipse morphs from a circle (pole) to a line (in the plane).
 * ------------------------------------------------------------------------- */
'use strict';
const AIY = window.AIY = window.AIY || {};

const ORBIT_PX = 210;                                 // orbit radius, px
const VEC_LEN  = 165;                                 // star-vector length, world px
const VEL_LEN  = 120;                                 // velocity-vector length, world px
const AXIS = AIY.norm({x:0.20, y:0.92, z:-0.40});     // Earth rotation axis, tilted 23.5° away

// star direction from ecliptic latitude (90°=pole → straight up; 0°=in the plane)
function starDir(latDeg){
  const l=latDeg*Math.PI/180, c=Math.cos(l);
  return AIY.norm({x:0.88*c, y:Math.sin(l), z:-0.25*c});
}
// first-order aberration: displace by the component of v⃗ perpendicular to the star
function aberrate(star, vdir, k){
  const dot=star.x*vdir.x+star.y*vdir.y+star.z*vdir.z;
  return AIY.add(star, {x:k*(vdir.x-dot*star.x), y:k*(vdir.y-dot*star.y), z:k*(vdir.z-dot*star.z)});
}
function worldArrow(ctx, from, dir, len, color, w){
  const d=AIY.projectDir(dir); AIY.arrow(ctx, from, {x:from.x+d.x*len, y:from.y+d.y*len}, color, w);
}

AIY.drawSky = (ctx, st) => {
  const {cx,cy,squash} = AIY.view;
  const STAR = starDir(st.starLat);
  const phi  = st.phase/12 * 2*Math.PI;
  const vdir = AIY.norm({x:-Math.sin(phi), y:0, z:Math.cos(phi)});   // relative velocity dir (both frames)
  const k    = AIY.BETA * st.exagg;
  const app  = aberrate(STAR, vdir, k);

  const body   = AIY.project({x:ORBIT_PX*Math.cos(phi), y:0, z:ORBIT_PX*Math.sin(phi)});
  const center = {x:cx, y:cy};
  const earth  = st.frame==='geo' ? center : body;
  const sun    = st.frame==='geo' ? body   : center;

  // parallel incoming starlight
  const sd=AIY.norm(AIY.projectDir(STAR)), n={x:-sd.y,y:sd.x}, L=2400;
  ctx.strokeStyle='rgba(180,200,230,.16)'; ctx.lineWidth=1;
  for(let i=-3;i<=3;i++){ const o={x:cx+n.x*i*150, y:cy+n.y*i*150};
    ctx.beginPath(); ctx.moveTo(o.x-sd.x*L,o.y-sd.y*L); ctx.lineTo(o.x+sd.x*L,o.y+sd.y*L); ctx.stroke(); }

  // ecliptic plane + orbit ring
  const g=ctx.createRadialGradient(center.x,center.y,10,center.x,center.y,ORBIT_PX*1.5);
  g.addColorStop(0,'rgba(90,120,180,.16)'); g.addColorStop(1,'rgba(90,120,180,0)');
  ctx.save(); ctx.translate(center.x,center.y); ctx.scale(1,squash);
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,ORBIT_PX*1.5,0,7); ctx.fill();
  ctx.strokeStyle='rgba(150,175,215,.5)'; ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.arc(0,0,ORBIT_PX,0,7); ctx.stroke(); ctx.restore();

  // Sun
  const sg=ctx.createRadialGradient(sun.x,sun.y,4,sun.x,sun.y,60);
  sg.addColorStop(0,'#fff6d8'); sg.addColorStop(.4,'#ffd35a'); sg.addColorStop(1,'rgba(255,180,60,0)');
  ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sun.x,sun.y,60,0,7); ctx.fill();
  AIY.disc(ctx,sun,17,'#ffd35a');

  // annual aberration ellipse (exact, projectDir is linear) — collapses to a line near the plane
  ctx.strokeStyle='rgba(63,224,208,.55)'; ctx.lineWidth=1.2; ctx.beginPath();
  const STEPS=96;
  for(let i=0;i<=STEPS;i++){ const tt=i/STEPS*2*Math.PI, vd={x:-Math.sin(tt),y:0,z:Math.cos(tt)};
    const d=AIY.projectDir(aberrate(STAR,vd,k)), pt={x:earth.x+d.x*VEC_LEN, y:earth.y+d.y*VEC_LEN};
    i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);
  } ctx.closePath(); ctx.stroke();

  // Earth + tilted axis
  const ax=AIY.projectDir(AXIS), am=Math.hypot(ax.x,ax.y);
  ctx.setLineDash([5,5]); ctx.strokeStyle='rgba(230,238,246,.7)'; ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.moveTo(earth.x-ax.x/am*36, earth.y-ax.y/am*36);
  ctx.lineTo(earth.x+ax.x/am*36, earth.y+ax.y/am*36); ctx.stroke(); ctx.setLineDash([]);
  AIY.disc(ctx,earth,7,'#5aa0ff'); ctx.lineWidth=2; ctx.strokeStyle='#bcd6ff'; ctx.stroke();

  // vectors
  worldArrow(ctx, earth, STAR, VEC_LEN, '#f2c14e', 2.5);   // yellow true
  worldArrow(ctx, earth, app,  VEC_LEN, '#3fe0d0', 2.5);   // cyan apparent
  worldArrow(ctx, earth, vdir, VEL_LEN, '#ff5b6a', 2.5);   // red velocity
};
})();
