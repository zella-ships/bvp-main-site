import { NextRequest, NextResponse } from "next/server";

// Google Sheets Web App URL - you'll set this up
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

// Basic HTML sanitization to prevent XSS
function sanitize(str: string | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 5000); // Limit length to prevent abuse
}

// Sanitize all string values in an object
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitize(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.map(v => typeof v === 'string' ? sanitize(v) : v);
    }
    // Ignore other types for security
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    const data = sanitizeObject(rawData);

    // If Google Sheets URL is configured, send there
    if (GOOGLE_SHEETS_URL) {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Feedback API - POST to submit feedback",
    setup: "Set GOOGLE_SHEETS_WEBHOOK_URL env var to enable Google Sheets logging"
  });
}
