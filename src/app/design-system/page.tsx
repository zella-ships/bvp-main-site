'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * DESIGN SYSTEM VISUAL REFERENCE
 *
 * Shows all spacing, typography, colors with exact pixel values
 * Use this page to screenshot and annotate what needs adjustment
 */

export default function DesignSystemPage() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [breakpoint, setBreakpoint] = useState('');

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });

      if (width < 640) setBreakpoint('xs (mobile)');
      else if (width < 768) setBreakpoint('sm (large mobile)');
      else if (width < 1024) setBreakpoint('md (tablet)');
      else if (width < 1280) setBreakpoint('lg (laptop)');
      else if (width < 1536) setBreakpoint('xl (desktop)');
      else setBreakpoint('2xl (large desktop)');
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <>
      {/* Hide donate side tab on design system page */}
      <style>{`[aria-label="Donate to Black Veterans Project"][style*="writing-mode"] { display: none !important; }`}</style>

      <div className="min-h-screen bg-white">
        {/* Site Header */}
        <Header />

      {/* Hero Section with Intro */}
      <section className="bg-gradient-to-b from-black via-black to-bvp-gold/10 pt-32 md:pt-40 pb-12 md:pb-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Title Area */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-bvp-gold mb-3">Design System</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-gunterz">
              BVP Spec v2.0
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-white/80 max-w-3xl">
              The single source of truth for the Black Veterans Project digital experience.
              This system defines our typography, spacing, colors, and components to ensure
              consistency across all platforms and touchpoints.
            </p>
          </div>

          {/* GitHub-style Metadata */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/50">Last updated:</span>
              <span className="font-mono font-bold text-white">Mar 6, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-white/50">Version:</span>
              <span className="font-mono bg-bvp-gold px-2 py-0.5 rounded font-bold text-black">v2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-white/50">Commit:</span>
              <a href="#" className="font-mono text-bvp-gold hover:underline">a3f7c2d</a>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-white/50">Maintainer:</span>
              <span className="font-medium text-white">BVP Engineering</span>
            </div>
          </div>

          {/* Live Viewport Indicator */}
          <div className="mt-8 inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
            <div className="text-bvp-gold font-mono text-lg font-bold">
              {viewport.width} × {viewport.height}
            </div>
            <div className="text-sm text-white/60">{breakpoint}</div>
          </div>
        </div>
      </section>

      {/* Quick Nav - Sticky below header */}
      <nav className="sticky top-0 z-40 bg-white border-b-4 border-black shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex gap-4 md:gap-6 overflow-x-auto">
          <a href="#breakpoints" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Breakpoints</a>
          <a href="#container" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Container</a>
          <a href="#section-padding" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Section Padding</a>
          <a href="#spacing-scale" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Spacing Scale</a>
          <a href="#typography" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Typography</a>
          <a href="#ios-hig" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">iOS HIG</a>
          <a href="#colors" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Colors</a>
          <a href="#components" className="text-sm font-bold hover:text-bvp-gold whitespace-nowrap transition-colors">Components</a>
        </div>
      </nav>

      <main>
        {/* ===================== BREAKPOINTS ===================== */}
        <section id="breakpoints" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-gunterz">Breakpoints</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-black">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="text-left p-4 font-mono">Name</th>
                    <th className="text-left p-4 font-mono">Min Width</th>
                    <th className="text-left p-4 font-mono">Tailwind</th>
                    <th className="text-left p-4 font-mono">Target Devices</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  <tr className="border-b-2 border-black bg-bvp-gold/10">
                    <td className="p-4 font-bold">Default</td>
                    <td className="p-4">0px</td>
                    <td className="p-4 text-gray-500">(no prefix)</td>
                    <td className="p-4">Small phones (iPhone SE)</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-4 font-bold">sm</td>
                    <td className="p-4 text-bvp-gold">640px</td>
                    <td className="p-4">sm:</td>
                    <td className="p-4">Large phones (iPhone Pro Max)</td>
                  </tr>
                  <tr className="border-b-2 border-black bg-gray-50">
                    <td className="p-4 font-bold">md</td>
                    <td className="p-4 text-bvp-gold">768px</td>
                    <td className="p-4">md:</td>
                    <td className="p-4">Tablets (iPad Mini)</td>
                  </tr>
                  <tr className="border-b-2 border-black">
                    <td className="p-4 font-bold">lg</td>
                    <td className="p-4 text-bvp-gold">1024px</td>
                    <td className="p-4">lg:</td>
                    <td className="p-4">Small laptops, tablets landscape</td>
                  </tr>
                  <tr className="border-b-2 border-black bg-gray-50">
                    <td className="p-4 font-bold">xl</td>
                    <td className="p-4 text-bvp-gold">1280px</td>
                    <td className="p-4">xl:</td>
                    <td className="p-4">Laptops, desktops</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">2xl</td>
                    <td className="p-4 text-bvp-gold">1536px</td>
                    <td className="p-4">2xl:</td>
                    <td className="p-4">Large monitors</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Current Breakpoint Indicator */}
            <div className="mt-8 p-6 bg-bvp-gold border-4 border-black">
              <p className="font-bold text-sm uppercase tracking-wider mb-2">Current Breakpoint</p>
              <p className="text-4xl font-bold">{breakpoint}</p>
              <p className="font-mono mt-2">{viewport.width}px wide</p>
            </div>
          </div>
        </section>

        {/* ===================== CONTAINER ===================== */}
        <section id="container" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black bg-gray-50">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-gunterz">Container</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Max Width</p>
                <p className="text-5xl font-bold text-bvp-gold">1400px</p>
                <code className="text-sm font-mono text-gray-500 mt-2 block">max-w-[1400px] mx-auto</code>
              </div>
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Horizontal Padding</p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-3xl font-bold">24px</p>
                    <p className="text-sm text-gray-500">Mobile (px-6)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bvp-gold">48px</p>
                    <p className="text-sm text-gray-500">Desktop (md:px-12)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Container Demo */}
            <div className="relative bg-bvp-navy">
              {/* Full width background */}
              <div className="py-8">
                {/* Container with padding indicators */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
                  {/* Left padding indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 md:w-12 bg-bvp-gold/40 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-black -rotate-90 whitespace-nowrap">
                      <span className="md:hidden">24px</span>
                      <span className="hidden md:inline">48px</span>
                    </span>
                  </div>
                  
                  {/* Content area */}
                  <div className="bg-white/10 border-2 border-dashed border-white p-8 ml-6 md:ml-12 mr-6 md:mr-12">
                    <p className="text-white font-bold">Content Area</p>
                    <p className="text-white/60 text-sm">This is where your content lives</p>
                  </div>

                  {/* Right padding indicator */}
                  <div className="absolute right-0 top-0 bottom-0 w-6 md:w-12 bg-bvp-gold/40 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-black -rotate-90 whitespace-nowrap">
                      <span className="md:hidden">24px</span>
                      <span className="hidden md:inline">48px</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SECTION PADDING ===================== */}
        <section id="section-padding" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-gunterz">Section Padding</h2>
            <p className="text-gray-600 mb-8">Uses fluid <code className="bg-gray-100 px-2 py-1 rounded">clamp()</code> for smooth responsive scaling.</p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Small (sm)</p>
                <p className="text-2xl font-bold">48px → 64px</p>
                <code className="text-xs font-mono text-gray-500 block mt-2">clamp(3rem, 6vw, 4rem)</code>
              </div>
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Medium (md)</p>
                <p className="text-2xl font-bold">64px → 80px</p>
                <code className="text-xs font-mono text-gray-500 block mt-2">clamp(4rem, 8vw, 5rem)</code>
              </div>
              <div className="bg-white border-4 border-black p-6 bg-bvp-gold/10">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Large (lg)</p>
                <p className="text-2xl font-bold text-bvp-gold">80px → 128px</p>
                <code className="text-xs font-mono text-gray-500 block mt-2">clamp(5rem, 10vw, 8rem)</code>
              </div>
            </div>

            {/* Visual Section Demo */}
            <div className="border-4 border-black">
              {/* Top padding visualization */}
              <div className="bg-bvp-gold/30 relative">
                <div className="h-12 md:h-16 lg:h-24 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold">
                    <span className="md:hidden">48px</span>
                    <span className="hidden md:inline lg:hidden">64px</span>
                    <span className="hidden lg:inline">96px</span>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-6 md:px-12 py-8 text-center border-y-2 border-dashed border-gray-300">
                <p className="font-bold">Section Content</p>
                <p className="text-gray-500 text-sm">Your content goes here</p>
              </div>

              {/* Bottom padding visualization */}
              <div className="bg-bvp-gold/30 relative">
                <div className="h-12 md:h-16 lg:h-24 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold">
                    <span className="md:hidden">48px</span>
                    <span className="hidden md:inline lg:hidden">64px</span>
                    <span className="hidden lg:inline">96px</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500 font-mono">
              Pattern: py-12 md:py-16 lg:py-24 px-6 md:px-12
            </p>
          </div>
        </section>

        {/* ===================== SPACING SCALE ===================== */}
        <section id="spacing-scale" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black bg-gray-50">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-gunterz">Spacing Scale</h2>
            <p className="text-gray-600 mb-8">Base unit: 4px. All spacing is multiples of 4.</p>

            <div className="space-y-4">
              {[
                { name: '1', px: 4 },
                { name: '2', px: 8 },
                { name: '3', px: 12 },
                { name: '4', px: 16 },
                { name: '5', px: 20 },
                { name: '6', px: 24 },
                { name: '8', px: 32 },
                { name: '10', px: 40 },
                { name: '12', px: 48 },
                { name: '16', px: 64 },
                { name: '20', px: 80 },
                { name: '24', px: 96 },
              ].map((space) => (
                <div key={space.name} className="flex items-center gap-4 bg-white border-2 border-black p-3">
                  <div className="w-20 font-mono text-sm font-bold">
                    space-{space.name}
                  </div>
                  <div className="w-20 text-bvp-gold font-bold">
                    {space.px}px
                  </div>
                  <div 
                    className="bg-bvp-gold h-6 border border-black"
                    style={{ width: `${Math.min(space.px * 2, 200)}px` }}
                  />
                  <div className="font-mono text-xs text-gray-500">
                    p-{space.name}, m-{space.name}, gap-{space.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Common Spacing Patterns */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Common Patterns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-4 border-black p-6">
                  <p className="font-bold mb-2">Card Grid Gap</p>
                  <p className="text-2xl text-bvp-gold font-bold">24px</p>
                  <code className="text-sm font-mono text-gray-500">gap-6</code>
                </div>
                <div className="bg-white border-4 border-black p-6">
                  <p className="font-bold mb-2">Card Padding</p>
                  <p className="text-2xl font-bold">24px → <span className="text-bvp-gold">32px</span></p>
                  <code className="text-sm font-mono text-gray-500">p-6 lg:p-8</code>
                </div>
                <div className="bg-white border-4 border-black p-6">
                  <p className="font-bold mb-2">Section Header to Content</p>
                  <p className="text-2xl font-bold">32px → <span className="text-bvp-gold">48px</span></p>
                  <code className="text-sm font-mono text-gray-500">mb-8 md:mb-12</code>
                </div>
                <div className="bg-white border-4 border-black p-6">
                  <p className="font-bold mb-2">Headline to Body Gap</p>
                  <p className="text-2xl text-bvp-gold font-bold">16px</p>
                  <code className="text-sm font-mono text-gray-500">mb-4</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== TYPOGRAPHY ===================== */}
        <section id="typography" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-gunterz">Typography</h2>

            {/* Font Families */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Display</p>
                <p className="text-3xl font-bold font-alverata">Alverata</p>
                <p className="text-sm text-gray-500 mt-2">Headlines, stats</p>
                <code className="text-xs font-mono">font-display / font-alverata</code>
              </div>
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Display Alt</p>
                <p className="text-3xl font-bold font-gunterz">Gunterz</p>
                <p className="text-sm text-gray-500 mt-2">Bold military headlines</p>
                <code className="text-xs font-mono">font-gunterz</code>
              </div>
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Body</p>
                <p className="text-3xl font-linear">Linear Grotesk</p>
                <p className="text-sm text-gray-500 mt-2">Body text, paragraphs</p>
                <code className="text-xs font-mono">font-body / font-linear</code>
              </div>
              <div className="bg-white border-4 border-black p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">CTA / Buttons</p>
                <p className="text-3xl font-medium font-ontika">Ontika</p>
                <p className="text-sm text-gray-500 mt-2">Buttons, labels, CTAs</p>
                <code className="text-xs font-mono">font-cta / font-ontika</code>
              </div>
            </div>

            {/* Gunterz Font Specimen */}
            <div className="bg-white border-4 border-black mb-12">
              <div className="p-6 border-b-2 border-black bg-bvp-gold">
                <h3 className="font-bold font-gunterz text-xl">Gunterz Font Family</h3>
                <p className="text-sm">Military-inspired display typeface</p>
              </div>

              <div className="divide-y-2 divide-black">
                {/* Regular */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-500">Regular (400)</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1">font-normal</code>
                  </div>
                  <p className="font-gunterz font-normal text-4xl">BLACK VETERANS PROJECT</p>
                  <p className="font-gunterz font-normal text-2xl mt-2">The quick brown fox jumps over the lazy dog</p>
                </div>

                {/* Regular Italic */}
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-500">Regular Italic (400)</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1">font-normal italic</code>
                  </div>
                  <p className="font-gunterz font-normal italic text-4xl">BLACK VETERANS PROJECT</p>
                  <p className="font-gunterz font-normal italic text-2xl mt-2">The quick brown fox jumps over the lazy dog</p>
                </div>

                {/* Medium */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-500">Medium (500)</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1">font-medium</code>
                  </div>
                  <p className="font-gunterz font-medium text-4xl">BLACK VETERANS PROJECT</p>
                  <p className="font-gunterz font-medium text-2xl mt-2">The quick brown fox jumps over the lazy dog</p>
                </div>

                {/* Bold */}
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-500">Bold (700)</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1">font-bold</code>
                  </div>
                  <p className="font-gunterz font-bold text-4xl">BLACK VETERANS PROJECT</p>
                  <p className="font-gunterz font-bold text-2xl mt-2">The quick brown fox jumps over the lazy dog</p>
                </div>

                {/* Black */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-500">Black (900)</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1">font-black</code>
                  </div>
                  <p className="font-gunterz font-black text-4xl">BLACK VETERANS PROJECT</p>
                  <p className="font-gunterz font-black text-2xl mt-2">The quick brown fox jumps over the lazy dog</p>
                </div>

                {/* Black on Dark */}
                <div className="p-6 bg-black text-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono text-gray-400">Black (900) on Dark</span>
                    <code className="text-xs font-mono bg-white/10 px-2 py-1">font-black</code>
                  </div>
                  <p className="font-gunterz font-black text-4xl">BLACK VETERANS PROJECT</p>
                  <p className="font-gunterz font-black text-2xl mt-2 text-bvp-gold">REPARATIVE JUSTICE FOR BLACK VETERANS</p>
                </div>
              </div>
            </div>

            {/* Type Scale */}
            <div className="bg-white border-4 border-black">
              <div className="p-6 border-b-2 border-black bg-gray-50">
                <h3 className="font-bold">Type Scale</h3>
              </div>
              
              <div className="divide-y-2 divide-black">
                {/* Hero */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-bvp-gold px-2 py-1 font-bold">Display XL</span>
                    <span>Mobile: 48px (text-5xl)</span>
                    <span className="text-bvp-gold">Desktop: 72px (lg:text-7xl)</span>
                    <span className="text-gray-500">line-height: 1.1</span>
                  </div>
                  <p className="text-5xl lg:text-7xl font-bold leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
                    Hero Headlines
                  </p>
                </div>

                {/* Page Title */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-gray-200 px-2 py-1 font-bold">Display LG</span>
                    <span>Mobile: 40px (text-4xl)</span>
                    <span className="text-bvp-gold">Desktop: 60px (lg:text-6xl)</span>
                    <span className="text-gray-500">line-height: 1.1</span>
                  </div>
                  <p className="text-4xl lg:text-6xl font-bold leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
                    Page Titles
                  </p>
                </div>

                {/* Section Header */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-gray-200 px-2 py-1 font-bold">Display MD</span>
                    <span>Mobile: 28px (text-2xl)</span>
                    <span className="text-bvp-gold">Desktop: 40px (lg:text-4xl)</span>
                    <span className="text-gray-500">line-height: 1.2</span>
                  </div>
                  <p className="text-2xl lg:text-4xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    Section Headers
                  </p>
                </div>

                {/* Body XL */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-gray-200 px-2 py-1 font-bold">Body XL</span>
                    <span>20px (text-xl)</span>
                    <span className="text-bvp-gold">Desktop: 24px (lg:text-2xl)</span>
                    <span className="text-gray-500">line-height: 1.6</span>
                  </div>
                  <p className="text-xl lg:text-2xl leading-relaxed">
                    Lead paragraphs and important intro text that sets up the content below.
                  </p>
                </div>

                {/* Body MD */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-gray-200 px-2 py-1 font-bold">Body MD</span>
                    <span>16px (text-base)</span>
                    <span className="text-gray-500">line-height: 1.6</span>
                  </div>
                  <p className="text-base leading-relaxed">
                    Default body text for general content and paragraphs. This is the most common text size used throughout the site for readable content.
                  </p>
                </div>

                {/* Body SM */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-gray-200 px-2 py-1 font-bold">Body SM</span>
                    <span>14px (text-sm)</span>
                    <span className="text-gray-500">line-height: 1.5</span>
                  </div>
                  <p className="text-sm leading-normal text-gray-600">
                    Captions, metadata, timestamps, and secondary information.
                  </p>
                </div>

                {/* Label */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-mono">
                    <span className="bg-gray-200 px-2 py-1 font-bold">Label</span>
                    <span>12px (text-xs)</span>
                    <span className="text-gray-500">uppercase, tracking-wider</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    EYEBROW LABELS AND CATEGORY TAGS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== iOS HIG MOBILE ===================== */}
        <section id="ios-hig" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black bg-bvp-gold/10">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-gunterz">iOS HIG Mobile Guidelines</h2>
            <p className="text-gray-600 mb-8">Apple Human Interface Guidelines for mobile accessibility</p>

            {/* Text Sizing */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Interactive Text: 17px Minimum</h3>
              <p className="text-gray-600 mb-6">All tappable text must be at least 17px on mobile devices.</p>

              <div className="overflow-x-auto">
                <table className="w-full border-4 border-black bg-white">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4 font-mono">Element</th>
                      <th className="text-left p-4 font-mono">Min Size</th>
                      <th className="text-left p-4 font-mono">Tailwind</th>
                      <th className="text-left p-4 font-mono">Example</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    <tr className="border-b-2 border-black">
                      <td className="p-4 font-bold">Button text</td>
                      <td className="p-4 text-bvp-gold font-bold">17px</td>
                      <td className="p-4">text-[17px]</td>
                      <td className="p-4"><button className="text-[17px] font-bold underline">Submit</button></td>
                    </tr>
                    <tr className="border-b-2 border-black bg-gray-50">
                      <td className="p-4 font-bold">Link text</td>
                      <td className="p-4 text-bvp-gold font-bold">17px</td>
                      <td className="p-4">text-[17px]</td>
                      <td className="p-4"><a className="text-[17px] text-blue-600 underline">Read More</a></td>
                    </tr>
                    <tr className="border-b-2 border-black">
                      <td className="p-4 font-bold">Navigation</td>
                      <td className="p-4 text-bvp-gold font-bold">17px</td>
                      <td className="p-4">text-[17px]</td>
                      <td className="p-4"><span className="text-[17px] font-bold">Menu Item</span></td>
                    </tr>
                    <tr className="border-b-2 border-black bg-gray-50">
                      <td className="p-4 font-bold">Form inputs</td>
                      <td className="p-4 text-bvp-gold font-bold">16px</td>
                      <td className="p-4">text-base</td>
                      <td className="p-4"><span className="text-base">Prevents iOS zoom</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Labels (interactive)</td>
                      <td className="p-4 text-bvp-gold font-bold">17px</td>
                      <td className="p-4">text-[17px]</td>
                      <td className="p-4"><label className="text-[17px]">Checkbox label</label></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Touch Targets */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Touch Targets: 44×44px Minimum</h3>
              <p className="text-gray-600 mb-6">All interactive elements need 44×44 pixel minimum touch area.</p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border-4 border-black p-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Buttons</p>
                  <div className="bg-gray-100 p-4 flex items-center justify-center">
                    <button className="px-6 py-3 min-h-[44px] bg-bvp-gold border-4 border-black text-[17px] font-bold">
                      44px height
                    </button>
                  </div>
                  <code className="text-xs font-mono text-gray-500 mt-2 block">min-h-[44px] text-[17px]</code>
                </div>

                <div className="bg-white border-4 border-black p-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Form Inputs</p>
                  <div className="bg-gray-100 p-4">
                    <input
                      type="text"
                      placeholder="Input text"
                      className="w-full px-4 py-3 min-h-[44px] text-base border-2 border-black"
                    />
                  </div>
                  <code className="text-xs font-mono text-gray-500 mt-2 block">min-h-[44px] text-base</code>
                </div>

                <div className="bg-white border-4 border-black p-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Icon Buttons</p>
                  <div className="bg-gray-100 p-4 flex items-center justify-center">
                    <button className="w-11 h-11 bg-black text-white flex items-center justify-center">
                      <span>×</span>
                    </button>
                  </div>
                  <code className="text-xs font-mono text-gray-500 mt-2 block">w-11 h-11 (44px)</code>
                </div>
              </div>
            </div>

            {/* Mobile-First Pattern */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Mobile-First Pattern</h3>
              <p className="text-gray-600 mb-6">Use larger sizes on mobile, optionally reduce on desktop.</p>

              <div className="bg-white border-4 border-black p-6">
                <div className="space-y-4 font-mono text-sm">
                  <div className="p-4 bg-gray-100 border-l-4 border-bvp-gold">
                    <p className="font-bold text-black mb-1">Interactive text</p>
                    <code>text-[17px] md:text-sm</code>
                    <p className="text-gray-500 text-xs mt-1">17px on mobile → 14px on desktop</p>
                  </div>
                  <div className="p-4 bg-gray-100 border-l-4 border-bvp-gold">
                    <p className="font-bold text-black mb-1">Form inputs</p>
                    <code>text-base min-h-[44px]</code>
                    <p className="text-gray-500 text-xs mt-1">16px prevents iOS Safari zoom</p>
                  </div>
                  <div className="p-4 bg-gray-100 border-l-4 border-bvp-gold">
                    <p className="font-bold text-black mb-1">Touch targets</p>
                    <code>min-h-[44px] md:min-h-0</code>
                    <p className="text-gray-500 text-xs mt-1">44px on mobile, natural height on desktop</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Allowed Exceptions */}
            <div>
              <h3 className="text-xl font-bold mb-4">Non-Interactive (Can Be Smaller)</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-xs uppercase tracking-wider">Eyebrow</p>
                  <p className="font-mono text-sm text-gray-500 mt-1">12px (text-xs)</p>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-sm text-gray-500">Caption text</p>
                  <p className="font-mono text-sm text-gray-500 mt-1">14px (text-sm)</p>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-xs text-gray-400">12:30 PM</p>
                  <p className="font-mono text-sm text-gray-500 mt-1">Timestamp</p>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-sm text-gray-500">Metadata</p>
                  <p className="font-mono text-sm text-gray-500 mt-1">14px (text-sm)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== COLORS ===================== */}
        <section id="colors" className="py-12 md:py-16 lg:py-24 px-6 md:px-12 border-b-4 border-black bg-gray-50">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-gunterz">Colors</h2>

            {/* Primary Colors */}
            <h3 className="text-lg font-bold mb-4 text-gray-600">Primary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {/* Insignia Gold */}
              <div>
                <div className="h-32 bg-[#FDC500] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold">Insignia Gold</p>
                  <p className="font-mono text-sm">#FDC500</p>
                </div>
              </div>

              {/* White */}
              <div>
                <div className="h-32 bg-white border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold">White</p>
                  <p className="font-mono text-sm">#FFFFFF</p>
                </div>
              </div>

              {/* Black Ops */}
              <div>
                <div className="h-32 bg-black border-4 border-[#FDC500]"></div>
                <div className="mt-2">
                  <p className="font-bold">Black Ops</p>
                  <p className="font-mono text-sm">#000000</p>
                </div>
              </div>

              {/* Midnight Navy */}
              <div>
                <div className="h-32 bg-[#232651] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold">Midnight Navy</p>
                  <p className="font-mono text-sm">#232651</p>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <h3 className="text-lg font-bold mb-4 text-gray-600">Accent</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {/* Flare Orange */}
              <div>
                <div className="h-24 bg-[#F44708] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Flare Orange</p>
                  <p className="font-mono text-xs">#F44708</p>
                </div>
              </div>

              {/* Deep Red */}
              <div>
                <div className="h-24 bg-[#720C0C] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Deep Red</p>
                  <p className="font-mono text-xs">#720C0C</p>
                </div>
              </div>

              {/* Tactical Green */}
              <div>
                <div className="h-24 bg-[#56C035] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Tactical Green</p>
                  <p className="font-mono text-xs">#56C035</p>
                </div>
              </div>

              {/* Ranger Green */}
              <div>
                <div className="h-24 bg-[#143601] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Ranger Green</p>
                  <p className="font-mono text-xs">#143601</p>
                </div>
              </div>
            </div>

            {/* Secondary Colors */}
            <h3 className="text-lg font-bold mb-4 text-gray-600">Secondary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Sky Blue */}
              <div>
                <div className="h-24 bg-[#038BFF] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Sky Blue</p>
                  <p className="font-mono text-xs">#038BFF</p>
                </div>
              </div>

              {/* Steel Grey */}
              <div>
                <div className="h-24 bg-[#A1A1A4] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Steel Grey</p>
                  <p className="font-mono text-xs">#A1A1A4</p>
                </div>
              </div>

              {/* Sand */}
              <div>
                <div className="h-24 bg-[#F4E7C3] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Sand</p>
                  <p className="font-mono text-xs">#F4E7C3</p>
                </div>
              </div>

              {/* Gold Light */}
              <div>
                <div className="h-24 bg-[#FEF3C7] border-4 border-black"></div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Gold Light</p>
                  <p className="font-mono text-xs">#FEF3C7</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== COMPONENTS ===================== */}
        <section id="components" className="py-12 md:py-16 lg:py-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-gunterz">Components</h2>

            {/* Buttons */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Buttons</h3>

              {/* Primary - Gold Pill on Light */}
              <div className="bg-gradient-to-b from-[#FEF7E0] to-white border-4 border-black p-8 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Primary Variants (Light BG)</p>
                <div className="flex flex-wrap gap-4 items-center mb-6">
                  <button className="font-bold px-10 py-4 text-xl tracking-wide rounded-full border-2 border-[#FDC500] bg-[#FDC500] text-black transition-all duration-300 hover:bg-black hover:text-[#FDC500] active:scale-95 min-h-[52px]">
                    primary (lg)
                  </button>
                  <button className="font-bold px-8 py-3.5 text-lg tracking-wide rounded-full border-2 border-[#FDC500] bg-[#FDC500] text-black transition-all duration-300 hover:bg-white active:scale-95 min-h-[48px]">
                    primary-light (md)
                  </button>
                  <button className="font-bold px-6 py-3 text-base tracking-wide rounded-full border-2 border-black bg-black text-white transition-all duration-300 hover:bg-[#FDC500] hover:text-black hover:border-[#FDC500] active:scale-95 min-h-[44px]">
                    secondary (sm)
                  </button>
                  <button className="font-bold px-6 py-3 text-base tracking-wide rounded-full border-2 border-black bg-transparent text-black transition-all duration-300 hover:bg-black hover:text-white active:scale-95 min-h-[44px]">
                    outline
                  </button>
                </div>
              </div>

              {/* Buttons on Dark BG */}
              <div className="bg-gradient-to-b from-[#1a1a1a] to-black border-4 border-black p-8 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Button Variants (Dark BG)</p>
                <div className="flex flex-wrap gap-4 items-center mb-6">
                  <button className="font-bold px-8 py-3.5 text-lg tracking-wide rounded-full border-2 border-[#FDC500] bg-[#FDC500] text-black transition-all duration-300 hover:bg-black hover:text-[#FDC500] active:scale-95 min-h-[48px]">
                    primary
                  </button>
                  <button className="font-bold px-6 py-3 text-base tracking-wide rounded-full border-2 border-[#FDC500] bg-transparent text-white transition-all duration-300 hover:bg-[#FDC500] hover:text-black active:scale-95 min-h-[44px]">
                    outline-white
                  </button>
                  <button className="font-bold px-6 py-3 text-base tracking-wide rounded-full border-2 border-white bg-white text-black transition-all duration-300 hover:bg-black hover:text-white active:scale-95 min-h-[44px]">
                    white
                  </button>
                  <button className="font-bold px-6 py-3 text-base tracking-wide rounded-full border-2 border-[#F44708] bg-[#F44708] text-white transition-all duration-300 hover:bg-white hover:text-[#F44708] hover:border-white active:scale-95 min-h-[44px]">
                    accent
                  </button>
                </div>
              </div>

              <div className="font-mono text-sm space-y-1 text-gray-600 bg-white border-4 border-black p-6">
                <p className="font-bold text-black mb-2">Button Specs (from Button.tsx):</p>
                <p>Large: <span className="text-[#FDC500]">px-10 py-4 text-xl min-h-[52px]</span></p>
                <p>Medium: <span className="text-[#FDC500]">px-8 py-3.5 text-lg min-h-[48px]</span></p>
                <p>Small: <span className="text-[#FDC500]">px-6 py-3 text-base min-h-[44px]</span></p>
                <p>Border: <span className="text-[#FDC500]">2px solid (border-2)</span></p>
                <p>Border-radius: <span className="text-[#FDC500]">rounded-full (9999px)</span></p>
                <p>Font: <span className="text-[#FDC500]">font-bold tracking-wide</span></p>
                <p>Variants: <span className="text-[#FDC500]">primary, primary-light, secondary, outline, outline-white, white, accent</span></p>
                <p>Active: <span className="text-[#FDC500]">scale-95</span></p>
              </div>
            </div>

            
            {/* Cards */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Cards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border-4 border-black p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Default</p>
                  <p className="text-xl font-bold">Card Title</p>
                  <p className="text-gray-600 mt-2">Card content</p>
                </div>
                <div className="bg-black text-white border-4 border-black p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Dark</p>
                  <p className="text-xl font-bold">Card Title</p>
                  <p className="text-gray-300 mt-2">Card content</p>
                </div>
                <div className="bg-bvp-gold border-4 border-bvp-gold p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2">Gold</p>
                  <p className="text-xl font-bold">Card Title</p>
                  <p className="text-black/70 mt-2">Card content</p>
                </div>
              </div>
              <div className="mt-4 font-mono text-sm text-gray-600">
                <p>Border: <span className="text-bvp-gold">4px solid</span></p>
                <p>Padding: <span className="text-bvp-gold">24px</span> (p-6) / <span className="text-bvp-gold">32px</span> (lg:p-8)</p>
                <p>Hover: translateY(-4px) + shadow</p>
              </div>
            </div>

            {/* Borders */}
            <div>
              <h3 className="text-xl font-bold mb-4">Borders</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border-4 border-black bg-white">
                  <p className="font-bold">Primary</p>
                  <p className="font-mono text-sm text-gray-500">4px solid black</p>
                </div>
                <div className="p-6 border-2 border-black bg-white">
                  <p className="font-bold">Secondary</p>
                  <p className="font-mono text-sm text-gray-500">2px solid black</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white">
                  <p className="font-bold">Subtle</p>
                  <p className="font-mono text-sm text-gray-500">1px solid gray-200</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

        {/* Site Footer */}
        <Footer />
      </div>
    </>
  );
}
