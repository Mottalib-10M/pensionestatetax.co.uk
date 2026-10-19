import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** A widowed grandfather after April 2027: home to his children, £400,000 of savings before gifts, a pension; `given` left within the exemptions. */
const grandfather = (h: Helpers, given: number) => h.run({
  home: 500000, savings: 400000 - given, pension: 350000, status: 'widowed', transferNrb: 1, transferRnrb: 1, homeToDescendants: true, heirs: 2,
}, { age: 82, heirIncome: 45000, years: 3 });
const DECADE = 10;

export default definePage({
  id: 'inheritance-tax-gift-allowances',
  group: 'gifts',
  order: 190,
  mini: { kind: 'mini:allowances', props: { carry: 1, wed: 1, small: 6 } },
  related: ['seven-year-rule-inheritance-tax', 'gifts-from-income-inheritance-tax', 'inheritance-tax-charity-rate', 'home'],
  sources: ['gov_iht_gifts', 'gov_iht', 'fa2026_s69'],
  slug: 'inheritance-tax-gift-allowances',
  nav: 'Gift allowances',
  card: 'The fixed yearly exemptions, which ones stack, Mark’s carry-forward from GOV.UK, and their weight next to a pension.',
  title: 'Inheritance Tax Gift Allowances 2026/27: What Is Exempt',
  description: 'Inheritance tax gift allowances for 2026/27: the £3,000 annual exemption and carry-forward, £250 small gifts, wedding gifts, and which of them can be combined.',
  h1: 'Inheritance tax gift allowances: the fixed exemptions, year by year',
  intro: 'Some gifts never count towards the estate, however soon the giver dies. They are small, fixed and renewed every tax year, and the rules on stacking them matter as much as the amounts.',
  resume: (h) => {
    const I = h.P.iht, W = I.wedding;
    const used = 2000, carry = I.annualExemption - used;
    return `Each tax year a person can give away ${h.m(I.annualExemption)} free of inheritance tax under the annual exemption, and any part left unused can be carried forward for one year only. On top of that come small gifts of up to ${h.m(I.smallGift)} to as many people as the giver likes, provided none of them also gets part of the annual exemption; wedding or civil partnership gifts of ${h.m(W.child)} to a child, ${h.m(W.grandchild)} to a grandchild or great-grandchild and ${h.m(W.other)} to anyone else; and unlimited gifts to a spouse or civil partner living in the UK, to charities and to political parties. GOV.UK gives the example of Mark, recomputed here from the parameter file: he gives ${h.m(used)} to one daughter, leaving ${h.m(carry)} unused, and next year can give the other ${h.m(I.annualExemption + carry)} with no tax due even if he dies within ${h.P.iht.giftYears} years. Gifts covered by these exemptions never enter the ${h.P.iht.giftYears} year count. Next to a pension that joins the estate from ${h.D.from}, they are modest: a decade of annual exemptions takes ${h.m(I.annualExemption * DECADE)} out of an estate.`;
  },
  faqs: (h) => {
    const I = h.P.iht, W = I.wedding;
    const kept = grandfather(h, 0), gave = grandfather(h, I.annualExemption * DECADE);
    return [
      { q: 'If I skip the annual exemption this year, how long can I carry it forward?', a: `One tax year, and no further. The unused part of this year's ${h.m(I.annualExemption)} can be added to next year's allowance, so the most that can be given under the annual exemption in a single year is ${h.m(I.annualExemption * 2)}, and only if nothing was used the year before. An allowance left unused for two years running is lost.` },
      { q: 'Can my grandson get a small gift as well as part of my annual exemption?', a: `No. GOV.UK allows small gifts of up to ${h.m(I.smallGift)} per person only where no other allowance has been used on that same person. Give a grandson ${h.m(500)} from the annual exemption and a separate small gift to him is no longer exempt. Small gifts to other grandchildren who received nothing else remain fine.` },
      { q: 'How much can grandparents give towards a grandchild’s wedding without inheritance tax?', a: `Each grandparent can give ${h.m(W.grandchild)} to a grandchild or great-grandchild for a wedding or civil partnership, against ${h.m(W.child)} from a parent and ${h.m(W.other)} from anyone else. GOV.UK lets a wedding gift be combined with other allowances for the same person, except small gifts, so the annual exemption can be added in the same tax year.` },
      { q: 'Are donations to a political party exempt from inheritance tax?', a: `Yes. GOV.UK lists gifts to political parties alongside gifts to charities as exempt, with no upper limit, so they do not use any of the annual exemption or the nil-rate band. A charity gift can also bring the rest of the estate down to the reduced rate, which the page on the charity rate explains; party donations have no such effect.` },
      { q: 'Are gift allowances worth using once my pension counts in my estate?', a: `They still take money out at once, but their scale is small next to a pension. On the engine, a widowed grandfather whose estate includes a ${h.m(350000)} pension pays ${h.m(kept.after.ihtOnPension)} of inheritance tax on the pension alone after ${h.D.from}, while ${DECADE} years of annual exemptions reduce the whole bill by ${h.m(kept.after.iht - gave.after.iht)}.` },
    ];
  },
  body: (h) => {
    const I = h.P.iht, W = I.wedding;
    const used = 2000, carry = I.annualExemption - used;
    const smalls = 6;
    const yearOne = I.annualExemption * 2 + W.child + W.grandchild + I.smallGift * smalls;
    const annualOnly = I.annualExemption * DECADE;
    const busy = I.annualExemption * (DECADE + 1) + I.smallGift * smalls * DECADE + W.child + W.grandchild;
    const none = grandfather(h, 0), withAnnual = grandfather(h, annualOnly), withBusy = grandfather(h, busy);
    return `
<h2>The yearly allowance and its one-year memory</h2>
<p>The annual exemption is the one most people have heard of. ${h.src('gov_iht_gifts', 'GOV.UK')} sets it at ${h.m(I.annualExemption)} of gifts each tax year (for ${h.P.taxYear}, ${h.P.taxYearLong}). It can go to one person or be split among several, and it is exempt the moment it is given: the ${h.P.iht.giftYears} year rule never looks at it. What is not used can be carried into the next tax year, but only that one. So a year with nothing given followed by a generous one allows ${h.m(I.annualExemption * 2)}, and a second idle year simply loses the first year's balance.</p>
<p>GOV.UK's illustration follows a father called Mark, and it is worth running with the parameter file rather than reading.</p>
${h.table(['Tax year', 'Gift', 'Allowance available', 'Exempt', 'Carried forward'], [
  ['2023 to 2024', `${h.m(used)} to Jane`, h.m(I.annualExemption), h.m(used), h.m(carry)],
  ['2024 to 2025', `${h.m(I.annualExemption + carry)} to Sarah`, `${h.m(I.annualExemption)} plus ${h.m(carry)}`, h.m(I.annualExemption + carry), h.m(0)],
], 'GOV.UK example of Mark and his daughters, amounts from the parameter file.', ['l', 'l', 'l', 'r', 'r'])}
<p>Neither gift needs Mark to survive ${h.P.iht.giftYears} years. Had he given Sarah one pound more, that pound would have been an ordinary gift, set against the nil-rate band if he died within the period, as explained in the ${h.a('seven-year-rule-inheritance-tax', '${h.P.iht.giftYears} year rule guide')}.</p>
<p>The one-year limit is what catches people out. Someone who gives nothing for three years and then makes a large gift does not get three years of allowance, only this year's and last year's. The exemption is not something to save up; it is closer to a use-it-or-lose-it entitlement with a single year of grace, which is why families who use it tend to do so as a routine each spring rather than in one go.</p>

<h2>Presents of up to ${h.m(I.smallGift)}</h2>
<p>Birthday and Christmas money is covered by a separate exemption. Any number of people can each receive up to ${h.m(I.smallGift)} in a tax year, so long as the same person has not had another allowance from the same giver. The condition matters more than the amount. A grandmother who gives her eldest grandchild ${h.m(1500)} from the annual exemption cannot also give that grandchild an exempt ${h.m(I.smallGift)} the same year; her other grandchildren, who had nothing else, can each have one.</p>

<h2>Wedding and civil partnership gifts</h2>
<p>A gift made on a marriage or civil partnership has its own allowance, set by the giver's relationship to one of the couple.</p>
${h.table(['Giver', 'Exempt wedding gift'], [
  ['Parent', h.m(W.child)],
  ['Grandparent or great-grandparent', h.m(W.grandchild)],
  ['Anyone else', h.m(W.other)],
], 'Wedding or civil partnership gifts, per giver, GOV.UK.', ['l', 'r'])}
<p>GOV.UK's example has a parent giving a child ${h.m(W.child)} for the wedding and ${h.m(I.annualExemption)} under the annual exemption in the same tax year, ${h.m(W.child + I.annualExemption)} in all with no tax. Two parents each have their own allowances, so the figures double for a couple giving together.</p>

<h2>Spouse, civil partner, charity and party</h2>
<p>Some gifts are exempt without any ceiling. Gifts between spouses or civil partners are free of inheritance tax when both live in the UK. Gifts to charities and to political parties are exempt too. From ${h.D.from}, ${h.src('fa2026_s69', 'section 69 of the Finance Act 2026')} carries the spouse and charity exemptions over to pension benefits paid on death, so a pension that goes to a surviving partner or to a charity is outside the tax just as a legacy would be. A charity gift can also lower the rate on the rest of the estate, covered on the ${h.a('inheritance-tax-charity-rate', 'charity rate page')}.</p>

<h2>Which allowances stack and which do not</h2>
<p>GOV.UK's rules on combining fit in three sentences. A wedding gift can be combined with any other allowance for the same person except the small gifts one. Gifts out of normal income can likewise sit on top of any allowance other than small gifts. The small gifts exemption itself only works for someone who has received nothing under another allowance. In practice that means one person can receive a wedding gift, part of the annual exemption and regular payments from income in the same year, while ${h.m(I.smallGift)} presents are kept for everybody else.</p>
<p>Used together in a single year with a wedding in the family, the fixed allowances add up faster than the headline figures suggest. A parent with last year's annual exemption still unused, a son marrying, a granddaughter marrying and ${smalls} other relatives receiving small presents can give ${h.m(yearOne)} that year without any of it entering the estate. The calculator above adds up the same combinations for any year.</p>

<h2>One grandmother's year, gift by gift</h2>
<p>The rules are easier to follow on a real list. A widowed grandmother who gave nothing last tax year has two years of annual exemption to use. This year she helps her daughter with ${h.m(4500)}, gives a grandson ${h.m(W.grandchild + 1500)} when he marries, sends ${h.m(I.smallGift)} to each of her four other grandchildren, gives ${h.m(W.other)} to a friend's son on his wedding day and gives ${h.m(2000)} to a neighbour who looked after her.</p>
${h.table(['Recipient', 'Gift', 'Allowance used', 'Exempt', 'Left to the seven year rule'], [
  ['Daughter', h.m(4500), 'Annual exemption, this year and last', h.m(4500), h.m(0)],
  ['Grandson, on marrying', h.m(W.grandchild + 1500), `Wedding ${h.m(W.grandchild)}, rest of the annual exemption`, h.m(W.grandchild + Math.min(1500, I.annualExemption * 2 - 4500)), h.m(Math.max(0, 1500 - (I.annualExemption * 2 - 4500)))],
  ['Four other grandchildren', h.m(I.smallGift * 4), 'Small gifts', h.m(I.smallGift * 4), h.m(0)],
  ['Friend’s son, on marrying', h.m(W.other), 'Wedding, anyone else', h.m(W.other), h.m(0)],
  ['Neighbour', h.m(2000), 'None left', h.m(0), h.m(2000)],
], 'Allowances from the parameter file. The small gifts go only to grandchildren who received nothing else.', ['l', 'r', 'l', 'r', 'r'])}
<p>Every gift but the last is out of the estate for good. The neighbour's gift is not taxed now either: it becomes an ordinary gift that counts only if she dies within ${h.P.iht.giftYears} years, and even then it would normally fall inside her nil-rate band, where it uses band rather than creating a bill. Had she sent the neighbour ${h.m(I.smallGift)} instead, it would have been exempt, because the neighbour received nothing else from her. The grandson could not have had a small gift on top, since he already received two other allowances.</p>

<h2>Their weight next to a pension in the estate</h2>
<p>From ${h.D.from} unused pension funds count as part of the estate, and the comparison with these allowances is sobering. Take a widowed grandfather with both of his late wife's bands, a ${h.m(500000)} home going to two children, ${h.m(400000)} of savings and a ${h.m(350000)} pension, who dies at 82. The engine compares his estate with money kept and with the same money given away within the exemptions over ${DECADE} years.</p>
${h.table(['', 'Taken out of the estate', 'Inheritance tax', 'Of which on the pension'], [
  ['Nothing given', h.m(0), h.m(none.after.iht), h.m(none.after.ihtOnPension)],
  [`Annual exemption every year for ${DECADE} years`, h.m(annualOnly), h.m(withAnnual.after.iht), h.m(withAnnual.after.ihtOnPension)],
  [`Plus small gifts to ${smalls} people a year and two weddings`, h.m(busy), h.m(withBusy.after.iht), h.m(withBusy.after.ihtOnPension)],
], `Widowed, both bands transferred, home ${h.m(500000)} to two children, savings ${h.m(400000)} before any gifts, pension ${h.m(350000)}, death at 82 from April 2027. Engine figures.`, ['l', 'r', 'r', 'r'])}
<p>A decade of the annual exemption saves ${h.m(none.after.iht - withAnnual.after.iht)} of inheritance tax, and a busier pattern of gifts ${h.m(none.after.iht - withBusy.after.iht)}. The pension alone carries ${h.m(none.after.ihtOnPension)}. The allowances are worth knowing because they are certain and immediate, but on estates of this size they change the edges of the bill rather than its size. The larger levers are the ones covered elsewhere: the ${h.a('gifts-from-income-inheritance-tax', 'normal expenditure exemption')}, which has no cap, gifts that survive ${h.P.iht.giftYears} years, and who receives the pension. None of this is advice on a particular estate; a solicitor, the personal representatives or a regulated adviser check a real case, and the ${h.a('home', 'estate calculator')} shows how gifts change the totals.</p>
`;
  },
});
