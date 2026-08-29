// Generates the one visual element in the site: a branching neural tree.
//
// Run once, commit the output. Nothing here executes at runtime, so the shape
// is identical for every visitor and there is no randomness in the browser.
//
//   node scripts/generate-tree.mjs > src/assets/neural-tree.svg
//
// The branching is not decorative noise. Every branch aims at a direction,
// overshoots it, and corrects back — the same motion the easing curve uses.
// Branches that wandered off stay as trace and are never removed; only the one
// chain that kept its aim is lit. The trunk is dense and the tips disperse.

const SEED = 20260829;

// mulberry32 — small, deterministic, good enough for a drawing.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 560;
const H = 840;
const rand = rng(SEED);
const between = (a, b) => a + rand() * (b - a);

const branches = []; // { d, depth, len, kind: 'trace' | 'branch' | 'lit' }
const nodes = []; // { x, y, depth, lit }

// One branch: aim, overshoot, settle. The cubic's first control point sits
// past the target angle and the second pulls back, so the curve leans out and
// recovers rather than sweeping cleanly.
function segment(x, y, angle, len, drift) {
  const over = angle + drift;
  const back = angle - drift * 0.45;
  const c1 = [x + Math.cos(over) * len * 0.42, y + Math.sin(over) * len * 0.42];
  const c2 = [x + Math.cos(back) * len * 0.78, y + Math.sin(back) * len * 0.78];
  const end = [x + Math.cos(angle) * len, y + Math.sin(angle) * len];
  return {
    d: `M${x.toFixed(1)},${y.toFixed(1)} C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${end[0].toFixed(1)},${end[1].toFixed(1)}`,
    end,
    // Enough for a dash length; exact path measurement is not needed.
    len: len * 1.15,
  };
}

function grow(x, y, angle, len, depth, onAim) {
  if (depth > 5 || len < 16) return;

  // Branches that lost their aim: short, off-angle, and kept as trace.
  const strays = depth < 2 ? 2 : rand() < 0.55 ? 1 : 0;
  for (let i = 0; i < strays; i++) {
    const a = angle + between(-1.15, 1.15);
    const s = segment(x, y, a, len * between(0.28, 0.5), between(-0.5, 0.5));
    branches.push({ ...s, depth, kind: 'trace' });
  }

  // The trunk carries several near-parallel children; the tips spread wide.
  const spread = 0.13 + depth * 0.13;
  const kids = depth === 0 ? 4 : depth === 1 ? 3 : rand() < 0.85 ? 2 : 3;
  const aimIndex = Math.floor(rand() * kids);

  for (let i = 0; i < kids; i++) {
    const t = kids === 1 ? 0 : i / (kids - 1) - 0.5;
    const a = angle + t * spread * 2 + between(-0.06, 0.06);
    const l = len * between(0.66, 0.82);
    const keptAim = onAim && i === aimIndex;
    const s = segment(x, y, a, l, between(-0.34, 0.34));
    branches.push({ ...s, depth, kind: keptAim ? 'lit' : 'branch' });
    nodes.push({ x: s.end[0], y: s.end[1], depth, lit: keptAim });
    grow(s.end[0], s.end[1], a, l, depth + 1, keptAim);
  }
}

// Trunk: dense at the base, growing upward.
const rootX = W * 0.5;
const rootY = H - 10;
const trunk = segment(rootX, rootY, -Math.PI / 2, 105, 0.08);
branches.push({ ...trunk, depth: 0, kind: 'lit' });
nodes.push({ x: trunk.end[0], y: trunk.end[1], depth: 0, lit: true });
grow(trunk.end[0], trunk.end[1], -Math.PI / 2, 150, 0, true);

// Gold on two nodes: the deepest point the aim survived to, and one junction
// on the way. The brief allows three, but the primary action on the same
// screen is already gold and the screen limit is three in total.
const litNodes = nodes.filter((n) => n.lit).sort((a, b) => a.depth - b.depth);
const gold = new Set();
if (litNodes.length) {
  gold.add(litNodes[litNodes.length - 1]);
  gold.add(litNodes[Math.floor(litNodes.length * 0.35)]);
}

const order = { trace: 0, branch: 1, lit: 2 };
branches.sort((a, b) => order[a.kind] - order[b.kind]);

const path = (b, i) =>
  `<path class="b ${b.kind}" d="${b.d}" style="--len:${b.len.toFixed(0)};--i:${b.depth};--w:${Math.max(0.5, 3.4 - b.depth * 0.42).toFixed(2)}"/>`;

const circle = (n) => {
  const isGold = gold.has(n);
  const r = isGold ? 3.4 : n.depth < 3 ? 2.2 : 1.5;
  return `<circle class="n${isGold ? ' gold' : ''}" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r}" style="--i:${n.depth}"/>`;
};

process.stdout.write(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" aria-hidden="true">` +
    `<g class="branches">${branches.map(path).join('')}</g>` +
    `<g class="nodes">${nodes.map(circle).join('')}</g>` +
    `</svg>\n`
);

process.stderr.write(
  `branches ${branches.length} (trace ${branches.filter((b) => b.kind === 'trace').length}, ` +
    `lit ${branches.filter((b) => b.kind === 'lit').length}) · nodes ${nodes.length} · gold ${gold.size}\n`
);
