import React, { useState } from 'react';
import { projects } from '../../../data/projects';
import type { Project } from '../../../data/projects';
import { GlowText } from '../../shared/GlowText';
import { CyberButton } from '../../shared/CyberButton';
import { motion, AnimatePresence } from 'framer-motion';

export const PinBoardPanel: React.FC = () => {
  const pinnedProjects = projects.filter((p) => p.featured).slice(0, 3);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Styling colors matching sticky notes
  const noteColors = ['#00B9FB', '#FF3D94', '#f0f0c0'];
  const textColors = ['#0D0221', '#F0F0F0', '#0D0221'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
        Select a pinned node sub-packet to unpack detailed subroutines.
      </p>

      {/* Grid of paper sticky notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {pinnedProjects.map((project, idx) => {
          const bgColor = noteColors[idx % noteColors.length];
          const textColor = textColors[idx % textColors.length];
          
          return (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedProject(project)}
              style={{
                background: bgColor,
                color: textColor,
                padding: 'var(--space-md)',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                position: 'relative',
                transform: `rotate(${idx % 2 === 0 ? -1.5 : 1.5}deg)`,
                transition: 'box-shadow 0.2s ease'
              }}
            >
              {/* Little red pushpin shape */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: idx === 2 ? '#0000ff' : idx === 1 ? '#ffffff' : '#ff0000',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}></div>

              <h4 style={{ 
                margin: '0 0 var(--space-xs) 0', 
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-base)',
                fontWeight: 'bold'
              }}>
                {project.title.toUpperCase()}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--text-sm)',
                lineHeight: 1.4,
                opacity: 0.9
              }}>
                {project.description}
              </p>

              <div style={{ 
                marginTop: 'var(--space-sm)', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px' 
              }}>
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    border: `1px solid ${textColor}`,
                    padding: '1px 4px',
                    borderRadius: '2px',
                    opacity: 0.8
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Standalone Project Detail Overlay (Separate Page Modal) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(13, 2, 33, 0.95)',
              zIndex: 999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 'var(--space-lg)',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-accent-primary)',
                boxShadow: 'var(--glow-primary)',
                padding: 'var(--space-xl)',
                borderRadius: '8px',
                position: 'relative'
              }}
              className="scanlines cyber-clip"
            >
              {/* Back close button */}
              <button 
                onClick={() => setSelectedProject(null)}
                style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-lg)'
                }}
              >
                ✕
              </button>

              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '10px', 
                color: 'var(--color-accent-secondary)',
                letterSpacing: '0.2em',
                marginBottom: 'var(--space-xs)'
              }}>
                [ DETAILED_LOG // UNPACKED ]
              </div>

              <GlowText as="h2" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-md)' }}>
                {selectedProject.title}
              </GlowText>

              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                {selectedProject.longDescription || selectedProject.description}
              </p>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="meta-label" style={{ marginBottom: 'var(--space-xs)' }}>Tech Stack Modules:</div>
                <div className="tech-badge-container">
                  {selectedProject.techStack.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                {selectedProject.liveUrl && (
                  <CyberButton variant="primary" href={selectedProject.liveUrl} style={{ flexGrow: 1 }}>
                    OPEN INTERFACE (DEMO)
                  </CyberButton>
                )}
                {selectedProject.githubUrl && (
                  <CyberButton variant="secondary" href={selectedProject.githubUrl} style={{ flexGrow: 1 }}>
                    SOURCE LINK (GITHUB)
                  </CyberButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PinBoardPanel;
