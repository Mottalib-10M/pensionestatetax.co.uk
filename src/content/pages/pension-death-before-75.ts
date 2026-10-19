import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

// Worked case: a single parent who dies at 68, having taken the maximum tax-free cash in retirement.
const BASE = { home: 450000, savings: 150000, status: 'single' as const, homeToDescendants: true, heirs: 2 };
const heir = (h: Helpers) => ({ age: 68, heirIncome: 50000, taxFreeTaken: h.P.pensions.lumpSumAllowance });
const run = (h: Helpers, pension: number) => h.run({ ...BASE, pension }, heir(h));

export default definePage({
  id: 'pension-death-before-75',
  group: 'pensions',
  order: 30,
  mini: { kind: 'mini:before75', props: { pot: 900000, taken: 200000, iht: 0 } },
  related: ['inheritance-tax-on-pensions', 'inheritance-tax-on-pensions-after-75', 'pension-tax-free-lump-sum', 'pension-pot-1-million-inheritance-tax', 'who-pays-inheritance-tax-on-pensions'],
  sources: ['gov_inherited_pension', 'gov_tech_note', 'fa2026_s71', 'gov_tiin', 'gov_tax_on_pension'],
  slug: 'pension-death-before-75',
  nav: 'Death before 75',
  card: 'No income tax for heirs within the allowance, tested net of inheritance tax, but the pot is in the estate from 2027.',
  title: 'Pension Death Before 75: Income Tax Free, IHT From 2027',
  description: 'Pension death before 75 from April 2027: lump sums stay free of income tax within the allowance, tested after inheritance tax, but the pot now joins the estate.',
  h1: 'Death before 75: what heirs pay on the pension from 2027',
  intro: 'Dying before 75 used to mean a pension passed on almost untaxed. The income tax side survives the reform; the inheritance tax side does not.',
  resume: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const r = run(h, 900000);
    return `When a pension member dies before their ${N.deathAgeIncomeTax}th birthday, lump sums paid to beneficiaries are normally free of income tax up to the member's lump sum and death benefit allowance of ${h.m(N.lsdba)}, reduced by any tax-free cash the member took in life, provided the money is paid within ${N.lumpSumPaidWithinYears} years of the scheme learning of the death. Income from beneficiary drawdown or an annuity bought for the beneficiary is also tax free. That part of the system is unchanged. What changes, for deaths on or after ${h.D.from}, is that the unused pot counts in the estate, so inheritance tax at ${h.pc(I.rate)} applies above the tax-free bands whatever the member's age. When both rules meet, each lump sum is tested against the allowance net of the inheritance tax on it. A single parent who dies at 68 with a ${h.m(BASE.home)} home, ${h.m(BASE.savings)} of savings and a ${h.m(900000)} pot paid ${h.m(r.before.iht)} of inheritance tax before the change; from ${h.D.from} the bill is ${h.m(r.after.iht)}, of which ${h.m(r.after.ihtOnPension)} falls on the pension, with no income tax for the children.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    return [
      { q: 'Does the beneficiary’s own tax band matter when the member died before 75?', a: `Not for lump sums within the allowance. When the member died before ${N.deathAgeIncomeTax}, a lump sum paid within ${N.lumpSumPaidWithinYears} years of the scheme hearing of the death is free of income tax up to the remaining lump sum and death benefit allowance, whether the beneficiary pays tax at the basic, higher or additional rate. Their band only matters for any excess above the allowance, or for a payment made after the ${N.lumpSumPaidWithinYears} year window.` },
      { q: 'Does the tax-free cash my father took at retirement reduce what we can inherit tax free?', a: `It reduces the allowance, not the pot. The lump sum and death benefit allowance of ${h.m(N.lsdba)} is shared between tax-free lump sums taken in life and lump sum death benefits. If he took ${h.m(100000)} of tax-free cash, ${h.m(N.lsdba - 100000)} of allowance remains for lump sums paid on his death. Most estates never come near it, but a large pot can.` },
      { q: 'Is a pension lump sum taxed if the scheme pays it more than two years after the death?', a: `Yes. Where the member died before ${N.deathAgeIncomeTax} and the lump sum is paid more than ${N.lumpSumPaidWithinYears} years after the scheme was told of the death, GOV.UK says the whole amount is taxable. A delay in paperwork can therefore turn a tax-free payment into a taxable one, which is one reason executors tend to notify schemes early and keep a record of the date.` },
      { q: 'My father had less than a year to live and took his whole pot as cash. Is it still in his estate?', a: `Yes, but no longer as a pension. A member under ${N.deathAgeIncomeTax} with a terminal illness can take the whole pot tax free within the lump sum and death benefit allowance. Once paid out, the money is part of his bank balance or savings, and those have always counted in the estate for inheritance tax, whether he died before or after ${h.D.from}.` },
      { q: 'Does dying before 75 keep a pension out of the new inheritance tax rules?', a: `No. The age of ${N.deathAgeIncomeTax} only matters for income tax. Section 150A brings unused pension funds into the estate for every death on or after ${h.D.from}, at any age. A member who dies at 60 and one who dies at 90 are treated the same for inheritance tax; the difference is whether the beneficiaries pay income tax on top.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const left = N.lsdba - N.lumpSumAllowance;
    const pots = [900000, 1400000, 1800000, 2400000];
    const rows = pots.map((pot) => {
      const r = run(h, pot);
      return [h.m(pot), h.m(r.after.ihtOnPension), h.m(pot - r.after.ihtOnPension), h.m(r.heirsBefore.lsdbaExcess), h.m(r.heirsAfter.lsdbaExcess), h.m(r.heirsAfter.totalIncomeTax)];
    });
    const big = run(h, 1800000);
    const r = run(h, 900000);
    const old = h.run({ ...BASE, pension: 900000 }, { age: 80, heirIncome: 50000 });
    return `
<h2>Age at death and date of death: two separate tests</h2>
<p>Two questions decide what happens to a pension after its owner dies, and they are independent. The member's age at death settles income tax: before ${N.deathAgeIncomeTax}, most death benefits reach the beneficiary free of it, while from ${N.deathAgeIncomeTax} the beneficiary pays at their own rates. The date of death settles inheritance tax: before ${h.D.from}, a pension paid at the scheme's discretion stays outside the estate, and from that date it is included, as ${h.src('fa2026_s71', 'section 71 of the Finance Act 2026')} provides.</p>
<p>Put together, the reform hits younger deaths in a particular way. Before it, a member who died at 68 could pass on a pot with neither tax, which is why pensions were so often the last asset families expected to be taxed. After it, the income tax advantage remains but the pot is added to everything else the member owned. ${h.src('gov_tiin', 'HMRC’s impact note')} puts the share of inheritance tax paid by estates of people aged ${N.deathAgeIncomeTax} or over at ${h.pc(N.share75plus)}, so deaths before that age account for the smaller part of the bill. For the estates concerned, though, the pot has often not been drawn at all, and all of it enters the estate.</p>

<h2>The allowance that caps tax-free lump sums</h2>
<p>The limit on tax-free lump sums is the lump sum and death benefit allowance, ${h.m(N.lsdba)}. It is a single allowance used in two ways. Tax-free cash taken in retirement, normally up to ${h.pc(N.taxFreeShare)} of each pot and at most ${h.m(N.lumpSumAllowance)} in total, uses it up during life. Whatever remains is available on death for lump sum death benefits paid to beneficiaries, and the ${h.src('gov_tax_on_pension', 'GOV.UK page on pension tax')} adds that a member under ${N.deathAgeIncomeTax} with less than a year to live can take the whole pot tax free within the same allowance. A member who took the full ${h.m(N.lumpSumAllowance)} of tax-free cash therefore leaves ${h.m(left)} of allowance for the heirs.</p>
<p>Any lump sum above the remaining allowance is taxed as the recipient's income at their marginal rate. For most families the question never arises, because the remaining allowance is larger than the pot; it becomes real for large pots, or where the member has already used much of the allowance.</p>

<h2>Why the test is run after inheritance tax</h2>
<p>From ${h.D.from}, a large lump sum can carry inheritance tax and also exceed the allowance. The question is which comes first. Section 637T of the Income Tax (Earnings and Pensions) Act 2003, as amended, answers it: when inheritance tax is due, each lump sum death benefit is tested against the allowance at its "IHT-adjusted amount", which is the lump sum less the inheritance tax attributable to it. Only the net figure uses allowance, and only the net excess is taxed as income. Without that rule the same pound could be taxed at the inheritance tax rate and then again at the heir's income tax rate on its full value.</p>
<p>The table follows the worked estate as the pot grows: a single parent, ${h.m(BASE.home)} home left to two children, ${h.m(BASE.savings)} of savings, death at 68, maximum tax-free cash already taken, so ${h.m(left)} of allowance left. Each child earns ${h.m(50000)} a year, and every pound of pension is assumed to be paid as a lump sum within the ${N.lumpSumPaidWithinYears} year window.</p>
${h.table(['Pot', 'IHT on the pension', 'Lump sums tested', 'Above allowance, old rules', 'Above allowance, from 2027', 'Heirs’ income tax, from 2027'], rows, 'Death at 68, allowance left after maximum tax-free cash, two children. Computed by the engine.', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>At ${h.m(900000)} nothing exceeds the allowance under either regime. At ${h.m(1800000)}, the old rules would have left ${h.m(big.heirsBefore.lsdbaExcess)} above it, taxed as the children's income but with no inheritance tax on the pension. From ${h.D.from} the pension carries ${h.m(big.after.ihtOnPension)} of inheritance tax, the tested amount drops accordingly, and only ${h.m(big.heirsAfter.lsdbaExcess)} exceeds the allowance. The estate at that size also passes ${h.m(I.taperThreshold)}, which removes the residence nil-rate band; the ${h.a('pension-pot-1-million-inheritance-tax', 'page on a pension of a million pounds')} looks at that effect alone.</p>

<h2>Lump sum, drawdown or annuity for the beneficiary</h2>
<p>A beneficiary does not always take a lump sum. Some schemes let a nominee keep the fund invested in beneficiary drawdown, or use it to buy an annuity. When the member died before ${N.deathAgeIncomeTax}, ${h.src('gov_inherited_pension', 'GOV.UK says')} that income from a new drawdown fund or such an annuity is tax free, and drawdown designated for a beneficiary is not tested against the lump sum and death benefit allowance at all. For very large pots that distinction matters: the allowance limits tax-free lump sums, not tax-free drawdown.</p>
<p>Inheritance tax does not care which form the benefit takes. The value of the pot at death is in the estate from ${h.D.from}, and the tax attributable to it has to be met from the fund or by the beneficiary, through the routes described on the ${h.a('who-pays-inheritance-tax-on-pensions', 'page on who pays')}. ${h.src('gov_tech_note', 'HMRC’s technical note')} warns that money already used to buy an annuity with an insurer is no longer available for a payment notice, so the timing of an annuity purchase can affect how the tax is funded.</p>

<h2>The two-year window</h2>
<p>The income tax exemption for lump sums after a death before ${N.deathAgeIncomeTax} comes with a time limit. A lump sum paid more than ${N.lumpSumPaidWithinYears} years after the scheme administrator was told of the death loses its tax-free status and is taxable in full. The clock starts with the notification, not with the grant of probate, and the new inheritance tax steps (information requests between schemes and personal representatives, withholding of benefits, valuation) now have to fit into the same period. Executors who notify each scheme promptly and keep evidence of the date reduce the risk that paperwork pushes a payment past the deadline.</p>

<h2>Before and after the reform for the same family</h2>
<p>The ledger shows the worked estate with a ${h.m(900000)} pot, comparing a death at 68 just before the change with one on or after ${h.D.from}. In both columns the children pay no income tax on the pension, because the member was under ${N.deathAgeIncomeTax}.</p>
${h.ledger({ ...BASE, pension: 900000 }, heir(h), `Single parent, death at 68, pot of ${h.m(900000)} paid within ${N.lumpSumPaidWithinYears} years. Computed by the engine.`)}
<p>The cost of the reform for this family is the inheritance tax on the pension, ${h.m(r.after.ihtOnPension)}, plus the extra tax that the larger estate pushes onto the rest. Compare a death at 80 with the same estate after the change: each child would keep ${h.m(old.heirsAfter.total)} instead of ${h.m(r.heirsAfter.total)}, because income tax at their own rates is added on top of inheritance tax. The ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions after 75')} explains how the two taxes combine.</p>
<p>None of this tells anyone what to do with their own pension. Nominations, the choice between a lump sum and drawdown, and the timing of claims each have consequences that depend on the whole estate. The scheme, the personal representatives, a solicitor or a regulated adviser can check a real case against the rules described here.</p>
`;
  },
});
