import React, { useEffect, useRef, useState } from 'react';

interface TickingCounterProps {
  target: number;
  duration?: number; // in milliseconds
  suffix?: string;
  className?: string;
  decimals?: number;
}

export const TickingCounter: React.FC<TickingCounterProps> = ({
  target,
  duration = 2000,
  suffix = '',
  className = '',
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: easeOutQuad (starts fast, slows down at the end)
            const easedProgress = progress * (2 - progress);
            const currentCount = easedProgress * target;
            
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  // Format standard numbers with local formatting (e.g. 150,000) and support decimals
  const formattedCount = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={elementRef} className={`font-mono ${className}`}>
      {formattedCount}
      {suffix}
    </span>
  );
};

export default TickingCounter;
