import { defaultLang, ui, type Lang, type UIKey } from './ui';

export function getLang(locale: string | undefined): Lang {
  return locale && locale in ui ? (locale as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey) => ui[lang][key] ?? ui[defaultLang][key];
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
