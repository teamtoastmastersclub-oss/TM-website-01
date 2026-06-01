import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router";
import Typed from "typed.js";
import LiquidEther from "./LiquidEther";

// Register CSS Houdini Worklet once the module loads
const initHoudini = async () => {
  try {
    if (typeof CSS !== 'undefined' && 'paintWorklet' in CSS) {
      // Avoid adding multiple times in strict mode
      // @ts-ignore
      if (!window.__HOUDINI_LOADED) {
        // @ts-ignore
        CSS.paintWorklet.addModule('https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js');
        // @ts-ignore
        window.__HOUDINI_LOADED = true;
      }
    }
  } catch (err) {
    console.error("Houdini registration failed:", err);
  }
};

function AnimatedCounter({ value, duration = 2.5 }: { value: string | number, duration?: number }) {
  const [count, setCount] = useState(1);
  const targetStr = String(value);
  const match = targetStr.match(/(\d+)/);
  const target = match ? parseInt(match[1], 10) : 0;
  
  useEffect(() => {
    if (target === 0) {
      setCount(target);
      return;
    }
    
    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeProgress = progress; // linear easing for steady counting
      
      setCount(Math.floor(easeProgress * target) || 1);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    setCount(1);
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  const displayValue = target === 0 ? value : targetStr.replace(target.toString(), count.toString());

  return <>{displayValue}</>;
}

function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    initHoudini();

    const welcome = containerRef.current;
    if (!welcome) return;

    let isInteractive = false;
    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractive) { 
        welcome.classList.add('interactive'); 
        isInteractive = true; 
      }
      welcome.style.setProperty('--ring-x', ((e.clientX / window.innerWidth) * 100).toString());
      welcome.style.setProperty('--ring-y', ((e.clientY / window.innerHeight) * 100).toString());
      welcome.style.setProperty('--ring-interactive', '1');
    };

    const handlePointerLeave = () => {
      welcome.classList.remove('interactive'); 
      isInteractive = false;
      welcome.style.setProperty('--ring-x', '50');
      welcome.style.setProperty('--ring-y', '50');
      welcome.style.setProperty('--ring-interactive', '0');
    };

    welcome.addEventListener('pointermove', handlePointerMove);
    welcome.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      welcome.removeEventListener('pointermove', handlePointerMove);
      welcome.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto z-0"
      style={{
        // @ts-ignore - CSS properties
        '--ring-radius': 100,
        '--ring-thickness': 600,
        '--particle-count': 80,
        '--particle-rows': 25,
        '--particle-size': 2,
        '--particle-color': '#000000', /* black */
        '--particle-min-alpha': 0.4,
        '--particle-max-alpha': 1.0,
        '--seed': 200,
        '--ring-x': 50,
        '--ring-y': 50,
        'backgroundImage': 'paint(ring-particles)',
        'transition': '--ring-x 3s ease, --ring-y 3s ease',
        'animation': 'ripple 6s linear infinite, ring 6s ease-in-out infinite alternate',
      } as React.CSSProperties}
    />
  );
}

export function HeroSection() {
  const [stats, setStats] = useState([
    { label: "Active Members", value: "120" },
    { label: "Events Hosted", value: "50" },
    { label: "Awards Won", value: "30" },
  ]);
  const [heroContent, setHeroContent] = useState({
    title: "SPEAK WITH\nCONFIDENCE",
    subtitle: "KLECET Toastmasters Club — Where communication meets leadership, and potential becomes excellence."
  });

  const typedRef = useRef(null);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.heroCounts) {
          setStats(data.heroCounts.map((s:any) => ({ label: s.title, value: s.count })));
        }
        if (data.heroText) {
          setHeroContent({
            title: data.heroText.title,
            subtitle: data.heroText.subtitle
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!typedRef.current || !heroContent.title) return;

    // The exact param configuration from the user's reference file
    const typed = new Typed(typedRef.current, {
      strings: [heroContent.title],
      typeSpeed: 100, // Slower typing
      backSpeed: 50,  // Slower backspacing
      backDelay: 3000,
      showCursor: true,
      loop: true
    });

    return () => {
      typed.destroy();
    };
  }, [heroContent.title]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 md:pt-32 overflow-hidden bg-white">
      {/* Styles for specific antigravity effect required to be injected */}
      <style>{`
        @property --animation-tick { syntax: '<number>'; inherits: false; initial-value: 0; }
        @property --ring-radius { syntax: '<number> | auto'; inherits: false; initial-value: auto; }
        @property --ring-x { syntax: '<number>'; inherits: false; initial-value: 50; }
        @property --ring-y { syntax: '<number>'; inherits: false; initial-value: 50; }
        @property --ring-interactive { syntax: '<number>'; inherits: false; initial-value: 0; }

        @keyframes ripple { 0% { --animation-tick: 0; } 100% { --animation-tick: 1; } }
        @keyframes ring { 0% { --ring-radius: 150; } 100% { --ring-radius: 250; } }
      `}</style>
      
      {/* Background Particles Container */}
      <BackgroundParticles />

      <div className="container mx-auto px-6 relative z-10 pointer-events-none">
        <div className="max-w-6xl mx-auto text-center pointer-events-auto">
          {/* Main Headline */}
          <div className="mb-8 text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-none mb-6 whitespace-pre-wrap text-black min-h-[160px] md:min-h-[240px] lg:min-h-[300px] flex items-center justify-center">
              <span ref={typedRef}></span>
          </div>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto px-4 md:px-0 font-light"
          >
            {heroContent.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-10 md:mb-16"
          >
            <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-black text-white font-medium transition-all duration-300 group block text-center shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 relative overflow-hidden rounded-sm">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <LiquidEther
                  colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                  mouseForce={20}
                  cursorSize={100}
                  isViscous
                  viscous={30}
                  autoDemo
                />
              </div>
              <span className="flex items-center justify-center gap-2 relative z-10">
                Join Club
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/activities" className="w-full sm:w-auto px-10 py-4 border-2 border-black text-black font-medium hover:bg-gray-50 transition-all duration-300 group block text-center hover:-translate-y-1 bg-white/50 backdrop-blur-md">
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Explore Activities
              </span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto pt-8 border-t border-gray-200"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1 sm:gap-2 items-center justify-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
                  <AnimatedCounter value={stat.value} duration={4} />
                </div>
                <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider text-center leading-tight mx-auto max-w-[80%]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}