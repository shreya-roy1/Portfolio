import React from 'react';
import { Download } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { GhostActionButton } from '../components/GhostActionButton';
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from '../components/BrandIcons';

interface FooterSectionProps {
  onResumeClick?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onResumeClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      id="resume"
      className="bg-[#0C0C0C] text-[#E2E8F0] pt-20 sm:pt-28 pb-12 px-6 overflow-hidden flex flex-col justify-between items-center min-h-[50vh] relative z-40"
    >
      {/* Soft radial glow backing */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #8A2BE2 0%, #00F0FF 50%, transparent 100%)',
        }}
      />

      <div className="w-full max-w-4xl flex flex-col items-center gap-12 sm:gap-16 relative z-10 my-auto">
        {/* Large Centered Header */}
        <FadeIn
          direction="up"
          distance={30}
          delay={0}
          className="text-center"
        >
          <h2
            className="silver-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
          >
            Let&apos;s connect.
          </h2>
        </FadeIn>

        {/* Large Links Grid */}
        <FadeIn
          direction="up"
          distance={25}
          delay={0.15}
          className="w-full max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GhostActionButton
              href="https://www.linkedin.com/in/shreya-roy1818/"
              icon={LinkedinIcon as any}
              className="w-full !py-4.5 text-base border-white/10 hover:border-quantumCyan font-semibold hover:text-quantumCyan transition-all duration-300"
            >
              LinkedIn
            </GhostActionButton>

            <GhostActionButton
              href="https://github.com/shreya-roy1"
              icon={GithubIcon as any}
              className="w-full !py-4.5 text-base border-white/10 hover:border-quantumCyan font-semibold hover:text-quantumCyan transition-all duration-300"
            >
              GitHub
            </GhostActionButton>

            <GhostActionButton
              href="https://leetcode.com/u/ShreyaRoyy/"
              icon={LeetcodeIcon as any}
              className="w-full !py-4.5 text-base border-white/10 hover:border-[#8A2BE2] font-semibold hover:text-[#8A2BE2] transition-all duration-300"
            >
              LeetCode
            </GhostActionButton>

            <GhostActionButton
              href="#resume-preview"
              icon={Download}
              onClick={onResumeClick}
              className="w-full !py-4.5 text-base border-white/10 hover:border-quantumCyan font-semibold bg-white/5 hover:text-quantumCyan transition-all duration-300"
            >
              See CV
            </GhostActionButton>
          </div>
        </FadeIn>
      </div>

      {/* Copyright Footer */}
      <FadeIn
        direction="none"
        delay={0.3}
        className="w-full text-center mt-16 sm:mt-24 relative z-10 select-none"
      >
        <p className="font-mono text-[#E2E8F0]/30 text-[9px] md:text-[10px] uppercase tracking-widest font-light">
          &copy; {currentYear} SHREYA ROY. All Rights Reserved. Designed with passion.
        </p>
      </FadeIn>
    </footer>
  );
};

export default FooterSection;
