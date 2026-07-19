import React, { useEffect } from 'react';
import { useSceneStore } from '../../hooks/useSceneStore';
import { OBJECT_LABELS } from '../../utils/constants';
import '../../styles/panels.css';

// Import panels
import HeroPanel from './panels/HeroPanel';
import AboutPanel from './panels/AboutPanel';
import EducationPanel from './panels/EducationPanel';
import SkillsPanel from './panels/SkillsPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import HobbiesPanel from './panels/HobbiesPanel';
import GoalsPanel from './panels/GoalsPanel';
import ContactPanel from './panels/ContactPanel';
import PinBoardPanel from './panels/PinBoardPanel';

export const ContentPanel: React.FC = () => {
  const activeObject = useSceneStore((s) => s.activeObject);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);

  // Close panel on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeObject) {
        setActiveObject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeObject, setActiveObject]);

  if (!activeObject) return null;

  const renderPanelContent = () => {
    switch (activeObject) {
      case 'main-monitor':
        return <ProjectsPanel />;
      case 'laptop':
        return <AboutPanel />;
      case 'bookshelf':
        return <EducationPanel />;
      case 'workbench':
        return <SkillsPanel />;
      case 'holographic-table':
        return <HeroPanel />;
      case 'server-rack':
        return <ExperiencePanel />;
      case 'entertainment-shelf':
        return <HobbiesPanel />;
      case 'panoramic-window':
        return <GoalsPanel />;
      case 'communication-terminal':
        return <ContactPanel />;
      case 'pin-board':
        return <PinBoardPanel />;
      default:
        return <p>Payload index not found.</p>;
    }
  };

  const getPanelTitle = () => {
    return OBJECT_LABELS[activeObject]?.label || 'DATA LINK';
  };

  return (
    <div className="panel-container glass-panel cyber-clip scanlines">
      <div className="panel-header">
        <h2 className="panel-title">{getPanelTitle()}</h2>
        <button 
          className="panel-close-btn" 
          onClick={() => setActiveObject(null)}
          aria-label="Close panel"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="panel-content">
        {renderPanelContent()}
      </div>
    </div>
  );
};
export default ContentPanel;
