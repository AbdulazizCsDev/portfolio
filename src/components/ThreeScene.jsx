import { useEffect, useRef } from 'react';

const OBJECTS = [
  { geo: 'icosahedron',  size: 1.2,  detail: 1, color: 0x00d4ff, opacity: 0.20, x:  4.2, y:  1.8, z: -2.0, rx: 0.003, ry: 0.005 },
  { geo: 'torusknot',    size: 0.48, detail: 0, color: 0x7b2fff, opacity: 0.15, x: -4.0, y: -1.6, z: -3.0, rx: 0.004, ry: 0.003 },
  { geo: 'octahedron',   size: 0.80, detail: 0, color: 0x00d4ff, opacity: 0.17, x:  3.5, y: -2.8, z: -1.5, rx: 0.002, ry: 0.006 },
  { geo: 'icosahedron',  size: 0.60, detail: 0, color: 0x7b2fff, opacity: 0.13, x: -3.2, y:  2.4, z: -2.5, rx: 0.005, ry: 0.002 },
  { geo: 'dodecahedron', size: 0.70, detail: 0, color: 0x00d4ff, opacity: 0.12, x:  0.8, y: -3.8, z: -3.5, rx: 0.003, ry: 0.004 },
];

export default function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mount = mountRef.current;
    const isMobile = window.innerWidth < 768;
    const objList = isMobile ? OBJECTS.slice(0, 3) : OBJECTS;

    let cleanupFn = () => {};

    import('three').then((THREE) => {
      if (!mount) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 6;

      const meshes = objList.map(({ geo, size, detail, color, opacity, x, y, z, rx, ry }) => {
        let geometry;
        if (geo === 'icosahedron')       geometry = new THREE.IcosahedronGeometry(size, detail);
        else if (geo === 'octahedron')   geometry = new THREE.OctahedronGeometry(size, detail);
        else if (geo === 'torusknot')    geometry = new THREE.TorusKnotGeometry(size, size * 0.3, 80, 12);
        else if (geo === 'dodecahedron') geometry = new THREE.DodecahedronGeometry(size, detail);
        else                             geometry = new THREE.IcosahedronGeometry(size, detail);

        const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(x, y, z);
        mesh.userData = { baseX: x, baseY: y, rx, ry };
        scene.add(mesh);
        return mesh;
      });

      let mouseX = 0, mouseY = 0, scrollY = 0;

      const onMouseMove = (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = -(e.clientY / window.innerHeight - 0.5);
      };
      const onScroll = () => { scrollY = window.scrollY; };
      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      let raf;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        meshes.forEach((mesh, i) => {
          mesh.rotation.x += mesh.userData.rx;
          mesh.rotation.y += mesh.userData.ry;
          const depth = (i + 1) * 0.12;
          const targetX = mesh.userData.baseX + mouseX * depth * 5;
          const targetY = mesh.userData.baseY + mouseY * depth * 4 - scrollY * 0.0015 * (i + 1);
          mesh.position.x += (targetX - mesh.position.x) * 0.04;
          mesh.position.y += (targetY - mesh.position.y) * 0.04;
        });
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        meshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    });

    return () => cleanupFn();
  }, []);

  return <div ref={mountRef} className="three-scene" />;
}
