import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** Alex dies at 72 leaving a £300,000 share of the home, £120,000 of savings and a £280,000 pot, all to Sam. */
const alex = (h: Helpers, toChild = false, age = 72) => h.run({ home: 300000, savings: 120000, pension: 280000, status: 'single', homeToDescendants: toChild, heirs: 1 }, { age, heirIncome: 30000 });
const married = (h: Helpers) => h.run({ home: 300000, savings: 120000, pension: 280000, status: 'married', spouseEstate: 1, spousePension: 1, homeToDescendants: false, heirs: 1 }, { age: 72, heirIncome: 30000 });
/** Sam's own estate later, home to two children: single (never married) or widowed with both bands transferred. */
const sam = (h: Helpers, widowed: boolean) => h.run({ home: 600000, savings: 150000, pension: 250000, status: widowed ? 'widowed' : 'single', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2 }, { age: 80, heirIncome: 40000 });

export default definePage({
  id: 'inheritance-tax-unmarried-couples',
  group: 'heirs',
  order: 90,
  mini: { kind: 'mini:unmarried' },
  related: ['pension-left-to-spouse-inheritance-tax', 'transferable-nil-rate-band', 'residence-nil-rate-band', 'inheritance-tax-on-pensions'],
  sources: ['gov_iht', 'fa2026_s69', 'gov_rnrb', 'gov_rnrb_transfer', 'gov_iht_gifts'],
  slug: 'inheritance-tax-unmarried-couples',
  nav: 'Unmarried couples',
  card: 'No partner exemption, no band carried over, and a pension that becomes taxable from April 2027.',
  title: 'Inheritance Tax for Unmarried Couples in 2026/27 and 2027',
  description: 'Inheritance tax for unmarried couples: no exemption between partners, no band transfer, and from April 2027 a pension left to a partner is taxed. 2026/27 rules.',
  h1: 'Inheritance tax for unmarried couples and cohabiting partners',
  intro: 'Living together for decades changes nothing in inheritance tax law. A partner who is not a spouse or civil partner inherits like anyone else, and from 2027 that includes the pension.',
  resume: (h) => {
    const I = h.P.iht;
    const a = alex(h), m = married(h);
    return `Inheritance tax treats an unmarried partner as an unrelated beneficiary, however long the couple lived together. There is no exemption for what passes between cohabiting partners, unlike the spouse and civil partner exemption, and the survivor's estate cannot later claim the unused nil-rate band or residence band of the partner who died first. The residence band of up to ${h.m(I.rnrb)} applies only to a home left to direct descendants, which a partner is not. From ${h.D.from} the gap widens, because unused pension money joins the estate and the spouse exemption that the Finance Act 2026 extends to pensions does not reach a partner. Alex dies at 72 with a ${h.m(300000)} share of the home, ${h.m(120000)} of savings and a ${h.m(280000)} pot, all left to Sam. Before the change the tax is ${h.m(a.before.iht)}; for a death after it, ${h.m(a.after.iht)}. Had they been married or in a civil partnership, it would be ${h.m(m.after.iht)}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Do cohabiting partners pay inheritance tax on what they leave each other?', a: `Yes, on anything above the nil-rate band of ${h.m(I.nrb)}. The exemption for transfers between partners only covers spouses and civil partners. A cohabiting partner who inherits the home, savings and, from ${h.D.from}, a nominated pension pot is treated exactly as a friend or a nephew would be, and the estate pays tax at ${h.pc(I.rate)} on the excess.` },
      { q: 'Can my partner get the residence nil-rate band if I leave her our house?', a: `No. The residence band is available only when the home goes to direct descendants: children, grandchildren and their spouses or civil partners, plus step, adopted and foster children and children under guardianship. A partner who is neither a descendant nor the spouse of one does not qualify, so a home left to her uses only the ordinary nil-rate band.` },
      { q: 'Is a pension nominated to an unmarried partner taxed from 2027?', a: `For deaths on or after ${h.D.from}, yes, if the estate is above its threshold. The pot counts in the estate, and the exemption that section 69 of the Finance Act 2026 gives to pension benefits covers spouses, civil partners and charities only. Excluded benefits, such as a dependants' scheme pension paid to a financially dependent partner, stay outside.` },
      { q: 'Are gifts to my partner during my lifetime exempt?', a: `Not in the way gifts to a spouse are. A gift to an unmarried partner is an ordinary gift: it can use the annual exemption of ${h.m(I.annualExemption)} and the small and regular gifts from income rules, and anything above them drops out of the estate only if the giver lives ${h.P.iht.giftYears} years afterwards. Gifts within the last ${h.P.iht.giftYears} years use the nil-rate band first.` },
      { q: 'If we marry late in life, does the spouse exemption apply straight away?', a: `The exemption depends on the couple being married, or in a civil partnership, at the date of death, and from ${h.D.from} it covers pension benefits as well as the rest of the estate. That is a statement of the legal position only. Whether marriage or a civil partnership suits a couple involves wills, property, pensions and much more than tax, and a solicitor looks at those together.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const a = alex(h), c = alex(h, true), old = alex(h, false, 79), m = married(h);
    const s1 = sam(h, false), s2 = sam(h, true);
    const rows = [
      ['Unmarried, everything to Sam', h.m(a.before.iht), h.m(a.after.iht), h.m(a.after.ihtOnPension)],
      ['Unmarried, home to Alex’s daughter', h.m(c.before.iht), h.m(c.after.iht), h.m(c.after.ihtOnPension)],
      ['Married or civil partners, everything to Sam', h.m(m.before.iht), h.m(m.after.iht), h.m(m.after.ihtOnPension)],
    ];
    return `
<h2>No exemption between partners</h2>
<p>The spouse exemption is what makes the first death in most married households tax free. It has never extended to couples who live together without marrying or registering a civil partnership, and nothing in the 2026 legislation changes that. ${h.src('gov_iht', 'GOV.UK')} describes the exemption for what is left to a spouse or civil partner, and a cohabiting partner falls outside both words. In practice an estate left to a cohabiting partner is treated as if it were left to a friend. Everything above the nil-rate band of ${h.m(I.nrb)} is taxed at ${h.pc(I.rate)}, and the partner's need for a home or an income is not part of the calculation.</p>
<p>Owning the home together does not create an exemption either. What counts is the share the partner who died owned: a half share of a house worth ${h.m(600000)} is ${h.m(300000)} in the estate, and that share is taxed like any other asset when it passes to the survivor.</p>

<h2>Alex and Sam: the same estate under three set-ups</h2>
<p>Alex and Sam have lived together for twenty years. Alex has a daughter from an earlier relationship. When Alex dies at 72 the estate holds a ${h.m(300000)} share of the house, ${h.m(120000)} of savings and a defined contribution pot of ${h.m(280000)} nominated to Sam. The table runs the engine for a death before the pension change and for one after it, and compares three arrangements of the same assets.</p>
${h.table(['Arrangement', 'Death before the change', 'Death from 6/4/2027', 'Of which on the pension'], rows, 'Share of home £300,000, savings £120,000, pension £280,000, death at 72. Computed by the engine.', ['l', 'r', 'r', 'r'])}
<p>Before the change the pension sat outside the estate, so the tax fell only on the house share and savings above the nil-rate band. After it, the pot is part of the estate and of the bill: ${h.m(a.after.ihtOnPension)} of the ${h.m(a.after.iht)} is attributable to the pension. Sam would keep ${h.m(a.heirsAfter.total)} from everything, against ${h.m(a.heirsBefore.total)} for the same death a day before the new rules start. The married row is not a recommendation; it shows what the exemption is worth to this estate so the figure can be weighed with everything else a couple considers.</p>

<h2>The residence band follows the children, not the partner</h2>
<p>The second row shows the only route to a residence band for this couple: Alex's daughter inherits the house share, and Sam takes the savings and the pension. The ${h.src('gov_rnrb', 'HMRC guidance on the residence band')} lists who counts as a direct descendant, and a cohabiting partner is not among them. Under that arrangement the estate pays ${h.m(c.after.iht)} after April 2027 instead of ${h.m(a.after.iht)}, but Sam no longer inherits the share of the home, which is a family decision with consequences well beyond tax.</p>

<h2>What the pension changes from April 2027</h2>
<p>Many cohabiting couples relied on the pension as the asset that could pass to a partner free of inheritance tax, because a discretionary scheme kept it outside the estate. That ends for deaths on or after ${h.D.from}. The ${h.src('fa2026_s69', 'exemptions extended by section 69')} let pension benefits out of the charge when a spouse, a civil partner or a charity receives them; a partner is none of these. The pot is then taxed at the estate's average rate alongside the house and the savings.</p>
<p>The bill also has to be paid from somewhere. Under the new rules the personal representatives are liable for the tax on the pension, and so is the person who receives it, which here means Sam. To keep the money available, the representatives can serve a withholding notice that limits what the scheme pays Sam to ${h.pc(N.withholdShare)} of the entitlement for up to ${N.withholdMonths} months after the end of the month of death. Either side can instead ask the scheme to pay the tax on the pot directly, which avoids Sam having to find cash while the house share and savings are still being dealt with. The ${h.a('who-pays-inheritance-tax-on-pensions', 'guide on who pays')} covers both notices.</p>
<p>Two exclusions still matter. A dependants' scheme pension, the regular income some defined benefit schemes pay to a surviving partner who qualifies under the scheme's own rules, is an excluded benefit and never counts. So is a death in service benefit from a job the member held at death. Both are taxed as the partner's income where income tax applies, but neither adds to the estate.</p>

<h2>Income tax on top, when the member was 75 or over</h2>
<p>Sam's position worsens if Alex dies at 79 rather than 72. Inheritance tax is the same, ${h.m(old.after.iht)}, but because the member died at ${N.deathAgeIncomeTax} or later, every pound Sam draws from the pot is taxed as income. Drawn in one tax year on top of an income of ${h.m(30000)}, that costs Sam ${h.m(old.heirsAfter.totalIncomeTax)} of income tax after deducting the inheritance tax borne on the pension, leaving ${h.m(old.heirsAfter.total)} in all. Spreading withdrawals over several years lowers the income tax; the ${h.a('inheritance-tax-on-pensions-after-75', 'guide to pensions after 75')} has the rates band by band.</p>

<h2>No bands carried to the survivor’s estate</h2>
<p>For married couples, the second estate collects whatever the first left unused. An unmarried survivor's estate gets nothing from the partner's bands, because the ${h.src('gov_rnrb_transfer', 'transfer of unused thresholds')} is reserved for spouses and civil partners. Years later, Sam dies with a ${h.m(600000)} home left to two children, ${h.m(150000)} of savings and a ${h.m(250000)} pension. As someone who never married, Sam's estate has a threshold of ${h.m(s1.after.threshold)} and pays ${h.m(s1.after.iht)}. The same estate of a widowed person with both bands transferred would have a threshold of ${h.m(s2.after.threshold)} and pay ${h.m(s2.after.iht)}. The ${h.a('transferable-nil-rate-band', 'transferable band guide')} explains how those percentages are measured.</p>
<p>The money Alex left to Sam may therefore be taxed twice: once at Alex's death, with no partner exemption, and again within Sam's estate, with only one set of bands. Quick succession relief can reduce the second charge when the deaths are close together, and it applies to pension property as well.</p>

<h2>Gifts made while both are alive</h2>
<p>Lifetime gifts between partners follow the ordinary rules on ${h.src('gov_iht_gifts', 'GOV.UK’s gifts page')}. The annual exemption of ${h.m(I.annualExemption)}, small gifts, and regular gifts out of surplus income are all available; a larger gift becomes exempt only if the giver survives ${h.P.iht.giftYears} years. Regular gifts from income have no limit when they come from income, follow a pattern and leave the giver able to meet their usual living costs. The ${h.a('seven-year-rule-inheritance-tax', '${h.P.iht.giftYears} year rule page')} sets out the taper.</p>

<h2>Marriage and civil partnership as legal facts</h2>
<p>Marriage and civil partnership have the same effect on inheritance tax: the exemption on death and on lifetime gifts, the transfer of unused bands, and from April 2027 the exemption for pension benefits. Those are the legal consequences. They are not a reason, on their own, to marry or register a partnership, and couples weigh them alongside everything else that changes. Wills, property ownership and pension nominations each play a part, and a solicitor or regulated adviser checks a couple's real position.</p>
`;
  },
});
