import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** A parent dies at 80: home and savings to two children, pension split between them. */
const family = (h: Helpers, region: 'scotland' | 'ruk', years = 1) => h.run({ home: 400000, savings: 100000, pension: 200000, status: 'single', homeToDescendants: true, heirs: 2 }, { age: 80, heirIncome: 50000, region, years });

export default definePage({
  id: 'inheritance-tax-scotland-pension',
  group: 'heirs',
  order: 100,
  mini: { kind: 'mini:after75', props: { sc: 1 } },
  related: ['inheritance-tax-on-pensions-after-75', 'inheritance-tax-on-pensions', 'pension-drawdown-tax', 'who-pays-inheritance-tax-on-pensions'],
  sources: ['gov_scottish_it', 'fa2026_s70', 'gov_inherited_pension', 'gov_pay_iht', 'gov_iht'],
  slug: 'inheritance-tax-scotland-pension',
  nav: 'Scottish heirs and pensions',
  card: 'Same inheritance tax as the rest of the UK, Scottish income tax rates on the inherited pot.',
  title: 'Inheritance Tax and a Pension Inherited in Scotland, 2026/27',
  description: 'Inheritance tax on a pension inherited by a Scottish taxpayer, 2026/27: UK-wide estate rules, then Scottish income tax from 19 % to 48 % on the pot after 75.',
  h1: 'Pensions inherited in Scotland: inheritance tax, then Scottish income tax',
  intro: 'Inheritance tax has no Scottish version. Income tax does, and an heir who pays it can lose a larger share of an inherited pension than a brother or sister in England.',
  resume: (h) => {
    const I = h.P.iht, sc = h.P.incomeTax.scotland.bands;
    const s = family(h, 'scotland'), e = family(h, 'ruk');
    return `Inheritance tax is a UK tax with the same bands everywhere: an estate administered in Edinburgh has the same nil-rate band of ${h.m(I.nrb)}, the same residence band of up to ${h.m(I.rnrb)} and the same rate of ${h.pc(I.rate)} as one in Cardiff, and from ${h.D.from} it includes unused pension funds in Scotland too. The difference comes afterwards. When the member died at ${h.P.pensions.deathAgeIncomeTax} or over, the heirs pay income tax on what they draw from the inherited pot, and an heir who is a Scottish taxpayer pays at the Scottish rates for 2026/27, which run from ${h.pc(sc[0].rate)} to ${h.pc(sc[sc.length - 1].rate)}. The inheritance tax borne on the pension is deducted first. In our example two children each inherit a ${h.m(100000)} share of a parent's pot; each earns ${h.m(50000)} and draws the share in one tax year. The child taxed in Scotland keeps ${h.m(s.heirsAfter.pensionKept)} of the share; the child taxed in England keeps ${h.m(e.heirsAfter.pensionKept)}.`;
  },
  faqs: (h) => {
    const P = h.P, sc = P.incomeTax.scotland.bands;
    const top = h.E.combinedRate(P.iht.rate, sc[sc.length - 1].rate);
    return [
      { q: 'Is inheritance tax different in Scotland?', a: `No. Inheritance tax is charged by the UK government on the same terms across England, Wales, Scotland and Northern Ireland, with the same bands, rates and exemptions. The pension changes in the Finance Act 2026 apply to Scottish estates from ${h.D.from} like any other. What differs is income tax on pension money the heirs draw, and the procedure for the executors, who apply for confirmation rather than probate.` },
      { q: 'What is the highest combined tax on a pension inherited by a Scottish heir?', a: `On a pound of pension that bears inheritance tax at ${h.pc(P.iht.rate)}, drawn by an heir paying the Scottish top rate of ${h.pc(sc[sc.length - 1].rate)}, the combined charge is ${h.pc(top, 1)}, because income tax is charged only on what is left after the inheritance tax. That applies when the member died at ${P.pensions.deathAgeIncomeTax} or over and the heir's income is already in the top band.` },
      { q: 'Do I need to pay the inheritance tax before applying for confirmation?', a: `Usually, yes. GOV.UK says a payment is normally needed before the grant, which in Scotland is confirmation. The tax is due by the end of the sixth month after the death, and interest runs after that. Money in a pension can help: the representatives or a beneficiary can ask the scheme to pay the tax attributable to it directly.` },
      { q: 'My mother lived in England but I live in Glasgow. Which rates apply to her pension?', a: `Her estate pays inheritance tax under the UK rules wherever she lived. The income tax on what you draw from her pot, if she died at ${P.pensions.deathAgeIncomeTax} or over, is your own income tax, so it is charged at the rates that apply to you. If you are a Scottish taxpayer, that means the Scottish bands for the year you draw it.` },
      { q: 'Does the 2027 pension change apply to Scottish public sector pensions?', a: `The new section 150A covers registered pension schemes in general, wherever the scheme is run, so a Scottish public sector scheme is treated like any other. Excluded benefits stay out: a dependants' scheme pension, such as a survivor's pension from a defined benefit scheme, and a death in service lump sum from a job held at death are never counted.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions, IT = P.incomeTax;
    const sc = IT.scotland.bands, ruk = IT.ruk.bands;
    const pa = IT.personalAllowance;
    let low = pa;
    const rows = sc.map((b) => {
      const range = b.upTo === null ? `above ${h.m(low)}` : `${h.m(low + 1)} to ${h.m(pa + b.upTo)}`;
      if (b.upTo !== null) low = pa + b.upTo;
      return [b.name.charAt(0).toUpperCase() + b.name.slice(1), range, h.pc(b.rate), h.pc(h.E.combinedRate(I.rate, b.rate), 1)];
    });
    const s1 = family(h, 'scotland'), e1 = family(h, 'ruk'), s5 = family(h, 'scotland', 5), e5 = family(h, 'ruk', 5);
    const cases = [
      ['Scottish taxpayer, all in one year', h.m(s1.heirsAfter.ihtPensionShare), h.m(s1.heirsAfter.incomeTaxShare), h.m(s1.heirsAfter.pensionKept), h.pc(s1.heirsAfter.pensionTaxRate, 1)],
      ['Taxpayer in England, all in one year', h.m(e1.heirsAfter.ihtPensionShare), h.m(e1.heirsAfter.incomeTaxShare), h.m(e1.heirsAfter.pensionKept), h.pc(e1.heirsAfter.pensionTaxRate, 1)],
      ['Scottish taxpayer, over 5 years', h.m(s5.heirsAfter.ihtPensionShare), h.m(s5.heirsAfter.incomeTaxShare), h.m(s5.heirsAfter.pensionKept), h.pc(s5.heirsAfter.pensionTaxRate, 1)],
      ['Taxpayer in England, over 5 years', h.m(e5.heirsAfter.ihtPensionShare), h.m(e5.heirsAfter.incomeTaxShare), h.m(e5.heirsAfter.pensionKept), h.pc(e5.heirsAfter.pensionTaxRate, 1)],
    ];
    const at50s = h.E.marginalRate(50000, 'scotland'), at50e = h.E.marginalRate(50000, 'ruk');
    const taperZone = h.E.marginalRate(110000, 'scotland');
    return `
<h2>One inheritance tax for the whole UK</h2>
<p>Scotland sets its own income tax rates and bands on earnings and pensions, published each year for Scottish taxpayers, but inheritance tax is a single UK tax. A Scottish estate is valued, reported and taxed under the Inheritance Tax Act 1984 with the bands set out on ${h.src('gov_iht', 'GOV.UK')}, and the freeze of those bands until ${h.D.freeze} applies there as it does in England. The same is true of the pension rules: for a death on or after ${h.D.from}, the unused funds of a Scottish member's personal pension, SIPP or workplace pot are added to the estate, and the spouse, civil partner and charity exemptions apply to the benefits in the same way.</p>
<p>So a family in Aberdeen and a family in Bristol with identical estates pay identical inheritance tax. Where they part company is in what each child keeps once the inherited pension is turned into cash.</p>

<h2>Scottish income tax on a pot inherited after 75</h2>
<p>When the member dies before ${N.deathAgeIncomeTax}, most lump sums and drawdown income paid to the heirs are free of income tax within the member's lump sum and death benefit allowance, and Scotland is no different. When the member dies at ${N.deathAgeIncomeTax} or later, ${h.src('gov_inherited_pension', 'GOV.UK explains')} that every lump sum, drawdown payment or annuity payment is taxed as the beneficiary's income, through PAYE, at the beneficiary's marginal rate. For a Scottish taxpayer, that marginal rate is set by the six Scottish bands rather than the three that apply in the rest of the UK.</p>
<p>The Finance Act 2026 adds a protection that applies across the UK. Under the ${h.src('fa2026_s70', 'new section 567B')} of the Income Tax (Earnings and Pensions) Act 2003, the inheritance tax borne on a death benefit is deducted from the taxable pension income, so income tax is charged only on what is left. The table shows the combined effect on a pound of pension that bears inheritance tax at the full ${h.pc(I.rate)}, for an heir whose other income puts that pound in each Scottish band.</p>
${h.table(['Scottish band', 'Total income, 2026/27', 'Income tax rate', 'With inheritance tax first'], rows, 'Scottish rates and thresholds for 2026/27 with the standard Personal Allowance; combined rate computed by the engine.', ['l', 'l', 'r', 'r'])}
<p>For comparison, the higher rate in England, Wales and Northern Ireland is ${h.pc(ruk[1].rate)} and the additional rate ${h.pc(ruk[2].rate)}, giving combined rates of ${h.pc(h.E.combinedRate(I.rate, ruk[1].rate), 1)} and ${h.pc(h.E.combinedRate(I.rate, ruk[2].rate), 1)}. The gap is widest in the middle: a Scottish heir with ${h.m(50000)} of other income already pays ${h.pc(at50s)} on the next pound, while an heir with the same income in England pays ${h.pc(at50e)}. Between ${h.m(IT.paTaperFrom)} and the top of the advanced band, the loss of the Personal Allowance pushes the Scottish marginal rate to ${h.pc(taperZone, 1)}.</p>

<h2>Two children, one pot, two tax systems</h2>
<p>A widowed parent dies at 80, after ${h.D.from}, leaving a ${h.m(400000)} home and ${h.m(100000)} of savings to two children equally, with a ${h.m(200000)} pot nominated half to each. The estate pays ${h.m(s1.after.iht)} in all, of which ${h.m(s1.after.ihtOnPension)} is attributable to the pension, because the tax is spread over everything chargeable at the estate's average rate. Each child bears ${h.m(s1.heirsAfter.ihtPensionShare)} of it on a ${h.m(100000)} share. One child lives and pays tax in Scotland, the other in England; both earn ${h.m(50000)}.</p>
${h.table(['Heir', 'Inheritance tax on the share', 'Income tax', 'Keeps from the share', 'Total tax rate'], cases, `Share of ${h.m(100000)} per child, own income ${h.m(50000)}, member died at 80. Computed by the engine.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Drawn in a single tax year, the Scottish child pays ${h.m(s1.heirsAfter.incomeTaxShare - e1.heirsAfter.incomeTaxShare)} more income tax than the English one on the same share. Spreading withdrawals over five years narrows the bill for both, since less of each year's slice reaches the higher bands, but the Scottish heir still pays more. The calculator above uses the Scottish rates by default; change the income, the inheritance tax rate on the share or the number of years to see your own figures, or switch to the rest of the UK.</p>

<h2>Starter and intermediate bands</h2>
<p>Not every Scottish heir pays more. The starter rate of ${h.pc(sc[0].rate)} sits below the UK basic rate, so an heir with little other income who draws a small inherited pot can pay slightly less income tax than in England on the first slice. The intermediate band at ${h.pc(sc[2].rate)} is one point above basic rate. The real difference opens at the Scottish higher rate of ${h.pc(sc[3].rate)}, which starts at a lower income than the higher rate elsewhere, and in the advanced and top bands above it.</p>

<h2>When Scottish rates apply before 75</h2>
<p>A death before ${N.deathAgeIncomeTax} does not always keep income tax away. Lump sums above the member's remaining lump sum and death benefit allowance of ${h.m(N.lsdba)}, less any tax-free cash taken in life, are taxed as the heir's income, and from April 2027 that test is made on the amount net of inheritance tax. A lump sum paid more than ${N.lumpSumPaidWithinYears} years after the provider learns of the death is taxable in full, whatever the member's age. In both cases a Scottish taxpayer pays at the Scottish bands. And where the whole estate sits within its bands, so no inheritance tax is due, the pension pound simply bears the heir's marginal rate, which is the third column of the table rather than the fourth.</p>

<h2>Confirmation instead of probate</h2>
<p>Executors in Scotland apply for confirmation rather than a grant of probate, but the inheritance tax steps are shared. ${h.src('gov_pay_iht', 'GOV.UK’s payment guidance')} says the tax is due by the end of the sixth month after the death, with interest after that, and that a payment is usually needed before confirmation can be obtained. From April 2027 the executors are also liable for the tax on the pension, alongside the beneficiaries, and can use the new withholding and payment notices that require the scheme administrator to hold back benefits or pay the tax straight from the pot. The ${h.a('who-pays-inheritance-tax-on-pensions', 'guide on who pays')} explains both.</p>

<h2>Pensions that stay outside in Scotland too</h2>
<p>The exclusions in section 150A are UK-wide. A dependants' scheme pension from a defined benefit scheme, a joint life annuity bought with the member's own annuity, and a death in service lump sum from the job the member held at death never enter the estate. A dependants' scheme pension is still taxed as the dependant's income, and for a Scottish taxpayer that means the Scottish bands. The ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions inherited after 75')} sets out the same calculation with the rates for England, Wales and Northern Ireland.</p>
<p>The figures here are examples computed with the 2026/27 rates; a pot drawn in later tax years is taxed at the Scottish rates and bands of those years. Whether you are a Scottish taxpayer, and how to time withdrawals from an inherited pot, are questions for a regulated adviser or the executors handling the estate.</p>
`;
  },
});
