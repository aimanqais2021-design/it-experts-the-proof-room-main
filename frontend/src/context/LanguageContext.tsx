import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('ite_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('ite_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (newLang: Language) => setLangState(newLang);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
