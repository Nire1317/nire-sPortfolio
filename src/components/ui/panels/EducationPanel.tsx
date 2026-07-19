import React from 'react';
import { education } from '../../../data/education';
import { GlowText } from '../../shared/GlowText';

export const EducationPanel: React.FC = () => {
  return (
    <div>
      <div className="timeline-container">
        {education.map((edu) => (
          <div key={edu.id} className="timeline-item">
            <div className="timeline-node"></div>
            <div style={{ paddingLeft: 'var(--space-sm)' }}>
              <GlowText as="h3" style={{ fontSize: 'var(--text-lg)', marginBottom: '2px' }}>
                {edu.degree}
              </GlowText>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-accent-secondary)',
                marginBottom: 'var(--space-xs)',
                textTransform: 'uppercase'
              }}>
                {edu.field} | {edu.institution}
              </div>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '11px', 
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-sm)'
              }}>
                {edu.startDate} — {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}
              </div>
              <ul style={{ 
                listStyleType: 'square', 
                paddingLeft: 'var(--space-md)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-xs)'
              }}>
                {edu.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
              {edu.courses && (
                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <div className="meta-label" style={{ marginBottom: 'var(--space-xs)' }}>Core Subroutines:</div>
                  <div className="tech-badge-container">
                    {edu.courses.map((course) => (
                      <span key={course} className="tech-badge">{course}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EducationPanel;
