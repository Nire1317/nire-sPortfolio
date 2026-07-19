import React, { useState, useEffect } from 'react';
import { useSceneStore } from '../../hooks/useSceneStore';
import '../../styles/boot.css';

const BOOT_MESSAGES = [
  { text: '[SYS] Initializing ERIN_OS v2.0.26...', type: 'system' },
  { text: '[OK] Core kernel subroutines loaded', type: 'ok' },
  { text: '[OK] Neural matrix interface connected', type: 'ok' },
  { text: '[OK] Volumetric render pipeline online', type: 'ok' },
  { text: '[>>] Fetching user payload data...', type: 'info' },
  { text: '[OK] Projects database: 6 items indexed', type: 'ok' },
  { text: '[OK] Skills registry: 24 active entries', type: 'ok' },
  { text: '[OK] Work ledger: Verified safe credentials', type: 'ok' },
  { text: '[SYS] Diagnostics: All systems nominal', type: 'system' },
  { text: '[>>] Calibrating camera coordinates...', type: 'info' },
  { text: '[OK] Rendering viewport simulation...', type: 'ok' }
];

export const BootSequence: React.FC = () => {
  const setPhase = useSceneStore((s) => s.setPhase);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Run the text animation line by line
    let index = 0;
    const textInterval = setInterval(() => {
      if (index < BOOT_MESSAGES.length) {
        const msg = BOOT_MESSAGES[index];
        setLines((prev) => [...prev, JSON.stringify(msg)]);
        setProgress(((index + 1) / BOOT_MESSAGES.length) * 100);
        index++;
      } else {
        clearInterval(textInterval);
        // Pause briefly before finishing
        setTimeout(() => {
          setPhase('entering');
        }, 800);
      }
    }, 350);

    return () => clearInterval(textInterval);
  }, [setPhase]);

  const handleSkip = () => {
    setPhase('exploring');
  };

  return (
    <div className="boot-container scanlines">
      <div className="boot-terminal hud-brackets">
        <div className="boot-lines">
          {lines.map((lineJson, index) => {
            const line = JSON.parse(lineJson);
            return (
              <div key={index} className={`boot-line ${line.type}`}>
                {line.text}
              </div>
            );
          })}
        </div>
        
        <div className="boot-progress-wrapper">
          <div className="boot-progress-bar">
            <div className="boot-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <button className="boot-skip-btn" onClick={handleSkip}>
          SKIP_INIT »
        </button>
      </div>
    </div>
  );
};
export default BootSequence;
