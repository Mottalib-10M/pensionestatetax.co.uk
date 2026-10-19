/**
 * One page = ONE data file in `src/content/pages/<id>.ts`: URL, snippets, H1, standfirst, citable block,
 * FAQ, body, sources, tool. How to add one: CONTRIBUTING-PAGES.md at the repository root.
 */
import type { SourceKey } from './engine/params';
import type { Helpers } from './helpers';

export type Group = 'pensions' | 'heirs' | 'thresholds' | 'gifts' | 'cases' | 'income';
export interface FAQ { q: string; a: string }
/**
 * Tools: `iht` (the full estate calculator) or `mini:<spec>` (a spec of `lib/mini-specs.ts`).
 * `props` sets the defaults of that page (for example `{ pension: 500000, age: 80 }`).
 */
export interface ToolDef { kind: string; props?: Record<string, string | number | boolean> }

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** Main tool, first screen: the page is a tool page (`data-outil`, 500–700 words are enough). */
  tool?: ToolDef;
  /** Secondary tool placed right after the citable block of a reading page (guide, ≥ 1,200 words). */
  mini?: ToolDef;
  related: string[];
  sources: SourceKey[];
  slug: string;
  nav: string;
  card: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Citable block, 120 words or more, one paragraph (RECETTE §21). */
  resume: (h: Helpers) => string;
  faqs: (h: Helpers) => FAQ[];
  /** HTML. A tool can be placed inside with `<!--tool:mini:spd-->` or `<!--tool:iht|{"pension":500000}-->`. */
  body: (h: Helpers) => string;
}
export const definePage = (g: PageDef): PageDef => g;
