import { useScroll, useAnimationFrame } from "motion/react";
import { useRef } from "react";

interface CurvedScrollingTextProps {
  text: string;
}

export function CurvedScrollingText({ text }: CurvedScrollingTextProps) {
  // Use a large amount of text so it always spans the whole wide curved runway
  const repeatedText = Array(150).fill(text).join("  •  ");
  const textPathRef = useRef<SVGTextPathElement>(null);
  
  const baseOffset = useRef(0);
  const { scrollY } = useScroll();

  useAnimationFrame((time, delta) => {
    // Continuous base drift (increases offset to move left-to-right)
    baseOffset.current += delta * 0.05;
    
    // Add scroll input. Scroll down (positive scrollY) moves left-to-right (positive offset).
    // Disable scroll effect safely on mobile (width < 768px).
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const scrollContribution = isMobile ? 0 : scrollY.get() * 0.5; 
    
    const combined = baseOffset.current + scrollContribution;
    
    // Safely wrap the offset between -2000px and 0px regardless of positive/negative direction
    const mod = ((combined % 2000) + 2000) % 2000;
    const finalOffset = `${mod - 2000}px`; 
    
    if (textPathRef.current) {
      textPathRef.current.setAttribute("startOffset", finalOffset);
    }
  });

  return (
    <div className="relative py-10 md:py-20 overflow-hidden bg-white min-h-[250px] md:min-h-[300px] flex items-center justify-center">
      {/* 8000px wide SVG (original wide curve user liked), perfectly centered so it covers boundaries effortlessly */}
      <svg width="8000" height="400" viewBox="0 0 8000 400" className="absolute left-1/2 -translate-x-1/2 overflow-visible">
        <path id="curvePath" d="M 0,150 Q 4000,450 8000,150" fill="transparent" />
        <text className="text-4xl md:text-8xl lg:text-[8rem] font-black fill-black/90 tracking-wider">
          <textPath ref={textPathRef} href="#curvePath" textAnchor="start">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
