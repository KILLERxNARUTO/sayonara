import React from 'react';

export default function Nav() {
    return (
        <nav style={styles.nav}>
            {/* Logo — top left */}
            <a href="/" style={styles.logo}>
                <span style={styles.logoText}>S</span>
                <span style={styles.logoDot}>.</span>
            </a>

            {/* Contact button — top right with corner brackets */}
            <a href="#contact" style={styles.contactBtn} data-cursor-hover>
                {/* Corner brackets */}
                <span style={{ ...styles.corner, top: 0, left: 0, borderTop: '2px solid rgba(255,255,255,0.5)', borderLeft: '2px solid rgba(255,255,255,0.5)', borderRadius: '10px 0 0 0' }} />
                <span style={{ ...styles.corner, top: 0, right: 0, borderTop: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)', borderRadius: '0 10px 0 0' }} />
                <span style={{ ...styles.corner, bottom: 0, left: 0, borderBottom: '2px solid rgba(255,255,255,0.5)', borderLeft: '2px solid rgba(255,255,255,0.5)', borderRadius: '0 0 0 10px' }} />
                <span style={{ ...styles.corner, bottom: 0, right: 0, borderBottom: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)', borderRadius: '0 0 10px 0' }} />
                <span style={styles.contactText}>Contact</span>
            </a>
        </nav>
    );
}

const styles = {
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: 'clamp(20px, 4vw, 40px) clamp(12px, 4vw, 50px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 500,
        pointerEvents: 'none',
        boxSizing: 'border-box',
    },
    logo: {
        textDecoration: 'none',
        pointerEvents: 'auto',
        mixBlendMode: 'difference',
        display: 'flex',
        alignItems: 'baseline',
    },
    logoText: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 800,
        color: '#fff',
        lineHeight: 1,
    },
    logoDot: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 800,
        color: '#5227FF',
        lineHeight: 1,
    },
    contactBtn: {
        position: 'relative',
        display: 'inline-block',
        padding: 'clamp(6px, 1.5vw, 10px) clamp(14px, 3vw, 24px)',
        color: '#fff',
        textDecoration: 'none',
        pointerEvents: 'auto',
        transition: 'padding 0.15s ease',
    },
    corner: {
        position: 'absolute',
        width: 'clamp(10px, 2vw, 14px)',
        height: 'clamp(10px, 2vw, 14px)',
        pointerEvents: 'none',
    },
    contactText: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
        fontWeight: 600,
        letterSpacing: '0.5px',
    },
};
