'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Fuel, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
            <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center group-hover:bg-accent/25 transition-colors">
              <Fuel className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold tracking-figma text-text-primary">
              DALLY SRL
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#inicio"
              className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors"
            >
              Inicio
            </a>
            <a
              href="#servicios"
              className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors"
            >
              Servicios
            </a>
            <a
              href="#nosotros"
              className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors"
            >
              Contacto
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/login"
              id="nav-login-btn"
              className="bg-accent hover:bg-accent-hover text-background font-semibold text-sm tracking-figma px-6 py-2.5 rounded transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              INICIAR SESIÓN
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-primary p-2"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-border mt-2 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#inicio" className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Inicio
              </a>
              <a href="#servicios" className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Servicios
              </a>
              <a href="#nosotros" className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Nosotros
              </a>
              <a href="#contacto" className="text-sm tracking-figma text-text-secondary hover:text-text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                Contacto
              </a>
              <Link
                href="/login"
                className="bg-accent hover:bg-accent-hover text-background font-semibold text-sm tracking-figma px-6 py-2.5 rounded text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                INICIAR SESIÓN
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
