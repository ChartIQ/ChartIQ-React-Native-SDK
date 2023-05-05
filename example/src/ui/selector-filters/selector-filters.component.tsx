import { Theme, useTheme } from '~/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface SelectorFiltersProps {
  filters: { name: string; value: string }[];
  handleFilterChange: (value: string) => void;
  selectedFilter: string;
}

const SelectorFilters: React.FC<SelectorFiltersProps> = ({
  filters,
  handleFilterChange,
  selectedFilter,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <FlatList
      horizontal
      data={filters}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContentContainer}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleFilterChange(item.value)}
          style={[
            styles.filterCard,
            item.value === selectedFilter ? styles.selectedCardBorder : {},
          ]}
        >
          <Text style={styles.filterItemText}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
  });

export default SelectorFilters;
