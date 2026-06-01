import { motion } from "motion/react";
import { Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import { useState, useEffect } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [footerSettings, setFooterSettings] = useState({
    logo: logo,
    quickLinks: [
      { name: "Home", url: "#" },
      { name: "About", url: "#about" },
      { name: "Activities", url: "/activities" },
      { name: "Team", url: "/team" }
    ],
    contact: {
      phone: { value: "+91 98765 43210", visible: true },
      email: { value: "teamtoastmastersclub@gmail.com", visible: true },
      address: { name: "KLE College of Engineering, Belgaum", visible: true }
    }
  });

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.footer) {
          setFooterSettings({
            ...data.footer,
            logo: data.footer.logo || logo
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left - CTA */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform
              <br />
              Your Future?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join KLECET Toastmasters Club today and start your journey to becoming a confident
              speaker and inspiring leader.
            </p>
            <Link to="/signup" className="group px-10 py-4 bg-yellow-400 text-black font-medium hover:bg-yellow-500 transition-all duration-300 inline-flex items-center gap-3">
              Become a Member
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right - Links */}
          <div className="grid grid-cols-[1fr_1.5fr] md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", url: "#home" },
                  { name: "About", url: "#about" },
                  { name: "Activities", url: "/activities" },
                  { name: "Team", url: "/team" },
                  { name: "Resource", url: "#" },
                  { name: "Doc", url: "#" }
                ].map((link, i) => (
                  <li key={i}>
                    {link.url.startsWith('/') ? (
                      <Link to={link.url} className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-all duration-300 group">
                        <span className="group-hover:-translate-x-1 transition-transform duration-300">{link.name}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0 transition-all duration-300 text-yellow-400" />
                      </Link>
                    ) : (
                      <a href={link.url} onClick={(e) => {
                        if (link.url === '#home') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }} className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-all duration-300 group">
                        <span className="group-hover:-translate-x-1 transition-transform duration-300">{link.name}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0 transition-all duration-300 text-yellow-400" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Contact</h3>
              <ul className="space-y-4 text-gray-300">
                {footerSettings.contact.address?.visible && (
                  <li className="flex items-start gap-2 group cursor-pointer">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-400 group-hover:scale-125 transition-transform" />
                    <a href="https://www.google.com/maps/dir//K.L.E.+College+of+Engineering+%26+Technology,+Banantikodi+Road,+Chikodi,+Belgaum,+Karnataka+591201/@16.4413912,74.6049057,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bc0c21b94947f8b:0xb26d98fea8c2b6c8!2m2!1d74.6108676!2d16.4379515?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-sm group-hover:text-white transition-colors">{footerSettings.contact.address.name}</a>
                  </li>
                )}
                {footerSettings.contact.email?.visible && (
                  <li className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                    <Mail className="w-4 h-4 flex-shrink-0 text-yellow-400 group-hover:scale-125 transition-transform" />
                    <span className="text-xs sm:text-sm break-all">{footerSettings.contact.email.value}</span>
                  </li>
                )}
                {footerSettings.contact.phone?.visible && (
                  <li className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                    <Phone className="w-4 h-4 flex-shrink-0 text-yellow-400 group-hover:scale-125 transition-transform" />
                    <span className="text-sm">{footerSettings.contact.phone.value}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Link to="/admin-login" className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden drop-shadow-md p-1" title="Admin Portal">
                <img src={footerSettings.logo} alt="TM Logo" className="w-full h-full object-contain" />
              </Link>
              <h3 className="text-2xl font-bold">
                KLECET<span className="text-yellow-400">.</span>
              </h3>
              <span className="text-xs text-gray-500">TOASTMASTERS</span>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/club.toastmasters?igsh=MXQ0aHZ5MmZqazZoYw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 flex items-center justify-center transition-all duration-500 group hover:rounded-full"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 flex items-center justify-center transition-all duration-500 group hover:rounded-full"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} KLECET Toastmasters Club. All rights reserved.</p>
            <p className="text-center">
              Designed and Developed by{" "}
              <a 
                href="https://www.linkedin.com/in/masoom-mulla-5a85062a4/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold relative inline-block group hover:text-white transition-colors text-gray-300"
              >
                Masoom
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}