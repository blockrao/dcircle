'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-blue-400 transition">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </span>
          <span>DallasCircle</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-300 hover:text-white transition text-sm font-medium">
            Home
          </Link>
          <Link href="/about" className="text-slate-300 hover:text-white transition text-sm font-medium">
            About
          </Link>
          <Link href="#articles" className="text-slate-300 hover:text-white transition text-sm font-medium">
            Articles
          </Link>
          <Link href="/php-rescue" className="text-slate-300 hover:text-white transition text-sm font-medium">
            Services
          </Link>
          <Link href="/faq" className="text-slate-300 hover:text-white transition text-sm font-medium">
            FAQ
          </Link>
          <a href="mailto:hello@dallascircle.com" className="text-slate-300 hover:text-white transition text-sm font-medium">
            Contact
          </a>
          <a
            href="mailto:hello@dallascircle.com"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700/50 bg-slate-800/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4">
            <Link href="/" className="text-slate-300 hover:text-white transition text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition text-sm font-medium">
              About
            </Link>
            <Link href="#articles" className="text-slate-300 hover:text-white transition text-sm font-medium">
              Articles
            </Link>
            <Link href="/php-rescue" className="text-slate-300 hover:text-white transition text-sm font-medium">
              Services
            </Link>
            <Link href="/faq" className="text-slate-300 hover:text-white transition text-sm font-medium">
              FAQ
            </Link>
            <a href="mailto:hello@dallascircle.com" className="text-slate-300 hover:text-white transition text-sm font-medium">
              Contact
            </a>
            <a
              href="mailto:hello@dallascircle.com"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
