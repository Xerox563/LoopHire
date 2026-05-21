"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, company: string, role: string, notes: string) => void;
}

/**
 * Modal dialog for manually adding new job applications to the tracker
 */
export default function AddJobModal({ isOpen, onClose, onAdd }: Props) {
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Validate and submit the new job entry
  function handleSubmit() {
    if (!url.trim()) { 
      setError("Job URL is required"); 
      return; 
    }
    
    onAdd(url.trim(), company.trim(), role.trim(), notes.trim());
    
    // Reset form fields
    setUrl(""); 
    setCompany(""); 
    setRole(""); 
    setNotes(""); 
    setError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md" 
            onClick={onClose} 
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }} 
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="w-full max-w-lg glass-card !p-10 relative pointer-events-auto">
              {/* Close button */}
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
              >
                ✕
              </button>

              <h2 className="font-display text-4xl font-bold mb-2 text-gradient">
                Track New Job
              </h2>
              <p className="text-text-secondary mb-8 text-lg">
                Add a job URL to start your automated journey.
              </p>

              <div className="flex flex-col gap-6">
                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-1">
                    Job Application URL
                  </label>
                  <input 
                    value={url} 
                    onChange={e => { setUrl(e.target.value); setError("") }}
                    placeholder="https://wellfound.com/jobs/..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm"
                  />
                </div>

                {/* Company and Role Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-1">
                      Company Name
                    </label>
                    <input 
                      value={company} 
                      onChange={e => setCompany(e.target.value)} 
                      placeholder="e.g. Stripe" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-1">
                      Target Role
                    </label>
                    <input 
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                      placeholder="e.g. Frontend Engineer" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-1">
                    Internal Notes (Optional)
                  </label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Any specific details about this application…" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm min-h-[100px] resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-sm text-error font-medium">{error}</p>}

                {/* Modal Actions */}
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={onClose} 
                    className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="btn-cinematic flex-1 py-4 !text-xs !font-bold !uppercase !tracking-widest"
                  >
                    Start Tracking →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
