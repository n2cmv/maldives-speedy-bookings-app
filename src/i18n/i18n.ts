
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

i18n
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // detect user language
  .use(LanguageDetector)
  // init i18next
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: 'en', // Force default language to English
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false, // Prevents issues with suspense
    },
    detection: {
      // Disable auto detection to always use English by default
      order: [],
      caches: [],
    }
  });

export default i18n;
