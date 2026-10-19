import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';
import type { EstateInput } from '../../lib/engine/iht';

/** HMRC's worked example IHTM45010: a £750,000 estate leaving £50,000 to charity. */
const ihtm = (h: Helpers, share: number) => h.E.estate({ home: 0, savings: 750000, pension: 0, status: 'single', homeToDescendants: false, charityShare: share }, 'after');
/** Case of the page: home to the children, savings and a pension, death from April 2027 before 75. */
const family = (share: number): EstateInput => ({ home: 400000, savings: 500000, pension: 300000, status: 'single', homeToDescendants: true, charityShare: share, heirs: 2 });
/** Smallest share of the free estate (0.1 % steps) that earns the reduced rate. */
const minShare = (h: Helpers, mk: (s: number) => EstateInput) => {
  for (let i = 0; i <= 1000; i++) if (h.E.estate(mk(i / 1000), 'after').charityRateApplies) return i / 1000;
  return 1;
};

export default definePage({
  id: 'inheritance-tax-charity-rate',
  group: 'thresholds',
  order: 150,
  mini: { kind: 'mini:charity', props: { estate: 750000, pct: 6.7 } },
  related: ['inheritance-tax-threshold', 'residence-nil-rate-band', 'inheritance-tax-no-children', 'home'],
  sources: ['ihtm45009', 'gov_tech_note', 'fa2026_s69', 'gov_iht'],
  slug: 'inheritance-tax-charity-rate',
  nav: 'Charity rate of 36 %',
  card: 'The 10 % baseline test, HMRC’s own example rerun, and a pension nominated to a charity.',
  title: 'Inheritance Tax Charity Rate 2026/27: 36% and the 10% Test',
  description: 'Inheritance tax charity rate in 2026/27: how the 10% baseline is worked out, HMRC’s £750,000 example rerun, and what a pension left to charity does from 2027.',
  h1: 'The inheritance tax charity rate: 36 % when a tenth goes to good causes',
  intro: 'A legacy to charity is free of inheritance tax, and a large enough one also lowers the rate on everything else. The size that counts is measured against a figure HMRC calls the baseline.',
  resume: (h) => {
    const I = h.P.iht;
    const r = ihtm(h, 50000 / 750000), none = ihtm(h, 0);
    return `An estate pays inheritance tax at ${h.pc(I.charityRate)} instead of ${h.pc(I.rate)} when gifts to charity are at least ${h.pc(I.charityTest)} of its baseline amount. HMRC's manual at IHTM45009 defines the baseline as the estate after exemptions, less whatever nil-rate band is left, with the charity gift then added back; the residence nil-rate band is not taken off. In HMRC's own example, which this site's engine reproduces, a single person leaves ${h.m(750000)} with ${h.m(50000)} to charity. The baseline is ${h.m(r.baseline)}, the test needs ${h.m(r.baseline * I.charityTest)}, the gift passes, and the tax is ${h.m(r.iht)} rather than ${h.m(r.taxable * I.rate)}. With no gift at all the bill would have been ${h.m(none.iht)}, so the family receives ${h.m(750000 - r.charity - r.iht)} instead of ${h.m(750000 - none.iht)}: the charity gets ${h.m(r.charity)} for a cost to the heirs of ${h.m(r.charity - (none.iht - r.iht))}. From ${h.D.from} a pension can be nominated to a charity too, and it counts towards the test.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    const r = ihtm(h, 50000 / 750000);
    return [
      { q: 'Is the 10 % for the charity rate measured on the whole estate?', a: `No, it is measured on the baseline amount, which is smaller than the estate because the unused nil-rate band of ${h.m(I.nrb)} comes off first. In HMRC's example the estate is ${h.m(750000)} but the baseline is ${h.m(r.baseline)}, so a gift of about ${h.pc(r.baseline * I.charityTest / 750000, 1)} of the estate is already enough. The residence band, by contrast, is not deducted.` },
      { q: 'Does a gift of 9.9 % to charity still lower the rate a little?', a: `No. The test is all or nothing: at ${h.pc(I.charityTest)} of the baseline or more, the whole taxable estate in that component is charged at ${h.pc(I.charityRate)}; a pound short of it, the full ${h.pc(I.rate)} applies. The gift itself is still exempt either way, so a smaller legacy reduces the tax on its own value but not the rate.` },
      { q: 'Can I name a charity as beneficiary of my pension to reach the reduced rate?', a: `A pension nominated to a charity is exempt under the extension of section 23 made by section 69 of the Finance Act 2026, and HMRC's technical note says a charity lump sum death benefit counts towards the ${h.pc(I.charityTest)} test, even where the member died at 75 or over. Whether a scheme accepts a charity nomination is a matter for its own rules.` },
      { q: 'If my estate is below the nil-rate band, does leaving money to charity change anything?', a: `Not for inheritance tax. With no nil-rate band used up there is nothing taxable, the baseline is nil and no rate applies, so a legacy to charity is simply a legacy. The question only arises once the estate, including any pension from ${h.D.from}, is larger than the nil-rate band it has left.` },
      { q: 'Do heirs ever end up with more money because of a charity legacy?', a: `On the engine's figures, never more than with no legacy at all. In HMRC's example the heirs give up ${h.m(r.charity - (ihtm(h, 0).iht - r.iht))} so that the charity receives ${h.m(r.charity)}: the lower rate pays for most of the gift but not all of it. Where the reduced rate does help heirs is against a slightly smaller legacy that misses the test.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const r = ihtm(h, 50000 / 750000), none = ihtm(h, 0);
    const q750 = minShare(h, (s) => ({ home: 0, savings: 750000, pension: 0, status: 'single', homeToDescendants: false, charityShare: s }));
    const heirsOf = (s: number) => { const x = h.run(family(s), { age: 70, heirIncome: 40000 }); return { e: x.after, total: x.heirsAfter.total * 2 }; };
    const q = minShare(h, family);
    const f0 = heirsOf(0), fq = heirsOf(q);
    const shares = [0, 0.05, 0.08, q, 0.12, 0.2];
    const rows = shares.map((s) => { const x = heirsOf(s); return [h.pc(s, 1), h.m(x.e.charity), h.m(x.e.baseline), h.pc(x.e.rate), h.m(x.e.iht), h.m(x.total)]; });
    // Below the qualifying share, the first share at which heirs fall below what they get at the qualifying share.
    let dominated = q;
    for (let i = 0; i <= Math.round(q * 1000); i++) if (heirsOf(i / 1000).total < fq.total) { dominated = i / 1000; break; }
    const fd = heirsOf(dominated);
    // A pension of which £90,000 is nominated to a charity, member dying at 80.
    const heir = { age: 80, heirIncome: 40000, years: 4 };
    const plain = h.run({ home: 400000, savings: 500000, pension: 300000, status: 'single', homeToDescendants: true, heirs: 2 }, heir);
    const nominated = h.run({ home: 400000, savings: 590000, pension: 210000, status: 'single', homeToDescendants: true, charityShare: 90000 / 990000, heirs: 2 }, heir);
    return `
<h2>Ten per cent of what? The baseline amount</h2>
<p>HMRC explains the arithmetic of the reduced rate in its manual at ${h.src('ihtm45009', 'IHTM45009')}. The measure is not the estate on the day of death and not the amount the heirs inherit. It is a figure built in three steps. Start from the estate after exemptions, which means after the charity legacy itself and after anything left to a spouse or civil partner has been taken out. Take off the nil-rate band that is still available, including any band transferred from a late spouse and after lifetime gifts have used their share. Then add the charity gift back on. The result is the baseline, and the legacy passes when it is ${h.pc(I.charityTest)} of that figure or more.</p>
<p>Two consequences follow, and they pull in opposite directions. Because the nil-rate band is deducted, the baseline is smaller than the estate, so the share of the estate needed is below a tenth: for HMRC's ${h.m(750000)} example the engine finds that ${h.pc(q750, 1)} of the estate is enough. Because the residence nil-rate band is not deducted, a family home left to children does nothing to lower the target, even though it lowers the tax. The rate then applies to the whole taxable part of that component of the estate, not just to the slice above some marker.</p>

<h2>HMRC's £750,000 estate, run through the engine</h2>
<p>The manual's worked example at IHTM45010 is short: an estate of ${h.m(750000)} with ${h.m(50000)} to charity and no residence band. The engine takes the same inputs and produces the same answer, which is how the site checks its own code against HMRC's.</p>
${h.table(['Step', 'Amount'], [
  ['Estate after debts', h.m(750000)],
  ['Charity legacy (exempt)', h.m(r.charity)],
  ['Chargeable estate', h.m(r.chargeable)],
  ['Nil-rate band available', h.m(r.nrbLeft)],
  ['Baseline: chargeable less band, plus the legacy', h.m(r.baseline)],
  [`${h.pc(I.charityTest)} of the baseline`, h.m(r.baseline * I.charityTest)],
  ['Rate applied', h.pc(r.rate)],
  ['Inheritance tax', h.m(r.iht)],
  ['Same estate at the full rate', h.m(r.taxable * I.rate)],
], 'IHTM45010 recomputed by the engine. Single person, no home left to descendants.', ['l', 'r'])}
<p>The saving on the rate is ${h.m(r.taxable * I.rate - r.iht)}. Measured against an estate that leaves nothing to charity, which pays ${h.m(none.iht)}, the tax falls by ${h.m(none.iht - r.iht)}, and the family's share drops from ${h.m(750000 - none.iht)} to ${h.m(750000 - r.charity - r.iht)}. Put another way, each pound the charity receives costs the heirs about ${h.pc((r.charity - (none.iht - r.iht)) / r.charity)} of a pound.</p>

<h2>Why a home left to children makes the target bigger</h2>
<p>Take a single person who dies after ${h.D.from}, under 75, with a ${h.m(400000)} home going to two children, ${h.m(500000)} of savings and a ${h.m(300000)} pension that now sits inside the estate. The legacy is a share of the home and savings. The table shows what happens as the share rises, with the residence band fully available because the estate is under ${h.m(I.taperThreshold)}.</p>
${h.table(['Share to charity', 'Legacy', 'Baseline', 'Rate', 'Inheritance tax', 'Two heirs together'], rows, 'Home £400,000 to two children, savings £500,000, pension £300,000, death under 75 from April 2027. Engine figures.', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The baseline here is ${h.m(fq.e.baseline)}. Had the residence band of ${h.m(fq.e.rnrb)} been allowed to come off as well, the legacy needed would have been ${h.m((fq.e.baseline - fq.e.rnrb) * I.charityTest)}; as the law stands it is ${h.m(fq.e.baseline * I.charityTest)}, which the engine reaches at ${h.pc(q, 1)} of the home and savings. The pension adds to the baseline in full, because HMRC's ${h.src('gov_tech_note', 'technical note')} places notional pension property in the general component, alongside the free estate. A family whose pension used to sit outside the estate may therefore find that a legacy written years ago no longer clears the test after ${h.D.from}.</p>

<h2>Leaving part of a pension to charity</h2>
<p>Section 69 of the ${h.src('fa2026_s69', 'Finance Act 2026')} extends the charity exemption in section 23 to pension benefits, so a lump sum paid by the scheme to a charity escapes inheritance tax in the same way as a legacy in a will. The technical note adds two points: the charity lump sum death benefit is tax free even when the member was 75 or over, and it counts towards the ${h.pc(I.charityTest)} test. For deaths at 75 or over that matters twice, because the slice going to charity also avoids the income tax that heirs would have paid on it.</p>
<p>The engine treats the nominated slice like a legacy, which matches the rule. Here the member dies at 80 with the same estate, and ${h.m(90000)} of the pension is nominated to a charity; the two children each have ${h.m(40000)} of other income and draw their shares over four tax years.</p>
${h.table(['', 'Whole pension to the children', `${h.m(90000)} of it to a charity`], [
  ['Rate applied', h.pc(plain.after.rate), h.pc(nominated.after.rate)],
  ['Inheritance tax', h.m(plain.after.iht), h.m(nominated.after.iht)],
  ['Income tax paid by the children on the pension', h.m(plain.heirsAfter.totalIncomeTax), h.m(nominated.heirsAfter.totalIncomeTax)],
  ['The two children keep', h.m(plain.heirsAfter.total * 2), h.m(nominated.heirsAfter.total * 2)],
], 'Death at 80 from April 2027, home £400,000 to the children, savings £500,000, pension £300,000. Engine figures.', ['l', 'r', 'r'])}
<p>The charity receives ${h.m(90000)} and the children's combined share falls by ${h.m(plain.heirsAfter.total * 2 - nominated.heirsAfter.total * 2)}. Part of the gap is closed by the rate, part by the income tax the charity's slice no longer bears. A will legacy of the same size from savings would have given the same inheritance tax but left more pension, and so more income tax, with the children.</p>

<h2>Is there a level where the heirs lose nothing?</h2>
<p>A claim often repeated is that a tenth to charity costs the family nothing. The engine was asked to look for that point by stepping the legacy up one tenth of a per cent at a time on both estates above, and it found none: at every size, the heirs receive less than with no legacy. On the family estate they keep ${h.m(f0.total)} with nothing to charity and ${h.m(fq.total)} with the smallest legacy that qualifies.</p>
<p>The loop does find a different threshold, and it is the useful one. Any legacy between ${h.pc(dominated, 1)} and ${h.pc(q, 1)} of the home and savings leaves the heirs with less than the qualifying legacy of ${h.pc(q, 1)} would, because it pays the full rate on everything. At ${h.pc(dominated, 1)} the children keep ${h.m(fd.total)}, against ${h.m(fq.total)} once the gift is large enough. Inside that band, a bigger gift gives both the charity and the family more. Below it, the reduced rate is simply not worth chasing on tax grounds, and a legacy is a choice made for its own sake. The width of that band depends on the estate, which is why the calculator above lets the share move freely: on a smaller estate with less above the nil-rate band, the qualifying legacy is smaller and so is the zone where topping it up pays for itself.</p>

<h2>Points the calculation leaves out</h2>
<p>The engine assumes the whole estate forms one general component, the part that holds savings, the home and, from ${h.D.from}, the pension, which is where HMRC's technical note puts notional pension property. It also assumes the legacy is a share of the free estate after debts, so its value moves with the estate; a fixed sum written into a will stays where it is while the baseline rises or falls with property prices and the pension. The bands themselves are those of ${h.src('gov_iht', 'GOV.UK')}: a nil-rate band of ${h.m(I.nrb)} and a residence band of up to ${h.m(I.rnrb)}, frozen until ${h.D.freeze}, which means a baseline built on a growing estate keeps growing too.</p>
<p>Nothing here is a recommendation to leave money to charity or to restructure a will. Wording, scheme nominations and the order in which components are measured are technical, and a solicitor, the personal representatives or a regulated adviser are the people who check a real estate. To see the reduced rate on your own figures, the ${h.a('home', 'estate calculator')} accepts a charity share, and the ${h.a('inheritance-tax-threshold', 'threshold guide')} explains the bands it starts from.</p>
`;
  },
});
