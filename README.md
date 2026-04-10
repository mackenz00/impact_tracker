# Impact Tracker

A prototype tool for nonprofit newsrooms to track the real-world impact of their journalism — from story ideation through post-publication outcomes — and auto-generate grant reports.

## What It Does

- **Story Pipeline** — Kanban board tracking stories from pitch → published, with grant linkage and intended impact defined upfront.
- **Impact Log** — Record real-world outcomes (policy changes, media pickups, community action, reader testimonials) with source attribution and magnitude scoring.
- **AI Scout** — Simulated automated discovery of your reporting's impact across legislative databases, court filings, social media, academic citations, and news pickups. One-click confirm/dismiss triage.
- **Slack Integration** — Reporters drop impact notes in a `#impact-log` channel; a bot auto-parses story references, impact type, and magnitude.
- **Email Forwarding** — Forward reader emails and official responses to `impact@yournewsroom.org` for automatic parsing and logging.
- **Leaderboard & Gamification** — XP system, levels, streaks, and badges to reduce friction and make impact logging something reporters actually do.
- **Dashboard** — Aggregate stats, impact-by-category breakdowns, intake channel mix, and grant portfolio health.
- **Grant Report Generator** — Select a grant, get an auto-generated narrative paragraph and impact timeline ready to paste into funder reports.

## The Core Idea

Stories are linked to grants at pitch time. Every impact event logged post-publication — whether via Slack, email, AI discovery, or manual entry — flows automatically into the correct grant report. No extra work.

## Running Locally

```bash
npm install
npm run dev
```

Opens at `localhost:5173`.

## Tech

- React + Vite
- Single-file component (no backend)
- Pre-loaded with realistic sample data to demonstrate the full flow

## ⚠️ Disclaimer

This is a vibe-coded prototype — built rapidly in conversation with Claude to explore the concept and validate the UX. It is not production software. The data is simulated, integrations (Slack, email, AI Scout) are mocked, and there is no backend or persistence. It's a starting point, not a finished product.

## License

MIT