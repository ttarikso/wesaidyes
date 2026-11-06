export type Language = "en" | "tr" | "es" | "fr" | "de";

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  locale: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", locale: "en-US" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", locale: "tr-TR" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", locale: "es-ES" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", locale: "fr-FR" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", locale: "de-DE" },
];

export const DEFAULT_LANGUAGE: Language = "en";

export function isValidLanguage(code: unknown): code is Language {
  return typeof code === "string" && ["en", "tr", "es", "fr", "de"].includes(code);
}

export function getLanguageMeta(code: Language): LanguageMeta {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
