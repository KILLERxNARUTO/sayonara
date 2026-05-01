import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ThreeScene from './components/ThreeScene/ThreeScene';
import AntigravityCursor from './components/AntigravityCursor/AntigravityCursor';
import Loader from './components/Loader/Loader';
import Nav from './components/Nav/Nav';
import ProjectShowcase from './components/ProjectShowcase/ProjectShowcase';
import ContactForm from './components/ContactForm/ContactForm';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    icon: '🧠',
    title: 'AI Automation',
    desc: 'Stop managing workflows — start orchestrating them. AI-driven solutions that optimize supply chains and customer loops in real-time.',
    tech: ['Neural Networks', 'NLP Agents', 'Predictive Analytics'],
  },
  {
    num: '02',
    icon: '⚡',
    title: 'Web Ecosystems',
    desc: 'High-performance interfaces that feel alive. Seamlessly integrated, visually stunning, and compatible with every device.',
    tech: ['React / Next.js', 'WebGL', 'Cloud Native'],
  },
  {
    num: '03',
    icon: '📱',
    title: 'Mobile Apps',
    desc: 'Cross-platform experiences with native performance. Gesture-driven, offline-first, and built for scale.',
    tech: ['React Native', 'Flutter', 'Swift'],
  },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const mainRef = useRef(null);

  const handleLoadComplete = useCallback(() => setLoaded(true), []);
  const handleOpenContactForm = useCallback(() => setShowContactForm(true), []);
  const handleCloseContactForm = useCallback(() => setShowContactForm(false), []);

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    if (!loaded) return;

    // Slightly higher lerp = more responsive but still silky
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.85 });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => { gsap.ticker.remove(raf); lenis.destroy(); };
  }, [loaded]);

  /* ── GSAP animations ── */
  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {

      /* ════════════════════════════════════════════
         HERO ─ Cinematic entrance
         Long, weighted reveal with blur + distance.
         Sequential timing: badge → title → subtitle → indicator
         Each element gets its own breathing room.
      ════════════════════════════════════════════ */

      // Badge — slides in first, sets the stage
      gsap.fromTo('.hero-badge',
        { opacity: 0, y: 32, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, delay: 0.5, ease: 'expo.out' }
      );

      // Title — the hero element: large blur, long travel, slow curve
      // This is the cinematic "rise from nothing" moment
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 100, filter: 'blur(24px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 3.0, delay: 0.9, ease: 'expo.out' }
      );

      // Subtitle — follows title with breathing space
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 50, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.2, delay: 1.8, ease: 'expo.out' }
      );

      // Scroll indicator — last to appear, quietly
      gsap.fromTo('.scroll-indicator',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.6, delay: 2.6, ease: 'power3.out' }
      );

      /* ── Hero parallax exit — CRITICAL FIX ──
         Use fromTo with EXPLICIT from: { opacity: 1 } so that
         at scroll progress = 0 (user scrolls back to top),
         GSAP always restores to opacity:1 — not the CSS opacity:0
         that gsap.to() would have captured as its implicit from-state.
         
         Only animate opacity (no y), avoiding any conflict
         with the entrance tween's y animation.
      ── */
      const heroFade = (sel, opStart, opEnd, startPct, endPct, scrub) =>
        gsap.fromTo(sel,
          { opacity: opStart },
          {
            opacity: opEnd,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: `${startPct}% top`,
              end: endPct,
              scrub,
            },
          }
        );

      // Title fades last (starts dissolving only at 35% scroll)
      heroFade('.hero-title',    1, 0, 35, 'bottom top', 2.5);
      // Subtitle starts fading a bit earlier
      heroFade('.hero-subtitle', 1, 0, 22, '85% top',    2.0);
      // Badge fades earliest and fastest
      heroFade('.hero-badge',    1, 0, 15, '70% top',    1.5);

      /* ════════════════════════════════════════════
         MARQUEE ─ scroll-driven drift
      ════════════════════════════════════════════ */
      gsap.to('.marquee-inner', {
        scrollTrigger: { trigger: '.marquee-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        x: '-40%', ease: 'none',
      });

      /* ════════════════════════════════════════════
         SERVICES ─ new editorial layout
         ① Giant background word fades in
         ② Heading lines slide up sequentially
         ③ Each service row: number + line extend + body slide in
      ════════════════════════════════════════════ */

      // Background ghost word
      gsap.fromTo('.services-ghost',
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 2.2, ease: 'expo.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 75%' },
        }
      );

      // "WHAT WE DO" label
      gsap.fromTo('.services-eyebrow',
        { opacity: 0, x: -30, filter: 'blur(6px)' },
        {
          opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 72%' },
        }
      );

      // Big heading lines — each line slides up from behind overflow:hidden
      const headLines = gsap.utils.toArray('.services-h-line');
      headLines.forEach((line, i) => {
        gsap.fromTo(line,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.5,
            delay: i * 0.18,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.services-section', start: 'top 68%' },
          }
        );
      });

      // Service rows
      gsap.utils.toArray('.service-row').forEach((row, i) => {
        // The whole row slides up
        gsap.fromTo(row,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 1.2,
            delay: i * 0.14,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.services-list', start: 'top 78%' },
          }
        );
        // The horizontal line extends
        const divider = row.querySelector('.sr-line-fill');
        if (divider) {
          gsap.fromTo(divider,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              delay: i * 0.14 + 0.2,
              ease: 'expo.out',
              transformOrigin: 'left',
              scrollTrigger: { trigger: '.services-list', start: 'top 78%' },
            }
          );
        }
      });

      /* ════════════════════════════════════════════
         CTA
      ════════════════════════════════════════════ */
      gsap.fromTo('.cta-title',
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8, ease: 'expo.out',
          scrollTrigger: { trigger: '.cta-title', start: 'top 80%' },
        }
      );
      gsap.fromTo('.cta-subtitle',
        { opacity: 0, y: 30, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: '.cta-subtitle', start: 'top 82%' },
        }
      );
      gsap.fromTo('.cta-btn',
        { opacity: 0, scale: 0.88, y: 20 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: '.cta-btn', start: 'top 85%' },
        }
      );

    }, mainRef);

    return () => ctx.revert();
  }, [loaded]);

  const projects = [
    {
      id: 1, name: 'META MENTOR', year: '2025–26', color: '#1a0a3e',
      description: 'An intelligent AI platform bridging academic success and personal well-being. A 24/7 companion for personalized study guidance and mental health support.',
      tech: ['AI/ML', 'NLP', 'React Native', 'Python'],
      highlights: ['24/7 AI-powered study companion', 'Mood tracking & mental health insights', 'Personalized learning paths', 'Cross-platform mobile app'],
    },
    {
      id: 2, name: 'Voice Auth', year: '2025', color: '#0a1a3e',
      description: 'An intelligent voice-based security system that verifies user identity through unique vocal patterns, enabling fast, hands-free, and reliable authentication.',
      tech: ['AI/ML', 'Python', 'MongoDB'],
      highlights: ['AI-powered voice authentication', 'Real-time voice detection', 'Voice Pay integration', 'Banking systems'],
    },
    {
      id: 3, name: 'Go Bill!', year: '2026', color: '#1e0a2e',
      description: 'A streamlined digital billing platform that automates transaction logging and invoice generation, providing small businesses with a fast, error-free way to manage daily sales.',
      tech: ['Python', 'MongoDB', 'JavaScript'],
      highlights: ['Smart billing software', 'Instant invoice generator', 'Sales automation', 'Real-time reporting'],
    },
    {
      id: 4, name: 'Echo', year: '2026', color: '#0a1e3e',
      description: 'A real-time AI interpreter that bridges communication gaps by translating sign language gestures into text or speech, fostering seamless and inclusive daily interactions.',
      tech: ['Angular', 'TensorFlow', 'AWS'],
      highlights: ['Computer vision pipeline', 'AI/ML gesture detection', 'Real-time translation', 'Inclusive accessibility'],
    },
  ];

  return (
    <>
      {!loaded && <Loader onComplete={handleLoadComplete} />}
      <AntigravityCursor />
      <ThreeScene />
      <Nav />

      <div className="site-wrapper" ref={mainRef}>

        {/* ── Hero ── */}
        <section className="hero-section section" id="home">
          <div className="hero-badge">AI Automation · Web · App</div>
          <h1 className="hero-title">
            Sayonara<span className="accent-dot">.</span>
          </h1>
          <p className="hero-subtitle">
            The future isn't written — it's coded. We build autonomous systems
            and fluid web experiences that adapt to your business velocity.
          </p>
          <div className="scroll-indicator">
            <div className="scroll-line" />
            <span>Scroll to explore</span>
          </div>
        </section>

        {/* ── Marquee ── */}
        <div className="marquee-section">
          <div className="marquee-inner">
            {['AI Automation','·','Web Ecosystems','·','Mobile Apps','·',
              'Voice Auth','·','Intelligent Systems','·','AI Automation','·',
              'Web Ecosystems','·','Mobile Apps','·','Voice Auth','·',
            ].map((w, i) => (
              <span key={i} className={`marquee-word ${w === '·' ? 'marquee-dot' : ''}`}>{w}</span>
            ))}
          </div>
        </div>

        {/* ── Services ── */}
        <section className="section services-section" id="services">

          {/* Decorative ghost word */}
          <span className="services-ghost" aria-hidden="true">INTELLIGENCE</span>

          <div className="section-inner">

            {/* Top bar: eyebrow label + large heading side by side */}
            <div className="services-top">

              <div className="services-eyebrow-col">
                <span className="services-eyebrow">What We Do</span>
                <div className="services-eyebrow-line" />
              </div>

              <div className="services-heading-col">
                <div className="services-h-wrap"><span className="services-h-line">Intelligent</span></div>
                <div className="services-h-wrap"><span className="services-h-line services-h-accent">Solutions<span className="accent-dot">.</span></span></div>
              </div>

            </div>

            {/* Numbered service rows */}
            <div className="services-list">
              {SERVICES.map((s) => (
                <div className="service-row" key={s.num} data-cursor-hover>
                  <span className="sr-num">{s.num}</span>
                  <div className="sr-line"><div className="sr-line-fill" /></div>
                  <div className="sr-body">
                    <div className="sr-icon-title">
                      <span className="sr-icon">{s.icon}</span>
                      <h3 className="sr-title">{s.title}</h3>
                    </div>
                    <p className="sr-desc">{s.desc}</p>
                    <div className="sr-pills">
                      {s.tech.map((t) => <span className="pill" key={t}>{t}</span>)}
                    </div>
                  </div>
                  <div className="sr-arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Projects ── */}
        <ProjectShowcase projects={projects} />

        {/* ── CTA ── */}
        <section className="section cta-section" id="contact">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="cta-title">Ready to Evolve?</h2>
            <p className="cta-subtitle">
              Say "Sayonara" to legacy systems. Let's build something extraordinary together.
            </p>
            <button onClick={handleOpenContactForm} className="cta-btn" data-cursor-hover>
              Start Your Project
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
          <span>© 2025 Sayonara. All rights reserved.</span>
          <div className="footer-links">
            <a href="https://x.com/SyedThufel42748" target="_blank" rel="noopener noreferrer" data-cursor-hover>Twitter</a>
            <a href="https://www.linkedin.com/in/syedthufelsyedwahid" target="_blank" rel="noopener noreferrer" data-cursor-hover>LinkedIn</a>
            <a href="https://github.com/KILLERxNARUTO" target="_blank" rel="noopener noreferrer" data-cursor-hover>GitHub</a>
          </div>
        </footer>

      </div>

      {showContactForm && <ContactForm onClose={handleCloseContactForm} />}
    </>
  );
}