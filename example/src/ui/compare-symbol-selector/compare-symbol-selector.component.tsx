import { Theme, useTheme } from '~/theme';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';

import { BottomSheet } from '../bottom-sheet';
import { ColorSelector } from '../color-selector';
import { ColorSelectorMethods } from '../color-selector/color-selector.component';
import SymbolSelector, {
  SymbolSelectorMethods,
} from '../symbol-selector/symbol-selector.component';

import { SwipableSymbol } from './components/swipable-symbol-item';
import { ChartSymbol } from '~/api';
import { SelectorHeader } from '../selector-header';

export type ColoredChartSymbol = ChartSymbol & { color: string };

export type ColoredSymbols = Map<string, ColoredChartSymbol>;
interface CompareSymbolSelectorProps {
  onAdd: (coloredSymbol: ColoredChartSymbol) => void;
  onDelete: (coloredSymbol: ColoredChartSymbol) => void;
  data: ColoredSymbols;
}

export interface CompareSymbolSelectorMethods {
  open: () => void;
  close: () => void;
}

const CompareSymbolSelector = forwardRef<CompareSymbolSelectorMethods, CompareSymbolSelectorProps>(
  ({ onAdd, onDelete, data }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const symbolSelectorRef = useRef<SymbolSelectorMethods>(null);
    const colorSelectorRef = useRef<ColorSelectorMethods>(null);
    const handleClose = () => {
      bottomSheetRef.current?.close();
      Keyboard.dismiss();
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();
      },
      close: handleClose,
    }));

    const handleSymbolAdd = (input: ColoredChartSymbol) => {
      colorSelectorRef.current?.open(input.symbol);
      onAdd(input);
    };

    const handleSymbolDelete = (input: ColoredChartSymbol) => {
      onDelete(input);
    };

    const handleAddPress = () => {
      symbolSelectorRef.current?.open();
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

    const handleChangeColor = (id: string) => {
      colorSelectorRef.current?.open(id);
    };

    return (
      <>
        <BottomSheet ref={bottomSheetRef}>
          <SelectorHeader
            title="Compare Symbols"
            leftActionTitle="Cancel"
            handleLeftAction={handleClose}
            rightActionTitle="Add"
            handleRightAction={handleAddPress}
          />
          <FlatList
            data={Array.from(data.values())}
            contentContainerStyle={styles.contentContainer}
            style={styles.contentContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <SwipableSymbol
                item={item}
                handleChangeColor={handleChangeColor}
                handleDelete={handleSymbolDelete}
              />
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
  });

CompareSymbolSelector.displayName = 'CompareSymbolSelector';

export default CompareSymbolSelector;
