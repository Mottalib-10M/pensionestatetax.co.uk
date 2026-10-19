import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

// Worked case shared by the citable block and the body: the defaults of the drawdown calculator.
const DRAW = 30000, OTHER = 15000;
const ufpls = (h: Helpers, draw: number, other: number, untouched: boolean, region: 'ruk' | 'scotland' = 'ruk') => {
  const free = untouched ? draw * h.P.pensions.taxFreeShare : 0;
  const tax = h.E.extraTax(draw - free, other, 1, region);
  return { free, tax, kept: draw - tax, marginal: h.E.marginalRate(other + draw - free, region) };
};

export default definePage({
  id: 'pension-drawdown-tax',
  group: 'income',
  order: 210,
  tool: { kind: 'mini:drawdown' },
  related: ['cashing-in-pension-tax', 'pension-tax-free-lump-sum', 'annuity-calculator', 'inheritance-tax-on-pensions-after-75'],
  sources: ['gov_tax_on_pension', 'gov_ootlar', 'gov_scottish_it', 'gov_tech_note'],
  slug: 'pension-drawdown-tax',
  nav: 'Pension drawdown tax',
  card: 'Income tax on one withdrawal, the tax-free quarter of an untouched pot and the rate on the next pound.',
  title: 'Pension Drawdown Calculator 2026/27: Tax on a Withdrawal',
  description: 'Pension drawdown calculator for 2026/27: income tax on a withdrawal, the tax-free quarter of an untouched pot, your marginal rate after it and the 60 % zone.',
  h1: 'Pension drawdown calculator: the tax on one withdrawal',
  intro: 'Type the amount you plan to take this tax year and your other income. The calculator gives the tax, what reaches your account and the rate on the next pound.',
  resume: (h) => {
    const N = h.P.pensions, it = h.P.incomeTax;
    const a = ufpls(h, DRAW, OTHER, true), b = ufpls(h, DRAW, OTHER, false);
    return `A pension withdrawal is added to everything else you receive in the same tax year, ${h.P.taxYearLong}, and taxed at your own income tax rates. When the pot has never been touched, each withdrawal taken as an uncrystallised funds pension lump sum is ${h.pc(N.taxFreeShare)} tax free and the remaining three quarters is income. Someone with ${h.m(OTHER)} of other income who takes ${h.m(DRAW)} this way pays ${h.m(a.tax)} of income tax and keeps ${h.m(a.kept)}. If the tax-free cash was already taken and the same ${h.m(DRAW)} comes out of a drawdown fund, all of it is taxable: the bill rises to ${h.m(b.tax)}. After the first withdrawal the next pound is taxed at ${h.pc(a.marginal)}. Above ${h.m(it.paTaperFrom)} of total income the Personal Allowance shrinks, so a withdrawal that lands between ${h.m(it.paTaperFrom)} and ${h.m(it.paTaperFrom + 2 * it.personalAllowance)} is taxed at ${h.pc(h.E.marginalRate(it.paTaperFrom + 5000))} on that slice. Tax-free cash is capped at ${h.m(N.lumpSumAllowance)} over a lifetime unless a protection applies.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    return [
      { q: 'Why did my first drawdown payment have so much tax taken off?', a: `A provider paying a pension for the first time often has no current tax code for it and uses an emergency code instead. The first payment can then be taxed more heavily than the year's real liability. That is a question of timing rather than an extra tax: the excess is repaid later, once the correct code is in place or after a claim. The calculator works on the whole tax year, which is the tax finally due.` },
      { q: 'Is a quarter of every drawdown payment tax free?', a: `Only when the money comes straight out of a pot that has not been touched, as an uncrystallised funds pension lump sum. Then ${h.pc(N.taxFreeShare)} of each payment is tax free and the rest is income. If the tax-free cash was taken in one go when drawdown started, later income from that fund is taxable in full. Set the calculator's switch to match the way the pot is held.` },
      { q: 'Does a withdrawal change how much inheritance tax my family pays?', a: `For deaths from ${h.D.from}, unused pension money counts in the estate, so money drawn and spent is no longer there to be taxed, while money drawn and saved in a bank account stays in the estate anyway. Whether gifts funded by pension withdrawals escape as normal expenditure out of income depends on the facts of each case, according to HMRC. A regulated adviser looks at the whole picture for a real plan.` },
      { q: 'Is there a lifetime cap on tax-free cash from my pensions?', a: `Yes. The tax-free part of all your lump sums together is limited by the lump sum allowance of ${h.m(N.lumpSumAllowance)}, unless you hold a protection from earlier rules. Once it is used, later withdrawals are taxable in full even from a pot never touched before. The calculator assumes the allowance is still available; anyone close to the cap gets a lower tax-free figure in reality.` },
    ];
  },
  body: (h) => {
    const N = h.P.pensions, it = h.P.incomeTax;
    const others = [0, 15000, 40000, 60000, 90000];
    const rows = others.map((o) => { const r = ufpls(h, 20000, o, true); return [h.m(o), h.m(r.free), h.m(r.tax), h.m(r.kept), h.pc(r.marginal, 0)]; });
    const top = it.paTaperFrom + 2 * it.personalAllowance;
    const big = ufpls(h, 20000, it.paTaperFrom - 5000, false);
    const scot = ufpls(h, DRAW, OTHER, true, 'scotland');
    const eng = ufpls(h, DRAW, OTHER, true);
    return `
<h2>What the tool needs from you</h2>
<p>Three figures matter: the amount you plan to take before the tax year ends, the income you will have anyway (salary, State Pension, rent, another pension), and whether the pot has been touched. The last question decides the tax-free part. GOV.UK's page on ${h.src('gov_tax_on_pension', 'tax when you get a pension')} explains that you can usually take up to ${h.pc(N.taxFreeShare)} of a pot tax free, with the rest taxed as income, and gives the example of a ${h.m(60000)} pot of which ${h.m(15000)} is free. Once the tax-free cash has been taken, every pound of drawdown income is taxable.</p>

<h2>One ${h.m(20000)} withdrawal at five income levels</h2>
<p>The same withdrawal from an untouched pot costs very different amounts depending on what else you earn. The table holds the withdrawal still and moves the other income.</p>
${h.table(['Other income', 'Tax free', 'Income tax', 'You keep', 'Rate on the next pound'], rows, 'Withdrawal of £20,000 from an untouched pot, England, Wales and Northern Ireland, 2026/27 rates. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>With no other income, most of the taxable part falls inside the Personal Allowance of ${h.m(it.personalAllowance)}. With a salary in the higher rate band, the same payment loses a far larger share. The last column is the cost of the next pound drawn.</p>

<h2>The band where the next pound costs ${h.pc(h.E.marginalRate(it.paTaperFrom + 5000))}</h2>
<p>The Personal Allowance is reduced by ${h.m(1)} for every ${h.m(2)} of income above ${h.m(it.paTaperFrom)}, so it has gone completely at ${h.m(top)}. In that stretch each extra pound is taxed at the higher rate and also removes fifty pence of allowance, which is then taxed too. The ${h.src('gov_ootlar', 'rates published with the Budget')} set these limits for ${h.P.taxYear}. Someone already on ${h.m(it.paTaperFrom - 5000)} who draws ${h.m(20000)} of taxable income pays ${h.m(big.tax)} on it, an average of ${h.pc(big.tax / 20000, 1)}. Splitting a large withdrawal across the end of one tax year and the start of the next is one way people keep below the band; the tool shows the effect when you lower the amount.</p>

<h2>Scottish taxpayers</h2>
<p>Pension income of a Scottish taxpayer is taxed at the ${h.src('gov_scottish_it', 'Scottish rates')}, which have six bands. For the default case of ${h.m(DRAW)} drawn on top of ${h.m(OTHER)}, the bill is ${h.m(scot.tax)} in Scotland against ${h.m(eng.tax)} elsewhere in the UK.</p>

<h2>The first payment can be over-taxed</h2>
<p>When a provider makes a first payment without a current tax code, it may use an emergency code, and that first payment can be taxed more than it will finally owe. The excess is repaid later. The calculator works on the whole tax year, so its figure is the tax finally owed, not the amount deducted from the first payment.</p>

<h2>What is left in drawdown after death</h2>
<p>Money not drawn stays in the pot, and for deaths from ${h.D.from} it is part of the estate for inheritance tax. If the member dies at ${N.deathAgeIncomeTax} or over, whoever inherits also pays income tax on what they draw, after a deduction for the inheritance tax borne. HMRC's ${h.src('gov_tech_note', 'technical note')} says the reform does not change the existing position on gifts out of income, and that gifts funded by withdrawals are judged on their facts. Drawing now against leaving money invested is compared on the ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions inherited after 75')} and, for a whole pot, on the ${h.a('cashing-in-pension-tax', 'cashing in page')}. None of this is advice on your own withdrawals; a regulated financial adviser checks a real plan.</p>
`;
  },
});
