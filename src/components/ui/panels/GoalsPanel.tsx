import React from 'react';
import { personal } from '../../../data/personal';
import { CyberCard } from '../../shared/CyberCard';

export const GoalsPanel: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {personal.goals.map((goal, index) => (
          <CyberCard key={index} variant="primary">
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-accent-secondary)',
                textShadow: 'var(--glow-text-secondary)',
                fontWeight: 'bold',
                borderRight: '1px solid rgba(255, 61, 148, 0.2)',
                paddingRight: 'var(--space-md)'
              }}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <p style={{ 
                fontSize: 'var(--text-base)', 
                color: 'var(--color-text-primary)',
                margin: 0,
                lineHeight: 1.4
              }}>
                {goal}
              </p>
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};
export default GoalsPanel;
