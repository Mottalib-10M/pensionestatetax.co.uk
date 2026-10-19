import { definePage } from '../../lib/guide-types';

// Example only: a rate typed in to show the arithmetic, never a market rate (CONTRIBUTING-FAITS.md).
const POT = 150000, RATE = 0.07, OTHER = 12000;

export default definePage({
  id: 'annuity-calculator',
  group: 'income',
  order: 230,
  tool: { kind: 'mini:annuity' },
  related: ['pension-drawdown-tax', 'pension-death-benefits-excluded', 'pension-left-to-spouse-inheritance-tax', 'pension-tax-free-lump-sum'],
  sources: ['gov_tax_on_pension', 'fa2026_s66', 'gov_inherited_pension', 'gov_tech_note'],
  slug: 'annuity-calculator',
  nav: 'Annuity calculator',
  card: 'Monthly income after tax from the rate on your own annuity quote, and what happens to it at death.',
  title: 'Annuity Calculator 2026/27: Income After Tax From a Quote',
  description: 'Annuity calculator for 2026/27: enter the rate from your own quote and get the yearly and monthly income after tax, with or without tax-free cash taken first.',
  h1: 'Annuity calculator: your quote turned into income after tax',
  intro: 'This tool does not guess annuity rates. Copy the rate from a quote you have received, add your other income, and see what arrives each month.',
  resume: (h) => {
    const N = h.P.pensions;
    const a = h.E.annuity({ pot: POT, rate: RATE, other: OTHER, taxFreeFirst: true });
    const b = h.E.annuity({ pot: POT, rate: RATE, other: OTHER, taxFreeFirst: false });
    return `An annuity turns a pension pot into a regular income, and the price of that income is the rate an insurer quotes: the yearly payment for each ${h.m(100)} of pot. Rates depend on age, health, the options chosen and the date of the quote, so this site publishes none; the calculator uses whatever rate you type. The income is taxed as pension income at your marginal rates for ${h.P.taxYear}. One option is to take ${h.pc(N.taxFreeShare)} of the pot as tax-free cash first, within the lump sum allowance of ${h.m(N.lumpSumAllowance)}, and the annuity is then bought with the rest. As an illustration only, a ${h.m(POT)} pot at a typed rate of ${h.pc(RATE)}, with ${h.m(OTHER)} of other income, gives ${h.m(a.cash)} of cash, then ${h.m(a.income)} a year before tax and ${h.m(a.monthly)} a month after ${h.m(a.tax)} of income tax. Using the whole pot for the annuity raises the gross income to ${h.m(b.income)} and the monthly figure to ${h.m(b.monthly)}, with no cash up front. At death, a joint life annuity bought together with your own is outside inheritance tax.`;
  },
  faqs: (h) => [
    { q: 'Where do I find the annuity rate to type in?', a: `On the quote itself: insurers show the yearly income they will pay for the pot you offer, and dividing it by the pot gives the rate. Quotes change with age, health and the options picked, such as cover for a partner. This site has no rate table on purpose, because a published rate would be out of date within weeks. Comparing several quotes is what the calculator is for.` },
    { q: 'Is annuity income taxed like a salary?', a: `It is taxed as income at the same rates, added to anything else you receive in the tax year: wages, the State Pension, rent or another pension. The calculator adds the annuity on top of your other income and prices only the extra tax it causes, so the monthly figure it shows is what the annuity itself adds to your budget once that tax has been taken off.` },
    { q: 'What does taking the tax-free cash first do to my annuity income?', a: `It lowers the income, because a smaller pot buys the annuity, but the cash itself comes to you free of tax. On the illustration above, with the typed rate of ${h.pc(RATE)}, the monthly income after tax is ${h.m(h.E.annuity({ pot: POT, rate: RATE, other: OTHER, taxFreeFirst: true }).monthly)} with the cash taken first and ${h.m(h.E.annuity({ pot: POT, rate: RATE, other: OTHER, taxFreeFirst: false }).monthly)} without it. What the cash would be used for usually decides between the two.` },
  ],
  body: (h) => {
    const N = h.P.pensions;
    const others = [0, 12000, 25000, 45000, 60000];
    const rows = others.map((o) => { const a = h.E.annuity({ pot: POT, rate: RATE, other: o, taxFreeFirst: true }); return [h.m(o), h.m(a.income), h.m(a.tax), h.m(a.income - a.tax), h.m(a.monthly)]; });
    return `
<h2>Turning a quote into the figure that matters</h2>
<p>An annuity quote states a gross yearly income. What changes your budget is the amount left once income tax has come off, which depends on everything else you receive. The calculator needs four inputs: the pot you plan to use, the rate on the quote, your other yearly income (the State Pension, a part-time salary, rent), and whether you take the tax-free cash before buying. It then works out the tax that the annuity adds at ${h.P.taxYear} rates, as set out in GOV.UK's guide to ${h.src('gov_tax_on_pension', 'tax when you get a pension')}.</p>

<h2>The same annuity at five levels of other income</h2>
<p>The table keeps the pot at ${h.m(POT)} and the typed rate at ${h.pc(RATE)}, with the tax-free cash taken first. The rate is an example chosen to show the arithmetic, not a market figure.</p>
${h.table(['Other income', 'Annuity a year', 'Extra income tax', 'Net a year', 'Net a month'], rows, 'Pot £150,000, example rate 7 % typed by the reader, quarter taken tax free first, 2026/27 rates outside Scotland. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>With no other income, part of the annuity is covered by the Personal Allowance of ${h.m(h.P.incomeTax.personalAllowance)}. When other income already uses the allowance, every pound of annuity is taxed at the basic rate or more. Someone receiving a salary as well may see a far smaller net figure than the gross quote suggests.</p>

<h2>Cash first, or the whole pot as income</h2>
<p>Taking the tax-free part reduces the pot that buys the annuity, so the yearly income is lower, but the cash itself is not taxed. Using the whole pot gives a larger annuity, all of it taxable. Which suits a household depends on what the cash is for and on the tax band the income falls in. The calculator's last switch shows both, and the ${h.a('pension-tax-free-lump-sum', 'tax-free lump sum page')} covers the cap.</p>

<h2>When the annuitant dies</h2>
<p>What happens to the payments depends entirely on the contract chosen at purchase, so the first step is to ask the provider what would be paid after death, for how long and to whom. On the inheritance tax side, ${h.src('fa2026_s66', 'section 150A(6) of the Inheritance Tax Act')} lists excluded benefits, and one of them is a dependant's or nominee's annuity bought together with the member's own lifetime annuity. A joint life annuity of that kind is not part of the estate for deaths from ${h.D.from}, when unused pension money otherwise joins it.</p>
<p>The income tax on what a survivor receives follows the age of the member at death. ${h.src('gov_inherited_pension', 'GOV.UK')} explains that annuity payments to a beneficiary are usually tax free when the member died under ${N.deathAgeIncomeTax}, and taxed as the beneficiary's income at ${N.deathAgeIncomeTax} or over. HMRC's ${h.src('gov_tech_note', 'technical note')} adds a practical point for executors: once pension funds have been used to buy an annuity from an insurer, they are no longer available to pay inheritance tax under a payment notice.</p>
<p>The ${h.a('pension-death-benefits-excluded', 'excluded benefits guide')} lists what else stays out of the estate, and the ${h.a('pension-drawdown-tax', 'drawdown calculator')} prices the alternative of keeping the pot invested and drawing from it. This page gives figures, not a recommendation: a regulated financial adviser looks at annuity options for a real case.</p>
`;
  },
});
