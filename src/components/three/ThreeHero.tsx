"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * HERO OBJECT — "APERTURE"
 * ────────────────────────
 * A shell of instanced panels arranged on a Fibonacci sphere, each tilted
 * outward, wrapped around a faceted metallic core and cut by two thin rings.
 * It reads as a technical structure rather than a shape: something built out of
 * parts, which is the point the page is making.
 *
 * Cost control:
 *  · one InstancedMesh (200 panels) instead of 200 draw calls
 *  · no post-processing, no environment map, no shadows
 *  · dpr capped at 1.5, frameloop stops when the hero scrolls out of view
 *  · never mounted at all on touch / low-core devices — see Hero.tsx
 */

const PANELS = 200;
const ACCENT = "#d6f94c";

function fibonacciSphere(n: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return pts;
}

function Shell({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const points = useMemo(() => fibonacciSphere(PANELS, 2.1), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => points.map((_, i) => 0.6 + ((i * 37) % 100) / 140), [points]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = pointer.current ?? { x: 0, y: 0 };

    if (group.current) {
      // Slow base rotation, plus a small pointer-driven lean. Lerped so it
      // never snaps to a fast mouse.
      group.current.rotation.y += delta * 0.075;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, p.y * 0.24, 0.035);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, p.x * -0.14, 0.035);
    }

    if (mesh.current) {
      for (let i = 0; i < PANELS; i++) {
        const v = points[i];
        // Panels breathe outward on a slow sine, offset per instance.
        const push = 1 + Math.sin(t * 0.5 + i * 0.35) * 0.045;
        dummy.position.copy(v).multiplyScalar(push);
        dummy.lookAt(0, 0, 0);
        const s = seeds[i];
        dummy.scale.set(s * 0.34, s * 0.34, 0.018);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
    }

    if (core.current) {
      core.current.rotation.x -= delta * 0.14;
      core.current.rotation.y += delta * 0.1;
    }

    // Key light follows the pointer so the whole object relights as you move.
    if (light.current) {
      light.current.position.x = THREE.MathUtils.lerp(light.current.position.x, p.x * 6, 0.05);
      light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, -p.y * 5 + 1.5, 0.05);
    }
  });

  return (
    <group ref={group}>
      <pointLight ref={light} position={[4, 3, 5]} intensity={90} color="#ffffff" distance={22} decay={2} />
      <pointLight position={[-6, -3, -4]} intensity={55} color={ACCENT} distance={20} decay={2} />
      <ambientLight intensity={0.32} />

      <instancedMesh ref={mesh} args={[undefined, undefined, PANELS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#1b1b21"
          metalness={0.94}
          roughness={0.34}
          emissive={ACCENT}
          emissiveIntensity={0.045}
        />
      </instancedMesh>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial color="#0f0f13" metalness={1} roughness={0.18} flatShading />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.75, 0.006, 8, 128]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, Math.PI / 5, 0]}>
        <torusGeometry args={[3.15, 0.004, 8, 128]} />
        <meshBasicMaterial color="#edede7" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    // Deterministic scatter. Math.random() inside useMemo is impure — it would
    // produce a different cloud on every remount, and React's rules of hooks
    // (rightly) flag it. A fixed hash gives the same field every time.
    const n = 260;
    const arr = new Float32Array(n * 3);
    const hash = (i: number, k: number) => {
      const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < n; i++) {
      const r = 4.2 + hash(i, 1) * 4;
      const th = hash(i, 2) * Math.PI * 2;
      const ph = Math.acos(2 * hash(i, 3) - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.cos(ph) * 0.6;
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.018;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.028} color="#edede7" transparent opacity={0.42} sizeAttenuation />
    </points>
  );
}

/** Caps device pixel ratio after mount — retina at 3x is wasted here. */
function DprGuard() {
  const setDpr = useThree((s) => s.setDpr);
  useMemo(() => setDpr(Math.min(1.5, typeof window !== "undefined" ? window.devicePixelRatio : 1)), [setDpr]);
  return null;
}

export default function ThreeHero({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <DprGuard />
      <Shell pointer={pointer} />
      <Dust />
      <fog attach="fog" args={["#08080a", 8, 17]} />
    </Canvas>
  );
}
