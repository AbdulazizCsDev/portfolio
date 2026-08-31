import { useEffect, useRef } from 'react';
import './ParticleField.css';

// Faithful port of "Particle Drift — Originkit", supplied verbatim by the
// owner. Converted from TypeScript to plain JS only (project carries zero
// non-react runtime deps, and no TypeScript — see CLAUDE.md). Direction and
// the binary hover-gold logic are exactly as given; the fact that it drifts
// forever and never freezes is exactly as given. What differs from the given
// source differs on later explicit owner request, each noted where it's
// implemented: the two hardcoded demo colours read live from the site's own
// theme; speed is knocked down from the given default; node positions never
// rescale to fit the canvas on resize, so a shrinking viewport clips the
// field instead of squeezing it; density and link/hover reach follow the
// viewport's area, so a phone doesn't carry a desktop's worth of nodes; and
// the pointer interaction is mouse-only.
//
// Two further additions, both disclosed and invisible during ordinary use,
// not a stylistic call: a single static frame under prefers-reduced-motion
// (accessibility), and a pause while the browser tab itself is hidden
// (battery — a hidden tab shows no frames either way, so this changes
// nothing the visitor sees).

const MAX_DPR = 2;
const MAX_LINES = 8000;
const EDGE = 20; // px a particle must clear before it re-enters on the far side

const LINE_VERT = `
precision highp float;

attribute vec2  a_p0;
attribute vec2  a_p1;
attribute vec2  a_corner;
attribute vec3  a_shade;

uniform vec2  uSize;

varying float v_alpha;
varying float v_mix;
varying float v_off;
varying float v_half;

void main(){
  vec2 d = a_p1 - a_p0;
  float len = max(length(d), 1e-5);
  vec2 nrm = vec2(-d.y, d.x) / len;

  float half_ = max(a_shade.z * 0.5, 0.35);
  float ext = half_ + 0.75;
  vec2 p = mix(a_p0, a_p1, a_corner.x);
  p += nrm * a_corner.y * ext;

  v_alpha = a_shade.x;
  v_mix = a_shade.y;
  v_off = a_corner.y * ext;
  v_half = half_;
  gl_Position = vec4(p.x / uSize.x * 2.0 - 1.0, 1.0 - p.y / uSize.y * 2.0, 0.0, 1.0);
}
`;

const LINE_FRAG = `
precision mediump float;

uniform vec3 uBase, uAccent;

varying float v_alpha;
varying float v_mix;
varying float v_off;
varying float v_half;

void main(){
  float cov = clamp((v_half - abs(v_off)) / 0.75 + 0.5, 0.0, 1.0);
  float a = v_alpha * cov;
  vec3 col = mix(uBase, uAccent, v_mix);
  gl_FragColor = vec4(col * a, a);
}
`;

const DOT_VERT = `
precision highp float;

attribute vec2  a_pos;
attribute float a_lit;

uniform vec2  uSize;
uniform float uDpr, uDot;

varying float v_lit;

void main(){
  gl_PointSize = max(1.0, uDot * uDpr);
  v_lit = a_lit;
  gl_Position = vec4(a_pos.x / uSize.x * 2.0 - 1.0, 1.0 - a_pos.y / uSize.y * 2.0, 0.0, 1.0);
}
`;

const DOT_FRAG = `
precision mediump float;

uniform vec3  uBase, uAccent;
uniform float uRestAlpha;

varying float v_lit;

void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float disc = 1.0 - smoothstep(0.72, 1.0, d);
  vec3 col = mix(uBase, uAccent, v_lit);
  float a = disc * mix(uRestAlpha, 1.0, v_lit);
  if (a <= 0.004) discard;
  gl_FragColor = vec4(col * a, a);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function link(gl, vsSrc, fsSrc) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  return prog;
}

// baseColor/accentColor are read from --text/--mark instead of the demo's
// hardcoded #FFFFFF / #FDFF00 — the one change the owner actually asked for.
function parseColor(input, fb) {
  const str = String(input || '').trim();
  if (!str) return fb;
  if (str.charAt(0) === '#') {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
    }
    return fb;
  }
  const m = str.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [
      Math.min(255, parseFloat(m[0])) / 255,
      Math.min(255, parseFloat(m[1])) / 255,
      Math.min(255, parseFloat(m[2])) / 255,
    ];
  }
  return fb;
}

function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CORNERS = [
  [0, -1], [1, -1], [1, 1],
  [0, -1], [1, 1], [0, 1],
];

// The given component's own prop defaults, fixed in place since this instance
// is not configurable — dotSize 3, direction 0 (straight down), hover 200
// (→ reach 180, alpha ×2), linkDistance 230, linkThickness 1. Speed is knocked
// down from the given default (50 → 20) on explicit owner request, not a
// silent slowdown like the one that was rejected before.
const MAX_DENSITY = 400;
const DOT_SIZE = 3;
const SPEED_MULT = 0.4; // speed prop 20, clamped 0–100, /50
const DIRECTION_DEG = 0; // straight down, matching the prop default
const HOVER_REACH = 180;
const HOVER_MULT = 2; // hover prop 200, clamped 0–200, /100
const LINK_DISTANCE = 230;
const LINK_THICKNESS = 1;

// The given source's density 400 is authored for a desktop-sized canvas. Held
// as a flat count it means a phone carries the same 400 nodes in a quarter of
// the area — 4.4x the desktop density, which is the pile-up the owner
// reported. So 400 becomes a rate (nodes per px²) measured against this
// reference viewport: desktop renders exactly as before, a 375x700 phone gets
// ~91 nodes instead of 400.
const REF_AREA = 1280 * 900;
const NODES_PER_AREA = MAX_DENSITY / REF_AREA;
// Floor keeps the field from thinning into nothing on a very short viewport;
// ceiling is a performance guard, not taste — the proximity-link pass is
// O(n²), so 400 nodes is 80k pair tests a frame and an uncapped 4K viewport
// would be ~800k.
const MIN_DENSITY = 80;
// Link and hover radii scale with the viewport's linear dimension. Constant
// nodes-per-area already fixes the *count* of neighbours in reach; this is
// about proportion — a flat 230px reach spans 61% of a 375px screen, so the
// links read as lines crossing the whole page instead of a local mesh.
const MIN_REACH_SCALE = 0.5;
// Rebuild band and cooldown: a mobile browser collapsing its URL bar on
// scroll changes viewport height constantly, and reacting to every pixel of
// that would churn the node list. Only a >10% swing in the target count, and
// at most once every 500ms, is worth acting on.
const DENSITY_BAND = 0.1;
const RESIZE_COOLDOWN_MS = 500;

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!gl) return undefined;

    const lineProg = link(gl, LINE_VERT, LINE_FRAG);
    const dotProg = link(gl, DOT_VERT, DOT_FRAG);
    if (!lineProg || !dotProg) return undefined;

    const locs = new Map();
    const u = (prog, name) => {
      const key = (prog === lineProg ? 'L:' : 'D:') + name;
      if (!locs.has(key)) locs.set(key, gl.getUniformLocation(prog, name));
      return locs.get(key);
    };

    const lP0 = new Float32Array(MAX_LINES * 6 * 2);
    const lP1 = new Float32Array(MAX_LINES * 6 * 2);
    const lCorner = new Float32Array(MAX_LINES * 6 * 2);
    const lShade = new Float32Array(MAX_LINES * 6 * 3);
    for (let e = 0; e < MAX_LINES; e++) {
      for (let c = 0; c < 6; c++) {
        const k = (e * 6 + c) * 2;
        lCorner[k] = CORNERS[c][0];
        lCorner[k + 1] = CORNERS[c][1];
      }
    }
    const bP0 = gl.createBuffer();
    const bP1 = gl.createBuffer();
    const bCorner = gl.createBuffer();
    const bShade = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bP0);
    gl.bufferData(gl.ARRAY_BUFFER, lP0.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bP1);
    gl.bufferData(gl.ARRAY_BUFFER, lP1.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
    gl.bufferData(gl.ARRAY_BUFFER, lCorner, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bShade);
    gl.bufferData(gl.ARRAY_BUFFER, lShade.byteLength, gl.DYNAMIC_DRAW);

    const R = rng(20260824);

    // Allocated once at full capacity; only nCount — how many of these slots
    // are live — moves with the viewport. Nothing is ever reallocated, so
    // adapting the density costs no GC and no bufferData call.
    const nx = new Float32Array(MAX_DENSITY);
    const ny = new Float32Array(MAX_DENSITY);
    const nSpd = new Float32Array(MAX_DENSITY);
    const gPos = new Float32Array(MAX_DENSITY * 2);
    const gLit = new Float32Array(MAX_DENSITY);
    const bGPos = gl.createBuffer();
    const bGLit = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bGPos);
    gl.bufferData(gl.ARRAY_BUFFER, gPos.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bGLit);
    gl.bufferData(gl.ARRAY_BUFFER, gLit.byteLength, gl.DYNAMIC_DRAW);

    let nCount = 0;

    // Grows or shrinks the live node count in place. Nodes that survive keep
    // their exact coordinates — this is deliberately NOT the rescale the owner
    // rejected: the field never drags itself to refit new bounds, it only
    // gains nodes in the new space or drops them off the tail.
    const setNodeCount = (n, w, h) => {
      for (let i = nCount; i < n; i++) {
        nx[i] = R() * w;
        ny[i] = R() * h;
        nSpd[i] = (R() * 0.4 + 0.1) * 60; // 0.1..0.5 px per frame, base unit 60
      }
      nCount = n;
    };

    const targetCount = (w, h) => {
      const n = Math.round(w * h * NODES_PER_AREA);
      return Math.max(MIN_DENSITY, Math.min(MAX_DENSITY, n));
    };

    const ptr = { x: -10000, y: -10000 };
    // Tracked on window, not the canvas: the canvas sits behind every real
    // element on the page (pointer-events: none) so clicks pass through to
    // it, which means canvas-local listeners would never fire. The transform
    // below is unchanged from the given code.
    //
    // Mouse only. A finger has no hover state: a tap would park the pointer
    // wherever it landed and leave a permanent gold starburst stuck to that
    // spot (visible in the owner's phone screenshot). Gating on pointerType
    // rather than a (hover: hover) media query keeps the mouse working on a
    // touchscreen laptop.
    const track = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const cw = canvas.clientWidth || 1200;
      const ch = canvas.clientHeight || 800;
      ptr.x = ((e.clientX - r.left) / r.width) * cw;
      ptr.y = ((e.clientY - r.top) / r.height) * ch;
    };
    const onLeave = (e) => {
      if (e.pointerType !== 'mouse') return;
      ptr.x = -10000;
      ptr.y = -10000;
    };
    window.addEventListener('pointermove', track);
    window.addEventListener('pointerleave', onLeave);

    let tabVisible = document.visibilityState !== 'hidden';
    const onVisibility = () => { tabVisible = document.visibilityState !== 'hidden'; };
    document.addEventListener('visibilitychange', onVisibility);

    const th = (DIRECTION_DEG * Math.PI) / 180;
    const dirX = Math.sin(th);
    const dirY = Math.cos(th);

    let raf = 0;
    let last = performance.now();
    let lastResize = -Infinity;

    const drawFrame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cw = canvas.clientWidth || 1200;
      const ch = canvas.clientHeight || 800;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      // Density follows the viewport's area. On the first frame this just
      // builds the field; afterwards it only reacts to a swing wide enough to
      // matter, no more often than the cooldown allows.
      //
      // What it never does is move an existing node. The field still does not
      // rescale to refit new bounds — a shrinking viewport clips it, exactly
      // as requested; edge-wrap (below) recycles particles using whatever
      // cw/ch is current. Adapting *how many* nodes there are and *where* they
      // sit are separate things, and only the first one is wanted here.
      const want = targetCount(cw, ch);
      if (nCount === 0) {
        setNodeCount(want, cw, ch);
        lastResize = now;
      } else if (
        Math.abs(want - nCount) > nCount * DENSITY_BAND &&
        now - lastResize >= RESIZE_COOLDOWN_MS
      ) {
        setNodeCount(want, cw, ch);
        lastResize = now;
      }

      // Radii scale with the viewport's linear size, so a phone gets a local
      // mesh rather than links spanning most of the screen.
      const reachScale = Math.max(
        MIN_REACH_SCALE,
        Math.min(1, Math.sqrt((cw * ch) / REF_AREA)),
      );
      const hoverReach = HOVER_REACH * reachScale;
      const linkDistance = LINK_DISTANCE * reachScale;

      let lines = 0;
      const pushLine = (x0, y0, x1, y1, a0, a1, mix, wpx) => {
        if (lines >= MAX_LINES) return;
        for (let c = 0; c < 6; c++) {
          const k = (lines * 6 + c) * 2;
          const s3 = (lines * 6 + c) * 3;
          lP0[k] = x0; lP0[k + 1] = y0;
          lP1[k] = x1; lP1[k + 1] = y1;
          lShade[s3] = CORNERS[c][0] === 0 ? a0 : a1;
          lShade[s3 + 1] = mix;
          lShade[s3 + 2] = wpx;
        }
        lines++;
      };

      for (let i = 0; i < nCount; i++) {
        nx[i] += nSpd[i] * dirX * dt * SPEED_MULT;
        ny[i] += nSpd[i] * dirY * dt * SPEED_MULT;
        if (nx[i] < -EDGE) { nx[i] = cw + EDGE; ny[i] = R() * ch; }
        else if (nx[i] > cw + EDGE) { nx[i] = -EDGE; ny[i] = R() * ch; }
        if (ny[i] < -EDGE) { ny[i] = ch + EDGE; nx[i] = R() * cw; }
        else if (ny[i] > ch + EDGE) { ny[i] = -EDGE; nx[i] = R() * cw; }

        const dx = ptr.x - nx[i];
        const dy = ptr.y - ny[i];
        const d = Math.sqrt(dx * dx + dy * dy);
        const lit = d < hoverReach ? 1 : 0;
        if (lit === 1) {
          const a = 0.5 * (1 - d / hoverReach) * HOVER_MULT;
          pushLine(nx[i], ny[i], ptr.x, ptr.y, a, a, 1, LINK_THICKNESS);
        }
        gPos[i * 2] = nx[i];
        gPos[i * 2 + 1] = ny[i];
        gLit[i] = lit;
      }

      if (linkDistance > 0) {
        const l2 = linkDistance * linkDistance;
        for (let i = 0; i < nCount && lines < MAX_LINES; i++) {
          for (let j = i + 1; j < nCount && lines < MAX_LINES; j++) {
            const dx = nx[i] - nx[j];
            const dy = ny[i] - ny[j];
            const dd = dx * dx + dy * dy;
            if (dd >= l2) continue;
            const a = 0.15 * (1 - Math.sqrt(dd) / linkDistance);
            pushLine(nx[i], ny[i], nx[j], ny[j], a, a, 0, LINK_THICKNESS);
          }
        }
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const style = getComputedStyle(document.documentElement);
      const cb = parseColor(style.getPropertyValue('--text'), [0.949, 0.925, 0.878]);
      const ca = parseColor(style.getPropertyValue('--mark'), [0.851, 0.678, 0.282]);

      if (lines > 0) {
        gl.useProgram(lineProg);
        const verts = lines * 6;
        gl.bindBuffer(gl.ARRAY_BUFFER, bP0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, lP0.subarray(0, verts * 2));
        const aP0 = gl.getAttribLocation(lineProg, 'a_p0');
        gl.enableVertexAttribArray(aP0);
        gl.vertexAttribPointer(aP0, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bP1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, lP1.subarray(0, verts * 2));
        const aP1 = gl.getAttribLocation(lineProg, 'a_p1');
        gl.enableVertexAttribArray(aP1);
        gl.vertexAttribPointer(aP1, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
        const aCorner = gl.getAttribLocation(lineProg, 'a_corner');
        gl.enableVertexAttribArray(aCorner);
        gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bShade);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, lShade.subarray(0, verts * 3));
        const aShade = gl.getAttribLocation(lineProg, 'a_shade');
        gl.enableVertexAttribArray(aShade);
        gl.vertexAttribPointer(aShade, 3, gl.FLOAT, false, 0, 0);

        gl.uniform2f(u(lineProg, 'uSize'), cw, ch);
        gl.uniform3f(u(lineProg, 'uBase'), cb[0], cb[1], cb[2]);
        gl.uniform3f(u(lineProg, 'uAccent'), ca[0], ca[1], ca[2]);
        gl.drawArrays(gl.TRIANGLES, 0, verts);
        gl.disableVertexAttribArray(aP0);
        gl.disableVertexAttribArray(aP1);
        gl.disableVertexAttribArray(aCorner);
        gl.disableVertexAttribArray(aShade);
      }

      if (nCount > 0) {
        gl.useProgram(dotProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, bGPos);
        // Only the live slots — the arrays are allocated at MAX_DENSITY, and
        // anything past nCount is stale and never drawn.
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, gPos.subarray(0, nCount * 2));
        const aPos = gl.getAttribLocation(dotProg, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bGLit);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, gLit.subarray(0, nCount));
        const aLit = gl.getAttribLocation(dotProg, 'a_lit');
        gl.enableVertexAttribArray(aLit);
        gl.vertexAttribPointer(aLit, 1, gl.FLOAT, false, 0, 0);

        gl.uniform2f(u(dotProg, 'uSize'), cw, ch);
        gl.uniform1f(u(dotProg, 'uDpr'), dpr);
        gl.uniform1f(u(dotProg, 'uDot'), DOT_SIZE);
        gl.uniform1f(u(dotProg, 'uRestAlpha'), 0.4);
        gl.uniform3f(u(dotProg, 'uBase'), cb[0], cb[1], cb[2]);
        gl.uniform3f(u(dotProg, 'uAccent'), ca[0], ca[1], ca[2]);
        gl.drawArrays(gl.POINTS, 0, nCount);
        gl.disableVertexAttribArray(aPos);
        gl.disableVertexAttribArray(aLit);
      }
    };

    if (reduced) {
      // §6 — one static frame, no loop ever scheduled. Accessibility, not a
      // rewrite of the effect: a visitor with reduced motion enabled sees a
      // still field instead of a frozen mid-drift snapshot.
      drawFrame(performance.now());
    } else {
      const render = (now) => {
        if (tabVisible) drawFrame(now);
        else last = now; // don't burn the accumulated dt while hidden
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', track);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="particle-field" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
