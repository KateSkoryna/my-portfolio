# Contact form

`/contact` is a form that emails me. It is the second way to reach me that the legal
notice (`/impressum`) names, next to the plain email address. Nothing is stored on this
site: a server action (`src/app/[locale]/contact/actions.ts`) validates the message and
sends it through [Resend](https://resend.com)'s REST API with plain `fetch`. There is no
SDK and no new dependency.

## Setup (once)

1. Create a Resend account (free tier). Its data processing agreement is signed when
   you sign up; Resend is certified under the EU-U.S. Data Privacy Framework.
2. Resend → **Domains** → add `katerynaskoryna.com`. Resend shows DNS records (SPF,
   DKIM); add them in Cloudflare as **DNS only** (grey cloud), like the Vercel records.
   Wait until the domain shows "Verified".
3. Resend → **API Keys** → create a key with "Sending access".
4. Vercel project → Settings → **Environment Variables** (Production and Preview):

| Variable             | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| `RESEND_API_KEY`     | the key from step 3                                                |
| `CONTACT_TO_EMAIL`   | the mailbox that should receive messages (Gmail)                   |
| `CONTACT_FROM_EMAIL` | an address on the verified domain, e.g. `Website <form@katerynaskoryna.com>` |

5. Redeploy. For local testing, put the same three lines in `.env.local` (git ignores it).

Until the three variables exist the form shows "not available right now" and the plain
email address, so it is safe to deploy before setting them up.

## How it behaves

- **Replying**: the visitor's address is the `reply_to` of the email, so "Reply" answers them.
- **Spam**: a hidden field (`website`) that people never see; if it is filled the message
  is dropped and the form still says "sent". There is no CAPTCHA, because that would load a
  third party in the visitor's browser. If spam gets through, add a rate limit.
- **Privacy**: the privacy notice names Resend as the processor and says the message is
  not stored on the site. If you change provider, update `privacy.sections` in `messages/`.
- **Limits** (`LIMITS` in `src/lib/contact.ts`): message 10 to 4000 characters, name up to 100.
