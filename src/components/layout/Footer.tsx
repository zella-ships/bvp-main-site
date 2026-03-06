'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

function SiteSearch() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+site:blackveteransproject.org`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blackveteransproject.org"
            className="w-full px-5 py-4 pr-14 bg-transparent border border-white/20 text-white/80 placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      <p className="text-white/30 text-xs tracking-widest uppercase mt-3">
        Powered by Google
      </p>
    </div>
  );
}

const footerLinks = {
  aboutUs: [
    { name: "Mission & Vision", href: "/about#mission" },
    { name: "Our Team", href: "/about#founders" },
    { name: "Partners", href: "/about#partners" },
  ],
  ourWork: [
    { name: "The Case for Repair", href: "/our-work#case-for-repair" },
    { name: "Impact Litigation", href: "/our-work#litigation" },
    { name: "Narrative Hub", href: "/our-work#narrative" },
    { name: "Mobilization", href: "/our-work#movement-building" },
  ],
  resources: [
    { name: "FAQ", href: "/faq" },
    { name: "Archived Press", href: "/press" },
    { name: "Financials & 990", href: "/financials" },
  ],
  takeAction: [
    { name: "Donate", href: "/donate" },
    { name: "Become a Member", href: "/join" },
    { name: "Contact", href: "/contact" },
  ],
};

// Reusable link component with hover animation
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={true}
      className="relative inline-block py-1.5 text-white/60 hover:text-white transition-colors group"
      style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)' }}
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-bvp-gold group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

// Column component for link groups
function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div className="min-w-[140px]">
      <h4 className="text-[11px] font-gunterz font-medium uppercase tracking-[0.2em] text-bvp-gold mb-4">
        {title}
      </h4>
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.name}>
            <FooterLink href={link.href}>{link.name}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content - Fluid padding */}
      <div
        className="max-w-[1400px] mx-auto"
        style={{ padding: 'clamp(2rem, 4vw, 4rem) clamp(1rem, 4vw, 5.75rem)' }}
      >
        {/*
          FLUID GRID: Links + Search
          - Uses CSS Grid with auto-fit so columns naturally reflow
          - Search takes full row on narrow, shares row on wide
        */}
        {/* Main content: Links + Search side by side, wraps on narrow */}
        <div className="flex flex-wrap gap-8 mb-8">
          {/* Links - 4 columns using flex, shrinks proportionally */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-x-8 gap-y-8" style={{ minWidth: 0 }}>
              <div className="flex-1 min-w-[120px]">
                <FooterColumn title="About Us" links={footerLinks.aboutUs} />
              </div>
              <div className="flex-1 min-w-[120px]">
                <FooterColumn title="Our Work" links={footerLinks.ourWork} />
              </div>
              <div className="flex-1 min-w-[120px]">
                <FooterColumn title="Resources" links={footerLinks.resources} />
              </div>
              <div className="flex-1 min-w-[120px]">
                <FooterColumn title="Take Action" links={footerLinks.takeAction} />
              </div>
            </div>
          </div>

          {/* Search - fixed width, wraps to new row on narrow */}
          <div className="w-full sm:w-auto sm:min-w-[300px] sm:max-w-[380px]">
            <SiteSearch />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div
          className="max-w-[1400px] mx-auto"
          style={{ padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 4vw, 5.75rem)' }}
        >
          {/*
            FLUID FLEX: Wraps naturally based on available space
            No hiding/showing - just wrapping
          */}
          <div className="flex flex-wrap items-center justify-between gap-6">

            {/* Left side: Logo + Copyright + Links - wraps as needed */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Logo - always visible, scales slightly */}
              <Image
                src="/images/BVP-logo.png"
                alt="Black Veterans Project"
                width={100}
                height={50}
                className="h-[40px] w-auto brightness-0 invert"
              />

              {/* Copyright & Legal Links */}
              <div className="flex flex-col gap-1.5 text-white/50" style={{ fontSize: 'clamp(0.8125rem, 1.2vw, 0.9375rem)' }}>
                <span>© {new Date().getFullYear()} Black Veterans Project. 501(c)(3)</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link href="/privacy" className="relative hover:text-white transition-colors group">
                    Privacy
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-bvp-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                  <span className="text-white/20">·</span>
                  <Link href="/terms" className="relative hover:text-white transition-colors group">
                    Terms
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-bvp-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                  <span className="text-white/20">·</span>
                  <Link href="/accessibility" className="relative hover:text-white transition-colors group">
                    Accessibility
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-bvp-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                  <span className="text-white/20">·</span>
                  <Link href="/design-system" className="relative hover:text-white transition-colors group">
                    Design
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-bvp-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side: Social Icons + Guidestar - wraps to new row if needed */}
            <div className="flex flex-wrap items-center gap-1">
              <a href="https://x.com/BlackVetProject" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-bvp-gold transition-colors" aria-label="Follow us on X (formerly Twitter)">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/BlackVeteransProject" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-bvp-gold transition-colors" aria-label="Follow us on Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/BlackVeteransProject/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-bvp-gold transition-colors" aria-label="Follow us on Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/black-veterans-project/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-bvp-gold transition-colors" aria-label="Follow us on LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@blackveteransproject8335" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-bvp-gold transition-colors" aria-label="Subscribe to our YouTube channel">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://blackveteransproject.substack.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-bvp-gold transition-colors" aria-label="Read our Substack">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
              </a>

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 mx-2" />

              {/* Candid Link */}
              <a
                href="https://app.candid.org/profile/10975567/black-veterans-project-83-4476025"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] font-gunterz font-medium uppercase tracking-[0.15em] text-white/50 hover:text-bvp-gold transition-colors"
              >
                Candid
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
