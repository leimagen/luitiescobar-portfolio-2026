import { defaultLang, ui, type Lang, type UIKey } from './ui';
import { cms } from '../lib/cms';

type Localized = { en?: string; es?: string } | undefined;
const st = cms?.settings;
/** UI keys whose text can be edited in Sanity → Site settings. Empty fields keep the default. */
const editable: Partial<Record<UIKey, Localized>> = st
  ? {
      'meta.title': st.metaTitle,
      'meta.description': st.metaDescription,
      'hero.greeting': st.heroGreeting,
      'hero.title.1': st.heroTitle1,
      'hero.title.2': st.heroTitle2,
      'hero.title.3': st.heroTitle3,
      'intro.p1': st.introP1,
      'intro.p2': st.introP2,
      'about.role': st.aboutRole,
      'about.lead': st.aboutLead,
      'about.selftaught': st.selfTaught,
      'contact.availability': st.availability,
      'contact.title.1': st.contactTitle1,
      'contact.title.2': st.contactTitle2,
      'contact.text': st.contactText,
    }
  : {};

export function getLang(locale: string | undefined): Lang {
  return locale && locale in ui ? (locale as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => editable[key]?.[lang] || ui[lang][key] || ui[defaultLang][key];
}

/** Build a localized path: `/about` → `/es/about` for Spanish, unchanged for English. */
export function localizePath(path: string, lang: Lang) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean === '/' ? '/' : clean}`;
}

/** Same page in the other language, used by the language toggle. */
export function switchLangPath(pathname: string, target: Lang) {
  const withoutLang = pathname.replace(/^\/(es)(?=\/|$)/, '') || '/';
  return localizePath(withoutLang, target);
}
