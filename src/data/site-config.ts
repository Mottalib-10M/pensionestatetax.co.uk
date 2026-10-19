/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://pensionestatetax.co.uk";
export const SITE_NAMES: Record<string, string> = {"en": "Pension Estate Tax"};
export const LANG_TAGS: Record<string, string> = {"en": "en-GB"};
export const OG_LOCALES: Record<string, string> = {"en": "en_GB"};
export const LOCALE_TAG = 'en-GB';
export const CURRENCY = 'GBP';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-19';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Independent publisher of inheritance tax and pension death benefit calculators for the UK"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners publishes Pension Estate Tax, a set of calculators that apply Part 2 of the Finance Act 2026 to UK estates: unused pension funds counted in the estate for deaths from 6 April 2027, the frozen nil-rate bands, the residence nil-rate band taper above £2 million, and the income tax a beneficiary pays when the member died at 75 or over, reduced by the inheritance tax already paid. Every rule is read on legislation.gov.uk or GOV.UK and cited where it is used. No pension provider, adviser or will writer pays for the site, and it gives no personal advice."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["Inheritance tax on unused pension funds from 6 April 2027", "Nil-rate band and residence nil-rate band", "Residence nil-rate band taper above £2 million", "Transferable nil-rate band between spouses and civil partners", "Income tax on inherited pensions when the member died at 75 or over", "Gifts, the seven-year rule and taper relief", "Pension tax-free lump sum and the lump sum allowance"]};
export const CONTACT_EMAIL = "contact@pensionestatetax.co.uk";
export const THEME_COLOR = '#8C1D2F';
export const LOGO_SYMBOL = 'IHT';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'f8f5de0f0cfa83e8660596c05e68427a';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',             // ex. entreprise individuelle, SASU, GmbH, eenmanszaak
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
