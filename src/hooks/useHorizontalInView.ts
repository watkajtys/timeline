import { useEffect, useState, RefObject } from 'react';

export function useHorizontalInView(ref: RefObject<HTMLElement>, threshold: number = 0.1) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    let lastInView = false;
    const checkInView = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        // It's in view if it's within the horizontal viewport bounds
        const isInViewport = 
          rect.left < window.innerWidth * (1 - threshold) && 
          rect.right > window.innerWidth * threshold;
          
        if (isInViewport !== lastInView) {
          lastInView = isInViewport;
          setInView(isInViewport);
        }
      }
    };

    const observer = new IntersectionObserver(
      () => {
        checkInView();
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(ref.current);
    
    // Check on window scroll as well since the transform is updated continuously during GSAP scrub
    window.addEventListener('scroll', checkInView, { passive: true });
    checkInView();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkInView);
    };
  }, [ref, threshold]);

  return inView;
}
