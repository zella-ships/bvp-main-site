'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface PillarCardProps {
  number: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  bgColor: string;
  accentColor: string;
  camoColors: string[];
  patternImage?: string;
  image?: string;
  imageAlt?: string;
}

const BLOCK_SIZE = 20;
const BLOB_SIZE = 5;
const FADE_SPEED = 0.12;

let seed = 42;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function resetSeed(s: number) { seed = s; }

function generateBlob(startX: number, startY: number, size: number) {
  const cells = new Set<string>();
  cells.add(`${startX},${startY}`);

  const directions = [[-1,0], [1,0], [0,-1], [0,1]];
  let current = [[startX, startY]];

  for (let i = 0; i < size && current.length > 0; i++) {
    const newCells: number[][] = [];
    for (const [cx, cy] of current) {
      const shuffled = [...directions].sort(() => seededRandom() - 0.5);
      for (const [dx, dy] of shuffled.slice(0, 1 + Math.floor(seededRandom() * 2))) {
        const nx = cx + dx;
        const ny = cy + dy;
        const key = `${nx},${ny}`;
        if (!cells.has(key) && seededRandom() > 0.25) {
          cells.add(key);
          newCells.push([nx, ny]);
        }
      }
    }
    current = newCells;
  }

  return Array.from(cells).map(s => s.split(',').map(Number));
}

interface Cell {
  x: number;
  y: number;
  color: string;
  layer: number;
  px: number;
  py: number;
  currentOpacity: number;
}

function PillarCard({ number, title, description, cta, href, bgColor, accentColor, camoColors, patternImage, image, imageAlt }: PillarCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<Cell[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | undefined>(undefined);
  const patternMouseRef = useRef({ x: -1000, y: -1000 });
  const patternAnimRef = useRef<number | undefined>(undefined);
  const isHoveredRef = useRef(false);

  const generateCamo = useCallback(() => {
    if (patternImage) return;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const gridWidth = Math.ceil(rect.width / BLOCK_SIZE) + 4;
    const gridHeight = Math.ceil(rect.height / BLOCK_SIZE) + 4;

    resetSeed(parseInt(number) * 1000 + 42);

    const grid: Cell[] = [];

    // Layer 1 - medium tone
    const layer1Blobs = Math.floor((gridWidth * gridHeight * 0.35) / (BLOB_SIZE * 2));
    for (let i = 0; i < layer1Blobs; i++) {
      const startX = Math.floor(seededRandom() * (gridWidth + 4)) - 2;
      const startY = Math.floor(seededRandom() * (gridHeight + 4)) - 2;
      const size = Math.floor(BLOB_SIZE * 1.5 * (0.6 + seededRandom() * 0.8));
      const blob = generateBlob(startX, startY, size);
      for (const [x, y] of blob) {
        grid.push({ x, y, color: camoColors[0], layer: 1, px: 0, py: 0, currentOpacity: 0 });
      }
    }

    // Layer 2 - accent
    const layer2Blobs = Math.floor((gridWidth * gridHeight * 0.25) / (BLOB_SIZE * 1.5));
    for (let i = 0; i < layer2Blobs; i++) {
      const startX = Math.floor(seededRandom() * (gridWidth + 4)) - 2;
      const startY = Math.floor(seededRandom() * (gridHeight + 4)) - 2;
      const size = Math.floor(BLOB_SIZE * 1.2 * (0.5 + seededRandom() * 0.7));
      const blob = generateBlob(startX, startY, size);
      for (const [x, y] of blob) {
        grid.push({ x, y, color: camoColors[1], layer: 2, px: 0, py: 0, currentOpacity: 0 });
      }
    }

    // Layer 3 - light
    const layer3Blobs = Math.floor((gridWidth * gridHeight * 0.15) / BLOB_SIZE);
    for (let i = 0; i < layer3Blobs; i++) {
      const startX = Math.floor(seededRandom() * (gridWidth + 4)) - 2;
      const startY = Math.floor(seededRandom() * (gridHeight + 4)) - 2;
      const size = Math.floor(BLOB_SIZE * 0.8 * (0.5 + seededRandom() * 0.6));
      const blob = generateBlob(startX, startY, size);
      for (const [x, y] of blob) {
        grid.push({ x, y, color: camoColors[2], layer: 3, px: 0, py: 0, currentOpacity: 0 });
      }
    }

    // Layer 4 - dark
    const layer4Blobs = Math.floor((gridWidth * gridHeight * 0.08) / (BLOB_SIZE * 0.5));
    for (let i = 0; i < layer4Blobs; i++) {
      const startX = Math.floor(seededRandom() * (gridWidth + 4)) - 2;
      const startY = Math.floor(seededRandom() * (gridHeight + 4)) - 2;
      const size = Math.floor(BLOB_SIZE * 0.5 * (0.4 + seededRandom() * 0.5));
      const blob = generateBlob(startX, startY, size);
      for (const [x, y] of blob) {
        grid.push({ x, y, color: camoColors[3], layer: 4, px: 0, py: 0, currentOpacity: 0 });
      }
    }

    // Pre-calculate pixel centers
    for (const cell of grid) {
      cell.px = cell.x * BLOCK_SIZE + BLOCK_SIZE / 2;
      cell.py = cell.y * BLOCK_SIZE + BLOCK_SIZE / 2;
    }

    grid.sort((a, b) => a.layer - b.layer);
    gridRef.current = grid;
  }, [number, camoColors, patternImage]);

  // Soft gradient glow falloff - like a real light/glow
  const getGlowOpacity = useCallback((dist: number, maxDist: number) => {
    if (dist > maxDist) return 0;
    const t = dist / maxDist;
    return Math.pow(1 - t, 2) * 0.55;
  }, []);

  const render = useCallback(() => {
    if (patternImage) return;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grid = gridRef.current;
    const { x: mouseX, y: mouseY } = mouseRef.current;

    // Larger, softer radius for glow effect
    const glowRadius = Math.max(canvas.width, canvas.height) * 0.6;

    let needsRedraw = false;

    for (const cell of grid) {
      const dx = cell.px - mouseX;
      const dy = cell.py - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Soft glow falloff
      const targetOpacity = getGlowOpacity(dist, glowRadius);

      const diff = targetOpacity - cell.currentOpacity;
      if (Math.abs(diff) > 0.002) {
        cell.currentOpacity += diff * FADE_SPEED;
        needsRedraw = true;
      } else if (cell.currentOpacity !== targetOpacity) {
        cell.currentOpacity = targetOpacity;
        needsRedraw = true;
      }
    }

    if (needsRedraw) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const cell of grid) {
        if (cell.currentOpacity > 0.003) {
          ctx.globalAlpha = cell.currentOpacity;
          ctx.fillStyle = cell.color;
          ctx.fillRect(cell.x * BLOCK_SIZE, cell.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }

      ctx.globalAlpha = 1;
    }

    animationRef.current = requestAnimationFrame(render);
  }, [getGlowOpacity, patternImage]);

  useEffect(() => {
    if (patternImage) return;
    generateCamo();
    animationRef.current = requestAnimationFrame(render);

    const handleResize = () => generateCamo();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [generateCamo, render, patternImage]);

  // Breathing glow loop for pattern image cards
  const renderPattern = useCallback(() => {
    if (!patternRef.current || !isHoveredRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const { x, y } = patternMouseRef.current;
    const t = performance.now();

    const baseR = Math.max(rect.width, rect.height) * 0.75;
    const r = baseR + Math.sin(t * 0.0012) * 18 + Math.sin(t * 0.0005) * 10;

    const gradient = `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.08) 65%, transparent 100%)`;
    patternRef.current.style.maskImage = gradient;
    patternRef.current.style.webkitMaskImage = gradient;

    patternAnimRef.current = requestAnimationFrame(renderPattern);
  }, []);

  // Cleanup pattern animation on unmount
  useEffect(() => {
    return () => {
      if (patternAnimRef.current) cancelAnimationFrame(patternAnimRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (patternImage && patternRef.current) {
      patternMouseRef.current = { x, y };
      if (!isHoveredRef.current) {
        isHoveredRef.current = true;
        patternRef.current.style.opacity = '1';
        patternAnimRef.current = requestAnimationFrame(renderPattern);
      }
    } else {
      mouseRef.current = { x, y };
    }
  };

  const handleMouseLeave = () => {
    if (patternImage && patternRef.current) {
      isHoveredRef.current = false;
      if (patternAnimRef.current) cancelAnimationFrame(patternAnimRef.current);
      patternRef.current.style.opacity = '0';
    } else {
      mouseRef.current = { x: -1000, y: -1000 };
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (patternImage && patternRef.current) {
      patternMouseRef.current = { x, y };
      isHoveredRef.current = true;
      patternRef.current.style.opacity = '1';
      patternAnimRef.current = requestAnimationFrame(renderPattern);
    } else {
      mouseRef.current = { x, y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (patternImage && patternRef.current) {
      patternMouseRef.current = { x, y };
    } else {
      mouseRef.current = { x, y };
    }
  };

  const handleTouchEnd = () => {
    if (patternImage && patternRef.current) {
      isHoveredRef.current = false;
      if (patternAnimRef.current) cancelAnimationFrame(patternAnimRef.current);
      patternRef.current.style.opacity = '0';
    } else {
      mouseRef.current = { x: -1000, y: -1000 };
    }
  };

  return (
    <Link href={href} className="group block">
      <div
        ref={cardRef}
        className={`relative overflow-hidden h-full rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_50px_rgba(0,0,0,0.14)] ${image ? '' : 'min-h-[320px]'}`}
        style={{ backgroundColor: bgColor }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {patternImage ? (
          <div
            ref={patternRef}
            className="absolute inset-0 pointer-events-none z-[1] rounded-2xl"
            style={{
              backgroundImage: `url(${patternImage})`,
              backgroundSize: '300px',
              backgroundRepeat: 'repeat',
              opacity: 0,
              transition: 'opacity 0.4s ease-out',
            }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-[1] rounded-2xl"
          />
        )}

        {/* Image wrapper - only renders if image prop exists */}
        {image && (
          <div className="relative z-[2] overflow-hidden rounded-t-2xl">
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full h-52 object-cover block"
            />
          </div>
        )}

        <div className={`relative z-[2] p-6 lg:p-8 flex flex-col ${image ? 'flex-1' : 'h-full min-h-[320px]'}`}>
          <h3 className="font-ontika text-2xl lg:text-3xl font-medium text-white leading-[1.1]">
            {title}
          </h3>
          <p className="text-base md:text-lg text-white mt-5 leading-relaxed flex-1">
            {description}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span
              className="text-base md:text-lg font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2"
              style={{ color: accentColor }}
            >
              {cta}
            </span>
            <span
              className="text-xl group-hover:translate-x-2 transition-transform inline-block"
              style={{ color: accentColor }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PillarsSection() {
  const pillars = [
    {
      number: '01',
      title: 'Narrative Hub',
      description: 'We collect, preserve, and amplify the records that prove what happened\u2014millions of documents spanning decades of exclusion. Scholars, artists, and archivists turn evidence into public memory.',
      cta: 'Learn more about what we\'re preserving',
      href: '/our-work#narrative',
      bgColor: '#1a1500',
      accentColor: '#FDC500',
      camoColors: ['#8B7500', '#FDC500', '#FEF3C7', '#0d0b00'],
      patternImage: '/images/camo-yellow.png',
      image: '/images/narrative-hub.jpg',
      imageAlt: 'Elderly veteran in conversation',
    },
    {
      number: '02',
      title: 'Movement Building',
      description: 'We\u2019re organizing Black veterans and military families into a national network with real power on the Hill. Stories become testimony. Members become advocates.',
      cta: 'See how we organize',
      href: '/our-work#movement-building',
      bgColor: '#143601',
      accentColor: '#56C035',
      camoColors: ['#5A7A45', '#56C035', '#B8E5A8', '#0d2401'],
      patternImage: '/images/camo-green.png',
      image: '/images/movement-building.jpg',
      imageAlt: 'Community gathering and organizing',
    },
    {
      number: '03',
      title: 'Impact Litigation',
      description: 'We partner with Yale Law, Harvard Law, and Quinn Emanuel to turn evidence into legal precedent. Monk v. United States is one of the first reparative justice cases to survive a motion to dismiss.',
      cta: 'See the legal strategy',
      href: '/our-work#litigation',
      bgColor: '#720C0C',
      accentColor: '#F44708',
      camoColors: ['#C47A7A', '#F44708', '#FCAB8F', '#4a0808'],
      patternImage: '/images/camo-red.png',
      image: '/images/impact-litigation.jpg',
      imageAlt: 'Veterans embracing at community event',
    },
  ];

  return (
    <section
      style={{
        paddingTop: 'clamp(3rem, 5vw, 5rem)',
        paddingBottom: 'clamp(6rem, 10vw, 8.75rem)',
      }}
    >
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          paddingLeft: 'clamp(1rem, 4vw, 5.75rem)',
          paddingRight: 'clamp(1rem, 4vw, 5.75rem)',
        }}
      >
        {/* Section Title */}
        <h2
          className="font-gunterz font-bold text-black leading-tight"
          style={{
            fontSize: 'clamp(2rem, 1rem + 4vw, 3.5rem)',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          Our Work
        </h2>

        {/* Section Intro */}
        <div style={{ marginBottom: 'clamp(3rem, 5vw, 4rem)' }}>
          <p
            className="text-black/80 max-w-3xl leading-relaxed"
            style={{ fontSize: 'clamp(1.125rem, 1rem + 1vw, 1.5rem)' }}
          >
            BVP is the first comprehensive effort to build the collective power to demand federal accountability, advance policy change, and redress America's legacy of racism and discrimination against Black veterans and military families.
          </p>
        </div>

        {/* Pillar Cards */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}
        >
          {pillars.map((pillar) => (
            <PillarCard key={pillar.number} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
