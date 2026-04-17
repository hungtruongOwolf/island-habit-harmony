import { useMemo } from "react";
import type { Scenery } from "../state";

/* ── Pine tree — layered, organic ────────────────────── */
const PineTree = ({ pos, seed }: { pos: [number, number]; seed: number }) => {
  const tilt = (seed - 0.5) * 0.08;
  return (
    <group position={[pos[0], 0, pos[1]]} rotation={[tilt, seed * Math.PI * 2, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.08, 0.45, 6]} />
        <meshStandardMaterial color="#6B4830" roughness={0.9} />
      </mesh>
      {/* Foliage tiers */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.42, 0.55, 8]} />
        <meshStandardMaterial color="#3A7B40" roughness={0.78} flatShading />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.32, 0.45, 8]} />
        <meshStandardMaterial color="#4A8A4A" roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <coneGeometry args={[0.22, 0.35, 7]} />
        <meshStandardMaterial color="#5A9A55" roughness={0.72} flatShading />
      </mesh>
      {/* Tip */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[0.12, 0.2, 6]} />
        <meshStandardMaterial color="#68A860" roughness={0.7} />
      </mesh>
    </group>
  );
};

/* ── Oak tree — round, lush canopy ───────────────────── */
const OakTree = ({ pos, seed }: { pos: [number, number]; seed: number }) => (
  <group position={[pos[0], 0, pos[1]]} rotation={[0, seed * Math.PI * 2, 0]}>
    {/* Trunk */}
    <mesh position={[0, 0.28, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.11, 0.56, 6]} />
      <meshStandardMaterial color="#5A3820" roughness={0.9} />
    </mesh>
    {/* Branch hint */}
    <mesh position={[0.12, 0.5, 0.05]} rotation={[0, 0, -0.5]}>
      <cylinderGeometry args={[0.03, 0.04, 0.2, 4]} />
      <meshStandardMaterial color="#5A3820" roughness={0.9} />
    </mesh>
    {/* Main canopy cluster */}
    <mesh position={[0, 0.78, 0]} castShadow>
      <sphereGeometry args={[0.44, 14, 12]} />
      <meshStandardMaterial color="#4A8548" roughness={0.75} />
    </mesh>
    <mesh position={[0.2, 0.88, 0.08]} castShadow>
      <sphereGeometry args={[0.28, 12, 10]} />
      <meshStandardMaterial color="#5A9A55" roughness={0.72} />
    </mesh>
    <mesh position={[-0.18, 0.85, -0.08]} castShadow>
      <sphereGeometry args={[0.24, 10, 10]} />
      <meshStandardMaterial color="#3D7A3A" roughness={0.78} />
    </mesh>
    <mesh position={[0.05, 0.98, 0.12]} castShadow>
      <sphereGeometry args={[0.2, 10, 8]} />
      <meshStandardMaterial color="#68A860" roughness={0.7} />
    </mesh>
  </group>
);

/* ── Palm tree ───────────────────────────────────────── */
const PalmTree = ({ pos, seed }: { pos: [number, number]; seed: number }) => (
  <group position={[pos[0], 0, pos[1]]} rotation={[0, seed * Math.PI * 2, 0]}>
    {/* Curved trunk */}
    <mesh position={[0, 0.25, 0]} rotation={[0, 0, seed * 0.12]} castShadow>
      <cylinderGeometry args={[0.05, 0.08, 0.5, 6]} />
      <meshStandardMaterial color="#9B7850" roughness={0.85} />
    </mesh>
    <mesh position={[0.02, 0.6, 0]} rotation={[0, 0, seed * 0.08]} castShadow>
      <cylinderGeometry args={[0.04, 0.055, 0.4, 6]} />
      <meshStandardMaterial color="#8B6840" roughness={0.85} />
    </mesh>
    {/* Palm fronds */}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i / 6) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(a) * 0.12, 0.85, Math.sin(a) * 0.12]} rotation={[Math.PI / 4.5, a, 0]} castShadow>
          <coneGeometry args={[0.06, 0.5, 4]} />
          <meshStandardMaterial color="#3D8A4A" roughness={0.7} />
        </mesh>
      );
    })}
    {/* Coconuts */}
    <mesh position={[0.08, 0.78, 0.04]}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial color="#5A3820" roughness={0.85} />
    </mesh>
    <mesh position={[-0.04, 0.76, -0.06]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#4A2818" roughness={0.85} />
    </mesh>
  </group>
);

/* ── Tree dispatcher ─────────────────────────────────── */
export const Tree3D = ({ pos, variant }: { pos: [number, number]; variant: number }) => {
  const seed = useMemo(() => Math.random(), []);
  if (variant === 2) return <PalmTree pos={pos} seed={seed} />;
  if (variant === 1) return <OakTree pos={pos} seed={seed} />;
  return <PineTree pos={pos} seed={seed} />;
};

/* ── Rocks — mossy, organic ──────────────────────────── */
export const Rock3D = ({ pos, variant }: { pos: [number, number]; variant: number }) => {
  const seed = useMemo(() => Math.random(), []);
  const baseSize = 0.16 + variant * 0.06;

  return (
    <group position={[pos[0], -0.02, pos[1]]} rotation={[seed * 0.3, seed * 2, seed * 0.2]}>
      {/* Main rock body */}
      <mesh castShadow>
        <dodecahedronGeometry args={[baseSize, 1]} />
        <meshStandardMaterial color={variant === 0 ? "#7A7B70" : "#8A8578"} roughness={0.92} flatShading />
      </mesh>
      {/* Secondary smaller rock */}
      {variant > 0 && (
        <mesh position={[baseSize * 0.8, -0.03, baseSize * 0.5]} castShadow>
          <dodecahedronGeometry args={[baseSize * 0.55, 1]} />
          <meshStandardMaterial color="#6A6B60" roughness={0.95} flatShading />
        </mesh>
      )}
      {/* Moss cap */}
      <mesh position={[0, baseSize * 0.5, 0]} scale={[1.05, 0.3, 1.05]}>
        <dodecahedronGeometry args={[baseSize, 1]} />
        <meshStandardMaterial color="#5A8C3B" flatShading transparent opacity={0.6} roughness={0.85} />
      </mesh>
      {/* Tiny pebbles around base */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + seed;
        return (
          <mesh key={i} position={[Math.cos(a) * baseSize * 1.2, -0.05, Math.sin(a) * baseSize * 1.2]}>
            <dodecahedronGeometry args={[0.035, 0]} />
            <meshStandardMaterial color="#8A8578" roughness={0.95} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

/* ── Flowers — cluster of tiny blooms ────────────────── */
export const Flower3D = ({ pos, variant }: { pos: [number, number]; variant: number }) => {
  const colors = ["#E58F7B", "#F2C46C", "#C9A0E0", "#FFB6C1", "#88CCDD", "#F4A8A8"];
  return (
    <group position={[pos[0], 0, pos[1]]}>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + variant * 0.5;
        const r = 0.05 + Math.random() * 0.06;
        return (
          <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
            {/* Stem */}
            <mesh>
              <cylinderGeometry args={[0.006, 0.006, 0.1 + i * 0.02, 3]} />
              <meshStandardMaterial color="#5A8C3B" roughness={0.8} />
            </mesh>
            {/* Leaf */}
            <mesh position={[0.02, 0.03, 0]} rotation={[0, 0, 0.4]}>
              <sphereGeometry args={[0.015, 4, 4]} />
              <meshStandardMaterial color="#6BA848" roughness={0.8} />
            </mesh>
            {/* Petals */}
            <mesh position={[0, 0.06 + i * 0.01, 0]}>
              <sphereGeometry args={[0.04 + i * 0.005, 8, 6]} />
              <meshStandardMaterial color={colors[(variant + i) % colors.length]} roughness={0.6} />
            </mesh>
            {/* Center */}
            <mesh position={[0, 0.065 + i * 0.01, 0.02]}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshStandardMaterial color="#F2D46C" roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/* ── Grass tuft ──────────────────────────────────────── */
export const GrassTuft = ({ pos }: { pos: [number, number] }) => (
  <group position={[pos[0], 0.01, pos[1]]}>
    {[0, 1, 2, 3, 4].map((i) => {
      const a = i * 1.2 + Math.random();
      const lean = (Math.random() - 0.5) * 0.3;
      return (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.035, 0.05, Math.sin(a) * 0.035]}
          rotation={[lean, a, 0.05]}
        >
          <coneGeometry args={[0.012, 0.1 + Math.random() * 0.04, 3]} />
          <meshStandardMaterial color={`hsl(${115 + Math.random() * 20}, ${40 + Math.random() * 15}%, ${38 + Math.random() * 12}%)`} roughness={0.8} />
        </mesh>
      );
    })}
  </group>
);

/* ── Renderer ────────────────────────────────────────── */
export const SceneryRenderer = ({ scenery }: { scenery: Scenery[] }) => (
  <>
    {scenery.map((s) => {
      if (s.type === "tree") return <Tree3D key={s.id} pos={s.pos} variant={s.variant} />;
      if (s.type === "rock") return <Rock3D key={s.id} pos={s.pos} variant={s.variant} />;
      if (s.type === "flower") return <Flower3D key={s.id} pos={s.pos} variant={s.variant} />;
      return null;
    })}
  </>
);
