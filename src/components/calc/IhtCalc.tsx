/**
 * Main tool: an estate (home, savings, unused pension) x family situation x age at death x heirs.
 * Shows inheritance tax for a death before 6 April 2027 and from that date, the income tax heirs pay on the
 * pension when the member was 75 or over (net of the inheritance tax borne, ITEPA s.567B), and what each
 * heir keeps. All arithmetic is `lib/engine/iht.ts`.
 * Hydration (RECETTE §17.5): first render = props defaults; link parameters applied in an effect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { compare, type EstateInput } from '../../lib/engine/iht';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

export type Family = 'single' | 'widowed' | 'married-children' | 'married-partner' | 'married-split';
interface Props {
  home?: number; savings?: number; pension?: number; age?: number; family?: Family; toDescendants?: boolean;
  heirs?: number; heirIncome?: number; debts?: number; gifts?: number; giftYears?: number; charity?: number;
  transfer?: number; years?: number; scotland?: boolean; methodHref: string; idPrefix?: string;
}
const m = (n: number) => formatMoney(Math.round(n), 0);
const pc = (x: number) => formatPercent(Math.round(x * 1000) / 1000, 1);
const FAMILY = [
  { value: 'single', label: 'Single, divorced or unmarried partner' },
  { value: 'widowed', label: 'Widowed (late spouse’s bands available)' },
  { value: 'married-children', label: 'Married: everything to the children' },
  { value: 'married-split', label: 'Married: estate to partner, pension to children' },
  { value: 'married-partner', label: 'Married: everything to the partner' },
];
const FR = P.pensions.inEstateFrom;

export default function IhtCalc(p: Props) {
  const d = { home: 400000, savings: 100000, pension: 300000, age: 78, family: 'single' as Family, toDescendants: true, heirs: 2, heirIncome: 45000, debts: 0, gifts: 0, giftYears: 2, charity: 0, transfer: 100, years: 1, scotland: false, ...p };
  const [home, setHome] = useState(d.home);
  const [savings, setSavings] = useState(d.savings);
  const [pension, setPension] = useState(d.pension);
  const [age, setAge] = useState(d.age);
  const [family, setFamily] = useState<Family>(d.family);
  const [toDesc, setToDesc] = useState(d.toDescendants);
  const [nHeirs, setNHeirs] = useState(d.heirs);
  const [heirIncome, setHeirIncome] = useState(d.heirIncome);
  const [debts, setDebts] = useState(d.debts);
  const [gifts, setGifts] = useState(d.gifts);
  const [giftYears, setGiftYears] = useState(d.giftYears);
  const [charity, setCharity] = useState(d.charity);
  const [transfer, setTransfer] = useState(d.transfer);
  const [years, setYears] = useState(d.years);
  const [scot, setScot] = useState(d.scotland);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setHome(num(u, 'h', d.home)); setSavings(num(u, 's', d.savings)); setPension(num(u, 'p', d.pension)); setAge(num(u, 'a', d.age));
    const f = str(u, 'f', d.family); if (FAMILY.some((x) => x.value === f)) setFamily(f as Family);
    setToDesc(str(u, 'k', d.toDescendants ? '1' : '0') === '1'); setNHeirs(num(u, 'n', d.heirs)); setHeirIncome(num(u, 'i', d.heirIncome));
    setDebts(num(u, 'd', d.debts)); setGifts(num(u, 'g', d.gifts)); setGiftYears(num(u, 'gy', d.giftYears)); setCharity(num(u, 'c', d.charity));
    setTransfer(num(u, 't', d.transfer)); setYears(num(u, 'y', d.years)); setScot(str(u, 'sc', d.scotland ? '1' : '0') === '1');
  }, []);
  useEffect(() => {
    updateURL({ h: home, s: savings, p: pension, a: age, f: family, k: toDesc ? 1 : 0, n: nHeirs, i: heirIncome, d: debts || undefined, g: gifts || undefined, gy: gifts ? giftYears : undefined, c: charity || undefined, t: family === 'widowed' ? transfer : undefined, y: years > 1 ? years : undefined, sc: scot ? 1 : undefined });
  }, [home, savings, pension, age, family, toDesc, nHeirs, heirIncome, debts, gifts, giftYears, charity, transfer, years, scot]);

  const inp: EstateInput = useMemo(() => {
    const married = family.startsWith('married');
    return {
      home, savings, debts, pension, homeToDescendants: toDesc, heirs: nHeirs, gifts, giftYears, charityShare: charity / 100,
      status: married ? 'married' : family === 'widowed' ? 'widowed' : 'single',
      transferNrb: transfer / 100, transferRnrb: transfer / 100,
      spouseEstate: family === 'married-partner' || family === 'married-split' ? 1 : 0,
      spousePension: family === 'married-partner' ? 1 : 0,
    };
  }, [home, savings, debts, pension, toDesc, nHeirs, gifts, giftYears, charity, family, transfer]);
  const r = useMemo(() => compare(inp, { age, heirIncome, years, region: scot ? 'scotland' : 'ruk' }), [inp, age, heirIncome, years, scot]);
  const a = r.after, b = r.before, ha = r.heirsAfter, hb = r.heirsBefore;
  const diff = a.iht - b.iht;
  const over75 = age >= P.pensions.deathAgeIncomeTax;
  const allToPartner = family === 'married-partner';
  const share = () => { try { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard refused */ } };
  const id = (x: string) => `${p.idPrefix ?? 'iht'}-${x}`;
  const row = (label: string, x: number, y: number, strong = false) => (
    <tr key={label} className={strong ? 'total' : ''}><td className="pr-2 text-navy-700">{label}</td><td className="tabular-nums text-right text-navy-900">{m(x)}</td><td className="tabular-nums text-right text-navy-900">{m(y)}</td></tr>
  );

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('home')} label="Home (your share)" value={home} onChange={setHome} unit="£" max={50_000_000} help="Market value of what you own" />
            <NumberField id={id('savings')} label="Savings, ISAs, investments" value={savings} onChange={setSavings} unit="£" max={50_000_000} help="Everything else you own" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('pension')} label="Unused pension pots" value={pension} onChange={setPension} unit="£" max={50_000_000} help="Drawdown and untouched pots, lump sums on death" />
            <NumberField id={id('age')} label="Age at death" value={age} onChange={setAge} unit="yrs" max={120} help="75 or over: heirs pay income tax on the pension" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('family')} label="Family situation" value={family} onChange={(v) => setFamily(v as Family)} options={FAMILY} />
            <Toggle id={id('desc')} label="Home left to children or grandchildren" value={toDesc ? '1' : '0'} onChange={(v) => setToDesc(v === '1')} options={[{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('heirs')} label="Heirs sharing equally" value={nHeirs} onChange={setNHeirs} max={12} help="Children, or anyone else named" />
            <NumberField id={id('inc')} label="Each heir’s own income" value={heirIncome} onChange={setHeirIncome} unit="£" max={10_000_000} help="Salary or pension a year, sets their tax rate" />
          </div>
          <details className="border-t border-navy-200 pt-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-800">More: debts, gifts, charity, Scotland, spreading withdrawals</summary>
            <div className="mt-3 grid gap-4">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('debts')} label="Debts and funeral costs" value={debts} onChange={setDebts} unit="£" max={50_000_000} />
                <NumberField id={id('charity')} label="Share of the estate to charity" value={charity} onChange={setCharity} unit="%" max={100} decimals={1} help="10 % or more can bring the 36 % rate" />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('gifts')} label="Gifts in the last 7 years" value={gifts} onChange={setGifts} unit="£" max={50_000_000} help="After the yearly exemptions" />
                <NumberField id={id('gy')} label="Years before death (largest gift)" value={giftYears} onChange={setGiftYears} unit="yrs" max={7} decimals={1} />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('years')} label="Heirs draw the pension over" value={years} onChange={setYears} unit="yrs" max={40} help="1 = all in one tax year" />
                <Toggle id={id('scot')} label="Heirs pay Scottish income tax" value={scot ? '1' : '0'} onChange={(v) => setScot(v === '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
              </div>
              {family === 'widowed' && (
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                  <NumberField id={id('transfer')} label="Late spouse’s bands left unused" value={transfer} onChange={setTransfer} unit="%" max={100} help="100 % if everything went to you" />
                </div>
              )}
            </div>
          </details>
        </form>
        <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">Inheritance tax on a death from 6 April 2027</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{m(a.iht + a.giftTax)}</p>
          <p className="mt-1 text-sm text-navy-800">{diff > 0.5 ? <>That is <strong className="tabular-nums">{m(diff)}</strong> more than for a death before that date, because the pension now counts.</> : allToPartner ? 'Nothing is due while everything passes to a spouse or civil partner; the bill comes at the second death.' : 'The pension does not change the bill for this estate.'}</p>
          <table className="ledger mt-3 w-full text-sm">
            <thead><tr><th className="text-left font-medium text-navy-600"></th><th className="text-right text-xs font-medium text-navy-600">Before 6/4/27</th><th className="text-right text-xs font-medium text-navy-600">From 6/4/27</th></tr></thead>
            <tbody>
              {row('Estate counted', b.estateForTaper, a.estateForTaper)}
              {row('Tax-free bands used', b.threshold, a.threshold)}
              {row(`Inheritance tax at ${pc(a.rate)}`, b.iht, a.iht)}
              {row('of which on the pension', b.ihtOnPension, a.ihtOnPension)}
              {(a.giftTax > 0 || b.giftTax > 0) && row('Tax on gifts (paid by recipients)', b.giftTax, a.giftTax)}
              {row(over75 ? 'Heirs’ income tax on the pension' : 'Heirs’ income tax (under 75)', hb.totalIncomeTax, ha.totalIncomeTax)}
              {!allToPartner && row(`Each of ${ha.heirs} heir${ha.heirs > 1 ? 's' : ''} keeps`, hb.total, ha.total, true)}
            </tbody>
          </table>
          {pension > 0 && !allToPartner && <p className="mt-2 text-sm text-navy-800">Of each £100 of pension passed on, tax takes <strong className="tabular-nums">{m(ha.pensionTaxRate * 100)}</strong> from April 2027, against <strong className="tabular-nums">{m(hb.pensionTaxRate * 100)}</strong> before.</p>}
          <p className="mt-2 text-xs text-navy-600">Residence band {m(a.rnrb)}{a.rnrbTaper > 0 ? `, cut by ${m(a.rnrbTaper)} above £2 million` : ''}{a.charityRateApplies ? '; 36 % charity rate applied' : ''}. Estimate only, not advice.</p>
        </div>
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">From April 2027: <strong className="tabular-nums">{m(a.iht + a.giftTax)}</strong> inheritance tax{diff > 0.5 ? <> · <strong className="tabular-nums">+{m(diff)}</strong> because of the pension</> : null}</div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button type="button" onClick={share} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy a link to this estate'}</button>
        <button type="button" onClick={() => window.print()} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
        <a href={p.methodHref} className="text-accent-700 underline underline-offset-2">How this is calculated</a>
        <span className="text-xs text-navy-600">Rules of the Finance Act 2026 for deaths from {FR.split('-').reverse().join('/')}. Business and agricultural relief, trusts and foreign assets are not modelled.</span>
      </div>
    </div>
  );
}
