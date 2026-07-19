import React from 'react';
import { personal } from '../../../data/personal';
import { projects } from '../../../data/projects';
import { CyberCard } from '../../shared/CyberCard';
import { CyberButton } from '../../shared/CyberButton';
import { GlowText } from '../../shared/GlowText';
import { NeonDivider } from '../../shared/NeonDivider';
import { useSceneStore } from '../../../hooks/useSceneStore';

export const HeroPanel: React.FC = () => {
  const featuredProjects = projects.filter((p) => p.featured);
  const setActiveObject = useSceneStore((s) => s.setActiveObject);

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <GlowText as="h1" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-xs)' }}>
          {personal.name}
        </GlowText>
        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: 'var(--text-sm)', 
          color: 'var(--color-accent-secondary)', 
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 'var(--space-md)'
        }}>
          {personal.title}
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' }}>
          {personal.tagline}
        </p>
      </div>

      <CyberButton 
        variant="primary" 
        onClick={() => setActiveObject('laptop')}
        style={{ width: '100%', marginBottom: 'var(--space-lg)' }}
      >
        INITIATE ABOUT SEQUENCE 💻
      </CyberButton>

      <NeonDivider />

      <div>
        <h3 className="panel-section-title">Featured Projects</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {featuredProjects.map((project) => (
            <CyberCard key={project.id} variant="primary">
              <h4 className="cyber-card-title">{project.title}</h4>
              <p className="cyber-card-desc">{project.description}</p>
              <div className="tech-badge-container" style={{ marginBottom: 'var(--space-sm)' }}>
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                {project.liveUrl && (
                  <CyberButton variant="primary" href={project.liveUrl} style={{ padding: '4px 12px', fontSize: '10px' }}>
                    LIVE DEMO
                  </CyberButton>
                )}
                {project.githubUrl && (
                  <CyberButton variant="secondary" href={project.githubUrl} style={{ padding: '4px 12px', fontSize: '10px' }}>
                    GITHUB
                  </CyberButton>
                )}
              </div>
            </CyberCard>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HeroPanel;
