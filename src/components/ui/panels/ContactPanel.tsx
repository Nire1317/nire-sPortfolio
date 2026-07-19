import React, { useState } from 'react';
import { personal } from '../../../data/personal';
import { CyberButton } from '../../shared/CyberButton';
import { GlowText } from '../../shared/GlowText';
import { NeonDivider } from '../../shared/NeonDivider';

export const ContactPanel: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, submit this to a backend or service
    console.log('Sending message:', formState);
    setSubmitted(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
          Establish a secure connection. Send a message directly to my console terminal.
        </p>

        {submitted ? (
          <div style={{
            border: '1px solid var(--color-accent-primary)',
            background: 'rgba(0, 185, 251, 0.1)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--glow-primary)',
            margin: 'var(--space-md) 0'
          }}>
            <GlowText as="h4" style={{ color: 'var(--color-accent-primary)', marginBottom: 'var(--space-xs)' }}>
              CONNECTION SECURED
            </GlowText>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Your transmission has been broadcasted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div className="cyber-input-group">
              <label className="cyber-input-label">Identity / Name</label>
              <input
                type="text"
                required
                className="cyber-input"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
            </div>
            <div className="cyber-input-group">
              <label className="cyber-input-label">Node Address / Email</label>
              <input
                type="email"
                required
                className="cyber-input"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
            </div>
            <div className="cyber-input-group">
              <label className="cyber-input-label">Payload / Message</label>
              <textarea
                required
                rows={4}
                className="cyber-input"
                style={{ resize: 'vertical' }}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              />
            </div>
            <CyberButton type="submit" variant="primary" style={{ width: '100%' }}>
              TRANSMIT PAYLOAD 📡
            </CyberButton>
          </form>
        )}

        <NeonDivider />

        <div style={{ textAlign: 'center' }}>
          <div className="meta-label" style={{ marginBottom: 'var(--space-sm)' }}>Alternative Channels</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', justifyContent: 'center' }}>
            {personal.socials.map((social) => (
              <CyberButton
                key={social.platform}
                variant="secondary"
                href={social.url}
                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
              >
                {social.icon} {social.platform}
              </CyberButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactPanel;
