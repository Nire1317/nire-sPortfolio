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

export const Bookshelf: React.FC<ObjectProps> = ({ position = [-6.5, 2.0, -1.5] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'bookshelf';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.02;
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
      rotation={[0, Math.PI / 2, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Outer frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 4.0, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.tertiary : new THREE.Color('#100b26')} 
          roughness={0.6}
        />
      </mesh>

      {/* Shelf boards */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.05, 0.38]} />
        <meshStandardMaterial color="#0f111a" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.05, 0.38]} />
        <meshStandardMaterial color="#0f111a" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.05, 0.38]} />
        <meshStandardMaterial color="#0f111a" />
      </mesh>

      {/* Books on Shelves (boxes of varying heights/colors) */}
      <group position={[0, 0, 0.05]}>
        {/* Shelf 1 */}
        <mesh position={[-0.8, -0.5, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.25]} />
          <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[-0.6, -0.45, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.15, 0.45, 0.25]} />
          <meshStandardMaterial color="#FF3D94" emissive="#FF3D94" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[-0.4, -0.52, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.25]} />
          <meshStandardMaterial color="#00B9FB" />
        </mesh>

        {/* Shelf 2 */}
        <mesh position={[0.2, 0.7, 0]}>
          <boxGeometry args={[0.15, 0.55, 0.25]} />
          <meshStandardMaterial color={COLORS.three.tertiary} emissive={COLORS.three.tertiary} emissiveIntensity={0.4} toneMapped={false} />
        </mesh>
        <mesh position={[0.4, 0.65, 0]}>
          <boxGeometry args={[0.18, 0.48, 0.25]} />
          <meshStandardMaterial color="#210B4B" />
        </mesh>

        {/* Shelf 3 */}
        <mesh position={[-0.3, 1.7, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.15, 0.5, 0.25]} />
          <meshStandardMaterial color="#00B9FB" emissive="#00B9FB" emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
      </group>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 2.3, 0]} center>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-accent-tertiary)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--color-accent-tertiary)',
            boxShadow: 'var(--glow-tertiary)',
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
export default Bookshelf;
