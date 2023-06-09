import { colorPickerColors } from '~/constants';

export const colorInitializer = (color: string | undefined, isDark: boolean) => {
  if (color === 'auto' || color === 'black') {
    return isDark ? colorPickerColors[4] : colorPickerColors[colorPickerColors.length - 1];
  }

  return color;
};
