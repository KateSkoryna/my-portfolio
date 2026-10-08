import type { ResumeContent } from './resume';

/** The CV, verbatim from `docs/CV.md`. */
export const resumeEn: ResumeContent = {
  city: 'Berlin, Germany',
  headline: 'Frontend-Focused Full-Stack Developer',
  headlineStack: 'React · TypeScript · Node.js · AI-Powered Products',
  summary:
    'Frontend-Focused Full-Stack Developer who makes B2B products fast, secure and easy to use. Made the Solar Analytics Dashboard, used by 10+ fleets, 5 times faster (JavaScript down 65%, accessibility score 100), built the multi-tenant access control that keeps each fleet’s data separate, and delivered the frontend of the Installation Tool, now running on three OEM production lines. Three years of React and TypeScript, Node.js and PostgreSQL on the backend, and AI features with validated LLM output. Takes a feature from user interview to production.',
  skills: [
    {
      group: 'Frontend',
      items: [
        'React',
        'TypeScript',
        'JavaScript',
        'Next.js',
        'Material UI',
        'Zustand',
        'Vite',
        'Recharts',
        'Sass',
        'Tailwind CSS',
        'Mapbox',
        'Responsive Design',
        'Accessibility',
        'Core Web Vitals',
        'State Management',
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
        'MongoDB',
        'Prisma',
        'Zod',
        'Firebase Auth',
        'claims-based authorization, RBAC, multi-tenant',
      ],
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
      items: ['Vercel', 'GCP (Cloud Logging)', 'Figma', 'Jira'],
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
          text: 'Led a performance overhaul of the React/Vite Solar Analytics Dashboard (10+ fleets) in a team of 5: desktop LCP from 8.2 s to 1.7 s (Core Web Vitals) and 65% less JavaScript on pages without charts (518 kB to 180 kB), through bundle analysis, code splitting and lazy-loaded Recharts. Raised accessibility (Lighthouse) from 88 to 100.',
        },
        {
          label: 'Data loading',
          text: 'Cut the dashboard’s full load time from 6.91 s to 1.17 s and its transfer size from about 765 kB to under 300 kB by splitting one combined request into three, adding server-side pagination and rendering tiles ahead of their data with Zustand state management.',
        },
        {
          label: 'Component library and live map',
          text: 'Built ~25 reusable, responsive React/TypeScript components from the team’s design system and Figma specs, shared across the fleet dashboard and the Installation Tool, plus Recharts analytics and a live Mapbox vehicle map.',
        },
        {
          label: 'Backend, authorization and security',
          text: 'Built the access layer of a multi-tenant B2B platform: claims-based roles (OEM, fleet, user) scoping every data request to the user’s fleet across two products, and an email one-time-code login with single-use, time-limited codes, attempt limits and sessions. Node.js, TypeORM and PostgreSQL with migrations, validation and Jest tests, plus 30+ end-to-end flows with Magnitude AI in GitLab CI/CD.',
        },
        {
          label: 'Product ownership',
          text: 'Ran user interviews and usage analysis for an installation workflow and built the frontend of the Installation Tool, now running on three OEM production lines.',
        },
        {
          label: 'AI in development',
          text: 'Used Claude Code, Codex and Cursor day to day, working with skills, git worktrees and agent loops, and reviewing all generated code manually before release.',
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
    {
      name: 'QuizDOM',
      repo: 'quizdom-react-app',
      stack: ['React', 'TypeScript', 'Firebase', 'Genkit', 'Gemini API', 'Zustand', 'Vite'],
      text: 'Built and deployed a full-stack AI quiz platform with schema-validated Gemini generation, semantic quiz search (embeddings and Firestore vector search) and an admin lab where a second Gemini model scores generated quizzes. Implemented Firebase Authentication and per-user data isolation via Firestore Security Rules, with TanStack Query and Zustand on the client.',
    },
    {
      name: 'TaskPal',
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
      text: 'Built a full-stack task management app with an AI-powered chatbot, authenticated REST APIs and shared Zod validation schemas. Deployed on Vercel; set up GitHub Actions and Docker for automated testing and deployment.',
    },
    {
      name: 'Solar Calculator',
      repo: 'solar-calculator',
      stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'Jest'],
      text: 'Built a multi-tenant web app that helps commercial fleet operators evaluate solar panel investments for buses, trucks, vans and trailers. Implemented fleet-scoped authorization, audit logging, rate limiting and passwordless sign-in (Google or email link), covered by Jest tests; UI in English, German and Spanish.',
    },
  ],
  education: [
    {
      school: 'WBS Coding School',
      program: 'AI Agents and Automation, 12-week AZAV-certified program',
      place: 'Berlin · Jun – Sep 2026',
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
