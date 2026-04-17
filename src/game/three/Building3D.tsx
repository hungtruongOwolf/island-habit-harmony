import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Building } from "../state";

interface Props { building: Building; }

export const Building3D = ({ building }: Props) => {
  const { type, pos, rot = 0 } = building;
  const group = useRef<THREE.Group>(null);

  // Bonfire flame flicker
  const flameRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (type === "bonfire" && flameRef.current) {
      const s = 0.9 + Math.sin(clock.elapsedTime * 8) * 0.15;
      flameRef.current.scale.set(s, s * 1.3, s);
    }
  });

  return (
    <group ref={group} position={[pos[0], 0, pos[1]]} rotation={[0, rot, 0]}>
      {type === "house" && <House />}
      {type === "garden" && <Garden />}
      {type === "library" && <Library />}
      {type === "gym" && <Gym />}
      {type === "fountain" && <Fountain />}
      {type === "bonfire" && <Bonfire flameRef={flameRef} />}
      {type === "lighthouse" && <Lighthouse />}
    </group>
  );
};

const House = () => (
  <group>
    <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.7, 0.8]} />
      <meshStandardMaterial color="#F4E1C1" />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.7, 0.5, 4]} />
      <meshStandardMaterial color="#D97757" />
    </mesh>
    <mesh position={[0, 0.35, 0.41]}>
      <boxGeometry args={[0.2, 0.35, 0.02]} />
      <meshStandardMaterial color="#6B4226" />
    </mesh>
  </group>
);

const Garden = () => (
  <group>
    <mesh position={[0, 0.05, 0]} receiveShadow>
      <cylinderGeometry args={[0.4, 0.45, 0.1, 8]} />
      <meshStandardMaterial color="#6B4226" />
    </mesh>
    {[[-0.18, 0.18], [0.15, -0.1], [0.05, 0.2], [-0.1, -0.15]].map((p, i) => (
      <group key={i} position={[p[0], 0.18, p[1]]}>
        <mesh><cylinderGeometry args={[0.02, 0.02, 0.18, 6]} /><meshStandardMaterial color="#5A8C3B" /></mesh>
        <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color={["#E58F7B", "#F2C46C", "#C9A0E0", "#FFB6C1"][i % 4]} /></mesh>
      </group>
    ))}
  </group>
);

const Library = () => (
  <group>
    <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[1.1, 0.9, 0.8]} /><meshStandardMaterial color="#C9A0E0" /></mesh>
    <mesh position={[0, 1.0, 0]} castShadow><boxGeometry args={[1.2, 0.15, 0.9]} /><meshStandardMaterial color="#7B5BA0" /></mesh>
    <mesh position={[-0.35, 0.45, 0.41]}><boxGeometry args={[0.18, 0.4, 0.02]} /><meshStandardMaterial color="#F4E1C1" /></mesh>
    <mesh position={[0.35, 0.45, 0.41]}><boxGeometry args={[0.18, 0.4, 0.02]} /><meshStandardMaterial color="#F4E1C1" /></mesh>
  </group>
);

const Gym = () => (
  <group>
    <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.9, 0.8, 0.9]} /><meshStandardMaterial color="#6FA8DC" /></mesh>
    <mesh position={[0, 0.85, 0]} castShadow><boxGeometry args={[1.0, 0.1, 1.0]} /><meshStandardMaterial color="#3F6FA0" /></mesh>
    {/* dumbbell */}
    <group position={[0.55, 0.1, 0.4]}>
      <mesh><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0.18, 0, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.18, 6]} /><meshStandardMaterial color="#555" /></mesh>
    </group>
  </group>
);

const Fountain = () => (
  <group>
    <mesh position={[0, 0.1, 0]} receiveShadow><cylinderGeometry args={[0.55, 0.6, 0.2, 16]} /><meshStandardMaterial color="#E0D5C0" /></mesh>
    <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.45, 0.5, 0.05, 16]} /><meshStandardMaterial color="#5BA3D0" /></mesh>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.08, 0.1, 0.3, 8]} /><meshStandardMaterial color="#E0D5C0" /></mesh>
    <mesh position={[0, 0.55, 0]}><sphereGeometry args={[0.12, 12, 12]} /><meshStandardMaterial color="#7BC5E5" transparent opacity={0.8} /></mesh>
  </group>
);

const Bonfire = ({ flameRef }: { flameRef: React.RefObject<THREE.Mesh> }) => (
  <group>
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.15, 0.08, Math.sin(i * Math.PI / 2) * 0.15]} rotation={[Math.PI / 2.5, 0, i]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
    ))}
    <mesh ref={flameRef} position={[0, 0.25, 0]}>
      <coneGeometry args={[0.15, 0.4, 8]} />
      <meshStandardMaterial color="#F2A04C" emissive="#E55A2B" emissiveIntensity={0.6} />
    </mesh>
    <pointLight position={[0, 0.35, 0]} color="#FF8030" intensity={0.6} distance={2} />
  </group>
);

const Lighthouse = () => (
  <group>
    <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.25, 0.35, 1.2, 12]} /><meshStandardMaterial color="#F4F0E8" /></mesh>
    <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.27, 0.27, 0.1, 12]} /><meshStandardMaterial color="#D9433A" /></mesh>
    <mesh position={[0, 1.3, 0]}><cylinderGeometry args={[0.2, 0.2, 0.2, 12]} /><meshStandardMaterial color="#F2C46C" emissive="#F2C46C" emissiveIntensity={0.5} /></mesh>
    <mesh position={[0, 1.45, 0]}><coneGeometry args={[0.25, 0.3, 12]} /><meshStandardMaterial color="#3A4A6B" /></mesh>
  </group>
);
