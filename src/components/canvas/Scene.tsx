import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useSceneStore } from '../../hooks/useSceneStore';
import { COLORS } from '../../utils/constants';

// Import scene components
import Room from './environment/Room';
import Lighting from './environment/Lighting';
import Workspace from './Workspace';
import PostProcessing from './effects/PostProcessing';
import CameraController from './camera/CameraController';

export const Scene: React.FC = () => {
  const isMobile = useSceneStore((s) => s.isMobile);
  const qualityLevel = useSceneStore((s) => s.qualityLevel);
  const setQualityLevel = useSceneStore((s) => s.setQualityLevel);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas
        shadows={qualityLevel !== 'low'}
        dpr={isMobile || qualityLevel === 'low' ? [1, 1] : [1, 2]}
        gl={{ 
          antialias: !isMobile && qualityLevel !== 'low', 
          alpha: false,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={() => useSceneStore.getState().setActiveObject(null)}
      >
        {/* Set canvas clear color to the deep background color */}
        <color attach="background" args={[COLORS.bgDeep]} />

        {/* Suspense boundary for lazy assets */}
        <Suspense fallback={null}>
          {/* Performance Monitor to dynamically scale details */}
          <PerformanceMonitor 
            onDecline={() => setQualityLevel('low')}
            onIncline={() => setQualityLevel('high')}
          >
            {/* Room Geometry */}
            <Room />

            {/* Lighting Setup */}
            <Lighting />

            {/* All 9 interactive objects */}
            <Workspace />

            {/* Cinematic Camera Controller */}
            <CameraController />

            {/* Post Processing Effects (Bloom, Vignette, etc.) */}
            {!isMobile && qualityLevel !== 'low' && <PostProcessing />}
          </PerformanceMonitor>
        </Suspense>
      </Canvas>
    </div>
  );
};
export default Scene;
