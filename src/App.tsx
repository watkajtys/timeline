import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

const ERAS = [
  {
    id: "1776",
    title: "The Enlightenment",
    themeClass: "text-amber-100",
    bgClass: "bg-amber-950",
    midShapes: "bg-amber-800/40",
    fgShapes: "border-amber-500/30",
    textCards: [
      { title: "1776", text: "The Declaration of Independence is signed, sparking a new era of democratic ideals." },
      { title: "1789", text: "The French Revolution reshapes European political landscapes forever." }
    ]
  },
  {
    id: "1850",
    title: "The Industrial Age",
    themeClass: "text-stone-100",
    bgClass: "bg-stone-900",
    midShapes: "bg-stone-700/40",
    fgShapes: "border-stone-400/30",
    textCards: [
      { title: "1840", text: "Steam power revolutionizes manufacturing and global transportation." },
      { title: "1869", text: "The Transcontinental Railroad connects the American coasts." }
    ]
  },
  {
    id: "1900",
    title: "The Gilded Age",
    themeClass: "text-yellow-100",
    bgClass: "bg-neutral-950",
    midShapes: "bg-yellow-900/30",
    fgShapes: "border-yellow-600/30",
    textCards: [
      { title: "1903", text: "The Wright brothers achieve the first powered, sustained flight." },
      { title: "1914", text: "World War I begins, altering the course of modern history." }
    ]
  },
  {
    id: "1950",
    title: "The Atomic Age",
    themeClass: "text-teal-50",
    bgClass: "bg-teal-950",
    midShapes: "bg-teal-800/40",
    fgShapes: "border-teal-400/30",
    textCards: [
      { title: "1957", text: "Sputnik 1 is launched into orbit, triggering the Space Race." },
      { title: "1969", text: "Apollo 11 successfully lands the first humans on the Moon." }
    ]
  },
  {
    id: "2000",
    title: "The Info Age",
    themeClass: "text-indigo-50",
    bgClass: "bg-slate-950",
    midShapes: "bg-indigo-900/40",
    fgShapes: "border-indigo-400/30",
    textCards: [
      { title: "2007", text: "The smartphone revolution begins, connecting the globe instantly." },
      { title: "2020", text: "A massive global shift to remote work accelerates digital life." }
    ]
  }
];

function useEraVisibility(numEras: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const eraHeight = window.innerHeight * 3;
      const scrollY = window.scrollY;
      // Change active index exactly at the boundary (with a small 10px buffer)
      const current = Math.floor((scrollY + 10) / eraHeight);
      setActiveIndex(Math.max(0, Math.min(numEras - 1, current)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [numEras]);

  return activeIndex;
}

function EraContainer({ era, index, isRendered, eraHeight }: { key?: React.Key, era: typeof ERAS[0], index: number, isRendered: boolean, eraHeight: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isRendered) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    const cardsRatio = (eraHeight - window.innerHeight) / eraHeight;
    const totalDuration = 1.0 / cardsRatio;

    // Horizontal Parallax movement - spans the entire scroll duration
    tl.fromTo('.layer-bg', { x: '5vw' }, { x: '-5vw', ease: 'none', duration: totalDuration }, 0)
      .fromTo('.layer-mid', { x: '15vw' }, { x: '-15vw', ease: 'none', duration: totalDuration }, 0)
      .fromTo('.layer-fg', { x: '30vw' }, { x: '-30vw', ease: 'none', duration: totalDuration }, 0);

    const cards = gsap.utils.toArray('.card-wrapper', containerRef.current);
    const cardDuration = 1.0 / cards.length;
    
    cards.forEach((card: any, i) => {
      gsap.set(card, { zIndex: 10 + i });
      
      const cardTl = gsap.timeline();
      
      if (index === 0 && i === 0) {
        gsap.set(card, { x: '0vw', y: 0, opacity: 1, scale: 1 });
        cardTl.to(card, { x: '-5vw', ease: "none", duration: cardDuration * 0.7 })
              .to(card, { x: '-100vw', opacity: 0, scale: 0.85, ease: "power2.in", duration: cardDuration * 0.3 });
      } else {
        gsap.set(card, { x: '100vw', y: 0, opacity: 0, scale: 0.85 });
        cardTl.to(card, { x: '0vw', opacity: 1, scale: 1, ease: "power2.out", duration: cardDuration * 0.3 })
              .to(card, { x: '-5vw', ease: "none", duration: cardDuration * 0.4 })
              .to(card, { x: '-100vw', opacity: 0, scale: 0.85, ease: "power2.in", duration: cardDuration * 0.3 });
      }
            
      tl.add(cardTl, i * cardDuration);
    });

    // Ensure the timeline total duration is exactly `totalDuration`
    tl.to({}, { duration: totalDuration }, 0);

  }, { scope: containerRef, dependencies: [isRendered, eraHeight] });

  return (
    <div 
      ref={containerRef} 
      className="absolute w-full" 
      style={{ top: index * eraHeight, height: eraHeight }} 
      data-index={index}
    >
      {isRendered && (
        <div className={clsx("sticky top-0 w-full overflow-hidden flex flex-col items-center justify-center", era.themeClass, era.bgClass)} style={{ height: '100vh' }}>
          
          <div className="layer-bg absolute inset-[-20%] pointer-events-none">
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:64px_64px]" />
          </div>

          <div className="layer-mid absolute inset-[-20%] pointer-events-none mix-blend-screen">
             <div className={clsx("absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px]", era.midShapes)} />
             <div className={clsx("absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full blur-[120px]", era.midShapes)} />
          </div>

          <div className="layer-fg absolute inset-[-20%] pointer-events-none">
             <div className={clsx("absolute top-[30%] left-[70%] w-[20vw] h-[20vw] border-[8px] rounded-full mix-blend-overlay", era.fgShapes)} />
             <div className={clsx("absolute top-[60%] left-[15%] w-[25vw] h-[25vw] border-[8px] rotate-12 mix-blend-overlay", era.fgShapes)} />
             <div className={clsx("absolute top-[10%] left-[30%] w-[15vw] h-[15vw] border-[8px] rotate-45 mix-blend-overlay", era.fgShapes)} />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            {era.textCards.map((card: any, i: number) => (
               <div key={i} className="card-wrapper opacity-0 absolute pointer-events-auto max-w-lg w-[90%] p-8 md:p-12 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] text-center text-white">
                 <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">{card.title}</h3>
                 <p className="font-sans text-lg md:text-xl leading-relaxed text-white/80">{card.text}</p>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const activeIndex = useEraVisibility(ERAS.length);
  const [eraHeight, setEraHeight] = useState(3000); // Fallback

  useEffect(() => {
    const updateHeight = () => setEraHeight(window.innerHeight * 3);
    window.addEventListener('resize', updateHeight);
    updateHeight();
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useGSAP(() => {
    const numEras = ERAS.length;
    const totalScrollDistance = numEras * eraHeight - window.innerHeight;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.app-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    for (let i = 0; i < numEras - 1; i++) {
      const boundaryY = (i + 1) * eraHeight;
      const start = boundaryY - window.innerHeight;
      const duration = window.innerHeight;
      
      const curtainTl = gsap.timeline();
      curtainTl.to(`.global-curtain-${i} .curtain-shape`, { scale: 60, duration: duration, ease: 'power2.in' })
               .to(`.global-curtain-${i} .curtain-shape`, { scale: 0, duration: duration, ease: 'power2.out' });
               
      tl.add(curtainTl, start);
    }
    
    // Ensure the timeline spans the exact totalScroll length
    tl.to({}, { duration: totalScrollDistance }, 0);
  }, [eraHeight]);

  return (
    <div className="app-container relative w-full bg-black" style={{ height: ERAS.length * eraHeight }}>
      
      <div className="fixed top-6 left-6 md:top-10 md:left-10 z-50 pointer-events-none drop-shadow-2xl text-white">
        <p key={`id-${activeIndex}`} className="animate-slide-up text-xs md:text-sm font-mono tracking-widest text-white/70 mb-1">
          EST. {ERAS[activeIndex].id}
        </p>
        <h1 key={`title-${activeIndex}`} className="animate-slide-up-delayed font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase">
          {ERAS[activeIndex].title}
        </h1>
      </div>

      {ERAS.map((era, index) => {
        const isRendered = Math.abs(index - activeIndex) <= 1;
        return <EraContainer key={era.id} era={era} index={index} isRendered={isRendered} eraHeight={eraHeight} />;
      })}

      {Array.from({ length: ERAS.length - 1 }).map((_, i) => (
        <div key={i} className={`global-curtain-${i} fixed inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden`}>
          <div className="curtain-shape w-[10vw] h-[10vw] rounded-full bg-[#050505] scale-0" />
        </div>
      ))}
    </div>
  );
}
