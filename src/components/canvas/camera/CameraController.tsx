import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../../hooks/useSceneStore';
import { CAMERA_POSITIONS, TIMINGS } from '../../../utils/constants';
import gsap from 'gsap';
import * as THREE from 'three';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const activeObject = useSceneStore((s) => s.activeObject);
  const phase = useSceneStore((s) => s.phase);
  const setPhase = useSceneStore((s) => s.setPhase);

  // References to track lookAt targets smoothly
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));

  // Flag to disable ambient floating during active camera transitions
  const isTransitioning = useRef<boolean>(false);

  useEffect(() => {
    // ─── STAGE 1: ENTRY CINEMATIC ─────────────────────────────────
    if (phase === 'entering') {
      isTransitioning.current = true;
      
      // Set initial entry position
      const entryPos = CAMERA_POSITIONS.entry.position;
      const entryTar = CAMERA_POSITIONS.entry.target;
      camera.position.set(entryPos[0], entryPos[1], entryPos[2]);
      targetLookAt.current.set(entryTar[0], entryTar[1], entryTar[2]);
      currentLookAt.current.copy(targetLookAt.current);
      camera.lookAt(currentLookAt.current);

      const overviewPos = CAMERA_POSITIONS.overview.position;
      const overviewTar = CAMERA_POSITIONS.overview.target;

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioning.current = false;
          setPhase('exploring');
        }
      });

      // Fly to overview
      tl.to(camera.position, {
        x: overviewPos[0],
        y: overviewPos[1],
        z: overviewPos[2],
        duration: TIMINGS.cameraEntryDuration,
        ease: 'power2.inOut'
      }, 0);

      tl.to(targetLookAt.current, {
        x: overviewTar[0],
        y: overviewTar[1],
        z: overviewTar[2],
        duration: TIMINGS.cameraEntryDuration,
        ease: 'power2.inOut'
      }, 0);
    }
  }, [phase, camera, setPhase]);

  useEffect(() => {
    // ─── STAGE 2: OBJECT TRANSITIONS ──────────────────────────────
    if (phase !== 'exploring' && phase !== 'focused') return;

    const destKey = activeObject || 'overview';
    const config = CAMERA_POSITIONS[destKey];
    if (!config) return;

    isTransitioning.current = true;

    // Animate camera position
    gsap.to(camera.position, {
      x: config.position[0],
      y: config.position[1],
      z: config.position[2],
      duration: TIMINGS.cameraTransition,
      ease: 'power2.out',
      onComplete: () => {
        isTransitioning.current = false;
      }
    });

    // Animate camera target (lookAt)
    gsap.to(targetLookAt.current, {
      x: config.target[0],
      y: config.target[1],
      z: config.target[2],
      duration: TIMINGS.cameraTransition,
      ease: 'power2.out'
    });

  }, [activeObject, phase, camera]);

  useFrame((state) => {
    // 1. Interpolate lookAt position smoothly to prevent sudden cuts
    currentLookAt.current.lerp(targetLookAt.current, 0.1);
    camera.lookAt(currentLookAt.current);

    // 2. Add subtle ambient floating effect when not moving
    if (!isTransitioning.current && (phase === 'exploring' || phase === 'focused' && !activeObject)) {
      const time = state.clock.getElapsedTime();
      camera.position.y += Math.sin(time * 0.5) * 0.0015;
      camera.position.x += Math.cos(time * 0.3) * 0.001;
    }
  });

  return null;
};
export default CameraController;
