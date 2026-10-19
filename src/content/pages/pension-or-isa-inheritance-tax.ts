import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

// Comparison estate: a single person already above the tax-free bands, one heir.
const BASE = { home: 400000, savings: 300000, pension: 0, status: 'single' as const, homeToDescendants: true, heirs: 1 };
const SMALL = { ...BASE, home: 200000, savings: 100000 };
const X = 100000;
type Est = typeof BASE;
/** What one heir gains from an extra £X left in a pension or in an ISA, all taxes included (engine). */
const gain = (h: Helpers, base: Est, where: 'pension' | 'isa', age: number, inc: number, regime: 'after' | 'before' = 'after') => {
  const heir = { age, heirIncome: inc };
  const with_ = where === 'pension' ? { ...base, pension: base.pension + X } : { ...base, savings: base.savings + X };
  const k = regime === 'after' ? 'heirsAfter' : 'heirsBefore';
  return h.run(with_, heir)[k].total - h.run(base, heir)[k].total;
};

export default definePage({
  id: 'pension-or-isa-inheritance-tax',
  group: 'pensions',
  order: 60,
  mini: { kind: 'mini:pension-vs-isa', props: { amount: X, inc: 50000, iht: 1 } },
  related: ['inheritance-tax-on-pensions-after-75', 'pension-death-before-75', 'pension-drawdown-tax', 'cashing-in-pension-tax', 'inheritance-tax-on-pensions'],
  sources: ['fa2026_s66', 'fa2026_s70', 'gov_inherited_pension', 'gov_tax_on_pension', 'gov_iht'],
  slug: 'pension-or-isa-inheritance-tax',
  nav: 'Pension or ISA',
  card: 'From 2027 both sit in the estate. What an heir keeps from £100,000 in each, at each age and income.',
  title: 'Pension or ISA for Inheritance Tax: What Heirs Keep, 2027',
  description: 'Pension or ISA for inheritance tax from April 2027: both count in the estate, but after 75 the pension adds the heir’s income tax. What £100,000 in each leaves.',
  h1: 'Pension or ISA: what an heir keeps of each from 2027',
  intro: 'The reform removes the pension’s exemption from inheritance tax, which used to settle the comparison. What is left is a difference in income tax.',
  resume: (h) => {
    const I = h.P.iht, N = h.P.pensions;
    const isa = gain(h, BASE, 'isa', 80, 60000);
    const p80 = gain(h, BASE, 'pension', 80, 60000);
    const p70 = gain(h, BASE, 'pension', 70, 60000);
    const old = gain(h, BASE, 'pension', 80, 60000, 'before');
    return `For deaths on or after ${h.D.from}, money left in a pension joins the estate for inheritance tax, as money in an ISA or a bank account always has. Above the tax-free bands, both are charged at ${h.pc(I.rate)}. The difference between them is now income tax. Cash or investments inherited from an ISA reach the heir as capital, while a pension inherited from someone who died at ${N.deathAgeIncomeTax} or over is taxed as the heir's income when drawn, after a deduction for the inheritance tax already borne. In the site's comparison of ${h.m(X)} left by a single person whose estate is already above the bands, an heir earning ${h.m(60000)} keeps ${h.m(isa)} from the ISA and ${h.m(p80)} from the pension when the death is at 80 and the pension is drawn in one year. Before the reform, the same pension would have left ${h.m(old)}. When the death is before ${N.deathAgeIncomeTax}, the pension leaves ${h.m(p70)}, level with the ISA. These are illustrations of how the rules work, not a view on which money anyone should spend first.`;
  },
  faqs: (h) => {
    const I = h.P.iht, N = h.P.pensions;
    return [
      { q: 'Once pensions count for inheritance tax, does an ISA pass to children on better terms?', a: `Only in one respect, and only when the death is at ${N.deathAgeIncomeTax} or over. Both are in the estate and both pay ${h.pc(I.rate)} above the bands. After ${N.deathAgeIncomeTax}, the heir also pays income tax on what they draw from the pension, while ISA money arrives as capital. Before ${N.deathAgeIncomeTax}, the two are taxed the same for the heir, unless the pension exceeds the lump sum and death benefit allowance.` },
      { q: 'Do my ISA and my pension both count towards the residence band taper?', a: `From ${h.D.from}, yes. The residence nil-rate band is reduced by one pound for every two that the estate exceeds ${h.m(I.taperThreshold)}, and the estate measured for that test includes the unused pension as well as ISAs and other savings. A large pension can therefore remove the residence band even when the rest of the estate is well below the limit.` },
      { q: 'Does my son pay income tax on the money he inherits from my ISA?', a: `No income tax arises simply because he inherits it. The ISA forms part of your estate, inheritance tax is settled on the estate as a whole, and what he receives is capital. Any income or gains the money produces after he receives it are his and taxed under the normal rules, which is a separate question from the inheritance.` },
      { q: 'If I move pension money into an ISA while I am alive, is that withdrawal taxed?', a: `Usually, yes. Apart from the tax-free part, normally up to ${h.pc(N.taxFreeShare)} of a pot, a pension withdrawal is taxed as your income in the year you take it. Moving money from one to the other therefore swaps a possible income tax charge on your heir for a certain one on you, at your own rate, and the money stays in the estate either way.` },
      { q: 'Is a spouse treated differently for a pension and an ISA left to them?', a: `For inheritance tax, no. Section 69 of the Finance Act 2026 extends the spouse and civil partner exemption to pension benefits, so both pass free of inheritance tax to a surviving partner. For income tax the pension keeps its own rules: after a death at ${N.deathAgeIncomeTax} or over, the survivor pays income tax on what they draw from it.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const cases: Array<[string, Est, number, number]> = [
      ['Death at 70, heir earning £60,000', BASE, 70, 60000],
      ['Death at 80, heir earning £30,000', BASE, 80, 30000],
      ['Death at 80, heir earning £60,000', BASE, 80, 60000],
      ['Death at 80, heir earning £110,000', BASE, 80, 110000],
      ['Death at 80, heir earning £150,000', BASE, 80, 150000],
      ['Death at 80, estate within its bands, heir earning £60,000', SMALL, 80, 60000],
    ];
    const rows = cases.map(([label, base, age, inc]) => [label, h.m(gain(h, base, 'isa', age, inc)), h.m(gain(h, base, 'pension', age, inc)), h.m(gain(h, base, 'pension', age, inc, 'before'))]);
    const p30 = gain(h, BASE, 'pension', 80, 30000), p110 = gain(h, BASE, 'pension', 80, 110000), isa = gain(h, BASE, 'isa', 80, 60000);
    const small = gain(h, SMALL, 'pension', 80, 60000);
    const pr = h.run({ ...BASE, pension: X }, { age: 80, heirIncome: 60000 }), pb = h.run(BASE, { age: 80, heirIncome: 60000 });
    // Moving the money in life: a member of 77 with £20,000 of other income draws £X of taxable drawdown.
    const own = 20000;
    const t1 = h.E.extraTax(X, own, 1), t5 = h.E.extraTax(X, own, 5);
    const heir80 = { age: 80, heirIncome: 60000 };
    const viaIsa = (net: number) => h.run({ ...BASE, savings: BASE.savings + net }, heir80).heirsAfter.total - h.run(BASE, heir80).heirsAfter.total;
    const leave = gain(h, BASE, 'pension', 80, 60000);
    const move = [
      ['Left in the pension, heir draws it in one year', h.m(0), h.m(leave)],
      ['Drawn by the member in one tax year, kept in an ISA or savings', h.m(t1), h.m(viaIsa(X - t1))],
      ['Drawn by the member over five tax years, kept in an ISA or savings', h.m(t5), h.m(viaIsa(X - t5))],
    ];
    return `
<h2>From 2027 both sit in the estate</h2>
<p>The old comparison was lopsided. An ISA has always been part of its owner's estate, so ${h.m(X)} in a stocks and shares ISA above the tax-free bands lost ${h.m(X - gain(h, BASE, 'isa', 80, 60000))} to inheritance tax at death. The same ${h.m(X)} in a pension usually lost nothing, because a discretionary scheme's death benefits were outside the estate. ${h.src('fa2026_s66', 'Section 66 of the Finance Act 2026')} ends that for deaths on or after ${h.D.from}: the unused pension is now notional pension property, added to the estate like any other asset, measured for the residence band taper, and charged at the same rate.</p>
<p>That leaves the two on equal terms for inheritance tax. Neither has a separate allowance, neither escapes the frozen bands described on ${h.src('gov_iht', 'GOV.UK')}, and both benefit from the same exemptions when left to a spouse, a civil partner or a charity. What still separates them is what happens to the heir after the estate is settled.</p>

<h2>The heir's side: capital against taxable income</h2>
<p>Money inherited out of an ISA arrives as capital. Nothing in the inheritance rules turns it into income for the person who receives it. A pension is different when the member died at ${N.deathAgeIncomeTax} or over: ${h.src('gov_inherited_pension', 'GOV.UK confirms')} that lump sums, drawdown and annuity payments from the inherited fund are taxed as the beneficiary's income. ${h.src('fa2026_s70', 'Section 70')} lets the beneficiary deduct the inheritance tax borne on the benefit, so income tax falls only on what is left, but it still falls.</p>
<p>The table measures that gap. It adds ${h.m(X)} to an estate that is already above its bands, once as savings or an ISA and once as an unused pension, and asks the engine how much more the single heir receives in each case. The last column shows what the pension would have left under the rules for deaths before ${h.D.from}.</p>
${h.table(['Situation', 'Heir gains from the ISA', 'Heir gains from the pension', 'Pension, old rules'], rows, `Extra ${h.m(X)} left by a single person, one heir, pension drawn in one tax year. Computed by the engine.`, ['l', 'r', 'r', 'r'])}
<p>Several patterns stand out. At 70, the pension and the ISA leave the same amount, because the heir pays no income tax on a death before ${N.deathAgeIncomeTax}. At 80, the gap depends on the heir. A basic rate heir keeps ${h.m(p30)} from the pension against ${h.m(isa)} from the ISA; an heir earning ${h.m(110000)}, in the band where the Personal Allowance is withdrawn, keeps only ${h.m(p110)}. Where the estate is within its bands, there is no inheritance tax on either and the pension leaves ${h.m(small)}, its only cost being income tax.</p>

<h2>Why the pension can lose more than the headline rate</h2>
<p>A combined rate such as ${h.pc(h.E.combinedRate(I.rate, P.incomeTax.ruk.bands[1].rate))} for a higher rate heir assumes that the whole pension pays inheritance tax at ${h.pc(I.rate)} and that the same amount comes off the heir's taxable income. In a mixed estate the two figures differ. Adding the ${h.m(X)} pension raises the estate's bill by ${h.m(pr.after.iht - pb.after.iht)}, but the tax is shared across the home, the savings and the pension in proportion to value, so only ${h.m(pr.after.ihtOnPension)} is attributed to the pension, an average of ${h.pc(pr.after.estateRate, 1)}. The deduction under section 567B is that attributed amount, which leaves ${h.m(pr.heirsAfter.taxablePension)} taxable as income. When one heir inherits both the pension and the rest of the estate, they bear the full increase in inheritance tax and receive the smaller deduction, so the pension costs them more than the formula suggests. Where the pension and the rest of the estate go to different people, the split of the tax between them follows the same proportions.</p>

<h2>Before 75 the comparison flips</h2>
<p>For a death before ${N.deathAgeIncomeTax}, the heir's position is identical whether the money was in a pension or an ISA, so long as the pension stays within the member's lump sum and death benefit allowance and lump sums are paid within ${N.lumpSumPaidWithinYears} years. Both pay inheritance tax at the same rate, neither pays income tax. The difference is on the member's side. Taking money out of a pension during life is itself taxed: apart from the tax-free share, normally up to ${h.pc(N.taxFreeShare)} of a pot, a withdrawal is income for the year, as the ${h.src('gov_tax_on_pension', 'GOV.UK page on pension tax')} sets out. So for someone under ${N.deathAgeIncomeTax}, money left in the pension reaches the heir on the same terms as an ISA without first paying the member's income tax on the way out.</p>
<p>The ${h.a('pension-death-before-75', 'page on deaths before 75')} covers the allowance and the two-year window in detail.</p>

<h2>Moving the money during life</h2>
<p>After ${N.deathAgeIncomeTax}, the question changes shape. Drawing from the pension to hold the money in an ISA or other savings replaces the heir's income tax with the member's own, at the member's rates, in the years the money is taken. The table follows a member aged 77 with ${h.m(own)} of other income who has already taken tax-free cash, so the whole ${h.m(X)} is taxable, compared with leaving it for an heir earning ${h.m(60000)} after a death at 80. The ISA figures assume the money stays invested at the same value; growth, charges and the ISA subscription limits are not modelled.</p>
${h.table(['Route', 'Income tax paid by the member', 'Heir gains in the end'], move, 'Same estate, death at 80, one heir. Computed by the engine.', ['l', 'r', 'r'])}
<p>Whether one route leaves more than another turns on two rates: the member's marginal rate on the withdrawals and the heir's marginal rate on the inherited fund. A member with a modest income who spreads withdrawals may pay less than a higher rate heir would. A member who takes a large sum in one year can pay more. Inheritance tax is the same in every row, since the money is in the estate whichever form it takes. The ${h.a('cashing-in-pension-tax', 'page on cashing in a pension')} shows the cost of a withdrawal at each income.</p>

<h2>What the comparison leaves out</h2>
<p>Several things matter in a real decision and are not in these figures. The heir's income can change over the years they draw the fund, which the ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions after 75')} explores. A pension can be left to several beneficiaries, each with their own rates. The member may need the money for care or living costs, and how long anyone lives is unknown. Gifts made from pension withdrawals raise a separate question: HMRC says the reform does not change the existing position, and whether such gifts are normal expenditure out of income depends on the facts of each case.</p>
<p>This page sets out how two kinds of saving are taxed when they pass on. It does not recommend which to spend first, whether to draw a pension early, or how to arrange an estate. Those are personal decisions with consequences beyond tax, and a regulated financial adviser or a solicitor can look at a real case. The ${h.a('home', 'estate calculator')} runs a whole estate with its heirs.</p>
`;
  },
});
