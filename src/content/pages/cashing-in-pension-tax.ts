import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

// Same assumptions as the cashin calculator: tax-free part taken once, taxable rest spread evenly.
const OTHER = 20000;
const cash = (h: Helpers, pot: number, years: number) => {
  const N = h.P.pensions;
  const free = Math.min(pot * N.taxFreeShare, N.lumpSumAllowance);
  return { free, tax: h.E.extraTax(pot - free, OTHER, years) };
};

export default definePage({
  id: 'cashing-in-pension-tax',
  group: 'income',
  order: 220,
  tool: { kind: 'mini:cashin' },
  related: ['pension-drawdown-tax', 'pension-tax-free-lump-sum', 'pension-or-isa-inheritance-tax', 'inheritance-tax-on-pensions'],
  sources: ['gov_tax_on_pension', 'gov_ootlar', 'gov_inherited_pension'],
  slug: 'cashing-in-pension-tax',
  nav: 'Cashing in a pension',
  card: 'The tax on emptying a pot in one tax year, against the same pot taken over three or five years.',
  title: 'Tax on Pension Withdrawal 2026/27: Cashing In a Whole Pot',
  description: 'How much tax on a pension withdrawal that empties the pot in 2026/27: one tax year against several, by pot size, with the tax-free quarter and the cap on it.',
  h1: 'Cashing in a pension: the tax in one year or spread out',
  intro: 'Emptying a pot in a single tax year stacks all of it on top of your other income. Spreading it changes the bill, often by thousands of pounds.',
  resume: (h) => {
    const N = h.P.pensions;
    const once = cash(h, 100000, 1), three = cash(h, 100000, 3);
    return `Taking a whole pension pot as cash is taxed like a very large pay rise for one year. ${h.pc(N.taxFreeShare)} of the pot is normally tax free, up to the lump sum allowance of ${h.m(N.lumpSumAllowance)}, and the rest is added to your income for the tax year in which it is paid. Because UK income tax is banded, the same money costs less when it is spread across several years and each slice stays in a lower band. With ${h.m(OTHER)} of other income, cashing in a ${h.m(100000)} pot in ${h.P.taxYear} leaves ${h.m(once.free)} tax free and costs ${h.m(once.tax)} of income tax on the rest. Taking the taxable part in three equal yearly instalments, with the same other income each year, costs ${h.m(three.tax)}, a saving of ${h.m(once.tax - three.tax)}. The difference grows with the pot, because a single year pushes more of it into the higher rate and, above ${h.m(h.P.incomeTax.paTaperFrom)}, into the band where the Personal Allowance is withdrawn.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    return [
      { q: 'Is it worth emptying my pension to avoid inheritance tax from 2027?', a: `It depends on figures only you and an adviser can see. Emptying a pot brings income tax now, at your rates, on three quarters of it. Leaving it means it counts in your estate for deaths from ${h.D.from}, and heirs may pay income tax too if you die at ${N.deathAgeIncomeTax} or over. Cash taken out and kept in the bank stays in the estate. A regulated financial adviser compares both routes on a real case.` },
      { q: 'Is the tax on a cashed-in pot higher in Scotland?', a: `Often a little, because Scottish taxpayers pay the Scottish rates on pension income, with an intermediate band and a higher rate above the UK one. On a ${h.m(100000)} pot cashed in one year on top of ${h.m(OTHER)} of other income, the engine gives ${h.m(h.E.extraTax(100000 - cash(h, 100000, 1).free, OTHER, 1, 'scotland'))} in Scotland against ${h.m(cash(h, 100000, 1).tax)} elsewhere. The calculator on this page uses the rates for England, Wales and Northern Ireland.` },
      { q: 'What if my pot is worth more than four times the lump sum allowance?', a: `Then the tax-free part stops at the allowance of ${h.m(N.lumpSumAllowance)} rather than a quarter of the pot, and everything above that is taxable. In the calculator the tax-free line stays flat once the pot passes ${h.m(N.lumpSumAllowance / N.taxFreeShare)}. Lump sums already taken in earlier years use part of the same allowance, so the real tax-free figure can be lower.` },
    ];
  },
  body: (h) => {
    const N = h.P.pensions;
    const pots = [30000, 60000, 100000, 200000, 400000];
    const rows = pots.map((p) => { const a = cash(h, p, 1), b = cash(h, p, 3), c = cash(h, p, 5); return [h.m(p), h.m(a.free), h.m(a.tax), h.m(b.tax), h.m(c.tax)]; });
    const big = cash(h, 400000, 1);
    return `
<h2>Why one tax year costs more</h2>
<p>Income tax is charged band by band on everything received between 6 April and the following 5 April. A pot cashed in one go lands entirely in one of those years. The first slices may still be taxed at the basic rate, but the rest climbs into the higher rate and, for a large pot, into the stretch above ${h.m(h.P.incomeTax.paTaperFrom)} where the Personal Allowance is clawed back. Spread over three or five years, the same taxable amount fills the lower bands of each year in turn. The bands used by the calculator are the ${h.src('gov_ootlar', 'rates and allowances')} of ${h.P.taxYear}, applied to every year of the spread.</p>

<h2>Tax on pots of five sizes</h2>
<p>The table cashes in each pot with ${h.m(OTHER)} of other income every year, a figure chosen only as an example. The tax-free part is taken once; the taxable rest is either drawn in one tax year or split evenly.</p>
${h.table(['Pot', 'Tax free', 'Tax, one year', 'Tax, over 3 years', 'Tax, over 5 years'], rows, 'Other income £20,000 a year, England, Wales and Northern Ireland, 2026/27 bands. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>On the smallest pot the saving is modest, because most of it fits inside the basic rate band of a single year. On the largest, the one-year bill of ${h.m(big.tax)} falls sharply once the taxable part is shared across years. The figures assume the other income stays the same; a salary that stops, or a State Pension that starts, changes them, and you can type your own values into the tool.</p>

<h2>The tax-free part has a ceiling</h2>
<p>GOV.UK's guide to ${h.src('gov_tax_on_pension', 'tax when you get a pension')} says you can usually take up to a quarter of a pot tax free. Across all your pensions that is capped at ${h.m(N.lumpSumAllowance)}, unless you hold a protection. A person with several pots who took tax-free cash from one of them years ago has less of the allowance left for the next.</p>

<h2>Special cases</h2>
<p>Very small pots and very small total pension savings have their own rules for taking everything at once, which GOV.UK sets out. Someone under ${N.deathAgeIncomeTax} who is expected to live less than a year can usually take the whole pot tax free, within the lump sum and death benefit allowance of ${h.m(N.lsdba)}. The calculator does not apply either rule.</p>

<h2>Leaving the pot instead</h2>
<p>From ${h.D.from}, a pot left untouched joins the estate for inheritance tax. On a death at ${N.deathAgeIncomeTax} or over, the people who inherit it also pay income tax, as ${h.src('gov_inherited_pension', 'GOV.UK explains for inherited pensions')}, after a deduction for the inheritance tax they bore. Cashing in swaps those future taxes for income tax now, and the cash then sits in the estate unless it is spent or given away. The ${h.a('pension-or-isa-inheritance-tax', 'comparison of a pension and an ISA')} works through one pound left in each, and the ${h.a('pension-drawdown-tax', 'drawdown calculator')} prices a single withdrawal. The choice depends on age, health, other assets and who inherits; nothing here replaces a regulated adviser's look at your own case.</p>
`;
  },
});
