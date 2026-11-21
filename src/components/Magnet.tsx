"use client";

import React from "react";

interface MagnetProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  shape?: "round" | "star" | "flower" | "heart";
  className?: string;
  interactive?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  color = "#ef4444",
  size = "md",
  shape = "round",
  className = "",
  interactive = true,
}) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const currentSize = sizeMap[size];

  if (shape === "star") {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${currentSize} ${className} ${
          interactive ? "transition-transform duration-200 hover:scale-110 active:scale-95" : ""
        }`}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full" fill={color}>
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
        {/* Specular highlight */}
        <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/70 rounded-full blur-[0.5px]" />
      </div>
    );
  }

  if (shape === "heart") {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${currentSize} ${className} ${
          interactive ? "transition-transform duration-200 hover:scale-110 active:scale-95" : ""
        }`}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full" fill={color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/70 rounded-full blur-[0.5px]" />
      </div>
    );
  }

  // Default: Realistic 3D round glossy magnet
  return (
    <div
      className={`relative rounded-full ${currentSize} ${className} ${
        interactive ? "transition-transform duration-200 hover:scale-115 active:scale-90" : ""
      }`}
      style={{
        backgroundColor: color,
        boxShadow: `
          0 3px 6px -1px rgba(0, 0, 0, 0.4),
          0 2px 4px -1px rgba(0, 0, 0, 0.25),
          inset 0 -2px 3px rgba(0, 0, 0, 0.35),
          inset 0 2px 4px rgba(255, 255, 255, 0.8)
        `,
      }}
      aria-hidden="true"
    >
      {/* Glossy curved surface reflection */}
      <div className="absolute top-0.5 left-1 w-2/5 h-2/5 rounded-full bg-gradient-to-br from-white/90 to-transparent blur-[0.3px]" />
      {/* Subtle center ring / ceramic groove */}
      <div className="absolute inset-1 rounded-full border border-black/10 pointer-events-none" />
    </div>
  );
};
