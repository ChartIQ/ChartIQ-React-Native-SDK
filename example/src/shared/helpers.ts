import { colorPickerColors } from '~/constants';

export const colorInitializer = (color: string | undefined, isDark: boolean) => {
  if (color === 'auto' || color === 'black') {
    return isDark ? colorPickerColors[4] : colorPickerColors[colorPickerColors.length - 1];
  }

  return color;
};

export const textOnColor = (color: string) => {
  const indexSeparator = 17;
  const index = colorPickerColors.indexOf(color);
  if (index < 0) return 'black';

  return index < indexSeparator ? 'black' : 'white';
};

export const formatStudyName = (name?: string | null) => {
  if (!name) return '';

  return name.split(' (')[0];
};
