import React, { useEffect, useRef, useCallback, useState } from 'react';
import './AntigravityCursor.css';

const TRAIL_COUNT = 20;
const LERP_FACTORS = Array.from({ length: TRAIL_COUNT }, (_, i) => 0.25 - i * 0.008);

export default function AntigravityCursor() {
    // Don't render on touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(hover: none) or (pointer: coarse)');
        setIsTouchDevice(mq.matches);
        const handler = (e) => setIsTouchDevice(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    if (isTouchDevice) return null;

    return <CursorInner />;
}

function CursorInner() {
    const containerRef = useRef(null);
    const mainDotRef = useRef(null);
    const trailRefs = useRef([]);
    const mousePos = useRef({ x: -100, y: -100 });
    const positions = useRef(
        Array.from({ length: TRAIL_COUNT + 1 }, () => ({ x: -100, y: -100 }))
    );
    const rafId = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Track mouse position
    const handleMouseMove = useCallback((e) => {
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
    }, []);

    // Detect hoverable elements
    useEffect(() => {
        const handleOver = (e) => {
            const el = e.target;
            if (
                el.tagName === 'A' ||
                el.tagName === 'BUTTON' ||
                el.closest('a') ||
                el.closest('button') ||
                el.closest('[data-cursor-hover]') ||
                getComputedStyle(el).cursor === 'pointer'
            ) {
                setIsHovering(true);
            }
        };
        const handleOut = () => setIsHovering(false);

        document.addEventListener('mouseover', handleOver);
        document.addEventListener('mouseout', handleOut);
        return () => {
            document.removeEventListener('mouseover', handleOver);
            document.removeEventListener('mouseout', handleOut);
        };
    }, []);

    // Animation loop
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            // Main dot follows mouse directly
            positions.current[0].x = mousePos.current.x;
            positions.current[0].y = mousePos.current.y;

            // Each trail dot lerps toward the one before it
            for (let i = 1; i <= TRAIL_COUNT; i++) {
                const factor = LERP_FACTORS[i - 1] || 0.05;
                positions.current[i].x += (positions.current[i - 1].x - positions.current[i].x) * factor;
                positions.current[i].y += (positions.current[i - 1].y - positions.current[i].y) * factor;
            }

            // Apply positions to DOM
            if (mainDotRef.current) {
                mainDotRef.current.style.transform = `translate3d(${positions.current[0].x - 9}px, ${positions.current[0].y - 9}px, 0)`;
            }

            trailRefs.current.forEach((dot, i) => {
                if (!dot) return;
                const pos = positions.current[i + 1];
                const scale = 1 - (i / TRAIL_COUNT) * 0.85;
                const opacity = 0.7 - (i / TRAIL_COUNT) * 0.6;
                const size = 8 * scale;
                dot.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`;
                dot.style.width = `${size}px`;
                dot.style.height = `${size}px`;
                dot.style.opacity = opacity;
            });

            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [handleMouseMove]);

    return (
        <div className="antigravity-cursor" ref={containerRef}>
            {/* Main cursor dot */}
            <div
                ref={mainDotRef}
                className={`cursor-dot cursor-dot-main ${isHovering ? 'hovering' : ''}`}
            />

            {/* Trail dots */}
            {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    className="cursor-dot cursor-trail"
                />
            ))}
        </div>
    );
}
