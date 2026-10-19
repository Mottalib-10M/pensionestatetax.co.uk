import { definePage } from '../../lib/guide-types';
import type { EstateInput, HeirInput } from '../../lib/engine/iht';

// Same assumptions as the calculator on this page (props below; age and heir income are its defaults).
const EST: EstateInput = { home: 300000, savings: 100000, pension: 100000, status: 'single', homeToDescendants: true, heirs: 2 };
const HEIR: HeirInput = { age: 78, heirIncome: 45000 };

export default definePage({
  id: 'inheritance-tax-500000-estate',
  group: 'cases',
  order: 240,
  tool: { kind: 'iht', props: { family: 'single', home: 300000, savings: 100000, pension: 100000, toDescendants: true } },
  related: ['inheritance-tax-threshold', 'residence-nil-rate-band', 'inheritance-tax-1-million-estate', 'inheritance-tax-no-children'],
  sources: ['gov_iht', 'gov_rnrb', 'fa2026_s66', 'fa2021_s86'],
  slug: 'inheritance-tax-500000-estate',
  nav: '£500,000 estate',
  card: 'A single parent leaving a home to the children: where the half-million line sits and how a pension crosses it.',
  title: 'Inheritance Tax on a £500,000 Estate: The Pension in 2027',
  description: 'Inheritance tax on a £500,000 estate in 2026/27 for a single parent leaving a home to children, and how a pension pushes it over the line from April 2027.',
  h1: 'Inheritance tax on a £500,000 estate with a pension',
  intro: 'For a single or divorced parent, half a million pounds is the line. A modest pension that used to sit beside the estate now counts inside it.',
  resume: (h) => {
    const I = h.P.iht;
    const r = h.run(EST, HEIR);
    const more = h.run({ ...EST, pension: 150000 }, HEIR);
    return `A single, divorced or unmarried person who leaves a home to children or grandchildren can pass on up to ${h.m(I.nrb + I.rnrb)} free of inheritance tax: the nil-rate band of ${h.m(I.nrb)} plus the residence nil-rate band of ${h.m(I.rnrb)}, both frozen until ${h.D.freeze}. Above that line the rate is ${h.pc(I.rate)}. Take a parent with a ${h.m(EST.home)} house and ${h.m(EST.savings)} of savings. On a death before ${h.D.from} the estate counted is ${h.m(r.before.estateForTaper)}, comfortably below the line, and the ${h.m(EST.pension)} pension sits outside it. From that date the pension joins the estate, which becomes ${h.m(r.after.estateForTaper)}: exactly on the threshold, so the tax is ${r.after.iht > 0 ? h.m(r.after.iht) : 'nil'} but no room is left. Any growth in the house, the savings or the pot is now taxed. With a pension of ${h.m(150000)} instead, the same parent's estate owes ${h.m(more.after.iht)}, of which ${h.m(more.after.ihtOnPension)} is charged on the pension itself. The children's income tax on the pension, when the parent dies at ${h.P.pensions.deathAgeIncomeTax} or over, comes on top.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    const small = h.run({ ...EST, home: 150000, savings: 250000 }, HEIR);
    return [
      { q: 'I am divorced with two children. Is my tax-free limit really half a million?', a: `Only if a home you lived in passes to your children or grandchildren and the estate stays under ${h.m(I.taperThreshold)}. The nil-rate band of ${h.m(I.nrb)} applies to anyone; the residence band of up to ${h.m(I.rnrb)} needs the home to go to direct descendants. A former spouse's unused bands cannot be claimed after a divorce, so the limit does not double.` },
      { q: 'What if my flat is worth less than the residence band?', a: `The residence band is capped at the value of the home that passes to descendants. A parent whose flat is worth ${h.m(150000)}, with ${h.m(250000)} of savings and the same ${h.m(EST.pension)} pension, gets a residence band of only ${h.m(small.after.rnrb)}, so the estate owes ${h.m(small.after.iht)} from ${h.D.from}. The unused part cannot be set against savings or the pension.` },
      { q: 'Do my children pay anything if my estate is exactly at the limit?', a: `Not in inheritance tax: an estate that uses the whole ${h.m(I.nrb + I.rnrb)} owes none. They can still pay income tax on the pension. When the parent dies at ${h.P.pensions.deathAgeIncomeTax} or over, what each child draws is taxed as their own income; in the example on this page the two children pay ${h.m(h.run(EST, HEIR).heirsAfter.totalIncomeTax)} between them if they each take their share in one tax year.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const pots = [50000, 100000, 150000, 200000, 300000];
    const rows = pots.map((p) => { const r = h.run({ ...EST, pension: p }, HEIR); return [h.m(p), h.m(r.after.estateForTaper), h.m(r.after.iht), h.m(r.after.ihtOnPension), h.pc(r.after.estateRate, 1)]; });
    const r = h.run(EST, HEIR);
    return `
<h2>Where the half-million line comes from</h2>
<p>Two allowances add up to it. Everyone has the nil-rate band of ${h.m(I.nrb)}. On top, the ${h.src('gov_rnrb', 'residence nil-rate band')} of up to ${h.m(I.rnrb)} applies when a home the person lived in, or a share of it, is inherited by children, grandchildren, step-children or their spouses. ${h.src('gov_iht', 'GOV.UK')} sets the rate above both at ${h.pc(I.rate)}. A single parent cannot borrow anyone else's bands: those of a former spouse are lost on divorce and an unmarried partner has none to pass on. So for this household the figure is fixed at ${h.m(I.nrb + I.rnrb)} until ${h.D.freeze}.</p>

<h2>The pension that tips it over</h2>
<p>Before ${h.D.from}, most pension pots paid out at the scheme's discretion stayed outside the estate. ${h.src('fa2026_s66', 'Section 66 of the Finance Act 2026')} ends that: the unused pot is treated as the member's property immediately before death. The table keeps the house and savings of the example and changes only the pot.</p>
${h.table(['Unused pension', 'Estate from April 2027', 'Inheritance tax', 'Charged on the pension', 'Average rate'], rows, 'Single parent, home £300,000 to two children, savings £100,000, death at 78. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>Up to ${h.m(EST.pension)} of pension the estate still fits. Past it, each additional ${h.m(10000)} in the pot adds ${h.m(10000 * I.rate)} of tax, and that tax is shared between the house, the savings and the pension in proportion to their value. A parent who expected the children to receive everything intact now has a bill that grows with every good year in the markets.</p>

<h2>Reading the calculator for this household</h2>
<p>The tool above opens on the example: single, ${h.m(EST.home)} home to descendants, ${h.m(EST.savings)} saved, ${h.m(EST.pension)} in the pension. The ledger below uses the same inputs, a death at ${HEIR.age} and two children who each earn ${h.m(HEIR.heirIncome)}.</p>
${h.ledger(EST, HEIR, `The example estate with the calculator’s assumptions, for a death before and from ${h.D.from}.`)}
<p>No inheritance tax is due either way, yet the children still pay ${h.m(r.heirsAfter.totalIncomeTax)} of income tax between them on the pension, because the parent died at ${h.P.pensions.deathAgeIncomeTax} or over and the money is taxed as their income when drawn. Change the age at death to see the income tax disappear on a death before ${h.P.pensions.deathAgeIncomeTax}.</p>

<h2>Points that move the result</h2>
<ul>
<li>Leaving the home to a nephew, a niece or a friend removes the residence band: the ${h.a('inheritance-tax-no-children', 'page on estates with no children')} shows the effect.</li>
<li>A mortgage or other debts come off the estate before the threshold is compared.</li>
<li>Gifts made in the ${h.P.iht.giftYears} years before death use the nil-rate band first.</li>
</ul>
<p>The ${h.a('residence-nil-rate-band', 'residence band guide')} covers downsizing and the cap at the home's value, and the ${h.a('inheritance-tax-1-million-estate', '£1 million page')} follows a widowed parent whose limit is twice this one. The figures are illustrations; executors, a solicitor or a regulated adviser check a real estate.</p>
`;
  },
});
