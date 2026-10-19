/**
 * Inheritance tax on a UK estate, with and without unused pension funds, and the income tax heirs pay on
 * inherited pensions. Pure functions; every figure comes from `data/params-2026.json`.
 *
 * Law applied (sources in the parameter file):
 * - IHTA 1984 s.150A (Finance Act 2026 s.66): from 6 April 2027 (s.71) unused pension funds and lump sum
 *   death benefits are part of the estate; excluded benefits (dependants' scheme pensions, joint-life
 *   annuities bought with the member's annuity, death in service benefits) are not.
 * - s.18 and s.23 as extended by FA 2026 s.69: pension benefits paid to a spouse, civil partner or charity
 *   are exempt.
 * - Nil-rate band £325,000 and residence nil-rate band £175,000, frozen to 2030/31 (FA 2021 s.86 as amended
 *   by FA 2026 s.72); RNRB tapered by £1 for every £2 of estate above £2 million, the estate taken after
 *   debts and before exemptions and reliefs; unused bands of a late spouse transferable as a percentage.
 * - Lifetime gifts within 7 years use the nil-rate band first; tax on a gift above it is reduced by taper
 *   relief (GOV.UK rates 32 %, 24 %, 16 %, 8 %).
 * - 36 % rate when charitable gifts are 10 % or more of the baseline amount (IHTM45009: estate after
 *   exemptions, less the nil-rate band left, plus the charitable gift). One general component assumed:
 *   notional pension property belongs to the general component (HMRC technical note, 11.1).
 * - Tax is spread over the chargeable estate at the estate rate, so the pension carries its share.
 * - Income tax on pension death benefits when the member died at 75 or over, at the heir's marginal rates;
 *   the inheritance tax borne on the benefit is deducted from the taxable amount (ITEPA 2003 s.567B,
 *   FA 2026 s.70). Member under 75: lump sums are tax free up to the lump sum and death benefit
 *   allowance, tested net of inheritance tax (ITEPA s.637T as amended); beneficiary drawdown is tax free.
 */
import { P } from './params';

const I = P.iht;
const PN = P.pensions;
const clamp = (x: number, lo = 0, hi = Infinity) => Math.min(hi, Math.max(lo, Number.isFinite(x) ? x : 0));

export type Status = 'single' | 'widowed' | 'married';
export type Region = 'ruk' | 'scotland';
export type Regime = 'before' | 'after';

/** Who receives what. `spouseEstate`/`spousePension`: shares (0 to 1) going to a spouse or civil partner. */
export interface EstateInput {
  home: number;
  savings: number;
  other?: number;
  debts?: number;
  pension: number;
  /** Excluded benefits (death in service lump sum, dependants' pensions valued): never in the estate. */
  excluded?: number;
  status: Status;
  /** Widowed: share of the late spouse's nil-rate band left unused (0 to 1). */
  transferNrb?: number;
  /** Widowed: share of the late spouse's residence nil-rate band left unused (0 to 1). */
  transferRnrb?: number;
  /** The home (or its sale proceeds) goes to children, grandchildren or their spouses. */
  homeToDescendants: boolean;
  spouseEstate?: number;
  spousePension?: number;
  /** Share of the free estate (after debts) left to charity, 0 to 1. */
  charityShare?: number;
  /** Chargeable lifetime gifts made in the 7 years before death, after the annual exemptions. */
  gifts?: number;
  giftYears?: number;
  /** Number of heirs sharing equally what does not go to a spouse or charity. */
  heirs?: number;
}

export interface EstateResult {
  regime: Regime;
  free: number;
  pensionInEstate: number;
  estateForTaper: number;
  exemptSpouse: number;
  charity: number;
  chargeable: number;
  nrb: number;
  nrbUsedByGifts: number;
  nrbLeft: number;
  rnrbDefault: number;
  rnrbTaper: number;
  rnrb: number;
  taxable: number;
  rate: number;
  charityRateApplies: boolean;
  baseline: number;
  iht: number;
  estateRate: number;
  ihtOnPension: number;
  ihtOnFree: number;
  giftTax: number;
  giftTaperShare: number;
  threshold: number;
}

export const taperShare = (years: number) => {
  const y = clamp(years);
  return (I.taper.find((t) => y >= t.fromYears && y < t.toYears) ?? I.taper[I.taper.length - 1]).share;
};

/** Residence nil-rate band of an estate: allowance plus transferred share, less taper, capped by the home. */
export function residenceBand(o: { estate: number; home: number; homeToDescendants: boolean; transferRnrb?: number }) {
  const def = I.rnrb * (1 + clamp(o.transferRnrb ?? 0, 0, 1));
  const taper = clamp((o.estate - I.taperThreshold) / I.taperDivisor);
  const adjusted = clamp(def - taper);
  const rnrb = o.homeToDescendants ? Math.min(adjusted, clamp(o.home)) : 0;
  return { def, taper, adjusted, rnrb };
}

export function estate(inp: EstateInput, regime: Regime): EstateResult {
  const debts = clamp(inp.debts ?? 0);
  const free = clamp(clamp(inp.home) + clamp(inp.savings) + clamp(inp.other ?? 0) - debts);
  const pensionInEstate = regime === 'after' ? clamp(inp.pension) : 0;
  const married = inp.status === 'married';
  const sE = married ? clamp(inp.spouseEstate ?? 0, 0, 1) : 0;
  const sP = married ? clamp(inp.spousePension ?? 0, 0, 1) : 0;
  const charity = free * (1 - sE) * clamp(inp.charityShare ?? 0, 0, 1);
  const exemptSpouse = free * sE + pensionInEstate * sP;
  const estateForTaper = free + pensionInEstate;
  const chargeable = clamp(estateForTaper - exemptSpouse - charity);
  const widowed = inp.status === 'widowed';
  const nrb = I.nrb * (1 + (widowed ? clamp(inp.transferNrb ?? 0, 0, 1) : 0));
  const gifts = clamp(inp.gifts ?? 0);
  const nrbUsedByGifts = Math.min(nrb, gifts);
  const nrbLeft = nrb - nrbUsedByGifts;
  const giftTaperShare = taperShare(inp.giftYears ?? 0);
  const giftTax = clamp(gifts - nrb) * I.rate * giftTaperShare;
  // The home only earns the RNRB on the share that is closely inherited, not on a share left to a spouse.
  const homeClose = inp.homeToDescendants ? clamp(inp.home) * (1 - sE) : 0;
  const rb = residenceBand({ estate: estateForTaper, home: homeClose, homeToDescendants: inp.homeToDescendants && homeClose > 0, transferRnrb: widowed ? inp.transferRnrb : 0 });
  const rnrb = Math.min(rb.rnrb, chargeable);
  const taxable = clamp(chargeable - rnrb - nrbLeft);
  const baseline = clamp(chargeable - nrbLeft) + charity;
  const charityRateApplies = charity > 0 && baseline > 0 && charity >= I.charityTest * baseline - 1e-9;
  const rate = charityRateApplies ? I.charityRate : I.rate;
  const iht = taxable * rate;
  const estateRate = chargeable > 0 ? iht / chargeable : 0;
  const pensionChargeable = pensionInEstate * (1 - sP);
  const ihtOnPension = pensionChargeable * estateRate;
  return {
    regime, free, pensionInEstate, estateForTaper, exemptSpouse, charity, chargeable, nrb, nrbUsedByGifts, nrbLeft,
    rnrbDefault: rb.def, rnrbTaper: rb.taper, rnrb, taxable, rate, charityRateApplies, baseline, iht, estateRate,
    ihtOnPension, ihtOnFree: iht - ihtOnPension, giftTax, giftTaperShare, threshold: nrbLeft + rnrb,
  };
}

/* ------------------------------------------------------------------ income tax */

const BANDS = (region: Region) => P.incomeTax[region].bands;

export function personalAllowance(income: number) {
  const it = P.incomeTax;
  return clamp(it.personalAllowance - clamp(income - it.paTaperFrom) / 2);
}

/** Income tax on non-savings income (wages, pensions) for one tax year, 2026/27 rates. */
export function incomeTax(income: number, region: Region = 'ruk') {
  const inc = clamp(income);
  const taxable = clamp(inc - personalAllowance(inc));
  let tax = 0, prev = 0;
  for (const b of BANDS(region)) {
    const top = b.upTo ?? Infinity;
    const slice = Math.min(taxable, top) - prev;
    if (slice <= 0) break;
    tax += slice * b.rate;
    prev = top;
  }
  return tax;
}

/** Marginal rate on the next pound above `income`, Personal Allowance taper included (the 60 % zone). */
export function marginalRate(income: number, region: Region = 'ruk') {
  return (incomeTax(income + 100, region) - incomeTax(income, region)) / 100;
}

/** Extra income tax caused by `amount` taken on top of `other` income, spread evenly over `years` tax years. */
export function extraTax(amount: number, other: number, years = 1, region: Region = 'ruk') {
  const y = Math.max(1, Math.round(clamp(years, 1, 40)));
  const per = clamp(amount) / y;
  return y * (incomeTax(clamp(other) + per, region) - incomeTax(clamp(other), region));
}

/* ------------------------------------------------------------------ heirs */

export interface HeirInput {
  /** Age of the member at death. */
  age: number;
  /** Heir's other taxable income each year (salary, pensions). */
  heirIncome: number;
  region?: Region;
  /** Years over which each heir draws the inherited pension (1 = all at once). */
  years?: number;
  /** Tax-free cash the member took in life (uses the lump sum and death benefit allowance). */
  taxFreeTaken?: number;
}

export interface HeirsResult {
  heirs: number;
  /** Per heir: gross pension share, IHT borne on it, taxable amount, income tax, kept. */
  pensionShare: number;
  ihtPensionShare: number;
  taxablePension: number;
  incomeTaxShare: number;
  pensionKept: number;
  /** Per heir: share of the free estate after its inheritance tax. */
  estateShare: number;
  total: number;
  totalIncomeTax: number;
  /** Inheritance tax plus income tax on the pension, as a share of the pension passed to heirs. */
  pensionTaxRate: number;
  lsdbaExcess: number;
}

export function heirs(inp: EstateInput, r: EstateResult, h: HeirInput): HeirsResult {
  const n = Math.max(1, Math.round(clamp(inp.heirs ?? 1, 1, 12)));
  const sP = inp.status === 'married' ? clamp(inp.spousePension ?? 0, 0, 1) : 0;
  const sE = inp.status === 'married' ? clamp(inp.spouseEstate ?? 0, 0, 1) : 0;
  const pensionToHeirs = clamp(inp.pension) * (1 - sP);
  const pensionShare = pensionToHeirs / n;
  const ihtPensionShare = r.ihtOnPension / n;
  const region = h.region ?? 'ruk';
  let taxablePension = 0, lsdbaExcess = 0;
  if (h.age >= PN.deathAgeIncomeTax) {
    // s.567B: the inheritance tax borne on the benefit comes off the taxable pension income.
    taxablePension = clamp(pensionShare - ihtPensionShare);
  } else {
    // Under 75: lump sums are tax free within the member's remaining allowance, tested net of IHT (s.637T).
    const left = clamp(PN.lsdba - clamp(h.taxFreeTaken ?? 0));
    const tested = clamp(pensionToHeirs - r.ihtOnPension);
    lsdbaExcess = clamp(tested - left);
    taxablePension = lsdbaExcess / n;
  }
  const yrs = h.age >= PN.deathAgeIncomeTax ? (h.years ?? 1) : 1;
  const incomeTaxShare = extraTax(taxablePension, h.heirIncome, yrs, region);
  const pensionKept = pensionShare - ihtPensionShare - incomeTaxShare;
  const estateToHeirs = r.free * (1 - sE) - r.charity - r.ihtOnFree;
  const estateShare = clamp(estateToHeirs) / n;
  const pensionTaxRate = pensionShare > 0 ? (ihtPensionShare + incomeTaxShare) / pensionShare : 0;
  return { heirs: n, pensionShare, ihtPensionShare, taxablePension, incomeTaxShare, pensionKept, estateShare, total: estateShare + pensionKept, totalIncomeTax: incomeTaxShare * n, pensionTaxRate, lsdbaExcess };
}

/** Both regimes side by side: the estate dying on 5 April 2027 and on or after 6 April 2027. */
export function compare(inp: EstateInput, h: HeirInput) {
  const before = estate(inp, 'before');
  const after = estate(inp, 'after');
  return { before, after, heirsBefore: heirs(inp, before, h), heirsAfter: heirs(inp, after, h) };
}

/** The combined rate on £1 of pension: IHT at `ihtRate`, then income tax at `marginal` on what is left. */
export const combinedRate = (ihtRate: number, marginal: number) => ihtRate + marginal * (1 - ihtRate);

/* ------------------------------------------------------------------ lifetime pension tax */

/** Taking a pot: 25 % tax free up to the lump sum allowance left, the rest taxed as income this year. */
export function lumpSum(o: { pot: number; allowanceUsed?: number; other: number; region?: Region; take?: number }) {
  const pot = clamp(o.pot);
  const take = clamp(o.take ?? pot, 0, pot);
  const left = clamp(PN.lumpSumAllowance - clamp(o.allowanceUsed ?? 0));
  const taxFree = Math.min(take * PN.taxFreeShare, left);
  const taxable = take - taxFree;
  const tax = extraTax(taxable, o.other, 1, o.region ?? 'ruk');
  return { take, taxFree, taxable, tax, net: take - tax, left, capped: take * PN.taxFreeShare > left };
}

/** Annuity income from a pot at a quoted rate, with income tax at 2026/27 rates. */
export function annuity(o: { pot: number; rate: number; other: number; region?: Region; taxFreeFirst?: boolean }) {
  const pot = clamp(o.pot);
  const cash = o.taxFreeFirst ? Math.min(pot * PN.taxFreeShare, PN.lumpSumAllowance) : 0;
  const income = (pot - cash) * clamp(o.rate, 0, 0.5);
  const tax = extraTax(income, o.other, 1, o.region ?? 'ruk');
  return { cash, income, tax, net: income - tax, monthly: (income - tax) / 12 };
}

/** Projection of an estate under frozen thresholds: value after `years` at `growth` a year. */
export function grow(value: number, growth: number, years: number) {
  return clamp(value) * Math.pow(1 + clamp(growth, -0.5, 0.5), clamp(years, 0, 60));
}

/** Tax on a gift above the nil-rate band, by years between gift and death. */
export function giftTax(o: { gift: number; earlier: number; years: number; nrb?: number }) {
  const nrb = o.nrb ?? I.nrb;
  const usedBefore = Math.min(nrb, clamp(o.earlier));
  const over = clamp(clamp(o.gift) - (nrb - usedBefore));
  const share = taperShare(o.years);
  return { over, share, full: over * I.rate, tax: over * I.rate * share, effective: I.rate * share, nrbLeft: clamp(nrb - usedBefore - clamp(o.gift)) };
}
