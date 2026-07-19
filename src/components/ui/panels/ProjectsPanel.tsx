import React, { useState } from 'react';
import { projects } from '../../../data/projects';
import type { Project } from '../../../data/projects';
import { CyberCard } from '../../shared/CyberCard';
import { CyberButton } from '../../shared/CyberButton';
import { GlowText } from '../../shared/GlowText';

export const ProjectsPanel: React.FC = () => {
  const [filter, setFilter] = useState<'all' | Project['category']>('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter((p) => p.category === filter);

  const categories: { label: string; value: 'all' | Project['category'] }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'WEB', value: 'web' },
    { label: 'AI', value: 'ai' },
    { label: 'TOOLS', value: 'tool' },
  ];

  return (
    <div>
      {/* Category filter tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-xs)', 
        marginBottom: 'var(--space-lg)',
        borderBottom: '1px solid rgba(0, 185, 251, 0.1)',
        paddingBottom: 'var(--space-sm)',
        flexWrap: 'wrap'
      }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: filter === cat.value ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px 8px',
              textShadow: filter === cat.value ? 'var(--glow-text-primary)' : 'none',
              borderBottom: filter === cat.value ? '2px solid var(--color-accent-primary)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {filteredProjects.map((project) => (
          <CyberCard 
            key={project.id} 
            variant={project.featured ? 'secondary' : 'primary'}
            style={{
              borderColor: project.themeColor,
              boxShadow: `0 0 12px ${project.themeColor}33, inset 0 0 8px ${project.themeColor}1a`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <GlowText 
                as="h3" 
                style={{ 
                  fontSize: 'var(--text-lg)', 
                  marginBottom: 'var(--space-xs)',
                  color: project.themeColor,
                  textShadow: `0 0 8px ${project.themeColor}60`
                }}
              >
                {project.title}
              </GlowText>
              {project.featured && (
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '9px', 
                  backgroundColor: 'rgba(255, 61, 148, 0.15)',
                  border: '1px solid var(--color-accent-secondary)',
                  color: 'var(--color-accent-secondary)',
                  padding: '1px 4px',
                  borderRadius: '2px',
                  textShadow: 'var(--glow-text-secondary)',
                  boxShadow: 'var(--glow-secondary)'
                }}>
                  FEATURED
                </span>
              )}
            </div>
            <p className="cyber-card-desc">{project.longDescription || project.description}</p>
            {project.liveUrl && project.liveUrl.startsWith('http') && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: project.themeColor,
                  textDecoration: 'none',
                  display: 'inline-block',
                  margin: '4px 0 10px 0',
                  opacity: 0.8,
                  textShadow: `0 0 6px ${project.themeColor}50`
                }}
              >
                {project.liveUrl.replace('https://', '')} ↗
              </a>
            )}
            <div className="tech-badge-container" style={{ marginBottom: 'var(--space-sm)' }}>
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              {project.liveUrl && (
                <CyberButton 
                  variant="primary" 
                  href={project.liveUrl} 
                  style={{ 
                    padding: '6px 14px', 
                    fontSize: 'var(--text-xs)',
                    backgroundColor: project.themeColor,
                    borderColor: project.themeColor,
                    boxShadow: `0 0 10px ${project.themeColor}80`,
                    color: '#ffffff'
                  }}
                >
                  LIVE DEMO
                </CyberButton>
              )}
              {project.githubUrl && (
                <CyberButton 
                  variant="secondary" 
                  href={project.githubUrl} 
                  style={{ 
                    padding: '6px 14px', 
                    fontSize: 'var(--text-xs)',
                    borderColor: project.themeColor,
                    color: project.themeColor
                  }}
                >
                  GITHUB
                </CyberButton>
              )}
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};
export default ProjectsPanel;
