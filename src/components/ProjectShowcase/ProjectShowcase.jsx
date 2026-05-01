import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = ['#5227FF', '#FF33CC', '#00D4FF', '#FFB800'];
const BG     = ['#0a0a0f',  '#0d0a20',  '#080d20',  '#150a20'];

export default function ProjectShowcase({ projects }) {
  const sectionRef  = useRef(null);
  const panelsRef   = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  /* ─────────────────────────────────────────────────────────────
     Single pinned ScrollTrigger.
     progress 0→1 maps linearly to panel 0→(n-1).
     We use onUpdate to set the active index and directly drive
     each panel's opacity / transform via gsap.set() — zero GC,
     zero timeline complexity, butter-smooth.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const section  = sectionRef.current;
    const panels   = panelsRef.current;
    const n        = projects.length;
    if (!section || panels.length === 0) return;

    // Initial state: first panel visible, rest hidden
    panels.forEach((p, i) => {
      gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 50, scale: i === 0 ? 1 : 0.96 });
    });

    // Animate in elements of the first panel immediately
    animatePanelIn(panels[0]);

    const st = ScrollTrigger.create({
      trigger: section,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: () => `+=${(n - 1) * 100}vh`,
      scrub: false,          // ← NOT scrubbed; we update on scroll ourselves
      onUpdate(self) {
        // Raw progress 0 → 1
        const raw   = self.progress * (n - 1);
        const floor = Math.min(Math.floor(raw), n - 1);
        const frac  = raw - floor;        // 0 → 1 within current step

        setActiveIdx(floor);

        panels.forEach((panel, i) => {
          if (i === floor) {
            // Fading OUT toward next — only when near the transition (frac > 0.6)
            const exitOpacity = frac > 0.6 ? gsap.utils.mapRange(0.6, 1, 1, 0, frac) : 1;
            const exitY       = frac > 0.6 ? gsap.utils.mapRange(0.6, 1, 0, -30, frac) : 0;
            gsap.set(panel, { opacity: exitOpacity, y: exitY, scale: 1 });
          } else if (i === floor + 1 && floor < n - 1) {
            // Next panel fading IN — only appear after frac > 0.5
            const enterOpacity = frac > 0.5 ? gsap.utils.mapRange(0.5, 1, 0, 1, frac) : 0;
            const enterY       = frac > 0.5 ? gsap.utils.mapRange(0.5, 1, 40, 0, frac) : 40;
            const enterScale   = frac > 0.5 ? gsap.utils.mapRange(0.5, 1, 0.96, 1, frac) : 0.96;
            gsap.set(panel, { opacity: enterOpacity, y: enterY, scale: enterScale });

            // Trigger text animation when panel first appears
            if (frac > 0.55 && !panel.dataset.animated) {
              panel.dataset.animated = '1';
              animatePanelIn(panel);
            }
          } else {
            // Completely off-screen
            gsap.set(panel, {
              opacity: i < floor ? 0 : 0,
              y:       i < floor ? -30 : 40,
              scale:   0.96,
            });
          }
        });
      },
      // Reset animation flags when scrolling back
      onLeaveBack() {
        panels.forEach(p => { delete p.dataset.animated; });
        panels.forEach((p, i) => {
          gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 50, scale: i === 0 ? 1 : 0.96 });
        });
        animatePanelIn(panels[0]);
        setActiveIdx(0);
      },
    });

    return () => st.kill();
  }, [projects]);

  /* ── Reset animation markers on scroll back ── */
  useEffect(() => {
    return () => {
      panelsRef.current.forEach(p => { if (p) delete p.dataset.animated; });
    };
  }, []);

  return (
    <section className="ps-section" id="projects" ref={sectionRef}>
      {/* Morphing background */}
      <div
        className="ps-bg-layer"
        style={{ background: BG[activeIdx] }}
      />
      {/* Ambient glow per project */}
      <div
        className="ps-ambient"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 72% 50%, ${ACCENT[activeIdx]}1e, transparent 70%)`,
        }}
      />
      {/* Grain overlay */}
      <div className="ps-grain" />

      {/* ── Top bar ── */}
      <div className="ps-topbar">
        <span className="ps-section-label">Selected Works</span>
        <div className="ps-counter">
          <span className="ps-counter-current" key={activeIdx}>0{activeIdx + 1}</span>
          <span className="ps-counter-sep">/</span>
          <span className="ps-counter-total">0{projects.length}</span>
        </div>
      </div>

      {/* ── Panels ── */}
      <div className="ps-track">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="ps-panel"
            ref={el => { panelsRef.current[i] = el; }}
          >
            {/* Left: content */}
            <div className="ps-content">
              <div className="ps-label ps-el">{p.year}</div>

              <div
                className="ps-num"
                style={{ color: `${ACCENT[i % ACCENT.length]}1a` }}
              >
                0{i + 1}
              </div>

              <h2
                className="ps-title ps-el"
                style={{ '--accent': ACCENT[i % ACCENT.length] }}
              >
                {p.name}
              </h2>

              <p className="ps-desc ps-el">{p.description}</p>

              <div className="ps-tags">
                {p.tech.map((t, j) => (
                  <span
                    key={j}
                    className="ps-tag ps-el"
                    style={{
                      borderColor: `${ACCENT[i % ACCENT.length]}44`,
                      color: ACCENT[i % ACCENT.length] + 'cc',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button
                className="ps-cta ps-el"
                style={{ '--accent': ACCENT[i % ACCENT.length] }}
                data-cursor-hover
              >
                <span>View Project</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Right: visual card */}
            <div className="ps-visual">
              <div
                className="ps-visual-card"
                style={{ '--accent': ACCENT[i % ACCENT.length], '--color': p.color || '#1a0a3e' }}
              >
                <div className="ps-grid-lines" />
                <div
                  className="ps-orb"
                  style={{
                    background: `radial-gradient(circle, ${ACCENT[i % ACCENT.length]}55 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="ps-visual-accent"
                  style={{ background: `linear-gradient(90deg, ${ACCENT[i % ACCENT.length]}, transparent)` }}
                />
                <div className="ps-visual-num">0{i + 1}</div>
                <div className="ps-highlights">
                  {p.highlights?.map((h, j) => (
                    <div key={j} className="ps-highlight-row" style={{ animationDelay: `${j * 0.08}s` }}>
                      <span
                        className="ps-highlight-dot"
                        style={{ background: ACCENT[i % ACCENT.length] }}
                      />
                      <span className="ps-highlight-text">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress bar + dots ── */}
      <div className="ps-progress">
        <div className="ps-bar">
          <div
            className="ps-bar-fill"
            style={{
              background: `linear-gradient(90deg, ${ACCENT[activeIdx]}, ${ACCENT[(activeIdx + 1) % ACCENT.length]})`,
              transform: `scaleX(${(activeIdx + 1) / projects.length})`,
              transformOrigin: 'left',
              transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), background 0.6s ease',
            }}
          />
        </div>
        <div className="ps-dots">
          {projects.map((_, i) => (
            <div
              key={i}
              className={`ps-dot ${i === activeIdx ? 'ps-dot-active' : ''}`}
              style={i === activeIdx ? { background: ACCENT[i % ACCENT.length] } : {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animate panel's .ps-el children in with stagger
   Called once per panel when it first enters
───────────────────────────────────────────────────────────── */
function animatePanelIn(panel) {
  if (!panel) return;
  const els = panel.querySelectorAll('.ps-el');
  if (!els.length) return;
  gsap.fromTo(
    els,
    { opacity: 0, y: 30, filter: 'blur(4px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.65,
      stagger: 0.07,
      ease: 'power3.out',
    }
  );
}
