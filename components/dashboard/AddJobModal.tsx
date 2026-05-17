"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (url: string, company: string, role: string, notes: string) => void;
}

/**
 * Modal dialog for manually adding new job applications to the tracker
 */
export default function AddJobModal({ open, onClose, onAdd }: Props) {
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

  // Common styles for input fields
  const inputStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 12,
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    fontSize: 14,
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40" 
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onClose} 
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }} 
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div 
              className="w-full max-w-md rounded-2xl p-8 relative"
              style={{ background: "var(--surface)", border: "1px solid var(--border-bright)" }}
            >
              {/* Close button */}
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-lg"
                style={{ color: "var(--text-muted)" }}
              >
                ✕
              </button>

              <h2 className="font-display text-2xl mb-1" style={{ color: "var(--text-primary)" }}>
                Add Job
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Enter the job details below to start tracking
              </p>

              <div className="flex flex-col gap-4">
                {/* URL Input */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                    Job URL *
                  </label>
                  <input 
                    value={url} 
                    onChange={e => { setUrl(e.target.value); setError("") }}
                    placeholder="https://company.com/careers/role"
                    style={inputStyle} 
                  />
                </div>

                {/* Company and Role Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                      Company
                    </label>
                    <input 
                      value={company} 
                      onChange={e => setCompany(e.target.value)} 
                      placeholder="Company name" 
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                      Role
                    </label>
                    <input 
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                      placeholder="Job title" 
                      style={inputStyle} 
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                    Notes
                  </label>
                  <input 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Optional notes…" 
                    style={inputStyle} 
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

                {/* Modal Actions */}
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={onClose} 
                    className="flex-1 py-3 rounded-xl text-sm font-medium"
                    style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit} 
                    className="btn-primary flex-1 py-3 rounded-xl text-sm font-medium"
                  >
                    Add Job →
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
