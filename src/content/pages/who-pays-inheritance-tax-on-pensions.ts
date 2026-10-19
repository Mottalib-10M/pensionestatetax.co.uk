import { definePage } from '../../lib/guide-types';

// Worked case: a pension-heavy estate where the free estate cannot meet its own share of the tax in cash.
const CASE = { home: 500000, savings: 100000, pension: 600000, status: 'single' as const, homeToDescendants: true, heirs: 2 };
const HEIR = { age: 70, heirIncome: 40000 };

export default definePage({
  id: 'who-pays-inheritance-tax-on-pensions',
  group: 'pensions',
  order: 70,
  mini: { kind: 'mini:withholding', props: { benefit: 300000, iht: 70000 } },
  related: ['inheritance-tax-on-pensions', 'inheritance-tax-on-pensions-after-75', 'pension-death-benefits-excluded', 'pension-pot-500000-inheritance-tax'],
  sources: ['fa2026_s67', 'fa2026_s68', 'gov_tech_note', 'gov_pay_iht', 'fa2026_s70'],
  slug: 'who-pays-inheritance-tax-on-pensions',
  nav: 'Who pays the tax',
  card: 'Executors and beneficiaries share liability; schemes can be told to hold back half or to pay HMRC directly.',
  title: 'Paying Inheritance Tax on Pensions: Who Is Liable in 2027',
  description: 'Who pays inheritance tax on pensions from April 2027: executors and beneficiaries are liable, schemes can withhold half of a benefit or pay HMRC under a notice.',
  h1: 'Who pays the inheritance tax on a pension from 2027',
  intro: 'The executors report the pension and answer for the tax, yet the money sits with the scheme. The Finance Act 2026 gives them two tools to bridge that gap.',
  resume: (h) => {
    const I = h.P.iht, N = h.P.pensions;
    const r = h.run(CASE, HEIR);
    return `For deaths on or after ${h.D.from}, the inheritance tax on a pension is the responsibility of the personal representatives, the executors or administrators of the estate, jointly with the beneficiary who receives the pension. Section 67 of the Finance Act 2026 says so in a new section 210 of the Inheritance Tax Act 1984, and it leaves the trustees of the pension scheme out of the list of people liable. Because the representatives rarely control the pension money, section 68 gives them two notices. A withholding notice stops the scheme paying out more than ${h.pc(N.withholdShare)} of anyone's entitlement for up to ${N.withholdMonths} months after the end of the month of death. A payment notice, open to the representatives or the beneficiary, makes the scheme pay the tax to HMRC itself, for amounts of at least ${h.m(N.directPaymentMin)}, within ${N.directPaymentDays} days. The tax is due by the end of the ${I.paymentMonths}th month after death. In the site's worked case, ${h.m(r.after.ihtOnPension)} of a ${h.m(r.after.iht)} bill falls on a ${h.m(CASE.pension)} pension shared by two children.`;
  },
  faqs: (h) => {
    const N = h.P.pensions, I = h.P.iht;
    return [
      { q: 'Can the pension scheme refuse to pay my share until the inheritance tax is settled?', a: `Partly. If the personal representatives give the scheme a withholding notice, it may pay no more than ${h.pc(N.withholdShare)} of your entitlement while the notice has effect. The notice ends when the tax is paid, when it is withdrawn, or at the latest ${N.withholdMonths} months after the end of the month of death. Benefits that are excluded or exempt, such as a pension paid to a spouse, are not held back.` },
      { q: 'As an executor, am I personally liable for tax on a pension I never controlled?', a: `The new section 210 makes the personal representatives liable for inheritance tax on the pension, alongside the beneficiary. That is why the Act gives them the power to have benefits withheld and to direct the scheme to pay the tax from the fund. How far that liability reaches in a particular estate is a question for a solicitor.` },
      { q: 'How long does a pension scheme have to pay the tax once it receives a payment notice?', a: `The scheme administrator has ${N.directPaymentDays} days, beginning with the day it receives the notice, to pay HMRC. The notice can be given by the personal representatives or by the beneficiary, but only for an amount of at least ${h.m(N.directPaymentMin)}. The beneficiary's benefits are then reduced on a just and reasonable basis to reflect the payment.` },
      { q: 'What happens if a forgotten pension turns up after the certificate of discharge?', a: `Personal representatives who have received a certificate of discharge are not liable for inheritance tax on a pension discovered later, unless they were careless, under the new section 239(4A). The beneficiary who receives that pension remains liable for the tax on it. The estate's own tax may also need recalculating, because the extra value can change the rate across the estate.` },
      { q: 'Can inheritance tax on a pension be paid in instalments over ten years?', a: `No. HMRC's technical note says that the option to pay in ten yearly instalments does not extend to pension property. The tax on the pension is due on the normal timetable, by the end of the ${I.paymentMonths}th month after the death, with interest after that date.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht, N = P.pensions;
    const r = h.run(CASE, HEIR), a = r.heirsAfter;
    const free = r.after.ihtOnFree;
    const rows = [
      ['Inheritance tax on the estate', h.m(r.after.iht)],
      ['Share falling on the home and savings', h.m(free)],
      ['Share falling on the pension', h.m(r.after.ihtOnPension)],
      ['Each child’s share of the pension', h.m(a.pensionShare)],
      ['Tax attributable to each share', h.m(a.ihtPensionShare)],
      ['Payable to each child while a withholding notice runs', h.m(a.pensionShare * N.withholdShare)],
      ['Held back in the scheme for each child', h.m(a.pensionShare * (1 - N.withholdShare))],
      ['Each child keeps once the tax is paid', h.m(a.pensionKept)],
    ];
    return `
<h2>Two parties on the hook, one left off</h2>
<p>Liability is set out in ${h.src('fa2026_s67', 'section 67 of the Finance Act 2026')}, which rewrites section 210 of the Inheritance Tax Act 1984 for pension property. Two people are liable for the tax on a pension: the personal representatives of the deceased, and the person in whom the pension benefit vests, meaning the beneficiary. HMRC can look to either. The trustees of a registered pension scheme are not liable, a change from the original plan, under which schemes would have been liable. The government's consultation response of July 2025 moved liability to the representatives.</p>
<p>The scheme administrator is not entirely off the hook. It becomes liable if it pays out benefits in breach of a withholding notice, or if it fails to comply with a valid payment notice. In other words, the administrator's exposure comes only from ignoring the representatives' instructions, not from the tax itself.</p>

<h2>Holding money back: the withholding notice</h2>
<p>A representative who is liable for tax on money they cannot reach needs a way to stop it leaving. ${h.src('fa2026_s68', 'Section 68')} provides one in new section 226A. The personal representatives, or people who expect to become them, can give the scheme administrator a withholding notice. While it has effect, the scheme may pay no more than ${h.pc(N.withholdShare)} of any person's benefit entitlement. The rest stays in the scheme.</p>
<p>The notice cannot run indefinitely. It ends when the inheritance tax attributable to the pension has been paid, when the representatives withdraw it, or at the latest ${N.withholdMonths} months after the end of the month in which the member died. For a death in January, that limit falls at the end of April in the following year. Excluded benefits, such as a death in service lump sum, and exempt benefits, such as a pension paid to a surviving spouse, are not withheld at all, since there is no tax on them to protect.</p>

<h2>Paying from the pot: the payment notice</h2>
<p>Withholding protects the tax but does not pay it. New section 226B, known as the Pensions Direct Payment Scheme, does. Either the personal representatives or the beneficiary can give the scheme administrator a payment notice requiring it to pay HMRC the inheritance tax attributable to the pension. The amount must be at least ${h.m(N.directPaymentMin)}, and the administrator has ${N.directPaymentDays} days, starting with the day the notice is received, to pay. The beneficiary's benefits are then reduced on a just and reasonable basis.</p>
<p>Two limits matter in practice. ${h.src('gov_tech_note', 'HMRC’s technical note')} points out that money already used to buy an annuity with an insurance company is no longer in the scheme, so it cannot be used to meet a payment notice. And paying through the scheme does not change the beneficiary's later income tax: under ${h.src('fa2026_s70', 'section 70')}, inheritance tax paid by the scheme under a payment notice is deducted from taxable pension income in the same way as tax the beneficiary paid personally, which the ${h.a('inheritance-tax-on-pensions-after-75', 'page on pensions after 75')} works through.</p>

<h2>A worked case: a pension-heavy estate</h2>
<p>A single parent dies at 70 on or after ${h.D.from}. The estate holds a ${h.m(CASE.home)} home left to two children, ${h.m(CASE.savings)} in a bank account, and a ${h.m(CASE.pension)} pension that the children are nominated to share equally. The engine finds a bill of ${h.m(r.after.iht)}, spread across the estate at ${h.pc(r.after.estateRate, 1)}.</p>
${h.table(['', 'Amount'], rows, 'Single parent, death at 70, two children. Computed by the engine.', ['l', 'r'])}
<p>The representatives face ${h.m(free)} of tax on the home and savings, and the savings alone are ${h.m(CASE.savings)}. The pension's share of ${h.m(r.after.ihtOnPension)} is held by the scheme. With a withholding notice in place, each child can receive up to ${h.m(a.pensionShare * N.withholdShare)} straight away, which is far more than the ${h.m(a.ihtPensionShare)} of tax attributable to their share, so the tax is protected. A payment notice from the representatives or from either child then sends the pension's share of the tax to HMRC from the fund. Because the member died before ${N.deathAgeIncomeTax}, the children pay no income tax on what they receive within the lump sum and death benefit allowance.</p>
<p>The notices only reach the pension's part of the bill. A payment notice covers the tax attributable to the pension, so the ${h.m(free - CASE.savings)} by which the estate's own share exceeds its cash has to come from the estate itself, for instance from the sale of the home. Nothing obliges the beneficiaries to use the scheme route either: a child with savings of their own can pay the tax attributable to their share directly, and the income tax deduction still follows if the member was ${N.deathAgeIncomeTax} or over. The choice affects cash flow and paperwork, not the amount of tax.</p>

<h2>The six-month deadline</h2>
<p>Inheritance tax is due by the end of the ${I.paymentMonths}th month after the death, as ${h.src('gov_pay_iht', 'GOV.UK’s page on paying the tax')} sets out: for a death in January, by 31 July. Interest runs on anything unpaid after that. A payment is usually needed before probate is granted, or before confirmation in Scotland. With ${N.directPaymentDays} days for the scheme to act on a payment notice, representatives who want the pension's tax paid from the fund have to know what the scheme holds well before the deadline, which is why the information duties being written into regulations matter.</p>
<p>Some reliefs and facilities that help with the timing on other assets are closed to pensions. The technical note confirms that business and agricultural property relief do not apply to pension property, nor does loss on sale relief, nor the option to pay by ten yearly instalments. Quick succession relief does apply.</p>

<h2>A pension found after the estate is closed</h2>
<p>Old workplace pots are easy to overlook. Section 67 also inserts section 239(4A): personal representatives who have obtained a certificate of discharge are not liable for tax on a pension that comes to light afterwards, unless they were careless. The beneficiary of that pension stays liable for its tax. The certificate therefore protects representatives who did their work properly, and leaves the tax with the person who ends up holding the money.</p>
<p>Questions of liability turn on the facts of each estate and on documents this page cannot see. Nothing here is legal advice to an executor or a beneficiary; a solicitor, the scheme administrator or a regulated adviser can look at a real case. The ${h.a('home', 'calculator')} gives a first view of how a bill divides between the pension and the rest, and the ${h.a('pension-death-benefits-excluded', 'excluded benefits page')} lists what a withholding notice never touches.</p>
`;
  },
});
