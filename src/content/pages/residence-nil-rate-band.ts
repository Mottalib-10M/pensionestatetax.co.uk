import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'residence-nil-rate-band',
  group: 'thresholds',
  order: 120,
  mini: { kind: 'mini:rnrb' },
  related: ['inheritance-tax-threshold', 'residence-nil-rate-band-taper', 'transferable-nil-rate-band', 'inheritance-tax-no-children'],
  sources: ['gov_rnrb', 'gov_iht_home', 'gov_rnrb_transfer', 'fa2026_s66'],
  slug: 'residence-nil-rate-band',
  nav: 'Residence nil-rate band',
  card: 'Who counts as a direct descendant, the cap at the home’s value, sales, downsizing and transfers.',
  title: 'Residence Nil Rate Band 2026/27: Rules, Limits and Examples',
  description: 'Residence nil rate band 2026/27: up to £175,000 when a home goes to direct descendants, capped at its value, tapered above £2 million, passed to a spouse.',
  h1: 'Residence nil rate band: the extra allowance for a home left to family',
  intro: 'The second band in inheritance tax only works for one asset and one group of people. Most of its rules are about who those people are and what the asset is worth.',
  resume: (h) => {
    const I = h.P.iht;
    const flat = h.E.residenceBand({ estate: 500000, home: 100000, homeToDescendants: true });
    return `The residence nil rate band is an extra inheritance tax allowance of up to ${h.m(I.rnrb)} in 2026/27, frozen until ${h.D.freeze}, available when a home the person lived in, or their share of it, is left to direct descendants: children, grandchildren and further generations, their spouses or civil partners, and step, adopted and foster children. It is added to the nil-rate band of ${h.m(I.nrb)}. It can never exceed the value of the home that passes to them, so a ${h.m(100000)} flat left to a son gives a band of ${h.m(flat.rnrb)}, and the unused part cannot shelter savings. It is reduced by ${h.m(1)} for every ${h.m(I.taperDivisor)} by which the estate exceeds ${h.m(I.taperThreshold)}, and whatever is unused at the first death of a married couple passes as a percentage to the survivor's estate. From ${h.D.from} unused pension funds join the estate and so count for that taper, while the home remains the only asset the band itself can cover.`;
  },
  faqs: (h) => {
    const I = h.P.iht;
    return [
      { q: 'Can I leave my house to my nephew and still get the residence nil rate band?', a: `No. Nephews, nieces, brothers and sisters are not direct descendants, so a home left to them earns no residence band. Only lineal descendants and their spouses or civil partners qualify, together with step, adopted and foster children and children under guardianship. The ordinary nil-rate band of ${h.m(I.nrb)} still applies to the estate.` },
      { q: 'Does a buy-to-let flat qualify for the residence band?', a: `The band needs a home the person lived in, or a share of one, so a flat that was only ever let to tenants does not qualify. A let flat is still part of the estate and is covered by the ordinary nil-rate band like any other asset. The residence band is then limited to the value of the home, if any, passing to direct descendants.` },
      { q: 'What happens to the residence band if the executors sell the house?', a: `HMRC's guidance says the band can still apply when the home is sold during the administration of the estate and the sale proceeds pass to the direct descendants. Descendants who inherit the home and sell it later do not lose the band either. What matters is that the value of the home, or the money from it, goes to them.` },
      { q: 'Is the residence band lost if I move into a care home?', a: `Not necessarily. A downsizing addition exists for people who sold their home, or moved to a cheaper one, on or after ${h.date(h.P.iht.downsizingFrom)}, so that the move need not cost the family the whole band. Executors claim it on form IHT435, and the amount depends on the values involved in each case, which the executors work out from the sale and the estate.` },
      { q: 'Why did my mother’s estate get no residence band when it was worth £2.5 million?', a: `The taper. Above ${h.m(I.taperThreshold)} the band falls by ${h.m(1)} for every ${h.m(I.taperDivisor)} of estate, so a single person's band runs out at ${h.m(I.taperThreshold + I.rnrb * I.taperDivisor)}, and one with a transferred band at ${h.m(I.taperThreshold + 2 * I.rnrb * I.taperDivisor)}. The estate for this test is taken before exemptions and reliefs, and from ${h.D.from} it includes pensions.` },
    ];
  },
  body: (h) => {
    const P = h.P, I = P.iht;
    const E = h.E;
    // Example 1: home and other assets to the children, single.
    const e1 = E.estate({ home: 300000, savings: 190000, pension: 0, status: 'single', homeToDescendants: true }, 'after');
    const e1nrbUnused = (e1.nrbLeft - Math.max(0, e1.chargeable - e1.rnrb)) / I.nrb;
    // Example 2: a small flat to a son, other assets to the son, the rest exempt to the husband.
    const e2 = E.estate({ home: 100000, savings: 400000, pension: 0, status: 'single', homeToDescendants: true }, 'after');
    const e2rUnused = (I.rnrb - e2.rnrb) / I.rnrb;
    // Example 3: a home split between a step-son and a nephew: only the step-son's half is closely inherited.
    const e3 = E.residenceBand({ estate: 700000, home: 250000, homeToDescendants: true });
    // Example 4: estate above the taper threshold.
    const e4 = E.residenceBand({ estate: 2100000, home: 450000, homeToDescendants: true });
    // Example 5: first spouse's band partly tapered and unused, then transferred.
    const first = E.residenceBand({ estate: 2100000, home: 450000, homeToDescendants: true });
    const share = first.rnrb / I.rnrb;
    const wife = E.residenceBand({ estate: 1800000, home: 500000, homeToDescendants: true, transferRnrb: share });
    const rows = [
      ['Home £300,000 and other assets £190,000 to the children', h.m(e1.rnrb), h.m(e1.iht)],
      [`Flat ${h.m(100000)} and ${h.m(400000)} to a son, the rest to the husband`, h.m(e2.rnrb), h.m(e2.iht)],
      ['Home £500,000, half to a step-son, half to a nephew', h.m(e3.rnrb), 'depends on the rest'],
      ['Estate £2,100,000 including a £450,000 home to children', h.m(e4.rnrb), 'depends on the rest'],
      ['Widow, estate £1,800,000, home £500,000, husband’s band partly unused', h.m(wife.rnrb), 'depends on the rest'],
    ];
    const pen = h.run({ home: 800000, savings: 900000, pension: 450000, status: 'single', homeToDescendants: true, heirs: 2 }, { age: 78, heirIncome: 50000 });
    return `
<h2>Who counts as a direct descendant</h2>
<p>The list in ${h.src('gov_rnrb', 'HMRC’s guidance on the residence nil rate band')} is narrower than "family" in everyday speech. It covers children, grandchildren and every later generation in the direct line; their husbands, wives and civil partners; and step-children, adopted children, foster children and children under guardianship. It does not cover brothers and sisters, nephews and nieces, cousins, parents, friends or an unmarried partner. A home left to any of them uses only the ordinary band. The point matters most to people without children, whose position is set out in the ${h.a('inheritance-tax-no-children', 'guide for estates without children')}.</p>
<p>The home can be shared among several descendants, or between descendants and other people. What matters is the share of its value that is "closely inherited". If half the home goes to a child and half to a sibling, only the child's half counts towards the band.</p>

<h2>A home the person lived in, and a cap at its value</h2>
<p>The asset has to be a home the person lived in, or a share of one, so property only ever let to tenants does not qualify. The band is the lower of two figures: the maximum, ${h.m(I.rnrb)} adjusted for any taper and transfer, and the value of the share of the home passing to descendants. Value above the band is simply part of the estate; value below it leaves part of the band unused, and that unused part cannot be set against cash, shares or a pension. As ${h.src('gov_iht_home', 'GOV.UK’s page on passing on a home')} puts it, the band only applies to the home.</p>

<h2>Sold before the family receives it</h2>
<p>Executors often sell the house to pay debts or to divide the estate evenly. HMRC's guidance says the band remains available when the home is sold as part of the administration and the proceeds go to the direct descendants; it is also unaffected if the descendants inherit the home and sell it themselves afterwards. A will that leaves the home to the children but allows the executors to sell and pass on the money therefore keeps the band.</p>
<p>Homes left on trust are a separate question. Whether a descendant's interest under a trust counts as inheriting the home depends on the type of trust and its terms, which HMRC's guidance handles separately. This site does not cover trusts; a solicitor reading the will is the person to ask.</p>

<h2>Downsizing and moving into care</h2>
<p>Someone who sells a large house and buys a smaller one, or moves into care and sells up, could lose part of the band simply because the home they own at death is worth less or no longer exists. The downsizing addition repairs that for moves on or after ${h.date(h.P.iht.downsizingFrom)}. The executors claim it on form IHT435, and the amount depends on the values of the home given up and of what is left in the estate. This page gives no figure for it, because each case starts from its own values and dates.</p>

<h2>HMRC’s examples at 2026/27 values</h2>
<p>HMRC illustrates the rules with a set of cases. The table re-runs the main patterns with the engine at the frozen 2026/27 amounts, with our own figures and labels. The tax column is shown where the whole estate is described.</p>
${h.table(['Case', 'Residence band', 'Inheritance tax'], rows, 'Computed by the engine at 2026/27 amounts, single estates unless stated.', ['l', 'r', 'r'])}
<p>In the first case the home covers the full band and the nil-rate band absorbs the rest, so nothing is due and ${h.pc(e1nrbUnused, 1)} of the nil-rate band is left unused, a share that the estate of a surviving spouse, if there were one, could claim later. In the second, the flat is worth less than the maximum, so the band is ${h.m(e2.rnrb)} and ${h.pc(e2rUnused, 1)} of it remains for the husband's estate later. In the third, the step-son's half share of ${h.m(250000)} exceeds the maximum, so the band is capped at ${h.m(e3.rnrb)}, and the nephew's half earns nothing. In the fourth, an estate ${h.m(2100000 - I.taperThreshold)} above the taper threshold loses ${h.m(e4.taper)} of band, leaving ${h.m(e4.rnrb)}.</p>

<h2>Giving the home away during life</h2>
<p>The residence band is an allowance of the estate at death. It never applies to lifetime gifts, so a parent who hands the house to the children years before dying gets no residence band on that gift: if death follows within ${h.P.iht.giftYears} years, the gift is set against the ordinary nil-rate band instead, with taper relief where it applies. Handing over the deeds while carrying on living in the house without paying rent achieves even less. GOV.UK treats that as a gift with reservation, and the home stays in the estate as if it had never been given. The ${h.a('seven-year-rule-inheritance-tax', '${h.P.iht.giftYears} year rule page')} sets out the taper on gifts.</p>
<p>The band also plays no part in the ${h.pc(I.charityRate)} charity rate test. When the baseline amount is worked out, the nil-rate band left is deducted but the residence band is not, so a large home left to children does not make it easier to reach the ${h.pc(I.charityTest)} share.</p>

<h2>Passing the unused band to a spouse</h2>
<p>The last row follows a couple. The husband dies first with an estate of ${h.m(2100000)} and leaves the home to his wife. His band is tapered to ${h.m(first.rnrb)} and none of it is used, because nothing went to descendants. Under the ${h.src('gov_rnrb_transfer', 'transfer rules')}, ${h.pc(share, 1)} of his band is unused, measured against the full ${h.m(I.rnrb)}. When the widow dies with ${h.m(1800000)}, a ${h.m(500000)} home going to the children, her estate has her own band plus ${h.pc(share, 1)} of the band then in force: ${h.m(wife.rnrb)} in all. The ${h.a('transferable-nil-rate-band', 'transferable band guide')} covers the percentage in more detail.</p>

<h2>The pension does not earn the band, but it can take it away</h2>
<p>From ${h.D.from}, ${h.src('fa2026_s66', 'section 150A')} adds unused pension funds to the estate. The pension can never be covered by the residence band, which belongs to the home alone, but it does count towards the ${h.m(I.taperThreshold)} test. A single person with an ${h.m(800000)} home left to two children, ${h.m(900000)} of savings and a ${h.m(450000)} pension keeps a residence band of ${h.m(pen.before.rnrb)} for a death before the change and ${h.m(pen.after.rnrb)} after it, because the estate counted is now ${h.m(pen.after.estateForTaper)}. The ${h.a('residence-nil-rate-band-taper', 'taper guide')} explains the marginal rate this creates.</p>
<p>The calculator above takes the home, the whole estate and any transferred share and returns the band. It is a guide to the rules, not a valuation of an estate; the executors, with a solicitor or regulated adviser where needed, confirm the band for a real death.</p>
`;
  },
});
