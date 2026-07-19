import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '../../../hooks/useSceneStore';
import { OBJECT_LABELS, COLORS } from '../../../utils/constants';

interface ObjectProps {
  position?: [number, number, number];
}

export const CommunicationTerminal: React.FC<ObjectProps> = ({ position = [4.0, 1.45, 0.8] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const indicatorRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'communication-terminal';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.7) * 0.02;
    }

    // Blinking transmitter light
    if (indicatorRef.current) {
      const activePulse = Math.sin(time * 6.0) > 0.0;
      indicatorRef.current.color.set(activePulse ? '#ff3d94' : '#20000a');
    }
  });

  const handlePointerOver = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredObject(objId);
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoveredObject(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveObject(isSelected ? null : objId);
  };

  return (
    <group 
      ref={groupRef} 
      position={position}
      rotation={[0, -0.5, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Device Main Case Box */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.25, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.secondary : new THREE.Color('#100b26')} 
          metalness={0.9} 
          roughness={0.3} 
        />
      </mesh>

      {/* Screen Interface on device */}
      <mesh position={[-0.1, 0.02, 0.201]}>
        <planeGeometry args={[0.2, 0.12]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.1} />
      </mesh>

      {/* Vertical Antenna Cylinder */}
      <mesh position={[0.18, 0.25, -0.1]} castShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.4, 8]} />
        <meshStandardMaterial color="#0f111a" metalness={0.9} />
      </mesh>

      {/* Antenna Tip Glow Sphere */}
      <mesh position={[0.18, 0.46, -0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial 
          ref={indicatorRef} 
          color="#ff3d94" 
          toneMapped={false}
        />
      </mesh>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 0.6, 0]} center>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-accent-secondary)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--color-accent-secondary)',
            boxShadow: 'var(--glow-secondary)',
            padding: '4px 8px',
            whiteSpace: 'nowrap',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}>
            {OBJECT_LABELS[objId].icon} {OBJECT_LABELS[objId].label}
          </div>
        </Html>
      )}
    </group>
  );
};
export default CommunicationTerminal;
