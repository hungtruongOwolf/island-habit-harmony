import { useContext, useRef, useMemo } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Sky, Cloud, Clouds, Html } from "@react-three/drei";
import * as THREE from "three";
import { useGame, GameCtx } from "../state";
import { Building3D } from "./Building3D";
import { Agent3D } from "./Agent3D";

const ISLAND_RADIUS = 3.6;
const WAYPOINTS: [number, number][] = [
  [-2.5, -0.5], [2.0, 1.5], [-0.8, -2.2], [0.0, 0.0], [2.2, -1.6],
  [-1.5, 1.8], [1.0, -2.5], [-2.0, 1.0], [2.5, -0.2], [0.5, 2.5],
];

// Empty build slots — clickable circles
const BUILD_SLOTS: [number, number][] = [
  [-1.5, -1.5], [1.6, 0.5], [-0.5, 1.5], [1.0, 2.2],
];

const Terrain = () => (
  <group>
    {/* Underwater base — large dark cylinder */}
    <mesh position={[0, -1.5, 0]} receiveShadow>
      <cylinderGeometry args={[ISLAND_RADIUS - 0.4, ISLAND_RADIUS - 1.2, 1.5, 32]} />
      <meshStandardMaterial color="#5A4A38" />
    </mesh>
    {/* Sand ring */}
    <mesh position={[0, -0.55, 0]} receiveShadow>
      <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS - 0.3, 0.5, 48]} />
      <meshStandardMaterial color="#EFD9A8" />
    </mesh>
    {/* Grass top */}
    <mesh position={[0, -0.25, 0]} receiveShadow>
      <cylinderGeometry args={[ISLAND_RADIUS - 0.3, ISLAND_RADIUS - 0.1, 0.15, 48]} />
      <meshStandardMaterial color="#7AB85A" />
    </mesh>
    {/* Grass detail bumps */}
    {Array.from({ length: 18 }).map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = (ISLAND_RADIUS - 0.5) * (0.4 + Math.random() * 0.6);
      return (
        <mesh key={i} position={[Math.cos(a) * r, -0.12, Math.sin(a) * r]}>
          <sphereGeometry args={[0.12 + Math.random() * 0.1, 6, 6]} />
          <meshStandardMaterial color="#6FA84A" />
        </mesh>
      );
    })}
    {/* Trees */}
    {[[2.7, 1.8], [-2.8, -1.5], [-2.5, 2.2], [2.5, -2.4], [0.0, -2.8]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 6]} />
          <meshStandardMaterial color="#6B4226" />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <coneGeometry args={[0.4, 0.7, 8]} />
          <meshStandardMaterial color="#3F7A3F" />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <coneGeometry args={[0.3, 0.5, 8]} />
          <meshStandardMaterial color="#4A8A4A" />
        </mesh>
      </group>
    ))}
    {/* Rocks */}
    {[[2.9, 0.0], [-2.9, 0.5], [0.5, 2.9]].map(([x, z], i) => (
      <mesh key={i} position={[x, -0.15, z]} rotation={[Math.random(), Math.random(), Math.random()]}>
        <dodecahedronGeometry args={[0.18 + i * 0.05, 0]} />
        <meshStandardMaterial color="#8A8B85" flatShading />
      </mesh>
    ))}
  </group>
);

const Water = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.55 + Math.sin(clock.elapsedTime * 0.8) * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[18, 64]} />
      <meshStandardMaterial color="#5BA3D0" transparent opacity={0.6} metalness={0.3} roughness={0.2} />
    </mesh>
  );
};

const BuildSlot = ({ pos }: { pos: [number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  const { setPendingSlot, setScreen } = useGame();

  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.15;
      ref.current.scale.set(s, 1, s);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setPendingSlot(pos);
    setScreen("build");
  };

  return (
    <group position={[pos[0], -0.15, pos[1]]} onClick={handleClick}
           onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
           onPointerOut={() => { document.body.style.cursor = "default"; }}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.38, 24]} />
        <meshBasicMaterial color="#7AC5A0" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 24]} />
        <meshBasicMaterial color="#7AC5A0" transparent opacity={0.25} />
      </mesh>
      <Html position={[0, 0.5, 0]} center distanceFactor={8}>
        <div className="text-xl pointer-events-none animate-bounce">🔨</div>
      </Html>
    </group>
  );
};

const Scene = () => {
  const { agents, buildings, selectedAgent, setSelectedAgent, setScreen } = useGame();

  return (
    <>
      <Sky sunPosition={[5, 3, 2]} turbidity={2} rayleigh={1} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={["#87CEEB", "#7AB85A", 0.4]} />

      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={20} bounds={[3, 1, 1]} volume={2} color="#ffffff" position={[-4, 4, -3]} opacity={0.7} />
        <Cloud segments={15} bounds={[2, 0.8, 1]} volume={1.5} color="#ffffff" position={[5, 5, 2]} opacity={0.6} />
      </Clouds>

      <Water />
      <Terrain />

      {buildings.map((b) => <Building3D key={b.id} building={b} />)}
      {BUILD_SLOTS.map((p, i) => <BuildSlot key={i} pos={p} />)}

      {agents.map((a) => (
        <Agent3D
          key={a.id}
          agent={a}
          waypoints={WAYPOINTS}
          isSelected={selectedAgent === a.id}
          onClick={() => { setSelectedAgent(a.id); setScreen("chat"); }}
        />
      ))}
    </>
  );
};

export const Island3D = () => {
  const game = useContext(GameCtx);
  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 6], fov: 45 }}
      gl={{ antialias: true }}
    >
      <GameCtx.Provider value={game}>
        <Scene />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={14}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </GameCtx.Provider>
    </Canvas>
  );
};
