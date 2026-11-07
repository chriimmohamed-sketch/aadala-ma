export const locales = ["ar","zgh","fr","en","es","de","fa","tr","nl","it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";
export const rtlLocales: Locale[] = ["ar","zgh","fa"];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export const localeNames: Record<Locale,string> = {
  ar: "العربية",
  zgh: "ⵜⴰⵎⴰⵣⵉⵖⵜ",
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  fa: "فارسی",
  tr: "Türkçe",
  nl: "Nederlands",
  it: "Italiano",
};