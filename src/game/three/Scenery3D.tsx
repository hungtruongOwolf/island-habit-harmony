import { useMemo } from "react";
import * as THREE from "three";
import type { Scenery, District } from "../state";

// ── Trees: pine, oak, palm variants ──
export const Tree3D = ({ pos, variant }: { pos: [number, number]; variant: number }) => {
  const seed = useMemo(() => Math.random(), []);
  if (variant === 2) {
    // Palm
    return (
      <group position={[pos[0], 0, pos[1]]} rotation={[0, seed * Math.PI * 2, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow rotation={[0, 0, seed * 0.1]}>
          <cylinderGeometry args={[0.05, 0.07, 0.9, 6]} />
          <meshStandardMaterial color="#8B5E3C" />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.15, 0.95, Math.sin(a) * 0.15]} rotation={[Math.PI / 5, a, 0]}>
              <coneGeometry args={[0.08, 0.55, 4]} />
              <meshStandardMaterial color="#3F8A4A" />
            </mesh>
          );
        })}
        {/* Coconuts */}
        <mesh position={[0.1, 0.85, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#4A2818" /></mesh>
      </group>
    );
  }
  if (variant === 1) {
    // Oak (round canopy)
    return (
      <group position={[pos[0], 0, pos[1]]} rotation={[0, seed * Math.PI * 2, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.1, 0.13, 0.6, 8]} /><meshStandardMaterial color="#6B4226" /></mesh>
        <mesh position={[0, 0.78, 0]} castShadow><sphereGeometry args={[0.42, 12, 12]} /><meshStandardMaterial color="#4A8A4A" /></mesh>
        <mesh position={[0.18, 0.92, 0.05]} castShadow><sphereGeometry args={[0.25, 10, 10]} /><meshStandardMaterial color="#5A9A5A" /></mesh>
        <mesh position={[-0.2, 0.85, -0.1]} castShadow><sphereGeometry args={[0.22, 10, 10]} /><meshStandardMaterial color="#3F7A3F" /></mesh>
      </group>
    );
  }
  // Pine (cone stack)
  return (
    <group position={[pos[0], 0, pos[1]]} rotation={[0, seed * Math.PI * 2, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 0.4, 6]} /><meshStandardMaterial color="#5A3820" /></mesh>
      <mesh position={[0, 0.65, 0]} castShadow><coneGeometry args={[0.4, 0.7, 8]} /><meshStandardMaterial color="#3F7A3F" /></mesh>
      <mesh position={[0, 1.0, 0]} castShadow><coneGeometry args={[0.3, 0.5, 8]} /><meshStandardMaterial color="#4A8A4A" /></mesh>
      <mesh position={[0, 1.3, 0]} castShadow><coneGeometry args={[0.2, 0.35, 8]} /><meshStandardMaterial color="#5A9A5A" /></mesh>
    </group>
  );
};

export const Rock3D = ({ pos, variant }: { pos: [number, number]; variant: number }) => {
  const seed = useMemo(() => Math.random(), []);
  return (
    <group position={[pos[0], -0.05, pos[1]]} rotation={[seed, seed * 2, seed * 1.5]}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.18 + variant * 0.06, 0]} />
        <meshStandardMaterial color={variant === 0 ? "#8A8B85" : "#9B8E7E"} flatShading />
      </mesh>
      {variant > 0 && (
        <mesh position={[0.15, -0.05, 0.1]} castShadow>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#7A7B75" flatShading />
        </mesh>
      )}
      {/* Moss */}
      <mesh position={[0, 0.08, 0]} scale={[1.05, 0.3, 1.05]}>
        <dodecahedronGeometry args={[0.18 + variant * 0.06, 0]} />
        <meshStandardMaterial color="#5A8C3B" flatShading transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

export const Flower3D = ({ pos, variant }: { pos: [number, number]; variant: number }) => {
  const colors = ["#E58F7B", "#F2C46C", "#C9A0E0", "#FFB6C1"];
  return (
    <group position={[pos[0], 0, pos[1]]}>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 0.08, 0, Math.sin(a) * 0.08]}>
            <mesh><cylinderGeometry args={[0.008, 0.008, 0.12, 4]} /><meshStandardMaterial color="#5A8C3B" /></mesh>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshStandardMaterial color={colors[(variant + i) % colors.length]} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshStandardMaterial color="#F2C46C" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Grass tuft
export const GrassTuft = ({ pos }: { pos: [number, number] }) => (
  <group position={[pos[0], 0.01, pos[1]]}>
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} position={[Math.cos(i * 1.5) * 0.04, 0.06, Math.sin(i * 1.5) * 0.04]} rotation={[0, i, 0.1]}>
        <coneGeometry args={[0.015, 0.12, 3]} />
        <meshStandardMaterial color="#5A9A4A" />
      </mesh>
    ))}
  </group>
);

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
