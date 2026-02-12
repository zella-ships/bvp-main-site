'use client';

import { useState, useEffect, useCallback } from "react";
import { pagesSEO, seoSummary, type PageSEO } from "@/config/seo";
import { launchChecklist, checklistSummary, type ChecklistItem } from "@/config/launch-checklist";
import { accessibilityChecklist, a11ySummary, type A11yItem } from "@/config/accessibility";
import {
  integrations,
  formIntegrations,
  analyticsEvents,
  dataFlows,
  utmStrategy,
  integrationSummary,
  type Integration,
  type FormIntegration,
  type AnalyticsEvent,
  type DataFlowStep,
} from "@/config/integrations";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_METRICS = {
  visitors: { value: 1247, trend: 12 },
  pageviews: { value: 892, trend: 8 },
  avgDuration: { value: "3:42", trend: -5 },
  topPages: [
    { path: "/", views: 542, percentage: 61 },
    { path: "/our-work", views: 187, percentage: 21 },
    { path: "/donate", views: 89, percentage: 10 },
    { path: "/join", views: 74, percentage: 8 },
  ],
};

const MOCK_DEPLOYMENTS = [
  { id: "d1", status: "READY", environment: "production", commitMessage: "added SEO meta tags to all pages", branch: "main", url: "bvp-main-site.vercel.app", createdAt: new Date(Date.now() - 1800000) },
  { id: "d2", status: "READY", environment: "production", commitMessage: "accessibility fixes - footer contrast", branch: "main", url: "bvp-main-site.vercel.app", createdAt: new Date(Date.now() - 2 * 3600000) },
  { id: "d3", status: "READY", environment: "production", commitMessage: "added admin hub dashboard", branch: "main", url: "bvp-main-site.vercel.app", createdAt: new Date(Date.now() - 86400000) },
];

const MOCK_COMMITS = [
  { sha: "a1b2c3", message: "feat: add SEO meta tags to all pages", author: "claude-code", createdAt: new Date(Date.now() - 1800000) },
  { sha: "b2c3d4", message: "fix: footer contrast for accessibility", author: "claude-code", createdAt: new Date(Date.now() - 2 * 3600000) },
  { sha: "c3d4e5", message: "feat: add admin hub dashboard", author: "claude-code", createdAt: new Date(Date.now() - 86400000) },
  { sha: "d4e5f6", message: "fix: close gap on our-work page", author: "claude-code", createdAt: new Date(Date.now() - 172800000) },
  { sha: "e5f6g7", message: "feat: add global header/footer", author: "claude-code", createdAt: new Date(Date.now() - 259200000) },
];

const TOOLS = [
  { id: "ga", name: "Google Analytics", url: "https://analytics.google.com", color: "#E37400", abbr: "GA" },
  { id: "an", name: "Action Network", url: "https://actionnetwork.org", color: "#FF4444", abbr: "AN" },
  { id: "mc", name: "Mailchimp", url: "https://login.mailchimp.com", color: "#FFE01B", abbr: "MC" },
  { id: "zp", name: "Zapier", url: "https://zapier.com/app/dashboard", color: "#FF4A00", abbr: "ZP" },
  { id: "vl", name: "Vercel", url: "https://vercel.com/dashboard", color: "#000000", abbr: "VL" },
  { id: "gh", name: "GitHub", url: "https://github.com", color: "#333333", abbr: "GH" },
  { id: "dn", name: "Donately", url: "https://dashboard.donately.com", color: "#2ECC71", abbr: "DN" },
  { id: "st", name: "Stripe", url: "https://dashboard.stripe.com", color: "#635BFF", abbr: "ST" },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
}

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

// ─── Icons (inline SVG) ─────────────────────────────────────────────────────

const Icons = {
  refresh: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1v4.5h4.5" /><path d="M15 15v-4.5h-4.5" />
      <path d="M13.5 6A6 6 0 0 0 3 3.5L1 5.5" /><path d="M2.5 10a6 6 0 0 0 10.5 2.5l2-2" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronUp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
};

// ─── Components ──────────────────────────────────────────────────────────────

function Skeleton({ width, height = 14 }: { width: string | number; height?: number }) {
  return <div className="hub-skeleton" style={{ width, height }} />;
}

function SectionContainer({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hub-section">
      <span className="hub-section-label">{label}</span>
      {children}
    </div>
  );
}

function MetricCard({ value, label, sublabel, trend }: { value: string; label: string; sublabel?: string; trend: number }) {
  const cls = trend > 0 ? "up" : trend < 0 ? "down" : "neutral";
  const prefix = trend > 0 ? "↑" : trend < 0 ? "↓" : "–";
  return (
    <div className="hub-metric-card">
      <div className="hub-metric-value">{value}</div>
      <div className="hub-metric-label">{label}</div>
      {sublabel && <div className="hub-metric-sublabel">{sublabel}</div>}
      <div className={`hub-metric-trend ${cls}`}>{prefix} {Math.abs(trend)}%</div>
    </div>
  );
}

function TopPagesTable({ pages }: { pages: typeof MOCK_METRICS.topPages }) {
  return (
    <div>
      <div className="hub-top-pages-title">Top Pages</div>
      {pages.map((p, i) => (
        <div className="hub-page-row" key={p.path}>
          <span className="hub-page-rank">{i + 1}.</span>
          <span className="hub-page-path">{p.path}</span>
          <span className="hub-page-views">{p.views.toLocaleString()} views</span>
          <div className="hub-page-bar-track">
            <div className="hub-page-bar-fill" style={{ width: `${p.percentage}%` }} />
          </div>
          <span className="hub-page-pct">{p.percentage}%</span>
        </div>
      ))}
    </div>
  );
}

function DeploymentRow({ d }: { d: typeof MOCK_DEPLOYMENTS[0] }) {
  const statusClass = d.status === "READY" ? "ready" : d.status === "BUILDING" ? "building" : "error";
  return (
    <div className="hub-deploy-row">
      <div className="hub-deploy-main">
        <div className={`hub-deploy-status ${statusClass}`}>
          {d.status === "READY" && Icons.check}
          {d.status === "BUILDING" && <span style={{ fontSize: 10 }}>⟳</span>}
          {d.status === "ERROR" && <span style={{ fontSize: 12, fontWeight: 700 }}>✕</span>}
        </div>
        <span className={`hub-deploy-env ${d.environment === "preview" ? "preview" : ""}`}>
          {d.environment === "production" ? "Production" : "Preview"}
        </span>
        <span className="hub-deploy-msg">&quot;{truncate(d.commitMessage, 40)}&quot;</span>
      </div>
      <span className="hub-deploy-time">{relativeTime(d.createdAt)}</span>
      <span className="hub-deploy-branch">{d.branch} → {d.url}</span>
    </div>
  );
}

function CommitRow({ c }: { c: typeof MOCK_COMMITS[0] }) {
  return (
    <div className="hub-commit-row">
      <div className="hub-commit-dot" />
      <span className="hub-commit-msg">{truncate(c.message, 45)}</span>
      <span className="hub-commit-author">{c.author}</span>
      <span className="hub-commit-time">{relativeTime(c.createdAt)}</span>
    </div>
  );
}

function ToolCard({ tool }: { tool: typeof TOOLS[0] }) {
  return (
    <a className="hub-tool-card" href={tool.url} target="_blank" rel="noopener noreferrer" title={`Open ${tool.name}`}>
      <div className="hub-tool-icon" style={{ background: tool.color }}>{tool.abbr}</div>
      <span className="hub-tool-name">{tool.name}</span>
    </a>
  );
}

// ─── SEO Overview Component ──────────────────────────────────────────────────

function SEOPageRow({ page }: { page: PageSEO }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="seo-page-container">
      <div className="seo-page-row" onClick={() => setExpanded(!expanded)}>
        <span className="seo-page-path">{page.path}</span>
        <span className="seo-page-title">{truncate(page.title, 35)}</span>
        <span className={`seo-status ${page.status.hasDescription ? 'set' : 'missing'}`}>
          {page.status.hasDescription ? Icons.check : Icons.x}
          <span className="seo-status-label">Desc</span>
        </span>
        <span className={`seo-status ${page.status.hasOgTags ? 'set' : 'missing'}`}>
          {page.status.hasOgTags ? Icons.check : Icons.x}
          <span className="seo-status-label">OG</span>
        </span>
        <span className={`seo-status ${page.status.hasTwitterTags ? 'set' : 'missing'}`}>
          {page.status.hasTwitterTags ? Icons.check : Icons.x}
          <span className="seo-status-label">Twitter</span>
        </span>
        <span className={`seo-status ${page.status.hasOgImage ? 'set' : 'missing'}`}>
          {page.status.hasOgImage ? Icons.check : Icons.x}
          <span className="seo-status-label">Image</span>
        </span>
        <span className="seo-expand-btn">
          {expanded ? Icons.chevronUp : Icons.chevronDown}
        </span>
      </div>

      {expanded && (
        <div className="seo-details">
          <div className="seo-detail-group">
            <div className="seo-detail-label">Page Title</div>
            <div className="seo-detail-value">{page.title}</div>
          </div>
          <div className="seo-detail-group">
            <div className="seo-detail-label">Meta Description</div>
            <div className="seo-detail-value">{page.description}</div>
          </div>
          <div className="seo-detail-section">
            <div className="seo-detail-section-title">OpenGraph Tags</div>
            <div className="seo-detail-grid">
              <div className="seo-detail-item">
                <span className="seo-detail-key">og:title</span>
                <span className="seo-detail-val">{page.openGraph.title}</span>
              </div>
              <div className="seo-detail-item">
                <span className="seo-detail-key">og:description</span>
                <span className="seo-detail-val">{page.openGraph.description}</span>
              </div>
              <div className="seo-detail-item">
                <span className="seo-detail-key">og:url</span>
                <span className="seo-detail-val">{page.openGraph.url}</span>
              </div>
              <div className="seo-detail-item">
                <span className="seo-detail-key">og:image</span>
                <span className={`seo-detail-val ${!page.openGraph.image ? 'missing' : ''}`}>
                  {page.openGraph.image || "Not set"}
                </span>
              </div>
            </div>
          </div>
          <div className="seo-detail-section">
            <div className="seo-detail-section-title">Twitter Card Tags</div>
            <div className="seo-detail-grid">
              <div className="seo-detail-item">
                <span className="seo-detail-key">twitter:card</span>
                <span className="seo-detail-val">{page.twitter.card}</span>
              </div>
              <div className="seo-detail-item">
                <span className="seo-detail-key">twitter:title</span>
                <span className="seo-detail-val">{page.twitter.title}</span>
              </div>
              <div className="seo-detail-item">
                <span className="seo-detail-key">twitter:description</span>
                <span className="seo-detail-val">{page.twitter.description}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SEOOverview() {
  return (
    <div>
      {/* Summary Stats */}
      <div className="seo-summary">
        <div className="seo-stat">
          <span className="seo-stat-value">{seoSummary.totalPages}</span>
          <span className="seo-stat-label">Total Pages</span>
        </div>
        <div className="seo-stat">
          <span className="seo-stat-value seo-stat-good">{seoSummary.pagesWithTitle}</span>
          <span className="seo-stat-label">With Title</span>
        </div>
        <div className="seo-stat">
          <span className="seo-stat-value seo-stat-good">{seoSummary.pagesWithDescription}</span>
          <span className="seo-stat-label">With Desc</span>
        </div>
        <div className="seo-stat">
          <span className="seo-stat-value seo-stat-good">{seoSummary.pagesWithOgTags}</span>
          <span className="seo-stat-label">With OG</span>
        </div>
        <div className="seo-stat">
          <span className="seo-stat-value seo-stat-warn">{seoSummary.pagesWithOgImage}</span>
          <span className="seo-stat-label">With Image</span>
        </div>
      </div>

      {/* Page List Header */}
      <div className="seo-header-row">
        <span className="seo-header-path">Page</span>
        <span className="seo-header-title">Title</span>
        <span className="seo-header-status">Desc</span>
        <span className="seo-header-status">OG</span>
        <span className="seo-header-status">Twitter</span>
        <span className="seo-header-status">Image</span>
        <span className="seo-header-expand"></span>
      </div>

      {/* Page Rows */}
      {pagesSEO.map((page) => (
        <SEOPageRow key={page.path} page={page} />
      ))}

      {/* Note about OG Images */}
      <div className="seo-note">
        <strong>Note:</strong> OG images are not yet configured. Create images at <code>/public/og/</code> and update the layout files.
      </div>
    </div>
  );
}

// ─── Launch Checklist Component ───────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  seo: 'SEO',
  security: 'Security',
  accessibility: 'Accessibility',
  integrations: 'Integrations',
  assets: 'Assets',
};

const categoryColors: Record<string, string> = {
  seo: '#3B82F6',
  security: '#10B981',
  accessibility: '#8B5CF6',
  integrations: '#F59E0B',
  assets: '#EC4899',
};

function ChecklistItemRow({ item }: { item: ChecklistItem }) {
  const statusIcon = item.status === 'done' ? Icons.check : item.status === 'in-progress' ? '⟳' : '○';
  const statusClass = item.status === 'done' ? 'done' : item.status === 'in-progress' ? 'in-progress' : 'pending';

  return (
    <div className={`checklist-item ${statusClass}`}>
      <span className={`checklist-status ${statusClass}`}>{statusIcon}</span>
      <span className="checklist-label">{item.label}</span>
      <span className="checklist-desc">{item.description}</span>
      <span className="checklist-category" style={{ background: categoryColors[item.category] }}>
        {categoryLabels[item.category]}
      </span>
    </div>
  );
}

function LaunchChecklist() {
  const progressPercent = Math.round((checklistSummary.done / checklistSummary.total) * 100);
  const categories = ['seo', 'security', 'accessibility', 'assets', 'integrations'] as const;

  return (
    <div>
      {/* Progress Overview */}
      <div className="checklist-progress">
        <div className="checklist-progress-header">
          <span className="checklist-progress-text">
            <strong>{checklistSummary.done}</strong> of <strong>{checklistSummary.total}</strong> items complete
          </span>
          <span className="checklist-progress-pct">{progressPercent}%</span>
        </div>
        <div className="checklist-progress-bar">
          <div className="checklist-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="checklist-categories">
        {categories.map(cat => {
          const stats = checklistSummary.byCategory[cat];
          return (
            <div key={cat} className="checklist-category-stat">
              <span className="checklist-cat-dot" style={{ background: categoryColors[cat] }} />
              <span className="checklist-cat-label">{categoryLabels[cat]}</span>
              <span className="checklist-cat-count">{stats.done}/{stats.total}</span>
            </div>
          );
        })}
      </div>

      {/* Checklist Items */}
      <div className="checklist-items">
        {launchChecklist.map(item => (
          <ChecklistItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="seo-note">
        <strong>Tip:</strong> Update <code>src/config/launch-checklist.ts</code> as you complete items.
      </div>
    </div>
  );
}

// ─── Accessibility Overview Component ─────────────────────────────────────────

const wcagCategoryLabels: Record<string, string> = {
  perceivable: 'Perceivable',
  operable: 'Operable',
  understandable: 'Understandable',
  robust: 'Robust',
};

function A11yItemRow({ item }: { item: A11yItem }) {
  const statusIcon = item.status === 'compliant' ? Icons.check :
                     item.status === 'not-applicable' ? '–' :
                     item.status === 'partial' ? '◐' : Icons.x;
  const statusClass = item.status === 'compliant' ? 'compliant' :
                      item.status === 'not-applicable' ? 'na' :
                      item.status === 'partial' ? 'partial' : 'non-compliant';

  return (
    <div className={`a11y-item ${statusClass}`}>
      <span className={`a11y-status ${statusClass}`}>{statusIcon}</span>
      <span className="a11y-criteria">{item.wcagCriteria}</span>
      <span className="a11y-label">{item.label}</span>
      <span className="a11y-desc">{item.description}</span>
      {item.notes && <span className="a11y-notes">{item.notes}</span>}
    </div>
  );
}

function AccessibilityOverview() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div>
      {/* Compliance Score */}
      <div className="a11y-score-section">
        <div className="a11y-score-ring">
          <svg viewBox="0 0 36 36" className="a11y-score-svg">
            <path
              className="a11y-score-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="a11y-score-fill"
              strokeDasharray={`${a11ySummary.complianceRate}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="a11y-score-value">{a11ySummary.complianceRate}%</span>
        </div>
        <div className="a11y-score-details">
          <div className="a11y-score-title">WCAG 2.2 AA Compliance</div>
          <div className="a11y-score-breakdown">
            <span className="a11y-stat compliant">{a11ySummary.compliant} Compliant</span>
            <span className="a11y-stat partial">{a11ySummary.partial} Partial</span>
            <span className="a11y-stat non-compliant">{a11ySummary.nonCompliant} Non-compliant</span>
            <span className="a11y-stat na">{a11ySummary.notApplicable} N/A</span>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      {(['perceivable', 'operable', 'understandable', 'robust'] as const).map(category => {
        const items = accessibilityChecklist.filter(i => i.category === category);
        const stats = a11ySummary.byCategory[category];
        const isExpanded = expandedCategory === category;

        return (
          <div key={category} className="a11y-category">
            <div
              className="a11y-category-header"
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
            >
              <span className="a11y-category-name">{wcagCategoryLabels[category]}</span>
              <span className="a11y-category-stats">{stats.compliant}/{stats.total} compliant</span>
              <span className="a11y-expand-btn">{isExpanded ? Icons.chevronUp : Icons.chevronDown}</span>
            </div>
            {isExpanded && (
              <div className="a11y-category-items">
                {items.map(item => (
                  <A11yItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="seo-note">
        <strong>Tip:</strong> This data powers your <code>/accessibility</code> page. Update <code>src/config/accessibility.ts</code> to keep it current.
      </div>
    </div>
  );
}

// ─── Integration Spec Component ───────────────────────────────────────────────

const statusColors: Record<string, string> = {
  connected: '#10B981',
  ready: '#3B82F6',
  planned: '#F59E0B',
  'not-needed': '#6B7280',
};

const statusLabels: Record<string, string> = {
  connected: 'Connected',
  ready: 'Ready',
  planned: 'Planned',
  'not-needed': 'Not Needed',
};

function IntegrationRow({ integration }: { integration: Integration }) {
  return (
    <div className="integration-row">
      <span className="integration-status" style={{ background: statusColors[integration.status] }}>
        {statusLabels[integration.status]}
      </span>
      <span className="integration-name">{integration.name}</span>
      <span className="integration-desc">{integration.description}</span>
      {integration.notes && <span className="integration-notes">{integration.notes}</span>}
    </div>
  );
}

function FormIntegrationRow({ form }: { form: FormIntegration }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="form-integration-container">
      <div className="form-integration-row" onClick={() => setExpanded(!expanded)}>
        <span className="form-status" style={{ background: statusColors[form.status] }}>
          {statusLabels[form.status]}
        </span>
        <span className="form-name">{form.name}</span>
        <span className="form-path">{form.path}</span>
        <span className="form-dest">→ {form.destination}</span>
        <span className="form-expand-btn">{expanded ? Icons.chevronUp : Icons.chevronDown}</span>
      </div>
      {expanded && (
        <div className="form-integration-details">
          <div className="form-detail-section">
            <div className="form-detail-label">Fields Captured</div>
            <div className="form-detail-tags">
              {form.fields.map(f => <span key={f} className="form-field-tag">{f}</span>)}
            </div>
          </div>
          <div className="form-detail-section">
            <div className="form-detail-label">Tags Generated</div>
            <div className="form-detail-tags">
              {form.tagsGenerated.map(t => <span key={t} className="form-tag-tag">{t}</span>)}
            </div>
          </div>
          {form.notes && (
            <div className="form-detail-notes">{form.notes}</div>
          )}
        </div>
      )}
    </div>
  );
}

function DataFlowDiagram() {
  return (
    <div className="dataflow-diagram">
      <div className="dataflow-title">Data Flow Architecture</div>
      <div className="dataflow-visual">
        <div className="dataflow-node website">
          <span className="dataflow-node-label">Website</span>
          <span className="dataflow-node-sub">Forms + Events</span>
        </div>
        <div className="dataflow-arrows">
          <div className="dataflow-arrow">
            <span className="dataflow-arrow-line">→</span>
            <span className="dataflow-arrow-label">Form Data + Tags</span>
          </div>
          <div className="dataflow-arrow">
            <span className="dataflow-arrow-line">→</span>
            <span className="dataflow-arrow-label">Events + Conversions</span>
          </div>
          <div className="dataflow-arrow">
            <span className="dataflow-arrow-line">→</span>
            <span className="dataflow-arrow-label">Campaign + Amount</span>
          </div>
        </div>
        <div className="dataflow-destinations">
          <div className="dataflow-node crm">
            <span className="dataflow-node-label">Action Network</span>
            <span className="dataflow-node-status ready">Ready</span>
          </div>
          <div className="dataflow-node analytics">
            <span className="dataflow-node-label">Google Analytics</span>
            <span className="dataflow-node-status ready">Ready</span>
          </div>
          <div className="dataflow-node payments">
            <span className="dataflow-node-label">Donately</span>
            <span className="dataflow-node-status planned">Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationSpec() {
  const [activeTab, setActiveTab] = useState<'overview' | 'forms' | 'events' | 'utm'>('overview');

  return (
    <div>
      {/* Summary Stats */}
      <div className="integration-summary">
        <div className="integration-stat">
          <span className="integration-stat-value">{integrationSummary.connected}</span>
          <span className="integration-stat-label">Connected</span>
        </div>
        <div className="integration-stat">
          <span className="integration-stat-value integration-stat-ready">{integrationSummary.ready}</span>
          <span className="integration-stat-label">Ready</span>
        </div>
        <div className="integration-stat">
          <span className="integration-stat-value integration-stat-planned">{integrationSummary.planned}</span>
          <span className="integration-stat-label">Planned</span>
        </div>
        <div className="integration-stat">
          <span className="integration-stat-value">{integrationSummary.formsReady}/{integrationSummary.formsTotal}</span>
          <span className="integration-stat-label">Forms Ready</span>
        </div>
        <div className="integration-stat">
          <span className="integration-stat-value">{integrationSummary.conversions}</span>
          <span className="integration-stat-label">Conversions</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="integration-tabs">
        <button
          className={`integration-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`integration-tab ${activeTab === 'forms' ? 'active' : ''}`}
          onClick={() => setActiveTab('forms')}
        >
          Forms
        </button>
        <button
          className={`integration-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          className={`integration-tab ${activeTab === 'utm' ? 'active' : ''}`}
          onClick={() => setActiveTab('utm')}
        >
          UTM Strategy
        </button>
      </div>

      {/* Tab Content */}
      <div className="integration-tab-content">
        {activeTab === 'overview' && (
          <div>
            <DataFlowDiagram />
            <div className="integration-list-title">Integration Status</div>
            {integrations.map(i => <IntegrationRow key={i.id} integration={i} />)}
          </div>
        )}

        {activeTab === 'forms' && (
          <div>
            <div className="integration-list-title">Form Integrations</div>
            <p className="integration-list-desc">
              All forms are structured for Action Network API. Click to see fields and tags.
            </p>
            {formIntegrations.map(f => <FormIntegrationRow key={f.id} form={f} />)}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="integration-list-title">GA4 Events</div>
            <p className="integration-list-desc">
              {analyticsEvents.length} events configured, {integrationSummary.conversions} marked as conversions.
            </p>
            <div className="events-table">
              <div className="events-header">
                <span className="event-col-name">Event</span>
                <span className="event-col-trigger">Trigger</span>
                <span className="event-col-conv">Conv?</span>
              </div>
              {analyticsEvents.map(e => (
                <div key={e.name} className="events-row">
                  <span className="event-col-name">
                    <code>{e.name}</code>
                    <span className="event-desc">{e.description}</span>
                  </span>
                  <span className="event-col-trigger">{e.trigger}</span>
                  <span className="event-col-conv">
                    {e.isConversion ? <span className="event-conv-yes">Yes</span> : '–'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'utm' && (
          <div>
            <div className="integration-list-title">UTM Parameter Strategy</div>
            <p className="integration-list-desc">{utmStrategy.description}</p>
            <div className="utm-params">
              {utmStrategy.parameters.map(p => (
                <div key={p.name} className="utm-param">
                  <div className="utm-param-name"><code>{p.name}</code></div>
                  <div className="utm-param-desc">{p.description}</div>
                  <div className="utm-param-examples">
                    {p.examples.map(ex => <span key={ex} className="utm-example">{ex}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="utm-examples-title">Example URLs</div>
            <div className="utm-example-urls">
              {utmStrategy.exampleUrls.map(url => (
                <code key={url} className="utm-example-url">{url}</code>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="seo-note">
        <strong>For MissionWired:</strong> This spec documents our data architecture. Forms are ready for Action Network API integration. Update <code>src/config/integrations.ts</code> as connections are made.
      </div>
    </div>
  );
}

function Header({ page, onNavigate }: { page: string; onNavigate: (p: string) => void }) {
  return (
    <header className="hub-header">
      <div className="hub-header-left">
        <div className="hub-logo">BVP</div>
        <span className="hub-title">Admin Hub</span>
      </div>
      <div className="hub-header-right">
        <button className="hub-header-btn" title="Help & Documentation">{Icons.help}</button>
        <button className="hub-header-btn" title="Settings" onClick={() => onNavigate(page === "settings" ? "dashboard" : "settings")}>
          {Icons.settings}
        </button>
        <button className="hub-logout-btn">Logout</button>
      </div>
    </header>
  );
}

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("now");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const refresh = useCallback(() => {
    setSpinning(true);
    setLoading(true);
    setTimeout(() => {
      setSpinning(false);
      setLoading(false);
      setLastUpdated("just now");
    }, 800);
  }, []);

  return (
    <div className="hub-main">
      <div className="hub-greeting">
        <h1>{getGreeting()}, Cyrus.</h1>
        <div className="hub-greeting-right">
          <span className="hub-updated">Last updated: {lastUpdated}</span>
          <button className={`hub-refresh-btn ${spinning ? "spinning" : ""}`} onClick={refresh}>
            {Icons.refresh} Refresh
          </button>
        </div>
      </div>

      {/* Metrics */}
      <SectionContainer label="Site Metrics">
        {loading ? (
          <div className="hub-metrics-row">
            {[1,2,3].map(i => (
              <div className="hub-metric-card" key={i}>
                <Skeleton width="55%" height={32} />
                <div style={{ marginTop: 8 }}><Skeleton width="70%" /></div>
                <div style={{ marginTop: 8 }}><Skeleton width="40%" height={12} /></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="hub-metrics-row">
              <MetricCard value={MOCK_METRICS.visitors.value.toLocaleString()} label="Visitors" sublabel="This Week" trend={MOCK_METRICS.visitors.trend} />
              <MetricCard value={MOCK_METRICS.pageviews.value.toLocaleString()} label="Pageviews" sublabel="This Week" trend={MOCK_METRICS.pageviews.trend} />
              <MetricCard value={MOCK_METRICS.avgDuration.value} label="Avg. Duration" trend={MOCK_METRICS.avgDuration.trend} />
            </div>
            <TopPagesTable pages={MOCK_METRICS.topPages} />
          </>
        )}
        <div style={{ overflow: "hidden" }}>
          <a className="hub-section-link" href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
            Open Google Analytics {Icons.arrow}
          </a>
        </div>
      </SectionContainer>

      {/* SEO Overview */}
      <SectionContainer label="SEO & Meta Tags">
        <SEOOverview />
      </SectionContainer>

      {/* Launch Checklist */}
      <SectionContainer label="Launch Checklist">
        <LaunchChecklist />
      </SectionContainer>

      {/* Accessibility Overview */}
      <SectionContainer label="Accessibility (WCAG 2.2 AA)">
        <AccessibilityOverview />
      </SectionContainer>

      {/* Integration Spec */}
      <SectionContainer label="Integration Spec (for MissionWired)">
        <IntegrationSpec />
      </SectionContainer>

      {/* Deployments */}
      <SectionContainer label="Deployments">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} style={{ padding: "14px 0", display: "flex", gap: 10, alignItems: "center" }}>
              <Skeleton width={18} height={18} /><Skeleton width="65%" /><Skeleton width="15%" />
            </div>
          ))
        ) : (
          MOCK_DEPLOYMENTS.map(d => <DeploymentRow key={d.id} d={d} />)
        )}
        <div style={{ overflow: "hidden" }}>
          <a className="hub-section-link" href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
            Open Vercel Dashboard {Icons.arrow}
          </a>
        </div>
      </SectionContainer>

      {/* Commits */}
      <SectionContainer label="Recent Commits">
        {loading ? (
          [1,2,3,4,5].map(i => (
            <div key={i} style={{ padding: "8px 0", display: "flex", gap: 12, alignItems: "center" }}>
              <Skeleton width={7} height={7} /><Skeleton width="55%" /><Skeleton width="12%" /><Skeleton width="10%" />
            </div>
          ))
        ) : (
          MOCK_COMMITS.map(c => <CommitRow key={c.sha} c={c} />)
        )}
        <div style={{ overflow: "hidden" }}>
          <a className="hub-section-link" href="https://github.com" target="_blank" rel="noopener noreferrer">
            Open GitHub Repo {Icons.arrow}
          </a>
        </div>
      </SectionContainer>

      {/* Tools */}
      <SectionContainer label="Tools">
        <div className="hub-tools-grid">
          {TOOLS.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      </SectionContainer>
    </div>
  );
}

function SettingsPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="hub-main">
      <div className="hub-settings-title">Settings</div>

      <SectionContainer label="Account">
        <div className="hub-account-info">
          <div className="hub-avatar">C</div>
          <div>
            <div className="hub-account-name">Cyrus</div>
            <div className="hub-account-email">cyrus@blackveteransproject.org</div>
          </div>
        </div>
        <a className="hub-manage-link" href="#" onClick={e => e.preventDefault()}>
          Manage Account {Icons.arrow}
        </a>
      </SectionContainer>

      <SectionContainer label="Security">
        <div className="hub-security-row">
          <span className="hub-2fa-label">Two-Factor Authentication</span>
          <span className="hub-2fa-badge">{Icons.check} Enabled</span>
        </div>
        <div className="hub-2fa-desc">Your account is protected with 2FA via authenticator app.</div>
        <a className="hub-manage-link" href="#" onClick={e => e.preventDefault()}>
          Manage 2FA Settings {Icons.arrow}
        </a>

        <div className="hub-sessions-title">Active Sessions</div>
        <div className="hub-session-item">
          <span>Chrome on macOS <span style={{ fontSize: 11, color: "var(--green-600)", marginLeft: 6 }}>(current)</span></span>
          <span className="hub-session-location">San Francisco, CA</span>
        </div>
        <div className="hub-session-item">
          <span>Safari on iOS</span>
          <span className="hub-session-location">San Francisco, CA</span>
        </div>
        <button className="hub-btn-secondary">Sign Out All Other Sessions</button>
      </SectionContainer>

      <SectionContainer label="Danger Zone">
        <div className="hub-danger-section" style={{ display: "inline-block" }}>
          <button className="hub-btn-danger">Sign Out</button>
        </div>
      </SectionContainer>

      <button className="hub-back-link" onClick={() => onNavigate("dashboard")}>
        {Icons.back} Back to Dashboard
      </button>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="hub-container">
      <Header page={page} onNavigate={setPage} />
      {page === "dashboard" ? <DashboardPage /> : <SettingsPage onNavigate={setPage} />}
      <footer className="hub-footer">
        BVP Admin Hub v1.0 &nbsp;•&nbsp; <a href="https://blackveteransproject.org" target="_blank" rel="noopener noreferrer">blackveteransproject.org</a> &nbsp;•&nbsp; © 2026
      </footer>
    </div>
  );
}
