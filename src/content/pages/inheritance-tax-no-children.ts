import { definePage } from '../../lib/guide-types';
import type { EstateInput, HeirInput } from '../../lib/engine/iht';

// Same assumptions as the calculator props: single, home not to descendants, three heirs, default age and income.
const EST: EstateInput = { home: 450000, savings: 150000, pension: 200000, status: 'single', homeToDescendants: false, heirs: 3 };
const HEIR: HeirInput = { age: 78, heirIncome: 45000 };

export default definePage({
  id: 'inheritance-tax-no-children',
  group: 'cases',
  order: 290,
  tool: { kind: 'iht', props: { family: 'single', home: 450000, savings: 150000, pension: 200000, toDescendants: false, heirs: 3 } },
  related: ['residence-nil-rate-band', 'inheritance-tax-charity-rate', 'inheritance-tax-unmarried-couples', 'inheritance-tax-500000-estate'],
  sources: ['gov_rnrb', 'fa2026_s69', 'ihtm45009', 'gov_iht'],
  slug: 'inheritance-tax-no-children',
  nav: 'No children',
  card: 'Leaving everything to nephews, nieces, brothers or sisters: one band only, the charity route, and the pension on top.',
  title: 'Inheritance Tax With No Children 2026/27: Nephews and Nieces',
  description: 'Inheritance tax with no children in 2026/27: why nephews, nieces and siblings get no residence band, how charity gifts help, and what a pension adds from 2027.',
  h1: 'Inheritance tax with no children: one band and a pension',
  intro: 'Without children or grandchildren, the extra allowance for a family home never applies. A pension counted in the estate from April 2027 makes the gap wider.',
  resume: (h) => {
    const I = h.P.iht;
    const r = h.run(EST, HEIR);
    const kids = h.run({ ...EST, homeToDescendants: true }, HEIR);
    return `Someone with no children or grandchildren has only the nil-rate band of ${h.m(I.nrb)} against inheritance tax, unless married. The residence nil-rate band of up to ${h.m(I.rnrb)} requires the home to pass to direct descendants, and nephews, nieces, brothers and sisters do not count, however close the family. Consider a single man whose ${h.m(EST.home)} flat, ${h.m(EST.savings)} of savings and ${h.m(EST.pension)} pension go in equal thirds to a sister and two nephews. Dying before ${h.D.from}, his estate is ${h.m(r.before.estateForTaper)} and owes ${h.m(r.before.iht)}. From that date the pension is added: the estate is ${h.m(r.after.estateForTaper)} and the bill ${h.m(r.after.iht)}, ${h.m(r.after.ihtOnPension)} of it charged on the pension. Had the same flat gone to a son or daughter, the bill would have been ${h.m(kids.after.iht)}. Gifts to charity are exempt, pension benefits included, and leaving enough of the estate to charity lowers the rate on the rest from ${h.pc(I.rate)} to ${h.pc(I.charityRate)}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Does a stepchild count as a child for the residence band?', a: `Yes. HMRC's list of direct descendants includes step-children, adopted and foster children and children under guardianship, as well as their own descendants and the spouses or civil partners of all of them. A stepson who inherits the home brings the residence band of up to ${h.m(I.rnrb)} into play; a nephew, a niece or a sister does not.` },
      { q: 'Is there any allowance for leaving my house to a brother or sister?', a: `No special one. A sibling is not a direct descendant, so the residence band does not apply, and there is no exemption for brothers or sisters as there is for a spouse or civil partner. The house simply uses the nil-rate band of ${h.m(I.nrb)} along with everything else, and the excess is taxed at ${h.pc(I.rate)}. A charity named in the will, or as a pension beneficiary where the scheme allows it, is exempt.` },
      { q: 'Do my nephews pay income tax on the pension I leave them?', a: `If you die at ${h.P.pensions.deathAgeIncomeTax} or over, yes, at their own rates when they draw it, after a deduction for the inheritance tax borne on it. Before that age, lump sums are usually free of income tax within your lump sum and death benefit allowance. The relationship does not matter for income tax: a nephew and a son are taxed the same way.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const r = h.run(EST, HEIR);
    const shares = [0, 0.05, 0.1, 0.2];
    const rows = shares.map((c) => { const x = h.run({ ...EST, charityShare: c }, HEIR).after; return [h.pc(c), h.m(x.charity), h.pc(x.rate), h.m(x.iht), h.m(EST.home + EST.savings + EST.pension - x.charity - x.iht)]; });
    return `
<h2>Who counts as a direct descendant</h2>
<p>HMRC's guidance on the ${h.src('gov_rnrb', 'residence nil-rate band')} draws the line at lineal descent: children, grandchildren and further down, step, adopted and foster children, children under a guardianship order, and the spouses or civil partners of any of them. Brothers, sisters, nephews, nieces, cousins, friends and unmarried partners fall outside. So a home left to any of them earns no residence band at all, and the estate is taxed above ${h.m(I.nrb)} alone. The ${h.src('gov_iht', 'GOV.UK summary')} of the rules gives the same threshold for anyone in that position.</p>

<h2>The pension on top of a single band</h2>
<p>For this kind of estate, the reform bites from the first pound. There is no residence band to absorb a modest pot, and here the nil-rate band is already filled by the flat. Every pound of the ${h.m(EST.pension)} pension adds ${h.pc(I.rate)} to the bill, so the pension alone accounts for ${h.m(r.after.iht - r.before.iht)} of extra tax. The calculator above opens on this estate; the ledger below uses the same inputs, with three heirs earning ${h.m(HEIR.heirIncome)} each and a death at ${HEIR.age}.</p>
${h.ledger(EST, HEIR, `Single, no descendants, three heirs, death before and from ${h.D.from}.`)}
<p>The heirs' income tax on the pension comes after the inheritance tax, because the death is at ${h.P.pensions.deathAgeIncomeTax} or over. Brothers, sisters and nephews are taxed on it exactly as children would be.</p>

<h2>Charity: an exemption and a lower rate</h2>
<p>Gifts to charities are free of inheritance tax, and ${h.src('fa2026_s69', 'section 69 of the Finance Act 2026')} extends that to pension benefits paid to a charity. There is a second effect. If at least ${h.pc(I.charityTest)} of the baseline goes to charity, the rest of the estate is taxed at ${h.pc(I.charityRate)}. ${h.src('ihtm45009', 'HMRC’s manual')} defines the baseline as the estate after exemptions, less the nil-rate band available, plus the charity gift; the pension belongs to the same component as the rest of the estate. The table leaves a share of the house and savings to charity.</p>
${h.table(['Share of house and savings to charity', 'To charity', 'Rate', 'Inheritance tax', 'Left for the family, before income tax'], rows, 'Same single estate, pension £200,000, death from April 2027. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>A gift just large enough to meet the test can leave the family with almost as much as no gift at all, because the lower rate applies to everything else. The ${h.a('inheritance-tax-charity-rate', 'charity rate page')} works through the baseline in detail.</p>

<h2>Other routes people look at</h2>
<p>Marriage or civil partnership brings the spouse exemption and a transferable band; the ${h.a('inheritance-tax-unmarried-couples', 'page on unmarried couples')} shows the cost of staying unmarried. Lifetime gifts to nephews and nieces leave the estate if the giver survives ${h.P.iht.giftYears} years. Each of these is a personal decision, and a solicitor or a regulated adviser looks at a real situation.</p>
`;
  },
});
