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

export const EntertainmentShelf: React.FC<ObjectProps> = ({ position = [6.5, 2.0, 1.0] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'entertainment-shelf';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.3) * 0.02;
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
      rotation={[0, -Math.PI / 2, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Shelf Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 3.5, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.secondary : new THREE.Color('#100b26')} 
          roughness={0.6}
        />
      </mesh>

      {/* Internal shelves */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.05, 0.38]} />
        <meshStandardMaterial color="#0f111a" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.05, 0.38]} />
        <meshStandardMaterial color="#0f111a" />
      </mesh>

      {/* Retro Arcade game console shape on shelf */}
      <group position={[0, 0.5, 0.05]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.26]} />
          <meshStandardMaterial color="#210b4b" metalness={0.8} />
        </mesh>
        
        {/* Arcade Console Screen glowing */}
        <mesh position={[0, 0.26, 0.131]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[0.4, 0.2]} />
          <meshBasicMaterial 
            color={hovered || isSelected ? COLORS.three.secondary : new THREE.Color('#10051a')}
            toneMapped={false}
          />
        </mesh>

        {/* Small controls representing buttons */}
        <mesh position={[-0.15, 0.05, 0.135]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshBasicMaterial color="#ff0000" toneMapped={false} />
        </mesh>
        <mesh position={[0.15, 0.05, 0.135]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshBasicMaterial color="#00ff00" toneMapped={false} />
        </mesh>
      </group>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 2.0, 0]} center>
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
export default EntertainmentShelf;
