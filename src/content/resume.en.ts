import { featuredRepos } from '@/content/items';

import type { ResumeContent } from './resume';

const solarCalculator = featuredRepos.find((r) => r.repo === 'solar-calculator');

/** The CV, verbatim from `docs/CV.md`. */
export const resumeEn: ResumeContent = {
  city: 'Berlin, Germany',
  headline: 'Frontend-Focused Full-Stack Developer',
  headlineStack: 'React · TypeScript · Node.js · AI-Powered Products',
  summary:
    'Frontend-focused Full-Stack Developer with three years of experience building production React and TypeScript applications for B2B and B2C products. Owns features from the React UI through REST APIs and the PostgreSQL data layer, including external data integration, authentication and claims-based authorization. Measurable frontend and API performance gains, and AI features with validated LLM output.',
  skills: [
    {
      group: 'Frontend',
      items: [
        'React',
        'TypeScript',
        'JavaScript',
        'Next.js',
        'React Hooks',
        'Material UI',
        'Zustand',
        'Axios',
        'Vite',
        'Chart.js',
        'Sass',
        'Tailwind CSS',
        'HTML',
      ],
    },
    {
      group: 'Backend & Data',
      items: [
        'Node.js',
        'NestJS',
        'PostgreSQL',
        'TypeORM',
        'REST APIs',
        'BigQuery',
        'MongoDB',
        'Prisma',
        'Zod',
        'Firebase Auth',
        'claims-based authorization, RBAC, multi-tenant',
      ],
    },
    {
      group: 'Integrations',
      items: ['Teltonika telematics data', 'Mapbox', 'SendGrid', 'Slack alerting', 'retry logic'],
    },
    {
      group: 'AI / Automation',
      items: [
        'Gemini API',
        'OpenAI API',
        'Prompt Engineering',
        'LLM-as-Judge Evaluation',
        'Claude Code',
        'Codex',
        'Cursor',
        'Python',
        'n8n',
        'Make',
      ],
    },
    {
      group: 'Quality & Delivery',
      items: [
        'Jest',
        'Cypress',
        'Magnitude AI (Playwright-based)',
        'GitLab CI/CD',
        'GitHub Actions',
        'Docker',
        'Performance Optimization',
      ],
    },
    {
      group: 'Tooling',
      items: ['Vercel', 'GCP (Cloud Logging)', 'Figma', 'Jira', 'Confluence', 'Miro'],
    },
  ],
  roles: [
    {
      title: 'Frontend Developer',
      company: 'Sono Solar GmbH',
      location: 'Remote (Munich, Germany)',
      dates: 'Jul 2024 – Aug 2026',
      bullets: [
        {
          label: 'Frontend performance',
          text: 'Reduced the initial JavaScript bundle by 65% through code splitting, improving mobile LCP from 17.2 s to 8.9 s and Lighthouse Accessibility from 88 to 100.',
        },
        {
          label: 'API performance',
          text: 'Reduced a production fleet-analytics endpoint from 6.91 s to 1.17 s by profiling the full request path and identifying Node-side time-series processing as the main bottleneck.',
        },
        {
          label: 'Component development',
          text: 'Built and maintained ~25 reusable React/TypeScript components (forms, modals, tables, charts, map markers, loading and error states) against the team’s design system and Figma specs, reused across dashboard features and shared with the Installation Tool. Migrated CSS to Sass and adopted a layer-based frontend architecture.',
        },
        {
          label: 'Multi-tenant authorization',
          text: 'Integrated a claims-based authorization model (OEM, fleet and user roles: viewer, admin, fleet admin) into a B2B React platform, controlling access to two products (Solar Analytics Dashboard, Installation Tool) and scoping data requests to each user’s fleet context.',
        },
        {
          label: 'Authentication',
          text: 'Built an email one-time-code login flow end to end: React states for request, entry, invalid and expired codes, plus backend validation with single-use, time-limited codes, attempt limits and session creation.',
        },
        {
          label: 'External data integration',
          text: 'Consumed Teltonika telematics data from BigQuery, handling delayed and incomplete payloads and distinguishing “no data” from “stale data”. Added bounded retries (temporary vs. permanent errors) and Slack alerting for missing telemetry and failed jobs. Integrated SendGrid for login codes.',
        },
        {
          label: 'Dashboards and live map',
          text: 'Built fleet-analytics dashboards with Chart.js and a Mapbox vehicle map with periodic data refresh, isolating map state to avoid unnecessary re-renders.',
        },
        {
          label: 'Backend, testing and CI/CD',
          text: 'Built and maintained Node.js, TypeORM and PostgreSQL functionality (data models, migrations, REST API routes, validation, Jest tests); wrote 30+ end-to-end flows with Magnitude AI (Playwright-based); worked with GitLab CI/CD and Docker for automated testing and quality checks.',
        },
        {
          label: 'Product ownership',
          text: 'Ran user interviews and usage analysis for an installation workflow, identified distinct user needs, and built the frontend of a separate product now running on three OEM production lines. Used Claude Code, Codex and Cursor day to day, with manual review before release.',
        },
      ],
    },
    {
      title: 'Frontend Developer (Contract)',
      company: 'HarnoSoft LLC',
      location: 'Remote (Lviv, Ukraine)',
      dates: 'Sep 2023 – Jun 2024',
      bullets: [
        {
          text: 'Built responsive, mobile-first React interfaces for a B2C educational platform with Material UI and reusable components across desktop, tablet and mobile.',
        },
        {
          text: 'Refactored parts of a legacy frontend codebase and translated Figma designs into consistent cross-browser interfaces (Chrome, Firefox, Safari).',
        },
      ],
    },
  ],
  projects: [
    ...[
      {
        name: 'QuizDOM',
        repo: 'quizdom-react-app',
        stack: ['React', 'TypeScript', 'Firebase', 'Genkit', 'Gemini API', 'Zustand', 'Vite'],
        text: 'Built and deployed a full-stack AI quiz app with schema-validated AI generation, retry/back-off logic, LLM-as-judge evaluation and content-moderation guardrails. Implemented Firebase Authentication and per-user data isolation via Firestore Security Rules, and used GCP Cloud Logging for production monitoring.',
      },
      {
        name: 'Task Manager',
        repo: 'task-manager',
        stack: [
          'React',
          'TypeScript',
          'Nx',
          'NestJS',
          'MongoDB',
          'Jest',
          'Cypress',
          'Vercel',
          'GitHub Actions',
        ],
        text: 'Built a full-stack task management app with authenticated REST APIs and shared Zod validation schemas. Deployed on Vercel; set up GitHub Actions and Docker for automated testing and deployment.',
      },
    ],
    // Not on the printed CV (`docs/CV.md`); its description and stack are the
    // ones already written for `/projects`, not new copy.
    {
      name: 'Solar Calculator',
      repo: 'solar-calculator',
      stack: solarCalculator?.stack ?? [],
      text: solarCalculator?.summary ?? '',
      bookOnly: true,
    },
  ],
  education: [
    {
      school: 'WBS Coding School',
      program: 'AI Agents and Automation, 12-week AZAV-certified program',
      place: 'Berlin',
    },
    {
      school: 'ReDI School of Digital Integration',
      program: 'Advanced React, 3-month program',
      place: 'Munich',
    },
    {
      school: 'GoIT Academy',
      program: 'Full-Stack Software Developer, 12 months',
      place: 'Kyiv, Ukraine',
    },
    {
      school: 'Kyiv National Aviation University',
      program: 'Master’s Degree, Transport Engineer',
      place: 'Kyiv',
    },
  ],
  languages: 'English (C1) · German (B2, progressing toward C1)',
};
