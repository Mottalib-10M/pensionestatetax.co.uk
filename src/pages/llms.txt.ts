/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
export const GET: APIRoute = () => {
  const lines = [
    '# Pension Estate Tax',
    '',
    `> Inheritance tax on UK estates once unused pension funds and pension death benefits count in the estate, for deaths on or after 6 April 2027 (Finance Act 2026, sections 66 to 71, Royal Assent 18 March 2026). The calculators compare a death before and after that date, apply the nil-rate band of £325,000 and the residence nil-rate band of £175,000 (frozen to 5 April 2031), the taper above £2 million, transfers between spouses, the 36 % charity rate, gifts and taper relief, then the income tax heirs pay on a pension inherited from someone who died at 75 or over, after deducting the inheritance tax borne (ITEPA 2003 s.567B). Rules read on legislation.gov.uk and GOV.UK on ${LAST_UPDATED}. Published by Radif Partners, an independent publisher; not HMRC, not a pension provider, no personal advice.`,
    '',
    '## Calculators and guides',
    `- [Pension inheritance tax calculator](${SITE_URL}${route('home', 'en')}): an estate with its pension, before and from 6 April 2027, and what each heir keeps.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the tax is worked out](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
