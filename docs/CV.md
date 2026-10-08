Kateryna Skoryna
Frontend-Focused Full-Stack Developer · React · TypeScript · Node.js · AI-Powered Products
Berlin, Germany · k.skoryna@gmail.com · +49 160 998 14 255 · LinkedIn · GitHub
Frontend-focused Full-Stack Developer with three years of experience building production React and TypeScript applications for B2B
and B2C products. Owns features from the React UI through REST APIs and the PostgreSQL data layer, including external data
integration, authentication and claims-based authorization. Measurable frontend and API performance gains, and AI features with
validated LLM output.
SKILLS
Frontend: React · TypeScript · JavaScript · Next.js · React Hooks · Material UI · Zustand · Axios · Vite · Recharts · Sass · Tailwind CSS · HTML
Backend & Data: Node.js · NestJS · PostgreSQL · TypeORM · REST APIs · BigQuery · MongoDB · Prisma · Zod · Firebase Auth ·
claims-based authorization, RBAC, multi-tenant
Integrations: Teltonika telematics data · Mapbox · SendGrid · Slack alerting · retry logic
AI / Automation: Gemini API · OpenAI API · Prompt Engineering · LLM-as-Judge Evaluation · Claude Code · Codex · Cursor · Python · n8n
· Make
Quality & Delivery: Jest · Cypress · Magnitude AI (Playwright-based) · GitLab CI/CD · GitHub Actions · Docker · Performance Optimization
Tooling: Vercel · GCP (Cloud Logging) · Figma · Jira · Confluence · Miro
WORK EXPERIENCE
Frontend Developer · Sono Solar GmbH · Remote (Munich, Germany) Jul 2024 – Aug 2026
•
Frontend performance: Initiated and led a performance overhaul of the React/Vite fleet dashboard: desktop LCP from 8.2 s to 1.7 s, mobile LCP from 17.2 s to 8.9 s, Lighthouse Performance from orange to green. Analysed the bundle with rollup-plugin-visualizer, split a 518 kB JavaScript file into separate chunks and lazy-loaded Recharts, cutting JavaScript by 65% on pages without charts; replaced Axios with native fetch, split the CSS per route and moved images to WebP. Raised Lighthouse Accessibility from 88 to 100.
•
Data loading: Cut the dashboard’s full load time (Network “Finish”) from 6.91 s to 1.17 s and its total transfer size from about 765 kB to under 300 kB by splitting one combined data request into three, adding server-side pagination and rendering tiles ahead of their data with Zustand selectors.
•
Component development: Built and maintained ~25 reusable React/TypeScript components (forms, modals, tables, charts, map
markers, loading and error states) against the team’s design system and Figma specs, reused across dashboard features and shared
with the Installation Tool. Migrated CSS to Sass, then from @import to @use/@forward and from one global index.scss to route-level CSS Modules, which let Vite split the CSS per route. Adopted a layer-based frontend architecture.
•
Multi-tenant authorization: Integrated a claims-based authorization model (OEM, fleet and user roles: viewer, admin, fleet admin)
into a B2B React platform, controlling access to two products (Solar Analytics Dashboard, Installation Tool) and scoping data
requests to each user’s fleet context.
•
Authentication: Built an email one-time-code login flow end to end: React states for request, entry, invalid and expired codes, plus
backend validation with single-use, time-limited codes, attempt limits and session creation.
•
External data integration: Consumed Teltonika telematics data from BigQuery, handling delayed and incomplete payloads and
distinguishing “no data” from “stale data”
. Added bounded retries (temporary vs. permanent errors) and Slack alerting for missing
telemetry and failed jobs. Integrated SendGrid for login codes.
•
Dashboards and live map: Built fleet-analytics dashboards with Recharts and a Mapbox vehicle map with periodic data refresh,
isolating map state to avoid unnecessary re-renders.
•
Backend, testing and CI/CD: Built and maintained Node.js, TypeORM and PostgreSQL functionality (data models, migrations, REST
API routes, validation, Jest tests); wrote 30+ end-to-end flows with Magnitude AI (Playwright-based); worked with GitLab CI/CD and
Docker for automated testing and quality checks.
•
Product ownership: Ran user interviews and usage analysis for an installation workflow, identified distinct user needs, and built the
frontend of a separate product now running on three OEM production lines. Used Claude Code, Codex and Cursor day to day, with
manual review before release.
Frontend Developer (Contract) · HarnoSoft LLC · Remote (Lviv, Ukraine) Sep 2023 – Jun 2024
•
Built responsive, mobile-first React interfaces for a B2C educational platform with Material UI and reusable components across
desktop, tablet and mobile.
•
Refactored parts of a legacy frontend codebase and translated Figma designs into consistent cross-browser interfaces (Chrome,
Firefox, Safari).
PROJECTS
QuizDOM · Live Demo · Code · React · TypeScript · Firebase · Genkit · Gemini API · Zustand · Vite
Built and deployed a full-stack AI quiz app with schema-validated AI generation, retry/back-off logic, LLM-as-judge evaluation and
content-moderation guardrails. Implemented Firebase Authentication and per-user data isolation via Firestore Security Rules, and used
GCP Cloud Logging for production monitoring.
Task Manager · Live Demo · Code · React · TypeScript · Nx · NestJS · MongoDB · Jest · Cypress · Vercel · GitHub Actions
Built a full-stack task management app with authenticated REST APIs and shared Zod validation schemas. Deployed on Vercel; set up
GitHub Actions and Docker for automated testing and deployment.
EDUCATION & LANGUAGES
•
•
•
•
•
WBS Coding School – AI Agents and Automation, 12-week AZAV-certified program · Berlin
ReDI School of Digital Integration – Advanced React, 3-month program · Munich
GoIT Academy – Full-Stack Software Developer, 12 months · Kyiv, Ukraine
Kyiv National Aviation University – Master’s Degree, Transport Engineer · Kyiv
Languages: English (C1) · German (B2, progressing toward C1)