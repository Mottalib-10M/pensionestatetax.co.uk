import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

// Worked case of the page: a divorced parent who dies at 79, two children who each earn a salary.
const CASE = { home: 300000, savings: 200000, pension: 300000, status: 'single' as const, homeToDescendants: true, heirs: 2 };
const HEIR = { age: 79, heirIncome: 45000 };
const run = (h: Helpers, years = 1) => h.run(CASE, { ...HEIR, years });

export default definePage({
  id: 'inheritance-tax-on-pensions-after-75',
  group: 'pensions',
  order: 20,
  mini: { kind: 'mini:after75', props: { share: 100000, inc: 45000 } },
  related: ['inheritance-tax-on-pensions', 'pension-death-before-75', 'pension-drawdown-tax', 'who-pays-inheritance-tax-on-pensions', 'inheritance-tax-scotland-pension'],
  sources: ['fa2026_s70', 'gov_inherited_pension', 'gov_tech_note', 'gov_scottish_it', 'gov_ootlar'],
  slug: 'inheritance-tax-on-pensions-after-75',
  nav: 'Pensions after 75',
  card: 'Inheritance tax first, then the heir’s income tax on what is left: the combined rate band by band.',
  title: 'Inheritance Tax on Pensions After 75: The 2027 Double Charge',
  description: 'Inheritance tax on pensions after 75 from April 2027: estate tax first, then the heir’s income tax on the rest, and the combined rate at 20, 40 and 45 per cent.',
  h1: 'Inheritance tax on pensions after 75: two taxes on one pot',
  intro: 'When the member dies at 75 or over, the heir faces inheritance tax and then income tax on the same money. The Finance Act 2026 sets the order between them.',
  resume: (h) => {
    const P = h.P, I = P.iht, N = P.pensions, B = P.incomeTax.ruk.bands;
    const r = run(h), a = r.heirsAfter;
    return `For a death on or after ${h.D.from} at the age of ${N.deathAgeIncomeTax} or over, an inherited pension can be taxed twice. Inheritance tax comes first, because the unused pot is now part of the estate. Income tax follows when the beneficiary draws the money, at their own marginal rate, as it already did before the reform. Section 70 of the Finance Act 2026 adds section 567B to the Income Tax (Earnings and Pensions) Act 2003, which deducts the inheritance tax borne on the benefit from the taxable pension income, so income tax only bites on what inheritance tax left. On a slice taxed at ${h.pc(I.rate)} for inheritance tax, the combined charge is ${h.pc(h.E.combinedRate(I.rate, B[0].rate))} for a basic rate heir, ${h.pc(h.E.combinedRate(I.rate, B[1].rate))} at the higher rate and ${h.pc(h.E.combinedRate(I.rate, B[2].rate))} at the additional rate. In the site's worked case, a ${h.m(CASE.pension)} pot split between two children who each earn ${h.m(HEIR.heirIncome)} leaves each of them ${h.m(a.pensionKept)} from a share of ${h.m(a.pensionShare)} if it is drawn in one tax year, after ${h.m(a.ihtPensionShare)} of inheritance tax and ${h.m(a.incomeTaxShare)} of income tax.`;
  },
  faqs: (h) => {
    const P = h.P, I = P.iht, N = P.pensions, B = P.incomeTax.ruk.bands;
    return [
      { q: 'Can inheritance tax and income tax together take two thirds of an inherited pension?', a: `On the top slice, yes. Where the estate is above its tax-free bands, the pension slice pays ${h.pc(I.rate)} inheritance tax. If the heir is an additional rate taxpayer and the member died at ${N.deathAgeIncomeTax} or over, income tax at ${h.pc(B[2].rate)} then falls on the remaining ${h.pc(1 - I.rate)}, which gives ${h.pc(h.E.combinedRate(I.rate, B[2].rate))} in all. A pension that sits partly within the bands pays less on average.` },
      { q: 'Is the age 75 rule about the age at death or the age when my children draw the money?', a: `It is the member's age at death. If the member died at ${N.deathAgeIncomeTax} or over, every payment the beneficiary takes from that fund is taxed as the beneficiary's income, whenever it is drawn. If the member died younger, the lump sum and death benefit allowance rules apply instead, and the beneficiary's own age does not change the treatment.` },
      { q: 'Does it make a difference whether the scheme or the heir pays the inheritance tax on the pension?', a: `Not to the income tax. Section 567B allows the deduction whether the inheritance tax was paid by the beneficiary directly, taken by the personal representatives out of what the beneficiary inherits, reimbursed by them, or paid by the scheme under a payment notice. In each route income tax is charged on the pension less the inheritance tax attributable to it, so the beneficiary ends with the same amount.` },
      { q: 'What happens to income tax if HMRC later repays some of the inheritance tax on a pension?', a: `When the member died at ${N.deathAgeIncomeTax} or over, a repayment of overpaid inheritance tax on the pension becomes taxable pension income of the beneficiary under section 579CB. The logic is that the earlier deduction under section 567B was too large, because it was based on a tax bill that turned out to be lower. The repayment puts back the income tax that the larger deduction had removed.` },
      { q: 'Does a spouse who inherits a pension after 75 pay either tax?', a: `No inheritance tax, because section 69 of the Finance Act 2026 extends the spouse and civil partner exemption to pension benefits. Income tax is another matter: when the member died at ${N.deathAgeIncomeTax} or over, what the surviving partner draws is taxed as their income in the normal way. The pot the survivor has not drawn then sits in their own estate at their death.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions, IT = P.incomeTax, B = IT.ruk.bands, S = IT.scotland.bands;
    const paTop = B[1].upTo as number;
    const r = run(h), a = r.heirsAfter, er = r.after.estateRate;
    // Combined rate by the heir's band: marginal rate from the engine, then combined with the full IHT rate.
    const bands: Array<[string, number, 'ruk' | 'scotland']> = [
      ['Basic rate, England, Wales, NI', 30000, 'ruk'],
      ['Higher rate', 60000, 'ruk'],
      ['Personal Allowance being withdrawn', 110000, 'ruk'],
      ['Additional rate', 150000, 'ruk'],
      ['Scottish intermediate rate', 40000, 'scotland'],
      ['Scottish higher rate', 60000, 'scotland'],
      ['Scottish advanced rate', 90000, 'scotland'],
      ['Scottish top rate', 150000, 'scotland'],
    ];
    const bandRows = bands.map(([label, inc, reg]) => {
      const mr = h.E.marginalRate(inc, reg);
      return [label, h.m(inc), h.pc(mr, 1), h.pc(h.E.combinedRate(I.rate, mr), 1), h.pc(h.E.combinedRate(er, mr), 1)];
    });
    const spread = [1, 2, 3, 5, 10].map((y) => { const x = run(h, y).heirsAfter; return [y === 1 ? 'One tax year' : `${y} tax years`, h.m(x.incomeTaxShare), h.m(x.pensionKept), h.pc(x.pensionTaxRate, 1)]; });
    const r5 = run(h, 5).heirsAfter;
    const before = r.heirsBefore;
    const taxDirect = h.E.extraTax(a.pensionShare - a.ihtPensionShare, HEIR.heirIncome);
    const small = h.E.extraTax(20000, 30000), smallNet = h.E.extraTax(20000 * (1 - I.rate), 30000);
    return `
<h2>The order of the two charges</h2>
<p>Everything turns on sequence. The personal representatives value the estate at death, pension included, and the inheritance tax on it is worked out on the whole. The pension carries its share of that bill. Only later, often months later, does the beneficiary start drawing the inherited fund, and each payment is then taxed through PAYE as their income when the member was ${N.deathAgeIncomeTax} or over, as ${h.src('gov_inherited_pension', 'GOV.UK explains for inherited pensions')}.</p>
<p>Without a link between the two, the beneficiary would pay income tax on money that had already gone to HMRC as inheritance tax. ${h.src('fa2026_s70', 'Section 70 of the Finance Act 2026')} prevents that. The new section 567B gives a deduction from the taxable pension income equal to the inheritance tax attributable to the benefit that the beneficiary has borne. The result is a simple formula: the combined rate is the inheritance tax rate plus the income tax rate applied to whatever is left. With inheritance tax at ${h.pc(I.rate)}, an heir at the higher rate loses ${h.pc(I.rate)} plus ${h.pc(B[1].rate)} of the remaining ${h.pc(1 - I.rate)}, which is ${h.pc(h.E.combinedRate(I.rate, B[1].rate))}.</p>
<p>A short illustration of what the deduction is worth: on ${h.m(20000)} drawn by a beneficiary with ${h.m(30000)} of other income, income tax on the full amount would be ${h.m(small)}. With the inheritance tax on that slice deducted first, the taxable amount falls to ${h.m(20000 * (1 - I.rate))} and the income tax to ${h.m(smallNet)}.</p>

<h2>Combined rate for each income tax band</h2>
<p>The heir's marginal rate is what matters, and it depends on their other income in the year of the withdrawal. The table takes a typical income in each band, asks the engine for the rate on the next pound, and combines it with inheritance tax at the full ${h.pc(I.rate)} and at the average rate of the worked case below (${h.pc(er, 1)}, because part of that estate falls within its bands). Scottish rates follow the ${h.src('gov_scottish_it', 'GOV.UK table for 2026 to 2027')}; the rest of the UK uses the bands in ${h.src('gov_ootlar', 'the Budget 2025 rates annex')}.</p>
${h.table(['Heir’s band', 'Other income', 'Marginal income tax', `With IHT at ${h.pc(I.rate)}`, `With IHT at ${h.pc(er, 1)}`], bandRows, 'Rate on the next pound of inherited pension, 2026/27 income tax rates. Computed by the engine.', ['l', 'r', 'r', 'r', 'r'])}
<p>Two rows stand out. Between ${h.m(IT.paTaperFrom)} and ${h.m(paTop)} of income, the Personal Allowance is withdrawn at one pound for every two pounds earned, so each extra pound of pension costs income tax at the band rate plus the tax on the half pound of allowance lost. In England, Wales and Northern Ireland that produces the ${h.pc(h.E.marginalRate(110000))} marginal rate in the table, and a combined rate of ${h.pc(h.E.combinedRate(I.rate, h.E.marginalRate(110000)))} once inheritance tax has been taken. In Scotland the allowance is withdrawn in the same way, inside the advanced band, so the next pound there costs ${h.pc(h.E.marginalRate(110000, 'scotland'), 1)}. The top Scottish rate of ${h.pc(S[5].rate)} gives a combined ${h.pc(h.E.combinedRate(I.rate, S[5].rate), 1)}, the highest figure for anyone above ${h.m(paTop)}. The ${h.a('inheritance-tax-scotland-pension', 'Scottish page')} works through those bands in more detail.</p>

<h2>A worked case: two children, one pot</h2>
<p>A divorced parent dies at ${HEIR.age} after ${h.D.from}. The estate is a ${h.m(CASE.home)} home left to the two children, ${h.m(CASE.savings)} of savings and a ${h.m(CASE.pension)} drawdown fund that both children are nominated to share. Each child earns ${h.m(HEIR.heirIncome)} a year. The engine finds inheritance tax of ${h.m(r.after.iht)} on the estate, an average of ${h.pc(er, 1)}, of which ${h.m(r.after.ihtOnPension)} is attributed to the pension.</p>
${h.ledger(CASE, HEIR, `Death at ${HEIR.age}, two children each earning ${h.m(HEIR.heirIncome)}, pension drawn in one tax year. Computed by the engine.`)}
<p>Each child's share of the pension is ${h.m(a.pensionShare)}. After ${h.m(a.ihtPensionShare)} of inheritance tax, ${h.m(a.taxablePension)} remains taxable as income. Taken as a single payment on top of a salary of ${h.m(HEIR.heirIncome)}, it runs through the higher rate band and into the zone where the Personal Allowance disappears, so the income tax comes to ${h.m(a.incomeTaxShare)}. Under the old rules, with the pension outside the estate, the same child would have paid ${h.m(before.incomeTaxShare)} of income tax and nothing on the pension for inheritance tax.</p>

<h2>Drawing the fund over several tax years</h2>
<p>Once the deduction has been given, timing is the lever that remains. A lump sum taken in one tax year stacks on top of the heir's salary; the same amount drawn in instalments, where the scheme lets the beneficiary keep the fund in drawdown, uses the lower part of their bands each year. The table reruns the worked case with the taxable amount spread evenly.</p>
${h.table(['Fund drawn over', 'Income tax per child', 'Each child keeps from the pension', 'Total tax on the share'], spread, `Share of ${h.m(a.pensionShare)} per child, inheritance tax deducted first, heir earning ${h.m(HEIR.heirIncome)} a year. Computed by the engine.`, ['l', 'r', 'r', 'r'])}
<p>Spread over five years, the income tax per child falls to ${h.m(r5.incomeTaxShare)} and each keeps ${h.m(r5.pensionKept)}. Beyond a certain point spreading stops helping: once every instalment sits wholly within the higher rate band, a longer period leaves the bill where it is. The calculation ignores investment growth while the money stays in the fund, and it assumes the heir's other income stays level, which a promotion, retirement or a second inheritance would change. The ${h.a('pension-drawdown-tax', 'drawdown tax page')} shows the effect of a single withdrawal on a given income.</p>

<h2>Scheme pays or heir pays: the same end figure</h2>
<p>The inheritance tax on the pension can reach HMRC by several routes. The personal representatives may pay it out of the free estate and recover it from the beneficiary, the beneficiary may pay it from their own money, or either of them may give the scheme administrator a payment notice so that the scheme pays HMRC from the fund. Section 567B names each of these routes, so the deduction is available whichever one is used.</p>
<p>The arithmetic shows why the choice does not move the income tax. Suppose a child's share is ${h.m(a.pensionShare)} and the tax attributable to it is ${h.m(a.ihtPensionShare)}. If the scheme pays that tax, the fund the child draws is reduced to ${h.m(a.pensionShare - a.ihtPensionShare)} and income tax falls on that smaller fund. If the child pays the tax from savings and draws the full ${h.m(a.pensionShare)}, the deduction removes ${h.m(a.ihtPensionShare)} from the taxable income. Either way the taxable amount is ${h.m(a.taxablePension)} and, drawn in one year, the income tax is ${h.m(taxDirect)}. What differs is cash flow: paying from the pot avoids the heir finding the money first, while paying from savings leaves more invested inside the fund.</p>

<h2>Repayments of inheritance tax</h2>
<p>Inheritance tax figures are sometimes revised after the event. A valuation is corrected or a debt comes to light, and part of the tax is repaid. When the member died at ${N.deathAgeIncomeTax} or over, a repayment of inheritance tax attributable to the pension is treated as taxable pension income of the beneficiary under section 579CB. The repayment is not lost, but it is no longer tax free: it reverses part of the deduction the heir has already had, at their marginal rate in the year it arrives.</p>

<h2>Where neither charge applies</h2>
<p>Three situations break the pattern. A pension left to a spouse or civil partner is exempt from inheritance tax, although the survivor still pays income tax on drawings after a death at ${N.deathAgeIncomeTax} or over. A lump sum death benefit paid to a charity is free of both taxes, even after ${N.deathAgeIncomeTax}, as ${h.src('gov_tech_note', 'HMRC’s technical note')} confirms, and it counts towards the ${h.pc(I.charityTest)} test for the reduced ${h.pc(I.charityRate)} rate on the rest of the estate. And a dependants' scheme pension from a defined benefit scheme is excluded from the estate altogether, while being taxed as income. Deaths before ${N.deathAgeIncomeTax} follow different income tax rules, set out on the ${h.a('pension-death-before-75', 'page on deaths before 75')}.</p>
<p>The sums on this page describe how the two taxes interact; they are not a recommendation about when to draw a pension, whom to nominate or how a beneficiary should take an inherited fund. Those choices depend on the whole estate and on each heir's income, and the personal representatives, a solicitor or a regulated financial adviser are the people to check a real case. The ${h.a('home', 'full calculator')} runs any estate with its heirs.</p>
`;
  },
});
