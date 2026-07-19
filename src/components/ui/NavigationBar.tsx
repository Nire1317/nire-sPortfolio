import React from 'react';
import { useSceneStore } from '../../hooks/useSceneStore';
import { OBJECT_LABELS } from '../../utils/constants';

export const NavigationBar: React.FC = () => {
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);

  const dots = Object.keys(OBJECT_LABELS);

  return (
    <div className="nav-dots-container">
      {/* Overview Reset Dot */}
      <div className="nav-dot-wrapper">
        <div 
          className={`nav-dot ${activeObject === null ? 'active' : ''}`}
          onClick={() => setActiveObject(null)}
        ></div>
        <div className="nav-dot-tooltip">Overview Room</div>
      </div>

      {/* Navigation objects dots */}
      {dots.map((key) => {
        const item = OBJECT_LABELS[key];
        return (
          <div key={key} className="nav-dot-wrapper">
            <div 
              className={`nav-dot ${activeObject === key ? 'active' : ''}`}
              onClick={() => setActiveObject(key)}
            ></div>
            <div className="nav-dot-tooltip">{item.icon} {item.label}</div>
          </div>
        );
      })}
    </div>
  );
};
export default NavigationBar;
