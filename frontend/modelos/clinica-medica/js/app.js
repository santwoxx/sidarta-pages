// ATLAS ORTHOPEDICS — app.js
// GSAP and ScrollTrigger are loaded via CDN in index.html before this script

gsap.registerPlugin(ScrollTrigger);

/* ─── DOCTOR DATA ─────────────────────────── */
const DOCTORS = [
  { id:'lukas', name:'Dr. Lukas Brandt', specialty:'Spine Surgery', color:'#5FB8E6',
    img:'assets/images/doctor-lukas-new.webp', thumb:'assets/images/doctor-lukas-thumb.webp', years:18,
    action:'assets/images/action-lukas.webp', edu:'MD · Spine Fellowship, Charité Berlin', cases:'3,200+ spine procedures',
    stats:{precision:97,technique:95,experience:92},
    quote:'The spine is the architecture of movement. I restore the structure so life can move freely again.',
    treatments:['Microdiscectomy','Spinal Decompression','Disc Replacement'] },
  { id:'marie', name:'Dr. Marie Hoffmann', specialty:'Joint Replacement', color:'#C7CDD6',
    img:'assets/images/doctor-marie-new.webp', thumb:'assets/images/doctor-marie-thumb.webp', years:16,
    action:'assets/images/action-marie.webp', edu:'MD · Endoprosthetics, Heidelberg', cases:'2,800+ joint replacements',
    stats:{precision:96,technique:94,experience:90},
    quote:'A new joint is a new beginning. My goal is a knee or hip you simply forget you have.',
    treatments:['Robotic Knee Replacement','Hip Endoprosthesis','Partial Knee'] },
  { id:'felix', name:'Dr. Felix Wagner', specialty:'Sports Orthopedics', color:'#7FA8C9',
    img:'assets/images/doctor-felix-new.webp', thumb:'assets/images/doctor-felix-thumb.webp', years:12,
    action:'assets/images/action-felix.webp', edu:'MD · Sports Medicine, Munich', cases:'2,100+ arthroscopies',
    stats:{precision:94,technique:96,experience:86},
    quote:'Athletes don\'t want to heal — they want to perform. I get people back to their sport, stronger.',
    treatments:['ACL Reconstruction','Meniscus Repair','Shoulder Arthroscopy'] },
  { id:'sophia', name:'Dr. Sophia Klein', specialty:'Hand & Foot Surgery', color:'#8FD4C4',
    img:'assets/images/doctor-sophia-new.webp', thumb:'assets/images/doctor-sophia-thumb.webp', years:14,
    action:'assets/images/action-sophia.webp', edu:'MD · Hand & Microsurgery, Vienna', cases:'1,900+ hand & foot procedures',
    stats:{precision:96,technique:93,experience:88},
    quote:'The hand is how we touch the world. Precision here is never optional.',
    treatments:['Carpal Tunnel Release','Bunion Correction','Tendon Repair'] },
  { id:'jonas', name:'Dr. Jonas Reuter', specialty:'Conservative & Pain', color:'#A9B2BD',
    img:'assets/images/doctor-jonas-new.webp', thumb:'assets/images/doctor-jonas-thumb.webp', years:22,
    action:'assets/images/action-jonas.webp', edu:'MD · Pain Medicine, Hamburg', cases:'9,000+ patients treated',
    stats:{precision:92,technique:90,experience:98},
    quote:'Surgery is the last resort, not the first. Often the body can heal — it just needs the right guidance.',
    treatments:['Spinal Injections','Shockwave Therapy','Osteoporosis Care'] }
];

/* ─── HELPER ──────────────────────────────── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

/* ─── ECHOES-STYLE CHARACTER SELECT ─────────── */
const CS_DOCTORS = DOCTORS.map((d, i) => ({
  ...d,
  mapPos: [{x:20,y:12},{x:75,y:28},{x:50,y:8},{x:22,y:58},{x:74,y:62}][i],
  hHeight: ['92%','96%','98%','90%','94%'][i],
  groundOffset: ['0%','8%','5%','0%','6%'][i],
  hX: 50,
  bio: [
    "Lukas specializes in minimally invasive spine surgery and complex disc reconstruction — treating herniated discs, spinal stenosis and scoliosis with navigation-guided precision.",
    "Marie leads our endoprosthetics program — robotic-assisted hip and knee replacements with rapid-recovery protocols that get patients moving within hours.",
    "Felix is our sports-orthopedics and arthroscopy specialist — repairing ACL tears, meniscus and rotator-cuff injuries through keyhole surgery with accelerated return-to-play rehab.",
    "Sophia restores function to hands and feet — from carpal tunnel and arthritis to bunion correction and complex tendon repair — with microsurgical precision.",
    "Jonas leads non-surgical care — targeted injections, shockwave therapy, osteoporosis management and pain medicine that help most patients avoid the operating room entirely."
  ][i]
}));

/* ─── CS CROP SYSTEM (CSS clip-path, no sips needed for preview) ──── */
// CS_ORIG reflects current -new.png files (already cropped by sips)
const CS_ORIG = [
  { w:774,  h:880,  src:'assets/images/doctor-lukas-new.png',  out:'assets/images/doctor-lukas-new.png' },
  { w:1315, h:1460, src:'assets/images/doctor-marie-new.png',  out:'assets/images/doctor-marie-new.png' },
  { w:1384, h:1569, src:'assets/images/doctor-felix-new.png',  out:'assets/images/doctor-felix-new.png' },
  { w:1484, h:1656, src:'assets/images/doctor-sophia-new.png', out:'assets/images/doctor-sophia-new.png' },
  { w:683,  h:767,  src:'assets/images/doctor-jonas-new.png',  out:'assets/images/doctor-jonas-new.png' },
];
const CS_CROP_DEFAULT = [1.0, 1.0, 1.0, 1.0, 1.0];
const CS_ZOOM_DEFAULT = [1.0, 1.0, 1.0, 1.0, 1.0];
let csCropFracs = (() => {
  try { const s = localStorage.getItem('atlas-cs-crops'); return s ? JSON.parse(s) : CS_CROP_DEFAULT.slice(); }
  catch(e) { return CS_CROP_DEFAULT.slice(); }
})();
let csZoomFracs = (() => {
  try { const s = localStorage.getItem('atlas-cs-zooms'); return s ? JSON.parse(s) : CS_ZOOM_DEFAULT.slice(); }
  catch(e) { return CS_ZOOM_DEFAULT.slice(); }
})();
function csCropApply() {
  csCharEls.forEach((el, i) => {
    el.style.clipPath = `inset(0 0 ${((1 - csCropFracs[i]) * 100).toFixed(2)}% 0)`;
  });
}
function csZoomApply() {
  csCharEls.forEach((el, i) => {
    const img = el.querySelector('img');
    if (img) { img.style.transform = `scale(${csZoomFracs[i]})`; img.style.transformOrigin = 'top center'; }
  });
}

const csStage = document.getElementById('cs-stage');
const csCharEls = [], csHotspotEls = [], csHudEntries = [];
let csActive = 0; // Lukas default
let csPrevActive = -1;
let csAnimating = false;

// build chars + hotspots
CS_DOCTORS.forEach((d, i) => {
  const el = document.createElement('div');
  el.className = 'char-item';
  el.innerHTML = `
    <img src="${d.img}" alt="${d.name}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <div class="char-fallback" style="color:${d.color}">${d.name.split(' ').slice(-1)[0][0]}</div>
  `;
  el.addEventListener('click', () => {
    if (csAnimating) return;
    i === csActive ? openDoctorStory() : csGoTo(i);
  });
  csStage.appendChild(el);
  csCharEls.push(el);

  // hotspot
  const hs = document.createElement('div');
  hs.className = 'hotspot';
  hs.style.setProperty('--spot-color', d.color);
  hs.style.left = d.mapPos.x + '%';
  hs.style.top  = d.mapPos.y + '%';
  hs.innerHTML  = `<div class="hotspot-ring"></div><div class="hotspot-dot"></div><div class="hotspot-label">${d.name.split(' ').slice(-1)[0]}</div>`;
  hs.addEventListener('click', () => { if (!csAnimating) csGoTo(i); });
  csStage.appendChild(hs);
  csHotspotEls.push(hs);
});

// build HUD
const hudEl = document.getElementById('doctor-hud');
CS_DOCTORS.forEach((d, i) => {
  const entry = document.createElement('div');
  entry.className = 'hud-entry';
  entry.style.setProperty('--hud-color', d.color);
  entry.innerHTML = `<img class="hud-thumb" src="${d.thumb}" alt="${d.name}" loading="lazy" onerror="this.style.visibility='hidden'"><div class="hud-meta"><div class="hud-name">${d.name.split(' ').slice(-1)[0]}</div><div class="hud-spec">${d.specialty}</div></div>`;
  entry.addEventListener('click', () => { if (!csAnimating) csGoTo(i); });
  hudEl.appendChild(entry);
  csHudEntries.push(entry);
});

// ── Variant-aware character layout ───────────────────────────
// v1 single+rail | v2 3D coverflow | v3 elliptical orbit | v4 team lineup
let csVariant = localStorage.getItem('atlas-cv') || 'v4';

function csComputeProps(v, i) {
  let rel = i - csActive; if (rel > 2) rel -= 5; if (rel < -2) rel += 5;
  const a = Math.abs(rel);
  // MOBILE (≤640px): active = big & solid & grounded; ALL neighbours = equal small size + ghosted.
  // Grounding handled in CSS (object-position:bottom + max-width:none, no letterbox float).
  if (typeof window !== 'undefined' && window.matchMedia('(max-width:640px)').matches) {
    // Atlas doctor images are near-square BUST crops (person fills frame) → smaller heights than Ivory
    return { left: 50 + rel*32, bottom: 0, height: a===0 ? 62 : 42,
      scale: 1, rotY: 0, opacity: a>2 ? 0 : (a===0 ? 1 : (a===1 ? 0.85 : 0.55)),
      z: 30 - a*8, filter: a===0 ? 'none' : `brightness(${a===1 ? 0.85 : 0.6})` };
  }
  if (v === 'v3') { // elliptical orbit — back ones lift up & shrink (solid, no tilt)
    return { left: 50 + rel*23, bottom: a*a*4.5, height: 102 - a*a*9,
      scale: 1 - a*0.26, rotY: 0, opacity: a>2 ? 0 : (a<=1 ? 1 : 0.8),
      z: 30 - a*8, filter: a===0 ? 'none' : `brightness(${a===1 ? 0.7 : 0.5})` };
  }
  // v4+ — height-based grounded lineup, exact Ivory settings
  if (v === 'v4' || v === 'v5' || v === 'v6' || v === 'v7' || v === 'v8' || v === 'v9' || v === 'v10') {
    const dim = a === 0 ? 'none' : `brightness(${a === 1 ? 0.20 : 0.09})`;
    return { left: 50 + rel*26, bottom: 0, height: a===0 ? 83 : (a===1 ? 56 : 42),
      scale: 1, rotY: 0, opacity: a>2 ? 0 : (a<=1 ? 1 : 0.82),
      z: 30 - a*8, filter: dim };
  }
  // v1 + v2 — single featured doctor, centered
  return rel === 0
    ? { left:50, bottom:0, height:90, scale:1, rotY:0, opacity:1, z:10, filter:'none' }
    : { left:50, bottom:0, height:90, scale:1, rotY:0, opacity:0, z:1,  filter:'none' };
}

function csLayout(animate) {
  CS_DOCTORS.forEach((d, i) => {
    const el = csCharEls[i];
    const p = csComputeProps(csVariant, i);
    const t = {
      left: p.left + '%', bottom: p.bottom + '%', height: p.height + '%',
      xPercent: -50, scale: p.scale, rotationY: p.rotY, opacity: p.opacity,
      zIndex: p.z, filter: p.filter, transformPerspective: 1200,
      transformOrigin: 'bottom center', pointerEvents: p.opacity > 0.15 ? 'auto' : 'none'
    };
    animate ? gsap.to(el, { ...t, duration: 0.7, ease: 'power3.out' }) : gsap.set(el, t);
  });
  csCropApply();
  csZoomApply();
}

function csUpdateUI(idx) {
  const d = CS_DOCTORS[idx];
  document.getElementById('cs-doc-specialty').textContent = d.specialty;
  document.getElementById('cs-doc-specialty').style.color = d.color;
  document.getElementById('cs-doc-name').textContent = d.name;
  document.getElementById('cs-doc-bio').textContent = d.bio;
  document.getElementById('cs-stat-pre').style.width = d.stats.precision+'%';
  document.getElementById('cs-stat-pre-val').textContent = d.stats.precision;
  document.getElementById('cs-stat-tec').style.width = d.stats.technique+'%';
  document.getElementById('cs-stat-tec-val').textContent = d.stats.technique;
  document.getElementById('cs-stat-exp').style.width = d.stats.experience+'%';
  document.getElementById('cs-stat-exp-val').textContent = d.stats.experience;
  document.getElementById('cs-stat-pre').style.background = d.color;
  document.getElementById('cs-stat-tec').style.background = d.color;
  document.getElementById('cs-stat-exp').style.background = d.color;
  document.getElementById('cs-book-btn').style.borderColor = d.color;
  document.getElementById('cs-book-btn').style.color = d.color;
  document.getElementById('cs-counter-num').textContent = String(idx+1).padStart(2,'0');
  csHudEntries.forEach((e, i) => e.classList.toggle('active', i === idx));
  // update accent color for the stage elements
  csStage.style.setProperty('--accent', d.color);
}

function csGoTo(target) {
  const t = ((target % 5) + 5) % 5;
  if (csAnimating || t === csActive) return;
  csAnimating = true;
  csPrevActive = csActive;
  csActive = t;
  if (typeof csSwitchFx === 'function') csSwitchFx(t);
  const infoEls = ['#cs-doc-specialty', '#cs-doc-name', '#cs-doc-bio', '#cs-doc-stats', '#cs-book-btn'];
  gsap.to(infoEls, {opacity: 0, y: -8, duration: .18, ease: 'power2.in', onComplete: () => {
    csUpdateUI(t);
    gsap.fromTo(infoEls, {opacity: 0, y: 8}, {opacity: 1, y: 0, stagger: .06, duration: .42, ease: 'power3.out'});
  }});
  csLayout(true);
  setTimeout(() => { csAnimating = false; }, 820);
}

function csSyncAll() { csLayout(false); }

// story panel
const csStoryPanel = document.getElementById('cs-story-panel');
const csStoryOverlay = document.getElementById('cs-story-overlay');
gsap.set(csStoryPanel, {x: '-100%'});

function openDoctorStory() {
  const d = CS_DOCTORS[csActive];
  document.getElementById('cs-story-img').src = d.action || d.img;
  document.getElementById('cs-story-specialty').textContent = d.specialty;
  document.getElementById('cs-story-specialty').style.color = d.color;
  document.getElementById('cs-story-name').textContent = d.name;
  const yrs = document.getElementById('cs-story-years');
  yrs.textContent = d.years + ' Years'; yrs.style.color = d.color;
  document.getElementById('cs-story-edu').textContent = d.edu || '';
  document.getElementById('cs-story-quote').textContent = '“' + d.quote + '”';
  document.getElementById('cs-story-bio').textContent = d.bio;
  document.getElementById('cs-story-cases').textContent = d.cases || '';
  document.getElementById('cs-story-treatments').innerHTML =
    (d.treatments || []).map(t => `<span class="cs-treat-tag">${t}</span>`).join('');
  csStoryPanel.style.setProperty('--doc', d.color);
  ['pre','tec','exp'].forEach((k, i) => {
    const val = [d.stats.precision, d.stats.technique, d.stats.experience][i];
    const fill = document.getElementById('cs-st-'+k);
    fill.style.width = '0%'; fill.style.background = d.color;
    document.getElementById('cs-st-'+k+'-val').textContent = val;
    document.getElementById('cs-st-'+k+'-val').style.color = d.color;
    setTimeout(() => { fill.style.width = val+'%'; }, 350 + i*120);
  });
  document.getElementById('cs-story-body').scrollTop = 0;
  gsap.fromTo('#cs-story-img', {scale: 1.08}, {scale: 1, duration: 1.1, ease: 'power3.out'});
  gsap.to(csStoryPanel, {x: 0, duration: .55, ease: 'power3.out'});
  csStoryOverlay.classList.add('active');
}
window.closeDoctorStory = function() {
  gsap.to(csStoryPanel, {x: '-100%', duration: .4, ease: 'power3.in'});
  csStoryOverlay.classList.remove('active');
};

// arrows + keyboard
document.getElementById('cs-btn-next').addEventListener('click', () => csGoTo(csActive+1));
document.getElementById('cs-btn-prev').addEventListener('click', () => csGoTo(csActive-1));
// mobile "tap for full profile" hint → opens the active doctor's story panel
var csHintEl = document.getElementById('cs-mobile-hint');
if (csHintEl) csHintEl.addEventListener('click', function(e){ e.stopPropagation(); openDoctorStory(); });
// under-name prev / next arrows (mobile)
var csPrevBtn = document.getElementById('cs-prev'), csNextBtn = document.getElementById('cs-next');
if (csPrevBtn) csPrevBtn.addEventListener('click', function(e){ e.stopPropagation(); if (!csAnimating) csGoTo(csActive - 1); });
if (csNextBtn) csNextBtn.addEventListener('click', function(e){ e.stopPropagation(); if (!csAnimating) csGoTo(csActive + 1); });
// mobile: swipe left / right to change specialist
var csTouchX = null, csTouchY = null;
csStage.addEventListener('touchstart', function(e){ csTouchX = e.touches[0].clientX; csTouchY = e.touches[0].clientY; }, { passive: true });
csStage.addEventListener('touchend', function(e){
  if (csTouchX === null) return;
  var dx = e.changedTouches[0].clientX - csTouchX;
  var dy = e.changedTouches[0].clientY - csTouchY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && !csAnimating) {
    csGoTo(csActive + (dx < 0 ? 1 : -1)); // swipe left → next, right → previous
  }
  csTouchX = null; csTouchY = null;
}, { passive: true });
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') csGoTo(csActive+1);
  if (e.key === 'ArrowLeft')  csGoTo(csActive-1);
  if (e.key === 'Escape') closeDoctorStory();
  if (e.key === 'd' || e.key === 'D') csDevToggle();
});

// init CS
const csSectionEl = document.getElementById('character-select');
csSectionEl.dataset.cv = csVariant;
csUpdateUI(csActive);
csSyncAll();
gsap.set(['#cs-doc-specialty','#cs-doc-name','#cs-doc-bio','#cs-doc-stats','#cs-book-btn'], {opacity: 1, y: 0});

/* ─── CS DEV PANEL (Crop + Zoom live) ─────────── */
let csDevOpen = false;
const csDevPanel = (() => {
  const panel = document.createElement('div');
  panel.id = 'cs-dev-panel';
  panel.style.cssText = [
    'display:none','position:fixed','bottom:0','left:0','right:0','z-index:9999',
    'background:rgba(6,6,6,0.97)','border-top:2px solid #5FB8E6',
    'padding:12px 20px 18px','font-family:system-ui,sans-serif'
  ].join(';');

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:10px;';
  header.innerHTML = `
    <span style="color:#5FB8E6;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;font-weight:bold;">&#9881;&#65039; CROP + ZOOM &#8212; D = schlie&szlig;en</span>
    <button id="cs-dev-save" style="margin-left:auto;background:#22c55e;color:#000;border:none;border-radius:4px;padding:4px 14px;font-size:0.7rem;font-weight:bold;cursor:pointer;">Speichern</button>
    <button id="cs-dev-copy" style="background:#5FB8E6;color:#000;border:none;border-radius:4px;padding:4px 14px;font-size:0.7rem;font-weight:bold;cursor:pointer;">sips-Befehle</button>
  `;
  panel.appendChild(header);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;gap:20px;flex-wrap:wrap;';
  panel.appendChild(grid);

  CS_DOCTORS.forEach((d, i) => {
    const o = CS_ORIG[i];
    const col = document.createElement('div');
    col.style.cssText = 'flex:1;min-width:140px;display:flex;flex-direction:column;gap:3px;';

    const name = document.createElement('div');
    name.style.cssText = 'color:#aaa;font-size:0.58rem;text-transform:uppercase;letter-spacing:0.1em;font-weight:bold;margin-bottom:2px;';
    name.textContent = d.name.split(' ').pop();

    // CROP
    const cropLbl = document.createElement('div');
    cropLbl.style.cssText = 'color:#666;font-size:0.55rem;';
    cropLbl.textContent = 'Crop (unten abschneiden)';

    const cropSlider = document.createElement('input');
    cropSlider.type = 'range'; cropSlider.min = '40'; cropSlider.max = '100'; cropSlider.step = '1';
    cropSlider.value = Math.round(csCropFracs[i] * 100);
    cropSlider.style.cssText = 'width:100%;accent-color:#ef4444;cursor:pointer;';

    const cropVal = document.createElement('div');
    cropVal.style.cssText = 'color:#ef4444;font-size:0.65rem;font-weight:bold;font-variant-numeric:tabular-nums;';

    function refreshCrop() {
      csCropFracs[i] = parseInt(cropSlider.value) / 100;
      const pxH = Math.round(o.h * csCropFracs[i]);
      cropVal.textContent = cropSlider.value + '% · ' + pxH + 'px';
      csCropApply();
    }
    cropSlider.addEventListener('input', refreshCrop);
    refreshCrop();

    // ZOOM
    const zoomLbl = document.createElement('div');
    zoomLbl.style.cssText = 'color:#666;font-size:0.55rem;margin-top:5px;';
    zoomLbl.textContent = 'Zoom (Figur vergrößern)';

    const zoomSlider = document.createElement('input');
    zoomSlider.type = 'range'; zoomSlider.min = '70'; zoomSlider.max = '200'; zoomSlider.step = '5';
    zoomSlider.value = Math.round(csZoomFracs[i] * 100);
    zoomSlider.style.cssText = 'width:100%;accent-color:#5FB8E6;cursor:pointer;';

    const zoomVal = document.createElement('div');
    zoomVal.style.cssText = 'color:#5FB8E6;font-size:0.65rem;font-weight:bold;font-variant-numeric:tabular-nums;';

    function refreshZoom() {
      csZoomFracs[i] = parseInt(zoomSlider.value) / 100;
      zoomVal.textContent = zoomSlider.value + '%';
      csZoomApply();
    }
    zoomSlider.addEventListener('input', refreshZoom);
    refreshZoom();

    // Reset
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = 'background:none;border:1px solid #2a2a2a;color:#444;border-radius:3px;padding:2px 8px;font-size:0.55rem;cursor:pointer;align-self:flex-start;margin-top:4px;';
    resetBtn.addEventListener('click', () => {
      cropSlider.value = Math.round(CS_CROP_DEFAULT[i] * 100); refreshCrop();
      zoomSlider.value = 100; refreshZoom();
    });

    col.append(name, cropLbl, cropSlider, cropVal, zoomLbl, zoomSlider, zoomVal, resetBtn);
    grid.appendChild(col);
  });

  panel.querySelector('#cs-dev-save').addEventListener('click', () => {
    localStorage.setItem('atlas-cs-crops', JSON.stringify(csCropFracs));
    localStorage.setItem('atlas-cs-zooms', JSON.stringify(csZoomFracs));
    const btn = panel.querySelector('#cs-dev-save');
    btn.textContent = 'Gespeichert!';
    setTimeout(() => { btn.textContent = 'Speichern'; }, 2000);
  });

  panel.querySelector('#cs-dev-copy').addEventListener('click', () => {
    localStorage.setItem('atlas-cs-crops', JSON.stringify(csCropFracs));
    localStorage.setItem('atlas-cs-zooms', JSON.stringify(csZoomFracs));
    const lines = CS_DOCTORS.map((d, i) => {
      const o = CS_ORIG[i];
      const keptH = Math.round(o.h * csCropFracs[i]);
      return '# ' + d.name.split(' ').pop() + ' (zoom ' + Math.round(csZoomFracs[i]*100) + '%, crop ' + keptH + 'px)\nsips --cropToHeightWidth ' + keptH + ' ' + o.w + ' --cropOffset 0 0 "' + o.src + '" --out "' + o.out + '"';
    });
    navigator.clipboard.writeText('#!/bin/bash\ncd ~/Projects/atlas-orthopaedie\n\n' + lines.join('\n\n'));
    const btn = panel.querySelector('#cs-dev-copy');
    btn.textContent = 'Kopiert!'; btn.style.background = '#22c55e';
    setTimeout(() => { btn.textContent = 'sips-Befehle'; btn.style.background = '#5FB8E6'; }, 2500);
  });

  document.body.appendChild(panel);
  return panel;
})();

function csDevToggle() {
  csDevOpen = !csDevOpen;
  csDevPanel.style.display = csDevOpen ? 'block' : 'none';
}

// Character-select layout switcher (V1–V4)
document.querySelectorAll('#cs-vsw .vsw-btn').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.cv === csVariant);
  btn.addEventListener('click', () => {
    if (csAnimating) return;
    csVariant = btn.dataset.cv;
    csSectionEl.dataset.cv = csVariant;
    document.querySelectorAll('#cs-vsw .vsw-btn').forEach(b => b.classList.toggle('active', b === btn));
    localStorage.setItem('atlas-cv', csVariant);
    csLayout(true);
    applyVariantEffects();
  });
});

/* ─── Character-Select V5–V10 effect layers (additive; V1–V4 untouched) ─── */
const csSpot = document.createElement('div'); csSpot.id = 'cs-spotlight'; csStage.appendChild(csSpot);
const csAura = document.createElement('div'); csAura.id = 'cs-aura';
for (let i = 0; i < 14; i++) { const p = document.createElement('span'); p.className = 'cs-aura-p'; p.style.setProperty('--i', i); csAura.appendChild(p); }
csStage.appendChild(csAura);

function csSwitchFx(t) {
  if (csVariant === 'v7' || csVariant === 'v5') {           // holographic scan-in
    const el = csCharEls[t];
    if (el) { el.classList.remove('cs-holo'); void el.offsetWidth; el.classList.add('cs-holo');
      setTimeout(() => el.classList.remove('cs-holo'), 900); }
  }
  if (csVariant === 'v10') {                                 // cinematic motion-blur flash
    csStage.classList.add('cs-mblur');
    setTimeout(() => csStage.classList.remove('cs-mblur'), 600);
  }
}

let csOrbit = null, csHover = false;
csStage.addEventListener('pointerenter', () => { csHover = true; });
csStage.addEventListener('pointerleave', () => { csHover = false; });
function startOrbit() {
  stopOrbit();
  csOrbit = setInterval(() => {
    if (csVariant === 'v10' && !csAnimating && !csHover && document.visibilityState === 'visible') csGoTo(csActive + 1);
  }, 3600);
}
function stopOrbit() { if (csOrbit) { clearInterval(csOrbit); csOrbit = null; } }

window.addEventListener('pointermove', (e) => {                // parallax depth (v9)
  if (csVariant !== 'v9') return;
  const px = (e.clientX / window.innerWidth - 0.5), py = (e.clientY / window.innerHeight - 0.5);
  gsap.to(csStage, { x: -px * 26, y: -py * 14, duration: .6, ease: 'power2.out' });
  const bg = document.getElementById('cs-stage-bg');
  if (bg) gsap.to(bg, { x: px * 46, y: py * 26, scale: 1.06, duration: .8, ease: 'power2.out' });
});

function applyVariantEffects() {
  if (csVariant !== 'v9') {                                   // reset parallax transforms
    gsap.to(csStage, { x: 0, y: 0, duration: .4 });
    const bg = document.getElementById('cs-stage-bg');
    if (bg) gsap.to(bg, { x: 0, y: 0, scale: 1, duration: .4 });
  }
  if (csVariant === 'v10') startOrbit(); else stopOrbit();
}
applyVariantEffects();

/* ── Journey V7 spotlight auto-cycle ── */
(function() {
  const jSection = document.getElementById('journey');
  if (!jSection) return;
  let jSpotIdx = 0, jSpotTimer = null;
  function jSpotRun() {
    if (jSection.dataset.v !== 'v7') return;
    const steps = jSection.querySelectorAll('.step');
    steps.forEach((s, i) => s.classList.toggle('jspot', i === jSpotIdx));
    jSpotIdx = (jSpotIdx + 1) % steps.length;
  }
  function jSpotStart() {
    jSpotRun();
    jSpotTimer = setInterval(jSpotRun, 2600);
  }
  function jSpotStop() { clearInterval(jSpotTimer); jSection.querySelectorAll('.step').forEach(s => s.classList.remove('jspot')); }
  /* observe when journey is in view */
  if (window.IntersectionObserver) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (jSection.dataset.v !== 'v7') return;
        e.isIntersecting ? jSpotStart() : jSpotStop();
      });
    }, { threshold: 0.3 }).observe(jSection);
  }
  /* react to variant switch */
  jSection.addEventListener('variantChange', () => {
    jSpotStop(); jSpotIdx = 0;
    if (jSection.dataset.v === 'v7') jSpotStart();
  });
})();

/* Team Intro: Scan entfernt — Video + Titel sofort sichtbar (2026-06-26) */

/* Character-Select section: no scroll-entrance animation — characters just appear normally, hover-enlarge stays via CSS */

/* ─── BUILD SPECIALTIES — treatments menu ─── */
const TREATMENTS = [
  { name:'Herniated Disc Surgery', tag:'Minimally Invasive · Spine', img:'assets/images/treat-disc.webp',
    desc:'Minimally invasive microdiscectomy for herniated discs and sciatica — precise nerve decompression with rapid recovery.',
    long:'A herniated disc presses on spinal nerves causing pain, numbness or weakness that can radiate from the back into the arms or legs. Our microdiscectomy approach removes only the displaced disc material through a tiny incision, leaving surrounding structures intact. Navigation-guided technique ensures millimeter accuracy. Most patients are mobile the same day and return to daily life within weeks.',
    benefits:['Navigation-guided minimally invasive approach','Relieves sciatica and nerve compression','Tiny incision — minimal tissue damage','Same-day mobilisation'],
    meta:['1–2 hours','General anaesthesia','Hospital stay 1–2 days'] },
  { name:'Knee & Hip Replacement', tag:'Robotic · Endoprosthetics', img:'assets/images/treat-joint.webp',
    desc:'Robotic-assisted hip and knee endoprosthesis with rapid-recovery protocols — standing and walking within hours.',
    long:'Modern joint replacement is precise, predictable and fast. Using robotic-arm navigation, we place every implant within the optimal alignment zone — protecting the natural anatomy of each individual patient. Rapid-recovery protocols mean most patients stand and take their first steps on the day of surgery, reducing hospital time and rehabilitation duration significantly.',
    benefits:['Robotic-arm navigation for exact implant alignment','Patient-specific surgical planning','Rapid-recovery: walking day of surgery','Long-lasting implants — 20+ year lifespan'],
    meta:['1.5–2.5 hours','General or spinal anaesthesia','Hospital stay 2–4 days'] },
  { name:'Arthroscopy', tag:'Keyhole · Joint Surgery', img:'assets/images/treat-arthroscopy.webp',
    desc:'Keyhole joint surgery for ligament, meniscus and cartilage injuries — minimal trauma, maximum precision.',
    long:'Arthroscopy uses a tiny camera and instruments inserted through two small incisions to diagnose and treat knee, shoulder, hip and ankle conditions without opening the joint. We repair torn ligaments and menisci, remove loose fragments and treat cartilage damage — all with far less trauma than open surgery and a dramatically faster recovery.',
    benefits:['2–3 small incisions — no large scar','Treats ligament, meniscus and cartilage pathology','Same-day or overnight procedure','Return to sport in 4–12 weeks depending on injury'],
    meta:['45–90 minutes','General or regional anaesthesia','Often day-case'] },
  { name:'Shockwave Therapy', tag:'Non-Invasive · Tendon', img:'assets/images/treat-shockwave.webp',
    desc:'Non-invasive focused acoustic therapy for chronic tendon pain and calcification — no needles, no downtime.',
    long:'Extracorporeal shockwave therapy delivers focused acoustic pulses to chronically painful tendons and calcifications — stimulating blood flow, breaking down calcium deposits and promoting tissue healing without surgery or injections. Conditions like Achilles tendinopathy, plantar fasciitis, calcific shoulder and tennis elbow respond well. Most patients notice improvement after 3 sessions.',
    benefits:['No anaesthesia, no incision','Breaks down calcium deposits in tendons','Stimulates natural healing response','Effective for tendinopathies resistant to physiotherapy'],
    meta:['20–30 minutes','3–5 sessions recommended','No downtime'] },
  { name:'Spinal Injections', tag:'Image-Guided · Pain Relief', img:'assets/images/treat-injection.webp',
    desc:'Precise image-guided injections for back and nerve pain — targeting the exact source of inflammation.',
    long:"For back, neck and nerve pain that hasn't responded to conservative measures, image-guided injections deliver anti-inflammatory medication directly to the source — epidural space, facet joints or trigger points. Fluoroscopy or ultrasound ensures the needle reaches the correct anatomical target every time. Results are often felt within days and can last months.",
    benefits:['Fluoroscopy or ultrasound guidance for precision','Epidural, facet and nerve-root options','Often provides months of relief','Minimally invasive alternative to surgery'],
    meta:['20–40 minutes','Local anaesthesia','Outpatient procedure'] },
  { name:'Sports Injuries', tag:'Arthroscopy · Rehab', img:'assets/images/treat-sports.webp',
    desc:'ACL reconstruction, meniscus repair, rotator cuff — keyhole surgery and return-to-play rehabilitation.',
    long:"Sports injuries need a specialist who understands both the anatomy and the athlete's goals. Whether it's an ACL tear, meniscus damage, a rotator cuff rupture or a recurring shoulder dislocation, we plan surgery and rehabilitation around one objective: full return to your sport at full performance. Arthroscopic repair combined with our physiotherapy team creates the fastest, safest route back.",
    benefits:['Expert arthroscopic repair by sports specialist','Tailored return-to-sport rehabilitation plan','ACL, meniscus, rotator cuff and ankle reconstruction','Accelerated rehab protocols for competitive athletes'],
    meta:['Surgery 1–3 hours','Rehab 4–9 months sport-dependent','Full return-to-play goal'] },
  { name:'Osteoporosis Therapy', tag:'Bone Density · Long-Term', img:'assets/images/treat-osteoporosis.webp',
    desc:'Bone-density diagnostics, medical management and fracture prevention — protecting your skeleton for life.',
    long:'Osteoporosis silently weakens bones until a minor fall becomes a serious fracture. Our program begins with high-resolution bone-density scanning, followed by personalised medical treatment, calcium and vitamin D optimisation, and fall-prevention strategies. We monitor progress with annual scans and adjust therapy as bone density improves — treating the cause, not just the fracture.',
    benefits:['High-resolution DEXA bone-density measurement','Personalised medical and lifestyle treatment','Fracture risk assessment and prevention','Annual monitoring and medication adjustment'],
    meta:['Long-term program','Medication + lifestyle + monitoring','Prevents fractures'] },
  { name:'Gait Analysis', tag:'Motion Lab · Biomechanics', img:'assets/images/treat-gait.webp',
    desc:'Sensor-based motion-lab assessment of foot, posture and movement — the precision blueprint for better function.',
    long:"Many orthopaedic problems originate in how we walk, run or stand. Our motion lab uses pressure plates, motion-capture sensors and video analysis to reveal exactly where gait deviations, leg-length discrepancies or foot misalignment are loading your joints incorrectly. The report becomes a blueprint for custom orthotics, targeted physiotherapy and surgical planning — treating the cause, not just the symptom.",
    benefits:['Full 3D gait and pressure-plate analysis','Identifies the root cause of joint overload','Blueprint for custom orthotics and therapy','Essential pre- and post-operative assessment'],
    meta:['60 minutes','No preparation needed','Detailed written report'] }
];
const specGrid = document.getElementById('specialtiesGrid');
if (specGrid) {
  TREATMENTS.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'specialty-card reveal';
    card.dataset.tx = i;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="spec-photo"><img src="${t.img}" alt="${t.name}" loading="lazy"></div>
      <span class="spec-name">${t.name}</span>
      <span class="spec-specialty">${t.tag}</span>
      <p class="spec-desc">${t.desc}</p>
      <span class="spec-more">Learn more →</span>
    `;
    card.addEventListener('click', () => openTx(i));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTx(i); } });
    specGrid.appendChild(card);
  });
}

/* ─── TREATMENT DETAIL PANEL — slides in like the patient story ─── */
const txPanel = document.getElementById('tx-panel');
const txOverlay = document.getElementById('tx-overlay');
window.openTx = function(i){
  const t = TREATMENTS[i];
  if (!t || !txPanel) return;
  document.getElementById('tx-img').src = t.img;
  document.getElementById('tx-tag').textContent = t.tag;
  document.getElementById('tx-name').textContent = t.name;
  document.getElementById('tx-desc').textContent = t.long || t.desc;
  document.getElementById('tx-benefits').innerHTML =
    (t.benefits || []).map(b => `<li>${b}</li>`).join('');
  document.getElementById('tx-meta').innerHTML =
    (t.meta || []).map(m => `<span class="tx-chip">${m}</span>`).join('');
  document.getElementById('tx-body').scrollTop = 0;
  txOverlay.classList.add('active');
  txPanel.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.gsap) {
    gsap.fromTo('#tx-img', {scale: 1.12}, {scale: 1, duration: 1.1, ease: 'power3.out'});
    gsap.fromTo('#tx-body > *', {opacity: 0, y: 16}, {opacity: 1, y: 0, stagger: .06, duration: .5, ease: 'power3.out', delay: .12});
  }
};
window.closeTx = function(){
  if (!txPanel) return;
  txPanel.classList.remove('open');
  txOverlay.classList.remove('active');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeTx(); });

/* ─── BUILD FULL TEAM GRID ─────────────────── */
const TEAM = [
  { img:'team-front-desk',  name:'Mia',      role:'Patient Coordinator',  bio:'The first face of ATLAS. Mia coordinates your entire journey — from first call to follow-up — ensuring every step feels effortless and personal.' },
  { img:'team-guest',       name:'Lea',      role:'Medical Assistant',    bio:'Lea supports our specialists in the consultation room with calm precision, making sure every examination runs smoothly and you always feel at ease.' },
  { img:'team-assistant1',  name:'Amira',    role:'Medical Assistant',    bio:'Amira handles clinical preparation and documentation with meticulous care, keeping our specialists free to focus entirely on your treatment.' },
  { img:'team-assistant2',  name:'Lena',     role:'Physiotherapist',      bio:'Lena designs and guides individualised recovery programmes — combining evidence-based therapy with a warm, encouraging approach that gets results.' },
  { img:'team-hygienist1',  name:'Claudia',  role:'Physiotherapist',      bio:'Claudia specialises in post-operative rehabilitation, guiding patients from first steps after surgery back to full, pain-free movement.' },
  { img:'team-hygienist2',  name:'Jamal',    role:'Physiotherapist',      bio:'Jamal blends sports-physio techniques with clinical rehabilitation — an essential bridge between surgery and full return to activity.' },
  { img:'team-manager',     name:'Bernd', role:'Practice Manager',     bio:'Bernd keeps the entire clinic running in perfect rhythm — from scheduling and compliance to team development — so the focus stays on patient care.' },
  { img:'team-coordinator', name:'Marco',      role:'OR Coordinator',       bio:'Marco coordinates every surgical case with precision, managing theatre schedules, implant logistics and surgical teams so operations run flawlessly.' },
  { img:'team-barista',     name:'Luca',     role:'Imaging Technician',   bio:'Luca operates our MRI, X-ray and EOS imaging suite — producing the high-quality diagnostic images our surgeons depend on for precise planning.' },
  { img:'team-trainee',     name:'Emma',     role:'Trainee',              bio:'The next generation in orthopaedic care. Emma brings fresh energy and a sharp clinical mind, learning from the best specialists in the field.' }
];
const teamGrid = document.getElementById('teamGrid');
if (teamGrid) {
  TEAM.forEach(m => {
    const c = document.createElement('div');
    c.className = 'team-card';
    const cap = `<div class="team-name">${m.name}</div><div class="team-role">${m.role}</div>`;
    const bio = `<p class="team-bio">${m.bio || ''}</p>`;
    c.innerHTML = `<div class="team-photo"><img src="assets/images/${m.img}.webp" alt="${m.name} — ${m.role}" loading="lazy"><div class="team-overlay">${cap}${bio}</div></div><div class="team-below">${cap}${bio}</div>`;
    teamGrid.appendChild(c);
  });
  // Team layout switcher (V1 cards | V2 round avatars | V3 overlay tiles)
  const teamSec = document.getElementById('team');
  let teamV = localStorage.getItem('atlas-tv') || 'v3';
  teamSec.dataset.tv = teamV;
  document.querySelectorAll('#team-vsw .vsw-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tv === teamV);
    b.addEventListener('click', () => {
      teamV = b.dataset.tv; teamSec.dataset.tv = teamV;
      document.querySelectorAll('#team-vsw .vsw-btn').forEach(x => x.classList.toggle('active', x === b));
      localStorage.setItem('atlas-tv', teamV);
    });
  });
}

/* ─── GSAP HERO ENTRANCE ──────────────────── */
gsap.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', delay: 0.1 });
gsap.from('.hero-title',   { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out', delay: 0.2 });
gsap.from('.hero-sub',     { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', delay: 0.6 });
gsap.from('.hero-tagline', { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', delay: 0.8 });
gsap.from('.hero-btns',    { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', delay: 1.0 });
gsap.from('.hero-scroll',  { opacity: 0, duration: 0.8, delay: 1.8 });
gsap.from('nav',           { opacity: 0, duration: 0.6, delay: 0.3 });

/* ─── NAV SCROLL ──────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ─── SCROLL REVEAL (staggered grids) ───────────────────────── */
// Cards inside a grid reveal one-by-one (stagger via transition-delay)
document.querySelectorAll('.specialties-grid, .team-grid, .tech-grid, .stats-grid, .gallery-grid, .test-grid, .journey-grid').forEach(grid => {
  [...grid.children].forEach((child, i) => {
    if (child.classList && child.classList.contains('reveal')) child.style.transitionDelay = ((i % 8) * 0.07) + 's';
  });
});
document.querySelectorAll('.reveal').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    onEnter: () => el.classList.add('in'),
    once: true
  });
});

/* Section-level "come alive" trigger (journey path draw, stats bars build) */
['journey','stats','technology','gallery'].forEach(id => {
  const sec = document.getElementById(id);
  if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 78%', once: true, onEnter: () => sec.classList.add('animate') });
});

/* ─── VARIANT SWITCHER ──────────────────────────────────── */
document.getElementById('global-theme-sw').style.display = 'flex';

/* Global color theme switcher */
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    localStorage.setItem('atlas-theme', theme);
  });
});

/* Per-section variant switcher */
document.querySelectorAll('.vsw-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.v; // 'v1', 'v2', 'v3'
    const sectionId = btn.closest('.vsw').dataset.section;
    const sectionEl = document.getElementById(sectionId);
    if (sectionEl) {
      sectionEl.dataset.v = v;
      sectionEl.dispatchEvent(new Event('variantChange'));
    }
    btn.closest('.vsw').querySelectorAll('.vsw-btn').forEach(b => b.classList.toggle('active', b === btn));
    localStorage.setItem('atlas-v-' + sectionId, v);
  });
});

/* Restore saved state */
const savedTheme = localStorage.getItem('atlas-theme');
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === savedTheme));
}
['hero','specialties','technology','journey','stats','gallery','testimonials','cta'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const saved = localStorage.getItem('atlas-v-' + id);
  if (saved) el.dataset.v = saved;
  const currentV = el.dataset.v;
  const vsw = document.querySelector(`.vsw[data-section="${id}"]`);
  if (vsw) vsw.querySelectorAll('.vsw-btn').forEach(b => b.classList.toggle('active', b.dataset.v === currentV));
});

/* ─── STATS COUNTER ──────────────────────────────────────────── */
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2.2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate() { el.textContent = Math.round(parseFloat(el.innerText)); }
        }
      );
    }
  });
});

/* ─── CTA BOOKING (demo calendar + WhatsApp) ─────────────────── */
const ctaBook = document.getElementById('ctaBook');
const ctaSuccess = document.getElementById('ctaSuccess');
const WA_NUMBER = '491234567890'; // ← Platzhalter: durch echte WhatsApp-Nummer ersetzen
if (ctaBook) {
  const calGrid = document.getElementById('cal-grid');
  const calMonth = document.getElementById('cal-month');
  const slotGrid = document.getElementById('slot-grid');
  const summary = document.getElementById('bk-summary');
  // Custom treatment dropdown
  const ddRoot = document.getElementById('bk-treatment');
  const ddBtn = document.getElementById('bk-dd-btn');
  const ddVal = ddRoot.querySelector('.bk-dd-val');
  let bkTreatment = '';
  ddBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = ddRoot.classList.toggle('open');
    ddBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  ddRoot.querySelectorAll('.bk-dd-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      bkTreatment = opt.textContent.trim();
      ddVal.textContent = bkTreatment; ddVal.removeAttribute('data-placeholder');
      ddRoot.querySelectorAll('.bk-dd-opt').forEach(o => o.classList.remove('sel'));
      opt.classList.add('sel');
      ddRoot.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false');
      updateBooking();
    });
  });
  document.addEventListener('click', (e) => {
    if (!ddRoot.contains(e.target)) { ddRoot.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false'); }
  });
  const waBtn = document.getElementById('bk-wa');
  const SLOTS = ['09:00','10:00','11:00','13:00','14:30','16:00','17:30'];
  const today = new Date(); today.setHours(0,0,0,0);
  let viewY = today.getFullYear(), viewM = today.getMonth();
  let selDate = null, selTime = null;
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function fmtDate(d){ return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}); }
  function updateBooking(){
    const t = bkTreatment || 'a consultation';
    let txt = `Hi ATLAS, I'd like to book ${t}`;
    if (selDate) txt += ` on ${fmtDate(selDate)}`;
    if (selTime) txt += ` at ${selTime}`;
    txt += '.';
    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`;
    summary.textContent = selDate ? `${fmtDate(selDate)}${selTime ? ' · ' + selTime : ''}` : '';
  }
  function renderSlots(){
    slotGrid.innerHTML = '';
    if (!selDate){ slotGrid.innerHTML = '<span class="slot-hint">Pick a date first</span>'; return; }
    SLOTS.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot' + (s===selTime ? ' active' : ''); b.textContent = s;
      b.addEventListener('click', () => { selTime = s; renderSlots(); updateBooking(); });
      slotGrid.appendChild(b);
    });
  }
  function renderCal(){
    calMonth.textContent = `${MONTHS[viewM]} ${viewY}`;
    calGrid.innerHTML = '';
    const first = new Date(viewY, viewM, 1);
    const startDow = (first.getDay()+6)%7; // Mon=0
    const days = new Date(viewY, viewM+1, 0).getDate();
    for (let i=0;i<startDow;i++){ const e=document.createElement('span'); e.className='cal-empty'; calGrid.appendChild(e); }
    for (let d=1;d<=days;d++){
      const date = new Date(viewY, viewM, d);
      const b = document.createElement('button');
      b.type='button'; b.className='cal-day'; b.textContent=d;
      const isPast = date < today;
      const isSun = date.getDay()===0;
      if (isPast || isSun){ b.disabled = true; b.classList.add('off'); }
      if (selDate && date.getTime()===selDate.getTime()) b.classList.add('active');
      if (date.getTime()===today.getTime()) b.classList.add('today');
      if (!b.disabled) b.addEventListener('click', () => { selDate = date; selTime = null; renderCal(); renderSlots(); updateBooking(); });
      calGrid.appendChild(b);
    }
  }
  document.getElementById('cal-prev').addEventListener('click', () => {
    if (viewY===today.getFullYear() && viewM===today.getMonth()) return; // no past months
    viewM--; if (viewM<0){ viewM=11; viewY--; } renderCal();
  });
  document.getElementById('cal-next').addEventListener('click', () => { viewM++; if (viewM>11){ viewM=0; viewY++; } renderCal(); });
  document.getElementById('bk-confirm').addEventListener('click', () => {
    if (!bkTreatment || !selDate || !selTime){
      summary.textContent = 'Please choose treatment, date and time.'; summary.classList.add('warn');
      setTimeout(()=>summary.classList.remove('warn'), 1800);
      return;
    }
    gsap.to(ctaBook, {opacity:0, y:-10, duration:.4, ease:'power2.in', onComplete:()=>{
      ctaBook.style.display='none';
      ctaSuccess.innerHTML = `✓ Request received — <strong>${bkTreatment}</strong>, ${fmtDate(selDate)} at ${selTime}. We'll confirm within 24 hours.`;
      ctaSuccess.classList.add('visible');
      gsap.from(ctaSuccess, {opacity:0, y:12, duration:.5, ease:'power3.out'});
    }});
  });
  renderCal(); renderSlots(); updateBooking();
}

/* ─── GALLERY RESULT MODAL ───────────────────────────────────── */
const GAL_STORIES = {
  'Spine Decompression': 'A 47-year-old warehouse manager came to us barely able to stand upright — a herniated L4/L5 disc had been compressing his sciatic nerve for nine months, causing crippling pain down his left leg. Conservative therapy had failed. Dr. Brandt performed a navigation-guided microdiscectomy through a 2.5 cm incision, removing the displaced disc fragment without disturbing the surrounding musculature. The patient woke up with no leg pain. He walked out of the clinic the following morning, and returned to light work six weeks later. A year on, his MRI is clear and he runs 5k three times a week.',
  'Knee Replacement': "For over a decade, a 68-year-old retired teacher had been told she wasn't ready for a knee replacement. By the time she came to us she could no longer walk more than 200 metres without stopping. Dr. Hoffmann's robotic-assisted total knee replacement, planned to the millimetre using pre-operative CT mapping, was completed in 90 minutes. By early evening she had stood and taken her first steps. She was discharged home on day two, began physiotherapy on day three, and walked to her daughter's wedding — without a stick — eleven weeks after surgery.",
  'Posture Correction': "A 16-year-old competitive swimmer had been losing stroke power and developing upper-back pain. Evaluation revealed a 28° thoracic scoliosis that was gradually worsening. Rather than move straight to surgery, Dr. Brandt prescribed a Cheneau brace combined with Schroth method physiotherapy. After 18 months of dedicated compliance, curvature progression had halted and her Cobb angle had reduced to 19°. Swim times improved, back pain resolved, and her spine specialist cleared her for elite competition — the surgery she had feared never happened.",
  'Back to Running': "A 29-year-old amateur triathlete ruptured her anterior cruciate ligament during a trail race. The injury ended her season and threatened her next one. Dr. Wagner performed an anatomic ACL reconstruction using her own patellar tendon graft under arthroscopic guidance, with careful attention to tunnel placement for rotational stability. She entered our accelerated return-to-sport programme three days after surgery. At seven months she completed a sprint triathlon. At nine months she ran a personal best at her local half-marathon — stronger and more confident than before the injury.",
  'Hip Endoprosthesis': 'A 72-year-old former architect had spent two years avoiding the stairs in his own home due to end-stage hip osteoarthritis. Pre-operative planning with 3D CT modelling allowed Dr. Hoffmann to select the exact implant sizing and approach for his anatomy. The minimally invasive anterior approach, preserving the hip abductors, meant less blood loss and no dislocation precautions after surgery. He was standing the same evening. By week four he was climbing stairs normally, and at three months his follow-up X-ray showed perfect implant position. He described the result simply: "I forgot I have a new hip."',
  'Full Recovery': 'A multi-stage rehabilitation case spanning eight months and the full ATLAS team. A 44-year-old construction site manager had sustained a complex right knee injury — ACL rupture, medial meniscus tear and grade III cartilage damage — in a workplace accident. Dr. Wagner performed a combined ACL reconstruction and meniscus repair under arthroscopy. Three weeks later, the physiotherapy team began a phased recovery programme, progressing from pool-based loading through gym strengthening to sport-specific drills. At month eight the patient returned to site — full weight-bearing, full rotation, zero pain. Strength testing showed 94% symmetry between both legs.'
};
const galModal = document.getElementById('gal-modal');
if (galModal) {
  document.querySelectorAll('#gallery .gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const t = (card.querySelector('.gallery-treatment')||{}).textContent || '';
      const detail = (card.querySelector('.gallery-detail')||{}).textContent || '';
      const photo = card.querySelector('.gallery-photo');
      document.getElementById('gal-modal-title').textContent = t;
      document.getElementById('gal-modal-detail').textContent = detail;
      document.getElementById('gal-modal-story').textContent = GAL_STORIES[t] || '';
      const mImg = document.getElementById('gal-modal-photo');
      if (photo && photo.getAttribute('src')) { mImg.src = photo.getAttribute('src'); mImg.parentElement.style.display = ''; }
      else { mImg.parentElement.style.display = 'none'; }
      galModal.classList.add('open');
      gsap.fromTo('.gal-modal-panel', {scale:.94, opacity:0, y:24}, {scale:1, opacity:1, y:0, duration:.5, ease:'power3.out'});
      gsap.fromTo('#gal-modal-photo', {scale:1.1}, {scale:1, duration:1.1, ease:'power3.out'});
    });
  });
}
window.closeGalleryModal = function() { if (galModal) galModal.classList.remove('open'); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeGalleryModal(); });

/* ─── TESTIMONIALS V3 SLIDER ─────────────────────────────────── */
(() => {
  const cards = document.querySelectorAll('#testimonials .test-card');
  const dotsWrap = document.getElementById('test-dots');
  const prev = document.getElementById('test-prev');
  const next = document.getElementById('test-next');
  if (!cards.length || !dotsWrap || !prev || !next) return;
  let idx = 0;
  cards.forEach((_, k) => {
    const d = document.createElement('button');
    d.className = 'test-dot'; d.setAttribute('aria-label', 'Review ' + (k + 1));
    d.addEventListener('click', () => show(k));
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.querySelectorAll('.test-dot');
  function show(i){
    idx = (i + cards.length) % cards.length;
    cards.forEach((c, k) => c.classList.toggle('active', k === idx));
    dots.forEach((d, k) => d.classList.toggle('on', k === idx));
  }
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  show(0);
})();

/* ─── CURSOR SPOTLIGHT — injects a glow layer into each card and tracks the pointer ─── */
(function(){
  var sel = '.specialty-card, .tech-card, .gallery-card, .test-card, .stat-item, .team-card, .journey-step';
  var cards = document.querySelectorAll(sel);
  cards.forEach(function(card){
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    var glow = document.createElement('i');
    glow.className = 'cglow';
    card.appendChild(glow);
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ─── AUTO-ACTIVATE SOFIA (idx 2) — handled by csActive=2 in ECHOES system ─── */

/* ─── AUTO-ACTIVATE LUKAS (idx 0) — handled by csActive=0 ─── */

/* ─── SPINE HERO — A/B/C style switcher ───────────────────────── */
(function initSpineHero() {
  const img = document.getElementById('spine-hero-img');
  const sw = document.getElementById('hero-spine-sw');
  if (!img || !sw) return;
  const btns = sw.querySelectorAll('.vsw-btn');
  const SPINE_MAP = {
    A: 'assets/images/spine-A.webp',
    B: 'assets/images/spine-B.webp',
    C: 'assets/images/spine-C.webp'
  };
  const saved = localStorage.getItem('atlas-spine') || 'B';
  function setSpine(key) {
    if (img.tagName === 'IMG') {
      const src = SPINE_MAP[key] || SPINE_MAP['A'];
      img.src = src;
    }
    btns.forEach(b => b.classList.toggle('active', b.dataset.spine === key));
    localStorage.setItem('atlas-spine', key);
  }
  setSpine(saved);
  btns.forEach(btn => {
    btn.addEventListener('click', () => setSpine(btn.dataset.spine));
  });
  if (window.gsap) {
    gsap.from(img, { opacity: 0, scale: 0.94, duration: 1.5, ease: 'power3.out', delay: 0.4 });
    gsap.from('.hero-accent-line', { opacity: 0, scaleY: 0, duration: 1.2, ease: 'power3.out', delay: 0.8, transformOrigin: 'top center' });
  }

  /* Ping-pong: vorwärts → rückwärts → vorwärts … (zwei echte Videos) */
  if (img.tagName === 'VIDEO') {
    const imgRev = document.getElementById('spine-hero-img-rev');
    if (imgRev) {
      /* Rueckwaerts-Video erst puffern, wenn das Hero-Video wirklich laeuft.
         Vorher wuerde es dem sichtbaren Video die Bandbreite wegnehmen.
         4s Vorlauf bis zum Ping-Pong-Wechsel reichen zum Laden. */
      img.addEventListener('playing', () => imgRev.load(), { once: true });
      img.addEventListener('ended', () => {
        img.style.display = 'none';
        imgRev.style.display = 'block';
        imgRev.currentTime = 0;
        imgRev.play();
      });
      imgRev.addEventListener('ended', () => {
        imgRev.style.display = 'none';
        img.style.display = 'block';
        img.currentTime = 0;
        img.play();
      });
    }
  }
})();

/* Team-Intro-Video laden, sobald das Hero-Video laeuft (oder spaetestens
   nach 3 s), und das .ti-fallback-Standbild ausblenden, sobald das Video
   wirklich spielt. Die kurze Verzoegerung haelt dem Hero-Video die
   Bandbreite frei, ohne das Team-Video dauerhaft hinter dem Standbild zu
   verstecken. */
(function initTeamVideo() {
  const vids = document.querySelectorAll('video[data-lazy-src]');
  if (!vids.length) return;
  const load = v => {
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.src = v.dataset.lazySrc;
    v.load();
    v.addEventListener('playing', () => {
      const inner = v.closest('.ti-inner');
      const fb = inner && inner.querySelector('.ti-fallback');
      if (fb) { fb.style.transition = 'opacity .6s ease'; fb.style.opacity = '0'; }
    }, { once: true });
    v.play().catch(() => {});
  };
  const hero = document.getElementById('spine-hero-img');
  const go = () => vids.forEach(load);
  if (hero && hero.tagName === 'VIDEO') {
    hero.addEventListener('playing', go, { once: true });
    setTimeout(go, 3000); // Sicherheitsnetz, falls playing nicht feuert
  } else {
    go();
  }
})();