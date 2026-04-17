import { useRef, useMemo, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Agent } from "../state";

interface Props {
  agent: Agent;
  waypoints: [number, number][];
  onClick: () => void;
  isSelected: boolean;
}

const ISLAND_RADIUS = 3.2;

export const Agent3D = ({ agent, waypoints, onClick, isSelected }: Props) => {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pick a random starting waypoint per agent
  const seed = useMemo(() => Math.random(), []);
  const targetIdx = useRef(Math.floor(seed * waypoints.length));
  const pos = useRef(new THREE.Vector3(agent.home[0], 0, agent.home[1]));
  const angle = useRef(seed * Math.PI * 2);
  const idleTimer = useRef(0);

  const speed = 0.4 + (agent.mood / 100) * 0.4; // motivated agents walk faster

  useFrame((_state, delta) => {
    if (!group.current) return;

    const target = waypoints[targetIdx.current];
    if (!target) return;
    const tv = new THREE.Vector3(target[0], 0, target[1]);
    const dir = tv.clone().sub(pos.current);
    const dist = dir.length();

    if (dist < 0.15) {
      idleTimer.current += delta;
      if (idleTimer.current > 1.5 + Math.random() * 2) {
        targetIdx.current = Math.floor(Math.random() * waypoints.length);
        idleTimer.current = 0;
      }
    } else {
      dir.normalize();
      const move = Math.min(dist, speed * delta);
      pos.current.add(dir.multiplyScalar(move));
      angle.current = Math.atan2(dir.x, dir.z);
    }

    group.current.position.copy(pos.current);
    group.current.rotation.y = angle.current;

    // Walking animation
    const walking = dist > 0.15;
    const t = walking ? Date.now() * 0.012 * speed : 0;
    const swing = walking ? Math.sin(t) * 0.6 : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.6;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.6;
    // bob
    group.current.position.y = walking ? Math.abs(Math.sin(t * 2)) * 0.04 : 0;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  const moodColor = agent.mood > 70 ? "#7AC5A0" : agent.mood > 50 ? "#F2C46C" : "#E58F7B";

  return (
    <group
      ref={group}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Selection ring */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.36, 24]} />
          <meshBasicMaterial color={agent.isYou ? "#7AC5A0" : "#F2C46C"} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Body (capsule) */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.25, 4, 8]} />
        <meshStandardMaterial color={agent.color} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#F4D7B5" />
      </mesh>

      {/* Hat */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <coneGeometry args={[0.16, 0.18, 8]} />
        <meshStandardMaterial color={agent.hat} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.05, 0.79, 0.12]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      <mesh position={[-0.05, 0.79, 0.12]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshBasicMaterial color="#222" />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArm} position={[0.18, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.04, 0.18, 4, 6]} />
        <meshStandardMaterial color={agent.color} />
      </mesh>
      <mesh ref={rightArm} position={[-0.18, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.04, 0.18, 4, 6]} />
        <meshStandardMaterial color={agent.color} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLeg} position={[0.07, 0.16, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.16, 4, 6]} />
        <meshStandardMaterial color="#3A4A6B" />
      </mesh>
      <mesh ref={rightLeg} position={[-0.07, 0.16, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.16, 4, 6]} />
        <meshStandardMaterial color="#3A4A6B" />
      </mesh>

      {/* Mood indicator orb */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={moodColor} emissive={moodColor} emissiveIntensity={0.4} />
      </mesh>

      {/* Name billboard */}
      <Html position={[0, 1.35, 0]} center distanceFactor={6} zIndexRange={[10, 0]}>
        <div className="pointer-events-none flex flex-col items-center gap-0.5 select-none">
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-black border-2 border-white shadow-lg ${
            agent.isYou ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
          }`}>
            {agent.name}{agent.isYou && " (you)"}
          </div>
          <div className="h-1 w-12 rounded-full bg-black/30 overflow-hidden">
            <div className="h-full" style={{ width: `${agent.mood}%`, background: moodColor }} />
          </div>
        </div>
      </Html>
    </group>
  );
};
