import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { POST_PROCESSING } from '../../../utils/constants';

export const PostProcessing: React.FC = () => {
  return (
    <EffectComposer>
      <Bloom 
        intensity={POST_PROCESSING.bloom.intensity}
        luminanceThreshold={POST_PROCESSING.bloom.luminanceThreshold}
        luminanceSmoothing={POST_PROCESSING.bloom.luminanceSmoothing}
        mipmapBlur={POST_PROCESSING.bloom.mipmapBlur}
      />
      <ChromaticAberration 
        offset={POST_PROCESSING.chromaticAberration.offset}
      />
      <Noise 
        opacity={POST_PROCESSING.noise.opacity}
      />
      <Vignette 
        offset={POST_PROCESSING.vignette.offset}
        darkness={POST_PROCESSING.vignette.darkness}
      />
    </EffectComposer>
  );
};
export default PostProcessing;
