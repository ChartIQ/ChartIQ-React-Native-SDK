import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { defaultHitSlop } from '~/constants';
import { Theme, useTheme } from '~/theme';

interface SelectorHeaderProps {
  leftActionTitle?: string;
  handleLeftAction?: () => void;
  rightActionTitle?: string;
  handleRightAction?: () => void;
  title: string;
  RightActionIcon?: React.ReactElement;
}

const SelectorHeader: React.FC<SelectorHeaderProps> = ({
  title,
  handleLeftAction,
  handleRightAction,
  leftActionTitle,
  rightActionTitle,
  RightActionIcon,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={[styles.button, styles.alignLeft]}>
        {handleLeftAction ? (
          <TouchableOpacity hitSlop={defaultHitSlop} onPress={handleLeftAction}>
            <Text numberOfLines={1} style={[styles.text]}>
              {leftActionTitle}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={[styles.flex, styles.aligned]}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
      <View style={[styles.button, styles.alignRight]}>
        {handleRightAction ? (
          <TouchableOpacity hitSlop={defaultHitSlop} onPress={handleRightAction}>
            {rightActionTitle ? (
              <Text numberOfLines={1} style={styles.text}>
                {rightActionTitle}
              </Text>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {RightActionIcon ? RightActionIcon : null}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      borderTopStartRadius: 12,
      borderTopEndRadius: 12,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
      textTransform: 'capitalize',
    },
    flex: {
      flex: 1,
    },
    aligned: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 17,
      color: theme.colors.buttonText,
      textTransform: 'capitalize',
    },
    button: {
      width: 80,
    },
    alignRight: {
      alignItems: 'flex-end',
    },
    alignLeft: {
      alignItems: 'flex-start',
    },
  });

export default React.memo(SelectorHeader);
