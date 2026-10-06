'use client';
// Hero product film — React Three Fiber port of design-reference/hero-scene.js.
// Architectural room (concrete floor, plaster walls, steel-framed window) + Form Bench built from PBR primitives.
// Scroll progress is read from the closest [data-pin] ancestor. Pass `model="/models/form-bench.glb"` to replace
// the procedural bench with a production GLB once it exists.
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ImageSlot from '@/components/ui/ImageSlot';
import LogoMark3D from '@/components/brand/LogoMark3D';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const PI = Math.PI;

type Blobs = { n: number; min: number; max: number; a: number };

function noiseCanvas(size: number, base: string, _spread: number, blobs: Blobs, grain: number) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = base; g.fillRect(0, 0, size, size);
  for (let i = 0; i < blobs.n; i++) {
    const x = Math.random() * size, y = Math.random() * size, r = blobs.min + Math.random() * (blobs.max - blobs.min);
    const light = Math.random() > 0.5;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, light ? `rgba(255,255,255,${blobs.a})` : `rgba(0,0,0,${blobs.a})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
      if (x + dx + r < 0 || x + dx - r > size || y + dy + r < 0 || y + dy - r > size) continue;
      g.save(); g.translate(dx, dy); g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
    }
  }
  const d = g.getImageData(0, 0, size, size), p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const n = (Math.random() - 0.5) * grain;
    p[i] += n; p[i + 1] += n; p[i + 2] += n;
  }
  g.putImageData(d, 0, 0);
  return c;
}

const tex = (canvas: HTMLCanvasElement, srgb: boolean, rep: number) => {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 8; return t;
};

function makeMaterials(lite: boolean) {
  const ts = lite ? 256 : 512;
  const walnutCanvas = (() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 512; const g = c.getContext('2d')!;
    g.fillStyle = '#4a3326'; g.fillRect(0, 0, 64, 512);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${Math.random() > .5 ? '20,10,5' : '120,85,60'},${0.08 + Math.random() * 0.12})`; g.lineWidth = Math.random() * 3; g.beginPath(); const x = Math.random() * 64; g.moveTo(x, 0); g.bezierCurveTo(x + 6, 170, x - 6, 340, x + 3, 512); g.stroke(); }
    return c;
  })();
  // Contact shadow (soft occlusion beneath the bench)
  const cs = document.createElement('canvas'); cs.width = cs.height = 128; const cg = cs.getContext('2d')!;
  const gr = cg.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  cg.fillStyle = gr; cg.fillRect(0, 0, 128, 128);

  return {
    concrete: new THREE.MeshStandardMaterial({
      map: tex(noiseCanvas(ts, '#8a8680', 0, { n: 260, min: 10, max: 90, a: 0.07 }, 22), true, 5),
      roughnessMap: tex(noiseCanvas(ts, '#9a9a9a', 0, { n: 180, min: 20, max: 120, a: 0.18 }, 30), false, 4),
      roughness: 0.82, metalness: 0, envMapIntensity: 0.5
    }),
    plaster: new THREE.MeshStandardMaterial({
      map: tex(noiseCanvas(ts, '#b9b0a4', 0, { n: 320, min: 8, max: 70, a: 0.05 }, 14), true, 3),
      bumpMap: tex(noiseCanvas(ts, '#808080', 0, { n: 200, min: 4, max: 30, a: 0.25 }, 40), false, 3),
      bumpScale: 0.6, roughness: 0.95, metalness: 0, envMapIntensity: 0.25
    }),
    steel: new THREE.MeshStandardMaterial({
      color: '#1a1a19', roughness: 0.48, metalness: 0.15, envMapIntensity: 0.9,
      roughnessMap: tex(noiseCanvas(128, '#7a7a7a', 0, { n: 40, min: 2, max: 10, a: 0.2 }, 60), false, 6)
    }),
    alu: new THREE.MeshStandardMaterial({ color: '#b8bbbd', roughness: 0.32, metalness: 1, envMapIntensity: 1 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#0f0f0f', roughness: 0.92, metalness: 0 }),
    leather: new THREE.MeshPhysicalMaterial({
      color: '#5a3c2a', roughness: 0.58, metalness: 0, sheen: 0.5, sheenRoughness: 0.6, sheenColor: new THREE.Color('#9a7a62'),
      clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.7,
      bumpMap: tex(noiseCanvas(256, '#808080', 0, { n: 90, min: 1, max: 4, a: 0.35 }, 70), false, 4), bumpScale: 0.35
    }),
    walnut: new THREE.MeshStandardMaterial({ map: tex(walnutCanvas, true, 1), roughness: 0.55, metalness: 0, envMapIntensity: 0.6 }),
    urethane: new THREE.MeshStandardMaterial({ color: '#151514', roughness: 0.68, metalness: 0, envMapIntensity: 0.7 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#2a2724', roughness: 1 }),
    skirting: new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.9 }),
    stitch: new THREE.MeshStandardMaterial({ color: '#2e2016', roughness: 0.9 }),
    glow: new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff3e2').multiplyScalar(2.2) }),
    lampTop: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd9ad').multiplyScalar(2) }),
    ao: new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cs), transparent: true, depthWrite: false })
  };
}
type Mats = ReturnType<typeof makeMaterials>;
type V3 = [number, number, number];

// --- Primitive helpers (every mesh casts and receives shadows, as `shadowed()` did) ---
function Box({ s, m, p }: { s: V3; m: THREE.Material; p: V3 }) {
  return <mesh castShadow receiveShadow material={m} position={p}><boxGeometry args={s} /></mesh>;
}
function Cyl({ r, l, m, seg = 32, p, rot }: { r: number; l: number; m: THREE.Material; seg?: number; p?: V3; rot?: V3 }) {
  return <mesh castShadow receiveShadow material={m} position={p} rotation={rot}><cylinderGeometry args={[r, r, l, seg]} /></mesh>;
}
function Beam({ a, b, w, h, m }: { a: V3; b: V3; w: number; h: number; m: THREE.Material }) {
  // Matches `m.position = mid(A,B); m.lookAt(B)` evaluated before parenting (i.e. in the parent's local frame).
  const { pos, quat, len } = useMemo(() => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const o = new THREE.Object3D(); o.position.copy(A).add(B).multiplyScalar(0.5); o.lookAt(B);
    return { pos: o.position.clone(), quat: o.quaternion.clone(), len: A.distanceTo(B) };
  }, [a, b]);
  return <mesh castShadow receiveShadow material={m} position={pos} quaternion={quat}><boxGeometry args={[w, h, len]} /></mesh>;
}
function RBox({ w, d, h, r, bev, m, p, lite }: { w: number; d: number; h: number; r: number; bev: number; m: THREE.Material; p: V3; lite: boolean }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, { depth: h - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: lite ? 3 : 6, curveSegments: 10 });
    g.rotateX(-PI / 2); g.center(); g.computeVertexNormals();
    return g;
  }, [w, d, h, r, bev, lite]);
  return <mesh castShadow receiveShadow material={m} geometry={geo} position={p} />;
}

const W = { x: -3.6, z0: -2.6, z1: 1.8, y0: 0.35, y1: 3.4, H: 4.2 };

function Room({ M }: { M: Mats }) {
  const lw = (z0: number, z1: number, y0: number, y1: number) => (
    <Box key={`${z0}${y0}`} s={[0.3, y1 - y0, z1 - z0]} m={M.plaster} p={[W.x - 0.15, (y0 + y1) / 2, (z0 + z1) / 2]} />
  );
  return (
    <>
      <mesh material={M.concrete} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[20, 20]} /></mesh>
      <mesh material={M.plaster} position={[0, 3.5, -3.4]} receiveShadow><planeGeometry args={[20, 7]} /></mesh>
      {lw(-3.4, W.z0, 0, W.H)}{lw(W.z1, 8, 0, W.H)}{lw(W.z0, W.z1, 0, W.y0)}{lw(W.z0, W.z1, W.y1, W.H)}
      <mesh material={M.ceiling} position={[0, W.H, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[20, 20]} /></mesh>
      <mesh material={M.glow} position={[W.x - 0.6, (W.y0 + W.y1) / 2, (W.z0 + W.z1) / 2]} rotation={[0, PI / 2, 0]}><planeGeometry args={[W.z1 - W.z0, W.y1 - W.y0]} /></mesh>
      {[W.z0 + 0.02, (W.z0 + W.z1) / 2, W.z1 - 0.02].map(z => <Box key={'fz' + z} s={[0.06, W.y1 - W.y0, 0.05]} m={M.steel} p={[W.x - 0.12, (W.y0 + W.y1) / 2, z]} />)}
      {[W.y0 + 0.02, 1.55, W.y1 - 0.02].map(y => <Box key={'fy' + y} s={[0.06, 0.05, W.z1 - W.z0]} m={M.steel} p={[W.x - 0.12, y, (W.z0 + W.z1) / 2]} />)}
      <Box s={[20, 0.06, 0.02]} m={M.skirting} p={[0, 0.03, -3.39]} />

      {/* Background: low walnut rack with dumbbells */}
      <group position={[1.9, 0, -2.75]} rotation={[0, -0.08, 0]}>
        <Box s={[1.6, 0.04, 0.4]} m={M.walnut} p={[0, 0.42, 0]} />
        {[-0.76, 0.76].map(x => <Box key={x} s={[0.04, 0.42, 0.36]} m={M.steel} p={[x, 0.21, 0]} />)}
        {[0, 1, 2, 3].map(i => {
          const s = 0.07 + i * 0.012, x = -0.55 + i * 0.36;
          return (
            <group key={i} position={[x, 0.44 + s, 0]} rotation={[0, PI / 2, 0]}>
              <Cyl r={0.016} l={0.14} m={M.alu} seg={16} rot={[PI / 2, 0, 0]} />
              {[-1, 1].map(k => <Cyl key={k} r={s} l={0.07 + i * 0.008} m={M.urethane} seg={40} rot={[PI / 2, 0, 0]} p={[0, 0, k * (0.1 + i * 0.004)]} />)}
            </group>
          );
        })}
      </group>
      {/* Brand mark in brushed aluminium, stood off the plaster inside the warm wall wash */}
      <group position={[0.8, 0.95, -3.4 + 0.0145]}>
        <LogoMark3D width={0.5} depth={0.025} material={M.alu} />
      </group>
      <group position={[3.1, 0, -2.6]}>
        <Cyl r={0.11} l={1.2} m={M.plaster} seg={40} p={[0, 0.6, 0]} />
        <pointLight color="#ffc78f" intensity={1.6} distance={3} decay={2} position={[0, 1.25, 0.05]} />
        <mesh material={M.lampTop} rotation={[-PI / 2, 0, 0]} position={[0, 1.201, 0]}><circleGeometry args={[0.09, 32]} /></mesh>
      </group>
    </>
  );
}

const PIVOT_POS = new THREE.Vector3(0, 0.398, 0.02);
const TIP = new THREE.Vector3(0, -0.01, -0.5).applyEuler(new THREE.Euler(0.38, 0, 0)).add(PIVOT_POS);

/** Form Bench (procedural placeholder). */
function ProceduralBench({ M, lite, pivot }: { M: Mats; lite: boolean; pivot: RefObject<THREE.Group | null> }) {
  return (
    <>
      <Box s={[0.6, 0.05, 0.075]} m={M.steel} p={[0, 0.04, 0.6]} />
      <Box s={[0.52, 0.05, 0.075]} m={M.steel} p={[0, 0.04, -0.62]} />
      {[-1, 1].map(k => (
        <group key={k}>
          <Cyl r={0.03} l={0.03} m={M.rubber} seg={20} p={[k * 0.27, 0.015, -0.62]} />
          <Cyl r={0.04} l={0.03} m={M.rubber} seg={28} rot={[0, 0, PI / 2]} p={[k * 0.32, 0.045, 0.6]} />
          <Cyl r={0.016} l={0.034} m={M.alu} seg={16} rot={[0, 0, PI / 2]} p={[k * 0.32, 0.045, 0.6]} />
        </group>
      ))}
      <Box s={[0.075, 0.075, 1.3]} m={M.steel} p={[0, 0.1, -0.01]} />
      <Box s={[0.075, 0.24, 0.075]} m={M.steel} p={[0, 0.255, 0.2]} />
      <Beam a={[0, 0.12, 0.5]} b={[0, 0.34, 0.27]} w={0.06} h={0.06} m={M.steel} />
      <Box s={[0.22, 0.012, 0.3]} m={M.steel} p={[0, 0.383, 0.21]} />
      <RBox w={0.28} d={0.36} h={0.075} r={0.05} bev={0.018} m={M.leather} p={[0, 0.427, 0.22]} lite={lite} />
      <group ref={pivot} position={PIVOT_POS} rotation={[0.38, 0, 0]}>
        <Box s={[0.22, 0.012, 0.74]} m={M.steel} p={[0, -0.008, -0.42]} />
        <RBox w={0.28} d={0.84} h={0.075} r={0.06} bev={0.018} m={M.leather} p={[0, 0.036, -0.45]} lite={lite} />
        {/* stitching line */}
        <mesh material={M.stitch} position={[0, 0.02, -0.45]}><boxGeometry args={[0.282, 0.003, 0.844]} /></mesh>
      </group>
      <Beam a={[0, 0.14, -0.42]} b={[0, TIP.y, TIP.z]} w={0.055} h={0.055} m={M.steel} />
      <Box s={[0.05, 0.022, 0.42]} m={M.alu} p={[0, 0.148, -0.32]} />
      {[0, 1, 2, 3, 4, 5, 6].map(i => <Box key={i} s={[0.052, 0.018, 0.012]} m={M.steel} p={[0, 0.165, -0.5 + i * 0.055]} />)}
      <Cyl r={0.018} l={0.06} m={M.alu} seg={24} rot={[0, 0, PI / 2]} p={[0.07, 0.3, 0.2]} />
      <Cyl r={0.026} l={0.02} m={M.rubber} seg={24} rot={[0, 0, PI / 2]} p={[0.105, 0.3, 0.2]} />
      <Cyl r={0.014} l={0.4} m={M.alu} seg={20} rot={[0, 0, PI / 2]} p={[0, 0.09, -0.69]} />
      {[-0.19, 0.19].map(x => <Box key={x} s={[0.02, 0.06, 0.06]} m={M.steel} p={[x, 0.07, -0.67]} />)}
      <mesh material={M.ao} rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0]}><planeGeometry args={[0.9, 1.8]} /></mesh>
    </>
  );
}

/** Production GLB swap — replaces the procedural bench once loaded. */
function GlbBench({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  useLayoutEffect(() => { gltf.scene.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = o.receiveShadow = true; } }); }, [gltf]);
  return <primitive object={gltf.scene} />;
}

/** Environment for reflections: a dim room with one bright window panel. */
export function RoomEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl), env = new THREE.Scene();
    const envBox = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 12), new THREE.MeshBasicMaterial({ color: '#2b2824', side: THREE.BackSide }));
    envBox.position.y = 3; env.add(envBox);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.4), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff1de').multiplyScalar(6) }));
    win.position.set(-5.9, 2.2, 0); win.rotation.y = PI / 2; env.add(win);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe2c2').multiplyScalar(1.2) }));
    top.position.set(1, 5.9, -1); top.rotation.x = PI / 2; env.add(top);
    const rt = pm.fromScene(env, 0.04);
    scene.environment = rt.texture;
    return () => { scene.environment = null; rt.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
}

type Rig = {
  bench: RefObject<THREE.Group | null>; pivot: RefObject<THREE.Group | null>;
  sun: RefObject<THREE.DirectionalLight | null>; wash: RefObject<THREE.SpotLight | null>;
};

function Lights({ lite, rig }: { lite: boolean; rig: Rig }) {
  const targets = useMemo(() => {
    const mk = (x: number, y: number, z: number) => { const o = new THREE.Object3D(); o.position.set(x, y, z); return o; };
    return { sun: mk(0.4, 0, -0.4), wash: mk(0.8, 0.6, -3.4), key: mk(0, 0.3, 0) };
  }, []);
  useLayoutEffect(() => {
    const sun = rig.sun.current; if (!sun) return;
    sun.shadow.mapSize.set(lite ? 1024 : 2048, lite ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 3.5, bottom: -3.5, near: 1, far: 16 });
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 5;
  }, [lite, rig.sun]);
  return (
    <>
      <hemisphereLight args={['#d9d2c8', '#2a2622', 0.18]} />
      <primitive object={targets.sun} /><primitive object={targets.wash} /><primitive object={targets.key} />
      <directionalLight ref={rig.sun} color="#ffdcb4" intensity={2.6} position={[-7, 4.6, 0.6]} target={targets.sun} castShadow />
      <spotLight ref={rig.wash} color="#ffdcb8" intensity={14} distance={7} angle={0.75} penumbra={1} decay={2} position={[0.8, 3.9, -2.4]} target={targets.wash} />
      <spotLight color="#fff2e2" intensity={8} distance={8} angle={0.5} penumbra={1} decay={2} position={[2.2, 3.4, 2.2]} target={targets.key} />
    </>
  );
}

const cA = new THREE.Color('#ffd2a6'), cB = new THREE.Color('#f4efe8');

/** Scroll-driven camera/light rig: damped (0.075/frame), renders on demand, pauses off-screen. */
function Controller({ host, rig, reduced }: { host: RefObject<HTMLDivElement | null>; rig: Rig; reduced: boolean }) {
  const { camera, gl, size, invalidate } = useThree();
  const st = useRef({ p: 0, target: 0, visible: true }) as MutableRefObject<{ p: number; target: number; visible: boolean }>;
  const tmp = useMemo(() => new THREE.Color(), []);
  const tgt = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const s = st.current;
    const read = () => {
      const pin = host.current && host.current.closest('[data-pin]');
      if (!pin) return 0;
      const r = pin.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
    };
    s.target = s.p = read();
    const onScroll = () => { s.target = read(); if (s.visible) invalidate(); };
    addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) invalidate(); });
    if (host.current) io.observe(host.current);
    invalidate();
    return () => { removeEventListener('scroll', onScroll); io.disconnect(); };
  }, [host, invalidate]);

  useFrame(() => {
    const s = st.current;
    const k = reduced ? 1 : 0.075;
    s.p += (s.target - s.p) * k;
    if (Math.abs(s.target - s.p) < 0.0004) s.p = s.target; else if (s.visible) invalidate();

    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width, h = size.height, mobile = w < 760;
    const fov = mobile ? 42 : 30;
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const p = ease(clamp(s.p, 0, 1));
    const az = lerp(0.92, 0.26, p), rad = lerp(mobile ? 4.6 : 3.7, mobile ? 3.9 : 3.05, p), hgt = lerp(1.35, 0.95, p);
    tgt.set(lerp(0, -0.05, p), lerp(0.38, 0.34, p), lerp(-0.05, -0.15, p));
    cam.position.set(tgt.x + Math.sin(az) * rad, hgt, tgt.z + Math.cos(az) * rad);
    cam.lookAt(tgt);
    // Shift the product right while headline sits left, then centre/left as specs appear
    if (!mobile) {
      const a = ease(clamp((s.p - 0.18) / 0.3, 0, 1)), b = ease(clamp((s.p - 0.66) / 0.24, 0, 1));
      const shift = lerp(lerp(-0.17, 0.13, a), -0.16, b);
      cam.setViewOffset(w, h, shift * w, 0, w, h);
    } else { cam.setViewOffset(w, h, 0, -0.08 * h, w, h); }
    if (rig.bench.current) rig.bench.current.rotation.y = lerp(-0.12, 0.1, p);
    if (rig.pivot.current) rig.pivot.current.rotation.x = lerp(0.38, 0.62, ease(clamp((s.p - 0.35) / 0.4, 0, 1)));
    const sun = rig.sun.current;
    if (sun) {
      sun.color.copy(tmp.copy(cA).lerp(cB, p));
      sun.intensity = lerp(2.7, 2.0, p);
      sun.position.set(-7, lerp(4.6, 5.6, p), lerp(0.6, -0.6, p));
    }
    if (rig.wash.current) rig.wash.current.intensity = lerp(12, 20, p);
    gl.toneMappingExposure = lerp(0.92, 1.02, p);
  });
  return null;
}

function Scene({ lite, reduced, host, model }: { lite: boolean; reduced: boolean; host: RefObject<HTMLDivElement | null>; model?: string }) {
  const M = useMemo(() => makeMaterials(lite), [lite]);
  const rig: Rig = { bench: useRef<THREE.Group>(null), pivot: useRef<THREE.Group>(null), sun: useRef<THREE.DirectionalLight>(null), wash: useRef<THREE.SpotLight>(null) };
  const procedural = <ProceduralBench M={M} lite={lite} pivot={rig.pivot} />;
  return (
    <>
      <color attach="background" args={['#141311']} />
      <fog attach="fog" args={['#141311', 9, 18]} />
      <RoomEnvironment />
      <Room M={M} />
      <group ref={rig.bench}>
        {model ? <Suspense fallback={procedural}><GlbBench url={model} /></Suspense> : procedural}
      </group>
      <Lights lite={lite} rig={rig} />
      <Controller host={host} rig={rig} reduced={reduced} />
    </>
  );
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export default function HeroScene({ model }: { model?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [env] = useState(() => ({
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    lite: matchMedia('(max-width: 760px)').matches || (navigator.hardwareConcurrency || 8) <= 4,
    webgl: hasWebGL()
  }));
  const [shown, setShown] = useState(false);

  if (!env.webgl) {
    // Static poster for browsers without WebGL.
    return (
      <div className="absolute inset-0 block w-full h-full text-[#7D786F]">
        <ImageSlot id="hero-poster" caption="Form Bench — architectural room, window light" priority />
      </div>
    );
  }
  return (
    <div ref={host} className="absolute inset-0 block w-full h-full">
      <Canvas
        frameloop="demand"
        shadows="soft"
        dpr={Math.min(devicePixelRatio, env.lite ? 1.25 : 1.75)}
        gl={{ antialias: !env.lite, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        camera={{ fov: 30, near: 0.1, far: 40 }}
        style={{ width: '100%', height: '100%', display: 'block', opacity: shown ? 1 : 0, transition: 'opacity 1.6s ease' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.95;
          requestAnimationFrame(() => setShown(true));
        }}
      >
        <Scene lite={env.lite} reduced={env.reduced} host={host} model={model} />
      </Canvas>
    </div>
  );
}
