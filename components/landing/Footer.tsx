"use client";

/**
 * Footer component with navigation and branding info
 */
export default function Footer() {
  return (
    <footer 
      className="text-center py-12 text-sm flex flex-col items-center gap-6" 
      style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
    >
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="px-4 py-2 rounded-lg transition-colors hover:text-white"
        style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
      >
        Back to Top ↑
      </button>
      <p>Built with Modern Web Technologies · LoopHire 2026</p>
    </footer>
  );
}
