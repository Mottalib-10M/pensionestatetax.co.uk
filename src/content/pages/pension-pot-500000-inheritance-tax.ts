import { definePage } from '../../lib/guide-types';
import type { EstateInput, HeirInput } from '../../lib/engine/iht';

// Same assumptions as the calculator props of this page.
const EST: EstateInput = { home: 250000, savings: 50000, pension: 500000, status: 'single', homeToDescendants: true, heirs: 2 };
const HEIR: HeirInput = { age: 78, heirIncome: 60000 };

export default definePage({
  id: 'pension-pot-500000-inheritance-tax',
  group: 'cases',
  order: 270,
  tool: { kind: 'iht', props: { family: 'single', home: 250000, savings: 50000, pension: 500000, age: 78, heirs: 2, heirIncome: 60000 } },
  related: ['inheritance-tax-on-pensions-after-75', 'pension-or-isa-inheritance-tax', 'who-pays-inheritance-tax-on-pensions', 'pension-pot-1-million-inheritance-tax'],
  sources: ['fa2026_s70', 'gov_inherited_pension', 'fa2026_s66', 'gov_tech_note'],
  slug: 'pension-pot-500000-inheritance-tax',
  nav: '£500,000 pension pot',
  card: 'Inheritance tax on the estate, then income tax on each child’s share: what two heirs keep from a large pot.',
  title: 'Pension Pot of £500,000: Inheritance Tax 2027 and Heirs',
  description: 'Pension pot of £500,000 and inheritance tax from April 2027: the estate’s tax, then each heir’s income tax on it at the higher rate, and what each one keeps.',
  h1: 'A £500,000 pension pot: two taxes, then what each heir keeps',
  intro: 'When the pot is the largest thing someone owns, it now pays its share of inheritance tax. If they die at 75 or over, the children pay income tax on what remains.',
  resume: (h) => {
    const r = h.run(EST, HEIR), a = r.heirsAfter, b = r.heirsBefore;
    return `A large pension left by someone who dies at ${h.P.pensions.deathAgeIncomeTax} or over is taxed twice from ${h.D.from}. Take a single mother with a ${h.m(EST.home)} home, ${h.m(EST.savings)} of savings and ${h.m(EST.pension)} still invested in her pension, dying at ${HEIR.age} and leaving everything to two children who each earn ${h.m(HEIR.heirIncome)}. Before the reform her estate was ${h.m(r.before.estateForTaper)} and paid nothing. From that date it is ${h.m(r.after.estateForTaper)}, owes ${h.m(r.after.iht)} of inheritance tax, and ${h.m(r.after.ihtOnPension)} of that is charged on the pension. Each child's half of the pot is ${h.m(a.pensionShare)}; after ${h.m(a.ihtPensionShare)} of inheritance tax, ${h.m(a.taxablePension)} is taxable as their income. Drawn in a single tax year on top of a salary, it costs each of them ${h.m(a.incomeTaxShare)} of income tax. Each child ends up with ${h.m(a.pensionKept)} from the pension and ${h.m(a.total)} in all, against ${h.m(b.total)} under the old rules. Section 70 of the Finance Act 2026 lets the inheritance tax borne come off the taxable amount, which stops the two taxes from overlapping in full.`;
  },
  faqs: (h) => {
    const I = h.P.iht, bands = h.P.incomeTax.ruk.bands;
    return [
      { q: 'Do I pay income tax on the pension money my mother left me?', a: `If she died at ${h.P.pensions.deathAgeIncomeTax} or over, yes: what you draw is added to your income for the year and taxed at your own rates, usually through PAYE by the provider. If she died younger, lump sums are normally free of income tax within her lump sum and death benefit allowance, as long as they are paid within ${h.P.pensions.lumpSumPaidWithinYears} years of the provider being told of the death.` },
      { q: 'Does each child’s salary change how much of the pension they keep?', a: `Yes. The inheritance tax on each share is the same, but income tax is charged at the heir's own rates on top of what they already earn. In the example on this page, a child earning ${h.m(20000)} keeps ${h.m(h.run(EST, { ...HEIR, heirIncome: 20000 }).heirsAfter.pensionKept)} from their half of the pot, against ${h.m(h.run(EST, HEIR).heirsAfter.pensionKept)} for a child earning ${h.m(HEIR.heirIncome)}, both drawing it in one tax year.` },
      { q: 'Can my brother and I take our shares of the pension in different ways?', a: `Each beneficiary's share is treated separately for income tax, so one heir can draw slowly and another quickly, depending on what the scheme offers. The inheritance tax on the pension is worked out once for the estate and then borne by each share. The executors and the scheme administrator settle how that tax is paid, sometimes directly from the pot by a payment notice.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const r = h.run(EST, HEIR), a = r.heirsAfter;
    const steps = [
      ['Each child’s half of the pension', h.m(a.pensionShare)],
      ['Inheritance tax borne on that half', h.m(a.ihtPensionShare)],
      ['Taxable as income after the deduction', h.m(a.taxablePension)],
      ['Income tax, drawn in one tax year', h.m(a.incomeTaxShare)],
      ['Kept from the pension', h.m(a.pensionKept)],
      ['Share of the house and savings after tax', h.m(a.estateShare)],
    ];
    const yrs = [1, 3, 5, 10];
    const spread = yrs.map((y) => { const x = h.run(EST, { ...HEIR, years: y }).heirsAfter; return [String(y), h.m(x.incomeTaxShare), h.m(x.pensionKept), h.pc(x.pensionTaxRate, 1)]; });
    return `
<h2>Why the pot carries most of the bill</h2>
<p>Inheritance tax is charged on the estate as a whole and then shared out in proportion to value. Here the pension is ${h.pc(EST.pension / r.after.estateForTaper, 0)} of the estate counted from ${h.D.from}, so it carries that share of the ${h.m(r.after.iht)}. The house and savings would have fitted inside the ${h.m(r.after.threshold)} of bands on their own; the pot is what creates the tax. ${h.src('fa2026_s66', 'Section 150A')} treats the unused fund as the mother's property just before death, even though the scheme pays it directly to the children.</p>

<h2>One child's share, step by step</h2>
${h.table(['Step', 'Amount'], steps, 'Single mother, death at 78, two children each earning £60,000, pension drawn in one tax year. Computed by the engine.', ['l', 'r'])}
<p>The deduction comes from ${h.src('fa2026_s70', 'section 70 of the Finance Act 2026')}, which inserts section 567B into the income tax rules on pensions: where a beneficiary has borne inheritance tax on a pension death benefit, that tax comes off the pension income before income tax is worked out. ${h.src('gov_inherited_pension', 'GOV.UK')} confirms that payments from a member who died at ${h.P.pensions.deathAgeIncomeTax} or over are taxed as the beneficiary's income.</p>

<h2>Drawing the inheritance more slowly</h2>
<p>A salary of ${h.m(HEIR.heirIncome)} already reaches the higher rate band, and a six-figure pension payment on top of it goes through the stretch where the Personal Allowance is lost. Spreading the drawings over several tax years keeps more of each year's slice in lower bands, where the scheme allows it.</p>
${h.table(['Years drawn over', 'Income tax per child', 'Kept from the pension', 'Total tax on the pension'], spread, 'Same estate, per child, income tax at 2026/27 rates outside Scotland. Computed by the engine.', ['r', 'r', 'r', 'r'])}

<h2>The whole estate at a glance</h2>
<p>The ledger uses the calculator's inputs: single, ${h.m(EST.home)} home to the children, ${h.m(EST.savings)} saved, ${h.m(EST.pension)} pension, death at ${HEIR.age}, two heirs on ${h.m(HEIR.heirIncome)}.</p>
${h.ledger(EST, HEIR, `Both taxes on the £500,000 pot, death before and from ${h.D.from}.`)}
<p>HMRC's ${h.src('gov_tech_note', 'technical note')} describes how the executors can ask the scheme to hold back part of each benefit or pay the tax directly, which the ${h.a('who-pays-inheritance-tax-on-pensions', 'who pays page')} explains. The ${h.a('pension-or-isa-inheritance-tax', 'pension or ISA comparison')} and the ${h.a('inheritance-tax-on-pensions-after-75', 'after 75 guide')} go further into the second tax. The rate of ${h.pc(I.rate)} and the income tax bands are fixed by law; the rest of this page is an illustration, and for a real family the executors and a regulated adviser check every figure.</p>
`;
  },
});
