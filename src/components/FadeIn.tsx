import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHorizontalInView } from '../hooks/useHorizontalInView';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  xOffset?: number;
  yOffset?: number;
}

export function FadeIn({ children, delay = 0, duration = 1, xOffset = 0, yOffset = 30 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useHorizontalInView(ref, 0.15);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current && ref.current) {
      hasAnimated.current = true;
      gsap.to(ref.current, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
      });
    }
  }, [inView, delay, duration]);

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: 0, 
        transform: `translate(${xOffset}px, ${yOffset}px)` 
      }}
    >
      {children}
    </div>
  );
}
