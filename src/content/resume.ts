/**
 * The CV. Structure and types live here; the text is one `ResumeContent` per
 * locale — `resume.en.ts` (verbatim from `docs/CV.md`) and `resume.de.ts` (a
 * German translation of it). Interface strings (arrow labels, "Download CV")
 * live in `messages/<locale>.json` under `resume`.
 *
 * The downloadable PDF is the English CV only. When the CV changes, edit the
 * locale files and regenerate `public/kateryna-skoryna-cv.pdf` from the print
 * stylesheet (Cmd+P → Save as PDF, A4, margins default, background graphics
 * off) on `/en/resume`.
 */

import { featuredRepos, profile } from '@/content/items';
import { resumeDe } from './resume.de';
import { resumeEn } from './resume.en';

/** Served from `public/`; the download on `/` and `/resume` both point here. */
export const resumePdfPath = '/kateryna-skoryna-cv.pdf';

export const resumeContact = {
  email: profile.email,
  linkedin: profile.linkedin,
  github: profile.github,
} as const;

export interface ResumeRole {
  title: string;
  company: string;
  location: string;
  dates: string;
  /** `label` is the bold lead-in ("Frontend performance"); `text` follows it. */
  bullets: readonly { label?: string; text: string }[];
}

export interface ResumeProject {
  name: string;
  /** Repo under `featuredRepos` — the source of the Live Demo link. */
  repo: string;
  stack: readonly string[];
  text: string;
}

/** Every piece of CV text that changes with the locale. */
export interface ResumeContent {
  city: string;
  /** First row under the name — the role. */
  headline: string;
  /** Second row — the stack and focus, always on its own line. */
  headlineStack: string;
  summary: string;
  skills: readonly { group: string; items: readonly string[] }[];
  roles: readonly ResumeRole[];
  projects: readonly ResumeProject[];
  education: readonly { school: string; program: string; place: string }[];
  languages: string;
}

/** English fallback for any locale without its own CV text. */
export function getResumeContent(locale: string): ResumeContent {
  return locale === 'de' ? resumeDe : resumeEn;
}

/** Links for a `ResumeProject`: the deployment (from `featuredRepos`) and the repo. */
export function resumeProjectLinks(project: ResumeProject): { demo?: string; code: string } {
  const featured = featuredRepos.find((r) => r.repo === project.repo);
  return { demo: featured?.demoUrl, code: `${profile.github}/${project.repo}` };
}
