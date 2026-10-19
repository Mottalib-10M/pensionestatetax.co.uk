/** Mini-calculator types (RECETTE §9.3). Each spec lives in `lib/mini-specs.ts` and calls the tested engine. */
export interface MiniInput { id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; help?: string; options?: Array<{ value: string; label: string }> }
export interface MiniOut { head: [string, string]; rows: Array<[string, string]>; note?: string }
export interface MiniSpec { title: string; cta: string; ctaPage?: string; inputs: MiniInput[]; run: (v: Record<string, number>) => MiniOut }
