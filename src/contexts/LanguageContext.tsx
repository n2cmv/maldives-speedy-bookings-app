
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { toast } from 'sonner';

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');
  
  useEffect(() => {
    // Ensure the language is set correctly on initial load
    i18n.changeLanguage(currentLanguage);
  }, []);

  const changeLanguage = (lng: string) => {
    if (lng === currentLanguage) return;

    i18n.changeLanguage(lng)
      .then(() => {
        setCurrentLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        toast.success(lng === 'en' ? 'Language set to English' : 'Idioma cambiado a Español');
      })
      .catch((error) => {
        console.error("Failed to change language:", error);
        toast.error("Failed to change language");
      });
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
