import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** Tax on an estate held as a large home to children plus savings, single or widowed with both bands. */
const tax = (h: Helpers, value: number, widowed: boolean) => h.E.estate({ home: 900000, savings: Math.max(0, value - 900000), pension: 0, status: widowed ? 'widowed' : 'single', transferNrb: 1, transferRnrb: 1, homeToDescendants: true }, 'after').iht;
/** Extra tax on the next thousand pounds of estate, as a rate. */
const marginal = (h: Helpers, value: number, widowed = false) => (tax(h, value + 1000, widowed) - tax(h, value, widowed)) / 1000;

export default definePage({
  id: 'residence-nil-rate-band-taper',
  group: 'thresholds',
  order: 130,
  mini: { kind: 'mini:taper' },
  related: ['residence-nil-rate-band', 'inheritance-tax-2-million-estate', 'inheritance-tax-threshold', 'inheritance-tax-on-pensions'],
  sources: ['gov_rnrb', 'fa2026_s66', 'gov_rnrb_transfer', 'gov_iht'],
  slug: 'residence-nil-rate-band-taper',
  nav: 'Residence band taper',
  card: 'How estates above £2 million lose the residence band, and why the pension now counts.',
  title: 'Residence Nil Rate Band Taper 2026/27: Estates Above £2m',
  description: 'Residence nil rate band taper 2026/27: £1 lost for every £2 above £2 million, gone at £2.35m or £2.7m, a 60 % marginal rate, pensions counted from April 2027.',
  h1: 'Residence nil rate band taper: what happens above the threshold',
  intro: 'The residence band is withdrawn from larger estates, gradually rather than all at once. While it is being withdrawn, each extra pound of estate costs far more than the headline rate.',
  resume: (h) => {
    const I = h.P.iht;
    const goneSingle = I.taperThreshold + I.rnrb * I.taperDivisor;
    const goneCouple = I.taperThreshold + 2 * I.rnrb * I.taperDivisor;
    const m = marginal(h, 2200000);
    return `The residence nil rate band taper reduces the residence band by ${h.m(1)} for every ${h.m(I.taperDivisor)} by which an estate exceeds ${h.m(I.taperThreshold)}. The estate measured is everything the person owned less debts, before deducting exemptions such as gifts to a spouse or charity and reliefs such as business property relief. A single person's band of ${h.m(I.rnrb)} disappears completely at ${h.m(goneSingle)}; a widow or widower with a late partner's band transferred has ${h.m(2 * I.rnrb)} to lose and keeps some of it until ${h.m(goneCouple)}. Inside that zone each extra ${h.m(1000)} of estate is taxed at ${h.pc(I.rate)} and also removes ${h.m(1000 / I.taperDivisor)} of band, itself worth ${h.pc(I.rate)}, so the effective rate is ${h.pc(m)}. From ${h.D.from} unused pension funds are part of the estate, so a pension can push an estate over the threshold even when the home and savings alone are below it. The bands and the threshold are frozen until ${h.D.freeze}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Is the residence band taper applied before or after the spouse exemption?', a: `Before. HMRC measures the estate for the taper as all the assets less debts and liabilities, without taking off what goes to a spouse, civil partner or charity, or any business or agricultural relief. An estate of ${h.m(2400000)} left entirely to a widow pays no tax, but its own residence band is still tapered, which reduces what can transfer to her estate.` },
      { q: 'Is the residence band taper worked out on each spouse’s estate separately?', a: `Yes. Each death is tested on its own estate. At the first death the taper reduces that estate's band and so the unused share that transfers. At the second death the survivor's estate is measured, including anything inherited from the first, and the combined band, own plus transferred, is tapered against the same ${h.m(I.taperThreshold)} threshold.` },
      { q: 'Do a mortgage and other debts lower the estate value used for the taper?', a: `Yes. The estate measured for the taper is the value of everything the person owned at death less debts and liabilities, so a mortgage on the home, a loan or unpaid bills reduce it. What does not reduce it is anything that is exempt or relieved: legacies to a spouse, civil partner or charity, and business or agricultural property relief all stay in the figure tested against ${h.m(I.taperThreshold)}.` },
      { q: 'Where does the residence band run out for a single person and for a widow?', a: `For a single, divorced or never-married person, at ${h.m(I.taperThreshold + I.rnrb * I.taperDivisor)}: the threshold plus twice the band. For a widow, widower or surviving civil partner with a full band transferred from the late partner, the combined band of ${h.m(2 * I.rnrb)} lasts until ${h.m(I.taperThreshold + 2 * I.rnrb * I.taperDivisor)}. Above those values the ordinary nil-rate band is all that remains.` },
      { q: 'Why does inheritance tax reach 60 % just above the taper threshold?', a: `Because two things happen to each extra pound. It is taxed at ${h.pc(I.rate)} like any pound above the bands, and it also removes half a pound of residence band that would have sheltered another part of the estate, adding half of ${h.pc(I.rate)}. Once the band is gone, the rate falls back to ${h.pc(I.rate)}. The headline rate itself never changes.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht;
    const values = [I.taperThreshold, 2100000, 2200000, I.taperThreshold + I.rnrb * I.taperDivisor, 2500000, I.taperThreshold + 2 * I.rnrb * I.taperDivisor];
    const rows = values.map((v) => {
      const s = h.E.residenceBand({ estate: v, home: 10_000_000, homeToDescendants: true });
      const w = h.E.residenceBand({ estate: v, home: 10_000_000, homeToDescendants: true, transferRnrb: 1 });
      return [h.m(v), h.m(s.rnrb), h.m(Math.min(s.def, s.taper) * I.rate), h.m(w.rnrb), h.m(Math.min(w.def, w.taper) * I.rate)];
    });
    const zones = [
      ['Below the threshold, above the bands', h.m(1800000), h.pc(marginal(h, 1800000)), h.pc(marginal(h, 1800000, true))],
      ['Inside the single taper zone', h.m(2200000), h.pc(marginal(h, 2200000)), h.pc(marginal(h, 2200000, true))],
      ['Single band gone, transferred band still tapering', h.m(2500000), h.pc(marginal(h, 2500000)), h.pc(marginal(h, 2500000, true))],
      ['Both bands gone', h.m(2800000), h.pc(marginal(h, 2800000)), h.pc(marginal(h, 2800000, true))],
    ];
    const first = h.E.residenceBand({ estate: 2400000, home: 900000, homeToDescendants: true });
    const pen = h.run({ home: 900000, savings: 900000, pension: 500000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 3 }, { age: 80, heirIncome: 50000 });
    const extra = pen.after.iht - pen.before.iht;
    const small = h.E.residenceBand({ estate: 2100000, home: 100000, homeToDescendants: true });
    return `
<h2>One pound lost for every two above the threshold</h2>
<p>${h.src('gov_rnrb', 'HMRC’s guidance')} states the rule plainly: if the estate is worth more than ${h.m(I.taperThreshold)}, the residence band is reduced by ${h.m(1)} for every ${h.m(I.taperDivisor)} over that amount. The reduction applies to the maximum band available, including any share transferred from a late spouse, before the band is compared with the value of the home. A large house therefore does not protect the band: an estate of ${h.m(2200000)} with a ${h.m(900000)} home left to children gets the same reduced band as one with a ${h.m(400000)} home.</p>
<p>The table shows the band that survives at different estate values, for a single person and for a widow or widower with a full band transferred, and the extra inheritance tax the lost band costs. The home is assumed to be worth more than the band, so the cap at the home's value does not bite.</p>
${h.table(['Estate after debts', 'Band left, single', 'Extra tax, single', 'Band left, with transfer', 'Extra tax, with transfer'], rows, 'Residence band after the taper and the inheritance tax it adds, 2026/27 amounts. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>The calculator above does the same for any estate value. A widowed estate loses band at the same pace as a single one; it simply has twice as much to lose, which is why the point where nothing remains moves from ${h.m(I.taperThreshold + I.rnrb * I.taperDivisor)} to ${h.m(I.taperThreshold + 2 * I.rnrb * I.taperDivisor)}.</p>

<h2>Which estate is measured</h2>
<p>The figure tested against the threshold is not the taxable estate. It is the net value of everything the person owned at death, less debts and liabilities, before any exemption or relief is taken off. A gift in the will to a spouse, civil partner or charity does not lower it. Nor does business property relief or agricultural property relief on a family company or farm, even though those reliefs may take the assets out of the tax itself. An estate can therefore pay little or no tax and still lose its whole residence band.</p>
<p>That matters most at the first death of a married couple. A husband whose ${h.m(2400000)} estate goes entirely to his wife pays nothing, because the spouse exemption covers it. But his residence band is tested against the full ${h.m(2400000)}, the taper removes ${h.m(Math.min(first.def, first.taper))}, and ${first.rnrb > 0 ? `${h.m(first.rnrb)} is left` : 'nothing is left'}. The unused percentage that his widow's estate can claim later is measured from that tapered figure, so ${h.pc(first.rnrb / I.rnrb)} of a band transfers under the ${h.src('gov_rnrb_transfer', 'transfer rules')}.</p>

<h2>The 60 % zone, worked out</h2>
<p>Inside the taper, an extra ${h.m(1000)} of estate has two effects. It is taxed at ${h.pc(I.rate)}, adding ${h.m(1000 * I.rate)}. It also cuts the residence band by ${h.m(1000 / I.taperDivisor)}, exposing that much of the rest of the estate to tax at ${h.pc(I.rate)}, adding another ${h.m(1000 / I.taperDivisor * I.rate)}. Together the next ${h.m(1000)} costs ${h.m(1000 * marginal(h, 2200000))}, a rate of ${h.pc(marginal(h, 2200000))}. The table runs the engine for the next ${h.m(1000)} at four estate values.</p>
${h.table(['Position', 'Estate', `Rate on the next ${h.m(1000)}, single`, 'Rate, with transfer'], zones, `Inheritance tax on the next ${h.m(1000)} of estate, as a share of it. Home of ${h.m(900000)} to children. Computed by the engine.`, ['l', 'r', 'r', 'r'])}
<p>The single estate leaves the zone once its band is used up; the widowed estate stays in it for twice as long. The headline rate never rises above ${h.pc(I.rate)}; the higher figure is the result of losing an allowance while the estate grows.</p>

<h2>How the pension pushes estates over from April 2027</h2>
<p>Until ${h.D.from}, a pension paid at the scheme's discretion was outside the estate and therefore outside the taper test. ${h.src('fa2026_s66', 'Section 150A')} changes both. A widow with a ${h.m(900000)} home left to three children, ${h.m(900000)} of savings and a ${h.m(500000)} pension has an estate of ${h.m(pen.before.estateForTaper)} for a death before the change, comfortably under the threshold, with the full ${h.m(pen.before.rnrb)} of residence band. For a death after it, the estate counted is ${h.m(pen.after.estateForTaper)}, the band falls to ${h.m(pen.after.rnrb)}, and the tax rises from ${h.m(pen.before.iht)} to ${h.m(pen.after.iht)}.</p>
<p>The increase of ${h.m(extra)} is more than the tax on the pension alone would suggest, because ${h.m(pen.before.rnrb - pen.after.rnrb)} of band disappears at the same time. Because the taper counts the estate before exemptions, the result would be the same if part of that pension were nominated to a surviving spouse: the exemption takes the pension out of the tax, but not out of the taper test.</p>

<h2>When the home is worth less than the tapered band</h2>
<p>The taper is applied first and the cap at the home's value second. For an estate of ${h.m(2100000)} the tapered band is ${h.m(small.adjusted)}. If the home passing to the children is worth only ${h.m(100000)}, the band is capped at ${h.m(small.rnrb)}, the lower of the two. In that estate the first ${h.m((small.adjusted - small.rnrb) * I.taperDivisor)} above the threshold removes band the home could never have used, so the taper costs nothing until the tapered figure falls below the value of the home. Estates built mainly of savings, investments or pensions, with a modest home, therefore feel the taper later than the table suggests. The ${h.a('residence-nil-rate-band', 'residence band guide')} explains the cap.</p>

<h2>Pensions drawn during life</h2>
<p>From April 2027 the timing of pension withdrawals affects the taper test as well as the tax. Money left in the pot counts at death. Money drawn and spent is gone from the estate; money drawn and kept in a bank account still counts, now as savings. Withdrawals are taxed as income in the year they are taken, apart from the tax-free part, and income tax rates can be high in the same years. How those two taxes balance differs for each family and is a matter for a regulated adviser, not a general rule; the ${h.a('pension-drawdown-tax', 'drawdown tax page')} shows the income tax on a withdrawal.</p>

<h2>What the figure includes and leaves out</h2>
<p>Excluded pension benefits never count: a dependants' scheme pension, a joint life annuity bought with the member's own annuity, and death in service benefits from a job held at death. Debts reduce the figure, including a mortgage on the home. Money a person has spent is no longer in the estate. Beyond that, every asset counts at its value at death, wherever it goes and whatever relief it attracts. ${h.src('gov_iht', 'GOV.UK’s overview')} sets the taper alongside the other thresholds; the ${h.a('inheritance-tax-2-million-estate', `page on an estate of ${h.m(I.taperThreshold)}`)} works through one complete estate at that level.</p>

<h2>Reading the taper for your family</h2>
<p>The taper is mechanical, but estates near the threshold are often the ones where several rules meet: a business or farm with relief, a pension nominated to a spouse, a home worth more or less than the band. The calculator gives the cost of the taper for an estate value and whether a late partner's band was transferred. It does not replace a valuation of the estate, and it is not advice: the executors, a solicitor or a regulated adviser look at a real case, including how the first death of a couple affects the second.</p>
`;
  },
});
