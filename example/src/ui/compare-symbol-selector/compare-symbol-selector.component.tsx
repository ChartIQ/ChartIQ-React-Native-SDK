import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FlatList, Keyboard, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChartSymbol } from 'react-native-chart-iq-wrapper';

import Icons from '~/assets/icons';
import { compareColors } from '~/constants';
import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { ColorSelector } from '../color-selector';
import { ColorSelectorMethods } from '../color-selector/color-selector.component';
import { SelectorHeader } from '../selector-header';
import SymbolSelector from '../symbol-selector/symbol-selector.component';

import { SwipableSymbol } from './components/swipable-symbol-item';

export type ColoredChartSymbol = ChartSymbol & { color: string };

export type ColoredSymbols = Map<string, ColoredChartSymbol>;
interface CompareSymbolSelectorProps {
  onAdd: (coloredSymbol: ColoredChartSymbol) => void;
  onDelete: (coloredSymbol: ColoredChartSymbol) => void;
  data: ColoredSymbols;
}

const CompareSymbolSelector = forwardRef<BottomSheetMethods, CompareSymbolSelectorProps>(
  ({ onAdd, onDelete, data }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { translations } = useTranslations();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const symbolSelectorRef = useRef<BottomSheetMethods>(null);
    const colorSelectorRef = useRef<ColorSelectorMethods>(null);

    const handleClose = () => {
      bottomSheetRef.current?.dismiss();
      Keyboard.dismiss();
    };

    useImperativeHandle(ref, () => ({
      ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
      close: handleClose,
    }));

    const handleSymbolAdd = (symbol: ChartSymbol) => {
      const usedColors = Array.from(data.values()).map((item) => item.color);
      const newColor = compareColors.find((item) => usedColors.indexOf(item) === -1);
      onAdd({
        ...symbol,
        color: newColor ?? compareColors[0],
      });
    };

    const handleSymbolDelete = (input: ColoredChartSymbol) => {
      onDelete(input);
    };

    const handleAddPress = () => {
      symbolSelectorRef.current?.present('');
    };

    const onColorChange = (color: string, id: string | null) => {
      if (id) {
        const map = new Map(data);
        const symbol = map.get(id);
        if (symbol !== undefined) {
          map.set(id, { ...symbol, color });
          onAdd(map.get(id) ?? symbol);
        }
      }
    };

    const handleChangeColor = (item: ColoredChartSymbol) => {
      colorSelectorRef.current?.present(item.symbol, item.color);
    };

    const isEmpty = data.size === 0;

    return (
      <>
        <BottomSheet ref={bottomSheetRef}>
          <SelectorHeader
            title="Compare Symbols"
            leftActionTitle={translations.cancel}
            handleLeftAction={handleClose}
            rightActionTitle={!isEmpty ? translations.Add : undefined}
            handleRightAction={!isEmpty ? handleAddPress : undefined}
          />
          <FlatList
            data={Array.from(data.values())}
            contentContainerStyle={styles.contentContainer}
            style={styles.contentContainer}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <SwipableSymbol
                item={item}
                handleChangeColor={handleChangeColor}
                handleDelete={handleSymbolDelete}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.listEmptyContainer}>
                <View style={styles.space64} />
                <Icons.search width={120} height={120} fill={theme.colors.inputBackground} />
                <View style={styles.space32} />
                <Text style={styles.emptyListTextTitle}>No Symbols to compare yet</Text>
                <View style={styles.space16} />
                <View style={styles.space32} />
                <TouchableOpacity style={styles.primaryButton} onPress={handleAddPress}>
                  <Text style={styles.primaryButtonText}>Add Symbol</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </BottomSheet>
        <SymbolSelector onChange={handleSymbolAdd} ref={symbolSelectorRef} />
        <ColorSelector onChange={onColorChange} ref={colorSelectorRef} />
      </>
    );
  },
);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contentContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      flex: 1,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: 12,
    },

    flex: {
      flex: 1,
    },
    aligned: {
      alignItems: 'center',
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

CompareSymbolSelector.displayName = 'CompareSymbolSelector';

export default CompareSymbolSelector;
