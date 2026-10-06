'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { MARK_PARTS } from './Logo';

/**
 * The brand mark extruded from the exact 2D geometry (MARK_PARTS, 48-unit grid). `width` is the mark's width in
 * metres; it is centred on the group origin with the face pointing +Z. Bevels are kept tiny so the edges catch
 * light like machined metal without rounding the architecture away.
 */
export default function LogoMark3D({ width = 0.6, depth = 0.025, material, castShadow = true }: { width?: number; depth?: number; material: THREE.Material; castShadow?: boolean }) {
  const geometry = useMemo(() => {
    const s = width / 40; // mark spans x 4 → 44 (40 units)
    const shapes = MARK_PARTS.map(p => {
      const pts: [number, number][] = p.kind === 'rect'
        ? [[p.d[0], p.d[1]], [p.d[0] + p.d[2], p.d[1]], [p.d[0] + p.d[2], p.d[1] + p.d[3]], [p.d[0], p.d[1] + p.d[3]]]
        : Array.from({ length: p.d.length / 2 }, (_, i) => [p.d[i * 2], p.d[i * 2 + 1]] as [number, number]);
      // SVG y runs down; flip it and centre the 48-grid mark (bounds x 4–44, y 6–42).
      return new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2((x - 24) * s, (24 - y) * s)));
    });
    const bevel = Math.min(depth * 0.18, width * 0.004);
    const g = new THREE.ExtrudeGeometry(shapes, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.6, bevelSegments: 2, curveSegments: 1 });
    g.translate(0, 0, -depth / 2);
    g.computeVertexNormals();
    return g;
  }, [width, depth]);

  return <mesh geometry={geometry} material={material} castShadow={castShadow} receiveShadow />;
}
