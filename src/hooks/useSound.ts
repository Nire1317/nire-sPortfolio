import { useCallback, useRef } from 'react';

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClick = useCallback((pitch?: 'high' | 'medium' | 'low' | 'deep') => {
    try {
      // Initialize AudioContext on first user interaction
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      
      // Determine frequency sweeps based on pitch
      let startFreq = 1000;
      let endFreq = 180;
      let duration = 0.04;
      let volume = 0.05;

      if (pitch === 'high') {
        startFreq = 1300;
        endFreq = 400;
        duration = 0.03;
        volume = 0.04;
      } else if (pitch === 'low') {
        startFreq = 800;
        endFreq = 120;
        duration = 0.05;
        volume = 0.06;
      } else if (pitch === 'deep') {
        startFreq = 450;
        endFreq = 60;
        duration = 0.07;
        volume = 0.08;
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      // Fast exponential amplitude decay
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch (e) {
      console.warn('Web Audio API click play blocked or unsupported:', e);
    }
  }, []);

  return { playClick };
}
