import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './components/translations/en.json';
import arTranslation from './components/translations/ar.json';
import Cookies from 'js-cookie';

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

const lang: any = Cookies.get('language');
const setLang = () => {
  Cookies.set('language', 'en');
  return 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: !lang ? setLang() : lang, // default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
