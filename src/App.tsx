import { useEffect } from 'react';
import { useSceneStore } from './hooks/useSceneStore';
import Scene from './components/canvas/Scene';
import BootSequence from './components/ui/BootSequence';
import HUD from './components/ui/HUD';
import NavigationBar from './components/ui/NavigationBar';
import ContentPanel from './components/ui/ContentPanel';
import './styles/index.css';
import './styles/animations.css';

function App() {
  const phase = useSceneStore((s) => s.phase);
  const setIsMobile = useSceneStore((s) => s.setIsMobile);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  return (
    <div id="portfolio-root" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 3D Canvas — always mounted for asset preloading */}
      {phase !== 'boot' && <Scene />}

      {/* Boot Sequence Overlay */}
      {phase === 'boot' && <BootSequence />}

      {/* HUD Overlay */}
      {(phase === 'exploring' || phase === 'focused') && <HUD />}

      {/* Navigation Dots */}
      {(phase === 'exploring' || phase === 'focused') && <NavigationBar />}

      {/* Content Panel */}
      <ContentPanel />
    </div>
  );
}

export default App;
