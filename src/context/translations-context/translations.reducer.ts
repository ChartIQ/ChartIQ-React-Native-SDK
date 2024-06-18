import { ChartIQLanguages } from '@chartiq/react-native-chartiq';

import { defaultENTranslations, defaultENTranslationsMap } from '../../constants/languages';

import { TranslationsAction } from './translations-actions';
import { TranslationsState } from './translations-state-types';

export interface Action {
  type: TranslationsAction;
  payload: TranslationsState;
}

export const translationsInitialState: TranslationsState = {
  translationMap: defaultENTranslationsMap,
  languageCode: ChartIQLanguages.EN.code,
  translations: defaultENTranslations,
};

export function translationsReducer(translationsState: TranslationsState, action: Action) {
  switch (action.type) {
    case TranslationsAction.SET_LANGUAGE: {
      return {
        ...translationsState,
        ...action.payload,
      };
    }

    default: {
      return translationsState;
    }
  }
}
