import React from 'react';
import { personal } from '../../../data/personal';
import { GlowText } from '../../shared/GlowText';

export const HobbiesPanel: React.FC = () => {
  return (
    <div>
      <div className="hobby-grid">
        {personal.hobbies.map((hobby) => (
          <div key={hobby.name} className="hobby-card">
            <div className="hobby-icon">{hobby.icon}</div>
            <GlowText as="h4" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xs)' }}>
              {hobby.name}
            </GlowText>
            <p className="hobby-desc">{hobby.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HobbiesPanel;
