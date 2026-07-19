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

export const Workbench: React.FC<ObjectProps> = ({ position = [5.5, 1.4, -1.0] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'workbench';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.4) * 0.02;
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
      rotation={[0, -Math.PI / 3, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Workbench Table Board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.1, 1.0]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.primary : new THREE.Color('#100b26')} 
          roughness={0.7}
        />
      </mesh>

      {/* Gears & Tech Tooling Elements on Workbench */}
      <group position={[0, 0.05, 0]}>
        {/* Main core unit (cube) */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#0f111a" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Core Unit Neon indicator lights */}
        <mesh position={[0, 0.2, 0.201]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial 
            color={hovered || isSelected ? COLORS.three.primary : new THREE.Color('#0a001a')} 
            toneMapped={false} 
          />
        </mesh>

        {/* Small cylinders representing tools or components */}
        <mesh position={[0.5, 0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 8]} />
          <meshStandardMaterial color="#210b4b" metalness={0.7} />
        </mesh>
        <mesh position={[-0.5, 0.08, 0.2]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.3]} />
          <meshStandardMaterial color="#2a2a3e" />
        </mesh>
      </group>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 0.8, 0]} center>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-accent-primary)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--color-accent-primary)',
            boxShadow: 'var(--glow-primary)',
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
export default Workbench;
