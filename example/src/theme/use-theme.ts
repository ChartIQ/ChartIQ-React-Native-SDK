import { useColorScheme } from 'react-native';

import DarkTheme from './dark-theme';
import LightTheme from './light-theme';

export const useTheme = () => {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  const colors = isDark ? DarkTheme : LightTheme;

  return { colors, isDark };
};
