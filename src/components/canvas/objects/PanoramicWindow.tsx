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

export const PanoramicWindow: React.FC<ObjectProps> = ({ position = [0, 5.0, -9.8] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'panoramic-window';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.9) * 0.01;
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
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Outer Window frame */}
      <mesh castShadow>
        <boxGeometry args={[6.0, 4.0, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.tertiary : new THREE.Color('#100b26')} 
          roughness={0.5} 
          metalness={0.9} 
        />
      </mesh>

      {/* Panoramic Skyline background (boxes representing skyscrapers) */}
      <group position={[0, 0, -0.2]}>
        {/* City silhouette overlay plane */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[5.8, 3.8]} />
          <meshBasicMaterial 
            color={hovered || isSelected ? COLORS.three.tertiary : new THREE.Color('#0d0221')} 
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Tall building 1 */}
        <mesh position={[-1.8, -0.8, -0.05]} castShadow>
          <boxGeometry args={[0.6, 2.0, 0.4]} />
          <meshStandardMaterial color="#080214" roughness={0.9} />
        </mesh>
        
        {/* Building lights */}
        <mesh position={[-1.8, 0.1, -0.02]}>
          <planeGeometry args={[0.4, 0.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>

        {/* Tall building 2 */}
        <mesh position={[0.2, -0.4, -0.08]} castShadow>
          <boxGeometry args={[0.8, 2.8, 0.4]} />
          <meshStandardMaterial color="#05010f" roughness={0.9} />
        </mesh>

        {/* Building lights 2 */}
        <mesh position={[0.2, 0.6, -0.05]}>
          <planeGeometry args={[0.5, 0.2]} />
          <meshBasicMaterial color={COLORS.three.primary} toneMapped={false} />
        </mesh>

        {/* Building 3 */}
        <mesh position={[1.8, -1.1, -0.06]} castShadow>
          <boxGeometry args={[0.7, 1.4, 0.4]} />
          <meshStandardMaterial color="#0b0217" roughness={0.9} />
        </mesh>
      </group>

      {/* Glass Pane */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[5.8, 3.8]} />
        <meshStandardMaterial 
          color="#a78bfa" 
          transparent 
          opacity={0.1} 
          roughness={0.1} 
          metalness={0.9} 
        />
      </mesh>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 2.2, 0]} center>
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
export default PanoramicWindow;
