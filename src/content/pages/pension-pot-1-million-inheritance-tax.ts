import { definePage } from '../../lib/guide-types';
import type { EstateInput, HeirInput } from '../../lib/engine/iht';

// Calculator props converted: widowed with the default full transfer, two heirs earning the default income.
const EST: EstateInput = { home: 400000, savings: 100000, pension: 1000000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 };
const HEIR: HeirInput = { age: 72, heirIncome: 45000 };
const OLDER: HeirInput = { ...HEIR, age: 80 };

export default definePage({
  id: 'pension-pot-1-million-inheritance-tax',
  group: 'cases',
  order: 280,
  tool: { kind: 'iht', props: { family: 'widowed', home: 400000, savings: 100000, pension: 1000000, age: 72 } },
  related: ['pension-death-before-75', 'inheritance-tax-on-pensions-after-75', 'pension-pot-500000-inheritance-tax', 'inheritance-tax-2-million-estate'],
  sources: ['gov_inherited_pension', 'gov_tech_note', 'fa2026_s66', 'fa2026_s70'],
  slug: 'pension-pot-1-million-inheritance-tax',
  nav: '£1 million pension pot',
  card: 'A seven-figure pot left by a widow: the same inheritance tax at 72 and at 80, and a very different income tax.',
  title: '£1 Million Pension Pot and Inheritance Tax 2027: Age 75 Rule',
  description: 'Inheritance tax on a £1 million pension pot from April 2027: why dying before or after 75 changes what heirs keep, and the lump sum and death benefit allowance.',
  h1: 'A £1 million pension pot: death before 75 against after',
  intro: 'The inheritance tax on a large pot is the same at any age. The income tax that follows depends on a single birthday.',
  resume: (h) => {
    const N = h.P.pensions;
    const y = h.run(EST, HEIR), o = h.run(EST, OLDER);
    return `For a pot of a million pounds, the date of death sets the first tax and the age at death sets the second. Take a widow with both of her late husband's bands, a ${h.m(EST.home)} home and ${h.m(EST.savings)} of savings left to two children, and ${h.m(EST.pension)} in a pension. Dying before ${h.D.from}, her estate of ${h.m(y.before.estateForTaper)} owes ${y.before.iht > 0 ? h.m(y.before.iht) : 'nothing'}. From that date the pot joins it: ${h.m(y.after.estateForTaper)}, inheritance tax of ${h.m(y.after.iht)}, of which ${h.m(y.after.ihtOnPension)} is on the pension. That amount does not change with her age. What changes is income tax. If she dies at ${HEIR.age}, under ${N.deathAgeIncomeTax}, lump sums paid to the children within ${N.lumpSumPaidWithinYears} years are free of income tax as long as they fit inside her lump sum and death benefit allowance of ${h.m(N.lsdba)}, tested after the inheritance tax: each child keeps ${h.m(y.heirsAfter.total)}. At ${OLDER.age}, the pension is taxed as the children's income and, drawn in one year, each keeps ${h.m(o.heirsAfter.total)}. The gap between the two ages is worth ${h.m(y.heirsAfter.total - o.heirsAfter.total)} to each child.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    const used = h.run(EST, { ...HEIR, taxFreeTaken: N.lumpSumAllowance });
    return [
      { q: 'How large can a pot be before lump sums to my children become taxable?', a: `On a death before ${N.deathAgeIncomeTax}, lump sums are free of income tax up to the lump sum and death benefit allowance of ${h.m(N.lsdba)}, less tax-free cash taken in life, measured after inheritance tax. In the example on this page, a widow who had already taken ${h.m(N.lumpSumAllowance)} as tax-free cash leaves ${h.m(used.heirsAfter.lsdbaExcess)} of the pot taxable as the children's income.` },
      { q: 'Why is the allowance tested after inheritance tax?', a: `Because the law now uses the "IHT-adjusted amount" of each lump sum death benefit when inheritance tax is due. The part of the pot that goes in inheritance tax is not counted against the member's allowance, so more of what the heirs actually receive can pass free of income tax. It matters most for pots near or above ${h.m(N.lsdba)}.` },
      { q: 'Is drawdown taken by my children tested against the allowance as well?', a: `No. The allowance tests lump sum death benefits. When the member dies under ${N.deathAgeIncomeTax}, income that a beneficiary draws from a new drawdown fund, or from an annuity, is free of income tax without being measured against it. Choosing between a lump sum and beneficiary drawdown therefore matters most for a pot whose lump sums would go past the allowance, which a scheme and a regulated adviser can work through.` },
    ];
  },
  body: (h) => {
    const N = h.P.pensions;
    const ages = [65, 72, 74, 75, 80, 88];
    const rows = ages.map((age) => { const r = h.run(EST, { ...HEIR, age }); return [String(age), h.m(r.after.iht), h.m(r.heirsAfter.totalIncomeTax), h.m(r.heirsAfter.total)]; });
    const y = h.run(EST, HEIR), o = h.run(EST, OLDER);
    const tested = EST.pension - y.after.ihtOnPension;
    const slow = h.run(EST, { ...OLDER, years: 10 });
    return `
<h2>One estate, six ages at death</h2>
<p>The engine keeps the widow's assets and changes only her age when she dies, for a death after the reform. Inheritance tax stays put. Income tax on the pension appears the moment she reaches ${N.deathAgeIncomeTax}.</p>
${h.table(['Age at death', 'Inheritance tax', 'Children’s income tax on the pension', 'Each child keeps'], rows, 'Widow, both bands transferred, home £400,000, savings £100,000, pension of one million pounds, two children earning £45,000, pension drawn in one tax year. Computed by the engine.', ['r', 'r', 'r', 'r'])}
<p>The cliff is real: ${h.src('gov_inherited_pension', 'GOV.UK')} says that when the member dies under ${N.deathAgeIncomeTax}, most lump sums are tax free, and beneficiary drawdown or annuity income is tax free too; at ${N.deathAgeIncomeTax} or over, every payment is taxed at the beneficiary's marginal rate.</p>

<h2>The allowance that guards the lump sums</h2>
<p>Before ${N.deathAgeIncomeTax}, the protection has a ceiling: the lump sum and death benefit allowance of ${h.m(N.lsdba)}, less any tax-free cash taken in life. HMRC's ${h.src('gov_tech_note', 'technical note')} explains that when inheritance tax is due, each lump sum death benefit is measured at its amount net of that tax. Here the pot of ${h.m(EST.pension)} carries ${h.m(y.after.ihtOnPension)} of inheritance tax, so only ${h.m(tested)} is tested, which fits inside the allowance. The FAQ below shows what happens when tax-free cash was taken earlier.</p>

<h2>Death at ${OLDER.age}: income tax after inheritance tax</h2>
<p>At ${OLDER.age}, the children pay income tax on what they draw, less the inheritance tax borne on it under ${h.src('fa2026_s70', 'section 70 of the Finance Act 2026')}. Taken in one tax year, the pension costs them ${h.m(o.heirsAfter.totalIncomeTax)} together. Spread over ten years, the figure falls to ${h.m(slow.heirsAfter.totalIncomeTax)}, and each child keeps ${h.m(slow.heirsAfter.total)} rather than ${h.m(o.heirsAfter.total)}.</p>

<h2>The calculator's case in full</h2>
<p>The tool opens on a death at ${HEIR.age}. The ledger below uses exactly the same inputs: widowed with both bands, two children on ${h.m(HEIR.heirIncome)}.</p>
${h.ledger(EST, HEIR, `Death at 72, before ${h.D.from} and from that date.`)}
<p>${h.src('fa2026_s66', 'Section 150A')} counts the whole pot in the estate in both cases, whatever the age. The ${h.a('pension-death-before-75', 'death before 75 guide')} covers the two-year rule and drawdown, the ${h.a('inheritance-tax-on-pensions-after-75', 'after 75 guide')} the income tax, and the ${h.a('inheritance-tax-2-million-estate', `${h.m(h.P.iht.taperThreshold)} page`)} the taper an estate of this size approaches. A pot of this size is a case for the executors and a regulated adviser, not for a single web page.</p>
`;
  },
});
