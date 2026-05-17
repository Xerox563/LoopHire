import type { Metadata } from "next";
import "./globals.css";
import { PremiumProvider } from "@/components/providers/PremiumProvider";

// LoopHire - Modern hiring platform metadata
export const metadata: Metadata = {
  title: "LoopHire — AI-Powered Hiring Platform",
  description: "Next-generation hiring automation and job discovery for modern startups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PremiumProvider>
          {children}
        </PremiumProvider>
      </body>
    </html>
  );
}
