import { useColorScheme } from 'react-native';

import DarkTheme from './dark-theme';

export const useTheme = () => {
  const isDark = true;
  const colors = DarkTheme;
  return { colors, isDark };
};
