'use client';
// Interactive 3D logo: the extruded mark in brushed steel on a walnut plinth, same environment and tone mapping
// as the hero room. Turns slowly on its own; drag to rotate.
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import LogoMark3D from './LogoMark3D';
import { RoomEnvironment } from '@/components/home/HeroScene';

function Turntable({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const drag = useRef({ on: false, x: 0, v: 0 });
  const { gl } = useThree();
  const mats = useMemo(() => ({
    steel: new THREE.MeshStandardMaterial({ color: '#c9ccce', metalness: 1, roughness: 0.28, envMapIntensity: 1.1 }),
    walnut: new THREE.MeshStandardMaterial({ color: '#4a3326', roughness: 0.55, metalness: 0, envMapIntensity: 0.6 })
  }), []);

  useFrame((_, dt) => {
    const d = drag.current, grp = g.current; if (!grp) return;
    if (!d.on) { d.v += ((reduced ? 0 : 0.25) - d.v) * Math.min(1, dt * 2); grp.rotation.y += d.v * dt; }
  });

  useEffect(() => {
    const el = gl.domElement, d = drag.current;
    const down = (e: PointerEvent) => { d.on = true; d.x = e.clientX; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!d.on || !g.current) return; const dx = e.clientX - d.x; d.x = e.clientX; g.current.rotation.y += dx * 0.01; d.v = dx * 0.6; };
    const up = (e: PointerEvent) => { d.on = false; if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
  }, [gl]);

  return (
    <group ref={g} position={[0, 0.05, 0]}>
      <group position={[0, 0.315, 0]}><LogoMark3D width={0.7} depth={0.06} material={mats.steel} /></group>
      <mesh material={mats.walnut} position={[0, -0.03, 0]} castShadow receiveShadow><boxGeometry args={[0.9, 0.06, 0.24]} /></mesh>
    </group>
  );
}

export default function BrandScene() {
  const [reduced] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  return (
    <Canvas
      shadows="soft" dpr={[1, 1.75]} camera={{ fov: 30, position: [0, 0.55, 2.6] }}
      gl={{ antialias: true }} className="cursor-grab active:cursor-grabbing"
      onCreated={({ gl, camera }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; camera.lookAt(0, 0.4, 0); }}
    >
      <color attach="background" args={['#141311']} />
      <RoomEnvironment />
      <hemisphereLight args={['#d9d2c8', '#2a2622', 0.25]} />
      <directionalLight color="#ffdcb4" intensity={2.4} position={[-3, 3.5, 2]} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight color="#fff2e2" intensity={6} distance={8} angle={0.6} penumbra={1} decay={2} position={[2.2, 2.4, 2.2]} />
      <Turntable reduced={reduced} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={0.45} />
      </mesh>
    </Canvas>
  );
}
