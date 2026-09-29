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
    'Frontend-orientierter Full-Stack-Entwickler mit drei Jahren Erfahrung in der Entwicklung produktiver React- und TypeScript-Anwendungen für B2B- und B2C-Produkte. Verantwortet Features von der React-Oberfläche über REST-APIs bis zur PostgreSQL-Datenschicht, einschließlich Anbindung externer Daten, Authentifizierung und Claims-basierter Autorisierung. Messbare Performance-Verbesserungen in Frontend und API sowie KI-Features mit validierter LLM-Ausgabe.',
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
      group: 'Backend & Daten',
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
        'Claims-basierte Autorisierung, RBAC, Multi-Tenant',
      ],
    },
    {
      group: 'Integrationen',
      items: ['Teltonika-Telematikdaten', 'Mapbox', 'SendGrid', 'Slack-Alerting', 'Retry-Logik'],
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
        'Make',
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
      items: ['Vercel', 'GCP (Cloud Logging)', 'Figma', 'Jira', 'Confluence', 'Miro'],
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
          text: 'Das initiale JavaScript-Bundle durch Code Splitting um 65 % verkleinert und dadurch den mobilen LCP von 17,2 s auf 8,9 s sowie den Lighthouse-Accessibility-Wert von 88 auf 100 verbessert.',
        },
        {
          label: 'API-Performance',
          text: 'Die Antwortzeit eines produktiven Fleet-Analytics-Endpunkts von 6,91 s auf 1,17 s gesenkt, indem der gesamte Request-Pfad profiliert und die Zeitreihenverarbeitung auf Node-Seite als Hauptengpass identifiziert wurde.',
        },
        {
          label: 'Komponentenentwicklung',
          text: 'Rund 25 wiederverwendbare React/TypeScript-Komponenten (Formulare, Modals, Tabellen, Diagramme, Kartenmarker, Lade- und Fehlerzustände) nach dem Design-System und den Figma-Vorgaben des Teams gebaut und gepflegt, in mehreren Dashboard-Features wiederverwendet und mit dem Installation Tool geteilt. CSS auf Sass migriert und eine schichtbasierte Frontend-Architektur eingeführt.',
        },
        {
          label: 'Mandantenfähige Autorisierung',
          text: 'Ein Claims-basiertes Autorisierungsmodell (OEM-, Flotten- und Benutzerrollen: Viewer, Admin, Fleet Admin) in eine B2B-React-Plattform integriert, das den Zugriff auf zwei Produkte (Solar Analytics Dashboard, Installation Tool) steuert und Datenabfragen auf den Flottenkontext des jeweiligen Benutzers begrenzt.',
        },
        {
          label: 'Authentifizierung',
          text: 'Einen Login-Flow mit E-Mail-Einmalcode von Anfang bis Ende gebaut: React-Zustände für Anforderung, Eingabe, ungültige und abgelaufene Codes sowie Backend-Validierung mit einmaligen, zeitlich begrenzten Codes, Versuchslimits und Session-Erstellung.',
        },
        {
          label: 'Anbindung externer Daten',
          text: 'Teltonika-Telematikdaten aus BigQuery verarbeitet, verspätete und unvollständige Payloads behandelt und „keine Daten“ von „veralteten Daten“ unterschieden. Begrenzte Wiederholungsversuche (temporäre vs. dauerhafte Fehler) sowie Slack-Alerting für fehlende Telemetrie und fehlgeschlagene Jobs ergänzt. SendGrid für Login-Codes integriert.',
        },
        {
          label: 'Dashboards und Live-Karte',
          text: 'Fleet-Analytics-Dashboards mit Chart.js und eine Mapbox-Fahrzeugkarte mit periodischer Datenaktualisierung gebaut; den Kartenzustand isoliert, um unnötige Re-Renders zu vermeiden.',
        },
        {
          label: 'Backend, Testing und CI/CD',
          text: 'Node.js-, TypeORM- und PostgreSQL-Funktionalität (Datenmodelle, Migrationen, REST-API-Routen, Validierung, Jest-Tests) gebaut und gepflegt; über 30 End-to-End-Abläufe mit Magnitude AI (Playwright-basiert) geschrieben; mit GitLab CI/CD und Docker für automatisierte Tests und Qualitätsprüfungen gearbeitet.',
        },
        {
          label: 'Produktverantwortung',
          text: 'Nutzerinterviews und Nutzungsanalysen für einen Installations-Workflow durchgeführt, unterschiedliche Nutzerbedürfnisse identifiziert und das Frontend eines eigenständigen Produkts gebaut, das heute an drei OEM-Produktionslinien läuft. Claude Code, Codex und Cursor täglich genutzt, mit manueller Prüfung vor dem Release.',
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
      text: 'Eine Full-Stack-KI-Quiz-App gebaut und deployt, mit schemavalidierter KI-Generierung, Retry-/Back-off-Logik, LLM-as-Judge-Evaluation und Guardrails zur Inhaltsmoderation. Firebase Authentication und nutzerbezogene Datentrennung über Firestore Security Rules umgesetzt und GCP Cloud Logging für das Produktionsmonitoring genutzt.',
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
      text: 'Eine Full-Stack-Aufgabenverwaltung mit authentifizierten REST-APIs und gemeinsamen Zod-Validierungsschemata gebaut. Auf Vercel deployt; GitHub Actions und Docker für automatisiertes Testen und Deployment eingerichtet.',
    },
    {
      name: 'Solar Calculator',
      repo: 'solar-calculator',
      stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'Tailwind CSS'],
      text: 'Eine mandantenfähige Web-App, die Flottenbetreibern hilft, Investitionen in Solarpanels für Busse, Lkw, Transporter und Anhänger zu bewerten. Gebaut mit Next.js 16, React 19, TypeScript, PostgreSQL und Prisma; sie bietet flottenbezogenen rollenbasierten Zugriff, ein Fahrzeug- und Berechnungsdatenmodell sowie i18n für EN/DE/ES.',
      bookOnly: true,
    },
  ],
  education: [
    {
      school: 'WBS Coding School',
      program: 'KI-Agenten und Automatisierung, 12-wöchiges AZAV-zertifiziertes Programm',
      place: 'Berlin',
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
