import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';

import Icons from '../../assets/icons';
import { BottomSheet } from '../bottom-sheet';
import { Input } from '../input';
import { FilterSelector } from '../selector-filters';
import { ChartSymbol, fetchSymbolsAsync } from '~/api';
import { DEFAULT_VALUE_FUNDS, DEFAULT_VALUE_MAX_RESULT } from '~/constants';
import { useTheme, Theme } from '~/theme';

interface SymbolSelectorProps {
  onChange: (symbol: ChartSymbol) => void;
}

export interface SymbolSelectorMethods {
  open: () => void;
  close: () => void;
}

const filters = [
  { name: 'All', value: '' },
  { name: 'Stocks', value: 'stocks' },
  { name: 'Forex', value: 'forex' },
  { name: 'Indexes', value: 'indexes' },
  { name: 'Funds', value: 'funds' },
  { name: 'Features', value: 'features' },
];

const SymbolSelector = forwardRef<SymbolSelectorMethods, SymbolSelectorProps>(
  ({ onChange }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const textInputRef = useRef<TextInput>(null);
    const [data, setData] = React.useState<ChartSymbol[]>([]);
    const [selectedFilter, setSelectedFilter] = React.useState<string>(filters[0].value);
    const [inputValue, setInputValue] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [noDataFound, setNoDataFound] = React.useState<string | null>(null);

    const onClose = () => {
      setInputValue('');
      setData([]);
      setIsLoading(false);
      textInputRef.current?.clear();
    };

    const handleClose = () => {
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
      onClose();
    };

    const fetchSymbols = (input: string, filter: string) => {
      console.log(input, filter);
      setInputValue(input);
      setIsLoading(true);
      if (input.length === 0) {
        setData([]);
        setIsLoading(false);
        return;
      }

      fetchSymbolsAsync({
        symbol: input,
        maxResult: DEFAULT_VALUE_MAX_RESULT.toString(),
        fund: DEFAULT_VALUE_FUNDS,
        filter: filter.toUpperCase(),
      })
        .then((data) => {
          if (data.length === 0) {
            setNoDataFound('No data found');
          } else {
            setNoDataFound(null);
          }
          setData(data);
        })
        .finally(() => setIsLoading(false));
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();
        textInputRef.current?.focus();
      },
      close: handleClose,
    }));

    const handleSymbolChange = (symbol: ChartSymbol) => {
      onChange(symbol);
      handleClose();
    };

    const handleFilterChange = (filter: string) => {
      // if (filter !== selectedFilter) {
      setSelectedFilter(filter);
      fetchSymbols(inputValue, filter);
      // }
    };

    return (
      <BottomSheet ref={bottomSheetRef} onClose={onClose}>
        <View>
          <Input
            ref={textInputRef}
            handleClose={handleClose}
            onChange={(text) => fetchSymbols(text, selectedFilter)}
          />

          <FilterSelector
            filters={filters}
            handleFilterChange={handleFilterChange}
            selectedFilter={selectedFilter}
          />
        </View>
        <View style={styles.container}>
          {!isLoading ? (
            <FlatList
              data={data}
              style={styles.contentContainer}
              contentContainerStyle={styles.contentContainer}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity onPress={() => handleSymbolChange(item)} style={styles.card}>
                    <View style={[styles.row, styles.spaceBetween]}>
                      <Text style={styles.cardTitle}>{item.symbol}</Text>
                      <Text style={styles.cardSubtitle}>{item.funds[0]}</Text>
                    </View>
                    <Text style={styles.cardDescription} numberOfLines={1} ellipsizeMode="tail">
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.listEmptyContainer}>
                  <View style={styles.space64} />
                  <Icons.search width={120} height={120} fill={theme.colors.inputBackground} />
                  <View style={styles.space32} />
                  {noDataFound === null ? (
                    <Text style={styles.emptyListTextTitle}>Type to start searching</Text>
                  ) : (
                    <>
                      <Text style={styles.emptyListTextTitle}>Symbols not found</Text>
                      <View style={styles.space16} />
                      <Text style={styles.emptyListTextDescription}>
                        Try another symbol to type in or apply current request
                      </Text>
                      <View style={styles.space32} />
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() =>
                          handleSymbolChange({
                            description: inputValue,
                            symbol: inputValue,
                            funds: [''],
                          })
                        }
                      >
                        <Text style={styles.primaryButtonText}>Apply</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            />
          ) : (
            <View style={styles.listEmptyContainer}>
              <ActivityIndicator size="large" color={theme.colors.colorPrimary} />
            </View>
          )}
        </View>
      </BottomSheet>
    );
  },
);

SymbolSelector.displayName = 'SymbolSelector';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 16,
    },
    input: {
      flexDirection: 'row',
      backgroundColor: theme.colors.inputBackground,
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 10,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
    },
    row: {
      flexDirection: 'row',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },

    card: {
      padding: 16,
      height: 66,
    },
    cardTitle: {
      color: theme.colors.cardTitle,
      fontSize: 17,
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
    listEmptyContainer: {
      flex: 1,
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
  });

export default SymbolSelector;
