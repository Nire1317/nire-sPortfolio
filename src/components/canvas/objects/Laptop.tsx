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

export const Laptop: React.FC<ObjectProps> = ({ position = [-2.5, 1.5, 0.5] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'laptop';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.8) * 0.02;
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
      rotation={[0, 0.4, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Base/Keyboard Part */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.9, 0.04, 0.6]} />
        <meshStandardMaterial color="#0f111a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Screen Lid (Opened at ~110 degrees) */}
      <group position={[0, 0.02, -0.28]} rotation={[-1.2, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.02]} />
          <meshStandardMaterial 
            color={hovered ? COLORS.three.secondary : new THREE.Color('#16213e')} 
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        {/* Laptop Screen Glow */}
        <mesh position={[0, 0.25, 0.011]}>
          <planeGeometry args={[0.84, 0.44]} />
          <meshBasicMaterial 
            color={hovered || isSelected ? COLORS.three.secondary : new THREE.Color('#10051a')}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 0.7, 0]} center>
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
export default Laptop;
