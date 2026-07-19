import React from 'react';
import { personal } from '../../../data/personal';
import { CyberButton } from '../../shared/CyberButton';
import { GlowText } from '../../shared/GlowText';
import { NeonDivider } from '../../shared/NeonDivider';

export const AboutPanel: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid var(--color-accent-primary)',
            boxShadow: 'var(--glow-primary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '2rem',
            backgroundColor: 'rgba(0, 185, 251, 0.1)'
          }}>
            👤
          </div>
          <div>
            <GlowText as="h2" style={{ fontSize: 'var(--text-2xl)' }}>
              {personal.name}
            </GlowText>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              SYSTEM_USER: ACTIVE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
          {personal.bio.map((paragraph, index) => (
            <p key={index} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
              {paragraph}
            </p>
          ))}
        </div>

        <NeonDivider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div>
            <span className="meta-label">Location: </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)' }}>{personal.location}</span>
          </div>
          <div>
            <span className="meta-label">Comm Link: </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--color-accent-primary)' }}>
              <a href={`mailto:${personal.email}`}>{personal.email}</a>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
          {personal.socials.map((social) => (
            <CyberButton 
              key={social.platform} 
              variant="secondary" 
              href={social.url} 
              style={{ flexGrow: 1, padding: '8px 0', fontSize: 'var(--text-xs)' }}
            >
              {social.icon} {social.platform}
            </CyberButton>
          ))}
        </div>

        <CyberButton 
          variant="primary" 
          href={personal.resumeUrl} 
          download="Christian_Erin_Tuzon_Resume.pdf"
          style={{ width: '100%', marginTop: 'var(--space-sm)' }}
        >
          DOWNLOAD RESUME (PDF) 📥
        </CyberButton>
      </div>
    </div>
  );
};
export default AboutPanel;
