"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

/**
 * Premium UI Provider
 * Handles: Smooth Scrolling (Lenis), Custom Physics Cursor, Noise Grain
 */
export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Custom Cursor Physics
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Main cursor follow with lag
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.6,
        ease: "power3.out"
      });

      // Dot follow instantly
      gsap.to(dot, {
        x: clientX,
        y: clientY,
        duration: 0,
      });
    };

    const onMouseDown = () => gsap.to(cursor, { scale: 0.8, duration: 0.2 });
    const onMouseUp = () => gsap.to(cursor, { scale: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div className="noise-bg" />
      
      {/* Custom Physics Cursor */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />

      {children}
    </ReactLenis>
  );
}
