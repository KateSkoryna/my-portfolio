import { featuredRepos, profile, type FeaturedRepo } from '@/content/items';

const API = 'https://api.github.com';
const OWNER = new URL(profile.github).pathname.split('/').filter(Boolean)[0];

/** Matches `revalidate` on `/projects`; the fetch cache and the page cache expire together. */
const REVALIDATE_SECONDS = 3600;

export interface RepoLanguage {
  name: string;
  /** Whole-number share of the repo's bytes, 1–100. */
  percent: number;
}

export interface RepoStats {
  /** ISO 8601 timestamp of the last push. */
  pushedAt: string;
  languages: readonly RepoLanguage[];
  /** GitHub's own description; shown only when `summary` is still a placeholder. */
  description: string | null;
}

export interface ProjectIssue extends FeaturedRepo {
  url: string;
  /** `null` when the API failed — the issue renders from static data alone. */
  stats: RepoStats | null;
}

interface RepoResponse {
  pushed_at: string;
  description: string | null;
}

/**
 * `GITHUB_TOKEN` is read here and nowhere else. It has no `NEXT_PUBLIC_`
 * prefix, so Next never inlines it into a client bundle; this module is only
 * imported by Server Components. Without a token the calls still work
 * unauthenticated, at GitHub's much lower rate limit.
 */
async function get<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`${API}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
  return (await res.json()) as T;
}

/** Top four by bytes, as percentages. Rounded shares of the *shown* set, so the bar fills exactly. */
function toLanguages(bytes: Record<string, number>): RepoLanguage[] {
  const top = Object.entries(bytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);
  const total = top.reduce((sum, [, n]) => sum + n, 0);
  if (total === 0) return [];
  return top
    .map(([name, n]) => ({ name, percent: Math.round((n / total) * 100) }))
    .filter((l) => l.percent > 0);
}

async function fetchStats(repo: string): Promise<RepoStats | null> {
  try {
    // `pushed_at` is the last-commit date: any push to any branch moves it, and
    // it saves a third request per repo.
    const [info, languages] = await Promise.all([
      get<RepoResponse>(`/repos/${OWNER}/${repo}`),
      get<Record<string, number>>(`/repos/${OWNER}/${repo}/languages`),
    ]);
    return {
      pushedAt: info.pushed_at,
      description: info.description,
      languages: toLanguages(languages),
    };
  } catch {
    // Degrade silently (PLAN.md 4a): a failed repo renders without its stats,
    // no error state. The page never throws because GitHub did.
    return null;
  }
}

/**
 * The GitHub REST API has no multi-repo endpoint, so "one batch" here means
 * every request for every repo goes out together in a single `Promise.all`
 * per revalidation, not one after another.
 */
export async function getProjectIssues(): Promise<{
  issues: ProjectIssue[];
  /** ISO timestamp of this fetch — the page shows how stale the data can be. */
  fetchedAt: string;
}> {
  const stats = await Promise.all(featuredRepos.map((r) => fetchStats(r.repo)));
  return {
    fetchedAt: new Date().toISOString(),
    issues: featuredRepos.map((repo, i) => ({
      ...repo,
      url: `${profile.github}/${repo.repo}`,
      stats: stats[i],
    })),
  };
}
