import React, { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import Icons from '../../assets/icons';
import { Theme, useTheme } from '../../theme';

interface ListItemProps extends PropsWithChildren {
  title?: string;
  textStyle?: StyleProp<TextStyle>;
  titleComponent?: JSX.Element;
  onPress?: () => void;
  value?: string;
  style?: StyleProp<ViewStyle>;
  topBorder?: boolean;
  bottomBorder?: boolean;
  topBorderStyles?: ViewStyle;
  bottomBorderStyles?: ViewStyle;
  containerStyle?: StyleProp<ViewStyle>;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  children,
  textStyle,
  titleComponent,
  onPress,
  value,
  style,
  topBorder = false,
  bottomBorder = true,
  bottomBorderStyles,
  topBorderStyles,
  containerStyle,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.containerBackground, containerStyle]}>
      {topBorder ? <View style={[styles.borderTop, topBorderStyles]} /> : null}
      <Pressable onPress={onPress} style={[styles.container, style]}>
        {title ? <Text style={[styles.title, textStyle]}>{title}</Text> : null}
        {value ? (
          <View style={styles.row}>
            <Text style={[styles.description, textStyle]}>{value}</Text>
            {onPress ? <Icons.chevronRight fill={theme.colors.cardSubtitle} /> : null}
          </View>
        ) : null}
        {titleComponent ? titleComponent : null}
        {children}
      </Pressable>
      {bottomBorder ? <View style={[styles.borderBottom, bottomBorderStyles]} /> : null}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    containerBackground: {
      backgroundColor: theme.colors.background,
    },
    borderTop: {
      borderTopWidth: 1,
      borderColor: theme.colors.border,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: {
      color: theme.colors.cardTitle,
      fontSize: 16,
    },
    description: {
      color: theme.colors.cardSubtitle,
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
    },
  });

export default ListItem;
