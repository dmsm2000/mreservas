import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationPT from "./locales/pt.json";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passa o plugin react-i18next
  .init({
    resources,
    lng: "pt", // idioma padrão
    fallbackLng: "en", // idioma padrão como fallback
    interpolation: {
      escapeValue: false, // permitir que caracteres especiais em strings traduzidas sejam exibidos corretamente
    },
  });

export default i18n;
