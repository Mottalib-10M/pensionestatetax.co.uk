import { definePage } from '../../lib/guide-types';
import type { EstateInput, HeirInput } from '../../lib/engine/iht';

// Calculator props converted: widowed with the default full transfer (100 %), heirs and heir income at defaults.
const EST: EstateInput = { home: 900000, savings: 600000, pension: 600000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 };
const HEIR: HeirInput = { age: 78, heirIncome: 45000 };

export default definePage({
  id: 'inheritance-tax-2-million-estate',
  group: 'cases',
  order: 260,
  tool: { kind: 'iht', props: { family: 'widowed', home: 900000, savings: 600000, pension: 600000 } },
  related: ['residence-nil-rate-band-taper', 'inheritance-tax-1-million-estate', 'pension-pot-1-million-inheritance-tax', 'residence-nil-rate-band'],
  sources: ['gov_rnrb', 'fa2026_s66', 'fa2021_s86', 'gov_iht'],
  slug: 'inheritance-tax-2-million-estate',
  nav: '£2 million estate',
  card: 'The point where the residence band starts to shrink, and why a pension now drags an estate past it.',
  title: 'Inheritance Tax on a £2 Million Estate: Taper Rules 2027',
  description: 'Inheritance tax on a £2 million estate in 2026/27: where the residence band taper starts, and how a pension counted from April 2027 removes part or all of it.',
  h1: 'Inheritance tax on a £2 million estate: the taper line',
  intro: 'Two million pounds is not a tax-free limit. It is where the residence band begins to melt away, and pension money now counts towards it.',
  resume: (h) => {
    const I = h.P.iht;
    const r = h.run(EST, HEIR);
    return `The ${h.m(I.taperThreshold)} figure decides whether an estate keeps its residence nil-rate band. Above it the band is reduced by ${h.m(1)} for every ${h.m(I.taperDivisor)} of excess, and the estate measured for that test is everything owned less debts, before the spouse exemption and before reliefs. From ${h.D.from} the unused pension is part of that measure. Picture a widower with a ${h.m(EST.home)} house, ${h.m(EST.savings)} of savings and ${h.m(EST.pension)} in a pension, both bands inherited in full from his late wife. Dying before the change, his estate is ${h.m(r.before.estateForTaper)}, the full residence band of ${h.m(r.before.rnrb)} applies and the tax is ${h.m(r.before.iht)}. From that date the pension lifts the estate to ${h.m(r.after.estateForTaper)}, ${h.m(r.after.rnrbTaper)} of residence band is lost and the bill becomes ${h.m(r.after.iht)}, of which ${h.m(r.after.ihtOnPension)} falls on the pension. With a transferred band, nothing is left once the estate reaches ${h.m(I.taperThreshold + 2 * I.rnrb * I.taperDivisor)}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Does leaving everything to my wife stop the taper applying?', a: `No. The spouse exemption removes the tax at the first death, but the taper looks at the estate before exemptions. An estate above ${h.m(I.taperThreshold)} that goes entirely to a spouse still loses part of its own residence band, so less of it is left unused to transfer. That smaller unused percentage is what the survivor's executors can then claim.` },
      { q: 'Can paying off my mortgage change the taper?', a: `The taper uses assets less debts, so a mortgage already lowers the figure tested against ${h.m(I.taperThreshold)}. Paying it off with savings leaves the net estate unchanged. Spending, giving away or moving money out of the estate is what reduces it, and each of those has its own rules, including the ${h.P.iht.giftYears} year rule for gifts. A solicitor or adviser looks at the options for a real estate.` },
      { q: 'At what estate value is the residence band completely lost?', a: `For a single person with only their own band, at ${h.m(I.taperThreshold + I.rnrb * I.taperDivisor)}. With a late spouse's band transferred in full, the band is twice as large and disappears at ${h.m(I.taperThreshold + 2 * I.rnrb * I.taperDivisor)}. Between ${h.m(I.taperThreshold)} and those points the band shrinks steadily; the nil-rate band itself is never tapered.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const pots = [300000, 400000, 600000, 800000, 1200000];
    const rows = pots.map((p) => { const r = h.run({ ...EST, pension: p }, HEIR); return [h.m(p), h.m(r.after.estateForTaper), h.m(r.after.rnrb), h.m(r.after.iht), h.m(r.after.iht - r.before.iht)]; });
    const zone = I.rate * (1 + 1 / I.taperDivisor);
    return `
<h2>The taper explained with real money</h2>
<p>The ${h.src('gov_rnrb', 'residence nil-rate band')} does not vanish at once on a large estate: it shrinks. The rule is simple arithmetic: take the estate after debts, subtract ${h.m(I.taperThreshold)}, halve the result, and remove that much from the residence band, including any band transferred from a late spouse. The nil-rate band is untouched. Because the measure is taken before the spouse and charity exemptions, a generous will does not move the estate back under the line.</p>

<h2>A pension that switches the band off</h2>
<p>Until now a pension paid at the scheme's discretion was invisible to this test. ${h.src('fa2026_s66', 'Section 66 of the Finance Act 2026')} changes that for deaths from ${h.D.from}: the pot counts in the estate, and therefore in the taper. The table keeps the widower's house and savings and tries five pension values.</p>
${h.table(['Pension', 'Estate for the taper', 'Residence band left', 'Inheritance tax', 'Extra tax from the reform'], rows, 'Widower, both bands transferred, home £900,000 and savings £600,000 to two children, death at 78. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>The extra tax in the last column has two parts: the pension taxed at ${h.pc(I.rate)} once the bands are full, and the residence band lost because the pension pushed the estate over the line. With a pot of ${h.m(1200000)}, the band has gone entirely.</p>

<h2>The effective rate inside the taper zone</h2>
<p>Between ${h.m(I.taperThreshold)} and the point where the band runs out, each extra pound in the estate is taxed at ${h.pc(I.rate)} itself and also removes fifty pence of band, which is then taxed at the same rate. The combined cost is ${h.pc(zone)} of each pound in that stretch. Above it, the rate falls back to ${h.pc(I.rate)}. That is why growth in a pension pot near the line is unusually expensive from April 2027, and why ${h.a('residence-nil-rate-band-taper', 'the taper page')} spends time on where each estate sits.</p>

<h2>The widower's ledger</h2>
<p>The calculator above starts on the same case. The table below uses exactly its inputs, with two children earning ${h.m(HEIR.heirIncome)} and a death at ${HEIR.age}.</p>
${h.ledger(EST, HEIR, `Widower with both bands, estate crossing the taper line once the pension counts, death before and from ${h.D.from}.`)}
<p>The bands are frozen until ${h.D.freeze} by ${h.src('fa2021_s86', 'section 86 of the Finance Act 2021')}, as amended, and the taper still starts at ${h.m(I.taperThreshold)}. The ${h.a('pension-pot-1-million-inheritance-tax', 'page on a £1 million pot')} shows the same estate size reached mostly through a pension. For a real estate near the line, the executors and a solicitor or regulated adviser check the values used.</p>
`;
  },
});
