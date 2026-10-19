/** Writing helpers handed to every page: links, numbers from the engine, tables, sources. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import * as E from './engine/iht';
import { compare, type EstateInput, type HeirInput } from './engine/iht';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function helpers(strict = false) {
  const m = (n: number) => formatMoney(Math.round(n), 0);
  const m2 = (n: number) => formatMoney(n, 2);
  const pc = (x: number, d?: number) => { const v = Math.round(x * 10000) / 100; return formatPercent(x, d ?? (Number.isInteger(v) ? 0 : Number.isInteger(+(v * 10).toFixed(6)) ? 1 : 2)); };
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, 'en')}">${text}</a>`;
  };
  return {
    P,
    E,
    /** Link to another page of the site by id. */
    a,
    /** £2,363 (rounded to the pound). */
    m,
    /** £2,362.90 (pence kept). */
    m2,
    num: (n: number) => formatNumber(n, 0),
    /** 25 %, 4.99 % (decimals only when needed). */
    pc,
    /** Key dates written from the parameter file: 6 April 2027, 5 April 2031, 18 March 2026. */
    D: { from: displayDate(P.pensions.inEstateFrom, 'en-GB'), freeze: displayDate(P.iht.frozenUntilDate, 'en-GB'), assent: displayDate(P.pensions.royalAssent, 'en-GB') },
    /** “1 April 2026” from an ISO date. */
    date: (iso: string) => displayDate(iso, 'en-GB'),
    table,
    /** Both regimes for an estate (engine `compare`). */
    run: (inp: EstateInput, heir: HeirInput) => compare(inp, heir),
    /** Ledger table of an estate, before and from 6 April 2027, computed by the engine. */
    ledger: (inp: EstateInput, heir: HeirInput, caption?: string) => {
      const r = compare(inp, heir); const a = r.after, b = r.before, ha = r.heirsAfter, hb = r.heirsBefore;
      const rows: Array<Array<string>> = [
        ['Estate counted for inheritance tax', m(b.estateForTaper), m(a.estateForTaper)],
        ['Nil-rate band and residence band used', m(b.threshold), m(a.threshold)],
        ['Inheritance tax', m(b.iht), m(a.iht)],
        ['of which on the pension', m(b.ihtOnPension), m(a.ihtOnPension)],
        ['Income tax paid by the heirs on the pension', m(hb.totalIncomeTax), m(ha.totalIncomeTax)],
        [`Each of ${ha.heirs} heir${ha.heirs > 1 ? 's' : ''} keeps`, m(hb.total), m(ha.total)],
      ];
      return table(['', 'Death before 6 April 2027', 'Death from 6 April 2027'], rows, caption, ['l', 'r', 'r']);
    },
    /** Link to an official source of the parameter file. */
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    /** Boxed note in the style of a press sidebar. */
    box: (title: string, html: string, kind: 'info' | 'tip' | 'warning' | 'example' = 'info') => `<div class="callout callout-${kind}"><span class="callout-title">${title}</span>${html}</div>`,
  };
}
export type Helpers = ReturnType<typeof helpers>;
