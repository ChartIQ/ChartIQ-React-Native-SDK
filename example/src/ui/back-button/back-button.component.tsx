import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

const BackButton = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { translations } = useTranslations();

  return (
    <Pressable onPress={navigation.goBack}>
      <Text style={styles.text}>{translations.cancel}</Text>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.colorPrimary,
      padding: 8,
      textTransform: 'capitalize',
    },
  });

export default BackButton;
