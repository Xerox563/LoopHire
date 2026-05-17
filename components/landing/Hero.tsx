"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Terminal } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic Hero Section
 * Features: Floating elements, Parallax text, Cinematic lighting
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.to(".parallax-bg", {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Cinematic Reveal
      gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-32">
      {/* Cinematic Background Lighting */}
      <div className="parallax-bg absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,64,0.03),transparent_70%)]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto text-center">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span className="text-xs font-medium tracking-widest text-text-secondary uppercase">
            Future of Recruitment AI
          </span>
        </motion.div>

        {/* Main Title */}
        <div className="overflow-hidden mb-8">
          <h1 ref={titleRef} className="reveal-text font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-tight font-bold">
            Land your <span className="accent-gradient italic">dream job</span> <br /> 
            <span className="text-gradient">effortlessly.</span>
          </h1>
        </div>

        {/* Description */}
        <p className="reveal-text text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          The autonomous agent that tracks, matches, and applies to jobs while you sleep. 
          Experience the $100k startup speed in your career.
        </p>

        {/* Cinematic Actions */}
        <div className="reveal-text flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/dashboard">
            <button className="btn-cinematic group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          
          <a href="https://github.com/Xerox563/LoopHire" target="_blank" rel="noopener noreferrer">
            <button className="btn-premium group">
              <Terminal className="mr-2 w-5 h-5" />
              View on GitHub
            </button>
          </a>
        </div>

        {/* Floating Stats */}
        <div className="reveal-text mt-24 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-white/5 pt-12 max-w-4xl mx-auto">
          {[
            { label: "Success Rate", value: "94%" },
            { label: "Time Saved", value: "120h+" },
            { label: "Matches Found", value: "10k+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold accent-gradient mb-1">{stat.value}</div>
              <div className="text-xs tracking-widest text-text-muted uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
