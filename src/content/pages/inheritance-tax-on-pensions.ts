import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'inheritance-tax-on-pensions',
  group: 'pensions',
  order: 10,
  mini: { kind: 'mini:pension-iht' },
  related: ['home', 'inheritance-tax-on-pensions-after-75', 'pension-death-benefits-excluded', 'who-pays-inheritance-tax-on-pensions'],
  sources: ['fa2026_s66', 'fa2026_s71', 'fa2026_s69', 'gov_tiin', 'gov_tech_note'],
  slug: 'inheritance-tax-on-pensions',
  nav: 'Inheritance tax on pensions',
  card: 'What the Finance Act 2026 brings into the estate, from which date, and what stays out.',
  title: 'Inheritance Tax on Pensions from April 2027: The New Rules',
  description: 'Inheritance tax on pensions for deaths from 6 April 2027: what the Finance Act 2026 counts in the estate, what is excluded, and the tax on a pot of your size.',
  h1: 'Inheritance tax on pensions: the rules from April 2027',
  intro: 'Unused pension money joins the estate for deaths on or after the start of the 2027/28 tax year. The law is passed; here is what it covers.',
  resume: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const ex = h.run({ home: 0, savings: 500000, pension: 300000, status: 'single', homeToDescendants: false, heirs: 1 }, { age: 70, heirIncome: 0 });
    return `For anyone who dies on or after ${h.D.from}, the money left in their pensions counts as part of their estate for inheritance tax. Section 66 of the Finance Act 2026, which received Royal Assent on ${h.D.assent}, inserts a new section 150A into the Inheritance Tax Act 1984: the member is treated as owning "notional pension property" just before death, equal to the unused funds and lump sum death benefits that can be paid out. Until then most pension pots sat outside the estate because the scheme had discretion over who received them. The thresholds do not change: ${h.m(I.nrb)} of nil-rate band and up to ${h.m(I.rnrb)} of residence band, frozen until ${h.D.freeze}. Above them the pension carries its share of tax at ${h.pc(I.rate)}. A single person with ${h.m(500000)} of savings and a ${h.m(300000)} pension paid ${h.m(ex.before.iht)} on a death before the change; from ${h.D.from} it is ${h.m(ex.after.iht)}, of which ${h.m(ex.after.ihtOnPension)} falls on the pension. HMRC expects ${h.num(N.newlyLiable)} estates a year to pay for the first time.`;
  },
  faqs: (h) => {
    const P = h.P;
    return [
      { q: 'Is the pension inheritance tax change actually law now, or still a proposal?', a: `It is law. The rules are in sections 66 to 71 of the Finance Act 2026, which received Royal Assent on ${h.D.assent}, and section 71 applies them to deaths on or after ${h.D.from}. What is still to come is secondary legislation on the information schemes and executors exchange, and HMRC guidance and forms for April 2027.` },
      { q: 'My husband died in March 2027. Is his pension caught?', a: `No. The new rules apply to deaths on or after ${h.D.from}, so a death on any day before then is dealt with under the old rules: a pension paid at the scheme's discretion stays outside the estate. The date of death decides, not the date the pension is paid or the date probate is granted.` },
      { q: 'Does my State Pension count in my estate?', a: `No. Section 150A only treats pensions under a registered pension scheme, a qualifying non-UK pension scheme or a section 615(3) scheme as part of the estate. The State Pension stops at death; any arrears owed to you at death are simply money the estate is owed, as they already were before ${h.D.from}.` },
      { q: 'Will the pension use up my nil-rate band before my house does?', a: `Neither comes first. The pension and the rest of the estate are added together, the tax-free bands of ${h.m(P.iht.nrb)} and, where a home goes to descendants, up to ${h.m(P.iht.rnrb)} come off the total, and the tax is shared across everything at the same average rate. A pension worth a third of the chargeable estate carries a third of the tax.` },
      { q: 'How many families will pay more because of this?', a: `HMRC's impact note of November 2025 estimates that of about ${h.num(P.pensions.estatesWithPensions)} estates with pension wealth in ${P.pensions.statsYear}, ${h.num(P.pensions.newlyLiable)} will pay inheritance tax for the first time and about ${h.num(P.pensions.payMore)} will pay more, by around ${h.m(P.pensions.averageIncrease)} on average. HMRC calls these a maximum, before families change how they draw their pensions.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const sizes = [100000, 250000, 500000, 1000000];
    const rows = sizes.map((pot) => {
      const r = h.run({ home: 350000, savings: 150000, pension: pot, status: 'single', homeToDescendants: true, heirs: 2 }, { age: 70, heirIncome: 0 });
      return [h.m(pot), h.m(r.before.iht), h.m(r.after.iht), h.m(r.after.ihtOnPension), h.pc(r.after.estateRate, 1)];
    });
    const cpl = h.run({ home: 600000, savings: 200000, pension: 400000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 }, { age: 80, heirIncome: 40000 });
    return `
<h2>What section 150A puts in the estate</h2>
<p>The new section is short and mechanical. It works out a value for each scheme the person belonged to and adds it to their estate as if they had owned it outright. For a money purchase arrangement, which covers personal pensions, SIPPs, stakeholder plans and most workplace schemes built up as a pot, the value is what is held in the pot and can be used to pay benefits on death: an untouched pot, a drawdown fund already in payment, and any money set aside for a lump sum death benefit. For a defined benefits arrangement, the value is the lump sums payable on death: a refund of contributions, a five year guarantee paid as a lump sum, or any death grant that is not excluded. The text asks what "may be and can reasonably be expected to be" paid, using actuarial assumptions where an amount is uncertain, so a scheme with discretion cannot keep a pot out of the estate just by having a choice about who gets it.</p>
<p>That is the real change. Before ${h.D.from}, a lump sum paid at the trustees' discretion was not part of anyone's estate, which is why pensions were described as the most efficient way to pass money on. ${h.src('gov_tiin', 'HMRC\'s impact note')} gives the reason for ending it: pensions were being "increasingly used and marketed as a tax planning vehicle to transfer wealth, rather than for funding retirement". Some schemes, such as the NHS and judicial schemes, were already non-discretionary and already in the estate; the new section treats every scheme the same way.</p>

<h2>A pot of each size, before and after the change</h2>
<p>The table runs the site's engine on one estate: a single person with a ${h.m(350000)} home left to two children and ${h.m(150000)} of savings, who dies before 75. The only thing that changes is the pension pot. Before the change, the estate sits below its ${h.m(I.nrb + I.rnrb)} threshold whatever the pension. After it, every pound of pension adds to the estate and, past the threshold, to the tax.</p>
${h.table(['Unused pension', 'Tax, death before the change', 'Tax, death from 6/4/2027', 'Of which on the pension', 'Estate rate'], rows, 'Home £350,000 to two children, savings £150,000, single, death under 75. Computed by the engine.', ['r', 'r', 'r', 'r', 'r'])}
<p>The last column is the average rate across the whole estate. It matters because tax is not charged on the pension alone: it is spread over everything chargeable in proportion to value. A pension that is half the estate carries half the bill, even if the home could have used the tax-free bands on its own. Above ${h.m(I.taperThreshold)} the pension also starts to remove the residence band, which the ${h.a('residence-nil-rate-band-taper', 'taper page')} works through.</p>

<h2>What stays outside</h2>
<p>Section 150A lists "excluded benefits" that never count. They are the pensions paid to dependants rather than pots passed on:</p>
<ul>
<li>a dependants' scheme pension, such as the widow's or widower's pension of a final salary scheme, or a child's pension;</li>
<li>a trivial commutation lump sum that replaces such a dependants' pension;</li>
<li>a joint life annuity, meaning a dependant's or nominee's annuity bought together with the member's own lifetime annuity;</li>
<li>death in service benefits: anything payable only because the member was working for the employer, or in the relevant work, immediately before death.</li>
</ul>
<p>The exclusion for death in service is narrower than it sounds. HMRC's ${h.src('gov_tech_note', 'technical note')} gives the example of a member whose scheme pays three times salary plus a refund of contributions: only the three times salary is excluded, because the refund would have been paid anyway. A lump sum from a previous employer's scheme, where the member was a deferred member, is in the estate. The ${h.a('pension-death-benefits-excluded', 'excluded benefits guide')} goes through each case.</p>

<h2>Spouses, civil partners and charities</h2>
<p>The exemptions that already applied to the rest of the estate now apply to pension benefits as well. Section 69 of the Act extends the spouse and civil partner exemption of section 18: whatever the surviving partner receives from the pension, as a lump sum or as drawdown, is exempt. The same section extends the charity exemption, so a pension nominated to a charity is tax free, and it counts towards the ${h.pc(I.charityTest)} test for the ${h.pc(I.charityRate)} rate. For a married couple the first death is often tax free; the pension inherited by the survivor then sits in the survivor's estate, which is where the change bites. A widowed parent with a ${h.m(600000)} home, ${h.m(200000)} of savings and ${h.m(400000)} of pension, both bands transferred from the late spouse, pays ${h.m(cpl.before.iht)} on a death before the change and ${h.m(cpl.after.iht)} after it; the ${h.a('pension-left-to-spouse-inheritance-tax', 'page on pensions left to a spouse')} follows that second death.</p>

<h2>Who deals with it</h2>
<p>The personal representatives, the executors named in the will or the administrators of an intestate estate, report the pension on the inheritance tax account and are liable for the tax on it, alongside the beneficiary who receives it. The trustees of a registered scheme are not liable. To make sure the money is there to pay, the representatives can ask a scheme to hold back half of each beneficiary's entitlement for up to ${N.withholdMonths} months after the end of the month of death, and they or the beneficiary can ask the scheme to pay the tax directly from the pot. These mechanisms are new in the Act and explained on the ${h.a('who-pays-inheritance-tax-on-pensions', 'who pays page')}.</p>

<h2>The income tax that follows</h2>
<p>Inheritance tax is not the only tax on an inherited pension. When the member dies at ${N.deathAgeIncomeTax} or over, the beneficiary also pays income tax on what they draw, at their own rates. The Act softens the overlap: the inheritance tax borne on the benefit comes off the taxable amount. Even so, ${h.pc(I.rate)} of inheritance tax followed by the additional rate takes ${h.pc(h.E.combinedRate(I.rate, P.incomeTax.ruk.bands[2].rate))} of every pound. Before ${N.deathAgeIncomeTax}, lump sums are normally free of income tax within the member's allowance. The ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions after 75')} has the calculation for each tax band.</p>
<p>In the same example estate with heirs who each earn ${h.m(40000)}, a death at 80 after the change leaves each heir ${h.m(cpl.heirsAfter.total)}, against ${h.m(cpl.heirsBefore.total)} for the same estate and death age under the old rules.</p>

<h2>What is not settled yet</h2>
<p>The tax itself is fixed by the Act. What HMRC still has to publish is operational: regulations on the information a scheme must give the representatives and when, templates for withholding and payment notices, and updated forms. The technical note says the government will lay the information regulations later in 2026 and that HMRC will provide interactive tools to support representatives by April 2027. Pages written before ${h.D.assent} that describe the rules as a proposal, or that give an end date for the frozen thresholds earlier than ${h.D.freeze}, are out of date.</p>
<p>Nothing on this page is advice about your own pension. A pension nomination, the timing of withdrawals or a gift made from pension money can change both taxes, and each family's case turns on its facts; the representatives of an estate, a solicitor or a regulated financial adviser are the people to check a plan with.</p>
`;
  },
});
