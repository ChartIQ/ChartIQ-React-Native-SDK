import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useContext, useMemo } from 'react';
import { ChartIQ } from 'react-native-chart-iq-wrapper';

import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { ChartIQLanguages, defaultENTranslations } from '~/constants/languages';
import { TranslationsActions } from '~/context/translations-context/translations-actions';
import {
  TranslationsContext,
  TranslationsDispatchContext,
} from '~/context/translations-context/translations.context';

export const useTranslations = () => {
  const { languageCode, translationMap, translations } = useContext(TranslationsContext);
  const dispatch = useContext(TranslationsDispatchContext);

  const setLanguage = useCallback(
    async (languageCode: string) => {
      ChartIQ.setLanguage(languageCode);
      const newTranslationsMap = await ChartIQ.getTranslations(languageCode);

      AsyncStorage.setItem(asyncStorageKeys.languageCode, languageCode);
      AsyncStorage.setItem(asyncStorageKeys.translations, JSON.stringify(newTranslationsMap));

      const newTranslations = Object.keys(defaultENTranslations).reduce(
        (acc, item) => ({ ...acc, [item]: newTranslationsMap[item] || item }),
        defaultENTranslations,
      );

      dispatch(
        TranslationsActions.setLanguage({
          languageCode,
          translationMap: newTranslationsMap,
          translations: newTranslations,
        }),
      );
    },
    [dispatch],
  );

  const getTranslationsFromStorage = useCallback(async () => {
    const translationsFromStorage = await AsyncStorage.getItem(asyncStorageKeys.translations);
    const languageCodeFromStorage = await AsyncStorage.getItem(asyncStorageKeys.languageCode);
    if (!translationsFromStorage || !languageCodeFromStorage) {
      setLanguage(ChartIQLanguages.EN.code);
      return;
    }
    const parsedTranslationsMap = JSON.parse(translationsFromStorage);
    const newTranslations = Object.keys(defaultENTranslations).reduce(
      (acc, item) => ({ ...acc, [item]: parsedTranslationsMap[item] || item }),
      defaultENTranslations,
    );
    dispatch(
      TranslationsActions.setLanguage({
        languageCode: languageCodeFromStorage,
        translationMap: parsedTranslationsMap,
        translations: newTranslations,
      }),
    );
  }, [dispatch, setLanguage]);

  const languageName = useMemo(
    () =>
      Object.values(ChartIQLanguages).find((item) => item.code === languageCode)?.title ||
      ChartIQLanguages.EN.title,
    [languageCode],
  );

  return {
    translationMap,
    languageCode,
    translations,
    languageName,
    setLanguage,
    getTranslationsFromStorage,
  };
};
