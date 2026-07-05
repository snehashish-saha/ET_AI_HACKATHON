import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, X, Check, FileText } from 'lucide-react';
import { useLiveReport } from '../hooks/useLiveReport';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';

export default function LandingPage() {
  const navigate = useNavigate();
  const { report } = useLiveReport();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation for closing modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAuthModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app/dashboard');
  };

  // Stats Intersection Observer to trigger counting
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: '#0A0F1E', color: '#F9FAFB', fontFamily: 'Inter, sans-serif', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Style tag for custom animations */}
      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-50px) translateX(30px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes floatScene {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes dangerPulse {
          0% { r: 15; opacity: 0.6; stroke-width: 1.5; }
          50% { r: 35; opacity: 0; stroke-width: 3; }
          100% { r: 15; opacity: 0.6; stroke-width: 1.5; }
        }
        @keyframes flowDots {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Floating Ambient Particles in Hero Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: '20%', left: '30%', width: '350px', height: '350px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,111,240,0.08) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulseGlow 8s ease-in-out infinite'
        }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              backgroundColor: Math.random() > 0.5 ? '#3B6FF0' : '#FFFFFF',
              borderRadius: '50%',
              opacity: 0.15,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 95}%`,
              animation: `drift ${Math.random() * 15 + 15}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* FIXED NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '68px',
        backgroundColor: 'rgba(10, 15, 30, 0.80)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
        zIndex: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Shield size={24} color="#3B6FF0" />
          <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Sora, sans-serif', letterSpacing: '-0.5px' }}>Kawach</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span onClick={() => scrollToSection('hero')} style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', cursor: 'pointer', transition: 'color 200ms' }} className="hover:text-white">Home</span>
          <span onClick={() => scrollToSection('features')} style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', cursor: 'pointer', transition: 'color 200ms' }} className="hover:text-white">Features</span>
          <span onClick={() => scrollToSection('how-it-works')} style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', cursor: 'pointer', transition: 'color 200ms' }} className="hover:text-white">How It Works</span>
          <span onClick={() => navigate('/app/architecture')} style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', cursor: 'pointer', transition: 'color 200ms' }} className="hover:text-white">Architecture</span>
          <span onClick={() => setShowAuthModal(true)} style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', cursor: 'pointer', transition: 'color 200ms' }} className="hover:text-white">Live Demo</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', transition: 'background-color 200ms'
            }}
            className="hover:bg-white/10"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: '#3B6FF0', color: 'white', border: 'none',
              borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 0 16px rgba(59,111,240,0.4)', transition: 'background-color 200ms'
            }}
            className="hover:bg-blue-600"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 80px 40px 80px', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', width: '100%', gap: '40px', alignItems: 'center' }}>
          
          {/* Left Column Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '99px',
              backgroundColor: 'rgba(59,111,240,0.15)', border: '1px solid rgba(59,111,240,0.3)',
              color: '#93C5FD', fontSize: '12px', fontWeight: 600, fontFamily: 'Sora, sans-serif'
            }}>
              <Shield size={12} />
              AI-Powered Safety Intelligence
            </div>

            <h1 style={{
              fontFamily: 'Sora, sans-serif', fontSize: '56px', fontWeight: 700,
              lineHeight: 1.15, color: '#F9FAFB', margin: 0
            }}>
              Zero Harm.<br />
              Real-Time.<br />
              AI-Powered.
            </h1>

            <p style={{
              fontSize: '18px', color: '#94A3B8', lineHeight: 1.6,
              maxWidth: '480px', margin: 0
            }}>
              Kawach fuses gas sensors, CCTV feeds, work permits, and maintenance logs into one AI brain that detects compound risk before it becomes catastrophe — the intelligence layer that Vizag Steel Plant was missing.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: '#3B6FF0', color: 'white', border: 'none',
                  borderRadius: '12px', height: '48px', padding: '0 28px',
                  fontSize: '16px', fontWeight: 600, fontFamily: 'Sora, sans-serif',
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,111,240,0.4)',
                  transition: 'all 0.2s'
                }}
                className="hover:scale-[1.02]"
              >
                Launch Safety Command →
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                style={{
                  background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', height: '48px', padding: '0 24px',
                  fontSize: '15px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
                }}
                className="hover:bg-white/5 hover:text-white"
              >
                See How It Works ↓
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚡ 1-second risk updates
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🧠 6 compound AI rules
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                📋 OISD-standard reports
              </span>
            </div>

            {/* CHANGE 5: Incident stat ticker marquee strip */}
            <div style={{
              width: '100%', overflow: 'hidden', whiteSpace: 'nowrap',
              borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '8px'
            }}>
              <div style={{
                display: 'inline-block',
                animation: 'marquee 40s linear infinite',
                fontSize: '12px', color: '#525E71', fontWeight: 500
              }}>
                <span>⚡ Vizag Steel Plant — 8 workers lost, Jan 2025&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;6,500+ fatal workplace accidents in India FY2023 (DGFASLI)&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;60% of Indian plants rely on manual safety handoffs&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;Kawach detects compound risk 8+ minutes before threshold&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;OISD-116 compliance built in · Real-time, not retrospective&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>⚡ Vizag Steel Plant — 8 workers lost, Jan 2025&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;6,500+ fatal workplace accidents in India FY2023 (DGFASLI)&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;60% of Indian plants rely on manual safety handoffs&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;Kawach detects compound risk 8+ minutes before threshold&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;OISD-116 compliance built in · Real-time, not retrospective&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
            </div>
          </div>

          {/* Right Column Isometric Plant Scene SVG */}
          <div style={{
            display: 'flex', justifyContent: 'center', position: 'relative',
            animation: 'floatScene 4s ease-in-out infinite'
          }}>
            <svg width="460" height="380" viewBox="0 0 460 380" style={{ pointerEvents: 'none' }}>
              {/* Grid Platform Base */}
              <polygon points="230,120 420,200 230,280 40,200" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
              
              {/* Isometric grid lines */}
              <line x1="135" y1="160" x2="325" y2="240" stroke="#1E293B" strokeWidth="1" />
              <line x1="230" y1="120" x2="230" y2="280" stroke="#1E293B" strokeWidth="1" />
              <line x1="325" y1="160" x2="135" y2="240" stroke="#1E293B" strokeWidth="1" />

              {/* Zone 1: Boiler Room (Safe - Green glow) */}
              <g transform="translate(100, 140)">
                <polygon points="0,-15 40,5 0,25 -40,5" fill="#1E293B" stroke="#16A34A" strokeWidth="1.5" />
                <polygon points="-40,5 0,25 0,45 -40,25" fill="#111827" stroke="#16A34A" strokeWidth="0.5" />
                <polygon points="40,5 0,25 0,45 40,25" fill="#1F2937" stroke="#16A34A" strokeWidth="0.5" />
                {/* Labeled text */}
                <text x="0" y="8" fill="#86EFAC" fontSize="8" fontWeight="bold" textAnchor="middle" transform="skewY(10)">Boiler Room</text>
                {/* Mini safe arc gauge */}
                <path d="M -15, -2 A 15,15 0 0,1 15,-2" fill="none" stroke="#16A34A" strokeWidth="3" />
              </g>

              {/* Zone 3: Gas Pipeline (Safe - Green glow) */}
              <g transform="translate(320, 160)">
                <polygon points="0,-15 40,5 0,25 -40,5" fill="#1E293B" stroke="#16A34A" strokeWidth="1.5" />
                <polygon points="-40,5 0,25 0,45 -40,25" fill="#111827" stroke="#16A34A" strokeWidth="0.5" />
                <polygon points="40,5 0,25 0,45 40,25" fill="#1F2937" stroke="#16A34A" strokeWidth="0.5" />
                <text x="0" y="8" fill="#86EFAC" fontSize="8" fontWeight="bold" textAnchor="middle" transform="skewY(10)">Gas Pipeline</text>
                <path d="M -15, -2 A 15,15 0 0,1 15,-2" fill="none" stroke="#16A34A" strokeWidth="3" />
              </g>

              {/* Zone 2: Coke Oven Battery (Critical - Red glowing block + pulsing rings) */}
              <g transform="translate(210, 210)">
                {/* Pulsing ring */}
                <circle cx="0" cy="10" r="25" fill="none" stroke="#DC2626" strokeWidth="1.5" style={{ animation: 'dangerPulse 2s infinite' }} />
                
                <polygon points="0,-20 48,5 0,30 -48,5" fill="rgba(220,38,38,0.15)" stroke="#DC2626" strokeWidth="2" />
                <polygon points="-48,5 0,30 0,55 -48,30" fill="#111827" stroke="#DC2626" strokeWidth="1" />
                <polygon points="48,5 0,30 0,55 48,30" fill="#1F2937" stroke="#DC2626" strokeWidth="1" />
                <text x="0" y="10" fill="#FCA5A5" fontSize="9" fontWeight="extrabold" textAnchor="middle" transform="skewY(10)">Coke Oven</text>
                
                {/* Mini sensor arc warning dial */}
                <path d="M -20, -5 A 20,20 0 0,1 20,-5" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <path d="M 5,-12 A 20,20 0 0,1 20,-5" fill="none" stroke="#DC2626" strokeWidth="3.5" />
                
                {/* SVG worker figure */}
                <g transform="translate(-15, 12)">
                  <circle cx="0" cy="-6" r="3" fill="#D97706" />
                  <path d="M -3,0 L 3,0 L 4,10 L -4,10 Z" fill="#D97706" />
                </g>
                <g transform="translate(15, 15)">
                  <circle cx="0" cy="-6" r="3" fill="#D97706" />
                  <path d="M -3,0 L 3,0 L 4,10 L -4,10 Z" fill="#D97706" />
                </g>
              </g>

              {/* Data Flow paths linking sensors, central AI brain, and alert */}
              {/* Path 1: Sensor node on Pipeline to Brain */}
              <path d="M 330 180 Q 280 120, 230 80" fill="none" stroke="#3B6FF0" strokeWidth="2.5" strokeDasharray="6 6" style={{ animation: 'flowDots 1.5s linear infinite' }} />
              {/* Path 2: Brain to Alert center */}
              <path d="M 230 80 Q 210 160, 210 190" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="6 6" style={{ animation: 'flowDots 1.5s linear infinite' }} />

              {/* Central AI Brain Node */}
              <g transform="translate(230, 80)">
                <circle cx="0" cy="0" r="16" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.6))' }} />
                <path d="M -5,-3 L 5,-3 L 3,5 L -3,5 Z" fill="#FFFFFF" />
                <circle cx="0" cy="5" r="2" fill="#FFFFFF" />
                <text x="0" y="-20" fill="#F5F3FF" fontSize="8" fontWeight="bold" textAnchor="middle">AI BRAIN</text>
              </g>

              {/* Floating Alert Card */}
              <g transform="translate(225, 230)">
                {/* Card Background Shadow */}
                <rect x="-80" y="-120" width="165" height="54" rx="10" fill="#FFFFFF" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))" />
                {/* Red Left border decoration */}
                <rect x="-80" y="-120" width="4" height="54" rx="2" fill="#DC2626" />
                
                {/* Text Content */}
                <text x="-70" y="-106" fill="#DC2626" fontSize="9" fontWeight="bold">⚠ CRITICAL — Coke Oven Battery</text>
                <text x="-70" y="-92" fill="#111827" fontSize="8" fontWeight="bold">Risk Score: 96%</text>
                <text x="-70" y="-80" fill="#4B5563" fontSize="8">Gas: 82ppm | Hot Work Active</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS TICKER */}
      <section ref={statsRef} style={{
        padding: '60px 40px', backgroundColor: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', position: 'relative' }}>
          {[
            { value: 6500, suffix: '+', label: 'Fatal workplace accidents in India FY2023', source: 'DGFASLI' },
            { value: 8, suffix: ' Workers', label: 'Lost at Vizag Steel Plant, Jan 2025', source: 'Official Report' },
            { value: 30, prefix: '<', suffix: ' min', label: 'Kawach AI prediction lead time', source: 'Simulation' },
            { value: 6, suffix: ' AI Engines', label: 'Working in parallel, fused in real-time', source: 'Agent Architecture' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              borderRight: idx < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingRight: '20px'
            }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '44px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                {statsInView ? (
                  <AnimatedNumber
                    value={stat.value}
                    decimals={0}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                ) : (
                  '0'
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500, lineHeight: 1.4, maxWidth: '200px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '6px' }}>
                Source: {stat.source}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '100px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '12px', color: '#3B6FF0', fontWeight: 600, fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>THE PROBLEM</div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '40px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px 0' }}>Data existed. Intelligence didn't.</h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            At Vizag, every sensor worked. SCADA functioned. Permits were logged. But nobody connected rising gas + active welding + worker presence into one risk picture. Kawach does.
          </p>
        </div>

        {/* 3-Step visual flow */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1.1fr auto 1fr', alignItems: 'center', gap: '20px' }}>
          
          {/* Step 1 */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ fontSize: '12px', color: '#3B6FF0', fontWeight: 600 }}>STEP 01 — ISOLATED METRICS</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Individual sensors normal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: 'rgba(22,163,74,0.1)', color: '#86EFAC', borderRadius: '8px', fontSize: '12px' }}>
                <span>Gas: 36ppm</span>
                <span>Normal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: 'rgba(22,163,74,0.1)', color: '#86EFAC', borderRadius: '8px', fontSize: '12px' }}>
                <span>Temp: 440°C</span>
                <span>Normal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: 'rgba(22,163,74,0.1)', color: '#86EFAC', borderRadius: '8px', fontSize: '12px' }}>
                <span>Permit: Hot Work</span>
                <span>Active</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 600 }}>❌ Traditional system: No alarm</div>
          </div>

          {/* Arrow 1 */}
          <div style={{ fontSize: '24px', color: '#3B6FF0' }}>→</div>

          {/* Step 2 */}
          <div style={{
            backgroundColor: 'rgba(59,111,240,0.05)', border: '1px solid rgba(59,111,240,0.3)',
            borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px',
            transform: 'scale(1.05)', boxShadow: '0 0 30px rgba(59,111,240,0.15)'
          }}>
            <div style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600 }}>STEP 02 — COGNITIVE FUSION</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Kawach connects the dots</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', position: 'relative' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#7C3AED',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                fontWeight: 800, color: 'white', animation: 'pulseGlow 2s infinite'
              }}>
                96%
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#F9FAFB', textAlign: 'center', fontWeight: 500 }}>
              🧠 Compound risk evaluated: <span style={{ color: '#EF4444' }}>CRITICAL</span>
            </div>
          </div>

          {/* Arrow 2 */}
          <div style={{ fontSize: '24px', color: '#7C3AED' }}>→</div>

          {/* Step 3 */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>STEP 03 — AUTONOMOUS ACTION</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Action — before catastrophe</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#F3F4F6' }}>
                <span style={{ color: '#10B981' }}>✓</span> <span>Permit suspended</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#F3F4F6' }}>
                <span style={{ color: '#10B981' }}>✓</span> <span>Officer alerted via SMS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#F3F4F6' }}>
                <span style={{ color: '#10B981' }}>✓</span> <span>Automatic evacuation route</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>✅ Incident Prevented Successfully</div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SIX FEATURES */}
      <section id="features" style={{ padding: '100px 80px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ fontSize: '12px', color: '#3B6FF0', fontWeight: 600, fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>WHAT KAWACH DOES</div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '36px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Six systems. One safety brain.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                title: '🗺️ Live Zone Risk Map',
                desc: '6 plant zones monitored in real-time. Color-coded risk propagates through the zone graph when an incident occurs.'
              },
              {
                title: '🧠 Compound Risk Engine',
                desc: '6 AI rules detect dangerous combinations — gas + permit + workers — that no single sensor would flag alone.'
              },
              {
                title: '📋 Smart Permit Watcher',
                desc: 'Cross-references active work permits against live gas, temperature, and pressure readings. Flags dangerous permit conflicts before workers enter.'
              },
              {
                title: '📡 Geospatial Risk Propagation',
                desc: "When one zone becomes critical, neighboring zones automatically elevate to HIGH — because in industrial plants, danger doesn't respect boundaries."
              },
              {
                title: '🔮 AI Prediction Engine',
                desc: "Forward-looking predictions: 'Critical gas concentration expected within 1 minute, 96% confidence.' Time to act, not just react."
              },
              {
                title: '📄 Regulatory-Grade Reports',
                desc: 'Auto-generated incident reports referencing OISD/OSHA standards — structured for regulatory submission, generated in seconds.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px', padding: '32px', transition: 'all 0.3s ease'
                }}
                className="hover:border-blue-500/40 hover:bg-blue-50/5 hover:-translate-y-1"
              >
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px', marginTop: 0 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE DEMO TEASER */}
      <section id="live-demo" style={{ padding: '100px 80px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', backgroundColor: 'rgba(59,111,240,0.03)',
          border: '1px solid rgba(59,111,240,0.2)', borderRadius: '24px', padding: '60px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          boxShadow: '0 0 40px rgba(59,111,240,0.1)'
        }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '32px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px 0' }}>
            See Kawach in action
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '600px', margin: '0 0 40px 0', lineHeight: 1.6 }}>
            Watch the risk score climb from 12% to 96% as gas rises, a hot-work permit activates, and a worker enters the zone — in real time.
          </p>

          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: '#3B6FF0', color: 'white', border: 'none',
              borderRadius: '16px', height: '56px', padding: '0 40px',
              fontSize: '18px', fontWeight: 700, fontFamily: 'Sora, sans-serif',
              cursor: 'pointer', boxShadow: '0 6px 24px rgba(59,111,240,0.4)',
              transition: 'transform 0.2s'
            }}
            className="hover:scale-105"
          >
            Launch Safety Command →
          </button>
          
          <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '16px' }}>
            No setup required. Live simulation running.
          </span>
        </div>
      </section>

      {/* CHANGE 3: FOOTER (complete replacement) */}
      <footer style={{
        padding: '64px 0 32px 0', borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: '#0A0F1E', zIndex: 10, position: 'relative'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '48px', padding: '0 20px' }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={22} color="#3B6FF0" />
              <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Sora, sans-serif', color: '#FFFFFF' }}>Kawach</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>AI Safety Intelligence Platform</div>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, maxWidth: '280px', margin: 0 }}>
              Preventing industrial accidents through compound risk intelligence — the layer that Vizag was missing.
            </p>
            {/* Visual Social chips */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {['GitHub', 'Documentation', 'API'].map((link) => (
                <span key={link} style={{ fontSize: '12px', color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }} className="hover:text-white hover:border-white/20">
                  {link}
                </span>
              ))}
            </div>
          </div>

          {/* CENTER COLUMN — PRODUCT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PRODUCT</div>
            <span onClick={() => scrollToSection('features')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Features</span>
            <span onClick={() => scrollToSection('how-it-works')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">How It Works</span>
            <span onClick={() => navigate('/app/architecture')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Architecture</span>
            <span onClick={() => navigate('/app/copilot')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Safety Copilot</span>
            <span onClick={() => setShowAuthModal(true)} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Live Demo</span>
          </div>

          {/* RIGHT COLUMN — PLATFORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PLATFORM</div>
            <span onClick={() => navigate('/app/dashboard')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Dashboard</span>
            <span onClick={() => navigate('/app/reports')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Incident Reports</span>
            <span onClick={() => navigate('/app/alerts')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Alert History</span>
            <span onClick={() => navigate('/app/console')} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Control Console</span>
            <span onClick={() => setShowAuthModal(true)} style={{ fontSize: '14px', color: '#94A3B8', cursor: 'pointer' }} className="hover:text-white">Sign In</span>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div style={{
          maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '24px 20px 0 20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4B5563'
        }}>
          <span>&copy; 2026 Kawach. AI Industrial Safety Intelligence.</span>
          <span>Powered by Gemini AI · OISD Standards · OSHA · PNGRB</span>
        </div>
      </footer>

      {/* AUTH MODAL OVERLAY */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                width: '100%', maxWidth: '440px', backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative', color: '#111827'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  position: 'absolute', top: '20px', right: '20px', background: 'transparent',
                  border: 'none', cursor: 'pointer', color: '#6B7280'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Shield size={28} color="#3B6FF0" />
                </div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Kawach</h3>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Safety Intelligence Platform</span>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Officer ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your ID"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    style={{
                      height: '44px', borderRadius: '10px', border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB', padding: '0 16px', fontSize: '14px',
                      color: '#111827', outline: 'none', transition: 'border-color 0.2s'
                    }}
                    className="focus:border-blue-500"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      height: '44px', borderRadius: '10px', border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB', padding: '0 16px', fontSize: '14px',
                      color: '#111827', outline: 'none', transition: 'border-color 0.2s'
                    }}
                    className="focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    height: '48px', borderRadius: '10px', backgroundColor: '#3B6FF0',
                    color: 'white', border: 'none', fontSize: '15px', fontWeight: 600,
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,111,240,0.2)',
                    marginTop: '8px'
                  }}
                >
                  Sign In
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  onClick={() => navigate('/app/dashboard')}
                  style={{ fontSize: '14px', fontWeight: 600, color: '#3B6FF0', cursor: 'pointer' }}
                  className="hover:underline"
                >
                  Skip to Live Demo →
                </span>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '16px' }}>
                  For demonstration purposes only
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
