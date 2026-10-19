/**
 * Mini-calculators, one per subject (RECETTE §9.3). Each one calls the tested engine of `lib/engine/iht.ts`;
 * none computes tax on its own. A page sets its defaults with the `props` of its ToolDef (same ids).
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as E from './engine/iht';
import { formatMoney as fm, formatPercent } from './format';

const m = (n: number) => fm(Math.round(n), 0);
const pc = (x: number) => formatPercent(Math.round(x * 1000) / 1000, Number.isInteger(Math.round(x * 1000) / 10) ? 0 : 1);
const I = P.iht, PN = P.pensions;
const YESNO = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
const REGION = [{ value: '0', label: 'England, Wales, NI' }, { value: '1', label: 'Scotland' }];
const reg = (v: number): E.Region => (v === 1 ? 'scotland' : 'ruk');
const STATUS = [{ value: '0', label: 'Single or divorced' }, { value: '1', label: 'Widowed, bands unused' }];
const st = (v: number): E.Status => (v === 1 ? 'widowed' : 'single');
const money = (id: string, label: string, def: number, help?: string) => ({ id, label, def, unit: '£', max: 100_000_000, help });

const SPECS: Record<string, MiniSpec> = {
  threshold: {
    title: `Your inheritance tax threshold, ${P.taxYear}`, cta: 'Full estate with pension and heirs', ctaPage: 'home',
    inputs: [money('estate', 'Estate after debts', 650000, 'Home, savings, and pensions from April 2027'), money('home', 'of which your home', 350000), { id: 'status', label: 'Situation', def: 0, options: STATUS }, { id: 'desc', label: 'Home to children or grandchildren', def: 1, options: YESNO }],
    run: (v) => { const r = E.estate({ home: Math.min(v.home, v.estate), savings: Math.max(0, v.estate - v.home), pension: 0, status: st(v.status), transferNrb: 1, transferRnrb: 1, homeToDescendants: v.desc === 1 }, 'after');
      return { head: ['Tax-free threshold', m(r.nrb + r.rnrb)], rows: [['Nil-rate band', m(r.nrb)], ['Residence nil-rate band', m(r.rnrb)], ['Inheritance tax at 40 %', m(r.iht)]], note: r.rnrbTaper > 0 ? `The residence band is cut by ${m(r.rnrbTaper)} because the estate is above £2 million.` : undefined }; },
  },
  rnrb: {
    title: 'Residence nil-rate band of an estate', cta: 'Work out the whole estate', ctaPage: 'home',
    inputs: [money('home', 'Home left to descendants', 250000, 'Your share, after any mortgage'), money('estate', 'Whole estate after debts', 900000), { id: 'tr', label: 'Late spouse’s band unused', def: 0, unit: '%', max: 100, help: '0 if never widowed' }],
    run: (v) => { const b = E.residenceBand({ estate: v.estate, home: v.home, homeToDescendants: true, transferRnrb: v.tr / 100 });
      return { head: ['Residence band available', m(b.rnrb)], rows: [['Allowance with any transfer', m(b.def)], ['Lost to the £2 million taper', m(Math.min(b.def, b.taper))], ['Capped at the home’s value', b.adjusted > v.home ? 'Yes' : 'No']] }; },
  },
  taper: {
    title: 'What the £2 million taper costs', cta: 'See the estate with its pension', ctaPage: 'home',
    inputs: [money('estate', 'Estate after debts, pension included', 2200000), { id: 'couple', label: 'Late spouse’s bands transferred', def: 1, options: YESNO }],
    run: (v) => { const tr = v.couple === 1 ? 1 : 0; const b = E.residenceBand({ estate: v.estate, home: 10_000_000, homeToDescendants: true, transferRnrb: tr });
      const lost = Math.min(b.def, b.taper);
      return { head: ['Extra inheritance tax from the taper', m(lost * I.rate)], rows: [['Residence band before taper', m(b.def)], ['Band lost', m(lost)], ['Band left', m(b.rnrb)], ['Estate where it is all gone', m(I.taperThreshold + b.def * I.taperDivisor)]] }; },
  },
  'pension-iht': {
    title: 'Inheritance tax on a pension pot from April 2027', cta: 'Add the home, heirs and income tax', ctaPage: 'home',
    inputs: [money('pension', 'Unused pension', 300000), money('rest', 'Rest of the estate', 500000, 'Home and savings after debts'), { id: 'status', label: 'Situation', def: 0, options: STATUS }],
    run: (v) => { const inp: E.EstateInput = { home: v.rest, savings: 0, pension: v.pension, status: st(v.status), transferNrb: 1, transferRnrb: 1, homeToDescendants: true };
      const a = E.estate(inp, 'after'), b = E.estate(inp, 'before');
      return { head: ['Tax on the pension', m(a.ihtOnPension)], rows: [['Estate tax before 6 April 2027', m(b.iht)], ['Estate tax from 6 April 2027', m(a.iht)], ['Estate rate', pc(a.estateRate)]], note: 'Home assumed left to children or grandchildren.' }; },
  },
  after75: {
    title: 'Inheritance tax, then income tax: the combined rate', cta: 'Run the whole estate', ctaPage: 'home',
    inputs: [money('share', 'Pension you inherit', 100000), money('inc', 'Your own income a year', 50000), { id: 'iht', label: 'Inheritance tax on it', def: 40, unit: '%', max: 40, decimals: 1, help: '40 % above the bands, 0 within them' }, { id: 'years', label: 'Drawn over', def: 1, unit: 'yrs', max: 40 }, { id: 'sc', label: 'Income tax', def: 0, options: REGION }],
    run: (v) => { const iht = v.share * v.iht / 100; const it = E.extraTax(v.share - iht, v.inc, v.years, reg(v.sc));
      return { head: ['You keep', m(v.share - iht - it)], rows: [['Inheritance tax', m(iht)], ['Income tax on the rest', m(it)], ['Combined tax rate', pc(v.share > 0 ? (iht + it) / v.share : 0)], ['Your marginal rate now', pc(E.marginalRate(v.inc, reg(v.sc)))]], note: 'Income tax is charged on the pension after the inheritance tax borne on it (ITEPA s.567B).' }; },
  },
  before75: {
    title: 'Death before 75: the lump sum and death benefit allowance', cta: 'Full estate with inheritance tax', ctaPage: 'home',
    inputs: [money('pot', 'Lump sums paid to heirs', 900000), money('taken', 'Tax-free cash taken in life', 200000), money('iht', 'Inheritance tax on the pension', 0)],
    run: (v) => { const left = Math.max(0, PN.lsdba - v.taken); const tested = Math.max(0, v.pot - v.iht); const over = Math.max(0, tested - left);
      return { head: ['Taxable as heirs’ income', m(over)], rows: [['Allowance left', m(left)], ['Lump sums tested, net of IHT', m(tested)], ['Tax free', m(Math.min(tested, left))]], note: `Paid within ${PN.lumpSumPaidWithinYears} years of the provider hearing of the death. Beneficiary drawdown is not tested.` }; },
  },
  excluded: {
    title: 'What counts in the estate and what does not', cta: 'Estimate the estate', ctaPage: 'home',
    inputs: [money('dis', 'Death in service lump sum', 150000, 'Current job only'), money('pot', 'Personal pension or old workplace pot', 120000), money('dep', 'Dependants’ pension, yearly', 9000)],
    run: (v) => ({ head: ['Counted in the estate', m(v.pot)], rows: [['Death in service (excluded)', m(v.dis)], ['Dependants’ scheme pension (excluded)', `${m(v.dep)} a year`], ['Inheritance tax if above the bands', m(v.pot * I.rate)]], note: 'Excluded benefits are left out under IHTA 1984 s.150A(6).' }),
  },
  withholding: {
    title: 'Withholding notice: what an heir can draw at first', cta: 'Who pays and how', ctaPage: 'home',
    inputs: [money('benefit', 'Your share of the pension', 200000), money('iht', 'Tax attributable to it', 80000)],
    run: (v) => ({ head: ['Payable while the notice runs', m(v.benefit * PN.withholdShare)], rows: [['Held back', m(v.benefit * (1 - PN.withholdShare))], ['Notice lasts at most', `${PN.withholdMonths} months`], ['Scheme can pay the tax for you', v.iht >= PN.directPaymentMin ? 'Yes' : `Under ${m(PN.directPaymentMin)}`]], note: `A payment notice must be met within ${PN.directPaymentDays} days.` }),
  },
  spouse: {
    title: 'Bands passed on at the first death', cta: 'Second estate in full', ctaPage: 'home',
    inputs: [money('first', 'Left to others at the first death', 0, 'Not to the spouse'), money('second', 'Survivor’s estate, pension included', 1100000), money('home', 'Survivor’s home to children', 500000)],
    run: (v) => { const unused = Math.max(0, I.nrb - v.first) / I.nrb;
      const r = E.estate({ home: Math.min(v.home, v.second), savings: Math.max(0, v.second - v.home), pension: 0, status: 'widowed', transferNrb: unused, transferRnrb: 1, homeToDescendants: true }, 'after');
      return { head: ['Second estate threshold', m(r.nrb + r.rnrb)], rows: [['Nil-rate band transferred', pc(unused)], ['Inheritance tax at the second death', m(r.iht)]], note: 'Residence band assumed fully unused at the first death.' }; },
  },
  db: {
    title: 'Defined benefit scheme on death', cta: 'Whole estate', ctaPage: 'home',
    inputs: [money('lump', 'Lump sum paid on death', 60000, 'Guarantee or refund of contributions'), money('dep', 'Spouse’s or child’s pension a year', 12000)],
    run: (v) => ({ head: ['In the estate', m(v.lump)], rows: [['Dependants’ scheme pension', 'Excluded'], ['Tax if above the bands, 40 %', m(v.lump * I.rate)], ['Dependant’s pension income tax', 'Yes, as income']] }),
  },
  'pension-vs-isa': {
    title: '£ left in a pension or in an ISA, death at 75 or over', cta: 'Your full estate', ctaPage: 'home',
    inputs: [money('amount', 'Amount left', 100000), money('inc', 'Heir’s own income', 50000), { id: 'iht', label: 'Estate above the bands', def: 1, options: YESNO }],
    run: (v) => { const rate = v.iht === 1 ? I.rate : 0; const iht = v.amount * rate; const it = E.extraTax(v.amount - iht, v.inc, 1);
      return { head: ['Heir keeps from the pension', m(v.amount - iht - it)], rows: [['Heir keeps from the ISA', m(v.amount - iht)], ['Income tax on the pension', m(it)], ['Inheritance tax on either', m(iht)]], note: 'Pension drawn in one tax year. Spreading it lowers the income tax.' }; },
  },
  annuity: {
    title: 'Annuity income from a pension pot', cta: 'What the pot means for inheritance tax', ctaPage: 'inheritance-tax-on-pensions',
    inputs: [money('pot', 'Pension pot', 150000), { id: 'rate', label: 'Annuity rate quoted', def: 7, unit: '%', max: 30, decimals: 2, help: 'Yearly income per £100, from a quote' }, money('other', 'Other income a year', 12000, 'State Pension and the rest'), { id: 'cash', label: 'Take 25 % tax free first', def: 1, options: YESNO }],
    run: (v) => { const a = E.annuity({ pot: v.pot, rate: v.rate / 100, other: v.other, taxFreeFirst: v.cash === 1 });
      return { head: ['Income after tax, a month', m(a.monthly)], rows: [['Tax-free cash', m(a.cash)], ['Annuity a year, before tax', m(a.income)], ['Income tax on it', m(a.tax)]], note: 'Rates differ by age, health and options: use a quote. A lifetime annuity stops at death unless it has a guarantee or a joint life.' }; },
  },
  'lump-sum': {
    title: 'Tax-free lump sum from a pension', cta: 'Pension in the estate after April 2027', ctaPage: 'home',
    inputs: [money('pot', 'Pot not yet touched', 400000), money('used', 'Lump sum allowance already used', 0), money('other', 'Other income this tax year', 30000)],
    run: (v) => { const r = E.lumpSum({ pot: v.pot, allowanceUsed: v.used, other: v.other, take: v.pot });
      return { head: ['Tax-free cash', m(r.taxFree)], rows: [['Lump sum allowance left', m(r.left)], ['Cap reached', r.capped ? 'Yes' : 'No'], ['Remaining pot', m(v.pot - r.taxFree)]] }; },
  },
  drawdown: {
    title: 'Income tax on a pension withdrawal', cta: 'What heirs pay on what is left', ctaPage: 'inheritance-tax-on-pensions-after-75',
    inputs: [money('draw', 'Withdrawal this tax year', 30000), money('other', 'Other income this tax year', 15000), { id: 'ufpls', label: 'A quarter tax free (pot not touched)', def: 1, options: YESNO }, { id: 'sc', label: 'Income tax', def: 0, options: REGION }],
    run: (v) => { const free = v.ufpls === 1 ? v.draw * PN.taxFreeShare : 0; const tax = E.extraTax(v.draw - free, v.other, 1, reg(v.sc));
      return { head: ['Income tax on it', m(tax)], rows: [['Tax free', m(free)], ['You keep', m(v.draw - tax)], ['Marginal rate after it', pc(E.marginalRate(v.other + v.draw - free, reg(v.sc)))]], note: 'Annual figure. The first payment can be taxed on an emergency code and repaid later.' }; },
  },
  cashin: {
    title: 'Cashing in a whole pot, at once or over years', cta: 'Pension and inheritance tax', ctaPage: 'home',
    inputs: [money('pot', 'Pot not yet touched', 100000), money('other', 'Other income a year', 20000), { id: 'years', label: 'Spread over', def: 3, unit: 'yrs', max: 20 }],
    run: (v) => { const free = Math.min(v.pot * PN.taxFreeShare, PN.lumpSumAllowance); const once = E.extraTax(v.pot - free, v.other, 1); const spread = E.extraTax(v.pot - free, v.other, v.years);
      return { head: ['Tax saved by spreading', m(once - spread)], rows: [['Tax if taken in one year', m(once)], [`Tax over ${Math.max(1, Math.round(v.years))} years`, m(spread)], ['Tax-free part', m(free)]] }; },
  },
  'gift-taper': {
    title: 'Tax on a gift if you die within 7 years', cta: 'Gifts in the whole estate', ctaPage: 'home',
    inputs: [money('gift', 'Gift', 400000, 'After the £3,000 yearly exemption'), money('earlier', 'Earlier gifts in the 7 years', 0), { id: 'years', label: 'Years between gift and death', def: 4.5, unit: 'yrs', max: 10, decimals: 1 }],
    run: (v) => { const g = E.giftTax({ gift: v.gift, earlier: v.earlier, years: v.years });
      return { head: ['Tax on the gift', m(g.tax)], rows: [['Above the nil-rate band', m(g.over)], ['Rate after taper relief', pc(g.effective)], ['Band left for the estate', m(g.nrbLeft)]] }; },
  },
  'income-gifts': {
    title: 'Regular gifts from surplus income', cta: 'Your estate with and without them', ctaPage: 'home',
    inputs: [money('month', 'Gift each month', 500), { id: 'years', label: 'For', def: 10, unit: 'yrs', max: 40 }],
    run: (v) => { const total = v.month * 12 * v.years;
      return { head: ['Kept out of the estate', m(total)], rows: [['A year', m(v.month * 12)], ['Inheritance tax it avoids at 40 %', m(total * I.rate)]], note: 'Only if paid from income, regular, and leaving your usual standard of living intact.' }; },
  },
  allowances: {
    title: 'Gifts that are exempt this tax year', cta: 'Gifts above the exemptions', ctaPage: 'seven-year-rule-inheritance-tax',
    inputs: [{ id: 'carry', label: 'Last year’s £3,000 unused', def: 1, options: YESNO }, { id: 'wed', label: 'Children marrying this year', def: 0, max: 10 }, { id: 'small', label: 'People given £250 or less', def: 4, max: 200 }],
    run: (v) => { const annual = I.annualExemption * (v.carry === 1 ? 2 : 1); const wed = I.wedding.child * v.wed; const small = I.smallGift * v.small;
      return { head: ['Exempt this tax year', m(annual + wed + small)], rows: [['Annual exemption', m(annual)], ['Wedding gifts to children', m(wed)], ['Small gifts', m(small)]], note: 'Small gifts cannot go to someone who also gets part of the £3,000.' }; },
  },
  charity: {
    title: 'The 36 % rate with 10 % to charity', cta: 'Whole estate with charity', ctaPage: 'home',
    inputs: [money('estate', 'Estate after debts', 900000), { id: 'pct', label: 'Left to charity', def: 10, unit: '%', max: 100, decimals: 1 }],
    run: (v) => { const r = E.estate({ home: 0, savings: v.estate, pension: 0, status: 'single', homeToDescendants: false, charityShare: v.pct / 100 }, 'after');
      const none = E.estate({ home: 0, savings: v.estate, pension: 0, status: 'single', homeToDescendants: false }, 'after');
      return { head: ['Heirs receive', m(v.estate - r.charity - r.iht)], rows: [['Rate applied', pc(r.rate)], ['Inheritance tax', m(r.iht)], ['To charity', m(r.charity)], ['Heirs with no gift', m(v.estate - none.iht)]] }; },
  },
  freeze: {
    title: 'Frozen thresholds: the estate in 2031', cta: 'The estate today', ctaPage: 'home',
    inputs: [money('estate', 'Estate today, pension included', 800000), { id: 'growth', label: 'Growth a year', def: 3, unit: '%', max: 20, decimals: 1, help: 'Your own assumption' }, { id: 'status', label: 'Situation', def: 0, options: STATUS }],
    run: (v) => { const later = E.grow(v.estate, v.growth / 100, 4.5); const mk = (x: number) => E.estate({ home: Math.min(x, 400000), savings: Math.max(0, x - 400000), pension: 0, status: st(v.status), transferNrb: 1, transferRnrb: 1, homeToDescendants: true }, 'after');
      return { head: ['Tax in April 2031', m(mk(later).iht)], rows: [['Estate then', m(later)], ['Tax today', m(mk(v.estate).iht)], ['Threshold both years', m(mk(v.estate).nrb + mk(v.estate).rnrb)]], note: 'Home of £400,000 left to children assumed. The bands do not move until 5 April 2031.' }; },
  },
  unmarried: {
    title: 'Unmarried partner: no spouse exemption', cta: 'Whole estate', ctaPage: 'home',
    inputs: [money('estate', 'Estate after debts, pension included', 750000), money('home', 'of which the home', 350000)],
    run: (v) => { const x = (desc: boolean) => E.estate({ home: Math.min(v.home, v.estate), savings: Math.max(0, v.estate - v.home), pension: 0, status: 'single', homeToDescendants: desc }, 'after').iht;
      return { head: ['Tax if all left to the partner', m(x(false))], rows: [['If married, left to the spouse', m(0)], ['If the home goes to your children', m(x(true))]], note: 'A partner is not a direct descendant, so no residence band on what they inherit.' }; },
  },
};

export function getSpec(kind: string, _lang = 'en'): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini spec ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
