import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** A grandmother giving £500 a month for ten years: estate at death with the money kept or given. */
const MONTH = 500, YEARS = 10;
const grandmother = (h: Helpers, extraSavings: number, gifts = 0, giftYears = 0) => h.E.estate({
  home: 450000, savings: 250000 + extraSavings, pension: 200000, status: 'single', homeToDescendants: true, gifts, giftYears,
}, 'after');

export default definePage({
  id: 'gifts-from-income-inheritance-tax',
  group: 'gifts',
  order: 180,
  mini: { kind: 'mini:income-gifts', props: { month: 500, years: 10 } },
  related: ['inheritance-tax-gift-allowances', 'seven-year-rule-inheritance-tax', 'pension-drawdown-tax', 'home'],
  sources: ['gov_iht_gifts', 'gov_tech_note', 'gov_tax_on_pension'],
  slug: 'gifts-from-income-inheritance-tax',
  nav: 'Gifts from surplus income',
  card: 'The exemption with no cap: the three conditions, GOV.UK’s examples, and the open question of pension withdrawals.',
  title: 'Gifts From Income and Inheritance Tax 2026/27: Three Tests',
  description: 'Gifts from income and inheritance tax in 2026/27: the three conditions, GOV.UK’s examples, records for executors and HMRC’s view of gifts from pension drawdown.',
  h1: 'Gifts from surplus income: the inheritance tax exemption without a ceiling',
  intro: 'Most exemptions for gifts are small fixed sums. One is open ended: regular giving out of income that leaves the giver’s own standard of living untouched. It is also the one that depends most on evidence.',
  resume: (h) => {
    const I = h.P.iht;
    const kept = grandmother(h, MONTH * 12 * YEARS), given = grandmother(h, 0);
    return `Gifts that are part of a person's normal expenditure out of income are exempt from inheritance tax with no upper limit, unlike the ${h.m(I.annualExemption)} annual exemption. GOV.UK sets three conditions: the gifts are regular, they are paid from income rather than savings or capital, and the giver can still afford their usual living costs afterwards. Its own examples are a child's rent, payments into a savings account for a child under 18, support for an elderly relative, and ${h.m(60)} a month to a child. Qualifying gifts leave the estate at once, with no seven year wait. On the engine, a grandmother with a ${h.m(450000)} home, savings and a ${h.m(200000)} pension who gives ${h.m(MONTH)} a month for ${YEARS} years leaves an estate that pays ${h.m(given.iht)} at a death after ${h.D.from}, against ${h.m(kept.iht)} had the money stayed in her account. For gifts funded by pension withdrawals, HMRC says the April 2027 changes leave the position as it was: each case turns on its facts.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    const total = MONTH * 12 * YEARS;
    const late = grandmother(h, 0, total, 2), kept = grandmother(h, total);
    return [
      { q: 'Is there a maximum amount I can give each year from surplus income?', a: `GOV.UK sets no figure. The limit is the one built into the conditions: the gifts have to come out of income and leave enough to meet your usual living costs. Someone with a large pension and modest spending can give more than someone whose income only just covers their outgoings, which is why the exemption is described as having no upper limit.` },
      { q: 'Can regular gifts from income be added to the annual exemption?', a: `Yes. GOV.UK's example is a parent giving ${h.m(60)} a month to a child as normal expenditure and also using the ${h.m(I.annualExemption)} annual exemption on that child in the same tax year. The one combination GOV.UK rules out is with the small gifts allowance: a person who receives a gift under another allowance cannot also receive a small gift.` },
      { q: 'What happens if my executors cannot prove the gifts came from income?', a: `Then the gifts are treated as ordinary lifetime gifts. Any made in the ${I.giftYears} years before death are added back, use the nil-rate band and can leave the estate with a larger bill. On the engine, ${h.m(total)} given as one sum two years before death leaves the grandmother's estate paying ${h.m(late.iht)}, the same as the ${h.m(kept.iht)} it would pay had she kept it.` },
      { q: 'Do gifts paid from pension drawdown count as normal expenditure out of income?', a: `HMRC has not given a yes or no. Its technical note on pensions and inheritance tax says the April 2027 changes do not alter the existing position, and that whether gifts funded by pension withdrawals qualify depends on the facts of each case. The page sets out the arithmetic, but a solicitor or regulated adviser is the person to look at a real pattern of withdrawals.` },
      { q: 'Does it matter if I miss a month or the amount changes?', a: `GOV.UK's wording is about regular payments from regular income, so the question is whether a pattern can be seen, not whether every payment is identical. A one-off present, however generous, does not show one. Where the pattern is less clear, the gifts may still be covered by other allowances or simply fall under the seven year rule, as any gift does.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const total = MONTH * 12 * YEARS;
    const itTeacher = h.E.incomeTax(36000);
    const kept = grandmother(h, total), given = grandmother(h, 0), late = grandmother(h, 0, total, 2);
    // Pension withdrawals used for gifts: a member of 76 with £24,000 of other income draws £8,000 more a year for 8 years.
    const draw = 8000, other = 24000, yrs = 8;
    const taxEach = h.E.extraTax(draw, other);
    const netGifts = (draw - taxEach) * yrs;
    const heir = { age: 84, heirIncome: 40000, years: 3 };
    const base = { home: 450000, savings: 150000, status: 'single' as const, homeToDescendants: true, heirs: 2 };
    const untouched = h.run({ ...base, pension: 300000 }, heir), drawn = h.run({ ...base, pension: 300000 - draw * yrs }, heir);
    return `
<h2>Three tests, all of them needed</h2>
<p>The exemption is easy to state and harder to prove. A gift qualifies when it forms part of the giver's normal expenditure, is made out of income, and leaves them able to keep up their usual way of life. ${h.src('gov_iht_gifts', 'GOV.UK')} puts the three points in plain terms: you make the payments regularly, you pay them from your regular monthly income, and you can afford them after meeting your usual living costs. Fail any one and the payment is an ordinary gift, back under the ${h.a('seven-year-rule-inheritance-tax', 'seven year rule')}.</p>
<p>Each condition does a different job. Regularity separates a habit from a one-off present: a standing order to a grandchild has it, a single cheque for a deposit does not. The income test excludes capital, so selling shares or dipping into savings to fund the payments breaks the link even if the pattern is regular. The living costs test is the safeguard against gifts that would force the giver to draw on capital later; if paying the gifts means cutting back on heating, care or the household budget, they are not surplus.</p>

<h2>The cases GOV.UK uses as illustrations</h2>
<p>GOV.UK's list of examples is short and domestic. It mentions paying rent for an adult child, paying into a savings account for a child under 18, and giving financial support to an elderly relative. Its worked figure is modest: a parent pays ${h.m(60)} a month to a child, ${h.m(720)} a year, and can do that on top of using the ${h.m(I.annualExemption)} annual exemption on the same child in the same tax year. None of the examples needs a large income, which is the point: the exemption is about pattern and affordability rather than size.</p>
<p>The exemption sits alongside the others. GOV.UK says normal expenditure out of income can be combined with any other allowance except the small gifts one, so the ${h.m(I.smallGift)} limit cannot be added for the same person, while the annual exemption and a wedding gift can. The ${h.a('inheritance-tax-gift-allowances', 'gift allowances guide')} sets out those fixed amounts.</p>

<h2>The paper trail behind a claim</h2>
<p>The exemption is claimed after death by the personal representatives, not by the giver, and they can only claim what they can show. GOV.UK asks people to keep records of what they gave, who received it, its value and when it was given, because whoever deals with the estate has to work out the gifts of the ${I.giftYears} years before death. For this particular exemption the conditions are about the giver's income and spending, so a record of the gifts on its own answers only half the question. Bank statements showing where the payments left from, and a simple yearly note of income against usual outgoings, are the kind of material that lets representatives see whether the gifts were surplus. Without it, they may have to treat the payments as ordinary gifts.</p>

<h2>Surplus, measured one year at a time</h2>
<p>The living costs test is easiest to see as a small annual sum. Take a retired teacher with ${h.m(36000)} of pension income. On ${h.P.taxYear} rates for England, Wales and Northern Ireland the engine puts her income tax at ${h.m(itTeacher)}, leaving ${h.m(36000 - itTeacher)}. If her usual spending on the house, food, travel and the rest comes to ${h.m(24000)} a year, the surplus is ${h.m(36000 - itTeacher - 24000)}, and a gift of ${h.m(MONTH)} a month, ${h.m(MONTH * 12)} a year, fits inside it with room to spare. If her spending were ${h.m(30000)}, the same gift would leave her short and would have to come partly from savings, which is exactly what the exemption does not cover. The figures are illustrations; what counts in a real case is the giver's own income and outgoings over the years the gifts were made.</p>

<h2>Ten years at £500 a month</h2>
<p>Take a grandmother with a ${h.m(450000)} home that will go to her children, ${h.m(250000)} of savings and a ${h.m(200000)} pension, who pays ${h.m(MONTH)} a month to a grandchild for ${YEARS} years, ${h.m(total)} in all, from income she does not need. The engine compares three versions of her estate at a death after ${h.D.from}, when the pension counts too.</p>
${h.table(['', 'Estate counted', 'Inheritance tax'], [
  ['Money kept, added to savings', h.m(kept.estateForTaper), h.m(kept.iht)],
  ['Given monthly from income, exempt', h.m(given.estateForTaper), h.m(given.iht)],
  ['Kept, then given as one sum two years before death', h.m(late.estateForTaper), h.m(late.iht)],
], `Home ${h.m(450000)} to children, savings ${h.m(250000)}, pension ${h.m(200000)}, single. Engine figures.`, ['l', 'r', 'r'])}
<p>The exempt gifts take ${h.m(kept.iht - given.iht)} off the bill. The same total handed over late, as a single capital gift, saves nothing: it uses ${h.m(total)} of the nil-rate band, and the estate pays as if it had never been given. Survival for seven years would eventually change that, but the income route has no waiting period at all.</p>

<h2>When the money comes out of a pension</h2>
<p>Withdrawals from a pension are taxed as income, but whether gifts paid out of them count as made from income for this exemption is a separate question, and one that gains weight now that unused funds join the estate from ${h.D.from}. HMRC's ${h.src('gov_tech_note', 'technical note on inheritance tax and pensions')} addresses it in one sentence: the changes do not alter the existing position, and whether gifts funded by pension withdrawals qualify depends on the facts of each case. No rule says they do, and none says they do not.</p>
<p>What can be set out is the arithmetic if they do qualify. Suppose a member aged 76, with ${h.m(other)} of other income, takes an extra ${h.m(draw)} a year from drawdown for ${yrs} years and gives it away. Withdrawals are taxed as income (${h.src('gov_tax_on_pension', 'GOV.UK')}), so each year ${h.m(taxEach)} goes in income tax and ${h.m(draw - taxEach)} reaches the family, ${h.m(netGifts)} over the period. At death at 84, the pot is smaller by ${h.m(draw * yrs)}, ignoring growth.</p>
${h.table(['', 'Pot left untouched', `${h.m(draw)} a year withdrawn and given`], [
  ['Inheritance tax at death', h.m(untouched.after.iht), h.m(drawn.after.iht)],
  ['Income tax paid by two heirs on the pension', h.m(untouched.heirsAfter.totalIncomeTax), h.m(drawn.heirsAfter.totalIncomeTax)],
  ['Inheritance received by the two heirs', h.m(untouched.heirsAfter.total * 2), h.m(drawn.heirsAfter.total * 2)],
  ['Plus the gifts received in life', h.m(0), h.m(netGifts)],
  ['Family total', h.m(untouched.heirsAfter.total * 2), h.m(drawn.heirsAfter.total * 2 + netGifts)],
], 'Home £450,000 to the children, savings £150,000, pension £300,000, death at 84 after April 2027; heirs earn £40,000 and draw over three years. Only if the gifts qualify as normal expenditure.', ['l', 'r', 'r'])}
<p>The gain comes from the money leaving the estate without inheritance tax, and from it bearing income tax once, at the member's rate, instead of inheritance tax followed by the heirs' income tax. It holds only if the representatives can show the three conditions were met; if they cannot, the gifts fall back into the seven year rule and the comparison changes. This is the kind of pattern on which a regulated adviser or solicitor is consulted before it starts, not after.</p>

<h2>Where the exemption stops</h2>
<p>An inheritance received and passed on, or the proceeds of selling an asset, are not income, and gifts paid from them fail the income test however regular they are made to look. Nor does the exemption help someone whose income is fully committed. For those situations the fixed allowances and the seven year rule are what apply. The ${h.a('home', 'estate calculator')} shows the effect of gifts on a whole estate, and the ${h.a('pension-drawdown-tax', 'drawdown tax page')} shows what each withdrawal costs in income tax.</p>
`;
  },
});
