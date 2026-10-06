'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { MARK_D, MARK_H, MARK_W } from './mark-path';

/**
 * The brand mark extruded from its vector path. `height` is the mark's height in metres; it is centred on the
 * group origin with the face pointing +Z. A small bevel lets the edges catch light like machined brass.
 */
export default function LogoMark3D({ height = 0.6, depth = 0.04, material, castShadow = true }: { height?: number; depth?: number; material: THREE.Material; castShadow?: boolean }) {
  const geometry = useMemo(() => {
    const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${MARK_D}"/></svg>`);
    const shapes = data.paths.flatMap(p => SVGLoader.createShapes(p));
    const s = height / MARK_H;
    const bevel = (depth * 0.15) / s;
    // Short trace segments need few divisions; 3 keeps curves smooth while the build stays fast.
    const g = new THREE.ExtrudeGeometry(shapes, { depth: depth / s - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.5, bevelSegments: 2, curveSegments: 3 });
    // SVG space (y down) → centred, y up. A 180° turn about X (not a negative scale) keeps the face winding intact.
    g.translate(-MARK_W / 2, -MARK_H / 2, 0);
    g.rotateX(Math.PI);
    g.scale(s, s, s);
    g.translate(0, 0, depth / 2);
    g.computeVertexNormals();
    return g;
  }, [height, depth]);

  return <mesh geometry={geometry} material={material} castShadow={castShadow} receiveShadow />;
}
