"use client";

import React from "react";
import { siteConfig } from "@/config/siteConfig";

interface SmegBadgeProps {
  onClick?: () => void;
  className?: string;
}

/**
 * Authentic 1950s SMEG-style individual 3D chrome block lettering:
 * "F R I D G E   N O T E S"
 */
export const SmegBadge: React.FC<SmegBadgeProps> = ({
  onClick,
  className = "",
}) => {
  // Letters to render with authentic wide tracking
  const words = [
    { text: "FRIDGE", letters: ["F", "R", "I", "D", "G", "E"] },
    { text: "NOTES", letters: ["N", "O", "T", "E", "S"] },
  ];

  return (
    <button
      onClick={onClick}
      title="Click to return to top"
      className={`group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm transition-transform duration-300 hover:scale-[1.03] active:scale-95 ${className}`}
      aria-label={`${siteConfig.name} - Retro Refrigerator Badge`}
    >
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-2 px-4">
        {words.map((w, wIdx) => (
          <div key={wIdx} className="flex items-center gap-1.5 sm:gap-2.5">
            {w.letters.map((letter, lIdx) => (
              <span
                key={lIdx}
                className="relative inline-flex items-center justify-center font-heading font-black text-xl sm:text-2xl md:text-3xl text-slate-800 transition-transform duration-200 group-hover:-translate-y-0.5"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: "0.08em",
                  background: "linear-gradient(180deg, #ffffff 0%, #e2e8ee 28%, #8e9ca7 50%, #586570 52%, #b0bdc8 75%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 3px 2px rgba(0, 0, 0, 0.5)) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9))",
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </button>
  );
};
