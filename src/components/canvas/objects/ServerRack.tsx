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

export const ServerRack: React.FC<ObjectProps> = ({ position = [0, 2.5, -7] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'server-rack';
  const isSelected = activeObject === objId;

  // Store individual LED state values to animate blinking
  const ledRef = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.0) * 0.02;
    }

    // Blinking LEDs animation
    ledRef.current.forEach((material, index) => {
      if (material) {
        // Vary speeds per LED row index
        const blinkSpeed = 3 + (index % 3);
        const blink = Math.sin(time * blinkSpeed) > 0.2;
        material.color.set(blink ? '#39ff14' : '#032000');
      }
    });
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
      {/* Tall Server Cabinet enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 4.2, 1.2]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.primary : new THREE.Color('#0c071a')} 
          metalness={0.9} 
          roughness={0.4} 
        />
      </mesh>

      {/* Front glass plate/screen mesh overlay */}
      <mesh position={[0, 0, 0.601]}>
        <planeGeometry args={[1.4, 3.8]} />
        <meshStandardMaterial 
          color="#16213e" 
          transparent 
          opacity={0.4} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Blinking LEDs rows inside ServerRack */}
      <group position={[-0.5, 1.6, 0.61]}>
        {Array.from({ length: 12 }).map((_, rowIndex) => {
          const yOffset = rowIndex * -0.28;
          return (
            <group key={rowIndex} position={[0, yOffset, 0]}>
              {/* Row Label */}
              <mesh position={[-0.1, 0, 0]}>
                <planeGeometry args={[0.08, 0.04]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
              </mesh>

              {/* 3 LEDs per row */}
              {[0, 1, 2].map((ledIndex) => {
                const xOffset = ledIndex * 0.12 + 0.1;
                return (
                  <mesh key={ledIndex} position={[xOffset, 0, 0]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshBasicMaterial 
                      ref={(el) => {
                        if (el) ledRef.current[rowIndex * 3 + ledIndex] = el as THREE.MeshBasicMaterial;
                      }}
                      color="#032000"
                      toneMapped={false}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 2.3, 0]} center>
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
export default ServerRack;
