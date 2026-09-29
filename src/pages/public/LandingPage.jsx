import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Wrench,
  Clock,
  Calendar,
  Boxes,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Building,
  Phone,
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SERVICE_TYPES } from '../../data';
import { Button } from '../../components/common/Button';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleOpenPortal = (roleName) => {
    navigate('/login', { state: { defaultRole: roleName } });
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* 1. Full-Screen Automotive Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - var(--navbar-height))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `
            linear-gradient(180deg, rgba(8, 13, 24, 0.68) 0%, rgba(10, 16, 30, 0.76) 45%, rgba(9, 14, 26, 0.91) 100%),
            url('https://sl.bing.net/e6xYsu1DobI'),
            url('/workshop_banner.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          padding: '5.5rem 2rem',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Blue Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(37, 99, 235, 0.18) 0%, transparent 68%)',
            pointerEvents: 'none',
            filter: 'blur(60px)'
          }}
        />

        <div
          style={{
            maxWidth: '1000px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >


          {/* Main Hero Heading */}
          <h1
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontSize: 'clamp(4.5rem, 10vw, 7.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '2rem',
              letterSpacing: '-0.05em',
              textShadow: '0 6px 40px rgba(0,0,0,0.85)'
            }}
          >
            NexaCare
          </h1>

          {/* Hero Description */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
              fontWeight: 400,
              color: '#cbd5e1',
              lineHeight: 1.75,
              maxWidth: '700px',
              marginBottom: '3.5rem',
              textShadow: '0 2px 16px rgba(0,0,0,0.65)'
            }}
          >
            Smart vehicle servicing, appointment management and workshop operations — all in one platform.
          </p>

          {/* Hero Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Primary Button — Book Service */}
            <Link
              to="/customer/book"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '1.125rem',
                padding: '1.15rem 3.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.7rem',
                minHeight: '60px',
                boxShadow: '0 8px 32px rgba(37, 99, 235, 0.58), 0 2px 10px rgba(0,0,0,0.3)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                border: '1.5px solid rgba(147, 197, 253, 0.28)',
                letterSpacing: '0.015em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                e.currentTarget.style.boxShadow = '0 16px 44px rgba(37, 99, 235, 0.72), 0 4px 14px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.58), 0 2px 10px rgba(0,0,0,0.3)';
              }}
            >
              <span>Book Service</span>
              <ArrowRight size={21} />
            </Link>

            {/* Secondary Button — Sign In */}
            <Link
              to="/login"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#f1f5f9',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1.125rem',
                padding: '1.15rem 3.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.7rem',
                minHeight: '60px',
                border: '1.5px solid rgba(255,255,255,0.44)',
                backdropFilter: 'blur(14px)',
                transition: 'transform 0.22s ease, background-color 0.22s ease, box-shadow 0.22s ease',
                letterSpacing: '0.015em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.82)';
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.44)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
