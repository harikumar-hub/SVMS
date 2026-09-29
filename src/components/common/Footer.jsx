import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-default)',
        padding: '2rem 1.5rem',
        marginTop: 'auto'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Contact row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>142, Avinashi Road, Peelamedu, Coimbatore</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Phone size={16} style={{ color: 'var(--primary)' }} />
            <span>+91 98432 55000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Mail size={16} style={{ color: 'var(--primary)' }} />
            <span>service@nexacare.in</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          &copy; {new Date().getFullYear()} NexaCare — Smart Vehicle Service &amp; Management System.
        </div>
      </div>
    </footer>
  );
};
