import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHorizontalInView } from '../hooks/useHorizontalInView';

export function AnimatedNumber({ value }: { value: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  
  const match = value.match(/^([^0-9]*)([0-9.]+)(.*)$/);
  const prefix = match ? match[1] : '';
  const numStr = match ? match[2] : '';
  const suffix = match ? match[3] : '';
  
  const num = parseFloat(numStr) || 0;
  const isDecimal = numStr.includes('.');

  const inView = useHorizontalInView(containerRef, 0.1);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current && numberRef.current) {
      hasAnimated.current = true;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 2,
        ease: 'power3.out',
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = isDecimal 
              ? obj.val.toFixed(1) 
              : Math.round(obj.val).toString();
          }
        }
      });
    }
  }, [inView, num, isDecimal]);

  if (!match) return <span>{value}</span>;

  return (
    <span ref={containerRef}>
      {prefix}
      <span ref={numberRef}>0</span>
      {suffix}
    </span>
  );
}
