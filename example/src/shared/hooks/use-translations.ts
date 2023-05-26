import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { defaultENTranslations } from '~/localization/language-keys';

export const useTranslations = () => {
  const [translations, setTranslations] = useState(defaultENTranslations);

  useEffect(() => {
    AsyncStorage.getItem(asyncStorageKeys.translations).then((data) => {
      const parsed = JSON.parse(data || '{}');

      if (Object.keys(parsed).length > 0) {
        setTranslations(parsed);
      } else {
        setTranslations(defaultENTranslations);
      }
    });
  }, []);

  return translations as Record<string, string>;
};
