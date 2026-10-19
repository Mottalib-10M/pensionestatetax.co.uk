import { definePage } from '../../lib/guide-types';

// Worked case: a divorced parent of 58 who dies while still employed.
const SALARY = 60000;
const DIS = 3 * SALARY;
const REFUND = 25000;
const OLD_POT = 120000;
const CASE = { home: 350000, savings: 100000, status: 'single' as const, homeToDescendants: true, heirs: 2 };
const HEIR = { age: 58, heirIncome: 40000 };

export default definePage({
  id: 'pension-death-benefits-excluded',
  group: 'pensions',
  order: 40,
  mini: { kind: 'mini:excluded', props: { dis: DIS, pot: OLD_POT + REFUND, dep: 9000 } },
  related: ['inheritance-tax-on-pensions', 'defined-benefit-pension-inheritance-tax', 'pension-left-to-spouse-inheritance-tax', 'who-pays-inheritance-tax-on-pensions'],
  sources: ['fa2026_s66', 'gov_tech_note', 'gov_tiin', 'fa2026_s69', 'fa2026_s68'],
  slug: 'pension-death-benefits-excluded',
  nav: 'Excluded death benefits',
  card: 'Death in service, dependants’ pensions, joint life annuities: what section 150A leaves out of the estate.',
  title: 'Pension Death Benefits Excluded From IHT: 2027 List',
  description: 'Pension death benefits excluded from inheritance tax from April 2027: death in service, dependants’ pensions, joint life annuities, and what still counts.',
  h1: 'Pension death benefits excluded from inheritance tax',
  intro: 'Not every payment a scheme makes on death joins the estate. The Act names four kinds of benefit that stay out, and HMRC has drawn the edges of each one.',
  resume: (h) => {
    const I = h.P.iht;
    const a = h.run({ ...CASE, pension: OLD_POT + REFUND }, HEIR);
    const b = h.run({ ...CASE, pension: OLD_POT + REFUND + DIS }, HEIR);
    return `From ${h.D.from}, section 150A of the Inheritance Tax Act 1984 brings unused pension funds and lump sum death benefits into the estate, but subsection (6) lists "excluded benefits" that never count. There are four: a dependants' scheme pension; a trivial commutation lump sum that replaces such a pension; a dependant's or nominee's annuity bought together with the member's own lifetime annuity; and any benefit paid only because the member was in a particular employment or work immediately before death, which covers death in service lump sums from the current job. HMRC's technical note keeps two things inside the estate: death in service cover from an old job where the member was deferred, and a refund of contributions that would have been paid anyway. A parent of 58 who dies in service with three times a ${h.m(SALARY)} salary as cover, a ${h.m(REFUND)} refund and a ${h.m(OLD_POT)} pot from an old employer owes ${h.m(a.after.iht)} of inheritance tax at ${h.pc(I.rate)} above the bands; if the cover counted, it would be ${h.m(b.after.iht)}.`;
  },
  faqs: (h) => {
    const N = h.P.pensions;
    return [
      { q: 'Will the death in service payout from my current employer be counted in my estate from 2027?', a: `No. Section 150A(6) excludes any benefit that is payable only because the member was in employment or work of a particular description immediately before death. Life cover of a multiple of salary paid by your current employer's scheme falls in that category, so it stays outside the estate after ${h.D.from}, as it was before. Other money the same scheme pays on death may not be excluded.` },
      { q: 'Is life cover from a job I left years ago excluded too?', a: `Not if the cover belongs to a pension scheme where you are now a deferred member. HMRC's technical note says that a death in service benefit from a previous employment is not excluded, because the condition is being in that employment immediately before death. A lump sum of that kind counts as notional pension property from ${h.D.from}.` },
      { q: 'Is a refund of my pension contributions excluded along with the death in service lump sum?', a: `No. The technical note gives the example of a scheme paying three times salary plus a refund of the member's contributions. Only the multiple of salary is excluded; the refund would have been paid whether or not the member was still working, so it is not paid "only because" of the employment and it counts in the estate.` },
      { q: 'What is the difference between an excluded and an exempt pension benefit?', a: `An excluded benefit is left out of the estate entirely, so it never uses tax-free bands and never counts towards the ${h.m(h.P.iht.taperThreshold)} taper. An exempt benefit is counted but relieved: a pension paid to a spouse, civil partner or charity carries no inheritance tax, yet its value is still part of the estate measured for the residence band taper.` },
      { q: 'Does a joint life annuity that pays my wife after my death count as part of my estate?', a: `Not when the survivor's annuity was bought together with your own lifetime annuity. Section 150A(6) lists a dependant's or nominee's annuity purchased in that way as an excluded benefit. The income your wife receives is taxed as her income when you were ${N.deathAgeIncomeTax} or over at death, but there is no inheritance tax on the annuity's value.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const a = h.run({ ...CASE, pension: OLD_POT + REFUND }, HEIR);
    const b = h.run({ ...CASE, pension: OLD_POT + REFUND + DIS }, HEIR);
    const rows = [
      ['Death in service lump sum, current job', h.m(DIS), 'Excluded'],
      ['Refund of contributions from the same scheme', h.m(REFUND), 'In the estate'],
      ['Pot left with a previous employer', h.m(OLD_POT), 'In the estate'],
      ['Home left to the two children', h.m(CASE.home), 'In the estate'],
      ['Savings', h.m(CASE.savings), 'In the estate'],
      ['Inheritance tax from 6/4/2027, as the law stands', '', h.m(a.after.iht)],
      ['Inheritance tax if the cover were counted', '', h.m(b.after.iht)],
    ];
    return `
<h2>Excluded is not the same as exempt</h2>
<p>Two words do different jobs in the new rules. An excluded benefit is removed before anything is added up: it is not notional pension property, it adds nothing to the estate's value, and it plays no part in any threshold. An exempt benefit is counted first and relieved afterwards. ${h.src('fa2026_s69', 'Section 69 of the Finance Act 2026')} extends the spouse, civil partner and charity exemptions to pension benefits, so a pot nominated to a widow or to a charity carries no inheritance tax, but its value is still in the estate.</p>
<p>The difference shows up at the edges. The residence nil-rate band is tapered on the estate before exemptions, so a pension left to a spouse still counts towards the ${h.m(I.taperThreshold)} test, while a death in service lump sum does not. The ${h.src('fa2026_s68', 'withholding rules in section 68')} also leave both excluded and exempt benefits alone: a scheme told to hold back half of a beneficiary's entitlement does not hold back either.</p>

<h2>The four excluded benefits, one by one</h2>
<p>The list in ${h.src('fa2026_s66', 'section 150A(6)')} is short and closed. Anything not on it that a scheme can pay on death is in the estate.</p>
<p><strong>Dependants' scheme pensions.</strong> This is the classic widow's, widower's or child's pension of a defined benefit scheme: a regular income the scheme pays to a dependant after the member's death. HMRC's ${h.src('gov_tiin', 'impact note')} confirms that dependants' scheme pensions from defined benefit and collective money purchase arrangements are outside the change. They have always been taxed as the dependant's income and still are.</p>
<p><strong>Trivial commutation of a dependants' pension.</strong> When a dependant's pension is small, a scheme can pay it as a one-off lump sum instead. If that lump sum extinguishes the dependants' scheme pension, it is excluded in the same way as the pension it replaces. The exclusion follows the pension; a lump sum that is not replacing one does not qualify.</p>
<p><strong>A joint life annuity bought together.</strong> When the member bought a lifetime annuity with a dependant's or nominee's annuity attached, the survivor's annuity is excluded. The condition is that both were purchased together. A pot held in drawdown and later used by the beneficiary to buy an annuity is a different thing: its value at death is notional pension property.</p>
<p><strong>Death in service.</strong> The last category is defined by a test of employment: a benefit payable only because the member was in employment or other work of a particular description immediately before death. Life cover of a multiple of salary under a workplace scheme is the obvious example. The words "only" and "immediately before death" do most of the work, and they are what limit the exclusion.</p>

<h2>Death in service: where the line falls</h2>
<p>${h.src('gov_tech_note', 'HMRC’s technical note')} draws the line with an example: a scheme that pays three times salary and a refund of the member's contributions to the scheme. The three times salary is excluded because nothing would be paid without the employment. The refund is not excluded, since it would be paid on death in any case, employed or not, and it therefore counts as part of the estate.</p>
<p>The same reasoning covers old jobs. A member who has left an employer and remains a deferred member of its scheme is no longer "in employment immediately before death" with that employer, so a lump sum death benefit that scheme pays is in the estate. People with several jobs over a career often have deferred benefits in more than one scheme; only the cover from the job they hold at death is outside.</p>

<h2>A worked case: dying in service at 58</h2>
<p>Take a divorced parent of two who dies at 58 on or after ${h.D.from} while still employed on a salary of ${h.m(SALARY)}. The employer's scheme pays three times salary as death in service cover and returns ${h.m(REFUND)} of the member's own contributions. There is also a ${h.m(OLD_POT)} pot left with a previous employer, a ${h.m(CASE.home)} home that goes to the children and ${h.m(CASE.savings)} of savings.</p>
${h.table(['Item', 'Value', 'Treatment'], rows, 'Death in service at 58, two children, single. Inheritance tax computed by the engine.', ['l', 'r', 'r'])}
<p>With the cover excluded, the estate counted for inheritance tax is ${h.m(a.after.estateForTaper)} against a threshold of ${h.m(a.after.threshold)}, and the bill is ${h.m(a.after.iht)}. Had the cover counted, the estate would have been ${h.m(b.after.estateForTaper)} and the tax ${h.m(b.after.iht)}. Under the rules for deaths before the change the pension items were all outside and the estate owed ${h.m(a.before.iht)}. Because the member was under ${N.deathAgeIncomeTax}, the children pay no income tax on these lump sums as long as they are paid within ${N.lumpSumPaidWithinYears} years and within the remaining lump sum and death benefit allowance.</p>

<h2>What stays in the estate</h2>
<p>It is easier to list what is excluded than what is not, because the default is inclusion. Unused money purchase pots, including personal pensions, SIPPs and workplace pots, are in the estate, whether untouched or already in drawdown. So are lump sums from defined benefit schemes that are not tied to current employment: a guarantee paid as a lump sum when a pension in payment stops early, or a refund of contributions. Death in service cover from a scheme where the member was deferred is in. The ${h.a('defined-benefit-pension-inheritance-tax', 'page on defined benefit schemes')} looks at the lump sums those schemes pay.</p>
<p>A benefit that is in the estate is not necessarily taxed. Paid to a spouse or civil partner, it is exempt; paid to a charity, it is exempt and helps towards the ${h.pc(I.charityRate)} rate. The ${h.a('pension-left-to-spouse-inheritance-tax', 'page on pensions left to a spouse')} follows that route, which defers the question to the survivor's death rather than removing it.</p>

<h2>Checking which category a payment falls into</h2>
<p>The scheme administrator is the first source of information on what a scheme will pay on death and under which rule. HMRC's technical note says the government will lay regulations later in 2026 on the information schemes give personal representatives. What matters for the exclusion is the reason a payment is made: cover that exists because of the job, or money that would be paid out on death whatever the member was doing.</p>
<p>This page describes the categories in the law and HMRC's reading of them. It does not say whether a particular payment is excluded in a particular case, which depends on the scheme rules and the facts at death. The personal representatives, the scheme, a solicitor or a regulated adviser can confirm the treatment of a real benefit. The ${h.a('home', 'calculator')} can be run without the excluded amounts to see what is left in the estate.</p>
`;
  },
});
