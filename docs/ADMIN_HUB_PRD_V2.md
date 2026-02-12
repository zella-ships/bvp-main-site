# BVP Admin Hub - Product Requirements Document v2

**Document Version:** 2.0
**Last Updated:** February 2026
**Status:** Final Scope
**Author:** Engineering

---

## Executive Summary

A lightweight, secure admin hub for Black Veterans Project that provides:
1. **2FA-protected access** for authorized team members
2. **Glanceable metrics** pulled from external APIs (no clicking out for daily stats)
3. **Quick-link tools grid** to all operational platforms
4. **Deployment/version control visibility** without leaving the hub

This is NOT a full admin suite. It's a command center—a single tab that answers "how are we doing?" and "where do I go to do X?"

---

## Product Principles

1. **Glance, don't dig** - Key metrics visible in 2 seconds
2. **Link out for action** - Don't rebuild tools, link to them
3. **Secure by default** - 2FA required, no exceptions
4. **Fast and minimal** - Sub-second load times, no bloat

---

## Information Architecture

```
admin.blackveteransproject.org/
├── /login                    # Clerk-managed login + 2FA
├── /                         # Dashboard (home)
│   ├── Stats Section         # GA metrics, pulled via API
│   ├── Deploys Section       # Vercel deploys, pulled via API
│   ├── Activity Section      # GitHub commits, pulled via API
│   └── Tools Section         # Grid of tool links
└── /settings                 # Account settings, logout
```

**Total pages: 3** (Login, Dashboard, Settings)

---

## Detailed Page Specifications

---

### Page 1: Login (`/login`)

**Purpose:** Secure authentication with mandatory 2FA

**Managed by:** Clerk (hosted UI or embedded components)

#### Layout Specification

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
│                         ┌─────────────────┐                         │
│                         │                 │                         │
│                         │   BVP LOGO      │                         │
│                         │   (centered)    │                         │
│                         │                 │                         │
│                         └─────────────────┘                         │
│                                                                     │
│                         Admin Hub                                   │
│                         (text, centered)                            │
│                                                                     │
│                    ┌─────────────────────────┐                      │
│                    │                         │                      │
│                    │   Email                 │                      │
│                    │   [___________________] │                      │
│                    │                         │                      │
│                    │   Password              │                      │
│                    │   [___________________] │                      │
│                    │                         │                      │
│                    │   [    Sign In      ]   │                      │
│                    │                         │                      │
│                    │   ─────── or ────────   │                      │
│                    │                         │                      │
│                    │   [ G  Continue w/    ] │                      │
│                    │   [    Google         ] │                      │
│                    │                         │                      │
│                    └─────────────────────────┘                      │
│                                                                     │
│                    Forgot password?                                 │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 2FA Flow (After Initial Login)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         ┌─────────────────┐                         │
│                         │   BVP LOGO      │                         │
│                         └─────────────────┘                         │
│                                                                     │
│                     Two-Factor Authentication                       │
│                                                                     │
│                    ┌─────────────────────────┐                      │
│                    │                         │                      │
│                    │   Enter the 6-digit     │                      │
│                    │   code from your        │                      │
│                    │   authenticator app     │                      │
│                    │                         │                      │
│                    │   ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐│                      │
│                    │   │ │ │ │ │ │ │ │ │ │ │ ││                      │
│                    │   └─┘ └─┘ └─┘ └─┘ └─┘ └─┘│                      │
│                    │                         │                      │
│                    │   [     Verify       ]  │                      │
│                    │                         │                      │
│                    │   Use backup code       │                      │
│                    │                         │                      │
│                    └─────────────────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Login Specifications

| Element | Specification |
|---------|---------------|
| Logo | BVP logo, 120px width, centered |
| Title | "Admin Hub" - 14px, uppercase, tracking-widest, gray-500 |
| Form width | 400px max, centered |
| Input fields | 48px height, 16px font, 1px border gray-300 |
| Sign in button | Full width, 48px height, black background, white text, font-bold |
| Google button | Full width, 48px height, white background, 1px border, Google logo left |
| 2FA input | 6 separate boxes, 48x56px each, centered, auto-advance on input |
| Background | White (#FFFFFF) |
| Card background | White with subtle shadow (0 4px 24px rgba(0,0,0,0.08)) |

#### Authentication Requirements

| Requirement | Implementation |
|-------------|----------------|
| 2FA mandatory | Clerk setting: require MFA for all users |
| 2FA methods | TOTP (Google Authenticator, Authy, 1Password) |
| Backup codes | 10 backup codes generated on 2FA setup |
| Session duration | 7 days, revoked on password change |
| Failed attempts | Lock after 5 failed attempts, 15-minute cooldown |
| Password requirements | Minimum 12 characters, no other restrictions |

---

### Page 2: Dashboard (`/`)

**Purpose:** The command center. Glanceable stats + tool access.

#### Full Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                                     │
│ │BVP LOGO │  Admin Hub                              [?] [⚙️ Settings] [Logout]  │
│ └─────────┘                                                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Good morning, Cyrus.                                      Last updated: now │
│                                                                      [Refresh] │
│                                                                                 │
│  ┌─ SITE METRICS ───────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │  │
│  │  │                 │  │                 │  │                 │           │  │
│  │  │     1,247       │  │       892       │  │      3:42       │           │  │
│  │  │                 │  │                 │  │                 │           │  │
│  │  │    Visitors     │  │    Pageviews    │  │  Avg. Duration  │           │  │
│  │  │    This Week    │  │    This Week    │  │                 │           │  │
│  │  │                 │  │                 │  │                 │           │  │
│  │  │    ↑ 12%        │  │    ↑ 8%         │  │    ↓ 5%         │           │  │
│  │  │                 │  │                 │  │                 │           │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘           │  │
│  │                                                                           │  │
│  │  Top Pages                                                                │  │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │  │
│  │  │  1. /                          542 views   ████████████████░░░ 61% │  │  │
│  │  │  2. /our-work                  187 views   █████░░░░░░░░░░░░░░ 21% │  │  │
│  │  │  3. /donate                     89 views   ███░░░░░░░░░░░░░░░░ 10% │  │  │
│  │  │  4. /join                       74 views   ██░░░░░░░░░░░░░░░░░  8% │  │  │
│  │  └────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                           │  │
│  │                                        [Open Google Analytics →]          │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ DEPLOYMENTS ─────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ✓  Production    "closed gap on our-work page"           2 hours ago    │  │
│  │     main → bvp-main-site.vercel.app                                      │  │
│  │                                                                           │  │
│  │  ✓  Production    "added 2FA to admin hub"                yesterday      │  │
│  │     main → bvp-main-site.vercel.app                                      │  │
│  │                                                                           │  │
│  │  ✓  Production    "fixed footer four columns"             2 days ago     │  │
│  │     main → bvp-main-site.vercel.app                                      │  │
│  │                                                                           │  │
│  │                                               [Open Vercel Dashboard →]   │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ RECENT COMMITS ──────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ○  feat: add admin hub with 2FA               claude-code   2 hours ago │  │
│  │  ○  fix: close gap on our-work page            claude-code   2 hours ago │  │
│  │  ○  fix: footer to four columns                claude-code   yesterday   │  │
│  │  ○  feat: add global header/footer             claude-code   yesterday   │  │
│  │  ○  feat: convert join page to next.js         claude-code   2 days ago  │  │
│  │                                                                           │  │
│  │                                                   [Open GitHub Repo →]    │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ TOOLS ───────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   │   [GA]    │  │   [AN]    │  │   [MC]    │  │   [ZP]    │            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   │  Google   │  │  Action   │  │ Mailchimp │  │  Zapier   │            │  │
│  │   │ Analytics │  │  Network  │  │           │  │           │            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   └───────────┘  └───────────┘  └───────────┘  └───────────┘            │  │
│  │                                                                           │  │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   │   [VL]    │  │   [GH]    │  │   [DN]    │  │   [ST]    │            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   │  Vercel   │  │  GitHub   │  │ Donately  │  │  Stripe   │            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   │           │  │           │  │           │  │           │            │  │
│  │   └───────────┘  └───────────┘  └───────────┘  └───────────┘            │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  BVP Admin Hub v1.0  •  blackveteransproject.org  •  © 2026               ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Section 1: Header

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                                     │
│ │BVP LOGO │  Admin Hub                              [?] [⚙️ Settings] [Logout]  │
│ └─────────┘                                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| Element | Specification |
|---------|---------------|
| Container | Full width, 72px height, white background, bottom border 1px gray-200 |
| Logo | BVP logo, 40px height, left-aligned with 24px padding |
| Title | "Admin Hub" - 14px, uppercase, tracking-widest, gray-400, 12px left of logo |
| Help icon | 20px, gray-400, tooltip "Help & Documentation" |
| Settings | 20px gear icon, gray-400, links to /settings |
| Logout | Text button, 14px, gray-600, hover:gray-900 |
| Right padding | 24px |

---

#### Section 2: Greeting Bar

```
│  Good morning, Cyrus.                                      Last updated: now │
│                                                                      [Refresh] │
```

| Element | Specification |
|---------|---------------|
| Container | Full width, padding 24px horizontal, 16px vertical |
| Greeting | Dynamic based on time: "Good morning/afternoon/evening, {firstName}." |
| Greeting style | 24px, font-semibold, gray-900 |
| Last updated | Right-aligned, 14px, gray-500 |
| Refresh button | Text button with rotate icon, 14px, gray-600, hover:gray-900 |
| Time logic | Morning: 5am-12pm, Afternoon: 12pm-5pm, Evening: 5pm-5am |

---

#### Section 3: Site Metrics (Google Analytics Data)

```
┌─ SITE METRICS ───────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │     1,247       │  │       892       │  │      3:42       │           │
│  │    Visitors     │  │    Pageviews    │  │  Avg. Duration  │           │
│  │    This Week    │  │    This Week    │  │                 │           │
│  │    ↑ 12%        │  │    ↑ 8%         │  │    ↓ 5%         │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
│                                                                           │
│  Top Pages                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1. /                          542 views   ████████████████░░░ 61% │  │
│  │  2. /our-work                  187 views   █████░░░░░░░░░░░░░░ 21% │  │
│  │  3. /donate                     89 views   ███░░░░░░░░░░░░░░░░ 10% │  │
│  │  4. /join                       74 views   ██░░░░░░░░░░░░░░░░░  8% │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│                                        [Open Google Analytics →]          │
└───────────────────────────────────────────────────────────────────────────┘
```

##### Section Container

| Element | Specification |
|---------|---------------|
| Container | White background, 1px border gray-200, rounded-lg (8px) |
| Padding | 24px |
| Margin | 24px horizontal, 16px bottom |
| Section label | "SITE METRICS" - 11px, uppercase, tracking-widest, gray-400, font-bold |
| Label position | Top-left, -12px offset (overlapping border), white background padding 0 8px |

##### Metric Cards (3 cards)

| Element | Specification |
|---------|---------------|
| Card container | Flex row, gap 16px |
| Card size | Flex-1, min-width 180px, padding 20px |
| Card background | gray-50 |
| Card border | 1px gray-200, rounded-md (6px) |
| Metric value | 36px, font-bold, gray-900 |
| Metric label | 14px, gray-600, margin-top 4px |
| Metric sublabel | 12px, gray-400 (e.g., "This Week") |
| Trend indicator | 12px, font-medium, margin-top 8px |
| Trend up | Green-600, "↑" prefix |
| Trend down | Red-500, "↓" prefix |
| Trend neutral | Gray-400, "–" prefix |

##### Metric Definitions

| Metric | GA Dimension | Calculation |
|--------|--------------|-------------|
| Visitors | `totalUsers` | Sum for selected period |
| Pageviews | `screenPageViews` | Sum for selected period |
| Avg. Duration | `averageSessionDuration` | Average, formatted as M:SS |
| Trend % | Compare to previous period | (current - previous) / previous * 100 |

##### Top Pages Table

| Element | Specification |
|---------|---------------|
| Container | margin-top 20px |
| Header | "Top Pages" - 14px, font-semibold, gray-900, margin-bottom 12px |
| Table | No visible borders, rows separated by 8px |
| Rank | 14px, gray-400, 24px width |
| Page path | 14px, font-medium, gray-900, flex-1 |
| Views | 14px, gray-600, 80px width, right-aligned |
| Progress bar | 100px width, 8px height, gray-200 background, gray-900 fill |
| Percentage | 14px, gray-500, 48px width, right-aligned |
| Max rows | 4 pages shown |

##### Link to GA

| Element | Specification |
|---------|---------------|
| Position | Bottom-right of section, margin-top 16px |
| Style | 14px, font-medium, gray-600, hover:gray-900 |
| Icon | Right arrow (→), 4px margin-left |
| URL | https://analytics.google.com (opens new tab) |

---

#### Section 4: Deployments (Vercel Data)

```
┌─ DEPLOYMENTS ─────────────────────────────────────────────────────────────┐
│                                                                           │
│  ✓  Production    "closed gap on our-work page"           2 hours ago    │
│     main → bvp-main-site.vercel.app                                      │
│                                                                           │
│  ✓  Production    "added 2FA to admin hub"                yesterday      │
│     main → bvp-main-site.vercel.app                                      │
│                                                                           │
│  ✓  Production    "fixed footer four columns"             2 days ago     │
│     main → bvp-main-site.vercel.app                                      │
│                                                                           │
│                                               [Open Vercel Dashboard →]   │
└───────────────────────────────────────────────────────────────────────────┘
```

##### Section Container

Same as Site Metrics section (white, border, rounded, 24px padding)

##### Deployment Row

| Element | Specification |
|---------|---------------|
| Row height | Auto, padding 12px 0, border-bottom 1px gray-100 (except last) |
| Status icon | 16px circle |
| Status: Ready | ✓ checkmark, green-600 |
| Status: Building | Spinning loader, yellow-500 |
| Status: Error | ✕, red-500 |
| Environment | "Production" or "Preview" - 12px, uppercase, tracking-wide |
| Environment: Production | gray-900, font-bold |
| Environment: Preview | gray-500, font-medium |
| Commit message | 14px, gray-700, truncate at 40 chars, quoted |
| Timestamp | 14px, gray-400, right-aligned |
| Branch info | 12px, gray-400, "main → domain" format |

##### Data Source

| Field | Vercel API Field |
|-------|------------------|
| Status | `deployment.readyState` |
| Environment | `deployment.target` ("production" or null) |
| Commit message | `deployment.meta.githubCommitMessage` |
| Timestamp | `deployment.createdAt` |
| Branch | `deployment.meta.githubCommitRef` |
| Domain | `deployment.url` |

##### Link to Vercel

| Element | Specification |
|---------|---------------|
| Position | Bottom-right of section |
| Style | Same as GA link |
| URL | https://vercel.com/your-team/bvp-main-site (opens new tab) |

---

#### Section 5: Recent Commits (GitHub Data)

```
┌─ RECENT COMMITS ──────────────────────────────────────────────────────────┐
│                                                                           │
│  ○  feat: add admin hub with 2FA               claude-code   2 hours ago │
│  ○  fix: close gap on our-work page            claude-code   2 hours ago │
│  ○  fix: footer to four columns                claude-code   yesterday   │
│  ○  feat: add global header/footer             claude-code   yesterday   │
│  ○  feat: convert join page to next.js         claude-code   2 days ago  │
│                                                                           │
│                                                   [Open GitHub Repo →]    │
└───────────────────────────────────────────────────────────────────────────┘
```

##### Commit Row

| Element | Specification |
|---------|---------------|
| Row height | 36px, flex align-center |
| Dot | 8px circle, gray-300, margin-right 12px |
| Commit message | 14px, gray-900, truncate at 45 chars |
| Author | 14px, gray-500, 100px width |
| Timestamp | 14px, gray-400, right-aligned |
| Max rows | 5 commits shown |

##### Data Source

| Field | GitHub API Field |
|-------|------------------|
| Message | `commit.message` (first line only) |
| Author | `commit.author.name` or `author.login` |
| Timestamp | `commit.author.date` |

##### Link to GitHub

| Element | Specification |
|---------|---------------|
| URL | https://github.com/your-org/bvp-main-site (opens new tab) |

---

#### Section 6: SEO Overview

```
┌─ SEO OVERVIEW ────────────────────────────────────────────────────────────┐
│                                                                           │
│  Page              Title                          Description    OG Image │
│  ───────────────────────────────────────────────────────────────────────  │
│  /                 Black Veterans Project —...    ✓ Set          ✗ None  │
│  /about            About Us | BVP                 ✓ Set          ✗ None  │
│  /our-work         Our Work | BVP                 ✓ Set          ✗ None  │
│  /join             Join | BVP                     ✓ Set          ✗ None  │
│  /donate           Donate | BVP                   ✓ Set          ✗ None  │
│  /press            Press | BVP                    ✓ Set          ✗ None  │
│  /contact          Contact | BVP                  ✓ Set          ✗ None  │
│  /faq              FAQ | BVP                      ✓ Set          ✗ None  │
│  /financials       Financials & 990 | BVP         ✓ Set          ✗ None  │
│  /privacy          Privacy Policy | BVP           ✓ Set          ✗ None  │
│  /terms            Terms of Use | BVP             ✓ Set          ✗ None  │
│  /accessibility    Accessibility | BVP            ✓ Set          ✗ None  │
│                                                                           │
│  External Validators                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ metatags.io │  │  Google     │  │  Facebook   │  │  Twitter    │      │
│  │  Preview    │  │  Rich Test  │  │  Debugger   │  │  Validator  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

##### Section Container

Same as other sections (white, border, rounded, 24px padding)

##### SEO Table

| Element | Specification |
|---------|---------------|
| Header row | 12px, uppercase, tracking-wide, gray-400, font-bold |
| Page path | 14px, font-medium, gray-900, monospace |
| Title | 14px, gray-700, truncate at 30 chars with "..." |
| Description status | ✓ green-600 if set, ✗ red-500 if missing |
| OG Image status | ✓ green-600 if set, ✗ red-500 if missing |
| Row hover | gray-50 background |
| Max rows | Show all 12 pages (scrollable if needed on mobile) |

##### Validator Cards

| Element | Specification |
|---------|---------------|
| Card size | 120px × 60px |
| Layout | 4 columns on desktop, 2 on mobile |
| Gap | 12px |
| Background | gray-50 |
| Border | 1px gray-200, rounded-md |
| Hover | Border gray-400 |
| Text | 12px, font-medium, gray-700, centered |

##### Validator Links

| Validator | URL |
|-----------|-----|
| metatags.io | https://metatags.io/?url=https://blackveteransproject.org |
| Google Rich Results | https://search.google.com/test/rich-results?url=https://blackveteransproject.org |
| Facebook Debugger | https://developers.facebook.com/tools/debug/?q=https://blackveteransproject.org |
| Twitter Validator | https://cards-dev.twitter.com/validator |

##### Data Source

SEO data is pulled from `/src/config/seo.ts` which contains:
- `siteConfig`: Global site metadata
- `pagesSEO`: Array of all pages with title, description, ogImage status

---

#### Section 7: Tools Grid

```
┌─ TOOLS ───────────────────────────────────────────────────────────────────┐
│                                                                           │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│   │   [GA]    │  │   [AN]    │  │   [MC]    │  │   [ZP]    │            │
│   │  Google   │  │  Action   │  │ Mailchimp │  │  Zapier   │            │
│   │ Analytics │  │  Network  │  │           │  │           │            │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘            │
│                                                                           │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│   │   [VL]    │  │   [GH]    │  │   [DN]    │  │   [ST]    │            │
│   │  Vercel   │  │  GitHub   │  │ Donately  │  │  Stripe   │            │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

##### Grid Container

| Element | Specification |
|---------|---------------|
| Layout | CSS Grid, 4 columns on desktop, 2 columns on mobile |
| Gap | 16px |
| Padding | 24px |

##### Tool Card

| Element | Specification |
|---------|---------------|
| Size | 140px × 120px |
| Background | White |
| Border | 1px gray-200 |
| Border radius | 8px |
| Hover state | Border gray-400, shadow-sm, translateY(-2px) |
| Active state | Border gray-900 |
| Padding | 16px |
| Cursor | Pointer |

##### Tool Card Contents

| Element | Specification |
|---------|---------------|
| Logo | 40px × 40px, centered, margin-bottom 12px |
| Name | 14px, font-medium, gray-900, centered |
| Subtitle | 12px, gray-500, centered (optional, for 2-line names) |

##### Tool Definitions

| Tool | Logo | Name | URL |
|------|------|------|-----|
| Google Analytics | GA logo (SVG) | "Google Analytics" | https://analytics.google.com |
| Action Network | AN logo (SVG) | "Action Network" | https://actionnetwork.org/users/sign_in |
| Mailchimp | MC logo (SVG) | "Mailchimp" | https://login.mailchimp.com |
| Zapier | Zapier logo (SVG) | "Zapier" | https://zapier.com/app/dashboard |
| Vercel | Vercel logo (SVG) | "Vercel" | https://vercel.com/dashboard |
| GitHub | GitHub logo (SVG) | "GitHub" | https://github.com/your-org/bvp-main-site |
| Donately | Donately logo (SVG) | "Donately" | https://dashboard.donately.com |
| Stripe | Stripe logo (SVG) | "Stripe" | https://dashboard.stripe.com |

##### Logo Assets Required

All logos should be:
- SVG format
- Monochrome (gray-700) in default state
- Brand color on hover
- 40×40px viewBox

---

#### Section 7: Footer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BVP Admin Hub v1.0  •  blackveteransproject.org  •  © 2026               │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Element | Specification |
|---------|---------------|
| Container | Full width, padding 24px, margin-top 40px, border-top 1px gray-200 |
| Text | 12px, gray-400, centered |
| Site link | Underline on hover, opens main site in new tab |

---

### Page 3: Settings (`/settings`)

**Purpose:** Account management, logout, help

#### Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                                     │
│ │BVP LOGO │  Admin Hub                              [?] [⚙️ Settings] [Logout]  │
│ └─────────┘                                                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Settings                                                                       │
│                                                                                 │
│  ┌─ ACCOUNT ─────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ┌──────┐   Cyrus                                                        │  │
│  │  │Avatar│   cyrus@blackveteransproject.org                               │  │
│  │  └──────┘                                                                │  │
│  │                                                                           │  │
│  │  [Manage Account →]     (opens Clerk user portal)                        │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ SECURITY ────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  Two-Factor Authentication                                    [Enabled ✓] │  │
│  │  Your account is protected with 2FA via authenticator app.               │  │
│  │                                                                           │  │
│  │  [Manage 2FA Settings →]                                                 │  │
│  │                                                                           │  │
│  │  Active Sessions                                                          │  │
│  │  ├─ Chrome on macOS (current)                          San Francisco, CA │  │
│  │  └─ Safari on iOS                                      San Francisco, CA │  │
│  │                                                                           │  │
│  │  [Sign Out All Other Sessions]                                           │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ DANGER ZONE ─────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  [Sign Out]                                                               │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ← Back to Dashboard                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

##### Settings Specifications

| Section | Elements |
|---------|----------|
| Account | Avatar (48px), Name (18px, bold), Email (14px, gray-500), Manage link |
| Security | 2FA status badge, Session list, Sign out all button |
| Danger Zone | Red border, Sign out button (red) |

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Desktop | ≥1024px | Full layout as specified |
| Tablet | 768-1023px | Tools grid: 3 columns, metrics stack if needed |
| Mobile | <768px | Tools grid: 2 columns, all sections full-width, metrics stack vertically |

### Mobile-Specific Adjustments

| Element | Desktop | Mobile |
|---------|---------|--------|
| Header height | 72px | 64px |
| Section padding | 24px | 16px |
| Metric cards | Row of 3 | Stack vertically |
| Tools grid | 4 columns | 2 columns |
| Greeting text | 24px | 20px |
| Section margins | 24px | 16px |

---

## Data Fetching Strategy

### Initial Load

```
Page Load
    │
    ├─→ Fetch GA metrics (server-side, cached 5 min)
    │
    ├─→ Fetch Vercel deployments (server-side, cached 1 min)
    │
    └─→ Fetch GitHub commits (server-side, cached 5 min)
    │
    ▼
Render with data
```

### Refresh Behavior

| Trigger | Action |
|---------|--------|
| Page load | Fetch all data, use cache if valid |
| Refresh button | Invalidate cache, fetch fresh data |
| Auto-refresh | Every 5 minutes while tab is active |
| Background tab | Pause auto-refresh, refresh on tab focus |

### Loading States

| State | Display |
|-------|---------|
| Initial load | Skeleton placeholders matching content shape |
| Refreshing | Subtle loading indicator in header, content stays visible |
| Error | Error message with retry button, stale data shown if available |

### Skeleton Specifications

```
Metric Card Skeleton:
┌─────────────────┐
│ ████████        │  <- 60% width gray-200 animated pulse
│ ██████          │  <- 40% width gray-200 animated pulse
│ ████            │  <- 30% width gray-200 animated pulse
└─────────────────┘

Deployment Row Skeleton:
│ ●  ████████████████████████████████           ████████ │

Commit Row Skeleton:
│ ○  ████████████████████████████      ██████   ████████ │

Tool Card Skeleton:
┌───────────┐
│   ████    │  <- 40x40 gray-200 circle
│  ██████   │  <- 60% width gray-200
└───────────┘
```

---

## Error Handling

### API Failure States

| Service | Error Display | Fallback |
|---------|---------------|----------|
| Google Analytics | "Unable to load analytics" + retry button | Show last known data with "stale" indicator |
| Vercel | "Unable to load deployments" + retry button | Show last known data |
| GitHub | "Unable to load commits" + retry button | Show last known data |
| All services down | Full-page error with "Check your connection" | Retry button |

### Error Message Component

```
┌─────────────────────────────────────────────┐
│  ⚠️  Unable to load analytics               │
│                                             │
│  There was a problem connecting to Google.  │
│                                             │
│  [Retry]                                    │
└─────────────────────────────────────────────┘
```

| Element | Specification |
|---------|---------------|
| Container | Yellow-50 background, yellow-200 border, rounded-md, padding 16px |
| Icon | ⚠️ warning, yellow-600, 20px |
| Title | 14px, font-medium, yellow-800 |
| Description | 14px, yellow-700 |
| Retry button | 14px, font-medium, yellow-800, underline |

---

## Technical Implementation

### Required Environment Variables

```bash
# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# Google Analytics
GA_PROPERTY_ID=123456789
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Vercel
VERCEL_ACCESS_TOKEN=xxx
VERCEL_TEAM_ID=team_xxx
VERCEL_PROJECT_ID=prj_xxx

# GitHub
GITHUB_ACCESS_TOKEN=ghp_xxx
GITHUB_REPO_OWNER=blackveteransproject
GITHUB_REPO_NAME=bvp-main-site
```

### API Routes

```
/app/api/
├── analytics/
│   └── route.ts          # GET: Fetch GA data
├── deployments/
│   └── route.ts          # GET: Fetch Vercel deployments
└── commits/
    └── route.ts          # GET: Fetch GitHub commits
```

### Caching Strategy

| Endpoint | Cache Duration | Cache Location |
|----------|----------------|----------------|
| /api/analytics | 5 minutes | Server (Next.js cache) |
| /api/deployments | 1 minute | Server (Next.js cache) |
| /api/commits | 5 minutes | Server (Next.js cache) |

---

## Component Inventory

### Required Components

| Component | Description | Props |
|-----------|-------------|-------|
| `<Header />` | Top navigation bar | `user: ClerkUser` |
| `<GreetingBar />` | Welcome message + refresh | `firstName: string`, `onRefresh: () => void` |
| `<MetricsSection />` | GA stats display | `data: MetricsData`, `loading: boolean` |
| `<MetricCard />` | Individual stat card | `value: string`, `label: string`, `trend: number` |
| `<TopPagesTable />` | Page views table | `pages: PageData[]` |
| `<DeploymentsSection />` | Vercel deploys list | `deployments: Deployment[]`, `loading: boolean` |
| `<DeploymentRow />` | Single deployment | `deployment: Deployment` |
| `<CommitsSection />` | GitHub commits list | `commits: Commit[]`, `loading: boolean` |
| `<CommitRow />` | Single commit | `commit: Commit` |
| `<ToolsGrid />` | Tool cards grid | `tools: Tool[]` |
| `<ToolCard />` | Single tool link | `tool: Tool` |
| `<SectionContainer />` | Wrapper with label | `label: string`, `children: ReactNode` |
| `<SkeletonCard />` | Loading placeholder | `variant: 'metric' \| 'deployment' \| 'commit' \| 'tool'` |
| `<ErrorState />` | Error display | `message: string`, `onRetry: () => void` |

### Type Definitions

```typescript
interface MetricsData {
  visitors: { value: number; trend: number };
  pageviews: { value: number; trend: number };
  avgDuration: { value: string; trend: number };
  topPages: PageData[];
  period: 'week' | 'month';
  lastUpdated: Date;
}

interface PageData {
  path: string;
  views: number;
  percentage: number;
}

interface Deployment {
  id: string;
  status: 'READY' | 'BUILDING' | 'ERROR' | 'CANCELED';
  environment: 'production' | 'preview';
  commitMessage: string;
  branch: string;
  url: string;
  createdAt: Date;
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  createdAt: Date;
}

interface Tool {
  id: string;
  name: string;
  logo: string; // SVG path or component
  url: string;
  description?: string;
}
```

---

## Acceptance Criteria

### Authentication
- [ ] User can sign in with email/password
- [ ] User can sign in with Google OAuth
- [ ] 2FA is required for all users (enforced by Clerk)
- [ ] User can set up 2FA with authenticator app
- [ ] User can use backup codes if authenticator unavailable
- [ ] Session persists for 7 days
- [ ] User can sign out
- [ ] User can sign out all other sessions

### Dashboard - Metrics
- [ ] Displays visitor count for current week
- [ ] Displays pageview count for current week
- [ ] Displays average session duration
- [ ] Shows trend percentage vs. previous week
- [ ] Trend is green/up arrow when positive
- [ ] Trend is red/down arrow when negative
- [ ] Shows top 4 pages with view counts and percentages
- [ ] Progress bars accurately reflect percentages
- [ ] "Open Google Analytics" link opens GA in new tab
- [ ] Shows loading skeleton while fetching
- [ ] Shows error state if GA API fails
- [ ] Data refreshes when refresh button clicked

### Dashboard - Deployments
- [ ] Shows 3 most recent deployments
- [ ] Displays deployment status (ready/building/error)
- [ ] Shows commit message (truncated if long)
- [ ] Shows relative timestamp
- [ ] Shows branch and domain info
- [ ] "Open Vercel Dashboard" link works
- [ ] Shows loading skeleton while fetching
- [ ] Shows error state if Vercel API fails

### Dashboard - Commits
- [ ] Shows 5 most recent commits
- [ ] Displays commit message (first line, truncated)
- [ ] Shows author name
- [ ] Shows relative timestamp
- [ ] "Open GitHub Repo" link works
- [ ] Shows loading skeleton while fetching
- [ ] Shows error state if GitHub API fails

### Dashboard - Tools
- [ ] Displays 8 tool cards in grid
- [ ] Each card shows logo and name
- [ ] Cards have hover state
- [ ] Clicking card opens tool URL in new tab
- [ ] Grid is responsive (4 cols → 2 cols on mobile)

### Settings
- [ ] Shows user avatar, name, email
- [ ] "Manage Account" opens Clerk user portal
- [ ] Shows 2FA status
- [ ] Shows active sessions
- [ ] "Sign Out All Other Sessions" works
- [ ] "Sign Out" logs user out and redirects to login

### Responsive
- [ ] Dashboard is usable on tablet (768px)
- [ ] Dashboard is usable on mobile (375px)
- [ ] All touch targets are minimum 44px
- [ ] No horizontal scrolling on mobile

### Performance
- [ ] Initial page load < 2 seconds
- [ ] Time to interactive < 3 seconds
- [ ] Lighthouse performance score > 90

---

## Out of Scope (v1)

The following are explicitly NOT included in this version:

1. Content management / CMS editing
2. Form submission viewing (use Action Network)
3. Member management (use Action Network)
4. Email campaign creation (use Mailchimp)
5. Donation processing (use Donately)
6. User invitation / multi-user management
7. Audit logging
8. Dark mode
9. Keyboard shortcuts
10. Mobile native app

---

## Future Considerations (v2+)

| Feature | Complexity | Value |
|---------|------------|-------|
| Action Network form submissions inline | Medium | High |
| Mailchimp subscriber count card | Low | Medium |
| Trigger Vercel redeploy from dashboard | Low | Low |
| Quick actions (e.g., "New blog post" → opens CMS) | Medium | Medium |
| Notification center | High | Medium |
| Team member management | Medium | Low (small team) |

---

*Document complete. Ready for design mockup and implementation.*
