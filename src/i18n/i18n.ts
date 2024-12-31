import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import PRODUCT_EN from 'src/locales/en/product.json';
import PRODUCT_VI from 'src/locales/vi/product.json';
import COMMON_EN from 'src/locales/en/common.json';
import COMMON_VI from 'src/locales/vi/common.json';
import FOOTER_EN from 'src/locales/en/footer.json';
import FOOTER_VI from 'src/locales/vi/footer.json';
import HOME_EN from 'src/locales/en/home.json';
import HOME_VI from 'src/locales/vi/home.json';

export const locales = {
  vi: 'Tiếng việt',
  en: 'English'
} as const;

export const resources = {
  en: {
    //gọi là namespace
    product: PRODUCT_EN,
    common: COMMON_EN,
    footer: FOOTER_EN,
    home: HOME_EN
  },
  vi: {
    product: PRODUCT_VI,
    common: COMMON_VI,
    footer: FOOTER_VI,
    home: HOME_VI
  }
} as const;

export const defaultNS = 'product';

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: 'vi', //ngôn ngữ mặc định
  fallbackLng: 'vi', //trường hợp ko xác định được ngôn ngữ thì trả về loại ngôn ngữ này
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  }
});
