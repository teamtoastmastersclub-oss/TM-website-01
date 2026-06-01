import { useState, useEffect, useNavigate } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import LiquidEther from "./LiquidEther";
import PillNav from "./PillNav";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Activities", href: "/activities" },
    { name: "Team", href: "/team" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.substring(1);
      if (window.location.pathname !== '/') {
        // We aren't on the landing page, perform strict redirect
        window.location.href = href;
      } else {
        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    }
    // If it's a standard path like /activities, <Link> handles it natively
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-2xl font-bold tracking-tight cursor-pointer" onDoubleClick={() => navigate('/principal-login')}>
              KLECET<span className="text-yellow-600">.</span>
            </h1>
            <p className="text-xs text-gray-500 tracking-wider">TOASTMASTERS</p>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center -ml-8">
            <PillNav
              items={navLinks.map(link => ({
                label: link.name,
                href: link.href,
                onClick: handleNavClick
              }))}
              activeHref={window.location.pathname === '/' ? window.location.hash || '/#home' : window.location.pathname}
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="transparent"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#374151"
              initialLoadAnimation={false}
            />
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block"
          >
            <Link
              to="/signup"
              className="px-8 py-3 bg-black text-white text-sm font-medium transition-all duration-300 inline-flex items-center justify-center relative overflow-hidden group hover:shadow-lg rounded-sm"
            >
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
              <span className="relative z-10">Join Club</span>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-black p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-700 hover:text-black transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/signup" className="mt-4 px-8 py-3 bg-black text-white text-sm font-medium block text-center" onClick={() => setIsMobileMenuOpen(false)}>
                Join Club
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}