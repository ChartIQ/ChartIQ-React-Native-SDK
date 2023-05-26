import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';
import { TimeUnit } from '~/constants';
import { Theme, useTheme } from '~/theme';

export type IntervalItem = {
  label: string;
  timeUnit: TimeUnit;
  period: number;
  interval: string;
  description: string;
};

export const intervals: Array<IntervalItem> = [
  { label: '1D', timeUnit: TimeUnit.DAY, period: 1, interval: '0', description: '1 day' },
  { label: '1W', timeUnit: TimeUnit.WEEK, period: 1, interval: '0', description: '1 week' },
  { label: '1M', timeUnit: TimeUnit.MONTH, period: 1, interval: '0', description: '1 month' },

  { label: '1m', timeUnit: TimeUnit.MINUTE, period: 1, interval: '0', description: '1 minute' },
  { label: '5m', timeUnit: TimeUnit.MINUTE, description: '5 minute', interval: '0', period: 5 },
  { label: '10m', timeUnit: TimeUnit.MINUTE, description: '10 minute', interval: '0', period: 10 },
  { label: '15m', timeUnit: TimeUnit.MINUTE, description: '15 minute', interval: '0', period: 15 },
  { label: '30m', timeUnit: TimeUnit.MINUTE, description: '30 minute', interval: '0', period: 30 },
  { label: '1h', timeUnit: TimeUnit.HOUR, description: '1 hour', interval: '0', period: 1 },
  { label: '4h', timeUnit: TimeUnit.HOUR, description: '4 hour', interval: '0', period: 4 },

  { label: '30s', timeUnit: TimeUnit.SECOND, description: '30 second', interval: '0', period: 30 },
];

interface IntervalSelectorProps {
  onChange: (interval: IntervalItem) => void;
}

export interface IntervalSelectorMethods {
  open: () => void;
  close: () => void;
}

const IntervalSelector = forwardRef<IntervalSelectorMethods, IntervalSelectorProps>(
  ({ onChange }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    const handleClose = () => {
      bottomSheetRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();
      },
      close: handleClose,
    }));

    const handleChange = (interval: IntervalItem) => {
      onChange(interval);
      handleClose();
    };

    return (
      <BottomSheet ref={bottomSheetRef}>
        <SelectorHeader title="Intervals" leftActionTitle="Cancel" handleLeftAction={handleClose} />
        <FlatList
          data={intervals}
          contentContainerStyle={styles.contentContainer}
          style={styles.contentContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => handleChange(item)} style={styles.itemContainer}>
                <Text style={styles.description}>{item.description}</Text>
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
      paddingTop: 18,
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
    },
    description: {
      color: theme.colors.buttonText,
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
    },
  });

IntervalSelector.displayName = 'IntervalSelector';

export default IntervalSelector;