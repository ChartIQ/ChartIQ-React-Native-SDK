import { defaultENTranslations } from '../../constants/languages';

export interface TranslationsState {
  translationMap: Record<string, string>;
  languageCode: string;
  translations: typeof defaultENTranslations;
}
