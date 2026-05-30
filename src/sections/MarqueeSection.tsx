import React, { useRef, useState, useEffect } from 'react';

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      // Exact offset formula specified in requirements
      const calculatedOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calculatedOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial run to lay out elements correctly
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // List of 10 project images using our premium generated assets
  const baseImages = [
    '/assets/project_saas.png',
    '/assets/project_ai.png',
    '/assets/project_cloud.png',
    '/assets/project_crypto.png',
    '/assets/project_saas.png',
    '/assets/project_ai.png',
    '/assets/project_cloud.png',
    '/assets/project_crypto.png',
    '/assets/project_saas.png',
    '/assets/project_ai.png',
  ];

  // Tripled images for seamless endless scrolling
  const tripledImages = [...baseImages, ...baseImages, ...baseImages];

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 relative z-20"
    >
      {/* Row 1: Moves RIGHT on scroll */}
      <div className="w-full overflow-hidden select-none pointer-events-none">
        <div 
          className="flex gap-3 whitespace-nowrap transition-transform duration-100 ease-out"
          style={{ 
            transform: `translate3d(${offset - 200}px, 0, 0)`,
            willChange: 'transform'
          }}
        >
          {tripledImages.map((src, index) => (
            <img
              key={`row1-${index}`}
              src={src}
              alt={`Project Preview 1-${index}`}
              loading="lazy"
              className="w-[420px] h-[270px] shrink-0 rounded-2xl object-cover border border-white/5 shadow-2xl"
            />
          ))}
        </div>
      </div>

      {/* Row 2: Moves LEFT on scroll */}
      <div className="w-full overflow-hidden select-none pointer-events-none">
        <div 
          className="flex gap-3 whitespace-nowrap transition-transform duration-100 ease-out justify-end"
          style={{ 
            transform: `translate3d(${-(offset - 200)}px, 0, 0)`,
            willChange: 'transform'
          }}
        >
          {tripledImages.map((src, index) => (
            <img
              key={`row2-${index}`}
              src={src}
              alt={`Project Preview 2-${index}`}
              loading="lazy"
              className="w-[420px] h-[270px] shrink-0 rounded-2xl object-cover border border-white/5 shadow-2xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
