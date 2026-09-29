# Custom domain

Buy a domain at Cloudflare and point it at the Vercel project.

## Registrar

Cloudflare Registrar sells at wholesale cost (no renewal markup) with free WHOIS
privacy. Not every TLD is supported: `.com`, `.dev`, `.io`, `.me` are fine; `.de`
is not available there.

Name: prefer the full name (or a short form) — easy to spell aloud.

## Setup

1. Cloudflare → Domain Registration → Register the domain.
2. Vercel project → Settings → Domains → add the apex (`yourname.com`) and `www`.
   Vercel shows the exact DNS records to use.
3. Cloudflare DNS → add those records (`A` for the apex, `CNAME` for `www`).
   **Set them to "DNS only" (grey cloud), not proxied.** Proxying in front of
   Vercel can break certificate issuance and interferes with Vercel's caching,
   which the ISR setup (`revalidate: 3600`) relies on.
4. Pick one of apex / `www` as primary in Vercel; the other redirects to it.

## Email

Cloudflare Email Routing (free): forward `hello@yourname.com` to Gmail. Add a
"send as" address in Gmail to reply from the domain.

## In the app

- Set the canonical site URL (`metadataBase`) to the new domain.
- Update OG image URLs, sitemap and robots.
- If Keystatic's GitHub auth has a callback URL, update it.
- Update links in the CV and GitHub profile.
