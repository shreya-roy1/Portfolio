import React from 'react';
import { motion } from 'framer-motion';
import { Magnet } from '../components/Magnet';
import { FadeIn } from '../components/FadeIn';
import { InteractiveParticles } from '../components/InteractiveParticles';

interface HeroSectionProps {
  onResumeClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onResumeClick,
}) => {
  return (
    <section className="h-screen flex flex-col justify-between overflow-hidden relative bg-[#030305] text-[#E2E8F0]">
      
      {/* 1. Canvas Interactive Constellation Background */}
      <InteractiveParticles />

      {/* 2. Orbiting Antigravity Data Widgets Background Cluster */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        
        {/* Floating Element 1: 3D SVG Polymer Structure (Center-Left) */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 4, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[28%] left-[6%] md:left-[10%] pointer-events-auto hidden lg:block"
        >
          <Magnet padding={100} strength={3}>
            <svg 
              viewBox="0 0 100 100" 
              className="w-[100px] md:w-[130px] h-auto filter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] select-none"
            >
              <line x1="50" y1="15" x2="20" y2="45" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="50" y1="15" x2="80" y2="45" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="20" y1="45" x2="50" y2="75" stroke="#4f46e5" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="80" y1="45" x2="50" y2="75" stroke="#4f46e5" strokeWidth="1.5" strokeOpacity="0.8" />
              <circle cx="50" cy="15" r="5" fill="#6366f1" />
              <circle cx="20" cy="45" r="6" fill="#4f46e5" />
              <circle cx="80" cy="45" r="6" fill="#6366f1" />
              <circle cx="50" cy="75" r="7" fill="#4f46e5" />
            </svg>
          </Magnet>
        </motion.div>

      </div>

      {/* 3. Giant Asymmetric Split Content Area (Navbar header removed and loaded globally) */}
      <div className="flex-grow flex items-center px-6 md:px-16 lg:px-24 z-20 relative select-none mt-16 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full max-w-7xl mx-auto">
          
          {/* Left Column: Shreya Roy Name (smaller, single line / wrapped elegantly) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <FadeIn direction="right" distance={30} delay={0.15}>
              <h1 
                className="font-bold tracking-tight text-white leading-none text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.5rem]"
              >
                SHREYA ROY
              </h1>
            </FadeIn>
          </div>

          {/* Right Column: Full Stack Developer Description + CTAs (shifted right) */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-4.5 md:gap-6 justify-center text-left lg:pl-6">
            
            {/* Monospaced tag */}
            <FadeIn direction="left" distance={20} delay={0.25}>
              <p className="text-indigo-400 text-sm tracking-wider font-semibold uppercase">
                Full-Stack Engineer
              </p>
            </FadeIn>

            {/* Uppercase telemetry description */}
            <FadeIn direction="left" distance={25} delay={0.35}>
              <p className="text-slate-300 font-light leading-snug text-sm md:text-base max-w-[550px]">
                Architecting scalable, real-time web applications and high-throughput data dashboards with TypeScript, React, and Node.js.
              </p>
            </FadeIn>

            {/* Interactive CTAs */}
            <FadeIn direction="left" distance={25} delay={0.45}>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Magnet padding={80} strength={3}>
                  <a
                    href="#resume-preview"
                    onClick={(e) => {
                      e.preventDefault();
                      onResumeClick?.(e);
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs text-white bg-indigo-500 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition-all duration-300 hover:bg-indigo-600 hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)]"
                  >
                    View Resume
                  </a>
                </Magnet>

                <Magnet padding={80} strength={3}>
                  <a
                    href="https://github.com/shreya-roy1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] text-[#E2E8F0] border border-[#E2E8F0]/20 bg-transparent transition-all duration-300 hover:bg-[#E2E8F0]/10 hover:border-white/50"
                  >
                    GitHub
                  </a>
                </Magnet>
              </div>
            </FadeIn>

          </div>

        </div>
      </div>

      {/* 4. Bottom Navigation Telemetry Footer */}
      <div className="w-full flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20 relative bg-gradient-to-t from-[#030305] to-transparent pt-12" />

    </section>
  );
};

export default HeroSection;
