import { color, emailFont, radius } from '@/lib/design/tokens';

import type { ContactInput } from './contact';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * The notification as HTML, laid out in tables with inline styles because mail clients
 * ignore CSS variables and stylesheets. Everything the visitor typed is escaped.
 */
export function renderHtml(data: ContactInput, who: string): string {
  const name = escapeHtml(data.name || data.email);
  const address = escapeHtml(data.email);
  const initial = escapeHtml((Array.from(who)[0] ?? '?').toUpperCase());
  const message = escapeHtml(data.message).replace(/\r?\n/g, '<br>');
  const reply = `mailto:${address}?subject=${encodeURIComponent(`Re: message from ${who}`)}`;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:${color.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.paper};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${color.cream};border-radius:${radius.card};overflow:hidden;">
    <tr><td style="background:${color.emerald};padding:18px 28px;font-family:${emailFont.body};font-size:11px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:${color.cream};">
      New message &middot; katerynaskoryna.com
    </td></tr>
    <tr><td style="padding:28px 28px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td width="52" height="52" align="center" valign="middle" style="width:52px;height:52px;border-radius:26px;background:${color.coral};font-family:${emailFont.display};font-size:22px;font-weight:800;color:${color.charcoal};">${initial}</td>
        <td style="padding-left:16px;">
          <div style="font-family:${emailFont.display};font-size:20px;font-weight:800;color:${color.charcoal};">${name}</div>
          <div style="font-family:${emailFont.body};font-size:14px;padding-top:2px;"><a href="mailto:${address}" style="color:${color.emeraldDeep};">${address}</a></div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:20px 28px 8px;">
      <div style="border-left:4px solid ${color.mustard};background:${color.paper};padding:18px 20px;border-radius:0 ${radius.card} ${radius.card} 0;font-family:${emailFont.body};font-size:15px;line-height:1.65;color:${color.ink};">${message}</div>
    </td></tr>
    <tr><td style="padding:20px 28px 32px;">
      <a href="${reply}" style="display:inline-block;background:${color.emerald};color:${color.cream};font-family:${emailFont.body};font-size:14px;font-weight:700;text-decoration:none;padding:12px 26px;border-radius:${radius.pill};">Reply to ${name}</a>
    </td></tr>
    <tr><td style="padding:0 28px 24px;font-family:${emailFont.body};font-size:12px;color:${color.muted};">
      Sent through the contact form. Replying answers ${name} directly.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
