import React from 'react';
import { useSceneStore } from '../../hooks/useSceneStore';
import { personal } from '../../data/personal';
import { OBJECT_LABELS } from '../../utils/constants';
import '../../styles/hud.css';

export const HUD: React.FC = () => {
  const activeObject = useSceneStore((s) => s.activeObject);
  const hoveredObject = useSceneStore((s) => s.hoveredObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);

  const getSectionName = () => {
    if (activeObject && OBJECT_LABELS[activeObject]) {
      return OBJECT_LABELS[activeObject].label;
    }
    if (hoveredObject && OBJECT_LABELS[hoveredObject]) {
      return OBJECT_LABELS[hoveredObject].label;
    }
    return 'COORDINATE EXPLORATION';
  };

  return (
    <div className="hud-container">
      {/* Top HUD */}
      <div className="hud-top">
        <div className="hud-profile" onClick={() => setActiveObject(null)}>
          <div className="hud-name">{personal.name.toUpperCase()}</div>
          <div className="hud-tagline">{personal.title.toUpperCase()}</div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div className="hud-active-section">{getSectionName()}</div>
          <div className="hud-status">
            <div className="hud-status-indicator"></div>
            <span>SYS_LINK: OK</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD / Navigation hints */}
      <div className="hud-bottom">
        {activeObject ? (
          <div className="hud-hint hud-hint--focused" onClick={() => setActiveObject(null)}>
            [ ESCAPE OR CLICK HERE TO RESET CAMERA VIEW ]
          </div>
        ) : (
          <div className="hud-hint">
            [ HOVER & CLICK WORKSPACE OBJECTS TO INVESTIGATE ]
          </div>
        )}
      </div>
    </div>
  );
};
export default HUD;
