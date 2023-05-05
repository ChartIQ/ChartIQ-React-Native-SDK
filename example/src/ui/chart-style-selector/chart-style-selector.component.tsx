import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';

import {
  ChartStyleItem,
  chartStyleSelectorData,
  ChartStyleSelectorMethods,
  ChartStyleSelectorProps,
} from './chart-style-selector.data';
import { Theme, useTheme } from '~/theme';

const ChartStyleSelector = forwardRef<ChartStyleSelectorMethods, ChartStyleSelectorProps>(
  ({ onChange }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

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

    const handleChange = (chartStyle: ChartStyleItem) => {
      onChange(chartStyle);
      handleClose();
    };

    return (
      <BottomSheet ref={bottomSheetRef}>
        <SelectorHeader
          leftActionTitle="Cancel"
          handleLeftAction={handleClose}
          title="Chart style"
        />
        <FlatList
          data={chartStyleSelectorData}
          contentContainerStyle={styles.contentContainer}
          style={styles.contentContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: { icon: Icon, ...item } }) => {
            return (
              <TouchableOpacity
                onPress={() => handleChange({ ...item, icon: Icon })}
                style={styles.itemContainer}
              >
                <Icon
                  width={24}
                  height={24}
                  color={theme.colors.cardTitle}
                  fill={theme.colors.buttonText}
                />
                <Text style={styles.description}>{item.label}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
    );
  },
);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contentContainer: {
      backgroundColor: theme.colors.background,
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
    itemContainer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.backgroundSecondary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    flex: {
      flex: 1,
    },
    aligned: {
      alignItems: 'center',
    },
    title: {
      fontSize: 17,
      color: theme.colors.buttonText,
    },
    description: {
      color: theme.colors.buttonText,
    },
    image: {
      width: 24,
      height: 24,
      marginRight: 16,
    },
  });

ChartStyleSelector.displayName = 'ChartStyleSelector';

export default ChartStyleSelector;
