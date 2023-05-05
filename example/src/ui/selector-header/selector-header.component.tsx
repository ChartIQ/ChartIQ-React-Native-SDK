import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
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
          <TouchableOpacity onPress={handleLeftAction}>
            <Text style={[styles.text]}>{leftActionTitle}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={[styles.flex, styles.aligned]}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
      <View style={[styles.button, styles.alignRight]}>
        {handleRightAction ? (
          <TouchableOpacity onPress={handleRightAction}>
            {rightActionTitle ? <Text style={styles.text}>{rightActionTitle}</Text> : null}
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
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      height: 40,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
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
    },
    button: {
      width: 70,
    },
    alignRight: {
      alignItems: 'flex-end',
    },
    alignLeft: {
      alignItems: 'flex-start',
    },
  });

export default React.memo(SelectorHeader);
