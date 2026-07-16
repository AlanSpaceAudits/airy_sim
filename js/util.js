(function(){
/* ── Shared helpers: vectors, orthographic projection, canvas primitives ──── */
'use strict';
const AIY = window.AIY = window.AIY || {};

// Scene centre + depth compression, set by main.js on resize.
AIY.view = { cx:0, cy:0, squash:0.42 };

// 3-vectors (world: x right, y up, z depth)
AIY.add  = (a,b) => ({x:a.x+b.x, y:a.y+b.y, z:a.z+b.z});
AIY.scale= (a,s) => ({x:a.x*s, y:a.y*s, z:a.z*s});
AIY.norm = a => { const m=Math.hypot(a.x,a.y,a.z)||1; return AIY.scale(a,1/m); };

// world → screen
AIY.project    = p => ({x:AIY.view.cx + p.x, y:AIY.view.cy - p.y + p.z*AIY.view.squash});
AIY.projectDir = d => ({x:d.x, y:-d.y + d.z*AIY.view.squash});

// filled circle
AIY.disc = (ctx,p,r,c) => { ctx.fillStyle=c; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill(); };

// arrow between two screen points, with head
AIY.arrow = (ctx, from, to, color, w) => {
  const ang = Math.atan2(to.y-from.y, to.x-from.x), h=11;
  ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=w; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(to.x,to.y);
  ctx.lineTo(to.x-h*Math.cos(ang-0.4), to.y-h*Math.sin(ang-0.4));
  ctx.lineTo(to.x-h*Math.cos(ang+0.4), to.y-h*Math.sin(ang+0.4));
  ctx.closePath(); ctx.fill();
};

// text helper
AIY.text = (ctx, s, x, y, color, font, align='left') => {
  ctx.fillStyle=color; ctx.font=font; ctx.textAlign=align; ctx.textBaseline='middle';
  ctx.fillText(s, x, y);
};
})();
