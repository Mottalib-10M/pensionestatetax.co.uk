import { definePage } from '../../lib/guide-types';
import type { EstateInput, HeirInput } from '../../lib/engine/iht';

// Calculator props converted: family 'widowed' with transfer 100 gives both bands transferred in full.
const EST: EstateInput = { home: 550000, savings: 150000, pension: 300000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 };
const HEIR: HeirInput = { age: 78, heirIncome: 45000 };

export default definePage({
  id: 'inheritance-tax-1-million-estate',
  group: 'cases',
  order: 250,
  tool: { kind: 'iht', props: { family: 'widowed', transfer: 100, home: 550000, savings: 150000, pension: 300000 } },
  related: ['transferable-nil-rate-band', 'pension-left-to-spouse-inheritance-tax', 'inheritance-tax-2-million-estate', 'inheritance-tax-500000-estate'],
  sources: ['gov_rnrb_transfer', 'gov_iht', 'fa2026_s69', 'fa2026_s66'],
  slug: 'inheritance-tax-1-million-estate',
  nav: '£1 million estate',
  card: 'The second death of a married couple: two sets of bands, one estate, and the pension that pushes past them.',
  title: 'Inheritance Tax on a £1 Million Estate After 2027: Couples',
  description: 'Inheritance tax on a £1 million estate in 2026/27: how a widow or widower uses both sets of bands at the second death, and a pension that exceeds them in 2027.',
  h1: 'Inheritance tax on a £1 million estate at the second death',
  intro: 'A married couple or civil partners can, between them, pass on a million pounds tax free. The surviving partner’s pension now has to fit inside that figure too.',
  resume: (h) => {
    const I = h.P.iht;
    const r = h.run(EST, HEIR);
    const big = h.run({ ...EST, pension: 450000 }, HEIR);
    return `When the first spouse or civil partner dies and leaves everything to the other, nothing is taxed and none of their bands is used. At the second death the survivor's estate can claim the unused percentage of both: twice the nil-rate band and twice the residence band, ${h.m(2 * (I.nrb + I.rnrb))} in all when the family home goes to children or grandchildren. Take a widow with a ${h.m(EST.home)} house, ${h.m(EST.savings)} in savings and ${h.m(EST.pension)} left in a pension. On a death before ${h.D.from} the estate is ${h.m(r.before.estateForTaper)} and owes ${r.before.iht > 0 ? h.m(r.before.iht) : 'nothing'}. From that date the pension is added, the estate reaches ${h.m(r.after.estateForTaper)} and the tax is still ${r.after.iht > 0 ? h.m(r.after.iht) : 'nil'}, but the whole double allowance is used up. If the pot holds ${h.m(450000)} instead, the second estate owes ${h.m(big.after.iht)}, and ${h.m(big.after.ihtOnPension)} of it is attributed to the pension. The figure of a million only holds when every band passed across in full and the estate stays below ${h.m(I.taperThreshold)}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    const half = h.run({ ...EST, transferNrb: 0.5 }, HEIR);
    return [
      { q: 'My wife left a legacy to her brother. Do I still get her full nil-rate band?', a: `No, only the percentage she did not use. A legacy to anyone other than you, a charity or another exempt person uses part of her band. If half was used, half transfers: in the example on this page that brings the second estate's tax to ${h.m(half.after.iht)} from ${h.D.from}. The claim is made by your executors when you die.` },
      { q: 'We were never married. Can my partner use my unused bands?', a: `No. Transfers of unused nil-rate band and residence band are only possible between spouses and civil partners. An unmarried survivor has a single set of bands at most, and the residence band only if the home goes on to direct descendants. Divorced partners cannot transfer either. The page on unmarried couples shows what that costs.` },
      { q: 'Is the pension I inherited from my husband taxed at his death?', a: `Not with inheritance tax. Section 69 of the Finance Act 2026 extends the spouse and civil partner exemption to pension benefits, so a pension passed to you is exempt at the first death. What is left of it when you die is part of your own estate from ${h.D.from}, alongside your own pot, and is taxed then if the total is above your bands.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const pots = [200000, 300000, 400000, 500000, 700000];
    const rows = pots.map((p) => { const r = h.run({ ...EST, pension: p }, HEIR); return [h.m(p), h.m(r.after.estateForTaper), h.m(r.after.threshold), h.m(r.after.iht), h.m(r.heirsAfter.total)]; });
    return `
<h2>Two sets of bands, claimed once</h2>
<p>A transfer between spouses is not automatic money in the bank: it is a percentage carried forward. HMRC's guidance on ${h.src('gov_rnrb_transfer', 'transferring the unused threshold')} says the unused share of each band at the first death is added to the survivor's own band at the second, at the rates in force then. With the bands frozen until ${h.D.freeze}, a full transfer gives ${h.m(2 * I.nrb)} of nil-rate band and up to ${h.m(2 * I.rnrb)} of residence band. The residence part still depends on the home, or the money from its sale under the downsizing rules, going to direct descendants. ${h.src('gov_iht', 'GOV.UK')} applies the rate of ${h.pc(I.rate)} to anything above the combined total.</p>

<h2>The survivor's pot at different sizes</h2>
<p>A survivor often still holds a pension at the second death. Under ${h.src('fa2026_s66', 'section 150A')}, that unused pot now joins the survivor's estate. The table holds the house and savings of the example and changes the pension.</p>
${h.table(['Survivor’s pension', 'Second estate', 'Bands used', 'Inheritance tax', 'Each of two children keeps'], rows, 'Widowed, both bands transferred in full, home £550,000 and savings £150,000 to two children, death at 78, children earning £45,000. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>The bands do not stretch: once the estate passes ${h.m(2 * (I.nrb + I.rnrb))}, each further pound of pension is taxed. The last column also takes off the children's income tax on the pension, which applies because the death is at ${HEIR.age}.</p>

<h2>The example, line by line</h2>
<p>The calculator opens on this case. The ledger repeats it with the same inputs: widowed, full transfer, ${h.m(EST.home)} home to two children who each earn ${h.m(HEIR.heirIncome)}.</p>
${h.ledger(EST, HEIR, `Widow with both bands transferred, death at 78, before and from ${h.D.from}.`)}

<h2>A first death long ago</h2>
<p>The residence band only began in April 2017, yet a survivor whose partner died earlier is not left out. HMRC treats the whole of the late partner's residence band as unused in that case, unless their own estate was above ${h.m(I.taperThreshold)}. The executors still have to make the claim and show the home passing to descendants at the second death.</p>

<h2>Where a pension from the first death ends up</h2>
<p>A pension left to the surviving partner is exempt at the first death under ${h.src('fa2026_s69', 'section 69 of the Act')}. If the survivor keeps it invested, it sits in their estate at the second death. The ${h.a('pension-left-to-spouse-inheritance-tax', 'spouse page')} follows that route, the ${h.a('transferable-nil-rate-band', 'transferable band guide')} covers partial transfers and old deaths, and the ${h.a('inheritance-tax-2-million-estate', `${h.m(I.taperThreshold)} page`)} picks up where the taper begins. Executors, a solicitor or a regulated adviser check the transfer claim and the figures for an actual estate.</p>
`;
  },
});
