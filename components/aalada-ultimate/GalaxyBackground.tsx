"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 10000;

function Galaxy({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    // Spiral galaxy: arms around a core
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 5 + 0.5;
      const spinAngle = radius * 0.8;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;
      const randomX = (Math.random() - 0.5) * 0.3 * radius;
      const randomY = (Math.random() - 0.5) * 0.3 * radius;
      const randomZ = (Math.random() - 0.5) * 0.3 * radius;
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Orange/cyan gradient: core = bright orange, arms = cyan
      const t = Math.min(1, radius / 5);
      // orange (1,0.5,0.1) -> cyan (0.1,0.8,1)
      colors[i3] = (1 - t) * 1.0 + t * 0.1;
      colors[i3 + 1] = (1 - t) * 0.5 + t * 0.8;
      colors[i3 + 2] = (1 - t) * 0.1 + t * 1.0;
      sizes[i] = Math.random() * 1.5 + 0.5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    points.current.rotation.y = t * 0.05 + mouse.current.x * 0.3;
    points.current.rotation.x = mouse.current.y * 0.2;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </points>
  );
}

export default function GalaxyBackground() {
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const { gl } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [gl]);

  return <Galaxy mouse={mouse} />;
}

export function GalaxyCanvas() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <GalaxyBackground />
      </Canvas>
    </div>
  );
}
