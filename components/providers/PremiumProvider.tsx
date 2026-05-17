"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * Premium UI Provider
 * Handles: Smooth Scrolling (Lenis), Custom Physics Cursor, Noise Grain
 */
export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div className="noise-bg" />
      {children}
    </ReactLenis>
  );
}
