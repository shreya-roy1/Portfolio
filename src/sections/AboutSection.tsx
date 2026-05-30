import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { WireframeGlobe } from '../components/WireframeGlobe';
import { AnimatedText } from '../components/AnimatedText';
import { TickingCounter } from '../components/TickingCounter';

export const AboutSection: React.FC = () => {
  const abstractText =
    "Currently pursuing a Bachelor's in Computer Science and Engineering at SRM Institute of Science & Technology. I am a full-stack developer and researcher focused on deep learning, AI-powered system architectures, and cybersecurity. I enjoy bridging the gap between high-performance telemetry pipelines and sleek, user-centric web applications.";

  return (
    <section
      id="about"
      className="min-h-screen relative flex flex-col justify-center items-center py-24 sm:py-32 px-6 md:px-12 lg:px-24 bg-[#030305] z-20 overflow-hidden"
    >
      <div className="w-full max-w-5xl flex flex-col gap-12 sm:gap-16">

        {/* Section Header */}
        <div className="flex flex-col gap-3">
          <FadeIn direction="up" distance={20} delay={0}>
            <span className="font-mono text-xs text-quantumCyan uppercase tracking-[0.25em] font-bold">
              01 // THE SYSTEM ABSTRACT
            </span>
          </FadeIn>
          <FadeIn direction="up" distance={30} delay={0.1}>
            <h2 className="silver-heading font-black uppercase tracking-tight text-[2.5rem] sm:text-[4rem] md:text-[5rem] leading-none">
              Overview
            </h2>
          </FadeIn>
        </div>

        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

          {/* Left Side: Dynamic Spinning/Scroll-rotating Wireframe Globe */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <FadeIn direction="right" distance={30} delay={0.2} className="w-full">
              <WireframeGlobe />
            </FadeIn>
          </div>

          {/* Right Side: Scroll-driven Narrative & Metrics Counters */}
          <div className="lg:col-span-7 flex flex-col gap-10 md:gap-12 justify-center">

            {/* Character Scroll Reveal block */}
            <div className="w-full flex justify-start text-left">
              <AnimatedText
                text={abstractText}
                className="!max-w-full !text-left !justify-start !leading-relaxed text-[#E2E8F0]/80 font-light"
              />
            </div>

            {/* Three Borderless Telemetry Counters */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 border-t border-white/10 pt-8 md:pt-10">
              <div className="flex flex-col select-none">
                <span className="font-mono text-[9px] text-[#E2E8F0]/40 uppercase tracking-widest font-bold mb-1">
                  01_ / YEARS_ACTIVE
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-quantumCyan">
                  <TickingCounter target={4} suffix="+" />
                </span>
              </div>

              {/* Counter 2: Hackathon Deploys */}
              <div className="flex flex-col select-none">
                <span className="font-mono text-[9px] text-[#E2E8F0]/40 uppercase tracking-widest font-bold mb-1">
                  02_ / HACKATHONS
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  <TickingCounter target={12} suffix="+" />
                </span>
              </div>

              {/* Counter 3: Commits Logged */}
              <div className="flex flex-col select-none">
                <span className="font-mono text-[9px] text-[#E2E8F0]/40 uppercase tracking-widest font-bold mb-1">
                  03_ / COMMITS_LOGGED
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  <TickingCounter target={1420} suffix="+" />
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
