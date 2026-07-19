import React from 'react';
import { COLORS } from '../../../utils/constants';
import { useSceneStore } from '../../../hooks/useSceneStore';

export const Lighting: React.FC = () => {
  const qualityLevel = useSceneStore((s) => s.qualityLevel);

  return (
    <>
      {/* Ambient background light */}
      <ambientLight color={COLORS.three.ambient} intensity={0.5} />

      {/* Main workspace spotlight on the desk */}
      <spotLight
        position={[0, 8, 2]}
        angle={0.6}
        penumbra={1}
        intensity={2.5}
        color={COLORS.three.primary}
        castShadow={qualityLevel !== 'low'}
        shadow-mapSize-width={qualityLevel === 'high' ? 1024 : 512}
        shadow-mapSize-height={qualityLevel === 'high' ? 1024 : 512}
      />

      {/* Secondary accent lighting */}
      <pointLight
        position={[-6, 4, -2]}
        intensity={1.2}
        color={COLORS.three.secondary}
      />

      <pointLight
        position={[6, 4, -2]}
        intensity={1.0}
        color={COLORS.three.tertiary}
      />

      {/* Direct window fill light */}
      <directionalLight
        position={[0, 4, -10]}
        intensity={0.8}
        color={COLORS.three.primary}
      />
    </>
  );
};
export default Lighting;
