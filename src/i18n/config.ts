import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import swTranslations from './locales/sw.json';
import enTranslations from './locales/en.json';

const resources = {
  sw: {
    translation: swTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'sw', // Default to Swahili
    fallbackLng: 'sw', // Fallback to Swahili
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    // Save language preference to localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;