import type { ResumeContent } from './resume';

/**
 * German translation of `resume.en.ts` (itself verbatim from `docs/CV.md`).
 * Technology, product and company names, and job titles, are left as written
 * on the English CV — they are what a recruiter searches for.
 */
export const resumeDe: ResumeContent = {
  city: 'Berlin, Deutschland',
  headline: 'Frontend-orientierter Full-Stack-Entwickler',
  headlineStack: 'React · TypeScript · Node.js · KI-gestützte Produkte',
  summary:
    'Frontend-orientierter Full-Stack-Entwickler, der B2B-Produkte schnell, sicher und einfach bedienbar macht. Das Solar Analytics Dashboard, das 10+ Flotten nutzen, 5-mal schneller gemacht (JavaScript um 65 % reduziert, Barrierefreiheits-Wert 100), die mandantenfähige Zugriffskontrolle gebaut, die die Daten jeder Flotte trennt, und das Frontend des Installation Tools geliefert, das heute an drei OEM-Produktionslinien läuft. Drei Jahre React und TypeScript, Node.js und PostgreSQL im Backend sowie KI-Features mit validierter LLM-Ausgabe. Bringt ein Feature vom Nutzerinterview bis in die Produktion.',
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
        'Barrierefreiheit',
        'Core Web Vitals',
        'State Management',
      ],
    },
    {
      group: 'Backend & Daten',
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
        'Claims-basierte Autorisierung, RBAC, Multi-Tenant',
      ],
    },
    {
      group: 'KI / Automatisierung',
      items: [
        'Gemini API',
        'OpenAI API',
        'Prompt Engineering',
        'LLM-as-Judge-Evaluation',
        'Claude Code',
        'Codex',
        'Cursor',
        'Python',
        'n8n',
      ],
    },
    {
      group: 'Qualität & Delivery',
      items: [
        'Jest',
        'Cypress',
        'Magnitude AI (Playwright-basiert)',
        'GitLab CI/CD',
        'GitHub Actions',
        'Docker',
        'Performance-Optimierung',
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
      location: 'Remote (München, Deutschland)',
      dates: 'Jul. 2024 – Aug. 2026',
      bullets: [
        {
          label: 'Frontend-Performance',
          text: 'Eine Performance-Überarbeitung des React/Vite-Solar-Analytics-Dashboards (10+ Flotten) in einem Team von 5 geleitet: Desktop-LCP von 8,2 s auf 1,7 s (Core Web Vitals) und 65 % weniger JavaScript auf Seiten ohne Diagramme (518 kB auf 180 kB) durch Bundle-Analyse, Code-Splitting und lazy geladenes Recharts. Barrierefreiheit (Lighthouse) von 88 auf 100 verbessert.',
        },
        {
          label: 'Datenladen',
          text: 'Die gesamte Ladezeit des Dashboards von 6,91 s auf 1,17 s und die übertragene Datenmenge von etwa 765 kB auf unter 300 kB gesenkt: eine kombinierte Anfrage in drei aufgeteilt, serverseitige Paginierung eingeführt und Kacheln mit der State-Management-Bibliothek Zustand vor ihren Daten gerendert.',
        },
        {
          label: 'Komponentenbibliothek und Live-Karte',
          text: 'Rund 25 wiederverwendbare, responsive React/TypeScript-Komponenten nach Design-System und Figma-Vorgaben des Teams gebaut, geteilt zwischen dem Flotten-Dashboard und dem Installation Tool, dazu Recharts-Analysen und eine Mapbox-Live-Fahrzeugkarte.',
        },
        {
          label: 'Backend, Autorisierung und Sicherheit',
          text: 'Die Zugriffsschicht einer mandantenfähigen B2B-Plattform gebaut: Claims-basierte Rollen (OEM, Flotte, Benutzer), die jede Datenabfrage über zwei Produkte hinweg auf die Flotte des Benutzers begrenzen, und einen Login mit E-Mail-Einmalcode mit einmaligen, zeitlich begrenzten Codes, Versuchslimits und Sessions. Node.js, TypeORM und PostgreSQL mit Migrationen, Validierung und Jest-Tests sowie über 30 End-to-End-Abläufe mit Magnitude AI in GitLab CI/CD.',
        },
        {
          label: 'Produktverantwortung',
          text: 'Nutzerinterviews und Nutzungsanalysen für einen Installations-Workflow durchgeführt und das Frontend des Installation Tools gebaut, das heute an drei OEM-Produktionslinien läuft.',
        },
        {
          label: 'KI in der Entwicklung',
          text: 'Claude Code, Codex und Cursor täglich genutzt, mit Skills, Git-Worktrees und Agent-Loops gearbeitet und allen generierten Code vor dem Release manuell geprüft.',
        },
      ],
    },
    {
      title: 'Frontend Developer (Auftragsbasis)',
      company: 'HarnoSoft LLC',
      location: 'Remote (Lwiw, Ukraine)',
      dates: 'Sep. 2023 – Jun. 2024',
      bullets: [
        {
          text: 'Responsive, Mobile-First-React-Oberflächen für eine B2C-Bildungsplattform mit Material UI und wiederverwendbaren Komponenten für Desktop, Tablet und Mobilgeräte gebaut.',
        },
        {
          text: 'Teile einer Legacy-Frontend-Codebasis refaktoriert und Figma-Designs in konsistente Browser-übergreifende Oberflächen (Chrome, Firefox, Safari) überführt.',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'QuizDOM',
      repo: 'quizdom-react-app',
      stack: ['React', 'TypeScript', 'Firebase', 'Genkit', 'Gemini API', 'Zustand', 'Vite'],
      text: 'Eine Full-Stack-KI-Quiz-Plattform gebaut und deployt, mit schemavalidierter Gemini-Generierung, semantischer Quiz-Suche (Embeddings und Firestore-Vektorsuche) und einem Admin-Labor, in dem ein zweites Gemini-Modell generierte Quizze bewertet. Firebase Authentication und nutzerbezogene Datentrennung über Firestore Security Rules umgesetzt, mit TanStack Query und Zustand im Client.',
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
      text: 'Eine Full-Stack-Aufgabenverwaltung mit KI-Chatbot, authentifizierten REST-APIs und gemeinsamen Zod-Validierungsschemata gebaut. Auf Vercel deployt; GitHub Actions und Docker für automatisiertes Testen und Deployment eingerichtet.',
    },
    {
      name: 'Solar Calculator',
      repo: 'solar-calculator',
      stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'Jest'],
      text: 'Eine mandantenfähige Web-App gebaut, die Flottenbetreibern hilft, Solar-Investitionen für Busse, Lkw, Transporter und Anhänger zu bewerten. Flottenbezogene Autorisierung, Audit-Logging, Rate Limiting und passwortlose Anmeldung (Google oder E-Mail-Link) umgesetzt, abgesichert durch Jest-Tests; Oberfläche auf Deutsch, Englisch und Spanisch.',
    },
  ],
  education: [
    {
      school: 'WBS Coding School',
      program: 'KI-Agenten und Automatisierung, 12-wöchiges AZAV-zertifiziertes Programm',
      place: 'Berlin · Jun. – Sep. 2026',
    },
    {
      school: 'ReDI School of Digital Integration',
      program: 'Advanced React, 3-monatiges Programm',
      place: 'München',
    },
    {
      school: 'GoIT Academy',
      program: 'Full-Stack-Softwareentwicklung, 12 Monate',
      place: 'Kiew, Ukraine',
    },
    {
      school: 'Nationale Luftfahrtuniversität Kiew',
      program: 'Master-Abschluss, Verkehrsingenieurwesen',
      place: 'Kiew',
    },
  ],
  languages: 'Englisch (C1) · Deutsch (B2, auf dem Weg zu C1)',
};
