# Verified facts (read on the official source on 19 October 2026)

Every page of the site may state these facts and nothing beyond them. A figure that lives in
`src/data/params-2026.json` is never typed in a page: use `h.P...` or the engine (`h.E...`, `h.run`,
`h.ledger`). Key names of the sources are those of the parameter file (`h.src('fa2026_s66', 'text')`).

## Pensions in the estate (Finance Act 2026, c. 11, Royal Assent 18 March 2026)

- s.66 inserts **IHTA 1984 s.150A**: a member of a registered pension scheme, a qualifying non-UK pension
  scheme or a section 615(3) scheme is treated as beneficially entitled, immediately before death, to
  "notional pension property". Money purchase: value of the pot that may or must be used to provide
  death benefits. Defined benefits: lump sum death benefits that must, or may and can reasonably be
  expected to, be paid, plus some continuing payments. Source key `fa2026_s66`.
- **Excluded benefits** (s.150A(6)): a dependants' scheme pension; a trivial commutation lump sum death
  benefit that extinguishes a dependants' scheme pension; a dependants' or nominees' annuity purchased
  together with the member's lifetime annuity (joint life annuity); any benefit payable only because the
  member was in employment or other work of a particular description immediately before death (death in
  service). Death in service from a previous job where the member was deferred is NOT excluded; a refund of
  contributions paid in any case is NOT excluded (HMRC technical note, 3.3.4, `gov_tech_note`).
- **Commencement** s.71: deaths on or after **6 April 2027** (`fa2026_s71`).
- **Exemptions** (s.69 amending s.18, s.23, s.24, s.24A, s.25, s.27): pension benefits that a spouse or civil
  partner receives are exempt; benefits given to charities (and registered clubs, political parties, housing
  associations, national bodies) are exempt (`fa2026_s69`). A charity lump sum death benefit is tax free even
  when the member died at 75 or over and counts towards the 10 % charity test (technical note 11.1).
- **Liability** s.67 (new IHTA s.210): the personal representatives are liable for the tax on pension
  property, as well as the person in whom the property vests (the beneficiary). Pension scheme trustees are
  not liable, but the scheme administrator becomes liable if it pays out in breach of a withholding notice
  or fails to meet a payment notice (`fa2026_s67`). PRs who received a certificate of discharge are not
  liable for tax on a pension discovered later, unless they were careless (new s.239(4A)); beneficiaries stay
  liable for it.
- **Withholding notice** s.68 (new IHTA s.226A): PRs (or prospective PRs) may tell a scheme administrator
  to withhold; while it has effect no more than **50 %** of a person's benefit entitlement may be paid; it
  lasts at most until **15 months after the end of the month of death**, or until the tax is paid, or until
  withdrawn. Excluded and exempt benefits are not withheld (`fa2026_s68`).
- **Payment notice** (new s.226B, the "Pensions Direct Payment Scheme"): PRs or a beneficiary can require the
  scheme administrator to pay the inheritance tax attributable to the pension; the amount must be at least
  **£1,000**; the administrator pays within **35 days** beginning with receipt. Benefits are then reduced on a
  just and reasonable basis. Funds used to buy an annuity with an insurer are no longer available
  (technical note 7.4).
- **Income tax relief** s.70 (new ITEPA 2003 s.567B): when a beneficiary receives taxable pension income
  from a death benefit and inheritance tax attributable to it has been borne by them (paid directly, deducted
  by the PRs from their inheritance, reimbursed, or paid by the scheme by payment notice), a deduction equal
  to that inheritance tax is allowed from the taxable pension income. So income tax falls on the pension
  **after** inheritance tax. Effect: 40 % IHT then 45 % income tax gives 40 + 45 × 60 % = **67 %**; at 40 %
  income tax, **64 %**; at 20 %, **52 %**. Use `h.E.combinedRate(0.4, 0.45)`. Refunds of overpaid IHT become
  taxable pension income (s.579CB) when the member was 75 or over.
- **Lump sum and death benefit allowance** (s.637T as amended): when inheritance tax is due, each lump sum
  death benefit is tested against the member's allowance at its "IHT-adjusted amount" (net of the tax).
- **Special lump sum death benefits charge** (non-qualifying person, e.g. a trust): new FA 2004 s.206A gives
  partial repayment where IHT was paid.
- **Not available for pension property** (technical note 11.2): business and agricultural property relief,
  loss on sale relief, paying in 10 yearly instalments. Quick succession relief does apply.
- Normal expenditure out of income and pension withdrawals: HMRC says the changes do not alter the existing
  position; whether gifts funded by pension withdrawals qualify depends on the facts of each case
  (technical note 11.2.5).
- **Numbers (HMRC impact note, 26 November 2025, `gov_tiin`)**: of around **213,000** estates with inheritable
  pension wealth in 2027/28, **10,500** would have an IHT liability where previously they did not, about
  **38,500** would pay more, average liability up about **£34,000**; **79 %** of IHT is paid by estates of
  people aged 75 or over. These are static estimates, presented as a maximum. Exchequer: +£710m in 2027/28
  rising to +£1,665m in 2030/31. Death in service benefits and dependants' scheme pensions from DB or
  collective money purchase arrangements are excluded. Consultation on the process ran 30 Oct 2024 to
  22 Jan 2025; response 21 July 2025 moved liability from schemes to PRs.
- HMRC will provide an Inheritance Tax checker tool by April 2027 (technical note 1.1); draft information
  regulations later in 2026. Do not claim the tool exists today.

## Income tax on inherited pensions (GOV.UK "Tax on a private pension you inherit", technical note 8.1)

- Member died **under 75**: most lump sums tax free unless above the member's lump sum and death benefit
  allowance (£1,073,100 less lump sums taken in life); annuity or new drawdown income tax free. A lump sum
  paid more than **2 years** after the provider is told of the death is taxable in full.
- Member died **at 75 or over**: lump sums, drawdown and annuity payments taxed as the beneficiary's income
  at their marginal rate (PAYE by the provider). Dependants' scheme pensions are always taxed as income
  (but excluded from IHT).
- Before 6 April 2027 most discretionary pension death benefits are outside the estate; non-discretionary
  schemes (some public sector schemes) were already in the estate.

## Thresholds and rates (`gov_iht`, `gov_ootlar`, `fa2021_s86`, `fa2026_s72`)

- Nil-rate band £325,000; residence nil-rate band £175,000; RNRB taper threshold £2 million; rate 40 %;
  36 % when 10 % or more of the baseline goes to charity; lifetime chargeable transfers 20 %.
- **Frozen**: FA 2021 s.86, as amended three times (FA 2023 s.9, FA 2025 s.57, FA 2026 s.72), switches off CPI indexation for the
  tax years up to and including **2030 to 2031**, so the bands stay at these levels until **5 April 2031**.
  (The freeze was extended from 2030 to 2031 at Budget 2025 and enacted on 18 March 2026.)
- RNRB (`gov_rnrb`): only when a home (or share) the person lived in is left to **direct descendants**:
  children, grandchildren and other lineal descendants, their spouses or civil partners, step, adopted and
  foster children, children under guardianship. NOT nephews, nieces, siblings. Capped at the value of the
  home closely inherited; unused cap cannot go against other assets but can transfer to a spouse.
  Tapered by £1 for every £2 the estate exceeds £2 million; estate for the taper = all assets less debts,
  before exemptions (spouse) and reliefs (BPR, APR). From April 2027 the pension counts in the estate, so it
  counts for the taper. Single: gone at £2.35 million; with a transferred band: gone at £2.7 million.
  Downsizing addition exists for homes sold or downsized from 8 July 2015 (claim on IHT435).
  Still available if the PRs sell the home during the administration and pass the proceeds to direct
  descendants, or if the descendants sell it after inheriting (`gov_rnrb`, read 19 October 2026).
- Transfer between spouses (`gov_rnrb_transfer`): the unused **percentage** of each band at the first death is
  added at the second death, at the rates then in force; limited to 100 % extra. Unmarried couples and
  divorced partners cannot transfer. If the first spouse died before 6 April 2017, 100 % of the RNRB is
  treated as unused (unless their estate was above £2 million).
- Charity rate (`ihtm45009`): baseline = estate after exemptions (the charity gift deducted) less the
  nil-rate band left (including transferred band, less lifetime gifts; RNRB NOT deducted), plus the charity
  gift. 36 % applies if the gift is at least 10 % of the baseline. Notional pension property is in the
  general component (technical note 11.1). Worked example IHTM45010: £750,000 estate, £50,000 to charity,
  tax £135,000 at 36 % instead of £150,000.
- Payment (`gov_pay_iht`): by the end of the **sixth month** after the death (death in January, pay by
  31 July); interest after that; a payment is usually needed before probate (confirmation in Scotland).

## Gifts (`gov_iht_gifts`)

- Annual exemption £3,000 a tax year, unused part carried forward one year only; small gifts up to £250 per
  person (not to someone who got part of the £3,000); wedding or civil partnership gifts £5,000 to a child,
  £2,500 to a grandchild or great-grandchild, £1,000 to anyone else; gifts to spouse or civil partner
  (both UK) and to charities and political parties exempt.
- Normal expenditure out of income: no limit if regular, from income, and you can still afford your usual
  living costs (examples: paying rent for a child, paying into a child's savings).
- 7 year rule: no tax if you live 7 years after the gift (not for trusts). Gifts within 3 years: 40 %;
  3 to 4 years 32 %, 4 to 5 years 24 %, 5 to 6 years 16 %, 6 to 7 years 8 % (taper relief). Taper relief only
  applies if gifts in the 7 years exceed the £325,000 threshold. Gifts use the nil-rate band first,
  oldest first; the RNRB never applies to gifts. Recipients pay the tax on gifts above the band.
- Gift with reservation (giving the home but living in it rent free): still in the estate.
- GOV.UK example (Sally, died 1 July 2022): £50,000 9 years before (no tax), £325,000 4 years 2 months before
  (within threshold), £100,000 3 years before: £32,000 at 32 %; estate £400,000 taxed at 40 %: £160,000.

## Lifetime pension tax (`gov_tax_on_pension`, `gov_ootlar`)

- Usually up to **25 %** of a pot tax free, at most **£268,275** (lump sum allowance) unless protected; the
  rest taxed as income. Example: pot £60,000, £15,000 tax free, tax on £45,000. Usually from 55.
- Small pots: up to £10,000 in one go (3 personal, unlimited workplace). Trivial commutation if all pensions
  £30,000 or less (often DB).
- Terminal illness (under 75, less than a year to live): whole pot tax free within the lump sum and death
  benefit allowance.
- Personal Allowance £12,570, reduced by £1 for each £2 above £100,000 (gone at £125,140); rUK bands 20 %
  to £37,700 taxable, 40 % to £125,140, 45 % above. Scotland 2026/27 (`gov_scottish_it`): starter 19 %
  £12,571 to £16,537, basic 20 % to £29,526, intermediate 21 % to £43,662, higher 42 % to £75,000,
  advanced 45 % to £125,140, top 48 % above.

## What the site never says

- No personal advice, no "you should": present options as information ("some families", "one option
  people consider"), with the reminder that a regulated adviser or solicitor looks at a real case.
- No claim about APR/BPR figures, trusts, life insurance in trust, annuity market rates, IHT interest
  rates, the checker tool being live, or any figure not listed here.
