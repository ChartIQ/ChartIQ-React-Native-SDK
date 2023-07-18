import { colorPickerColors } from '~/constants';

export const colorInitializer = (color: string | undefined, isDark: boolean) => {
  if (color === 'auto' || color === 'black') {
    return isDark ? colorPickerColors[4] : colorPickerColors[colorPickerColors.length - 1];
  }

  return color;
};

const rgbFromHex = (hex: string) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b] as const;
};

export const textOnColor = (color: string) => {
  const [red, green, blue] = rgbFromHex(color);
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
    return 'black';
  } else {
    return 'white';
  }
};

export const formatStudyName = (name?: string | null) => {
  if (!name) return '';

  return name.split(' (')[0];
};

export function setFloat(v: string, fun: (input: string) => void): void {
  if (v.length === 0) return fun(v);
  if (v.length > 1 && v[0] === '0' && v[1] !== '.') v = v.slice(1);
  if (v.match(/\./g)?.length > 1) return;
  if (/\d|\./.test(v[v.length - 1])) {
    fun(v);
  }
}
