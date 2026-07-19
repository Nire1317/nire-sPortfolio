import React from 'react';
import { skillCategories } from '../../../data/skills';
import { GlowText } from '../../shared/GlowText';
import { CyberCard } from '../../shared/CyberCard';

export const SkillsPanel: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {skillCategories.map((category) => (
          <CyberCard key={category.id} variant="primary">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
              <GlowText as="h3" style={{ fontSize: 'var(--text-lg)' }}>
                {category.name}
              </GlowText>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {category.skills.map((skill) => (
                <div key={skill.name} className="skill-bar-wrapper">
                  <div className="skill-bar-info">
                    <span style={{ color: 'var(--color-text-primary)' }}>{skill.name}</span>
                    <span style={{ color: 'var(--color-accent-primary)' }}>{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div 
                      className="skill-bar-fill" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};
export default SkillsPanel;
