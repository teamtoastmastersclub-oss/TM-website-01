import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  children: React.ReactNode;
}

export function Preloader({ children }: PreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Connectors
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const line4Ref = useRef<HTMLDivElement>(null);

  // Blocks
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const block4Ref = useRef<HTMLDivElement>(null);

  // Grids
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeMessage, setActiveMessage] = useState(0);

  const messages = [
    "INITIALIZING",
    "DATA_TRANSFER",
    "COMPILING",
    "FINALIZING",
    "COMPLETE"
  ];

  useEffect(() => {
    const p = { val: 0 };
    
    gsap.to(p, {
      val: 100,
      duration: 6, // Smooth 6 second load as requested
      ease: "power1.inOut",
      onUpdate: () => {
        const prog = Math.floor(p.val);
        
        if (countRef.current) countRef.current.innerText = prog.toString();
        if (progressRef.current) progressRef.current.style.width = `${prog}%`;
        
        const msgIdx = Math.min(4, Math.floor(prog / 20));
        setActiveMessage(msgIdx);

        if (prog >= 0 && line1Ref.current) line1Ref.current.style.transform = `scaleX(${Math.min(1, (prog - 0) / 25)})`;
        if (prog >= 25 && line2Ref.current) line2Ref.current.style.transform = `scaleX(${Math.min(1, (prog - 25) / 25)})`;
        if (prog >= 50 && line3Ref.current) line3Ref.current.style.transform = `scaleX(${Math.min(1, (prog - 50) / 25)})`;
        if (prog >= 75 && line4Ref.current) line4Ref.current.style.transform = `scaleX(${Math.min(1, (prog - 75) / 25)})`;

        if (prog >= 20 && block1Ref.current) block1Ref.current.style.transform = `scale(${Math.min(1, (prog - 20) / 20)})`;
        if (prog >= 40 && block2Ref.current) block2Ref.current.style.transform = `scale(${Math.min(1, (prog - 40) / 20)})`;
        if (prog >= 60 && block3Ref.current) block3Ref.current.style.transform = `scale(${Math.min(1, (prog - 60) / 20)})`;
        if (prog >= 80 && block4Ref.current) block4Ref.current.style.transform = `scale(${Math.min(1, (prog - 80) / 20)})`;

        if (topRowRef.current) topRowRef.current.style.width = `${prog}%`;
        if (bottomRowRef.current) bottomRowRef.current.style.width = `${prog}%`;
        if (leftColRef.current) leftColRef.current.style.height = `${prog}%`;
        if (rightColRef.current) rightColRef.current.style.height = `${prog}%`;
      },
      onComplete: () => {
        // Prepare to show children
        setReady(true);
        // Slide away preloader
        gsap.to(preloaderRef.current, {
          y: "-100%",
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            setLoading(false);
          }
        });
      }
    });
  }, []);

  return (
    <>
      <div 
        ref={preloaderRef} 
        className="gsap-preloader"
        style={{ display: loading ? 'flex' : 'none' }}
      >
        <div className="pixel-grid">
          <div className="pixel-row" id="top-row" ref={topRowRef}></div>
          <div className="pixel-row" id="bottom-row" ref={bottomRowRef}></div>
          <div className="pixel-column" id="left-column" ref={leftColRef}></div>
          <div className="pixel-column" id="right-column" ref={rightColRef}></div>
        </div>

        <div className="counter-wrapper">
          <div className="counter" ref={countRef}>0</div>
          <div className="counter-outline" aria-hidden="true">0</div>
        </div>

        <div className="text-container">
          <div className="loading-text">LOADING SYSTEM</div>
          <div className="system-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${activeMessage === i ? 'active' : ''}`}>{msg}</div>
            ))}
          </div>
        </div>

        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="progress" ref={progressRef}></div>
          </div>
          <div className="loading-bar-markers">
            <div className="marker" style={{ opacity: activeMessage >= 0 ? 1 : 0.6 }}>00</div>
            <div className="marker" style={{ opacity: activeMessage >= 1 ? 1 : 0.6 }}>25</div>
            <div className="marker" style={{ opacity: activeMessage >= 2 ? 1 : 0.6 }}>50</div>
            <div className="marker" style={{ opacity: activeMessage >= 3 ? 1 : 0.6 }}>75</div>
            <div className="marker" style={{ opacity: activeMessage >= 4 ? 1 : 0.6 }}>100</div>
          </div>
          <div className="connector-lines">
            <div className="connector-line" id="line-0-25" ref={line1Ref}></div>
            <div className="connector-line" id="line-25-50" ref={line2Ref}></div>
            <div className="connector-line" id="line-50-75" ref={line3Ref}></div>
            <div className="connector-line" id="line-75-100" ref={line4Ref}></div>
          </div>
        </div>

        <div className="block-container">
          <div className="block" id="block-1" ref={block1Ref}></div>
          <div className="block" id="block-2" ref={block2Ref}></div>
          <div className="block" id="block-3" ref={block3Ref}></div>
          <div className="block" id="block-4" ref={block4Ref}></div>
        </div>
      </div>
      
      <div 
        className="content-wrapper" 
        style={{ 
          opacity: ready ? 1 : 0, 
          transition: 'opacity 0.8s ease-out',
          visibility: ready ? 'visible' : 'hidden',
          minHeight: '100vh',
          width: '100%' 
        }}
      >
        {children}
      </div>
    </>
  );
}
