import React, { useMemo } from 'react';
import { COLORS } from '../../../utils/constants';
import { createGridTexture } from '../../../utils/helpers';

export const Room: React.FC = () => {
  // Memoize grid textures to prevent recreating them on render
  const floorGrid = useMemo(() => createGridTexture(512, 32, 'rgba(0, 185, 251, 0.12)', '#0a0118'), []);
  const wallGrid = useMemo(() => createGridTexture(512, 64, 'rgba(255, 61, 148, 0.05)', '#0f0525'), []);

  return (
    <group>
      {/* ─── ROOM STRUCTURE ────────────────────────────────────────── */}
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          map={floorGrid}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial 
          map={wallGrid}
          roughness={0.9}
        />
      </mesh>

      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-15, 5, 0]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial 
          color={COLORS.three.wall} 
          roughness={0.9}
        />
      </mesh>

      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[15, 5, 0]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial 
          color={COLORS.three.wall} 
          roughness={0.9}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#05010a" roughness={1.0} />
      </mesh>

      {/* ─── PROCEDURAL DESK ───────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Main tabletop */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 0.1, 3]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Tabletop neon trim border */}
        <mesh position={[0, 1.4, 1.51]}>
          <boxGeometry args={[10, 0.05, 0.02]} />
          <meshBasicMaterial color={COLORS.three.primary} toneMapped={false} />
        </mesh>

        {/* Desk support structures (legs) */}
        <mesh position={[-4.5, 0.7, 0]} castShadow>
          <boxGeometry args={[0.2, 1.4, 2.6]} />
          <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[4.5, 0.7, 0]} castShadow>
          <boxGeometry args={[0.2, 1.4, 2.6]} />
          <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
export default Room;
