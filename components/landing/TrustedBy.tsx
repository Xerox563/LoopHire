"use client";

import { motion } from "framer-motion";

const COMPANIES = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Adobe_Systems_logo_and_wordmark.svg" },
];

export default function TrustedBy() {
  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-12">
          Trusted by engineers & job seekers at
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-6 md:h-8"
            >
              <img 
                src={company.logo} 
                alt={company.name} 
                className="h-full w-auto object-contain brightness-0 invert" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
