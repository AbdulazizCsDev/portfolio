import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './ParticleField.css';

// العنصر البصري الواحد في الموقع كله (بدّل الشجرة العصبية بقرار المالك،
// انظر PROGRESS.md § قرارات). حقل جسيمات WebGL ثابت خلف الصفحة كاملة.
//
// ينجرف لأربع ثوانٍ عند التحميل ثم يسكن نهائياً — الصفحة تُقرأ ساكنة كما
// تشترط docs/DESIGN-SPEC.md §6. التفاعل بعد السكون يبقى حياً عبر المؤشر
// وحده: عقدة واحدة أقرب للمؤشر تضيء بالذهب، البقية تضيء بالحبر الكامل،
// فميزانية الذهب (٣ مواضع في الشاشة) لا تُكسر بعشرات العُقد تحت المؤشر.

const MAX_DPR = 2;
const MAX_LINES = 2500;
const EDGE = 20; // px يجب أن يتجاوزها الجسيم قبل عودته من الجهة المقابلة
const SETTLE_MS = 4000; // ينجرف ثم يسكن، ولا حلقة رسم مستمرة بعدها
const MOBILE_BREAKPOINT = 700;

const DENSITY_DESKTOP = 120;
const DENSITY_MOBILE = 60; // نصف الكثافة تحت 700px — DESIGN-SPEC §6
const DOT_SIZE = 3;
const SPEED = 14; // px/s أساس قبل ضرب nSpd
const DIRECTION_DEG = 18; // انجراف قريب من الأسفل، غير رأسي تماماً
const HOVER_REACH = 160;
const LINK_DISTANCE = 140;
const LINK_THICKNESS = 1;

const REST_ALPHA = { dark: 0.3, light: 0.46 };
const PROX_ALPHA = { dark: 0.12, light: 0.18 };
const HOVER_ALPHA = { dark: 0.5, light: 0.6 };

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

// a_lit: 0 ساكن، 1 مضاء بالحبر (تحت المؤشر لكن ليس الأقرب)، 2 مضاء بالذهب
// (الأقرب للمؤشر وحده) — ميزانية الذهب تبقى عقدة واحدة، لا كل ما تحت المؤشر.
const DOT_FRAG = `
precision mediump float;
uniform vec3  uBase, uAccent;
uniform float uRestAlpha;
varying float v_lit;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float disc = 1.0 - smoothstep(0.72, 1.0, d);
  float isGold = step(1.5, v_lit);
  float isLit = step(0.5, v_lit);
  vec3 col = mix(uBase, uAccent, isGold);
  float a = disc * mix(uRestAlpha, 1.0, isLit);
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

export default function ParticleField() {
  const canvasRef = useRef(null);
  const { mode } = useTheme();
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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

    const R = rng(20260830);

    let nCount = 0;
    let nx = new Float32Array(0);
    let ny = new Float32Array(0);
    let nSpd = new Float32Array(0);
    let gPos = new Float32Array(0);
    let gLit = new Float32Array(0);
    const bGPos = gl.createBuffer();
    const bGLit = gl.createBuffer();

    const densityFor = (w) => (w < MOBILE_BREAKPOINT ? DENSITY_MOBILE : DENSITY_DESKTOP);

    const buildNodes = (n, w, h) => {
      nCount = n;
      nx = new Float32Array(n);
      ny = new Float32Array(n);
      nSpd = new Float32Array(n);
      gPos = new Float32Array(n * 2);
      gLit = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        nx[i] = R() * w;
        ny[i] = R() * h;
        nSpd[i] = (R() * 0.4 + 0.1) * SPEED;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, bGPos);
      gl.bufferData(gl.ARRAY_BUFFER, gPos.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bGLit);
      gl.bufferData(gl.ARRAY_BUFFER, gLit.byteLength, gl.DYNAMIC_DRAW);
    };

    const ptr = { x: -10000, y: -10000 };
    const onMove = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; };
    const onLeave = () => { ptr.x = -10000; ptr.y = -10000; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => { visible = entries[entries.length - 1].isIntersecting; },
      { threshold: 0 },
    );
    io.observe(canvas);

    let tabVisible = document.visibilityState !== 'hidden';
    const onVisibility = () => { tabVisible = document.visibilityState !== 'hidden'; };
    document.addEventListener('visibilitychange', onVisibility);

    const th = (DIRECTION_DEG * Math.PI) / 180;
    const dirX = Math.sin(th);
    const dirY = Math.cos(th);

    let raf = 0;
    let last = performance.now();
    let startedAt = last;
    let builtN = -1;
    let builtW = 0;
    let builtH = 0;

    const pushLine = (x0, y0, x1, y1, a0, a1, mix, wpx, count) => {
      if (count >= MAX_LINES) return count;
      for (let c = 0; c < 6; c++) {
        const k = (count * 6 + c) * 2;
        const s3 = (count * 6 + c) * 3;
        lP0[k] = x0; lP0[k + 1] = y0;
        lP1[k] = x1; lP1[k + 1] = y1;
        lShade[s3] = CORNERS[c][0] === 0 ? a0 : a1;
        lShade[s3 + 1] = mix;
        lShade[s3 + 2] = wpx;
      }
      return count + 1;
    };

    const distTmp = new Float32Array(0);
    let dist = distTmp;

    const drawFrame = (now, settled) => {
      const dtLocal = Math.min(0.05, (now - last) / 1000);
      last = now;

      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      const wantN = densityFor(cw);
      if (wantN !== builtN) {
        buildNodes(wantN, cw, ch);
        builtN = wantN;
        builtW = cw;
        builtH = ch;
        if (dist.length !== wantN) dist = new Float32Array(wantN);
      }
      if (cw !== builtW || ch !== builtH) {
        const sx = cw / Math.max(builtW || cw, 1);
        const sy = ch / Math.max(builtH || ch, 1);
        for (let i = 0; i < nCount; i++) { nx[i] *= sx; ny[i] *= sy; }
        builtW = cw;
        builtH = ch;
      }

      let lines = 0;

      if (!settled) {
        for (let i = 0; i < nCount; i++) {
          nx[i] += nSpd[i] * dirX * dtLocal;
          ny[i] += nSpd[i] * dirY * dtLocal;
          if (nx[i] < -EDGE) { nx[i] = cw + EDGE; ny[i] = R() * ch; }
          else if (nx[i] > cw + EDGE) { nx[i] = -EDGE; ny[i] = R() * ch; }
          if (ny[i] < -EDGE) { ny[i] = ch + EDGE; nx[i] = R() * cw; }
          else if (ny[i] > ch + EDGE) { ny[i] = -EDGE; nx[i] = R() * cw; }
        }
      }

      // العقدة الأقرب للمؤشر وحدها تضيء بالذهب — ميزانية الذهب ثلاث مواضع
      // في الشاشة الواحدة، فلا يجوز أن يضيء كل ما تحت المؤشر ذهبياً.
      let nearestIdx = -1;
      let nearestDist = Infinity;
      for (let i = 0; i < nCount; i++) {
        const dx = ptr.x - nx[i];
        const dy = ptr.y - ny[i];
        const d = Math.sqrt(dx * dx + dy * dy);
        dist[i] = d;
        if (d < HOVER_REACH && d < nearestDist) { nearestDist = d; nearestIdx = i; }
      }

      const hoverAlpha = HOVER_ALPHA[modeRef.current] ?? HOVER_ALPHA.dark;
      for (let i = 0; i < nCount; i++) {
        const d = dist[i];
        const lit = d < HOVER_REACH;
        if (lit) {
          const a = hoverAlpha * (1 - d / HOVER_REACH);
          const isNearest = i === nearestIdx ? 1 : 0;
          lines = pushLine(nx[i], ny[i], ptr.x, ptr.y, a, a, isNearest, LINK_THICKNESS, lines);
        }
        gPos[i * 2] = nx[i];
        gPos[i * 2 + 1] = ny[i];
        gLit[i] = i === nearestIdx ? 2 : lit ? 1 : 0;
      }

      const proxAlpha = PROX_ALPHA[modeRef.current] ?? PROX_ALPHA.dark;
      if (LINK_DISTANCE > 0) {
        const l2 = LINK_DISTANCE * LINK_DISTANCE;
        for (let i = 0; i < nCount && lines < MAX_LINES; i++) {
          for (let j = i + 1; j < nCount && lines < MAX_LINES; j++) {
            const dx = nx[i] - nx[j];
            const dy = ny[i] - ny[j];
            const dd = dx * dx + dy * dy;
            if (dd >= l2) continue;
            const a = proxAlpha * (1 - Math.sqrt(dd) / LINK_DISTANCE);
            lines = pushLine(nx[i], ny[i], nx[j], ny[j], a, a, 0, LINK_THICKNESS, lines);
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
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, gPos);
        const aPos = gl.getAttribLocation(dotProg, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bGLit);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, gLit);
        const aLit = gl.getAttribLocation(dotProg, 'a_lit');
        gl.enableVertexAttribArray(aLit);
        gl.vertexAttribPointer(aLit, 1, gl.FLOAT, false, 0, 0);

        gl.uniform2f(u(dotProg, 'uSize'), cw, ch);
        gl.uniform1f(u(dotProg, 'uDpr'), dpr);
        gl.uniform1f(u(dotProg, 'uDot'), DOT_SIZE);
        gl.uniform1f(u(dotProg, 'uRestAlpha'), REST_ALPHA[modeRef.current] ?? REST_ALPHA.dark);
        gl.uniform3f(u(dotProg, 'uBase'), cb[0], cb[1], cb[2]);
        gl.uniform3f(u(dotProg, 'uAccent'), ca[0], ca[1], ca[2]);
        gl.drawArrays(gl.POINTS, 0, nCount);
        gl.disableVertexAttribArray(aPos);
        gl.disableVertexAttribArray(aLit);
      }
    };

    if (reduced) {
      // إطار واحد ساكن يُرسم مرة ثم تتوقف الحلقة نهائياً — DESIGN-SPEC §6.
      drawFrame(performance.now(), true);
    } else {
      const render = (now) => {
        if (visible && tabVisible) {
          const settled = now - startedAt > SETTLE_MS;
          drawFrame(now, settled);
        } else {
          last = now; // لا نحرق dt المتراكم أثناء التوقف
        }
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <div className="particle-field" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
