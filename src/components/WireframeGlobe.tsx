import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const WireframeGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the viewport scroll position of this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to subtle rotation angles (e.g. -30deg to 60deg) for a dynamic parallax shift
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [-30, 60]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center w-full h-[280px] sm:h-[350px] md:h-[420px] select-none"
    >
      {/* Dynamic Glow Halo */}
      <div className="absolute w-[220px] h-[220px] rounded-full blur-[90px] bg-gradient-to-tr from-quantumCyan/10 to-deepPurple/15 opacity-40" />

      <motion.div
        style={{
          rotate: scrollRotate,
          scale: scrollScale,
          willChange: 'transform',
        }}
        className="w-[240px] sm:w-[300px] md:w-[350px] h-[240px] sm:h-[300px] md:h-[350px] flex items-center justify-center relative"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full filter drop-shadow-[0_0_20px_rgba(0,240,255,0.25)]"
        >
          {/* 1. Outer boundary ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="none" 
            stroke="#00F0FF" 
            strokeWidth="1.5" 
            strokeOpacity="0.8" 
          />
          
          {/* 2. Latitudinal Curves */}
          <ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.35" />
          <ellipse cx="50" cy="50" rx="46" ry="26" fill="none" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.35" />
          
          {/* 3. Longitudinal Curves */}
          <ellipse cx="50" cy="50" rx="12" ry="46" fill="none" stroke="#8A2BE2" strokeWidth="1" strokeOpacity="0.35" />
          <ellipse cx="50" cy="50" rx="26" ry="46" fill="none" stroke="#8A2BE2" strokeWidth="1" strokeOpacity="0.35" />
          
          {/* 4. Center scientific axis rules */}
          <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(226, 232, 240, 0.15)" strokeWidth="0.8" strokeDasharray="3,3" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(226, 232, 240, 0.15)" strokeWidth="0.8" strokeDasharray="3,3" />
          
          {/* 5. Core glowing plasma center */}
          <circle cx="50" cy="50" r="7" fill="url(#corePlasmaGlow)" />
          
          {/* 6. Orbital Satellite Nodes */}
          {/* Cyan Satellite */}
          <motion.circle
            cx="50"
            cy="50"
            r="3"
            fill="#00F0FF"
            animate={{
              cx: [50, 92, 50, 8, 50],
              cy: [8, 50, 92, 50, 8],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "linear",
            }}
            className="filter drop-shadow-[0_0_8px_#00F0FF]"
          />

          {/* Purple Satellite */}
          <motion.circle
            cx="50"
            cy="50"
            r="3"
            fill="#8A2BE2"
            animate={{
              cx: [50, 8, 50, 92, 50],
              cy: [92, 50, 8, 50, 92],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="filter drop-shadow-[0_0_8px_#8A2BE2]"
          />

          {/* Core Glow Definitions */}
          <defs>
            <radialGradient id="corePlasmaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

export default WireframeGlobe;
