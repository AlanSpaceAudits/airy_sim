(function(){
/* ── Sky scene: stellar aberration in air (the orbital view) ───────────────
 * The annual aberration ellipse lies flat in the sky, with on-screen aspect
 * ratio = |sin(ecliptic latitude)|: a flat circle at the poles, tightening
 * evenly to a straight line at the ecliptic. The apparent star rides it, toward
 * the projected velocity.
 * ------------------------------------------------------------------------- */
'use strict';
const AIY = window.AIY = window.AIY || {};

const ORBIT_PX = 210;                                 // orbit radius, px
const VEC_LEN  = 165;                                 // star-vector length, world px
const VEL_LEN  = 120;                                 // velocity-vector length, world px
const FLAT     = 0.42;                                 // scene tilt: a sky-circle lies this flat on screen
const AXIS = AIY.norm({x:0.20, y:0.92, z:-0.40});     // Earth rotation axis, tilted 23.5° away

// star direction from ecliptic latitude (90°=pole → straight up; 0°=in the plane)
function starDir(latDeg){
  const l=latDeg*Math.PI/180, c=Math.cos(l);
  return AIY.norm({x:0.88*c, y:Math.sin(l), z:-0.25*c});
}
function worldArrow(ctx, from, dir, len, color, w){
  const d=AIY.projectDir(dir); AIY.arrow(ctx, from, {x:from.x+d.x*len, y:from.y+d.y*len}, color, w);
}

AIY.drawSky = (ctx, st) => {
  const {cx,cy,squash} = AIY.view;
  const STAR = starDir(st.starLat);
  const phi  = st.phase/12 * 2*Math.PI;
  const geo  = st.frame==='geo';
  const k    = AIY.BETA * st.exagg;

  // Earth→Sun direction is an observable: it must be the same on a given date in
  // either frame. Helio puts Earth at +P(φ) about the Sun, so geo puts the Sun at
  // −P(φ) about the Earth. s = −1 in geo carries that flip.
  const s = geo ? -1 : 1;
  const orbit = {x:s*ORBIT_PX*Math.cos(phi), y:0, z:s*ORBIT_PX*Math.sin(phi)};
  // Velocity of the moving body, tangent to its own path (d/dφ of its position).
  // Helio: the Earth moves at +v. Geo: the Earth is at rest and the sky streams
  // past at −v, which is also the Sun's orbital direction. Relative velocity, and
  // so the aberration, is identical either way.
  const vdir = AIY.norm({x:-s*Math.sin(phi), y:0, z:s*Math.cos(phi)});
  // Earth's velocity relative to the sky. Frame-independent, so aberration is too.
  const abdir = AIY.norm({x:-Math.sin(phi), y:0, z:Math.cos(phi)});

  const body   = AIY.project(orbit);
  const center = {x:cx, y:cy};
  const earth  = geo ? center : body;
  const sun    = geo ? body   : center;

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

  // annual aberration ellipse — flat in the sky, on-screen aspect = |sin(latitude)|:
  // horizontal major (along the ecliptic), vertical minor that vanishes at the ecliptic.
  const sTip=AIY.projectDir(STAR);
  const starTip={x:earth.x+sTip.x*VEC_LEN, y:earth.y+sTip.y*VEC_LEN};
  const A=k*VEC_LEN, aMin=A*FLAT*Math.abs(Math.sin(st.starLat*Math.PI/180));
  ctx.strokeStyle='rgba(63,224,208,.55)'; ctx.lineWidth=1.2; ctx.beginPath();
  for(let i=0;i<=96;i++){ const th=i/96*2*Math.PI;
    const pt={x:starTip.x+A*Math.cos(th), y:starTip.y+aMin*Math.sin(th)};
    i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);
  } ctx.closePath(); ctx.stroke();
  // Apparent star sits on the ellipse, displaced along the Earth's velocity
  // RELATIVE TO THE SKY — abdir, not the drawn arrow. Stopping the Earth and
  // streaming the sky the other way leaves that relative velocity unchanged, so
  // the displacement is identical in both frames. That is the reciprocity.
  const vd2=AIY.projectDir(abdir), vm=Math.hypot(vd2.x,vd2.y)||1;
  const appTip={x:starTip.x+A*vd2.x/vm, y:starTip.y+aMin*vd2.y/vm};

  // Earth + tilted axis
  const ax=AIY.projectDir(AXIS), am=Math.hypot(ax.x,ax.y);
  ctx.setLineDash([5,5]); ctx.strokeStyle='rgba(230,238,246,.7)'; ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.moveTo(earth.x-ax.x/am*36, earth.y-ax.y/am*36);
  ctx.lineTo(earth.x+ax.x/am*36, earth.y+ax.y/am*36); ctx.stroke(); ctx.setLineDash([]);
  AIY.disc(ctx,earth,7,'#5aa0ff'); ctx.lineWidth=2; ctx.strokeStyle='#bcd6ff'; ctx.stroke();

  // vectors
  worldArrow(ctx, earth, STAR, VEC_LEN, '#f2c14e', 2.5);   // yellow true
  AIY.arrow(ctx, earth, appTip, '#3fe0d0', 2.5);           // cyan apparent (on the ellipse)
  worldArrow(ctx, earth, vdir, VEL_LEN, '#ff5b6a', 2.5);   // red velocity
};
})();
