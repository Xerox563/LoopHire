import type { Metadata } from "next";
import "./globals.css";

// LoopHire - Modern hiring platform metadata
export const metadata: Metadata = {
  title: "LoopHire — AI-Powered Hiring Platform",
  description: "Next-generation hiring automation and job discovery for modern startups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
