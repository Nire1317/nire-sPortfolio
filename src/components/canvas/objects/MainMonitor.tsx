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

export const MainMonitor: React.FC<ObjectProps> = ({ position = [0, 2.3, -0.8] }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'main-monitor';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle floating
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.03;
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
      ref={meshRef} 
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Stand Base */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#0f111a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Stand Stem */}
      <mesh position={[0, -0.3, -0.1]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#0f111a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Monitor Frame */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.0, 1.2, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.primary : new THREE.Color('#16213e')} 
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Screen Display */}
      <mesh position={[0, 0.3, 0.051]}>
        <planeGeometry args={[1.9, 1.1]} />
        <meshBasicMaterial 
          color={hovered || isSelected ? COLORS.three.primary : new THREE.Color('#0a001a')}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle Screen Scanline Glow effect */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.3, 0.052]}>
          <planeGeometry args={[1.9, 1.1]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 1.1, 0]} center>
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
export default MainMonitor;
