import { Theme, useTheme } from '~/theme';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ListItemProps extends PropsWithChildren {
  title: string;
}

const ListItem: React.FC<ListItemProps> = ({ title, children }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: {
      color: theme.colors.buttonText,
      fontSize: 16,
    },
  });

export default ListItem;
