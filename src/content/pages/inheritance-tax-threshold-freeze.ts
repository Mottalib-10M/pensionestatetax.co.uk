import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** From autumn 2026 to the end of the frozen period (h.D.freeze): about four and a half years. */
const YEARS = 4.5;
const GROWTHS = [0, 0.02, 0.03, 0.04];
/** A single parent's estate: home to the children, savings, and a pension that joins the estate in 2027. */
const single = (h: Helpers, g: number, regime: 'before' | 'after', withPension: boolean) => h.E.estate({
  home: h.E.grow(400000, g, regime === 'before' ? 0 : YEARS), savings: h.E.grow(300000, g, regime === 'before' ? 0 : YEARS),
  pension: withPension ? h.E.grow(250000, g, regime === 'before' ? 0 : YEARS) : 0, status: 'single', homeToDescendants: true,
}, regime);
/** A widowed parent with both bands of the late spouse, close to the taper. */
const widowed = (h: Helpers, g: number, years: number) => h.E.estate({
  home: h.E.grow(900000, g, years), savings: h.E.grow(500000, g, years), pension: h.E.grow(450000, g, years),
  status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true,
}, 'after');

export default definePage({
  id: 'inheritance-tax-threshold-freeze',
  group: 'thresholds',
  order: 160,
  mini: { kind: 'mini:freeze', props: { estate: 950000, growth: 3 } },
  related: ['inheritance-tax-threshold', 'residence-nil-rate-band-taper', 'inheritance-tax-on-pensions', 'home'],
  sources: ['fa2021_s86', 'fa2026_s72', 'gov_ootlar', 'gov_iht', 'fa2026_s71'],
  slug: 'inheritance-tax-threshold-freeze',
  nav: 'Threshold freeze to 2031',
  card: 'The law that holds the bands still until 2031, and what growth of 2 to 4 % does to the bill.',
  title: 'Inheritance Tax Threshold Freeze 2026/27: Bands Held to 2031',
  description: 'Inheritance tax threshold freeze in 2026/27: Finance Act clauses that hold the bands to 2031, and an estate growing 2, 3 or 4% yearly with its pension added.',
  h1: 'The inheritance tax threshold freeze: bands held still until 2031',
  intro: 'The tax-free bands have not moved for years and the law now keeps them where they are for the rest of the decade. A rising estate meets a fixed line, and from 2027 the pension joins it.',
  resume: (h) => {
    const I = h.P.iht;
    const now = single(h, 0, 'before', true), later = single(h, 0.03, 'after', true);
    return `The nil-rate band of ${h.m(I.nrb)} and the residence nil-rate band of ${h.m(I.rnrb)} are frozen until ${h.D.freeze}. Section 86 of the Finance Act 2021, as amended three times, by the Finance Act 2023 (section 9), the Finance Act 2025 (section 57) and section 72 of the Finance Act 2026, switches off the usual inflation link for every tax year up to and including ${I.frozenUntilTaxYear}. The last extension, by one year, was announced at Budget 2025 and became law on ${h.D.assent}. A frozen band does nothing to an estate that stays the same, but most do not. On the engine, a single parent with a ${h.m(400000)} home left to the children, ${h.m(300000)} of savings and a ${h.m(250000)} pension pays ${h.m(now.iht)} on a death today, while the pension is still outside the estate. If everything grows by 3 % a year, an assumption and not a forecast, the same estate at the end of the freeze is worth ${h.m(later.estateForTaper)} with the pension counted from ${h.D.from}, and the bill becomes ${h.m(later.iht)}.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'When does the threshold freeze end, and do the bands rise straight after?', a: `Not before the ${I.frozenUntilTaxYear} tax year has ended on ${h.D.freeze}. Section 86 of the Finance Act 2021, as now amended, switches indexation off up to and including that year. What happens from April after that depends on the law then in force: without a further amendment, the bands would start rising with consumer prices again, but no Budget has said by how much.` },
      { q: 'Is the residence nil-rate band frozen as well as the main band?', a: `Yes. Both the nil-rate band of ${h.m(I.nrb)} and the residence nil-rate band of ${h.m(I.rnrb)} are held at their current levels for the same period, to ${h.D.freeze}. The point at which the residence band starts to taper away, ${h.m(I.taperThreshold)} of estate, has not moved either in the figures published for ${h.P.taxYear}.` },
      { q: 'Why does a freeze cost families money if the tax rate never changes?', a: `Because the band is a fixed amount while house prices, investments and pension pots tend to rise. Each pound of growth above the band is taxed at ${h.pc(I.rate)}. An estate that sat just under the threshold when the freeze began can drift above it without anyone buying anything, so more estates pay and those already paying pay more.` },
      { q: 'Was the inheritance tax freeze extended again at Budget 2025?', a: `Yes, by one year. Before that Budget the bands were due to stay frozen to 2030; the Budget 2025 overview of tax legislation and rates announced a further year, and section 72 of the Finance Act 2026, which received Royal Assent on ${h.D.assent}, wrote it into law. Pages that still give an earlier end date are out of date.` },
      { q: 'Does the freeze affect what my children pay on my pension from 2027?', a: `Indirectly. The pension enters the estate for deaths from ${h.D.from} and shares the same frozen bands with the home and savings. A larger estate against a fixed threshold means more of the pension is above it, and above ${h.m(I.taperThreshold)} the pension also eats into the residence band. Income tax on the pension, for deaths at 75 or over, uses separate bands.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const rowsFree = GROWTHS.map((g) => {
      const a = single(h, g, 'after', false), base = single(h, 0, 'before', false);
      return [g === 0 ? 'No growth' : h.pc(g), h.m(a.free), h.m(base.iht), h.m(a.iht), h.m(a.iht - base.iht)];
    });
    const rowsPen = GROWTHS.map((g) => {
      const b = single(h, 0, 'before', true), a = single(h, g, 'after', true);
      return [g === 0 ? 'No growth' : h.pc(g), h.m(a.estateForTaper), h.m(b.iht), h.m(a.iht), h.m(a.ihtOnPension)];
    });
    const w0 = widowed(h, 0, 0), w3 = widowed(h, 0.03, YEARS);
    const threshold = single(h, 0, 'after', false).threshold;
    return `
<h2>The clauses that hold the bands still</h2>
<p>Left alone, the Inheritance Tax Act 1984 raises its bands with consumer prices. Parliament has told it not to, and then kept telling it. The instruction is ${h.src('fa2021_s86', 'section 86 of the Finance Act 2021')}, which has since been amended three times, each time to run for longer: by section 9 of the Finance Act 2023, by section 57 of the Finance Act 2025 and by ${h.src('fa2026_s72', 'section 72 of the Finance Act 2026')}. In its present form it disapplies indexation for the tax years up to and including ${I.frozenUntilTaxYear}, so the nil-rate band stays at ${h.m(I.nrb)} and the residence band at ${h.m(I.rnrb)} until ${h.D.freeze}.</p>
<p>The latest year was added at Budget 2025. The ${h.src('gov_ootlar', 'overview of tax legislation and rates')} published with it lists the extension, and the Finance Act 2026 received Royal Assent on ${h.D.assent}, the same Act that brings unused pensions into the estate from ${h.D.from}. Both measures therefore arrived together, and the second makes the first bite harder.</p>

<h2>Growth against a fixed line</h2>
<p>A freeze is a slow tax rise expressed in a different way. Nothing in the rules changes from one year to the next, yet a home that rises in value, savings that earn interest and investments that recover all add to the part of the estate above the threshold. The table below isolates that effect. It takes the single parent of the summary without any pension: a ${h.m(400000)} home left to two children and ${h.m(300000)} of savings, with a threshold of ${h.m(threshold)} once the residence band is added. Each row applies a yearly growth rate to both assets for the four and a half years or so between now and the end of the freeze.</p>
${h.table(['Growth a year', 'Estate in 2031', 'Tax on a death today', 'Tax at the end of the freeze', 'Increase'], rowsFree, 'Home £400,000 left to children, savings £300,000, single, no pension. The growth rate is an assumption chosen by the reader, not an official forecast.', ['l', 'r', 'r', 'r', 'r'])}
<p>The bands are the same in every row. Only the estate moves, and every pound it gains above ${h.m(threshold)} is charged at ${h.pc(I.rate)}. The growth rates are there to show sensitivity: the site does not predict house prices or markets, and none of these figures is a forecast by HMRC or the Treasury. Readers can put their own assumption into the calculator above, which projects an estate to the end of the frozen period.</p>

<h2>Adding the pension in April 2027</h2>
<p>For this estate the larger change is not the freeze at all. From ${h.D.from}, under ${h.src('fa2026_s71', 'section 71 of the Finance Act 2026')}, unused pension funds count in the estate. Put a ${h.m(250000)} pension back into the same family. On a death today it stays outside, so the tax is the same as without it. A death at the end of the freeze, with the pension grown at the same rate as everything else, brings it in at full value against bands that have not moved.</p>
${h.table(['Growth a year', 'Estate in 2031, pension included', 'Tax on a death today', 'Tax at the end of the freeze', 'Of which on the pension'], rowsPen, `Same estate with a ${h.m(250000)} pension, outside the estate today and inside it for deaths from April 2027. Engine figures, growth rates assumed.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Read across the first row and the effect of the new rule is clear even with no growth: the estate is bigger by the whole pension, and the tax rises accordingly. Read down the column and the freeze adds a second layer on top. The engine charges the pension its share of the bill at the average rate of the estate, which is why the last column grows faster than the pot itself once the estate is well past the threshold.</p>

<h2>Reading the tables against a real estate</h2>
<p>The projection is deliberately simple. It applies one growth rate to every asset, which real estates rarely follow: a house can stand still for years while a fund rises, and a pension in drawdown usually shrinks as income is taken from it rather than growing with the market. Spending, care costs and gifts reduce the estate too, and none of them is modelled here. What the tables show is the shape of the problem, that a fixed band turns any growth into taxable value at the full rate, rather than the bill a particular family will face. The calculator at the top of the page uses the same method, so it is most useful when run more than once: with a low rate, a middle one and a high one, and with the pension entered at the value it is likely to have after withdrawals rather than today's figure.</p>

<h2>The taper makes a fixed band worse near the top</h2>
<p>The ${h.a('residence-nil-rate-band-taper', 'residence band taper')} starts at ${h.m(I.taperThreshold)} of estate, measured after debts and before exemptions, and from ${h.D.from} with the pension included. That trigger has stayed put as well. A widowed parent who has inherited both bands from a late spouse, with a ${h.m(900000)} home, ${h.m(500000)} of savings and a ${h.m(450000)} pension, has an estate of ${h.m(w0.estateForTaper)} after April 2027 and keeps the full residence band of ${h.m(w0.rnrb)}. With 3 % growth a year until ${h.D.freeze}, the estate reaches ${h.m(w3.estateForTaper)}; the engine takes ${h.m(w3.rnrbTaper)} off the residence band and the tax rises from ${h.m(w0.iht)} to ${h.m(w3.iht)}. In that zone each extra pound of value costs more than the headline rate, because it also removes band.</p>

<h2>After ${I.frozenUntilTaxYear}: what the law says and what it does not</h2>
<p>When the frozen period ends, the default rule of the 1984 Act comes back unless Parliament says otherwise: the bands would be uprated in line with the consumer prices index, starting with the figure for September 2030. That is a description of the statute as it stands, not a promise. The freeze has been lengthened more than once, most recently by the Act of ${h.D.assent}, and a future Finance Act could lengthen it again, change the bands or leave them alone. No figure for the bands after ${h.D.freeze} has been announced, and this site does not estimate one.</p>
<p>For planning purposes most people simply look at the estate against the bands that are certain, those published on ${h.src('gov_iht', 'GOV.UK')}, and treat anything later as unknown. The ${h.a('inheritance-tax-threshold', 'threshold guide')} explains how the two bands combine and when the residence band is lost; the ${h.a('inheritance-tax-on-pensions', 'pension guide')} covers what section 150A adds to the estate.</p>

<h2>What families tend to look at</h2>
<p>The freeze itself cannot be planned around, since it applies to everyone. What some families look at instead is the size of the estate it is measured against: gifts made during life and the seven-year clock that goes with them, legacies to charity that can lower the rate, the order in which pension and other savings are drawn, and whether a pension nomination goes to a spouse or civil partner, whose share is exempt. None of these is right for everybody, and some interact badly with income tax or with the residence band. The ${h.a('home', 'estate calculator')} shows the effect of each on one set of figures, and the representatives of an estate, a solicitor or a regulated financial adviser are the people who look at a real plan.</p>
`;
  },
});
