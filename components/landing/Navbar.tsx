"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Rocket, LayoutDashboard } from "lucide-react";

/**
 * Premium Sticky Navbar
 * Features: Magnetic buttons, blur effects, animated indicators
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-4" : "py-8"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-500 ${
          scrolled 
            ? "bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50" 
            : "bg-transparent border-transparent"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-accent/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              LoopHire
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", href: "#features" },
              { label: "How it Works", href: "#how" },
              { label: "Protocol", href: "#demo" },
              { label: "Analytics", href: "/dashboard" },
              { label: "Pricing", href: "#cta" },
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors mr-2">
              Log in
            </Link>
            <Link href="/dashboard">
              <button className="bg-accent hover:bg-accent-2 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all shadow-lg shadow-accent/20">
                Get Started
              </button>
            </Link>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Premium Slide */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
        className="fixed inset-0 z-[101] bg-black/95 backdrop-blur-2xl p-12 md:hidden flex flex-col items-center justify-center gap-12"
      >
        <button 
          className="absolute top-8 right-8 p-4 text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>
        
        {["Features", "Protocol", "Dashboard"].map((label) => (
          <Link 
            key={label} 
            href={label === "Dashboard" ? "/dashboard" : `#${label.toLowerCase()}`}
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl font-bold tracking-tighter text-white hover:text-accent transition-colors"
          >
            {label}
          </Link>
        ))}
      </motion.div>
    </motion.nav>
  );
}
