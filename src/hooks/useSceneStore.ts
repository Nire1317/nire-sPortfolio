import { create } from 'zustand';

export type ScenePhase = 'boot' | 'entering' | 'exploring' | 'focused';

export interface SceneState {
  // Scene phase
  phase: ScenePhase;
  setPhase: (phase: ScenePhase) => void;

  // Active object (which workspace object is selected)
  activeObject: string | null;
  setActiveObject: (id: string | null) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Device detection
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;

  // Quality level for performance scaling
  qualityLevel: 'high' | 'medium' | 'low';
  setQualityLevel: (level: SceneState['qualityLevel']) => void;

  // Hovered object (for label display)
  hoveredObject: string | null;
  setHoveredObject: (id: string | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: 'boot',
  setPhase: (phase) => set({ phase }),

  activeObject: null,
  setActiveObject: (id) =>
    set({
      activeObject: id,
      phase: id ? 'focused' : 'exploring',
    }),

  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  isMobile: false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),

  qualityLevel: 'high',
  setQualityLevel: (level) => set({ qualityLevel: level }),

  hoveredObject: null,
  setHoveredObject: (id) => set({ hoveredObject: id }),
}));
