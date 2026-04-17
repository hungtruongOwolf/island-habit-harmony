import { useMemo } from "react";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import type { District } from "../state";
import { useGame } from "../state";

/* ── Single district landmass with layered geology ──── */
const DistrictLand = ({ d }: { d: District }) => {
  const hills = useMemo(() => {
    const arr: { x: number; z: number; r: number; h: number; color: string }[] = [];
    const count = d.id === "hill" ? 7 : d.id === "forest" ? 4 : d.id === "beach" ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.8;
      const rr = (d.radius - 0.9) * (0.25 + Math.random() * 0.5);
      arr.push({
        x: Math.cos(a) * rr,
        z: Math.sin(a) * rr,
        r: 0.35 + Math.random() * 0.55,
        h: d.id === "hill" ? 0.35 + Math.random() * 0.55 : 0.12 + Math.random() * 0.2,
        color:
          d.id === "hill"
            ? `hsl(${80 + Math.random() * 20}, ${25 + Math.random() * 15}%, ${48 + Math.random() * 12}%)`
            : d.id === "forest"
            ? `hsl(${110 + Math.random() * 20}, ${35 + Math.random() * 15}%, ${32 + Math.random() * 12}%)`
            : d.color,
      });
    }
    return arr;
  }, [d]);

  const grassPatches = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => {
        const a = (i / 30) * Math.PI * 2 + Math.random() * 0.6;
        const r = (d.radius - 0.5) * (0.2 + Math.random() * 0.7);
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          s: 0.18 + Math.random() * 0.22,
          c:
            d.id === "forest"
              ? `hsl(${115 + Math.random() * 15}, ${40 + Math.random() * 15}%, ${28 + Math.random() * 10}%)`
              : d.id === "hill"
              ? `hsl(${85 + Math.random() * 20}, ${25 + Math.random() * 15}%, ${45 + Math.random() * 12}%)`
              : d.id === "beach"
              ? `hsl(${40 + Math.random() * 15}, ${55 + Math.random() * 20}%, ${65 + Math.random() * 10}%)`
              : `hsl(${120 + Math.random() * 20}, ${38 + Math.random() * 18}%, ${42 + Math.random() * 14}%)`,
        };
      }),
    [d],
  );

  const sandColor = d.id === "beach" ? "#F4DCAC" : "#D8C8A0";
  const cliffColor = d.id === "hill" ? "#6A6058" : "#7A6848";
  const grassColor = d.color;

  return (
    <group position={[d.center[0], 0, d.center[1]]}>
      {/* Deep underwater foundation */}
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius - 0.6, d.radius - 1.5, 2, 32]} />
        <meshStandardMaterial color={cliffColor} roughness={0.9} />
      </mesh>
      {/* Cliff/rock layer */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius - 0.15, d.radius - 0.5, 0.6, 48]} />
        <meshStandardMaterial color={cliffColor} roughness={0.85} flatShading />
      </mesh>
      {/* Sand ring */}
      <mesh position={[0, -0.38, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius + 0.05, d.radius - 0.15, 0.2, 48]} />
        <meshStandardMaterial color={sandColor} roughness={0.92} />
      </mesh>
      {/* Main grass surface */}
      <mesh position={[0, -0.23, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[d.radius - 0.1, d.radius + 0.02, 0.14, 48]} />
        <meshStandardMaterial color={grassColor} roughness={0.82} />
      </mesh>
      {/* Top grass — slightly smaller for edge bevel */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[d.radius - 0.2, d.radius - 0.12, 0.04, 48]} />
        <meshStandardMaterial color={grassColor} roughness={0.78} />
      </mesh>

      {/* Grass color variation patches */}
      {grassPatches.map((p, i) => (
        <mesh key={i} position={[p.x, -0.12, p.z]} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
          <circleGeometry args={[p.s, 8]} />
          <meshStandardMaterial color={p.c} transparent opacity={0.7} roughness={0.85} depthWrite={false} />
        </mesh>
      ))}

      {/* Rolling hills */}
      {hills.map((h, i) => (
        <mesh key={i} position={[h.x, -0.14 + h.h * 0.4, h.z]} castShadow receiveShadow>
          <sphereGeometry args={[h.r, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={h.color} roughness={0.82} flatShading />
        </mesh>
      ))}

      {/* Shore foam ring */}
      <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[d.radius - 0.02, d.radius + 0.3, 64]} />
        <meshStandardMaterial color="#E8F4FF" transparent opacity={0.55} roughness={0.3} depthWrite={false} />
      </mesh>
      {/* Inner foam */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[d.radius - 0.05, d.radius + 0.08, 64]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.65} roughness={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
};

/* ── Bridge between two districts ────────────────────── */
const Bridge = ({ from, to }: { from: [number, number]; to: [number, number] }) => {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const mx = (from[0] + to[0]) / 2;
  const mz = (from[1] + to[1]) / 2;

  const plankCount = Math.floor(length * 2.5);

  return (
    <group position={[mx, -0.14, mz]} rotation={[0, -angle, 0]}>
      {/* Main deck */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[length, 0.05, 0.55]} />
        <meshStandardMaterial color="#8B6B4A" roughness={0.85} />
      </mesh>
      {/* Plank seams */}
      {Array.from({ length: plankCount }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + 0.2 + i * (length / plankCount), 0.03, 0]}>
          <boxGeometry args={[0.015, 0.005, 0.55]} />
          <meshStandardMaterial color="#5A3820" roughness={0.9} />
        </mesh>
      ))}
      {/* Side railings */}
      {[0.25, -0.25].map((zz) => (
        <group key={zz}>
          <mesh position={[0, 0.12, zz]}>
            <boxGeometry args={[length, 0.04, 0.04]} />
            <meshStandardMaterial color="#6B4830" roughness={0.85} />
          </mesh>
          {/* Railing posts */}
          {Array.from({ length: Math.floor(length * 1.5) }).map((_, i) => (
            <mesh key={i} position={[-length / 2 + 0.3 + i * (length / Math.floor(length * 1.5)), 0.07, zz]}>
              <cylinderGeometry args={[0.02, 0.02, 0.14, 6]} />
              <meshStandardMaterial color="#5A3820" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Support posts underneath */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-length / 3 + i * (length / 3), -0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 6]} />
          <meshStandardMaterial color="#5A3820" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
};

/* ── Locked district ghost preview ───────────────────── */
const LockedGhost = ({ d, onClick }: { d: District; onClick: () => void }) => (
  <group position={[d.center[0], 0, d.center[1]]}>
    {/* Transparent outline */}
    <mesh
      position={[0, -0.4, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <cylinderGeometry args={[d.radius, d.radius - 0.3, 0.12, 32]} />
      <meshStandardMaterial color={d.color} transparent opacity={0.15} />
    </mesh>
    {/* Wireframe ring */}
    <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[d.radius - 0.15, d.radius + 0.1, 48]} />
      <meshBasicMaterial color={d.color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
    {/* Mystery fog */}
    <mesh position={[0, -0.1, 0]}>
      <sphereGeometry args={[d.radius * 0.7, 16, 16]} />
      <meshStandardMaterial color="#D0D8E0" transparent opacity={0.12} />
    </mesh>

    <Html position={[0, 0.4, 0]} center distanceFactor={9}>
      <button
        onClick={onClick}
        className="hud-panel-dark px-3 py-2 cursor-pointer hover:scale-105 transition pointer-events-auto whitespace-nowrap text-center"
      >
        <div className="text-2xl mb-0.5">{d.emoji}</div>
        <div className="display-font text-sm font-bold">{d.name}</div>
        <div className="text-[10px] opacity-70 font-bold">
          🔒 Lv.{d.unlockLevel} · {d.unlockCost}🪙
        </div>
      </button>
    </Html>
  </group>
);

/* ── Districts renderer ──────────────────────────────── */
export const DistrictsRenderer = () => {
  const { districts, setScreen } = useGame();
  const main = districts.find((d) => d.id === "main")!;

  return (
    <>
      {districts.map((d) =>
        d.unlocked ? (
          <DistrictLand key={d.id} d={d} />
        ) : (
          <LockedGhost key={d.id} d={d} onClick={() => setScreen("expand")} />
        ),
      )}
      {/* Bridges */}
      {districts
        .filter((d) => d.unlocked && d.id !== "main")
        .map((d) => {
          const dx = d.center[0] - main.center[0];
          const dz = d.center[1] - main.center[1];
          const len = Math.hypot(dx, dz);
          const ux = dx / len;
          const uz = dz / len;
          const from: [number, number] = [
            main.center[0] + ux * (main.radius - 0.2),
            main.center[1] + uz * (main.radius - 0.2),
          ];
          const to: [number, number] = [
            d.center[0] - ux * (d.radius - 0.2),
            d.center[1] - uz * (d.radius - 0.2),
          ];
          return <Bridge key={d.id} from={from} to={to} />;
        })}
    </>
  );
};
