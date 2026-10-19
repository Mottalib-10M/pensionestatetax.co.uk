import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** Share of the late spouse's nil-rate band left unused by legacies to people other than the spouse. */
const unusedNrb = (h: Helpers, legacy: number) => Math.max(0, h.P.iht.nrb - legacy) / h.P.iht.nrb;
/** Survivor's estate of £1.1 million with a £500,000 home to the children, both regimes counted from April 2027. */
const survivor = (h: Helpers, nrbShare: number, rnrbShare = 1) => h.E.estate({ home: 500000, savings: 600000, pension: 0, status: 'widowed', transferNrb: nrbShare, transferRnrb: rnrbShare, homeToDescendants: true }, 'after');

export default definePage({
  id: 'transferable-nil-rate-band',
  group: 'thresholds',
  order: 140,
  mini: { kind: 'mini:spouse', props: { first: 100000 } },
  related: ['pension-left-to-spouse-inheritance-tax', 'residence-nil-rate-band', 'inheritance-tax-threshold', 'residence-nil-rate-band-taper'],
  sources: ['gov_rnrb_transfer', 'gov_iht', 'fa2026_s69', 'gov_rnrb'],
  slug: 'transferable-nil-rate-band',
  nav: 'Transferable nil-rate band',
  card: 'How the unused percentage of a late spouse’s bands is worked out, capped and claimed.',
  title: 'Transferable Nil-Rate Band 2026/27: Working Out the Share',
  description: 'Transferable nil-rate band in 2026/27: how a late spouse’s unused percentage is measured, the 100 % ceiling, pre-2017 deaths and legacies to children.',
  h1: 'Transferable nil-rate band: measuring what the first spouse left unused',
  intro: 'What passes from a late husband, wife or civil partner is a fraction of a band, not a sum of money. Getting that fraction right is most of the work.',
  resume: (h) => {
    const I = h.P.iht;
    const u = unusedNrb(h, 100000);
    const s = survivor(h, u);
    return `The transferable nil-rate band lets the estate of a widow, widower or surviving civil partner add the share of the late partner's nil-rate band that went unused at the first death. HMRC's guidance on transferring unused thresholds measures that share as a percentage, and the percentage is then applied to the band in force when the survivor dies, not to the band of the year of the first death. The residence nil-rate band transfers on the same basis. Each transfer is capped at one full extra band, so a survivor's estate can reach ${h.m(2 * I.nrb)} of nil-rate band plus ${h.m(2 * I.rnrb)} of residence band, both frozen until ${h.D.freeze}. If the first spouse left ${h.m(100000)} to children and the rest to the survivor, ${h.pc(u, 1)} of the nil-rate band is unused. A survivor's estate of ${h.m(1100000)}, home of ${h.m(500000)} to the children, then has a threshold of ${h.m(s.nrb + s.rnrb)} and pays ${h.m(s.iht)}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Is the transferred nil-rate band a fixed amount or a percentage?', a: `A percentage. HMRC looks at how much of the first spouse's band was used by chargeable legacies and lifetime gifts, expresses the remainder as a share of the band at that date, and applies that share to the band when the survivor dies. With the bands frozen at ${h.m(I.nrb)} until ${h.D.freeze}, the two calculations give the same pounds for now.` },
      { q: 'My first wife and my second wife both died. Can I inherit two nil-rate bands?', a: `You do not inherit the bands yourself; your estate claims them when you die. It can collect unused percentages from more than one late spouse or civil partner, but the total added is limited to 100 % of one band. So the most your estate can have is double the nil-rate band and double the residence band, however many marriages ended in bereavement.` },
      { q: 'Does a divorced ex-spouse’s unused band pass to me?', a: `No. The transfer only works between people who were married or in a civil partnership when the first of them died. A marriage that ended in divorce, or a civil partnership that was dissolved, leaves nothing to transfer, and unmarried partners never had a transfer to begin with. Only the band of a partner who died while still married to you counts.` },
      { q: 'My husband died in 2012 and had no house. Can my estate still claim his residence band?', a: `When the first spouse died before ${h.date('2017-04-06')}, HMRC treats 100 % of the residence nil-rate band as unused, because the band did not exist then. Your estate can claim that extra band provided his estate was not above ${h.m(I.taperThreshold)}. It only helps if your own home, or your share of it, goes to direct descendants.` },
      { q: 'Who claims the late spouse’s unused allowance, and when?', a: `The personal representatives of the second estate make the claim, as part of dealing with that estate after the survivor's death. They need to show what the first spouse owned, what the will or intestacy did with it, and which legacies were chargeable. Papers from the first estate, such as the will and any account sent to HMRC, make that much easier years later.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht;
    const legacies = [0, 50000, 100000, 200000, I.nrb, 400000];
    const rows = legacies.map((l) => {
      const u = unusedNrb(h, l), s = survivor(h, u);
      return [h.m(l), h.pc(u, 1), h.m(s.nrb), h.m(s.nrb + s.rnrb), h.m(s.iht)];
    });
    // First spouse leaves a £120,000 share of the home to the children, the rest of a £400,000 estate to the survivor.
    const homeShare = 120000;
    const rb = h.E.residenceBand({ estate: 400000, home: homeShare, homeToDescendants: true });
    const rUnused = (I.rnrb - rb.rnrb) / I.rnrb;
    const nrbUsed = Math.max(0, homeShare - rb.rnrb);
    const sHome = survivor(h, (I.nrb - nrbUsed) / I.nrb, rUnused);
    // Widowed twice: part of the first husband’s band unused, all of the second husband’s.
    const twice = survivor(h, Math.min(1, 0.4 + 1));
    const pensionKids = h.run({ home: 0, savings: 150000, pension: 240000, status: 'married', spouseEstate: 1, spousePension: 0.5, homeToDescendants: false, heirs: 2 }, { age: 70, heirIncome: 30000 });
    const pkUnused = unusedNrb(h, pensionKids.after.chargeable);
    const pkBefore = unusedNrb(h, pensionKids.before.chargeable);
    return `
<h2>A fraction of a band, not a sum of money</h2>
<p>Every person has a nil-rate band, and when the first partner of a married couple dies, the part of it not needed by that estate is not lost. The rule that keeps it alive is expressed in proportions. HMRC takes the band that applied at the first death, subtracts what was used by chargeable legacies and by gifts made in the seven years before, and divides what is left by the band. The result, a percentage, is the only thing carried forward. At the second death it is multiplied by the band then in force and the product is added to the survivor's own band, as the ${h.src('gov_rnrb_transfer', 'HMRC guidance')} sets out.</p>
<p>Working in percentages protects older widowhoods. Someone whose wife died long ago, under a band of a different size, does not carry an old figure forward: if her estate used none of its band, the percentage is ${h.pc(1)} and the survivor's estate gets a full band at the value of the year the survivor dies. While the thresholds stay frozen until ${h.D.freeze}, a percentage and a sum produce the same answer for a first death in recent years, but the method still governs every claim.</p>

<h2>Legacies to children at the first death</h2>
<p>The common way to use up part of the first band is a gift in the will to someone other than the surviving partner: cash to children, a share of the residue to grandchildren, a legacy to a sibling. Anything to the spouse or civil partner is exempt and uses nothing. Anything to a charity is exempt too. Everything else counts against the band. The table runs the second estate through the engine for different legacies at the first death, with the survivor leaving ${h.m(1100000)}, a ${h.m(500000)} home to the children, and the late partner's residence band untouched.</p>
${h.table(['Legacy to others at first death', 'Nil-rate band unused', 'Nil-rate band at second death', 'Total threshold', 'Tax at second death'], rows, 'Survivor’s estate £1,100,000 including a £500,000 home to children; late spouse’s residence band fully unused. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>Two things stand out. A legacy that fits inside the first band costs no tax when it is paid but comes back, pound for pound at the rate of ${h.pc(I.rate)}, at the second death whenever the survivor's estate is above its threshold. And a legacy above the band is taxed at the first death and leaves nothing to transfer, so the bottom rows show the survivor's estate falling back to a single band. The calculator above lets you change the legacy and the second estate.</p>

<h2>Part of the home left to children first</h2>
<p>The residence band has its own percentage, measured separately. Suppose the first partner's ${h.m(400000)} estate included a ${h.m(homeShare)} share of the family home, which the will left straight to the two children, with everything else going to the survivor. That share is closely inherited, so it uses ${h.m(rb.rnrb)} of the first estate's residence band and nothing of the nil-rate band. The unused percentages are therefore ${h.pc(rUnused, 1)} of the residence band and ${h.pc((I.nrb - nrbUsed) / I.nrb, 1)} of the nil-rate band.</p>
<p>When the survivor later dies with the ${h.m(1100000)} estate used in the table, the threshold becomes ${h.m(sHome.nrb + sHome.rnrb)} and the tax ${h.m(sHome.iht)}. In the first row of the table, where the first estate passed entirely to the survivor, the second estate paid ${h.m(survivor(h, 1).iht)}. Leaving part of the home to the children at the first death uses residence band there and leaves less to carry over, so the comparison always needs both estates side by side.</p>

<h2>When the first death came before ${h.date('2017-04-06')}</h2>
<p>The residence band did not exist before the 2017/18 tax year, so no estate before then could have used it. The ${h.src('gov_rnrb_transfer', 'transfer rules')} treat 100 % of it as unused for any spouse or civil partner who died before ${h.date('2017-04-06')}, unless their estate was worth more than ${h.m(I.taperThreshold)}. A widow whose husband died in 2010 can therefore have an estate claiming a full extra residence band today, even though he never owned a home. Her estate must still leave her own home, or her share, to direct descendants for either residence band to apply, as explained on the ${h.a('residence-nil-rate-band', 'residence band page')}.</p>

<h2>Widowed more than once</h2>
<p>A person who has lost two spouses can bring two unused percentages to the claim, but the law sets a ceiling: the total added to the survivor's own band can never exceed 100 %. Take a widow whose first husband used ${h.pc(0.6)} of his band on legacies to his children from an earlier marriage, leaving ${h.pc(0.4)}, and whose second husband left everything to her. On paper her estate has ${h.pc(1.4)} to add; the ceiling cuts it to ${h.pc(1)}. Her estate of ${h.m(1100000)} has the same threshold, ${h.m(twice.nrb + twice.rnrb)}, as an estate with a single fully unused transfer, and pays ${h.m(twice.iht)}. The same ceiling applies to the residence band.</p>

<h2>Divorce, separation and couples who never married</h2>
<p>The transfer depends on the couple being married or in a civil partnership at the first death. Divorced couples and former civil partners have nothing to transfer. Partners who lived together without marrying never qualify, which is one of several differences set out in the ${h.a('inheritance-tax-unmarried-couples', 'guide for unmarried couples')}.</p>

<h2>Pensions and the percentage from April 2027</h2>
<p>From ${h.D.from}, unused pension money is part of the estate, and the ${h.src('fa2026_s69', 'spouse exemption in section 69')} covers pension benefits paid to the surviving partner. A nomination is therefore one more place where the first band can be used without anyone noticing. Imagine a member with ${h.m(150000)} of savings left to the spouse and a ${h.m(240000)} pot nominated half to the spouse and half to two children. Before the change the children's half sat outside the estate and ${h.pc(pkBefore, 1)} of the band stayed unused. For a death after it, the ${h.m(pensionKids.after.chargeable)} paid to the children is chargeable, no tax is due because it fits in the band, and only ${h.pc(pkUnused, 1)} of the band is left to transfer.</p>
<p>The second death has its own hazard. The transferred residence band is part of the survivor's band, so it is reduced by the taper once the survivor's estate, pension included, passes ${h.m(I.taperThreshold)}. The ${h.a('residence-nil-rate-band-taper', 'taper page')} works through that case, and the ${h.a('pension-left-to-spouse-inheritance-tax', 'page on pensions left to a spouse')} follows one couple from the first death to the second.</p>

<h2>Making the claim at the second death</h2>
<p>Nothing is claimed at the first death: the transfer belongs to the survivor's estate and is claimed by its personal representatives. They have to establish the late partner's estate, the will or intestacy that applied, and the chargeable legacies and gifts, which can mean finding papers from decades earlier. Couples who keep the first estate's will and valuations together with their own papers spare the second set of representatives a search. A solicitor or the representatives themselves check the figures for a real estate; this page describes the rule and does not replace that check.</p>
`;
  },
});
