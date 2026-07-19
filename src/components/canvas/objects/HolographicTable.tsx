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

export const HolographicTable: React.FC<ObjectProps> = ({ position = [2.2, 0.8, -1.2] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'holographic-table';
  const isSelected = activeObject === objId;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.6) * 0.02;
    }

    if (hologramRef.current) {
      hologramRef.current.rotation.y = time * 0.8;
      hologramRef.current.rotation.x = time * 0.4;
      // Pulsing scale
      const scale = 1.0 + Math.sin(time * 3) * 0.05;
      hologramRef.current.scale.set(scale, scale, scale);
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
      {/* Pedestal Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.6, 16]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.primary : new THREE.Color('#100b26')} 
          metalness={0.9} 
          roughness={0.3} 
        />
      </mesh>

      {/* Hologram Emitter Disc */}
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 16]} />
        <meshBasicMaterial color={COLORS.three.primary} toneMapped={false} />
      </mesh>

      {/* Rotating Hologram projection (Wireframe) */}
      <mesh ref={hologramRef} position={[0, 0.9, 0]}>
        <dodecahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial 
          color={COLORS.three.primary} 
          wireframe
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Hologram Light Cone */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 0.6, 16, 1, true]} />
        <meshBasicMaterial 
          color={COLORS.three.primary}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 1.5, 0]} center>
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
export default HolographicTable;
