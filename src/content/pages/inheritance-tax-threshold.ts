import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';
import type { EstateInput } from '../../lib/engine/iht';

const est = (h: Helpers, inp: Partial<EstateInput> & { home: number; savings: number }) => h.E.estate({ pension: 0, status: 'single', homeToDescendants: true, ...inp }, 'after');

export default definePage({
  id: 'inheritance-tax-threshold',
  group: 'thresholds',
  order: 110,
  mini: { kind: 'mini:threshold' },
  related: ['residence-nil-rate-band', 'transferable-nil-rate-band', 'inheritance-tax-threshold-freeze', 'residence-nil-rate-band-taper'],
  sources: ['gov_iht', 'fa2021_s86', 'fa2026_s72', 'fa2026_s66', 'gov_iht_gifts'],
  slug: 'inheritance-tax-threshold',
  nav: 'Inheritance tax threshold',
  card: 'The tax-free amount of an estate in 2026/27, by situation, and what counts against it from April 2027.',
  title: 'Inheritance Tax Threshold 2026/27: £325,000 to £1 Million',
  description: 'Inheritance tax threshold 2026/27: £325,000 each, up to £500,000 with a home to children, £1 million for a couple, frozen to 2031, pensions counted from 2027.',
  h1: 'Inheritance tax threshold in 2026/27: what an estate can pass on tax free',
  intro: 'The headline figure is the same as it has been for years. What has changed is how many estates reach it, and from April 2027 what is added up to test it.',
  resume: (h) => {
    const I = h.P.iht;
    const pen = h.run({ home: 300000, savings: 150000, pension: 250000, status: 'single', homeToDescendants: true, heirs: 2 }, { age: 70, heirIncome: 0 });
    return `The inheritance tax threshold for 2026/27 is ${h.m(I.nrb)} per person, the nil-rate band. An estate worth less than that after debts pays no inheritance tax, and above it the excess is taxed at ${h.pc(I.rate)}. A second allowance, the residence nil-rate band of up to ${h.m(I.rnrb)}, is added when a home goes to children, grandchildren or other direct descendants, which takes one person's threshold to ${h.m(I.nrb + I.rnrb)}. A widow, widower or surviving civil partner can add whatever the late partner left unused, so a couple can pass on up to ${h.m(2 * (I.nrb + I.rnrb))}. All these figures are frozen until ${h.D.freeze}. For deaths on or after ${h.D.from}, unused pension funds count towards the threshold too: a single person with a ${h.m(300000)} home left to two children, ${h.m(150000)} of savings and a ${h.m(250000)} pension owes ${h.m(pen.before.iht)} before the change and ${h.m(pen.after.iht)} after it.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'What is the inheritance tax threshold for 2026 to 2027?', a: `The nil-rate band is ${h.m(I.nrb)} for each person. The residence nil-rate band adds up to ${h.m(I.rnrb)} if a home goes to direct descendants. Both stay at those levels for every tax year up to and including ${h.P.iht.frozenUntilTaxYear}, because the Finance Acts of 2021, 2025 and 2026 switched off the yearly increase in line with prices.` },
      { q: 'Is the nil-rate band per person or shared by a couple?', a: `Each person has one nil-rate band, used by their own estate when they die and by gifts made in the seven years before. A married couple or civil partners therefore have two, but the second only becomes useful at the second death, when the survivor's estate claims the unused share of the first. Unmarried partners cannot combine theirs.` },
      { q: 'Does my pension count towards the inheritance tax threshold?', a: `From ${h.D.from}, yes: unused pension funds and most lump sum death benefits are added to the estate before the threshold is compared with it. For a death before that date, a pension paid at the scheme's discretion is outside. Excluded benefits, such as death in service lump sums from a current job and dependants' scheme pensions, never count.` },
      { q: 'Why is my threshold lower than £500,000 even though I own my home?', a: `Three common reasons. The residence band is capped at the value of the home, or the share of it, passing to descendants, so a home worth less than ${h.m(I.rnrb)} gives a smaller band. A home left to a partner, nephew or friend earns none. And above ${h.m(I.taperThreshold)} the band shrinks by ${h.m(1)} for every ${h.m(I.taperDivisor)} of extra estate.` },
      { q: 'Do gifts I made in the last seven years reduce the threshold?', a: `They use it first. Gifts above the exemptions made in the seven years before death are set against the nil-rate band, oldest first, and only what is left of the band protects the estate. The residence band is never used by gifts, so it remains available for the home whatever was given away.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht;
    const big = 1500000;
    const cases: Array<[string, Partial<EstateInput> & { home: number; savings: number }]> = [
      ['Single, no home passing to descendants', { home: 400000, savings: big - 400000, homeToDescendants: false }],
      ['Single, home worth £400,000 to children', { home: 400000, savings: big - 400000 }],
      ['Single, home worth £120,000 to children', { home: 120000, savings: big - 120000 }],
      ['Widowed, both late spouse’s bands unused, home to children', { home: 400000, savings: big - 400000, status: 'widowed', transferNrb: 1, transferRnrb: 1 }],
      ['Widowed, both bands unused, home to a nephew', { home: 400000, savings: big - 400000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: false }],
      ['Widowed, half the late spouse’s nil-rate band unused', { home: 400000, savings: big - 400000, status: 'widowed', transferNrb: 0.5, transferRnrb: 1 }],
      ['Single, estate of £2,200,000, home to children', { home: 400000, savings: 2200000 - 400000 }],
      ['Widowed, estate of £2,500,000, both bands unused', { home: 400000, savings: 2500000 - 400000, status: 'widowed', transferNrb: 1, transferRnrb: 1 }],
    ];
    const rows = cases.map(([label, inp]) => { const r = est(h, inp); return [label, h.m(r.nrbLeft), h.m(r.rnrb), h.m(r.threshold)]; });
    const pen = h.run({ home: 300000, savings: 150000, pension: 250000, status: 'single', homeToDescendants: true, heirs: 2 }, { age: 70, heirIncome: 0 });
    const gift = est(h, { home: 300000, savings: 300000, gifts: 100000, giftYears: 3 });
    const noGift = est(h, { home: 300000, savings: 300000 });
    return `
<h2>${h.m(I.nrb)}: the nil-rate band</h2>
<p>Every individual has the same basic threshold, the nil-rate band, listed by ${h.src('gov_iht', 'GOV.UK')} at ${h.m(I.nrb)} for 2026/27. It applies to the estate after debts and after anything exempt has been taken out: what goes to a spouse or civil partner and what goes to charity. Only the part of the remaining chargeable estate above the band is taxed, at ${h.pc(I.rate)}, or at ${h.pc(I.charityRate)} where at least ${h.pc(I.charityTest)} of the baseline amount is left to charity. Many people think of the threshold as a line that, once crossed, makes the whole estate taxable. It is not: an estate ${h.m(10000)} over the band pays tax on ${h.m(10000)}.</p>

<h2>Up to ${h.m(I.nrb + I.rnrb)} with the family home</h2>
<p>The residence nil-rate band sits on top of the basic band when a home the person lived in, or a share of it, passes to direct descendants. Its maximum is ${h.m(I.rnrb)}, but it is limited to the value of the home that the descendants inherit, so a modest flat may earn less than the full amount. It cannot be set against savings or investments, and a home left to a brother, a niece or a partner who is not married to a descendant earns none. The ${h.a('residence-nil-rate-band', 'residence nil-rate band guide')} explains who counts as a descendant and what happens when the home is sold.</p>

<h2>A couple: up to ${h.m(2 * (I.nrb + I.rnrb))}</h2>
<p>Spouses and civil partners cannot pool their bands while both are alive, but the second estate inherits the unused percentage of the first. When the first partner leaves everything to the survivor, nothing of either band is used, and the survivor's estate can claim a second nil-rate band and a second residence band. With a home worth at least ${h.m(2 * I.rnrb)} left to children, the threshold for that second estate reaches ${h.m(2 * (I.nrb + I.rnrb))}. Legacies to children at the first death use up part of the first band and reduce the transfer, as the ${h.a('transferable-nil-rate-band', 'transferable band page')} shows with figures.</p>

<h2>The threshold by situation</h2>
<p>The table runs the site's engine on a series of estates, all large enough to use their full bands. It shows how much nil-rate band and residence band each one gets for a death in 2026/27 or later under the frozen figures.</p>
${h.table(['Situation', 'Nil-rate band', 'Residence band', 'Total threshold'], rows, 'Estates of £1,500,000 unless stated; home of £400,000 unless stated. Computed by the engine.', ['l', 'r', 'r', 'r'])}
<p>The last two rows show the taper: once the estate passes ${h.m(I.taperThreshold)}, the residence band falls by ${h.m(1)} for every ${h.m(I.taperDivisor)} above it, transferred band included. The ${h.a('residence-nil-rate-band-taper', 'taper guide')} has the exact points where it runs out. Use the calculator at the top of this page to enter your own estate and home.</p>

<h2>Frozen until ${h.D.freeze}</h2>
<p>The bands used to rise each year with consumer prices. ${h.src('fa2021_s86', 'Section 86 of the Finance Act 2021')} switched that off, and later Acts extended the freeze twice; the last extension, in ${h.src('fa2026_s72', 'section 72 of the Finance Act 2026')}, keeps both bands fixed for every tax year up to and including ${I.frozenUntilTaxYear}. As house prices and savings grow and the threshold stays still, more estates cross it each year; the ${h.a('inheritance-tax-threshold-freeze', 'page on the freeze')} projects an estate to the end of the period.</p>

<h2>What counts against the threshold from April 2027</h2>
<p>Until ${h.D.from}, a pension paid at the trustees' discretion stayed outside the estate, so a family could have a threshold comfortably above the house and savings and owe nothing. For deaths from that date, ${h.src('fa2026_s66', 'section 150A')} adds unused pension funds and lump sum death benefits to the estate, and the threshold is compared with the total. The single person in the summary has a home of ${h.m(300000)} and savings of ${h.m(150000)}, well below a threshold of ${h.m(pen.after.threshold)}. Add the ${h.m(250000)} pension and the estate counted for tax becomes ${h.m(pen.after.estateForTaper)}; the bill moves from ${h.m(pen.before.iht)} to ${h.m(pen.after.iht)}.</p>
<p>Some pension benefits stay out of the reckoning. Dependants' scheme pensions, joint life annuities bought with the member's annuity and death in service benefits from a current job are excluded. Pension money going to a spouse, civil partner or charity counts in the estate but is exempt, so it does not use the threshold. The pension also counts for the taper, which can now catch estates whose house and savings alone are well under ${h.m(I.taperThreshold)}.</p>

<h2>Gifts made in the seven years before death</h2>
<p>Lifetime gifts above the exemptions are not taxed when made, but if the giver dies within seven years they are brought back and set against the nil-rate band first, oldest first, as ${h.src('gov_iht_gifts', 'GOV.UK’s gifts guidance')} explains. A ${h.m(100000)} gift to a grandchild three years before death leaves ${h.m(gift.nrbLeft)} of nil-rate band for the estate. On a ${h.m(600000)} estate with a ${h.m(300000)} home left to children, that raises the tax from ${h.m(noGift.iht)} to ${h.m(gift.iht)}. The residence band is untouched, since it never applies to gifts.</p>

<h2>The same figures in 2026, 2027 and beyond</h2>
<p>Searches for the threshold usually name a year, but under the freeze the answer does not move with it. The 2026/27 tax year, from ${h.P.taxYearLong}, uses ${h.m(I.nrb)} and ${h.m(I.rnrb)}; so will 2027/28 and each following year up to ${I.frozenUntilTaxYear}. What changes in April 2027 is the content of the estate, not the size of the bands. A threshold that comfortably covered a family's house and savings in 2026 can be overtaken in 2027 simply because a pension is now added to the same total, with no change to the family's assets at all.</p>

<h2>Leaving part of the estate to charity</h2>
<p>A gift to a charity in the will is exempt, so it reduces what is set against the threshold. It also opens a lower rate. If the charitable gifts reach ${h.pc(I.charityTest)} of the baseline amount, worked out by deducting the nil-rate band still available from the estate after exemptions and adding back the gift, the rest of the estate above the threshold is taxed at ${h.pc(I.charityRate)}. The residence band is not deducted in that baseline. The ${h.a('inheritance-tax-charity-rate', 'charity rate page')} sets out the arithmetic.</p>

<h2>Once the threshold is passed</h2>
<p>Tax on the part above the threshold is due by the end of the sixth month after the death, and interest runs after that. A payment is usually needed before the executors can obtain probate, or confirmation in Scotland. From April 2027 the tax that falls on a pension can be paid by the scheme itself, on a payment notice from the representatives or a beneficiary, which spares them from finding cash before the rest of the estate is released.</p>

<h2>Reading your own threshold</h2>
<p>For most estates the threshold is the sum of three answers: the nil-rate band less recent gifts, the residence band if a home goes to descendants, and any share transferred from a late spouse or civil partner, all reduced if the estate passes ${h.m(I.taperThreshold)}. The calculator above combines them. It gives a figure for information, not a valuation or advice; the executors, a solicitor or a regulated adviser confirm the position for a real estate.</p>
`;
  },
});
