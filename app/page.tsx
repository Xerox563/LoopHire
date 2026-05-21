import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import TerminalDemo from "@/components/landing/TerminalDemo";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

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
      
      <TrustedBy />
      
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
      
      {/* Simple footer with technology stack info and navigation */}
      <Footer />
    </main>
  );
}
