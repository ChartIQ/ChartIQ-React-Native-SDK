import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

interface SelectorFiltersProps {
  handleFilterChange: (value: string) => void;
  selectedFilter: string;
  filters: { name: string; value: string }[];
}

const SelectorFilters: React.FC<SelectorFiltersProps> = ({
  handleFilterChange,
  selectedFilter,
  filters,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { translationMap } = useTranslations();
  const translatedFilters = filters.map((item) => ({
    ...item,
    name: translationMap[item.name] ?? item.name,
  }));

  return (
    <FlatList
      horizontal
      data={translatedFilters}
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
