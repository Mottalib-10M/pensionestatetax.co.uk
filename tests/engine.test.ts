/** Engine tests. Official worked examples (GOV.UK, HMRC manual) become tests, with their source (RECETTE §17.4). */
import { describe, it, expect } from 'vitest';
import * as E from '../src/lib/engine/iht';
import { P } from '../src/lib/engine/params';

const base: E.EstateInput = { home: 0, savings: 0, pension: 0, status: 'single', homeToDescendants: false, heirs: 1 };

describe('parameters 2026/27', () => {
  it('match the sources read on 19 October 2026', () => {
    expect(P.iht.nrb).toBe(325000);
    expect(P.iht.rnrb).toBe(175000);
    expect(P.iht.taperThreshold).toBe(2000000);
    expect(P.iht.frozenUntilDate).toBe('2031-04-05');
    expect(P.pensions.inEstateFrom).toBe('2027-04-06');
    expect(P.pensions.lumpSumAllowance).toBe(268275);
    expect(P.pensions.lsdba).toBe(1073100);
    expect(P.pensions.directPaymentMin).toBe(1000);
  });
});

describe('GOV.UK and HMRC worked examples', () => {
  it('GOV.UK overview: £500,000 estate, £325,000 threshold, 40 % of £175,000', () => {
    const r = E.estate({ ...base, savings: 500000 }, 'after');
    expect(r.iht).toBeCloseTo(70000, 6);
  });
  it('RNRB guidance: home £300,000 and £190,000 to children, no tax and £10,000 of nil-rate band unused', () => {
    const r = E.estate({ ...base, home: 300000, savings: 190000, homeToDescendants: true }, 'after');
    expect(r.rnrb).toBe(175000);
    expect(r.iht).toBe(0);
    expect(r.nrbLeft - (r.chargeable - r.rnrb)).toBe(10000);
  });
  it('RNRB guidance: flat of £100,000 caps the band at £100,000', () => {
    const b = E.residenceBand({ estate: 500000, home: 100000, homeToDescendants: true });
    expect(b.rnrb).toBe(100000);
  });
  it('taper: £1 for every £2 above £2 million, gone at £2.35 million single', () => {
    expect(E.residenceBand({ estate: 2100000, home: 450000, homeToDescendants: true }).rnrb).toBe(125000);
    expect(E.residenceBand({ estate: 2350000, home: 900000, homeToDescendants: true }).rnrb).toBe(0);
    expect(E.residenceBand({ estate: 2700000, home: 900000, homeToDescendants: true, transferRnrb: 1 }).rnrb).toBe(0);
    expect(E.residenceBand({ estate: 2600000, home: 900000, homeToDescendants: true, transferRnrb: 1 }).rnrb).toBe(50000);
  });
  it('IHTM45010: £750,000 estate, £50,000 to charity, 36 % gives £135,000', () => {
    const r = E.estate({ ...base, savings: 750000, charityShare: 50000 / 750000 }, 'after');
    expect(r.baseline).toBeCloseTo(425000, 4);
    expect(r.charityRateApplies).toBe(true);
    expect(r.iht).toBeCloseTo(135000, 4);
  });
  it('GOV.UK gifts example (Sally): £100,000 above the band, 3 to 4 years, £32,000; estate £160,000', () => {
    const r = E.estate({ ...base, savings: 400000, gifts: 425000, giftYears: 3 }, 'after');
    expect(r.giftTax).toBeCloseTo(32000, 6);
    expect(r.iht).toBeCloseTo(160000, 6);
  });
  it('taper relief shares', () => {
    expect([2.9, 3, 4, 5, 6, 7].map(E.taperShare)).toEqual([1, 0.8, 0.6, 0.4, 0.2, 0]);
  });
});

describe('pensions from 6 April 2027', () => {
  const inp: E.EstateInput = { ...base, home: 400000, savings: 100000, pension: 300000, homeToDescendants: true, heirs: 2 };
  it('before: pension outside the estate; after: inside, taxed at the estate rate', () => {
    const b = E.estate(inp, 'before'), a = E.estate(inp, 'after');
    expect(b.iht).toBe(0);
    expect(a.iht).toBeCloseTo(300000 * 0.4, 6);
    expect(a.ihtOnPension).toBeCloseTo(120000 * 300000 / 800000, 6);
  });
  it('pension to a spouse is exempt', () => {
    const a = E.estate({ ...inp, status: 'married', spousePension: 1, spouseEstate: 1 }, 'after');
    expect(a.iht).toBe(0);
  });
  it('pension counts for the RNRB taper', () => {
    const a = E.estate({ ...inp, savings: 1700000, pension: 400000 }, 'after');
    expect(a.estateForTaper).toBe(2500000);
    expect(a.rnrb).toBe(0);
  });
  it('member 75 or over: income tax on the pension net of the inheritance tax borne', () => {
    const c = E.compare(inp, { age: 80, heirIncome: 30000 });
    const h = c.heirsAfter;
    expect(h.taxablePension).toBeCloseTo(h.pensionShare - h.ihtPensionShare, 6);
    expect(h.incomeTaxShare).toBeCloseTo(E.extraTax(h.taxablePension, 30000), 6);
  });
  it('member under 75: no income tax within the lump sum and death benefit allowance', () => {
    const c = E.compare(inp, { age: 70, heirIncome: 30000 });
    expect(c.heirsAfter.incomeTaxShare).toBe(0);
    const big = E.compare({ ...inp, pension: 1500000 }, { age: 70, heirIncome: 0 });
    expect(big.heirsBefore.lsdbaExcess).toBeCloseTo(1500000 - 1073100, 6);
  });
  it('the 67 % case: IHT 40 % then 45 % income tax on the rest', () => {
    expect(E.combinedRate(0.4, 0.45)).toBeCloseTo(0.67, 10);
    expect(E.combinedRate(0.4, 0.4)).toBeCloseTo(0.64, 10);
    expect(E.combinedRate(0.4, 0.2)).toBeCloseTo(0.52, 10);
  });
});

describe('income tax 2026/27', () => {
  it('rUK at £50,000', () => expect(E.incomeTax(50000)).toBeCloseTo(7486, 6));
  it('Scotland at £50,000', () => expect(E.incomeTax(50000, 'scotland')).toBeCloseTo(3967 * 0.19 + 12989 * 0.2 + 14136 * 0.21 + 6338 * 0.42, 6));
  it('personal allowance gone at £125,140', () => { expect(E.personalAllowance(125140)).toBe(0); expect(E.personalAllowance(100000)).toBe(12570); });
  it('60 % zone between £100,000 and £125,140', () => expect(E.marginalRate(110000)).toBeCloseTo(0.6, 6));
  it('additional rate 45 % above £125,140, Scottish top rate 48 %', () => { expect(E.marginalRate(150000)).toBeCloseTo(0.45, 6); expect(E.marginalRate(150000, 'scotland')).toBeCloseTo(0.48, 6); });
  it('spreading a withdrawal over years lowers the tax', () => expect(E.extraTax(200000, 30000, 5)).toBeLessThan(E.extraTax(200000, 30000, 1)));
});

describe('lifetime pension tax', () => {
  it('25 % tax free, capped at £268,275', () => {
    expect(E.lumpSum({ pot: 100000, other: 0, take: 100000 }).taxFree).toBe(25000);
    const big = E.lumpSum({ pot: 2000000, other: 0 });
    expect(big.taxFree).toBe(268275);
    expect(big.capped).toBe(true);
  });
  it('GOV.UK: £60,000 pot, £15,000 tax free, £45,000 taxed', () => {
    const r = E.lumpSum({ pot: 60000, other: 0 });
    expect(r.taxFree).toBe(15000);
    expect(r.taxable).toBe(45000);
  });
  it('gift tax by years', () => {
    const g = E.giftTax({ gift: 425000, earlier: 0, years: 4.5 });
    expect(g.tax).toBeCloseTo(100000 * 0.4 * 0.6, 6);
  });
});
