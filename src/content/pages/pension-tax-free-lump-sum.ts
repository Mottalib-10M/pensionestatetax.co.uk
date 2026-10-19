import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** A single parent: home to two children, savings, a £400,000 pot left whole or with a quarter taken and kept as cash. */
const POT = 400000;
const compare = (h: Helpers, age: number, heirIncome = 45000) => {
  const cash = h.E.lumpSum({ pot: POT, other: 30000, take: POT }).taxFree;
  const heir = { age, heirIncome, years: 4 };
  const base = { home: 350000, status: 'single' as const, homeToDescendants: true, heirs: 2 };
  return {
    cash,
    whole: h.run({ ...base, savings: 100000, pension: POT }, heir),
    taken: h.run({ ...base, savings: 100000 + cash, pension: POT - cash }, { ...heir, taxFreeTaken: cash }),
  };
};

export default definePage({
  id: 'pension-tax-free-lump-sum',
  group: 'income',
  order: 200,
  mini: { kind: 'mini:lump-sum', props: { pot: 400000, used: 0, other: 30000 } },
  related: ['cashing-in-pension-tax', 'pension-drawdown-tax', 'inheritance-tax-on-pensions-after-75', 'pension-or-isa-inheritance-tax'],
  sources: ['gov_tax_on_pension', 'gov_ootlar', 'gov_inherited_pension', 'fa2026_s66'],
  slug: 'pension-tax-free-lump-sum',
  nav: 'Tax-free lump sum',
  card: 'A quarter of the pot up to the lump sum allowance, the special cases, and what the cash does to the estate after 2027.',
  title: 'Pension Tax Free Lump Sum 2026/27: 25% and the £268,275 Cap',
  description: 'Pension tax free lump sum in 2026/27: 25% of the pot up to the £268,275 allowance, small pots and ill health, and why the cash still counts in the estate.',
  h1: 'The pension tax-free lump sum: a quarter of the pot, and where the cash goes next',
  intro: 'Most people can take part of a pension without income tax, usually from 55. The cash is tax free when it comes out, but it does not leave the estate, and from 2027 that changes the sums for the family.',
  resume: (h) => {
    const N = h.P.pensions;
    const g = h.E.lumpSum({ pot: 60000, other: 0, take: 60000 });
    const old = compare(h, 80);
    return `Most people can take up to ${h.pc(N.taxFreeShare)} of a pension pot without income tax, usually from 55, and the rest is taxed as income when it is drawn. The tax-free cash is capped by the lump sum allowance of ${h.m(N.lumpSumAllowance)} across all of a person's pensions, unless they hold a protection, so the cap only bites on pots above ${h.m(N.lumpSumAllowance / N.taxFreeShare)}. GOV.UK's example is a pot of ${h.m(60000)}: ${h.m(g.taxFree)} comes out tax free and income tax is due on the other ${h.m(g.taxable)}. Taking the lump sum does not remove money from the estate: kept as cash, it is counted like any other savings, and from ${h.D.from} the pot it came from counts too. What changes is the income tax for heirs. On the engine, a single parent with a ${h.m(POT)} pot who dies at 80 leaves two children ${h.m(old.whole.heirsAfter.total * 2)} if the pot is untouched and ${h.m(old.taken.heirsAfter.total * 2)} if ${h.m(old.cash)} was taken tax free and saved, with the same inheritance tax of ${h.m(old.whole.after.iht)} either way.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    const young = compare(h, 70);
    return [
      { q: 'Is the tax-free lump sum taxed again when my children inherit it?', a: `Not with income tax. Once taken, the cash is ordinary savings, so heirs receive it without the income tax that applies to a pension inherited from someone who died at 75 or over. It does count in the estate for inheritance tax, at ${h.pc(h.P.iht.rate)} above the bands, exactly as it would have inside the pension for a death from ${h.D.from}.` },
      { q: 'Does taking my 25 % tax-free cash reduce inheritance tax on my pension?', a: `Not by itself. The cash moves from the pension into the estate's savings, and from ${h.D.from} both count for inheritance tax, so the total is the same. On the engine, a ${h.m(POT)} pot with or without ${h.m(young.cash)} taken out gives the same bill of ${h.m(young.whole.after.iht)} on a death at 70. Only spending or giving the money changes the estate.` },
      { q: 'Can I take the tax-free cash and leave the rest of my pension invested?', a: `GOV.UK describes taking up to a quarter as a tax-free lump sum and leaving the remainder in the pension to draw later as taxable income, for example through drawdown or an annuity. Each payment from the remaining pot is then taxed as income in the year it is taken. The options a particular scheme offers depend on its own rules.` },
      { q: 'What if I am seriously ill and not expected to live a year?', a: `GOV.UK says that someone under 75 with less than a year to live can usually take the whole pot as a tax-free lump sum, within their lump sum and death benefit allowance of ${h.m(N.lsdba)}. The money then sits in the estate as cash, and for deaths from ${h.D.from} it would have counted as part of the estate inside the pension too.` },
      { q: 'Does taking the lump sum before 75 help my children with income tax later?', a: `This page does not recommend either choice. The engine shows the mechanism: for deaths at 75 or over, cash taken tax free in life reaches heirs without their income tax, while a pot left whole is taxed as their income. For deaths before 75 the pot is usually tax free for heirs anyway. Charges, growth and the member's own needs are left out, and a regulated adviser looks at a real case.` },
    ];
  },
  body: (h) => {
    const N = h.P.pensions;
    const g = h.E.lumpSum({ pot: 60000, other: 20000, take: 60000 });
    const big = h.E.lumpSum({ pot: 1500000, other: 30000, take: 1500000 });
    const sc = h.E.lumpSum({ pot: 60000, other: 20000, take: 60000, region: 'scotland' });
    const modest = compare(h, 80, 5000);
    const young = compare(h, 70), old = compare(h, 80);
    const row = (label: string, a: number, b: number) => [label, h.m(a), h.m(b)];
    return `
<h2>A quarter, up to the lump sum allowance</h2>
<p>The rule in ${h.src('gov_tax_on_pension', 'GOV.UK\'s guide to tax on a pension')} is simple to state. Up to ${h.pc(N.taxFreeShare)} of a pot can usually be taken without income tax, normally from 55. The remainder is taxable income when it comes out, whether as drawdown, an annuity or a further lump sum. The ceiling on tax-free cash is the lump sum allowance, ${h.m(N.lumpSumAllowance)} for most people according to the ${h.src('gov_ootlar', 'Budget 2025 rates and allowances')}. It is a lifetime total across every pension, not a figure per pot.</p>
<p>For most savers the cap is academic. A quarter of a pot only exceeds the allowance once the pot is above ${h.m(N.lumpSumAllowance / N.taxFreeShare)}. On a ${h.m(1500000)} pot, for instance, a quarter would be ${h.m(1500000 * N.taxFreeShare)}, but the engine limits the tax-free part to ${h.m(big.taxFree)}; the rest of the quarter would be taxed as income. People with older protections may have a higher personal figure, which the scheme confirms.</p>

<h2>GOV.UK's £60,000 example</h2>
<p>GOV.UK illustrates the split with a pot of ${h.m(60000)} taken in full. A quarter, ${h.m(g.taxFree)}, is tax free; income tax is due on the other ${h.m(g.taxable)}. How much depends on the rest of the person's income that year. With ${h.m(20000)} of other income in England, Wales or Northern Ireland, the engine puts the extra tax at ${h.m(g.tax)}, leaving ${h.m(g.net)} in hand, because a taxable ${h.m(g.taxable)} on top of a modest income runs well into the higher rate. Spreading the taxable part over several tax years usually costs less, which the ${h.a('cashing-in-pension-tax', 'page on cashing in a pension')} works through. In Scotland, where income tax has its own bands, the same withdrawal on the same other income costs ${h.m(sc.tax)}, so the tax-free quarter is worth the same everywhere but the taxable part is not.</p>

<h2>Small pots, trivial commutation and serious ill health</h2>
<p>A few routes work differently. Small pots of up to £10,000 can be taken in one go, up to three times from personal pensions and without a limit on the number from workplace schemes; a quarter is tax free and the rest is taxed as income. Where all of a person's pensions add up to £30,000 or less, trivial commutation lets them take the lot as a lump sum, a route often used with small defined benefit pensions. And for someone under 75 who is not expected to live more than a year, GOV.UK says the whole pot can usually be paid tax free, within the lump sum and death benefit allowance of ${h.m(N.lsdba)}. In each case the cash that comes out is the person's money from then on, which is what matters for the rest of this page.</p>

<h2>Taking the cash does not take it out of the estate</h2>
<p>A frequent assumption is that drawing the tax-free lump sum puts money beyond the reach of inheritance tax. If anything, the opposite was true. Before ${h.D.from} a pension paid at the scheme's discretion was usually outside the estate, so moving cash out of it into a bank account brought that money into the estate. From that date, under ${h.src('fa2026_s66', 'section 66 of the Finance Act 2026')}, the pot itself counts. Either way, cash in an account counts in full. Only what is spent or given away, subject to the gift rules, leaves the estate.</p>
<p>What the lump sum does change is the income tax heirs pay. ${h.src('gov_inherited_pension', 'GOV.UK\'s page on inherited pensions')} sets out the age rule: when the member dies under 75, most lump sums and drawdown paid to beneficiaries are free of income tax within the member's allowance; when the member dies at 75 or over, everything the heirs draw is taxed as their income. Cash already taken tax free during life has no such second charge.</p>

<h2>The same pot left whole or with a quarter taken and saved</h2>
<p>The engine compares one estate in two versions: a single parent with a ${h.m(350000)} home left to two children, ${h.m(100000)} of savings and a ${h.m(POT)} pension. In one version the pension is never touched. In the other, the parent takes ${h.m(young.cash)} tax free and keeps it on deposit. Each child earns ${h.m(45000)} and draws an inherited pension over four tax years. Growth, charges and spending are ignored, so the only difference is where the money sits.</p>
${h.table(['Death at 70', 'Pot left whole', 'Quarter taken and saved'], [
  row('Inheritance tax', young.whole.after.iht, young.taken.after.iht),
  row('Income tax paid by the children', young.whole.heirsAfter.totalIncomeTax, young.taken.heirsAfter.totalIncomeTax),
  row('The two children keep', young.whole.heirsAfter.total * 2, young.taken.heirsAfter.total * 2),
], 'Death after April 2027 under 75. Home £350,000 to two children, savings £100,000, pension £400,000. Engine figures.', ['l', 'r', 'r'])}
${h.table(['Death at 80', 'Pot left whole', 'Quarter taken and saved'], [
  row('Inheritance tax', old.whole.after.iht, old.taken.after.iht),
  row('Income tax paid by the children', old.whole.heirsAfter.totalIncomeTax, old.taken.heirsAfter.totalIncomeTax),
  row('The two children keep', old.whole.heirsAfter.total * 2, old.taken.heirsAfter.total * 2),
], 'Same estate, death at 80 after April 2027. Engine figures.', ['l', 'r', 'r'])}
<p>The inheritance tax line is identical in both tables: the estate is the same size whichever pocket the money is in. At 70 the children's income tax is also the same, nil, because lump sums from a member who died under 75 are tax free within the allowance, and the ${h.m(young.cash)} taken in life still leaves plenty of it. At 80 the picture moves. The untouched pot is taxed as the children's income after the inheritance tax borne on it, and the ${h.m(old.cash)} that was taken earlier is not, so the children keep ${h.m(old.taken.heirsAfter.total * 2 - old.whole.heirsAfter.total * 2)} more between them.</p>
<p>The size of that gap depends on the children's own tax position as much as on the parent's choice. Run again with each child having only ${h.m(5000)} of other income instead of ${h.m(45000)}, the engine finds a difference of ${h.m(modest.taken.heirsAfter.total * 2 - modest.whole.heirsAfter.total * 2)}: the inherited pension then falls mostly in the basic rate band, so there is less income tax to avoid. A child already earning well, by contrast, pays the higher rate on almost every pound drawn. Heirs who draw the pension over more years narrow it further, for the same reason. The comparison is therefore a measure of one family's tax rates, not a general rule about lump sums.</p>

<h2>What the comparison leaves out</h2>
<p>The difference at 80 is real but it is not the whole story, and the site does not recommend taking a lump sum for it. Money left invested in a pension and cash on deposit will not grow at the same rate, and the engine assumes neither grows. Cash can be spent, which is a benefit for the member and a cost to the estate. A lump sum taken before 75 reduces what remains of the lump sum and death benefit allowance for the heirs, which matters only for large pots. And the member does not know at what age they will die, which is the one input that decides the outcome. The ${h.a('inheritance-tax-on-pensions-after-75', 'guide to pensions after 75')} explains the combined tax on an inherited pot; the ${h.a('pension-or-isa-inheritance-tax', 'pension or ISA page')} compares where savings sit. A regulated financial adviser is the person who checks a decision about a real pension.</p>
`;
  },
});
