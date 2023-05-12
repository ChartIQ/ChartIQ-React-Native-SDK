import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

/* 
package com.chartiq.demo.ui.settings.language

enum class ChartIQLanguage(val title: String, val code: String) {
    EN("English", "en-US"),
    DE("German", "de-DE"),
    FR("French", "fr-FR"),
    RU("Russian", "ru-RU"),
    IT("Italian", "it-IT"),
    ES("Spanish", "es-ES"),
    PT("Portuguese", "pt-PT"),
    HU("Hungarian", "hu-HU"),
    ZH("Chinese", "zh-CN"),
    JA("Japanese", "ja-JP"),
    AR("Arabic", "ar-EG"),
}
*/

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          'Welcome to React': 'Welcome to React and react-i18next',
        },
      },
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
