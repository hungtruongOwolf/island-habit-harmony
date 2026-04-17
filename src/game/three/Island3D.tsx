import { useContext, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky, Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";
import { useGame, GameCtx } from "../state";
import { Building3D } from "./Building3D";
import { Agent3D } from "./Agent3D";
import { SceneryRenderer, GrassTuft } from "./Scenery3D";
import { DistrictsRenderer } from "./Districts3D";
import { PlacementGhost } from "./PlacementGhost";

const Water = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.6 + Math.sin(clock.elapsedTime * 0.8) * 0.05;
    }
  });
  return (
    <>
      <mesh ref={ref} position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="#4F95C4" transparent opacity={0.65} metalness={0.4} roughness={0.15} />
      </mesh>
      {/* Deeper water below */}
      <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="#2D5878" />
      </mesh>
    </>
  );
};

// Random grass tufts on the main island
const GrassDecor = () => {
  const tufts = Array.from({ length: 30 }).map((_, i) => {
    const a = (i / 30) * Math.PI * 2 + Math.random();
    const r = Math.random() * 2.8;
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  });
  return <>{tufts.map((p, i) => <GrassTuft key={i} pos={p} />)}</>;
};

// Build slot hint ring on agent waypoints — purely cosmetic
const WAYPOINTS: [number, number][] = [
  [-2.0, -0.5], [1.8, 1.4], [-0.7, -2.0], [0, 0], [2.2, -1.7],
  [-1.5, 1.8], [1.0, -2.5], [-2.5, 1.0], [2.5, -0.2], [0.5, 2.5],
];

const Scene = () => {
  const { agents, buildings, scenery, selectedAgent, setSelectedAgent, setScreen, placingType } = useGame();

  return (
    <>
      <Sky sunPosition={[8, 4, 3]} turbidity={2} rayleigh={1} mieCoefficient={0.005} mieDirectionalG={0.85} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <hemisphereLight args={["#9DD4F0", "#7AB85A", 0.45]} />

      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={20} bounds={[3, 1, 1]} volume={2} color="#ffffff" position={[-5, 5, -3]} opacity={0.65} />
        <Cloud segments={15} bounds={[2, 0.8, 1]} volume={1.5} color="#ffffff" position={[6, 6, 2]} opacity={0.55} />
        <Cloud segments={18} bounds={[2.5, 0.9, 1]} volume={1.8} color="#ffffff" position={[0, 5.5, -6]} opacity={0.6} />
      </Clouds>

      <Water />
      <DistrictsRenderer />
      <GrassDecor />
      <SceneryRenderer scenery={scenery} />

      {buildings.map((b) => <Building3D key={b.id} building={b} />)}

      {agents.map((a) => (
        <Agent3D
          key={a.id}
          agent={a}
          waypoints={WAYPOINTS}
          isSelected={selectedAgent === a.id}
          onClick={() => {
            if (placingType) return; // don't open chat while placing
            setSelectedAgent(a.id);
            setScreen("chat");
          }}
        />
      ))}

      {placingType && <PlacementGhost />}
    </>
  );
};

export const Island3D = () => {
  const game = useContext(GameCtx);
  return (
    <Canvas
      shadows
      camera={{ position: [8, 6, 8], fov: 45 }}
      gl={{ antialias: true }}
    >
      <GameCtx.Provider value={game}>
        <Scene />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </GameCtx.Provider>
    </Canvas>
  );
};
