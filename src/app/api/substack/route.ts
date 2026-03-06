import { NextResponse } from 'next/server';

export interface SubstackPost {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl: string | null;
}

// Cache the feed for 5 minutes to avoid hitting Substack too often
let cachedData: { posts: SubstackPost[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ posts: cachedData.posts });
    }

    const response = await fetch('https://blackveteransproject.substack.com/feed', {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xml = await response.text();
    const posts = parseRSS(xml);

    // Update cache
    cachedData = { posts, timestamp: Date.now() };

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching Substack feed:', error);

    // Return cached data if available, even if stale
    if (cachedData) {
      return NextResponse.json({ posts: cachedData.posts, stale: true });
    }

    return NextResponse.json(
      { error: 'Failed to fetch feed', posts: [] },
      { status: 500 }
    );
  }
}

function parseRSS(xml: string): SubstackPost[] {
  const posts: SubstackPost[] = [];

  // Extract all <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    // Extract title
    const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                       itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? decodeHTMLEntities(titleMatch[1].trim()) : '';

    // Extract description
    const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                      itemContent.match(/<description>([\s\S]*?)<\/description>/);
    let description = descMatch ? descMatch[1].trim() : '';
    // Strip HTML tags and decode entities
    description = description.replace(/<[^>]*>/g, '').trim();
    description = decodeHTMLEntities(description);
    // Truncate to ~150 chars
    if (description.length > 150) {
      description = description.substring(0, 147) + '...';
    }

    // Extract link
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    // Extract pubDate
    const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const pubDate = dateMatch ? dateMatch[1].trim() : '';

    // Extract image from enclosure or content
    let imageUrl: string | null = null;

    // Try enclosure first
    const enclosureMatch = itemContent.match(/<enclosure[^>]*url="([^"]*)"[^>]*type="image[^"]*"/);
    if (enclosureMatch) {
      imageUrl = enclosureMatch[1];
    }

    // Try media:content
    if (!imageUrl) {
      const mediaMatch = itemContent.match(/<media:content[^>]*url="([^"]*)"/);
      if (mediaMatch) {
        imageUrl = mediaMatch[1];
      }
    }

    // Try to find image in content:encoded
    if (!imageUrl) {
      const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
      if (contentMatch) {
        const imgMatch = contentMatch[1].match(/<img[^>]*src="([^"]*)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
    }

    if (title && link) {
      posts.push({
        title,
        description,
        link,
        pubDate,
        imageUrl,
      });
    }
  }

  return posts.slice(0, 6); // Return max 6 posts
}

function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&nbsp;': ' ',
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}
