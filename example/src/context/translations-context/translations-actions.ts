import { TranslationsState } from './translations-state-types';
import { Action } from './translations.reducer';

export enum TranslationsAction {
  SET_LANGUAGE = 'SET_LANGUAGE',
}

function setLanguage(newState: TranslationsState): Action {
  return {
    type: TranslationsAction.SET_LANGUAGE,
    payload: newState,
  };
}

export const TranslationsActions = {
  setLanguage,
};
