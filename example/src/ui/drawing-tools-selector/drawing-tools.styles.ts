import { StyleSheet } from 'react-native';

import { Theme } from '~/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contentContainer: {
      backgroundColor: theme.colors.background,
      paddingBottom: 16,
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },

    cardSubtitle: {
      color: theme.colors.cardTitle,
      fontSize: 13,
    },
    cardDescription: {
      color: theme.colors.cardSubtitle,
      fontSize: 15,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.buttonBackground,
      marginHorizontal: 12,
    },
    textInput: {
      flex: 1,
      color: theme.colors.buttonText,
    },
    filterContainer: {
      backgroundColor: theme.colors.background,
    },
    filterContentContainer: {
      paddingVertical: 16,
      paddingLeft: 16,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterCard: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: 8,
    },
    selectedCardBorder: {
      borderColor: theme.colors.colorPrimary,
      borderWidth: 2,
    },
    filterItemText: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      color: theme.colors.buttonText,
    },

    listEmptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 36,
      backgroundColor: theme.colors.background,
    },
    emptyListTextTitle: {
      color: theme.colors.cardSubtitle,
      fontSize: 20,
    },
    emptyListTextDescription: {
      color: theme.colors.cardSubtitle,
      fontSize: 16,
      textAlign: 'center',
    },

    primaryButtonText: {
      color: theme.colors.primaryButtonText,
      paddingVertical: 18,
    },
    primaryButton: {
      width: '100%',
      backgroundColor: theme.colors.colorPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },

    space16: {
      height: 16,
    },
    space32: {
      height: 32,
    },
    space64: {
      height: 64,
    },

    sectionHeaderContainer: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingBottom: 6,
      paddingTop: 16,
    },
    sectionHeaderText: {
      color: theme.colors.cardSubtitle,
      fontSize: 13,
      textTransform: 'uppercase',
    },

    moreContainer: {
      borderRadius: 20,
      backgroundColor: theme.colors.buttonBackground,
    },
    more: {
      transform: [{ rotateZ: '90deg' }],
    },
    bottomBorderStyle: {
      marginLeft: 16,
    },
  });
