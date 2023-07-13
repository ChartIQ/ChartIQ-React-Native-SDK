import { StyleSheet } from 'react-native';

import { Theme } from '~/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    otherToolsContainer: {
      width: '100%',
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    crosshairContainer: {
      backgroundColor: theme.colors.background,
      width: '100%',
    },
    container: {
      backgroundColor: theme.colors.background,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: theme.colors.buttonBackground,
      height: 32,
      width: 76,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.colors.buttonText,
      paddingHorizontal: 4,
      textAlign: 'center',
      width: 68,
    },
    selectedButtonText: {
      color: theme.colors.buttonBackground,
    },
    space: {
      width: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    chartStyleButton: {
      borderRadius: 32,
      backgroundColor: theme.colors.buttonBackground,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      width: 32,
      height: 32,
    },
    selectedButton: {
      backgroundColor: theme.colors.buttonText,
    },
    iconMargin: {
      margin: 4,
    },
    itemContainer: {
      paddingHorizontal: 4,
    },
    buttonsContainer: {
      flex: 1,
    },
  });
