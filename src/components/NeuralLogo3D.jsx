import { useEffect, useRef } from 'react';

const LOGO_LINES = [
  // Outer diamond
  0, 2.9, 0,   2.2, 0, 0,
  2.2, 0, 0,   0, -2.9, 0,
  0, -2.9, 0, -2.2, 0, 0,
 -2.2, 0, 0,   0, 2.9, 0,
  // Top inner triangle
  0, 2.3, 0,  -1.15, 0.15, 0,
 -1.15, 0.15, 0,  1.15, 0.15, 0,
  1.15, 0.15, 0,  0, 2.3, 0,
  // Bottom inner triangle
  0, -2.3, 0,  1.15, -0.15, 0,
  1.15, -0.15, 0, -1.15, -0.15, 0,
 -1.15, -0.15, 0,  0, -2.3, 0,
];

const LOGO_VERTS = [
  [0, 2.9, 0], [2.2, 0, 0], [0, -2.9, 0], [-2.2, 0, 0],
  [0, 2.3, 0], [-1.15, 0.15, 0], [1.15, 0.15, 0],
  [0, -2.3, 0], [1.15, -0.15, 0], [-1.15, -0.15, 0],
];

function randSpherePoint(rMin, rMax) {
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  const r     = rMin + Math.random() * (rMax - rMin);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta) * 0.72,
    (Math.random() - 0.5) * 2.2,
  ];
}

export default function NeuralLogo3D({ splashDone }) {
  const containerRef = useRef(null);
  const introStartRef = useRef(null);

  // Trigger Three.js intro when splash is done
  useEffect(() => {
    if (splashDone && introStartRef.current === null) {
      introStartRef.current = Date.now();
      if (containerRef.current) {
        containerRef.current.classList.add('active');
      }
    }
  }, [splashDone]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let cleanupFn = () => {};

    import('three').then((THREE) => {
      if (cancelled || !container) return;

      const W = container.clientWidth  || 400;
      const H = container.clientHeight || 400;

      // ── Renderer ───────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0, 0);
      container.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
      camera.position.z = 9;

      const group = new THREE.Group();
      scene.add(group);

      // ── Logo wireframe ────────────────────────────────
      const logoGeo = new THREE.BufferGeometry();
      logoGeo.setAttribute('position', new THREE.Float32BufferAttribute(LOGO_LINES, 3));
      const logoMat = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      group.add(new THREE.LineSegments(logoGeo, logoMat));

      // ── Neural nodes — start at origin, fly to targets ─
      const nodes = [];

      const mkNode = (tx, ty, tz, color, size, isLogo) => {
        const mat = new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), mat);
        mesh.position.set(0, 0, 0);
        group.add(mesh);
        nodes.push({ mesh, phase: Math.random() * Math.PI * 2, isLogo, tx, ty, tz });
      };

      LOGO_VERTS.forEach(([x, y, z]) => mkNode(x, y, z, 0x00d4ff, 0.095, true));

      for (let i = 0; i < 26; i++) {
        const [x, y, z] = randSpherePoint(2.6, 4.5);
        mkNode(x, y, z, i % 3 === 0 ? 0x00d4ff : 0x7b2fff, 0.058, false);
      }

      // ── Connection lines (built from target positions) ─
      const targetPos = nodes.map(n => new THREE.Vector3(n.tx, n.ty, n.tz));
      const THRESH  = 2.5;
      const connPts = [];

      for (let i = 0; i < targetPos.length; i++) {
        for (let j = i + 1; j < targetPos.length; j++) {
          if (targetPos[i].distanceTo(targetPos[j]) < THRESH) {
            connPts.push(
              targetPos[i].x, targetPos[i].y, targetPos[i].z,
              targetPos[j].x, targetPos[j].y, targetPos[j].z,
            );
          }
        }
      }
      const connGeo = new THREE.BufferGeometry();
      connGeo.setAttribute('position', new THREE.Float32BufferAttribute(connPts, 3));
      const connMat = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      group.add(new THREE.LineSegments(connGeo, connMat));

      // ── Interaction ────────────────────────────────────
      let targetMX = 0, targetMY = 0, autoY = 0, scrollY = 0, scrollVel = 0, lastScrollY = 0;

      const onMouseMove = (e) => {
        targetMY =  (e.clientX / window.innerWidth  - 0.5) * 1.6;
        targetMX = -(e.clientY / window.innerHeight - 0.5) * 1.0;
      };
      const onScroll = () => {
        scrollVel = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        scrollY = window.scrollY;
      };
      const onResize = () => {
        const w = container.clientWidth, h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('scroll',    onScroll,    { passive: true });
      window.addEventListener('resize',    onResize);

      // ── Animation ─────────────────────────────────────
      let raf;
      const INTRO_DUR = 1100; // ms — nodes fly out over this duration

      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = Date.now() * 0.001;

        // Intro progress: 0 before splashDone, 0→1 over INTRO_DUR ms after
        const introRaw = introStartRef.current === null
          ? 0
          : Math.min(1, (Date.now() - introStartRef.current) / INTRO_DUR);
        // Ease out cubic: fast start, smooth settle
        const intro = 1 - Math.pow(1 - introRaw, 3);

        // Scroll reactivity
        const pageH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollFrac = Math.min(1, scrollY / pageH);
        const velBoost = Math.abs(scrollVel) * 0.0006;
        scrollVel *= 0.85;
        autoY += 0.0045 + velBoost;

        const scrollTilt = scrollFrac * Math.PI * 0.35;
        group.rotation.y += (autoY + targetMY - group.rotation.y) * 0.035;
        group.rotation.x += (targetMX + scrollTilt - group.rotation.x) * 0.035;

        const scaleBase = 1 - scrollFrac * 0.12;
        group.scale.setScalar(scaleBase + Math.sin(t * 0.6) * 0.015);

        // Nodes: lerp from origin to target as intro plays
        nodes.forEach(({ mesh, tx, ty, tz, phase, isLogo }) => {
          mesh.position.set(tx * intro, ty * intro, tz * intro);
          const p = Math.sin(t * 2.2 + phase) * 0.5 + 0.5;
          const baseOpacity = isLogo ? 0.65 + p * 0.35 : 0.25 + p * 0.55;
          mesh.material.opacity = baseOpacity * intro;
          mesh.scale.setScalar(isLogo ? 0.85 + p * 0.45 : 0.65 + p * 0.55);
        });

        // Logo wireframe + connections fade in with intro
        logoMat.opacity = (0.65 + Math.sin(t * 1.4) * 0.30) * intro;
        connMat.opacity = (0.06 + Math.sin(t * 0.9 + 1) * 0.06) * intro;

        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll',    onScroll);
        window.removeEventListener('resize',    onResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      cleanupFn();
    };
  }, []);

  return <div ref={containerRef} className="neural-logo-fixed" />;
}
