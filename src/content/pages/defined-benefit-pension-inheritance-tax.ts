import { definePage } from '../../lib/guide-types';

// Worked case: a divorced former employee whose final salary pension was in payment with a guarantee.
const LUMP = 45000;
const DEP = 12000;
const CASE = { home: 340000, savings: 210000, pension: LUMP, status: 'single' as const, homeToDescendants: true, heirs: 2 };
const heir = (age: number) => ({ age, heirIncome: 35000 });

export default definePage({
  id: 'defined-benefit-pension-inheritance-tax',
  group: 'pensions',
  order: 50,
  mini: { kind: 'mini:db', props: { lump: LUMP, dep: DEP } },
  related: ['pension-death-benefits-excluded', 'inheritance-tax-on-pensions', 'pension-left-to-spouse-inheritance-tax', 'annuity-calculator'],
  sources: ['fa2026_s66', 'gov_tiin', 'gov_tech_note', 'gov_inherited_pension', 'fa2026_s69'],
  slug: 'defined-benefit-pension-inheritance-tax',
  nav: 'Defined benefit schemes',
  card: 'Final salary and public sector schemes: which death lump sums join the estate and why survivors’ pensions do not.',
  title: 'Defined Benefit Pension Inheritance Tax: 2027 Rules',
  description: 'Defined benefit pension inheritance tax from April 2027: guarantee and refund lump sums join the estate, survivors’ pensions stay out but are taxed as income.',
  h1: 'Defined benefit pensions and inheritance tax from 2027',
  intro: 'A final salary scheme holds no pot that heirs can inherit, so the reform reaches it through the lump sums it pays on death rather than through a fund.',
  resume: (h) => {
    const I = h.P.iht;
    const r = h.run(CASE, heir(71));
    return `A defined benefit scheme, such as a final salary or career average scheme in the private or public sector, pays a pension for life rather than building a pot, so for most members there is little left to inherit when they die. For deaths on or after ${h.D.from}, section 150A of the Inheritance Tax Act 1984 counts the lump sum death benefits such a scheme must pay, or may pay and can reasonably be expected to pay: the balance of a guarantee paid as a lump sum, a refund of contributions, or a death grant from a former employer's scheme. A dependants' scheme pension paid to a widow, widower, civil partner or child is excluded from the estate, though it is taxed as the survivor's income. Some public sector schemes were never discretionary and their lump sums were already in the estate before the change. A divorced member who dies at 71 with a ${h.m(CASE.home)} home, ${h.m(CASE.savings)} of savings and a ${h.m(LUMP)} guarantee lump sum paid to two children owes ${h.m(r.before.iht)} before the change and ${h.m(r.after.iht)} after it, at ${h.pc(I.rate)} above the bands.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    return [
      { q: 'Is the survivor’s pension my late husband’s scheme pays me part of his estate?', a: `No. A pension paid to a dependant under the scheme rules is a dependants' scheme pension, one of the excluded benefits listed in section 150A(6). Its value is not added to the estate, before or after ${h.D.from}. You pay income tax on each payment as part of your own income, whatever his age at death.` },
      { q: 'Is the five year guarantee on a scheme pension part of the estate?', a: `When the scheme pays the rest of the guarantee as a lump sum on death, yes, from ${h.D.from}. That payment is a lump sum death benefit and counts as notional pension property. If instead the scheme continues the pension to a dependant for the rest of the guarantee period as a dependants' scheme pension, the exclusion applies.` },
      { q: 'Why was a public sector pension lump sum already counted for inheritance tax before 2027?', a: `Because some public sector schemes are not discretionary: the scheme has no discretion over who receives the lump sum, so the member was treated as entitled to it. HMRC's guidance on the reform notes that non-discretionary schemes were already in the estate. For those members the reform changes little; for discretionary schemes it brings the lump sum in for the first time.` },
      { q: 'Do I pay income tax on a lump sum from my late father’s final salary scheme?', a: `It depends on his age at death. Under ${N.deathAgeIncomeTax}, a lump sum death benefit is normally tax free within his remaining lump sum and death benefit allowance, if paid within ${N.lumpSumPaidWithinYears} years of the scheme hearing of the death. At ${N.deathAgeIncomeTax} or over, it is taxed as your income, after the deduction for any inheritance tax attributable to it.` },
      { q: 'Will a final salary scheme tell the executors what the death lump sum is worth?', a: `It will have to provide information, but the detail is still being written. HMRC's technical note says the government will lay regulations later in 2026 on what schemes and personal representatives exchange, and that HMRC tools to help representatives are planned for April 2027. Until then the scheme administrator can say what lump sum its rules provide.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const y = h.run(CASE, heir(71)), o = h.run(CASE, heir(78));
    const rows = [
      ['Inheritance tax on the estate', h.m(y.after.iht), h.m(o.after.iht)],
      ['of which on the lump sum', h.m(y.after.ihtOnPension), h.m(o.after.ihtOnPension)],
      ['Income tax on the lump sum, per child', h.m(y.heirsAfter.incomeTaxShare), h.m(o.heirsAfter.incomeTaxShare)],
      ['Each child keeps from the lump sum', h.m(y.heirsAfter.pensionKept), h.m(o.heirsAfter.pensionKept)],
      ['Each child receives in all', h.m(y.heirsAfter.total), h.m(o.heirsAfter.total)],
    ];
    const lumps = [20000, 45000, 90000].map((l) => { const r = h.run({ ...CASE, pension: l }, heir(71)); return [h.m(l), h.m(r.before.iht), h.m(r.after.iht), h.m(r.after.ihtOnPension)]; });
    return `
<h2>Why there is usually no pot to tax</h2>
<p>In a money purchase scheme the member owns a share of an invested fund, and whatever is left at death can pass on. A defined benefit scheme works differently. It promises an income worked out from salary and service, paid for life, and the scheme's assets are pooled to meet the promises to every member. When a pensioner dies, the income stops or switches to a survivor; there is no balance that belongs to the member.</p>
<p>That is why ${h.src('fa2026_s66', 'section 150A')} uses two different measures. For money purchase arrangements it takes the value of the pot. For defined benefits arrangements it takes the lump sum death benefits that must be paid, or that may be paid and can reasonably be expected to be, plus some continuing payments. The main continuing payment, a pension for a dependant, is then taken back out by the list of excluded benefits. For a typical pensioner the result is that only the one-off sums a scheme pays on death are in the estate.</p>

<h2>Which lump sums a scheme can pay</h2>
<p>Three kinds of payment come up most often. A pension guarantee: many schemes guarantee the pension for a period such as five years from retirement, and if the member dies inside that period the balance may be paid as a lump sum. A refund of contributions: where a member dies before drawing the pension, some schemes return what the member paid in. And a death grant: a fixed lump sum that some scheme rules provide on the death of a deferred member or a pensioner.</p>
<p>All three join the estate from ${h.D.from}, unless they are paid only because the member was still working in the relevant employment at death. ${h.src('gov_tech_note', 'HMRC’s technical note')} is explicit that a refund of contributions is not excluded even when it is paid alongside death in service cover. The ${h.a('pension-death-benefits-excluded', 'page on excluded benefits')} sets out that boundary.</p>

<h2>Survivors' pensions: outside the estate, inside income tax</h2>
<p>The largest benefit a final salary scheme provides on death is usually the survivor's pension: a proportion of the member's pension paid to a spouse, civil partner or other dependant for life, and pensions for children while they qualify under the rules. These are dependants' scheme pensions and they are excluded from the estate. ${h.src('gov_tiin', 'HMRC’s impact note')} lists dependants' scheme pensions from defined benefit and collective money purchase arrangements among the benefits outside the change.</p>
<p>Excluded from inheritance tax does not mean tax free. ${h.src('gov_inherited_pension', 'GOV.UK’s guidance')} says that dependants' scheme pensions are always taxed as the recipient's income, whatever age the member died at. A surviving partner receiving ${h.m(DEP)} a year adds it to their other income and pays at their marginal rate. Where the pension is very small, the scheme may commute it into a one-off lump sum; a trivial commutation lump sum that extinguishes a dependants' scheme pension is also excluded from the estate.</p>

<h2>Schemes that were already in the estate</h2>
<p>Before ${h.D.from}, a lump sum paid at the trustees' discretion was outside the estate because nobody was entitled to it. Some public sector schemes are non-discretionary: the scheme has no choice over who receives the lump sum, and for inheritance tax the member was already treated as owning it. For members of those schemes the reform changes very little. For everyone else, it brings the lump sum into the estate for the first time.</p>
<p>Comparing the old and new rules therefore starts with knowing which kind of scheme it is. In the table below, the column for a death before the change assumes a discretionary scheme; for a non-discretionary scheme, the earlier figure would already match the later one.</p>

<h2>A worked case: guarantee lump sum at 71 and at 78</h2>
<p>A divorced former employee dies at 71, three years into retirement, with a scheme pension guaranteed for five years. The scheme pays the remaining guarantee as a lump sum of ${h.m(LUMP)}, split between two adult children who each earn ${h.m(35000)}. The estate also holds a ${h.m(CASE.home)} home left to the children and ${h.m(CASE.savings)} of savings.</p>
${h.table(['Lump sum on death', 'Inheritance tax, death before 6/4/2027', 'Inheritance tax from 6/4/2027', 'Of which on the lump sum'], lumps, 'Discretionary scheme, death at 71, divorced member, two children. Computed by the engine.', ['r', 'r', 'r', 'r'])}
<p>With the ${h.m(LUMP)} lump sum, the bill rises from ${h.m(y.before.iht)} to ${h.m(y.after.iht)}, and ${h.m(y.after.ihtOnPension)} of it is attributed to the lump sum, because the estate as a whole is above its ${h.m(y.after.threshold)} threshold and the tax is spread across every chargeable asset at the same average rate.</p>
<p>Two figures need keeping apart here. The extra cost of the lump sum to the family is the whole increase in the bill, ${h.m(y.after.iht - y.before.iht)}, since without it the estate would have paid ${h.m(y.before.iht)}. The share attributed to the lump sum is much smaller, because the tax is spread over the home, the savings and the pension in proportion to value. That attributed share is what the personal representatives can recover from the pension side, through a payment notice to the scheme or from the beneficiary, and it is also the figure deducted from taxable income when the member died at ${N.deathAgeIncomeTax} or over. Where the same two children inherit everything, the split makes no difference to what they receive in total; it matters when the lump sum and the rest of the estate go to different people. The second table compares a death at 71 with the same death at 78, when income tax is added for the children.</p>
${h.table(['', 'Death at 71', 'Death at 78'], rows, `Same estate, death on or after ${h.D.from}, children earning ${h.m(35000)}. Computed by the engine.`, ['l', 'r', 'r'])}
<p>At 71 the lump sum is free of income tax, provided it is paid within ${N.lumpSumPaidWithinYears} years and within the member's remaining lump sum and death benefit allowance. At 78 each child pays income tax on their half after deducting the inheritance tax attributable to it, as the ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions after 75')} explains. A guarantee only produces a lump sum if the member dies within the guaranteed period, so the older the member at death, the less likely there is one to pay.</p>

<h2>Spouses, civil partners and the second death</h2>
<p>When a lump sum goes to a surviving spouse or civil partner, ${h.src('fa2026_s69', 'section 69')} makes it exempt. The survivor's pension is excluded. A married member of a defined benefit scheme therefore often leaves nothing taxable from the scheme at the first death. What the survivor does with the lump sum, saving it or spending it, then determines what is in their own estate later. The ${h.a('pension-left-to-spouse-inheritance-tax', 'page on pensions left to a spouse')} follows that second death.</p>
<p>The figures here illustrate the rules; they are not a valuation of anyone's scheme benefits. Scheme rules differ on guarantees, refunds and death grants, and a real case needs the scheme's own statement and, where decisions are involved, a solicitor or a regulated adviser. The ${h.a('home', 'estate calculator')} accepts a lump sum in the pension field for a rough picture.</p>
`;
  },
});
