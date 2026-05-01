import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const barRef = useRef(null);
    const counterRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const tl = gsap.timeline({
            onComplete: () => {
                // Slide the loader away
                gsap.to(overlayRef.current, {
                    yPercent: -100,
                    duration: 1,
                    ease: 'power4.inOut',
                    delay: 0.3,
                    onComplete: () => onComplete?.(),
                });
            },
        });

        // Animate counter from 0 to 100
        tl.to({ val: 0 }, {
            val: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function () {
                const v = Math.round(this.targets()[0].val);
                setProgress(v);
            },
        });

        // Reveal text
        tl.fromTo(
            textRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out' },
            0
        );

        return () => tl.kill();
    }, [onComplete]);

    return (
        <div ref={overlayRef} style={styles.overlay}>
            <div style={styles.content}>
                <h1 ref={textRef} style={styles.title}>
                    Sayonara<span style={styles.dot}>.</span>
                </h1>
                <div style={styles.barContainer}>
                    <div
                        ref={barRef}
                        style={{ ...styles.bar, width: `${progress}%` }}
                    />
                </div>
                <span ref={counterRef} style={styles.counter}>
                    {String(progress).padStart(3, '0')}
                </span>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a0a0f',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    content: {
        textAlign: 'center',
    },
    title: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: 800,
        color: '#fff',
        margin: 0,
        letterSpacing: '-2px',
        lineHeight: 1,
        marginBottom: '2rem',
    },
    dot: {
        color: '#5227FF',
    },
    barContainer: {
        width: '200px',
        height: '2px',
        background: 'rgba(255, 255, 255, 0.1)',
        margin: '0 auto',
        borderRadius: '2px',
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        background: 'linear-gradient(90deg, #5227FF, #FF9FFC)',
        borderRadius: '2px',
        transition: 'width 0.05s linear',
    },
    counter: {
        fontFamily: "'Outfit', monospace",
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: '1rem',
        display: 'block',
        letterSpacing: '4px',
    },
};
