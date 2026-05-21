"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Terminal, Rocket, Briefcase, Clock, Target, CheckCircle2, Layout, Users, Zap, BrainCircuit } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ROTATING_WORDS = ["dream job", "future role", "next career", "startup goal"];

/**
 * Cinematic Hero Section
 * Features: Floating elements, Parallax text, Cinematic lighting
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

      // Dashboard Floating and Tilt Animation
      gsap.to(".dashboard-preview", {
        y: -20,
        rotateX: 5,
        rotateY: -5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Subtle mouse move effect on dashboard
      const handleMouseMove = (e: MouseEvent) => {
        if (!dashboardRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = dashboardRef.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        gsap.to(dashboardRef.current, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 1,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden py-32 lg:py-0 lg:pt-20">
      {/* Cinematic Background Lighting */}
      <div className="parallax-bg absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,64,0.03),transparent_70%)]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 text-left pt-12">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 mt-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
                Future of Recruitment AI
              </span>
            </motion.div>

            {/* Main Title */}
            <div className="mb-8">
              <h1 ref={titleRef} className="reveal-text font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight font-bold text-white">
                Land your <br />
                <span className="relative inline-block h-[1.1em] align-top overflow-visible">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={ROTATING_WORDS[wordIndex]}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="accent-gradient italic block px-2"
                    >
                      {ROTATING_WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <br />
                <span className="text-gradient">effortlessly.</span>
              </h1>
            </div>

            {/* Description */}
            <p className="reveal-text text-base md:text-lg text-text-secondary max-w-xl mb-12 leading-relaxed">
              The autonomous agent that tracks, matches, and applies to jobs while you sleep. 
              Experience the $100k startup speed in your career.
            </p>

            {/* Cinematic Actions */}
            <div className="reveal-text flex flex-col sm:flex-row gap-4 items-start mb-16">
              <Link href="/dashboard">
                <button className="btn-cinematic group !rounded-xl !py-4 !px-10">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              
              <a href="https://github.com/Xerox563/LoopHire" target="_blank" rel="noopener noreferrer">
                <button className="btn-premium group !rounded-xl !py-4 !px-10">
                  <Terminal className="mr-2 w-4 h-4" />
                  View on GitHub
                </button>
              </a>
            </div>

            {/* Floating Stats */}
            <div className="reveal-text grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/5 pt-12">
              {[
                { label: "Success Rate", value: "94%", icon: Briefcase },
                { label: "Time Saved", value: "120h+", icon: Clock },
                { label: "Matches Found", value: "10k+", icon: Target },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                      <stat.icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <div className="text-[10px] tracking-[0.2em] text-text-muted uppercase font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content: Dashboard Preview */}
          <div className="lg:w-1/2 relative hidden lg:block">
            <motion.div
              ref={dashboardRef}
              initial={{ opacity: 0, x: 50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="dashboard-preview relative z-20 perspective-1000"
            >
              {/* Rocket Glow Effect */}
              <div className="absolute -top-20 right-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute -top-12 right-12 z-30">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent blur-xl opacity-50 animate-pulse" />
                  <Rocket className="w-16 h-16 text-accent drop-shadow-[0_0_20px_rgba(255,102,64,0.6)] animate-bounce relative z-10" />
                </div>
              </div>

              {/* Mock Dashboard Window */}
              <div className="glass-card !p-0 rounded-[2.5rem] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden w-[115%] -ml-[5%] bg-black/40 backdrop-blur-3xl">
                {/* Window Header */}
                <div className="bg-white/[0.03] border-b border-white/5 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-error/40 border border-error/20" />
                      <div className="w-3 h-3 rounded-full bg-warning/40 border border-warning/20" />
                      <div className="w-3 h-3 rounded-full bg-success/40 border border-success/20" />
                    </div>
                    <div className="h-5 w-px bg-white/10 mx-2" />
                    <div className="flex items-center gap-2">
                      <Layout className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Neural Core / Live Flow</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-surface-2 flex items-center justify-center">
                          <Users className="w-3 h-3 text-text-muted" />
                        </div>
                      ))}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  </div>
                </div>
                
                <div className="p-10 grid grid-cols-12 gap-8">
                  {/* Left Column: Stats */}
                  <div className="col-span-7 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 rounded-lg bg-success/10 border border-success/20">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          </div>
                          <span className="text-[9px] text-success font-bold uppercase tracking-wider">+12%</span>
                        </div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Applications</p>
                        <p className="text-3xl font-display font-bold text-white tracking-tight">1,284</p>
                      </div>
                      <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                            <Zap className="w-4 h-4 text-accent" />
                          </div>
                          <span className="text-[9px] text-accent font-bold uppercase tracking-wider">Live</span>
                        </div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">AI Efficiency</p>
                        <p className="text-3xl font-display font-bold text-white tracking-tight">98.2<span className="text-sm text-text-muted">%</span></p>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="bg-white/[0.02] rounded-3xl p-8 border border-white/5 h-56 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Growth Velocity</p>
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-32 flex items-end justify-between px-8 pb-6">
                        {[30, 50, 40, 80, 60, 95, 75, 100, 85].map((h, i) => (
                          <div key={i} className="w-6 bg-accent/10 rounded-t-xl relative group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1.5, delay: 1.5 + (i * 0.1), ease: "circOut" }}
                              className="w-full bg-gradient-to-t from-accent/40 to-accent rounded-t-xl shadow-[0_0_20px_rgba(255,102,64,0.4)]"
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                              {h}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Activity Feed */}
                  <div className="col-span-5 space-y-6">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Live Activity</p>
                    <div className="space-y-4">
                      {[
                        { company: "OpenAI", status: "Applied", time: "2m ago", color: "text-success" },
                        { company: "Anthropic", status: "Interview", time: "15m ago", color: "text-accent" },
                        { company: "Vercel", status: "Matching", time: "1h ago", color: "text-info" },
                        { company: "Linear", status: "Applied", time: "3h ago", color: "text-success" },
                      ].map((item, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2 + (i * 0.1) }}
                          key={i} 
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px] text-white">
                              {item.company[0]}
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-white">{item.company}</p>
                              <p className={`text-[9px] font-bold uppercase tracking-wider ${item.color}`}>{item.status}</p>
                            </div>
                          </div>
                          <span className="text-[9px] text-text-muted font-medium">{item.time}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Thinking Status */}
                    <div className="mt-8 p-5 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-20" />
                        <BrainCircuit className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Neural Matching</p>
                        <p className="text-[11px] text-text-secondary">Optimizing 48 target roles...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Elements */}
              <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-10 -left-10 glass-card !p-4 border-accent/20 shadow-2xl z-30"
               >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white">Success Protocol</p>
                    <p className="text-[9px] text-text-muted tracking-widest">94.2% RATE</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
