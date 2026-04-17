import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { District } from "../state";
import { useGame } from "../state";

// Build a single district landmass (multi-tier: underwater base, sand, grass, hills)
const DistrictLand = ({ d }: { d: District }) => {
  // Random hill seeds for variety per district
  const hills = useMemo(() => {
    const arr: { x: number; z: number; r: number; h: number; color: string }[] = [];
    const count = d.id === "hill" ? 6 : d.id === "forest" ? 3 : d.id === "beach" ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random();
      const r = (d.radius - 0.8) * (0.3 + Math.random() * 0.5);
      arr.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        r: 0.4 + Math.random() * 0.5,
        h: d.id === "hill" ? 0.4 + Math.random() * 0.6 : 0.15 + Math.random() * 0.2,
        color: d.id === "hill" ? "#8A8B7E" : d.id === "forest" ? "#5A8A4A" : d.color,
      });
    }
    return arr;
  }, [d]);

  // Beach color customization
  const sandColor = d.id === "beach" ? "#F4DCAC" : "#EFD9A8";
  const grassColor = d.color;

  return (
    <group position={[d.center[0], 0, d.center[1]]}>
      {/* Underwater base */}
      <mesh position={[0, -1.5, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius - 0.4, d.radius - 1.2, 1.5, 32]} />
        <meshStandardMaterial color="#5A4A38" />
      </mesh>
      {/* Sand ring */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius, d.radius - 0.3, 0.5, 48]} />
        <meshStandardMaterial color={sandColor} />
      </mesh>
      {/* Grass top */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius - 0.3, d.radius - 0.1, 0.15, 48]} />
        <meshStandardMaterial color={grassColor} />
      </mesh>
      {/* Grass color patches */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2 + Math.random();
        const r = (d.radius - 0.5) * (0.3 + Math.random() * 0.6);
        return (
          <mesh key={i} position={[Math.cos(a) * r, -0.13, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.25 + Math.random() * 0.15, 8]} />
            <meshStandardMaterial color={d.id === "forest" ? "#4A7A3F" : d.id === "hill" ? "#7A8A6A" : "#6FAB4A"} transparent opacity={0.8} />
          </mesh>
        );
      })}
      {/* Hills / cliffs */}
      {hills.map((h, i) => (
        <mesh key={i} position={[h.x, -0.18 + h.h / 2, h.z]} castShadow receiveShadow>
          <cylinderGeometry args={[h.r * 0.6, h.r, h.h, 8]} />
          <meshStandardMaterial color={h.color} flatShading />
        </mesh>
      ))}
      {/* Foam ring around the island */}
      <mesh position={[0, -0.69, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[d.radius - 0.05, d.radius + 0.25, 48]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Bridge between two districts
const Bridge = ({ from, to }: { from: [number, number]; to: [number, number] }) => {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const mx = (from[0] + to[0]) / 2;
  const mz = (from[1] + to[1]) / 2;
  return (
    <group position={[mx, -0.15, mz]} rotation={[0, -angle, 0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[length, 0.06, 0.5]} />
        <meshStandardMaterial color="#8B5E3C" />
      </mesh>
      {/* Planks */}
      {Array.from({ length: Math.floor(length * 2) }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + 0.3 + i * 0.5, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.005, 0.5]} />
          <meshStandardMaterial color="#5A3820" />
        </mesh>
      ))}
      {/* Side rails */}
      {[0.22, -0.22].map((zz) => (
        <mesh key={zz} position={[0, 0.08, zz]}>
          <boxGeometry args={[length, 0.03, 0.03]} />
          <meshStandardMaterial color="#5A3820" />
        </mesh>
      ))}
    </group>
  );
};

// Empty district preview when locked (ghost)
const LockedGhost = ({ d, onClick }: { d: District; onClick: () => void }) => (
  <group position={[d.center[0], 0, d.center[1]]}>
    <mesh position={[0, -0.5, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}>
      <cylinderGeometry args={[d.radius, d.radius - 0.4, 0.1, 32]} />
      <meshStandardMaterial color={d.color} transparent opacity={0.25} wireframe />
    </mesh>
    <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[d.radius - 0.1, d.radius, 48]} />
      <meshBasicMaterial color={d.color} transparent opacity={0.4} />
    </mesh>
    <Html position={[0, 0.4, 0]} center distanceFactor={9}>
      <button
        onClick={onClick}
        className="hud-panel-dark px-3 py-2 cursor-pointer hover:scale-105 transition pointer-events-auto whitespace-nowrap text-center"
      >
        <div className="text-2xl mb-0.5">{d.emoji}</div>
        <div className="display-font text-sm font-bold">{d.name}</div>
        <div className="text-[10px] opacity-70 font-bold">🔒 Lv.{d.unlockLevel} · {d.unlockCost}🪙</div>
      </button>
    </Html>
  </group>
);

export const DistrictsRenderer = () => {
  const { districts, setScreen } = useGame();
  const main = districts.find((d) => d.id === "main")!;

  return (
    <>
      {districts.map((d) =>
        d.unlocked ? <DistrictLand key={d.id} d={d} /> : <LockedGhost key={d.id} d={d} onClick={() => setScreen("expand")} />
      )}
      {/* Bridges from main to each unlocked non-main district */}
      {districts.filter((d) => d.unlocked && d.id !== "main").map((d) => {
        // bridge endpoints — edge of main toward d, and edge of d toward main
        const dx = d.center[0] - main.center[0];
        const dz = d.center[1] - main.center[1];
        const len = Math.hypot(dx, dz);
        const ux = dx / len;
        const uz = dz / len;
        const from: [number, number] = [main.center[0] + ux * (main.radius - 0.2), main.center[1] + uz * (main.radius - 0.2)];
        const to: [number, number] = [d.center[0] - ux * (d.radius - 0.2), d.center[1] - uz * (d.radius - 0.2)];
        return <Bridge key={d.id} from={from} to={to} />;
      })}
    </>
  );
};
