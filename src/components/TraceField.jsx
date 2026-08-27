import { useEffect, useRef } from 'react';
import { readToken, onModeChange } from '../lib/tokens';
import './TraceField.css';

// §6 — one canvas behind everything. Paths reach for a target, overshoot,
// come back and settle. The ones that miss are never erased: the field is a
// record of the attempts, so density reads as a map of difficulty.
//
// Character follows scroll: organic at the top, snapping to 45° by the bottom.
// Nothing is cleared as you scroll, so geometry accumulates over the residue
// of the earlier fumbling.

const TAU = Math.PI * 2;
const SNAP = Math.PI / 4; // 45°

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export default function TraceField({
  density = 1,
  traceOpacity = 1,
  speed = 1,
  segmentsPerFrame = 3,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let onScreen = true;
    let nodes = [];
    let paths = [];
    let colors = { trace: 'rgba(217,173,72,0.05)', mark: '#d9ad48' };
    let W = 0;
    let H = 0;
    let small = false;
    let drawn = 0;          // segments laid down, so density stays bounded
    let lastSeedPhase = -1; // the phase the last batch was grown at

    const readColors = () => {
      colors = {
        trace: readToken('--trace') || colors.trace,
        mark: readToken('--mark') || colors.mark,
      };
    };

    // How geometric the field is right now: 0 organic, 1 strict.
    const phase = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    // A node is somewhere a path wants to arrive. Difficulty decides how many
    // times it gets missed first, which is what makes the field uneven.
    const makeNodes = () => {
      const count = Math.round((small ? 7 : 14) * density);
      nodes = Array.from({ length: count }, () => ({
        x: rand(0.04, 0.96) * W,
        y: rand(0.04, 0.96) * H,
        difficulty: Math.random() < 0.28 ? rand(1.5, 2.5) : rand(0, 0.9),
      }));
    };

    // One attempt at reaching a target. `doomed` attempts settle wide and stay
    // as trace; the final one lands and earns the mark.
    const makePath = (from, to, doomed) => ({
      x: from.x,
      y: from.y,
      to,
      doomed,
      done: false,
      stage: 'reach',
      steps: 0,
      maxSteps: 90,
    });

    // §3 — the trace stays a residue, never a texture. Past this many segments
    // the field stops growing however far you scroll.
    const cap = () => (small ? 2600 : 5200) * density;

    // Branching, not a mesh: each node reaches for a near neighbour, so the
    // structure grows locally the way a nerve or a trace run does.
    const connect = (targets) => {
      for (const node of targets) {
        const near = nodes
          .filter((n) => n !== node)
          .sort((a, b) => Math.hypot(a.x - node.x, a.y - node.y) - Math.hypot(b.x - node.x, b.y - node.y))
          .slice(0, 3);
        if (!near.length) continue;
        const source = pick(near);
        const misses = Math.round(node.difficulty);
        for (let i = 0; i < misses; i++) paths.push(makePath(source, node, true));
        paths.push(makePath(source, node, false));
      }
    };

    const seed = () => { paths = []; connect(nodes); };

    // §6 — the field's character follows the scroll, so crossing into a new
    // stretch grows a fresh batch in that stretch's geometry. Earlier growth
    // is never cleared: strict angles accumulate over the organic residue.
    const seedBatch = () => {
      if (drawn > cap()) return;
      const add = Math.round((small ? 3 : 5) * density);
      const fresh = Array.from({ length: add }, () => ({
        x: rand(0.04, 0.96) * W,
        y: rand(0.04, 0.96) * H,
        difficulty: Math.random() < 0.28 ? rand(1.5, 2.5) : rand(0, 0.9),
      }));
      nodes = nodes.concat(fresh).slice(-44);
      paths = paths.filter((p) => !p.done);
      connect(fresh);
    };

    // Advance one path by a single segment and stroke it.
    const step = (p, ph) => {
      if (p.done) return;
      p.steps++;
      if (p.steps > p.maxSteps) { p.done = true; return; }

      const dx = p.to.x - p.x;
      const dy = p.to.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (p.stage === 'reach' && dist < 14) {
        // §6 — overshoot, then come back. Same physics as the easing curve.
        p.stage = p.doomed ? 'settle' : 'over';
        p.over = 0;
      }

      let angle = Math.atan2(dy, dx);
      if (p.stage === 'over') {
        angle += Math.PI * rand(-0.12, 0.12);
        p.over++;
        if (p.over > 5) p.stage = 'settle';
      }

      // Organic at the top, snapped to 45° by the bottom.
      if (ph > 0) {
        const snapped = Math.round(angle / SNAP) * SNAP;
        angle = angle + (snapped - angle) * ph;
      }
      const jitter = (1 - ph) * 0.5;
      angle += rand(-jitter, jitter);

      const len = (small ? 5 : 7) * (1 - ph * 0.25);
      const nx = p.x + Math.cos(angle) * len;
      const ny = p.y + Math.sin(angle) * len;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = p.doomed ? colors.trace : colors.mark;
      ctx.globalAlpha = p.doomed ? traceOpacity : 0.13;
      ctx.lineWidth = p.doomed ? (small ? 0.4 : 0.55) : 0.7;
      ctx.stroke();
      drawn++;

      p.x = nx;
      p.y = ny;

      if (p.stage === 'settle' && dist < 10) {
        p.done = true;
        if (!p.doomed) {
          // A landing: the via that says this one arrived.
          ctx.beginPath();
          ctx.arc(p.to.x, p.to.y, ph > 0.5 ? 1.9 : 1.4, 0, TAU);
          ctx.globalAlpha = 0.34;
          ctx.fillStyle = colors.mark;
          ctx.fill();
          if (ph > 0.5) {
            ctx.beginPath();
            ctx.arc(p.to.x, p.to.y, 3.8, 0, TAU);
            ctx.globalAlpha = 0.16;
            ctx.strokeStyle = colors.mark;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // §6 — capped at 2
      W = window.innerWidth;
      H = window.innerHeight;
      small = W < 700; // §6 — half the paths, thinner trace
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      readColors();
      drawn = 0;
      makeNodes();
      seed();
      lastSeedPhase = phase();
    };

    // §6 — reduced motion draws one expressive frame and never loops. The
    // trace and the corrected paths are both there; only the growth is gone.
    const drawStatic = () => {
      const ph = phase();
      let guard = 0;
      while (paths.some((p) => !p.done) && guard++ < 40000) {
        for (const p of paths) step(p, ph);
      }
    };

    const frame = () => {
      if (!onScreen || document.hidden) { raf = 0; return; }
      const ph = phase();
      const budget = Math.max(1, Math.round(segmentsPerFrame * speed));
      let moved = false;
      for (let i = 0; i < budget; i++) {
        for (const p of paths) {
          if (!p.done) { step(p, ph); moved = true; }
        }
      }
      // The field is a record, not a screensaver: once every path has settled
      // the loop ends. Reseeding forever would saturate the canvas and blow
      // past the 5% the trace is allowed.
      if (!moved) { raf = 0; return; }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (still.matches || raf || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    build();
    if (still.matches) drawStatic();
    else start();

    // §6 — stop when off screen, and when the tab is hidden.
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      onScreen ? start() : stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    // Reduced motion keeps its single frame: no scroll growth at all.
    const onScroll = () => {
      if (still.matches) return;
      const ph = phase();
      if (Math.abs(ph - lastSeedPhase) < 0.15) return;
      lastSeedPhase = ph;
      seedBatch();
      start();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        stop();
        build();
        still.matches ? drawStatic() : start();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    // A mode flip changes both colours, and strokes already on the canvas
    // cannot be recoloured — so the field starts over.
    const stopWatching = onModeChange(() => {
      stop();
      build();
      still.matches ? drawStatic() : start();
    });

    const onStillChange = () => { stop(); build(); still.matches ? drawStatic() : start(); };
    still.addEventListener('change', onStillChange);

    return () => {
      stop();
      io.disconnect();
      stopWatching();
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      still.removeEventListener('change', onStillChange);
    };
  }, [density, traceOpacity, speed, segmentsPerFrame]);

  return <canvas ref={canvasRef} className="trace-field" aria-hidden="true" />;
}
