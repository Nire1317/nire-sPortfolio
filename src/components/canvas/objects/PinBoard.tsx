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

export const PinBoard: React.FC<ObjectProps> = ({ position = [-3.5, 3.5, -7.5] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredNote, setHoveredNote] = useState<number | null>(null);

  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);
  const setHoveredObject = useSceneStore((s) => s.setHoveredObject);

  const objId = 'pin-board';
  const isSelected = activeObject === objId;

  // Track note rotations for animation
  const note1Ref = useRef<THREE.Mesh>(null);
  const note2Ref = useRef<THREE.Mesh>(null);
  const note3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Floating animation when not selected
    if (!isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.1) * 0.02;
    }

    // Gentle wiggling animation on hovered notes
    if (note1Ref.current && hoveredNote === 1) {
      note1Ref.current.rotation.z = Math.sin(time * 8.0) * 0.06;
    } else if (note1Ref.current) {
      note1Ref.current.rotation.z = -0.05;
    }

    if (note2Ref.current && hoveredNote === 2) {
      note2Ref.current.rotation.z = Math.sin(time * 8.0) * 0.06;
    } else if (note2Ref.current) {
      note2Ref.current.rotation.z = 0.02;
    }

    if (note3Ref.current && hoveredNote === 3) {
      note3Ref.current.rotation.z = Math.sin(time * 8.0) * 0.06;
    } else if (note3Ref.current) {
      note3Ref.current.rotation.z = -0.02;
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

  const handleNoteClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveObject(objId);
  };

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleNoteClick}
    >
      {/* Wooden Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.6, 0.06]} />
        <meshStandardMaterial 
          color={hovered ? COLORS.three.primary : new THREE.Color('#100b26')} 
          roughness={0.8}
        />
      </mesh>

      {/* Cork Board Surface */}
      <mesh position={[0, 0, 0.02]} receiveShadow>
        <boxGeometry args={[2.0, 1.4, 0.02]} />
        <meshStandardMaterial color="#402008" roughness={0.9} />
      </mesh>

      {/* Pinned Note 1 (Cyan sticky note) */}
      <mesh 
        ref={note1Ref} 
        position={[-0.5, 0.2, 0.035]} 
        rotation={[0, 0, -0.05]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredNote(1); }}
        onPointerOut={() => setHoveredNote(null)}
        castShadow
      >
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial color="#00B9FB" roughness={0.6} side={THREE.DoubleSide} />
        
        {/* Little pin on top */}
        <mesh position={[0, 0.18, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      </mesh>

      {/* Pinned Note 2 (Magenta sticky note) */}
      <mesh 
        ref={note2Ref} 
        position={[0.5, 0.1, 0.035]} 
        rotation={[0, 0, 0.02]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredNote(2); }}
        onPointerOut={() => setHoveredNote(null)}
        castShadow
      >
        <planeGeometry args={[0.42, 0.42]} />
        <meshStandardMaterial color="#FF3D94" roughness={0.6} side={THREE.DoubleSide} />
        
        {/* Little pin on top */}
        <mesh position={[0, 0.19, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </mesh>

      {/* Pinned Note 3 (Off-white sticky note) */}
      <mesh 
        ref={note3Ref} 
        position={[-0.1, -0.3, 0.035]} 
        rotation={[0, 0, -0.02]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredNote(3); }}
        onPointerOut={() => setHoveredNote(null)}
        castShadow
      >
        <planeGeometry args={[0.45, 0.35]} />
        <meshStandardMaterial color="#f0f0c0" roughness={0.6} side={THREE.DoubleSide} />
        
        {/* Little pin on top */}
        <mesh position={[0, 0.16, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
          <meshBasicMaterial color="#0000ff" />
        </mesh>
      </mesh>

      {/* Label HTML */}
      {hovered && !activeObject && (
        <Html distanceFactor={4} position={[0, 1.0, 0]} center>
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
export default PinBoard;
