import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { BorderGlow } from "./BorderGlow";

export function WhyToastmasters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [benefits, setBenefits] = useState<any[]>([
    {
      title: "Master Public Speaking",
      description: "Overcome stage fright and speak confidently in front of any audience with structured practice.",
    },
    {
      title: "Develop Leadership",
      description: "Take on club roles and develop essential leadership capabilities through hands-on experience.",
    },
    {
      title: "Critical Thinking",
      description: "Enhance analytical skills through Table Topics and impromptu speeches that challenge your mind.",
    },
    {
      title: "Career Growth",
      description: "Gain skills that employers value most: communication, leadership, and professional presence.",
    },
    {
      title: "Supportive Community",
      description: "Learn and grow in a positive, encouraging environment with like-minded individuals.",
    },
    {
      title: "Recognition & Awards",
      description: "Earn awards and track your progress through structured pathways and competitions.",
    },
  ]);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whyJoinUs && data.whyJoinUs.length > 0) {
          setBenefits(data.whyJoinUs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="why" ref={ref} className="py-10 md:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Heading */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={isInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8 }}
           className="max-w-4xl mb-10 md:mb-20"
        >
          <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">
            Why Join Us
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your Future with Toastmasters
          </h2>
          <p className="text-xl text-gray-600">
            Discover the benefits that have transformed thousands of lives
          </p>
        </motion.div>

        {/* Horizontal Scrolling Cards (Desktop) / Vertical Stack (Mobile) */}
        <div className="relative group">
          <style>{`
            @keyframes scroll-cards {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-1 * (24rem + 1.5rem) * ${benefits.length})); }
            }
            @media (min-width: 768px) {
              .animate-scroll-cards {
                /* Slower scroll based on container amount */
                animation: scroll-cards 30s linear infinite;
              }
              .group:hover .animate-scroll-cards {
                animation-play-state: paused;
              }
            }
          `}</style>

          {/* Mobile view: Stack view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden pb-8 pt-4">
            {benefits.map((benefit: any, index: number) => (
              <BorderGlow
                key={index}
                className="w-full text-left"
                backgroundColor="#ffffff"
                glowColor="40 80 80"
                colors={['#f59e0b', '#d97706', '#b45309']}
                borderRadius={12}
                glowRadius={30}
              >
                <div className="p-6 transition-all duration-300">
                  <div className="text-5xl font-bold text-gray-200 mb-3 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{benefit.description}</p>
                </div>
              </BorderGlow>
            ))}
          </div>

          {/* Desktop view: Continuous Horizontal Scroll */}
          <div className="hidden md:flex gap-6 w-max animate-scroll-cards py-8">
            {/* Duplicate the array for continuous scroll */}
            {[...benefits, ...benefits, ...benefits].map((benefit: any, index: number) => (
              <div key={index} className="flex-shrink-0 w-96 group/card">
                <BorderGlow
                  className="w-full h-full text-left"
                  backgroundColor="#ffffff"
                  glowColor="40 80 80"
                  colors={['#f59e0b', '#d97706', '#b45309']}
                  borderRadius={12}
                  glowRadius={40}
                >
                  <div className="p-8 transition-all duration-300 h-full flex flex-col">
                    <div className="text-6xl font-bold text-gray-200 mb-4 group-hover/card:text-amber-500/30 transition-colors">
                      {String((index % benefits.length) + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-1">{benefit.description}</p>
                  </div>
                </BorderGlow>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
