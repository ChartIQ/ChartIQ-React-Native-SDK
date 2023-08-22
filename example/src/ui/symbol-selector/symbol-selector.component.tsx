import React, { useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { ChartSymbol } from 'react-native-chart-iq';
import { FlatList } from 'react-native-gesture-handler';

import { fetchSymbolsAsync, handleRetry } from '~/api';
import { DEFAULT_VALUE_FUNDS, DEFAULT_VALUE_MAX_RESULT } from '~/constants';
import { useTheme, Theme } from '~/theme';

import Icons from '../../assets/icons';
import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { Input } from '../input';
import { InputFieldMethods } from '../input/input.component';
import { FilterSelector } from '../selector-filters';

interface SymbolSelectorProps {
  onChange?: (symbol: ChartSymbol) => void;
}

const allFilter = { name: 'All', value: '' };

const filters = [
  allFilter,
  { name: 'Stocks', value: 'stocks' },
  { name: 'Forex', value: 'forex' },
  { name: 'Indexes', value: 'indexes' },
  { name: 'Funds', value: 'funds' },
  { name: 'Futures', value: 'Futures' },
];

const SymbolSelector = forwardRef<BottomSheetMethods, SymbolSelectorProps>(({ onChange }, ref) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const textInputRef = useRef<InputFieldMethods>(null);
  const [data, setData] = React.useState<ChartSymbol[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(allFilter.value);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [noDataFound, setNoDataFound] = React.useState<string | null>(null);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    setInputValue('');
    setData([]);
    setIsLoading(false);
    textInputRef.current?.onClose();
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleClear = () => {
    setInputValue('');
    setData([]);
    setIsLoading(false);
  };

  const fetchSymbols = useCallback((input: string, filter: string) => {
    if (input.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
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
      .catch(() => {
        handleRetry(() => {
          fetchSymbols(input, filter);
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  useImperativeHandle(ref, () => bottomSheetRef.current ?? ({} as BottomSheetMethods));

  const handleSymbolChange = (symbol: ChartSymbol) => {
    onChange && onChange(symbol);
    handleClose();
  };

  const handleFilterChange = (filter: string) => {
    if (filter !== selectedFilter) {
      setSelectedFilter(filter);
      fetchSymbols(inputValue, filter);
    }
  };

  const handleTextChange = useCallback(
    (text: string) => {
      setInputValue(text);
      fetchSymbols(text, selectedFilter);
    },
    [fetchSymbols, selectedFilter],
  );

  return (
    <BottomSheet ref={bottomSheetRef} onClose={handleClose}>
      <View>
        <Input
          bottomSheet
          ref={textInputRef}
          handleClose={handleClose}
          onChange={handleTextChange}
          handleClear={handleClear}
        />
        <FilterSelector
          handleFilterChange={handleFilterChange}
          selectedFilter={selectedFilter}
          filters={filters}
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
});

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
