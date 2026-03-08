import { createContext, useContext, useState, useCallback } from "react";
import { translations, type Locale } from "@/i18n/translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const detectLocale = (): Locale => {
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored && translations[stored]) return stored;

  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("zh")) return "zh";
  return "en";
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "ko",
  setLocale: () => {},
  t: (key: string) => key,
});

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: string) => translations[locale]?.[key] ?? translations["en"]?.[key] ?? key,
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
