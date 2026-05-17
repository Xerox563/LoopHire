import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import TerminalDemo from "@/components/landing/TerminalDemo";
import CTA from "@/components/landing/CTA";

/**
 * Landing page entry point - orchestrates all landing sections
 */
export default function Home() {
  return (
    <main>
      {/* Top navigation */}
      <Navbar />
      
      {/* Page sections with anchor IDs for navigation */}
      <div id="hero">
        <Hero />
      </div>
      
      <div id="how">
        <HowItWorks />
      </div>
      
      <div id="features">
        <Features />
      </div>
      
      <div id="demo">
        <TerminalDemo />
      </div>
      
      {/* Bottom call to action */}
      <CTA />
      
      {/* Simple footer with technology stack info */}
      <footer 
        className="text-center py-8 text-sm" 
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
      >
        Built with Modern Web Technologies · LoopHire 2026
      </footer>
    </main>
  );
}
