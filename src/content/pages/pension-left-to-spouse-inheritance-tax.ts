import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** David dies first and leaves everything to Margaret; Margaret dies later, widowed, home to two children. */
const first = (h: Helpers) => h.run({ home: 250000, savings: 100000, pension: 350000, status: 'married', spouseEstate: 1, spousePension: 1, homeToDescendants: false, heirs: 1 }, { age: 78, heirIncome: 20000 });
const second = (h: Helpers, inherited = 350000) => h.run({ home: 500000, savings: 200000, pension: 150000 + inherited, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 }, { age: 84, heirIncome: 45000 });

export default definePage({
  id: 'pension-left-to-spouse-inheritance-tax',
  group: 'heirs',
  order: 80,
  mini: { kind: 'mini:spouse' },
  related: ['transferable-nil-rate-band', 'inheritance-tax-on-pensions', 'inheritance-tax-unmarried-couples', 'who-pays-inheritance-tax-on-pensions'],
  sources: ['fa2026_s69', 'fa2026_s66', 'gov_rnrb_transfer', 'gov_inherited_pension'],
  slug: 'pension-left-to-spouse-inheritance-tax',
  nav: 'Pension left to a spouse',
  card: 'Why the first death is exempt, and what the inherited pot does to the survivor’s estate later.',
  title: 'Pension Left to a Spouse: Inheritance Tax Rules for 2027',
  description: 'Pension left to a spouse or civil partner from April 2027: exempt at first death, then taxed in the survivor’s estate. A couple followed to the second death.',
  h1: 'Pension left to a spouse or civil partner: the two deaths',
  intro: 'A pension that passes to a husband, wife or civil partner is free of inheritance tax when it passes. The question is what happens to it next.',
  resume: (h) => {
    const I = h.P.iht;
    const a = first(h), b = second(h);
    return `A pension left to a spouse or civil partner is exempt from inheritance tax at the first death, including for deaths on or after ${h.D.from}, when unused pension funds join the estate. Section 69 of the Finance Act 2026 extends the spouse exemption of section 18 of the Inheritance Tax Act 1984 to pension benefits the surviving partner receives, whether paid as a lump sum or kept in drawdown. The tax is postponed rather than removed: whatever is still in the inherited pot when the survivor dies counts in the survivor's estate, which can then use both partners' nil-rate bands and residence bands, transferred as unused percentages, up to ${h.m(2 * (I.nrb + I.rnrb))} in all. In our example David dies first with a ${h.m(350000)} pot, half of a ${h.m(500000)} home and ${h.m(100000)} of savings, all left to Margaret: the tax is ${h.m(a.after.iht)}. When Margaret dies with the home, ${h.m(200000)} of savings and both pots untouched, her estate pays ${h.m(b.after.iht)}, against ${h.m(b.before.iht)} had she died before the change.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Do I pay inheritance tax on my husband’s pension if he names me as beneficiary?', a: `No inheritance tax is due when the pension passes to you, provided you were married to him or in a civil partnership at his death. Section 69 of the Finance Act 2026 makes pension benefits received by a spouse or civil partner exempt. If he died at ${h.P.pensions.deathAgeIncomeTax} or over, you may still pay income tax on what you draw from the pot, at your own rates.` },
      { q: 'Does an inherited pension count in my own estate when I die?', a: `From ${h.D.from}, yes, if it is still unused pension money in a registered scheme. The inherited pot is pension property that can pay death benefits to your own beneficiaries, so it is added to your estate with your own pension. Money you have already drawn and spent is no longer there to count; money drawn and saved sits in your estate as savings.` },
      { q: 'Is a widow’s pension from a final salary scheme taxed when the widow dies?', a: `A dependants' scheme pension, the regular income a defined benefit scheme pays to a surviving spouse, is an excluded benefit under section 150A, so it never enters either estate as notional pension property. It is taxed as income while it is paid. Arrears owed at the widow's death are a debt due to her estate, as before.` },
      { q: 'If my wife leaves her pension to our children instead of me, what changes?', a: `The share paid to the children is not covered by the spouse exemption, so from ${h.D.from} it is chargeable at her death and uses her nil-rate band of ${h.m(I.nrb)}. Whatever band it uses is no longer available to transfer to your estate later. Below the band there is no tax at the first death, but less is carried over to the second.` },
      { q: 'Can a civil partner inherit a pension tax free in the same way as a spouse?', a: `Yes. The exemption in section 18, as extended to pension benefits by section 69, covers spouses and civil partners in exactly the same terms, and the unused bands of a late civil partner transfer to the survivor's estate on the same percentage basis. Partners who were neither married nor in a civil partnership get neither the exemption nor the transfer.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const a = first(h), b = second(h);
    const remain = [350000, 200000, 0].map((x) => {
      const r = second(h, x);
      return [h.m(x), h.m(r.after.estateForTaper), h.m(r.after.threshold), h.m(r.after.iht), h.m(r.after.ihtOnPension)];
    });
    const split = h.run({ home: 250000, savings: 100000, pension: 350000, status: 'married', spouseEstate: 1, spousePension: 0.5, homeToDescendants: false, heirs: 2 }, { age: 78, heirIncome: 45000 });
    const leftPct = Math.max(0, I.nrb - split.after.chargeable) / I.nrb;
    const higher = P.incomeTax.ruk.bands[1].rate;
    return `
<h2>Why the first death usually costs nothing</h2>
<p>The exemption between spouses is the oldest relief in the inheritance tax code, and it covers everything that passes from one partner to the other: the home, savings, shares and, after the Finance Act 2026, pension money too. The ${h.src('fa2026_s69', 'amendments made by section 69')} add pension benefits to the list of property that qualifies when the person who becomes entitled is the member's spouse or civil partner. So the change of ${h.D.from} brings David's pension into his estate under ${h.src('fa2026_s66', 'section 150A')}, and the same Act lets it out again because Margaret is the one who takes it. His estate is worth ${h.m(a.after.estateForTaper)} for the purposes of the residence band taper, the spouse exemption covers ${h.m(a.after.exemptSpouse)} of it, and the chargeable amount is ${h.m(a.after.chargeable)}.</p>
<p>Two conditions are worth reading closely. The exemption applies to what the survivor actually receives, so a nomination form naming the spouse is not enough if the scheme administrator, using its discretion, pays someone else. And the couple must be married or in a civil partnership at the date of death. Long cohabitation does not count, as the ${h.a('inheritance-tax-unmarried-couples', 'guide for unmarried couples')} shows with figures.</p>

<h2>Where the pot goes next</h2>
<p>A spouse who inherits a money purchase pot usually has a choice: take it as a lump sum, leave it invested in beneficiary drawdown, or buy an annuity with it. Each choice moves the money to a different place for the second estate. Cash taken out and kept in a bank account becomes ordinary savings. A pot left in drawdown remains pension property, and from ${h.D.from} it is counted in the survivor's estate when she dies, because it can then pay death benefits to whoever she has nominated. Money spent on living costs has gone and counts nowhere.</p>
<p>Seen over two deaths, the spouse exemption works as a deferral. Nothing is charged while the money moves between the couple, but every pound still held at the second death meets the bands of that second estate, and from April 2027 that includes pension pounds that used to stay outside.</p>

<h2>Margaret and David, followed to the second death</h2>
<p>David is 78 when he dies. His pot of ${h.m(350000)} goes to Margaret by nomination; his half of their ${h.m(500000)} house and his ${h.m(100000)} of savings pass under his will. Nothing is chargeable, so none of his nil-rate band or residence band is used. Margaret leaves the inherited pot untouched beside her own ${h.m(150000)} pension and dies six years later, leaving everything to their two children.</p>
${h.ledger({ home: 500000, savings: 200000, pension: 500000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 }, { age: 84, heirIncome: 45000 }, 'Margaret’s estate: home £500,000 to two children, savings £200,000, both pensions £500,000, both late husband’s bands unused. Each child earns £45,000. Computed by the engine.')}
<p>Her representatives claim David's unused bands, which brings her threshold to ${h.m(b.after.threshold)}. Without the pension change her estate would sit below it. With the change, the pots lift the estate to ${h.m(b.after.estateForTaper)}, the tax becomes ${h.m(b.after.iht)}, and ${h.m(b.after.ihtOnPension)} of that falls on the pension money. Because Margaret was over ${N.deathAgeIncomeTax}, each child also pays income tax on what they draw, after deducting the inheritance tax the pension bore, so each keeps ${h.m(b.heirsAfter.total)} against ${h.m(b.heirsBefore.total)} under the old rules.</p>

<h2>How much of the inherited pot is left matters</h2>
<p>The same household gives very different second-death bills depending on what Margaret does with David's pot in the years she survives him. The table keeps her home, savings and own pension fixed and changes only the part of his pot still invested when she dies.</p>
${h.table(['Inherited pot left', 'Margaret’s estate', 'Threshold used', 'Tax at her death', 'Of which on pensions'], remain, 'Home £500,000 to two children, savings £200,000, own pension £150,000, widowed with both bands transferred. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>Drawing the money is not free either. If the first partner died at ${N.deathAgeIncomeTax} or over, the survivor pays income tax on every withdrawal at her own marginal rate, which can reach ${h.pc(higher)} or more on a large one. Some widows and widowers draw an inherited pot gradually to stay in a lower band; others leave it alone. The right balance depends on income needs, health and the size of the rest of the estate, which is a conversation for a regulated adviser rather than a rule of thumb.</p>

<h2>Income tax while the survivor draws it</h2>
<p>The spouse exemption is an inheritance tax rule only. ${h.src('gov_inherited_pension', 'GOV.UK’s page on inherited pensions')} sets out the income tax side, which turns on the age of the member who died. When David died under ${N.deathAgeIncomeTax}, lump sums paid to Margaret are generally free of income tax within his lump sum and death benefit allowance, and drawdown income from his pot is tax free. When he died at ${N.deathAgeIncomeTax} or later, as in our example, every payment is taxed as Margaret's income through PAYE. No inheritance tax was borne at the first death, so there is nothing to deduct under the new section 567B: the deduction only becomes useful for the children after the second death.</p>

<h2>Splitting the nomination between the survivor and children</h2>
<p>Some members nominate part of the pot to children at the first death, for example to help with a mortgage. The part paid to the children is not exempt. If David had split his ${h.m(350000)} pot equally, ${h.m(split.after.chargeable)} would have been chargeable at his death. That still falls inside his nil-rate band, so his estate would owe ${h.m(split.after.iht)}, but only ${h.pc(leftPct, 1)} of his band would be left to transfer to Margaret. The ${h.a('transferable-nil-rate-band', 'page on transferring the nil-rate band')} explains how that percentage is worked out and why it matters more than the pounds.</p>

<h2>Pensions that never reach either estate</h2>
<p>Not every pension passed to a spouse needs the exemption at all. Section 150A lists excluded benefits that are left out of the estate whoever receives them: a dependants' scheme pension, such as the survivor's pension of a defined benefit scheme; a joint life annuity bought together with the member's own annuity; and death in service benefits from a job the member still held. A widow receiving a scheme pension from her husband's employer has nothing extra in her estate as a result, though she pays income tax on the payments. The ${h.a('defined-benefit-pension-inheritance-tax', 'defined benefit page')} covers those schemes.</p>

<h2>What the executors of each estate deal with</h2>
<p>At the first death, the executors still report the pension even though no tax is due, because the value matters for the residence band taper and for the transfer claim later. The spouse exemption takes the whole value back out. At the second death, Margaret's representatives report both pensions, claim David's unused bands using his estate papers, and are liable for the tax with the beneficiaries, as the ${h.a('who-pays-inheritance-tax-on-pensions', 'guide on who pays')} sets out. Keeping the first estate's records is therefore part of planning for the second.</p>
<p>The calculator above shows the second estate's threshold for any amount left to others at the first death. None of this is personal advice. The order of deaths, the shape of the nomination and the pace of withdrawals all change the result, and the representatives, a solicitor or a regulated financial adviser should check a real family's position.</p>
`;
  },
});
