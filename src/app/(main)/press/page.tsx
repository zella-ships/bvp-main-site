"use client";

import { useState, useMemo } from "react";

// ============================================
// TYPES
// ============================================
type PressType = "all" | "news" | "opinion" | "broadcast";
type PressTopic = "all" | "monk-case" | "gi-bill" | "dei" | "policy" | "benefits";

interface PressItem {
  id: string;
  date: { month: string; day: string; year: string };
  source: string;
  headline: string;
  author: string;
  type: Exclude<PressType, "all">;
  topics: Exclude<PressTopic, "all">[];
  url?: string;
  reach?: string; // Audience reach (e.g., "75M+")
}

// ============================================
// PRESS DATA
// ============================================
const pressItems: PressItem[] = [
  // 2025
  {
    id: "1",
    date: { month: "Apr", day: "05", year: "2025" },
    source: "The Hill",
    headline: "Black veterans sound the alarm over military DEI purge",
    author: "Featuring Kyle Bibby & Gov. Wes Moore",
    type: "news",
    topics: ["dei"],
    url: "https://thehill.com/policy/defense/5233381-black-veterans-pentagon-dei-purge/",
  },
  {
    id: "2",
    date: { month: "Mar", day: "21", year: "2025" },
    source: "USA Today",
    headline: "'Appalled': Pentagon restores web pages on Navajo code talkers, Jackie Robinson",
    author: "Featuring Kyle Bibby",
    type: "news",
    topics: ["dei"],
    url: "https://www.usatoday.com/story/news/politics/2025/03/21/pentagon-restores-navajo-code-talkers-jackie-robinson/82567891007/",
  },
  {
    id: "3",
    date: { month: "Mar", day: "20", year: "2025" },
    source: "CNN",
    headline: "Co-founder of Black Veterans Project slams Trump administration for DEI purge",
    author: "Featuring Richard Brookshire · By Pamela Brown",
    type: "broadcast",
    topics: ["dei"],
    url: "https://www.cnn.com/2025/03/20/tv/video/sitroom-pamela-brown-veterans-dei-purge-trump",
  },
  // 2023
  {
    id: "4",
    date: { month: "Mar", day: "20", year: "2023" },
    source: "NBC News",
    headline: "New report proves disparities in PTSD care for Black veterans",
    author: "By Lucy Bustamante",
    type: "broadcast",
    topics: ["benefits"],
    url: "https://www.nbcnews.com/meet-the-press/video/new-report-proves-disparities-in-ptsd-care-for-black-veterans-165816389964",
  },
  {
    id: "5",
    date: { month: "Jan", day: "18", year: "2023" },
    source: "Military.com",
    headline: "It's Back: Two Congressmen Want Americans to Thank Troops for Their Freedom",
    author: "Featuring Kyle Bibby",
    type: "news",
    topics: ["policy"],
    url: "https://www.military.com/daily-news/2023/01/18/its-back-two-congressmen-want-americans-thank-troops-their-freedom.html",
  },
  // 2022
  {
    id: "6",
    date: { month: "Dec", day: "03", year: "2022" },
    source: "PBS",
    headline: "VA denied benefits for Black veterans at higher rate for decades, lawsuit says",
    author: "Featuring Richard Brookshire & Conley Monk · By Geoff Bennett",
    type: "broadcast",
    topics: ["monk-case"],
    url: "https://www.pbs.org/newshour/show/va-denied-benefits-for-black-veterans-at-higher-rate-for-decades-lawsuit-says",
  },
  {
    id: "7",
    date: { month: "Oct", day: "26", year: "2022" },
    source: "NPR",
    headline: "Black Vets Were Excluded From G.I. Bill Benefits. Congress Could Fix That",
    author: "Featuring Richard Brookshire · By Quil Lawrence",
    type: "broadcast",
    topics: ["gi-bill"],
    url: "https://www.npr.org/2022/10/26/1131677540/black-vets-were-excluded-from-g-i-bill-benefits-congress-could-fix-that",
  },
  {
    id: "8",
    date: { month: "Jun", day: "01", year: "2022" },
    source: "Washington Post",
    headline: "Division's blue-gray patch might get the ax",
    author: "Featuring Richard Brookshire",
    type: "news",
    topics: ["policy"],
    url: "https://www.washingtonpost.com/local/divisions-blue-gray-patch-might-get-the-ax/2022/06/01/54f93c8a-e15c-11ec-9611-6f35e4fddfc3_story.html",
  },
  // 2021
  {
    id: "9",
    date: { month: "Dec", day: "03", year: "2021" },
    source: "Associated Press",
    headline: "'We just feel it': Racism plagues US military academies",
    author: "Featuring Kyle Bibby · By Lolita C. Baldor",
    type: "news",
    topics: ["policy"],
    url: "https://apnews.com/article/racism-us-military-academies-4fd04a344d6e8a5cfc7b8b2c76e28383",
  },
  {
    id: "10",
    date: { month: "Sep", day: "10", year: "2021" },
    source: "New York Times",
    headline: "Veterans Struggle With Issues That Are Often Invisible to Others",
    author: "Featuring Richard Brookshire · By Jennifer Steinhauer",
    type: "news",
    topics: ["benefits"],
    url: "https://www.nytimes.com/2021/09/10/us/politics/911-veterans-mental-health.html",
  },
];

// ============================================
// FILTER PILL COMPONENT
// ============================================
interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 min-h-[44px] text-[17px] font-semibold rounded-md border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 ${
        active
          ? "bg-black text-white border-black hover:bg-gray-800 active:bg-gray-900"
          : "bg-transparent text-gray-500 border-gray-300 hover:border-bvp-gold hover:text-black hover:bg-bvp-gold/10 active:bg-bvp-gold/20"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ============================================
// TAG COMPONENT
// ============================================
interface TagProps {
  label: string;
}

function Tag({ label }: TagProps) {
  return (
    <span className="text-xs font-bold uppercase px-2 py-0.5 border border-gray-300 text-gray-400">
      {label}
    </span>
  );
}

// ============================================
// PRESS ITEM COMPONENT
// ============================================
interface PressItemRowProps {
  item: PressItem;
}

function PressItemRow({ item }: PressItemRowProps) {
  const typeLabels: Record<Exclude<PressType, "all">, string> = {
    news: "News",
    opinion: "Opinion",
    broadcast: "Broadcast",
  };

  const topicLabels: Record<Exclude<PressTopic, "all">, string> = {
    "monk-case": "Monk Case",
    "gi-bill": "GI Bill",
    dei: "DEI",
    policy: "Policy",
    benefits: "Benefits",
  };

  const content = (
    <>
      {/* Date */}
      <div>
        <div className="text-xs font-bold uppercase text-gray-400">
          {item.date.month}
        </div>
        <div className="text-3xl font-black leading-none">{item.date.day}</div>
        <div className="text-xs text-gray-300">{item.date.year}</div>
      </div>

      {/* Content */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
          {item.source}
        </div>
        <h3 className="text-lg font-bold mb-1 leading-snug group-hover:text-[#FDC500] transition-colors">{item.headline}</h3>
        <div className="text-xs text-gray-400">{item.author}</div>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.type !== "news" && <Tag label={typeLabels[item.type]} />}
          {item.topics.map((topic) => (
            <Tag key={topic} label={topicLabels[topic]} />
          ))}
        </div>
      </div>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid grid-cols-[56px_1fr] md:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr] gap-4 md:gap-7 py-7 border-b border-gray-200 items-start hover:bg-gray-50 -mx-4 px-4 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="grid grid-cols-[56px_1fr] md:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr] gap-4 md:gap-7 py-7 border-b border-gray-200 items-start">
      {content}
    </article>
  );
}

// ============================================
// YEAR HEADER COMPONENT
// ============================================
interface YearHeaderProps {
  year: string;
  count: number;
}

function YearHeader({ year, count }: YearHeaderProps) {
  return (
    <div className="flex items-center gap-3 pt-12 pb-3 max-w-[608px]">
      <span className="text-sm font-extrabold">{year}</span>
      <span className="flex-1 h-0.5 bg-black" aria-hidden="true" />
      <span className="text-xs text-gray-400">
        {count} item{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ============================================
// MAIN PRESS PAGE
// ============================================
export default function PressPage() {
  const [typeFilter, setTypeFilter] = useState<PressType>("all");
  const [topicFilter, setTopicFilter] = useState<PressTopic>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items
  const filteredItems = useMemo(() => {
    return pressItems.filter((item) => {
      // Type filter
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      // Topic filter
      if (topicFilter !== "all" && !item.topics.includes(topicFilter)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchText =
          `${item.headline} ${item.source} ${item.author}`.toLowerCase();
        if (!searchText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [typeFilter, topicFilter, searchQuery]);

  // Group items by year
  const groupedByYear = useMemo(() => {
    const groups: Record<string, PressItem[]> = {};

    filteredItems.forEach((item) => {
      const year = item.date.year;
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(item);
    });

    // Sort years descending
    return Object.entries(groups).sort(([a], [b]) => parseInt(b) - parseInt(a));
  }, [filteredItems]);

  const typeFilters: { value: PressType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "news", label: "News" },
    { value: "opinion", label: "Opinion" },
    { value: "broadcast", label: "Broadcast" },
  ];

  const topicFilters: { value: PressTopic; label: string }[] = [
    { value: "all", label: "All" },
    { value: "monk-case", label: "Monk Case" },
    { value: "gi-bill", label: "GI Bill" },
    { value: "dei", label: "DEI" },
    { value: "policy", label: "Policy" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative border-b border-gray-200 overflow-hidden">
        {/* Sand camo background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/camo-gold-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}
        />
        <div className="relative z-10" style={{ padding: 'clamp(6rem, 10vw, 6rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 5vw, 4rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              External coverage
            </p>
            <h1
              className="font-gunterz font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
            >
              Archived Press
            </h1>
            <p
              className="text-gray-600 max-w-2xl"
              style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
            >
              Coverage of Black Veterans Project's advocacy, litigation, and the
              movement for repair.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[56px] md:top-[60px] z-30 bg-white border-b border-gray-200">
        <div
          className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-6"
          style={{ padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 5.75rem)' }}
        >
          {/* Type Filters */}
          <div
            role="group"
            aria-label="Filter by type"
          >
            <span className="block mb-2 md:hidden text-[13px] font-bold uppercase tracking-wider text-gray-400">
              Type
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="hidden md:block text-[13px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                Type
              </span>
              {typeFilters.map((filter) => (
                <FilterPill
                  key={filter.value}
                  label={filter.label}
                  active={typeFilter === filter.value}
                  onClick={() => setTypeFilter(filter.value)}
                />
              ))}
            </div>
          </div>

          {/* Topic Filters */}
          <div
            role="group"
            aria-label="Filter by topic"
          >
            <span className="block mb-2 md:hidden text-[13px] font-bold uppercase tracking-wider text-gray-400">
              Topic
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="hidden md:block text-[13px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                Topic
              </span>
              {topicFilters.map((filter) => (
                <FilterPill
                  key={filter.value}
                  label={filter.label}
                  active={topicFilter === filter.value}
                  onClick={() => setTopicFilter(filter.value)}
                />
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full md:w-auto md:ml-auto">
            <label htmlFor="press-search" className="sr-only">
              Search archive
            </label>
            <input
              id="press-search"
              type="text"
              placeholder="Search archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-56 border border-gray-300 px-4 py-3 min-h-[44px] text-[16px] bg-transparent transition-colors focus:border-black focus:outline-none rounded-md"
            />
          </div>
        </div>

        {/* Results Count */}
        <div
          className="flex justify-between py-3 text-[13px] font-semibold text-gray-400 tracking-wide border-t border-gray-100"
          style={{ padding: '0.75rem clamp(1rem, 4vw, 5.75rem)' }}
        >
          <span>
            {filteredItems.length} RESULT
            {filteredItems.length !== 1 ? "S" : ""}
          </span>
          <span>NEWEST FIRST</span>
        </div>
      </div>

      {/* Press Feed */}
      <section className="bg-gray-100">
        <div
          className="max-w-[1400px] mx-auto"
          style={{ padding: '0 clamp(1rem, 4vw, 5.75rem) clamp(3rem, 8vw, 6rem)' }}
        >
          {groupedByYear.length > 0 ? (
            groupedByYear.map(([year, items]) => (
              <div key={year}>
                <YearHeader year={year} count={items.length} />
                {items.map((item) => (
                  <PressItemRow key={item.id} item={item} />
                ))}
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No press items match your filters.
              </p>
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setTopicFilter("all");
                  setSearchQuery("");
                }}
                className="mt-4 text-[17px] font-semibold text-black hover:text-bvp-navy underline underline-offset-2 min-h-[44px] inline-flex items-center"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
