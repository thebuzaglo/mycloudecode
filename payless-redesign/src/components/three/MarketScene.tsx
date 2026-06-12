import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
  MarketScene — the signature 3D hero backdrop.
  A floating holographic candlestick chart + undulating particle "liquidity
  floor", in brand gold/cyan. Runs in its own canvas, pointer-events: none.
*/

const GOLD = new THREE.Color("#d4af6a");
const CYAN = new THREE.Color("#3fa9c9");
const RED = new THREE.Color("#e2574c");

function Candles({ count = 26 }: { count?: number }) {
  const bodies = useRef<THREE.InstancedMesh>(null!);
  const wicks = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pseudo-random walk so the "chart" trends up — deterministic seed.
  const data = useMemo(() => {
    let price = 0;
    const arr: { x: number; o: number; c: number; h: number; l: number }[] = [];
    let s = 7;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s / 2147483647) * 2 - 1;
    };
    for (let i = 0; i < count; i++) {
      const o = price;
      const move = rnd() * 0.9 + 0.22; // upward drift
      const c = o + move;
      const h = Math.max(o, c) + Math.abs(rnd()) * 0.35;
      const l = Math.min(o, c) - Math.abs(rnd()) * 0.35;
      arr.push({ x: (i - count / 2) * 0.62, o, c, h, l });
      price = c;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    data.forEach((d, i) => {
      const bob = Math.sin(t * 0.8 + i * 0.45) * 0.07;
      const mid = (d.o + d.c) / 2 - 3.2 + bob;
      const bh = Math.max(Math.abs(d.c - d.o), 0.12);

      dummy.position.set(d.x, mid, 0);
      dummy.scale.set(0.3, bh, 0.3);
      dummy.updateMatrix();
      bodies.current.setMatrixAt(i, dummy.matrix);
      bodies.current.setColorAt(i, d.c >= d.o ? (i % 3 === 0 ? GOLD : CYAN) : RED);

      dummy.position.set(d.x, (d.h + d.l) / 2 - 3.2 + bob, 0);
      dummy.scale.set(0.045, d.h - d.l, 0.045);
      dummy.updateMatrix();
      wicks.current.setMatrixAt(i, dummy.matrix);
      wicks.current.setColorAt(i, d.c >= d.o ? CYAN : RED);
    });
    bodies.current.instanceMatrix.needsUpdate = true;
    wicks.current.instanceMatrix.needsUpdate = true;
    if (bodies.current.instanceColor) bodies.current.instanceColor.needsUpdate = true;
    if (wicks.current.instanceColor) wicks.current.instanceColor.needsUpdate = true;
  });

  return (
    <group rotation={[0.08, -0.35, 0]} position={[1.2, 0.4, 0]}>
      <instancedMesh ref={bodies} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          transparent
          opacity={0.85}
          roughness={0.25}
          metalness={0.6}
          emissive={"#1d3a4a"}
          emissiveIntensity={0.65}
        />
      </instancedMesh>
      <instancedMesh ref={wicks} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.55} />
      </instancedMesh>
    </group>
  );
}

function LiquidityFloor({ size = 46, gap = 0.42 }: { size?: number; gap?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const n = size * size;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c = new THREE.Color();
    let i = 0;
    for (let xi = 0; xi < size; xi++) {
      for (let zi = 0; zi < size; zi++) {
        pos[i * 3] = (xi - size / 2) * gap;
        pos[i * 3 + 1] = -4.1;
        pos[i * 3 + 2] = (zi - size / 2) * gap - 2;
        const mix = Math.random();
        c.copy(mix > 0.85 ? GOLD : CYAN).multiplyScalar(mix > 0.85 ? 1 : 0.75);
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
        i++;
      }
    }
    return { positions: pos, colors: col };
  }, [size, gap]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.7;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, -4.1 + Math.sin(x * 0.55 + t) * 0.32 + Math.cos(z * 0.5 + t * 0.8) * 0.32);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.12;
  });
  return (
    <mesh ref={ref} position={[1.1, -0.4, -2.5]} rotation={[1.35, 0, 0]}>
      <torusGeometry args={[4.6, 0.012, 8, 160]} />
      <meshBasicMaterial color={"#d4af6a"} transparent opacity={0.28} />
    </mesh>
  );
}

function Rig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.35 + 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0.6, -0.6, 0);
  });
  return null;
}

export default function MarketScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0.4, 8.5], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} color={"#e8d5a8"} />
        <pointLight position={[-5, 2, 3]} intensity={0.7} color={"#3fa9c9"} />
        <fog attach="fog" args={["#0b141d", 9, 20]} />
        <Candles />
        <LiquidityFloor />
        <OrbitRing />
        <Rig />
      </Canvas>
    </div>
  );
}
