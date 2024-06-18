import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Icons from '../../assets/icons';
import { useTheme } from '../../theme';

const BackButton = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Pressable onPress={navigation.goBack}>
      <Icons.chevronRight
        style={styles.icon}
        fill={theme.colors.colorPrimary}
        stroke={theme.colors.colorPrimary}
        width={30}
        height={30}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  icon: {
    transform: [{ rotateY: '180deg' }],
  },
});

export default BackButton;
