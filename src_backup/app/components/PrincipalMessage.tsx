import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Quote } from "lucide-react";
import principalImg from "../../assets/principal1.jpg";

export function PrincipalMessage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Scroll mapping for the width changing effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // The animation starts when the top of the card enters from the bottom, and finishes when the bottom of the card leaves out the top.
    offset: ["start end", "end start"]
  });

  // User requested: expands when entering from bottom, stays expanded when crossing, and shrinks when scrolling back up.
  // 0 = entering viewport from bottom
  // 0.4 = near center
  // 1 = leaving viewport from top
  const widthTransform = useTransform(scrollYProgress, [0, 0.4, 1], ["50%", "95%", "95%"]);

  // Custom Cursor interaction for Desktop
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const [principal, setPrincipal] = useState({
    name: "Dr. Rajesh Kumar",
    message: "In today's competitive world, communication and leadership skills are not just advantages—they are necessities. I encourage all students to actively participate in Toastmasters activities.",
    image: principalImg
  });

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.principal) {
          setPrincipal({
            ...data.principal,
            image: data.principal.image || principalImg
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isHovered) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    if (isHovered) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isHovered]);

  return (
    <section ref={containerRef} className="py-10 md:py-24 bg-gray-50 relative">
      
      {/* Custom Spring Animated Cursor (Desktop only, hidden when not hovering) */}
      {isHovered && (
        <motion.div
          className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[100] hidden md:flex items-center justify-center mix-blend-difference"
          animate={{ x: mousePos.x - 32, y: mousePos.y - 32, scale: isHovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
        >
          <div className="w-6 h-6 bg-yellow-400 rounded-full" />
        </motion.div>
      )}

      <div className="container mx-auto px-4 md:px-6 flex justify-center w-full">
        <motion.div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ "--desktop-width": widthTransform } as any}
          // The critical fix for shaking is applying a STRICT hard height (`h-auto lg:h-[700px]`) 
          // instead of `min-h`, meaning the layout mathematically cannot change size when text reflows.
          className="w-full lg:w-[var(--desktop-width,95%)] max-w-[1400px] h-auto lg:h-[700px] flex flex-col justify-center bg-black text-white rounded-[2.5rem] p-8 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden md:cursor-none transition-shadow duration-500 hover:shadow-yellow-500/10"
        >
          <div className="w-full max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="text-sm uppercase tracking-widest text-gray-400 mb-4 block">
                Leadership Speaks
              </span>
              <h2 className="text-5xl md:text-6xl font-bold">
                Message from Principal
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Quote className="absolute -top-4 -left-4 w-20 h-20 text-yellow-400 opacity-20" />
              
              <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-12 text-center italic whitespace-pre-wrap">
                "{principal.message}"
              </blockquote>

              <div className="flex items-center justify-center gap-6">
                <img src={principal.image} alt="Principal" className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400 drop-shadow-lg" />
                <div>
                  <div className="text-xl font-bold">{principal.name}</div>
                  <div className="text-gray-400">Principal, KLECET</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
