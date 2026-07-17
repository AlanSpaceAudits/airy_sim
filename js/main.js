(function(){
/* ── Main: state, controls, scene dispatch, animation loop ─────────────────*/
'use strict';
const AIY = window.AIY;

const canvas = document.getElementById('scene'), ctx = canvas.getContext('2d');
const $ = id => document.getElementById(id);

// default view = aberration in air, heliocentric
const state = { theory:'air', frame:'helio', phase:5.43, exagg:3500, starLat:45, animate:true, view:'cali' };
const latLabel = v => Math.abs(v)+'° '+(v<0?'S':v>0?'N':'');

// ── Canvas + hi-dpi ────────────────────────────────────────────────────────
function resize(){
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  AIY.view.cx = innerWidth*0.56; AIY.view.cy = innerHeight*0.52;
}
addEventListener('resize', resize); resize();

// ── Populate theory selector ───────────────────────────────────────────────
for(const [key,t] of Object.entries(AIY.THEORIES)){
  const o=document.createElement('option'); o.value=key; o.textContent=t.label; $('theory').appendChild(o);
}

// ── Contextual controls: which panel bits apply to the current theory ──────
function syncControls(){
  const t = AIY.THEORIES[state.theory], sky = t.scene==='sky';
  $('row-lat').style.display   = sky ? '' : 'none';
  $('row-phase').style.display = sky ? '' : 'none';
  $('row-exagg').style.display = sky ? '' : 'none';
  const showFrame = sky || t.frames;
  $('frame-wrap').style.display = showFrame ? '' : 'none';
  $('row-view').style.display = sky ? 'none' : '';   // tube scenes only
  if(sky){                                             // heliocentric / geocentric
    $('btn-frameA').textContent='Heliocentric'; $('btn-frameA').dataset.v='helio';
    $('btn-frameB').textContent='Geocentric';   $('btn-frameB').dataset.v='geo';
    $('k-vel').textContent = state.frame==='geo' ? 'Sky velocity' : 'Earth velocity';
  } else if(t.frames){                                 // water at rest / in motion
    $('btn-frameA').textContent='Water at rest'; $('btn-frameA').dataset.v='rest';
    $('btn-frameB').textContent='Water in motion'; $('btn-frameB').dataset.v='moving';
    $('k-vel').textContent = 'Velocity';
  }
  setFrameButtons();
}
function setFrameButtons(){
  $('btn-frameA').classList.toggle('active', state.frame===$('btn-frameA').dataset.v);
  $('btn-frameB').classList.toggle('active', state.frame===$('btn-frameB').dataset.v);
}

// ── Live math legend ───────────────────────────────────────────────────────
function updateMath(){
  const t = AIY.THEORIES[state.theory];
  $('m-title').textContent = t.label;
  $('m-formula').textContent = t.formula;
  $('m-note').textContent = t.blurb;
  const rows = [];
  if(t.scene==='sky'){
    rows.push(['α = arctan(v/c)', AIY.ALPHA.toFixed(2)+'″']);
    rows.push(['shown (×'+state.exagg+')', (AIY.ALPHA*state.exagg/3600).toFixed(2)+'°']);
    $('m-verdict').innerHTML = 'v<sub>earth</sub> = w<sub>sky</sub> &rArr; '
      + '&alpha;<sub>helio</sub> = &alpha;<sub>geo</sub> = 20.55″';
    $('m-scale').style.display = 'none';
  } else {
    const V = AIY.viewData(t, state.frame, state.view);
    const fmt=(v,u)=> u==='µm' ? v.toFixed(1)+' µm' : v.toFixed(2)+'″';
    rows.push(['this theory predicts', fmt(V.wv,V.unit)]);
    rows.push(['Airy '+V.labWord+' ('+V.tag+')', fmt(V.lab,V.unit)]);
    rows.push(['θ_int (in water)', V.thInt.toFixed(2)+'″']);
    rows.push(['plate drift', AIY.drift(V.thInt).toFixed(1)+' µm']);
    rows.push(['speed in water', (t.speed/AIY.C).toFixed(2)+' c']);
    const th = V.thInt, reading = th*AIY.N, match = V.match;
    $('m-verdict').innerHTML = match
      ? '<span class="ok">✓ prediction matches Airy ('+fmt(V.lab,V.unit)+')</span>'
      : '<span class="bad">✗ predicts '+fmt(V.wv,V.unit)+' — Airy '+V.labWord+' '+fmt(V.lab,V.unit)+'</span>';
    // micrometer-scale numerics: raw air-scale angle vs the ×n calibrated reading
    const r=(a,b,hit)=>`<div class="r${hit?' hit':''}"><span>${a}</span><b>${b}</b></div>`;
    $('m-scale').style.display = '';
    $('m-scale').innerHTML =
      '<div class="sh">MICROMETER SCALE (Airy p.39)</div>'
      + r('raw angle (air scale)', th.toFixed(2)+'″')
      + r('water scale', '× '+AIY.N.toFixed(2)+'  (37.0 / 27.8 in)')
      + r('calibrated reads', reading.toFixed(2)+'″', match);
  }
  $('m-rows').innerHTML = rows.map(r =>
    `<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
}

// ── Render one frame ───────────────────────────────────────────────────────
function render(clock){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  if(AIY.THEORIES[state.theory].scene==='sky') AIY.drawSky(ctx, state);
  else AIY.drawTube(ctx, state, clock);
  updateMath();
}

// ── Control wiring ─────────────────────────────────────────────────────────
$('theory').addEventListener('change', e=>{
  state.theory = e.target.value;
  const t = AIY.THEORIES[state.theory];
  state.frame = t.scene==='sky' ? 'helio' : (t.frames ? 'rest' : 'rest');
  syncControls();
});
[$('btn-frameA'),$('btn-frameB')].forEach(b=>b.addEventListener('click',()=>{
  state.frame=b.dataset.v; setFrameButtons();
  if(AIY.THEORIES[state.theory].scene==='sky') syncControls();  // relabel velocity key
}));
$('lat').addEventListener('input', e=>{ state.starLat=+e.target.value; $('v-lat').textContent=latLabel(state.starLat); });
$('phase').addEventListener('input', e=>{ state.phase=+e.target.value; $('v-phase').textContent=state.phase.toFixed(2); });
$('exagg').addEventListener('input', e=>{ state.exagg=+e.target.value; $('v-exagg').innerHTML=state.exagg+'&times;'; });
$('animate').addEventListener('change', e=>{ state.animate=e.target.checked; });
$('view').addEventListener('change', e=>{ state.view=e.target.value; });

// ── Animation loop ─────────────────────────────────────────────────────────
let clock=0, last=0;
function loop(ts){
  const dt=(ts-last)/1000; last=ts;
  if(state.animate){
    clock+=dt;
    if(AIY.THEORIES[state.theory].scene==='sky'){
      state.phase=(state.phase+dt*1.4)%12;
      $('phase').value=state.phase; $('v-phase').textContent=state.phase.toFixed(2);
    }
  }
  render(clock); requestAnimationFrame(loop);
}
syncControls();
requestAnimationFrame(t=>{ last=t; loop(t); });
})();
