"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Projects", href: "#projects", external: false },
  { label: "Experience", href: "#experience", external: false },
  { label: "Skills", href: "#skills", external: false },
  { label: "Certifications", href: "#certifications", external: false },
  { label: "V1", href: "https://v1.the-whiz.dev", external: true },
  { label: "V2", href: "https://v2.the-whiz.dev", external: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const sectionRatios = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRatios.current[entry.target.id] = entry.intersectionRatio;
        });

        const activeId = Object.keys(sectionRatios.current).reduce((a, b) => 
          sectionRatios.current[a] > sectionRatios.current[b] ? a : b
        );
        
        if (sectionRatios.current[activeId] > 0) {
          setActiveSection(activeId);
        }
      },
      { 
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: "-40% 0px -40% 0px" 
      }
    );

    const observeSections = () => {
      const sections = document.querySelectorAll("section[id]");
      if (sections.length === 0) {
        // Retry if Next.js Server Components haven't streamed into the DOM yet
        setTimeout(observeSections, 100);
        return;
      }
      sections.forEach((section) => {
        observer.observe(section);
      });
    };

    observeSections();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 animate-slide-down transition-[background-color,padding,backdrop-filter] duration-300",
        isScrolled ? "glass py-2 border-b border-white/5" : "py-2 bg-transparent border-b border-transparent"
      )}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link 
          href="/" 
          aria-label="Home"
          className="relative w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform duration-300"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image 
            src="/assets/img/navbar-logo.webp" 
            alt="TheWhiz Logo" 
            fill 
            className="object-contain scale-[1.0]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  className={cn(
                    "relative px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium group overflow-hidden",
                    item.external
                      ? "text-primary hover:text-primary/80 hover:bg-primary/10"
                      : isActive 
                        ? "text-primary bg-primary/10 border border-primary/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                        : "text-muted-foreground hover:text-white"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {!isActive && !item.external && (
                    <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation - keep AnimatePresence for mobile menu only */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/5"
          >
            <ul className="container mx-auto px-6 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "transition-colors duration-200 text-base font-medium block py-3 px-4 hover:bg-white/5 rounded-lg",
                      item.external
                        ? "text-primary hover:text-primary/80"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
