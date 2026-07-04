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
    scrollLength: 250, // 250vh
    themeClass: "text-amber-100",
    bgClass: "bg-amber-950",
    midShapes: "bg-amber-800/40",
    fgShapes: "border-amber-500/30",
    content: {
      headline: "The Age of Reason",
      description: "A philosophical movement that dominated in Europe during the 18th century, centered around the idea that reason is the primary source of authority and legitimacy.",
      stats: [
        { label: "Global Population", value: "~790M" },
        { label: "Literacy Rate (Est)", value: "60%" }
      ],
      media: "https://images.unsplash.com/photo-1550592704-6c7bdef5aaf8?q=80&w=2000&auto=format&fit=crop",
    }
  },
  {
    id: "1850",
    title: "The Industrial Age",
    scrollLength: 350,
    themeClass: "text-stone-100",
    bgClass: "bg-stone-900",
    midShapes: "bg-stone-700/40",
    fgShapes: "border-stone-400/30",
    content: {
      headline: "Rise of the Machines",
      description: "The transition to new manufacturing processes in Great Britain, continental Europe, and the United States, marking a major turning point in history.",
      stats: [
        { label: "Global Population", value: "~1.2B" },
        { label: "Urbanization", value: "15%" }
      ],
      media: "https://images.unsplash.com/photo-1518177114620-80fb2b7571fa?q=80&w=2000&auto=format&fit=crop",
    }
  },
  {
    id: "1900",
    title: "The Gilded Age",
    scrollLength: 300,
    themeClass: "text-yellow-100",
    bgClass: "bg-neutral-950",
    midShapes: "bg-yellow-900/30",
    fgShapes: "border-yellow-600/30",
    content: {
      headline: "Wealth and Inequality",
      description: "An era of rapid economic growth, especially in the Northern and Western United States, characterized by industrialization, railways, and massive wealth accumulation.",
      stats: [
        { label: "Railroad Mileage", value: "200k+" },
        { label: "Immigration (US)", value: "11M+" }
      ],
      media: "https://images.unsplash.com/photo-1617468176841-f761fc7260cb?q=80&w=2000&auto=format&fit=crop",
    }
  },
  {
    id: "1950",
    title: "The Atomic Age",
    scrollLength: 350,
    themeClass: "text-teal-50",
    bgClass: "bg-teal-950",
    midShapes: "bg-teal-800/40",
    fgShapes: "border-teal-400/30",
    content: {
      headline: "Space and Science",
      description: "The period of history following the detonation of the first nuclear weapon, marked by the Space Race, Cold War paranoia, and tremendous scientific leaps.",
      stats: [
        { label: "Global Population", value: "2.5B" },
        { label: "Moon Landings", value: "6" }
      ],
      media: "https://images.unsplash.com/photo-1541186877-bb5a745edde5?q=80&w=2000&auto=format&fit=crop",
    }
  },
  {
    id: "2000",
    title: "The Info Age",
    scrollLength: 250,
    themeClass: "text-indigo-50",
    bgClass: "bg-slate-950",
    midShapes: "bg-indigo-900/40",
    fgShapes: "border-indigo-400/30",
    content: {
      headline: "The Digital Shift",
      description: "Characterized by a rapid shift from traditional industry to an economy primarily based upon information technology, fundamentally changing human connection.",
      stats: [
        { label: "Internet Users", value: "5.3B" },
        { label: "Smartphones", value: "6.8B" }
      ],
      media: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    }
  }
];

function useEraLayouts() {
  const [windowHeight, setWindowHeight] = useState(3000);

  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', updateHeight);
    updateHeight();
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return React.useMemo(() => {
    let currentTop = 0;
    return ERAS.map(era => {
      const height = (era.scrollLength * windowHeight) / 100;
      const layout = {
        top: currentTop,
        height,
        boundary: currentTop + height,
      };
      currentTop += height;
      return layout;
    });
  }, [windowHeight]);
}

function useEraVisibility(eraLayouts: { top: number; boundary: number }[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (eraLayouts.length === 0) return;
      const scrollY = window.scrollY;
      let newIndex = 0;
      for (let i = 0; i < eraLayouts.length; i++) {
        // Change active index exactly at the boundary (with a small 10px buffer)
        if (scrollY + 10 < eraLayouts[i].boundary) {
          newIndex = i;
          break;
        }
        newIndex = i;
      }
      setActiveIndex(Math.max(0, Math.min(eraLayouts.length - 1, newIndex)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [eraLayouts]);

  return activeIndex;
}

function EraContainer({ era, index, isRendered, layout }: { key?: React.Key, era: typeof ERAS[0], index: number, isRendered: boolean, layout: { top: number, height: number, boundary: number } }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isRendered || layout.height === 0) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    });

    // We lay them out in a wide horizontal track.
    // The layer-content is w-max, so we translate it precisely to its end.
    tl.to('.layer-bg', { x: '-50vw', ease: 'none', duration: 0.75 }, 0)
      .to('.layer-mid', { x: '-100vw', ease: 'none', duration: 0.75 }, 0)
      .to('.layer-content', { 
        x: () => {
          const el = containerRef.current?.querySelector('.layer-content');
          return el ? -(el.scrollWidth - window.innerWidth) : 0;
        }, 
        ease: 'none', 
        duration: 0.75 
      }, 0)
      .to('.layer-fg', { x: '-200vw', ease: 'none', duration: 0.75 }, 0)
      // Extra parallax for the image inside its container
      .to('.media-img', { x: '-20%', ease: 'none', duration: 0.75 }, 0)
      // Add a hold at the end of the timeline so the user can read the stats before the curtain triggers
      .to({}, { duration: 0.25 });

  }, { scope: containerRef, dependencies: [isRendered, layout.height] });

  return (
    <div 
      ref={containerRef} 
      className="absolute w-full" 
      style={{ top: layout.top, height: layout.height }} 
      data-index={index}
    >
      {isRendered && (
        <div className={clsx("sticky top-0 w-full overflow-hidden flex flex-col items-start justify-center", era.themeClass, era.bgClass)} style={{ height: '100vh' }}>
          
          <div className="layer-bg absolute flex items-center h-full w-[150vw] pointer-events-none">
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:64px_64px]" />
             <div className="absolute left-[80vw] text-[40vh] font-black opacity-5 whitespace-nowrap">{era.id}</div>
          </div>

          <div className="layer-mid absolute flex items-center h-full w-[200vw] pointer-events-none mix-blend-screen">
             <div className={clsx("absolute top-[20%] left-[10vw] w-[40vw] h-[40vw] rounded-full blur-[100px]", era.midShapes)} />
             <div className={clsx("absolute bottom-[10%] left-[80vw] w-[50vw] h-[50vw] rounded-full blur-[120px]", era.midShapes)} />
             <div className={clsx("absolute top-[40%] left-[120vw] w-[30vw] h-[30vw] rounded-full blur-[80px]", era.midShapes)} />
          </div>
          
          <div className="layer-content absolute flex items-center h-full w-max z-10">
             <div className="w-[10vw] shrink-0" /> {/* Left Padding */}
             
             <div className="w-[85vw] md:w-[70vw] shrink-0 pr-10 flex flex-col justify-center">
               <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tighter">{era.content.headline}</h2>
               <p className="font-sans text-xl md:text-2xl leading-relaxed text-white/70 max-w-lg">
                 {era.content.description}
               </p>
             </div>

             <div className="w-[85vw] md:w-[80vw] shrink-0 px-4 md:px-10 relative flex justify-center">
               <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/10">
                 <img src={era.content.media} alt={era.content.headline} className="media-img absolute inset-0 w-[120%] h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
               </div>
             </div>

             <div className="w-[80vw] md:w-[40vw] shrink-0 px-10 md:px-0 flex flex-col justify-center gap-10 md:gap-12">
               {era.content.stats.map((stat, i) => (
                 <div key={i} className="border-l-2 border-white/20 pl-6 md:pl-8">
                   <div className="font-sans text-sm md:text-lg text-white/50 mb-2 uppercase tracking-widest">{stat.label}</div>
                   <div className="font-display text-4xl md:text-6xl font-light tracking-tighter">{stat.value}</div>
                 </div>
               ))}
             </div>
             
             {/* Padding at the end to allow the stats container to be centered */}
             <div className="w-[10vw] md:w-[30vw] shrink-0" />
          </div>

          <div className="layer-fg absolute flex items-center h-full w-[300vw] pointer-events-none z-50">
             <div className={clsx("absolute top-[20%] left-[50vw] w-[15vw] h-[15vw] border-[4px] rounded-full mix-blend-overlay blur-[2px]", era.fgShapes)} />
             <div className={clsx("absolute top-[70%] left-[150vw] w-[25vw] h-[25vw] border-[8px] rotate-12 mix-blend-overlay blur-sm", era.fgShapes)} />
             <div className={clsx("absolute top-[15%] left-[250vw] w-[30vw] h-[30vw] border-[6px] rotate-45 mix-blend-overlay blur-md", era.fgShapes)} />
             
             <div className="absolute bottom-[20%] left-[100vw] text-[8rem] font-black opacity-[0.03] mix-blend-overlay font-sans tracking-tighter">{era.id}</div>
             <div className="absolute top-[15%] left-[220vw] text-[10rem] font-black opacity-[0.03] mix-blend-overlay font-display tracking-tighter">PROGRESS</div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function App() {
  const eraLayouts = useEraLayouts();
  const activeIndex = useEraVisibility(eraLayouts);

  useGSAP(() => {
    const numEras = ERAS.length;
    if (eraLayouts.length === 0) return;
    const totalScrollDistance = eraLayouts[eraLayouts.length - 1].boundary - window.innerHeight;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.app-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Ensure the timeline spans the exact totalScroll length
    tl.to({}, { duration: totalScrollDistance }, 0);
  }, [eraLayouts]);

  const containerHeight = eraLayouts.length > 0 ? eraLayouts[eraLayouts.length - 1].boundary : 3000;

  return (
    <div className="app-container relative w-full bg-black" style={{ height: containerHeight }}>
      
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
        const layout = eraLayouts[index] || { top: 0, height: 0, boundary: 0 };
        return <EraContainer key={era.id} era={era} index={index} isRendered={isRendered} layout={layout} />;
      })}

    </div>
  );
}
