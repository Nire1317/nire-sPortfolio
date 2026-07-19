import React from 'react';
import { experience } from '../../../data/experience';
import { GlowText } from '../../shared/GlowText';
import { CyberCard } from '../../shared/CyberCard';

export const ExperiencePanel: React.FC = () => {
  return (
    <div>
      <div className="timeline-container">
        {experience.map((exp) => (
          <div key={exp.id} className="timeline-item">
            <div className="timeline-node"></div>
            <div style={{ paddingLeft: 'var(--space-sm)' }}>
              <CyberCard variant="primary">
                <GlowText as="h3" style={{ fontSize: 'var(--text-lg)', marginBottom: '2px' }}>
                  {exp.role}
                </GlowText>
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--color-accent-primary)',
                  marginBottom: 'var(--space-xs)',
                  textTransform: 'uppercase'
                }}>
                  {exp.company} | {exp.location}
                </div>
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '11px', 
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-md)'
                }}>
                  {exp.startDate} — {exp.endDate}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                  {exp.description}
                </p>
                <ul style={{ 
                  listStyleType: 'square', 
                  paddingLeft: 'var(--space-md)',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-md)'
                }}>
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
                <div className="tech-badge-container">
                  {exp.techStack.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </CyberCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ExperiencePanel;
