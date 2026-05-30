import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  // Set up scroll tracking for the container element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.5'], // Animates as it rolls into view
  });

  const words = text.split(' ');
  let charCounter = 0;

  // Count active non-space characters to map exact progress values
  const totalChars = text.replace(/\s+/g, '').length;

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap justify-center text-center leading-relaxed text-[#D7E2EA] font-medium max-w-[600px] select-none ${className}`}
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {words.map((word, wordIdx) => {
        return (
          <span key={wordIdx} className="inline-flex mr-[0.4em] my-1">
            {word.split('').map((char, charIdx) => {
              const index = charCounter;
              charCounter++;

              // Distribute character illumination ranges across scrollYProgress
              const start = index / totalChars;
              const end = (index + 1) / totalChars;

              return (
                <Character
                  key={charIdx}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </span>
        );
      })}
    </p>
  );
};

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  // Linearly map the scroll percentage to opacity [0.2 -> 1]
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }} className="will-change-[opacity]">{char}</motion.span>;
};

export default AnimatedText;
