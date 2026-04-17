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

export const Agent3D = ({ agent, waypoints, onClick, isSelected }: Props) => {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const seed = useMemo(() => Math.random(), []);
  const targetIdx = useRef(Math.floor(seed * waypoints.length));
  const pos = useRef(new THREE.Vector3(agent.home[0], 0, agent.home[1]));
  const angle = useRef(seed * Math.PI * 2);
  const idleTimer = useRef(0);

  const speed = 0.4 + (agent.mood / 100) * 0.4;

  useFrame((_state, delta) => {
    if (!group.current) return;
    const target = waypoints[targetIdx.current];
    if (!target) return;
    const tv = new THREE.Vector3(target[0], 0, target[1]);
    const dir = tv.clone().sub(pos.current);
    const distance = dir.length();

    if (distance < 0.15) {
      idleTimer.current += delta;
      if (idleTimer.current > 1.5 + Math.random() * 2) {
        targetIdx.current = Math.floor(Math.random() * waypoints.length);
        idleTimer.current = 0;
      }
    } else {
      dir.normalize();
      const move = Math.min(distance, speed * delta);
      pos.current.add(dir.multiplyScalar(move));
      angle.current = Math.atan2(dir.x, dir.z);
    }
    group.current.position.copy(pos.current);
    group.current.rotation.y = angle.current;

    const walking = distance > 0.15;
    const t = walking ? Date.now() * 0.012 * speed : 0;
    const swing = walking ? Math.sin(t) * 0.6 : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.6;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.6;
    group.current.position.y = walking ? Math.abs(Math.sin(t * 2)) * 0.04 : 0;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); };

  const moodColor = agent.mood > 70 ? "#7AC5A0" : agent.mood > 50 ? "#F2C46C" : "#E58F7B";

  return (
    <group
      ref={group}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {(isSelected || hovered) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.36, 24]} />
          <meshBasicMaterial color={agent.isYou ? "#7AC5A0" : "#F2C46C"} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Pants */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.22, 8]} />
        <meshStandardMaterial color={agent.pants} />
      </mesh>
      {/* Shirt body */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.22, 4, 10]} />
        <meshStandardMaterial color={agent.shirt} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.04, 10]} />
        <meshStandardMaterial color="#3A2A1F" />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.05, 8]} />
        <meshStandardMaterial color={agent.skin} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 14]} />
        <meshStandardMaterial color={agent.skin} />
      </mesh>
      {/* Hair styles */}
      {agent.hairStyle === "short" && (
        <mesh position={[0, 0.86, -0.02]} castShadow>
          <sphereGeometry args={[0.165, 16, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={agent.hair} />
        </mesh>
      )}
      {agent.hairStyle === "long" && (
        <>
          <mesh position={[0, 0.86, -0.02]} castShadow>
            <sphereGeometry args={[0.17, 16, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={agent.hair} />
          </mesh>
          <mesh position={[0, 0.65, -0.13]}>
            <boxGeometry args={[0.28, 0.3, 0.06]} />
            <meshStandardMaterial color={agent.hair} />
          </mesh>
        </>
      )}
      {agent.hairStyle === "bun" && (
        <>
          <mesh position={[0, 0.84, -0.02]} castShadow>
            <sphereGeometry args={[0.165, 16, 14, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color={agent.hair} />
          </mesh>
          <mesh position={[0, 0.98, -0.05]} castShadow>
            <sphereGeometry args={[0.08, 12, 10]} />
            <meshStandardMaterial color={agent.hair} />
          </mesh>
        </>
      )}
      {agent.hairStyle === "cap" && (
        <>
          <mesh position={[0, 0.92, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.18, 0.08, 12]} />
            <meshStandardMaterial color={agent.shirt} />
          </mesh>
          <mesh position={[0, 0.92, 0.15]}>
            <boxGeometry args={[0.22, 0.02, 0.12]} />
            <meshStandardMaterial color={agent.shirt} />
          </mesh>
        </>
      )}
      {/* Eyes */}
      <mesh position={[0.06, 0.78, 0.13]}><sphereGeometry args={[0.022, 8, 8]} /><meshBasicMaterial color="#1A1410" /></mesh>
      <mesh position={[-0.06, 0.78, 0.13]}><sphereGeometry args={[0.022, 8, 8]} /><meshBasicMaterial color="#1A1410" /></mesh>
      {/* Cheeks (subtle blush) */}
      <mesh position={[0.1, 0.74, 0.12]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#F4A8A8" transparent opacity={0.6} /></mesh>
      <mesh position={[-0.1, 0.74, 0.12]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#F4A8A8" transparent opacity={0.6} /></mesh>
      {/* Mouth */}
      <mesh position={[0, 0.72, 0.14]}><boxGeometry args={[0.04, 0.012, 0.005]} /><meshBasicMaterial color="#3A2820" /></mesh>

      {/* Arms (with sleeves matching shirt) */}
      <mesh ref={leftArm} position={[0.2, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.2, 4, 6]} />
        <meshStandardMaterial color={agent.shirt} />
      </mesh>
      <mesh ref={rightArm} position={[-0.2, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.2, 4, 6]} />
        <meshStandardMaterial color={agent.shirt} />
      </mesh>
      {/* Hands */}
      <mesh position={[0.2, 0.32, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color={agent.skin} /></mesh>
      <mesh position={[-0.2, 0.32, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color={agent.skin} /></mesh>

      {/* Legs */}
      <mesh ref={leftLeg} position={[0.07, 0.08, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.14, 4, 6]} />
        <meshStandardMaterial color={agent.pants} />
      </mesh>
      <mesh ref={rightLeg} position={[-0.07, 0.08, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.14, 4, 6]} />
        <meshStandardMaterial color={agent.pants} />
      </mesh>
      {/* Shoes */}
      <mesh position={[0.07, -0.02, 0.04]}><boxGeometry args={[0.1, 0.05, 0.16]} /><meshStandardMaterial color="#2A1A12" /></mesh>
      <mesh position={[-0.07, -0.02, 0.04]}><boxGeometry args={[0.1, 0.05, 0.16]} /><meshStandardMaterial color="#2A1A12" /></mesh>

      {/* Mood orb */}
      <mesh position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={moodColor} emissive={moodColor} emissiveIntensity={0.5} />
      </mesh>

      <Html position={[0, 1.4, 0]} center distanceFactor={6} zIndexRange={[10, 0]}>
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
