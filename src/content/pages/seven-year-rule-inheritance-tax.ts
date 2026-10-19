import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** GOV.UK's example: Sally's estate of £400,000, a gift the size of the nil-rate band 4 years 2 months before death, and a third gift 3 years before. */
const sally = (h: Helpers) => h.E.estate({ home: 0, savings: 400000, pension: 0, status: 'single', homeToDescendants: false, gifts: h.P.iht.nrb + 100000, giftYears: 3 }, 'after');
/** A parent dying at 72 after April 2027: home to the children, savings, a pension, and a £200,000 gift to a daughter. */
const parent = (savings: number, gifts: number, giftYears: number) => ({ home: 350000, savings, pension: 300000, status: 'single' as const, homeToDescendants: true, gifts, giftYears, heirs: 2 });

export default definePage({
  id: 'seven-year-rule-inheritance-tax',
  group: 'gifts',
  order: 170,
  mini: { kind: 'mini:gift-taper', props: { gift: 400000, earlier: 0, years: 4.5 } },
  related: ['inheritance-tax-gift-allowances', 'gifts-from-income-inheritance-tax', 'residence-nil-rate-band', 'home'],
  sources: ['gov_iht_gifts', 'gov_iht', 'fa2026_s66'],
  slug: 'seven-year-rule-inheritance-tax',
  nav: 'Seven year rule and taper relief',
  card: 'How a gift falls out of the estate over 7 years, what taper relief really cuts, and Sally’s estate recalculated.',
  title: 'Seven Year Rule for Inheritance Tax 2026/27: Taper Relief',
  description: 'Seven year rule for inheritance tax in 2026/27: when a gift leaves the estate, how taper relief at 32, 24, 16 and 8% works, and GOV.UK’s Sally example rerun.',
  h1: 'The seven year rule: when a gift stops counting for inheritance tax',
  intro: 'A gift to a person is free of inheritance tax once the giver has lived seven more years. Die sooner and the gift is brought back into the reckoning, first against the nil-rate band and then, if it is large, with a sliding reduction.',
  resume: (h) => {
    const I = h.P.iht;
    const s = sally(h);
    const share = (y: number) => I.taper.find((t) => y >= t.fromYears && y < t.toYears)!.share;
    return `A gift to another person stops counting for inheritance tax when the giver survives it by ${I.giftYears} years. If death comes sooner, the gift is added back and uses the nil-rate band of ${h.m(I.nrb)} before the estate does, oldest gift first; the residence nil-rate band of ${h.m(I.rnrb)} never covers gifts. Only the part of the gifts above the nil-rate band is taxed, and taper relief then reduces the rate on that part: ${h.pc(I.rate)} for a death within 3 years, ${h.pc(I.rate * share(3))}, ${h.pc(I.rate * share(4))}, ${h.pc(I.rate * share(5))} and ${h.pc(I.rate * share(6))} in the fourth to seventh years. The recipient pays that tax. GOV.UK illustrates the rule with Sally, whose estate the engine recomputes: a gift equal to the whole band 4 years before death is tax free but uses the band, a further ${h.m(100000)} gift 3 years before costs the friend ${h.m(s.giftTax)}, and the remaining ${h.m(400000)} estate, with no band left, pays ${h.m(s.iht)}. A gift made within the window saves nothing unless the giver lives on.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    const small = h.run(parent(150000, 200000, 4.5), { age: 72, heirIncome: 0 }).after;
    const kept = h.run(parent(350000, 0, 0), { age: 72, heirIncome: 0 }).after;
    return [
      { q: 'Does taper relief reduce the value of the gift or the tax on it?', a: `The tax. The gift keeps its full value when it is added back at death; what falls with time is the rate charged on the slice above the nil-rate band, from ${h.pc(I.rate)} down to ${h.pc(I.rate * I.taper[4].share)} in the seventh year. A gift that fits inside the band pays nothing whatever its date, so there is no tax for taper relief to reduce.` },
      { q: 'If I give my son £200,000 and die four years later, is any of it saved?', a: `Not on its own figures. A gift of that size sits inside the nil-rate band, so it is not taxed, but it uses ${h.m(200000)} of the band the estate would have had. On the engine, a parent with a home, savings and a pension pays ${h.m(small.iht)} at death with the gift and ${h.m(kept.iht)} without it. Surviving ${I.giftYears} years is what makes the difference.` },
      { q: 'Who receives the bill when a gift made four years ago becomes taxable?', a: `The person who received the gift pays the tax on any part of it above the nil-rate band, as in GOV.UK's example where Sally's friend pays on the gift that friend received. The estate pays the tax on what is left at death, and it does so with less band available because the earlier gifts have already taken their share.` },
      { q: 'Can I give my house to my children and keep living in it rent free?', a: `You can make the gift, but for inheritance tax it does not leave the estate while you go on living there without paying a full rent. GOV.UK treats it as a gift with reservation of benefit: the home is still counted at death, whenever the transfer was made, and the ${h.P.iht.giftYears} year clock does not run in the usual way.` },
      { q: 'Does the seven year rule work the same way for gifts into a trust?', a: `No. GOV.UK's description of the ${h.P.iht.giftYears} year rule applies to gifts to people and says the rule does not cover trusts, which follow rules of their own; the rates GOV.UK lists include ${h.pc(I.lifetimeRate)} for lifetime chargeable transfers. Trusts are outside what this site calculates, and a solicitor who deals with them is the person to ask about a particular trust.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht;
    const s = sally(h);
    const g = h.E.giftTax({ gift: 100000, earlier: I.nrb, years: 3 });
    const bands = I.taper.filter((t) => t.fromYears < I.giftYears).map((t) => [
      t.fromYears === 0 ? `Less than ${t.toYears} years` : `${t.fromYears} to ${t.toYears} years`,
      h.pc(I.rate * t.share), h.m(100000 * I.rate * t.share),
    ]);
    const heir = { age: 72, heirIncome: 0 };
    const none = h.run(parent(350000, 0, 0), heir), within = h.run(parent(150000, 200000, 4.5), heir), past = h.run(parent(150000, 0, 8), heir);
    const big = h.run(parent(150000, 450000, 4.5), heir);
    const two = h.E.giftTax({ gift: 250000, earlier: 200000, years: 4.5 }), later = h.E.giftTax({ gift: 250000, earlier: 0, years: 5.5 });
    return `
<h2>A clock that starts on the day of the gift</h2>
<p>Most gifts between people are not taxed when they are made. They sit in a kind of suspense: if the giver survives ${I.giftYears} years, the gift drops out of the inheritance tax picture for good; if not, the personal representatives have to bring it back when they value the estate. The clock runs separately for each gift, from the date it was made, so a parent who helps three children at different times has three different dates to watch. Small and regular gifts are taken out first by the exemptions described in the ${h.a('inheritance-tax-gift-allowances', 'gift allowances guide')} and the ${h.a('gifts-from-income-inheritance-tax', 'guide to gifts from income')}; what remains is what the ${h.P.iht.giftYears} year rule deals with.</p>
<p>When gifts are brought back, they are lined up in date order and set against the nil-rate band of ${h.m(I.nrb)} oldest first. This is the step people tend to miss. A gift that is well inside the band pays no tax itself, yet it uses up band that would otherwise have sheltered the estate. The residence nil-rate band of up to ${h.m(I.rnrb)} is different: it is only available against a home passing on death to direct descendants, so gifts never touch it, and it is still there for the estate whatever was given away during life.</p>

<h2>Taper relief cuts the rate, and only above the band</h2>
<p>Where the gifts of the last ${I.giftYears} years add up to more than the nil-rate band, the excess is taxed, and the rate on it depends on how long the giver lived after each gift. ${h.src('gov_iht_gifts', 'GOV.UK')} sets out the scale. For a death in the first three years there is no reduction. After that the rate steps down each year.</p>
${h.table(['Time between gift and death', 'Rate on the part above the band', `Tax on ${h.m(100000)} above the band`], bands, 'Taper relief on gifts, GOV.UK scale. Tax computed from the parameter file.', ['l', 'r', 'r'])}
<p>Two things follow from the table. First, taper relief is not a discount on the gift: the full value still counts against the band. Second, it only exists where there is tax to reduce. A family that gives ${h.m(200000)} and loses the giver five years later gets no relief at all, because the gift was never taxable; it simply shrank the band. The relief matters for large gifts, typically a property or a substantial share of savings, that go past the band on their own or together with earlier ones.</p>

<h2>Sally's estate in GOV.UK's example, rerun</h2>
<p>GOV.UK's worked example follows a woman called Sally who made three gifts in the nine years before she died. The engine takes the two that fell inside the window and gives the same answers.</p>
${h.table(['Gift or estate', 'Timing', 'Treatment', 'Tax'], [
  [`${h.m(50000)} to her brother`, '9 years before death', 'Outside the window, ignored', h.m(0)],
  [`${h.m(I.nrb)} to her sister`, '4 years 2 months before', 'Uses the whole nil-rate band', h.m(0)],
  [`${h.m(100000)} to a friend`, '3 years before', `Above the band, rate ${h.pc(g.effective)}, paid by the friend`, h.m(s.giftTax)],
  [`${h.m(400000)} estate`, 'At death', `No band left, rate ${h.pc(s.rate)}`, h.m(s.iht)],
], 'GOV.UK example recomputed with the engine (gift tax and estate tax).', ['l', 'l', 'l', 'r'])}
<p>The order is what makes the example instructive. The sister's gift was made first, so it takes the band; the friend's gift, made later, finds none left and is taxed on its whole value, with taper relief because it was made three years before death. The estate then pays tax on every pound, ${h.m(s.iht)} on ${h.m(400000)}. Had Sally lived another year, the friend's rate would have fallen again, but the estate would have been no better off until the sister's gift passed its own seventh anniversary.</p>

<h2>Two gifts, and the year the first one drops out</h2>
<p>Because each gift has its own clock, an old gift leaving the window can free band for a newer one. Picture a widow who gave ${h.m(200000)} to her son and, two years later, ${h.m(250000)} to her daughter. If she dies six and a half years after the first gift, both are inside the window: the son's gift takes ${h.m(200000)} of the band, the daughter's finds ${h.m(I.nrb - 200000)} left, and the engine charges ${h.m(two.over)} at ${h.pc(two.effective)}, a bill of ${h.m(two.tax)} for the daughter. Had she lived a year longer, the son's gift would have passed its seventh anniversary and dropped out entirely. The daughter's gift, now about five and a half years old, would fit inside the band on its own, so the engine's answer becomes ${h.m(later.tax)}. The same year also changes the estate: with less band used by gifts, more is left for the home, the savings and, from ${h.D.from}, the pension.</p>

<h2>Who pays, and what the estate pays</h2>
<p>Tax on a gift above the band is the recipient's bill, not the estate's: in the example, Sally's friend pays ${h.m(s.giftTax)}. The estate carries the indirect cost, which is the band the gifts used. Personal representatives have to work out every gift made in the ${I.giftYears} years before death, and GOV.UK asks people to keep a note of what they gave, to whom, its value and when, so that this can be done.</p>

<h2>A gift made with strings attached</h2>
<p>The ${h.P.iht.giftYears} year rule assumes the gift really leaves the giver. GOV.UK's standard case of a gift that does not is the family home handed to the children while the parent stays on rent free. For inheritance tax that is a gift with reservation of benefit, and the house is still part of the estate at death however long ago the deeds changed. The same idea applies to other assets the giver keeps using.</p>

<h2>Gifts and the pension from April 2027</h2>
<p>Section 66 of the ${h.src('fa2026_s66', 'Finance Act 2026')} brings unused pension funds into the estate for deaths from ${h.D.from}. The gift rules do not change, but the stakes do: a pension now competes with the home and savings for the same band, so whatever lifetime gifts have taken from that band leaves more of the pension exposed. Take a single parent who dies at 72, with a ${h.m(350000)} home left to two children, a ${h.m(300000)} pension and savings that were either kept or partly given to a daughter.</p>
${h.table(['', 'Tax on the gift', 'Tax at death', 'Of which on the pension'], [
  [`No gift, savings ${h.m(350000)}`, h.m(none.after.giftTax), h.m(none.after.iht), h.m(none.after.ihtOnPension)],
  [`${h.m(200000)} given 4.5 years before death`, h.m(within.after.giftTax), h.m(within.after.iht), h.m(within.after.ihtOnPension)],
  [`${h.m(200000)} given 8 years before death`, h.m(past.after.giftTax), h.m(past.after.iht), h.m(past.after.ihtOnPension)],
  [`${h.m(450000)} given 4.5 years before death, ${h.m(150000)} kept`, h.m(big.after.giftTax), h.m(big.after.iht), h.m(big.after.ihtOnPension)],
], 'Home £350,000 to two children, pension £300,000, death at 72 from April 2027. Engine figures.', ['l', 'r', 'r', 'r'])}
<p>The second row is the surprise for many families. The gift within the window costs nothing in gift tax, yet the bill at death is the same ${h.m(within.after.iht)} as if the money had never left, because the band it used is band the estate no longer has. Only once the gift is more than ${I.giftYears} years old does it come off the reckoning, and the saving is then ${h.m(none.after.iht - past.after.iht)}. The last row is a parent who started with more savings and gave most of them away. That gift goes past the band and adds a bill of ${h.m(big.after.giftTax)} for the daughter with taper relief already applied.</p>
<p>The calculator above handles a single gift with its earlier ones; the ${h.a('home', 'estate calculator')} adds gifts to a full estate with pension and home. Neither tells anyone what to give. A real case, with several gifts, trusts or a business, is something to take to a solicitor, the personal representatives or a regulated adviser.</p>
`;
  },
});
