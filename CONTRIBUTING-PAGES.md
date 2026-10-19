# Adding or editing a page

One page = one file `src/content/pages/<id>.ts`, exported with `definePage` (types in
`src/lib/guide-types.ts`). The file name is the id. The page is built at `/en/<slug>/` and listed in the
menu, the footer, the sitemap and `llms.txt` automatically. The model to follow is
`src/content/pages/inheritance-tax-on-pensions.ts`.

**Facts**: only those of `CONTRIBUTING-FAITS.md`, each read on legislation.gov.uk or GOV.UK on
19 October 2026. A rule that is not there is not written until it has been read on the official source.

## Page types

- **Guide** (no `tool`, a `mini`): `mini: { kind: 'mini:<spec>', props: {...} }` with a spec of
  `src/lib/mini-specs.ts`; citable block plus body of **1,200 words or more** (tables not counted).
- **Tool page** (`tool`): `tool: { kind: 'mini:<spec>' }` or `tool: { kind: 'iht', props: { home, savings,
  pension, age, family, toDescendants, heirs, heirIncome, debts, gifts, giftYears, charity, transfer,
  years, scotland } }` (family: `single`, `widowed`, `married-children`, `married-split`,
  `married-partner`). The calculator sits on the first screen; **480 to 700 words** of text.
- A second calculator can be placed inside the body with `<!--tool:mini:<spec>-->` or
  `<!--tool:mini:<spec>|{"inc":80000}-->` (JSON props, numbers only).

## Rules checked by `npx vitest run tests/pages.test.ts`

- `title` 50 to 60 characters, key term first (what people type: "Inheritance Tax Threshold 2026/27: ..."),
  never starting with the country or a tool or question word (UK, England, Scotland, Calculator, How,
  What, Who...). `description` 150 to 160 characters. Both with the year (2026/27 or 2027). No em dash,
  no space before `: ; ! ?`.
- `resume`: ONE paragraph of 120 words or more that answers the page's question with figures from the
  engine. It is the citable block (RECETTE §21).
- `faqs`: 3 to 8 questions (5 or 6 on a guide), answers of **40 to 90 words**, each question written as
  people ask it and used **once on the whole site**.
- No em dash anywhere (`—`). British English (organise, programme, civil partner, executor). No personal
  advice: never "you should"; options are information ("one option families look at"), with the
  reminder that personal representatives, a solicitor or a regulated adviser check a real case.
- **No statutory figure typed in the source** (test `TYPED`): £325,000, £175,000, £2 million, 40 %, 36 %,
  67 %, £268,275, £1,073,100, £3,000, £250, 15 months, £1,000, 35 days, £12,570, 6 April 2027,
  5 April 2031, 18 March 2026... Use `h.m(h.P.iht.nrb)`, `h.pc(h.P.iht.rate)`, `h.D.from`, `h.D.freeze`,
  `h.D.assent`, `h.P.pensions.withholdMonths`, `h.E.combinedRate(...)`. Example amounts that are not
  statutory (a £350,000 home) may be typed, but every result comes from `h.run(...)`, `h.ledger(...)`
  or `h.E.*`: never a hand-computed tax.
- At least two `sources` keys of `src/data/params-2026.json`; cite them in the text with
  `h.src(key, 'link text')`.
- Internal links only through `h.a('<page id>', 'anchor text')`; an unknown id fails the test.

## Uniqueness (check-unique.py, check-portefeuille.py)

- No two pages above 30 % similarity once numbers are neutralised: each page is written for its own
  question, with its own H2 headings, its own vocabulary and its own worked case. Do not reuse a paragraph
  pattern from another page with other numbers.
- The distinctive content must come first (the comparison window is the first 12,000 characters).
- Never copy or reword text from another site, including the other sites of the publisher.

## Helpers (`src/lib/helpers.ts`)

`h.P` parameters, `h.E` engine, `h.run(estate, heir)` both regimes, `h.ledger(estate, heir, caption)`
table, `h.m` money, `h.pc` percent, `h.num`, `h.date(iso)`, `h.D`, `h.table(headers, rows, caption,
align)`, `h.src(key, text)`, `h.a(id, text)`, `h.box(title, html, kind)`.
