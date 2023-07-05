import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TimeUnit } from 'react-native-chart-iq-wrapper';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';

export type IntervalItem = {
  label: string;
  timeUnit: TimeUnit;
  period: number;
  interval: string;
  description: string;
};

export const intervals: Array<IntervalItem> = [
  { label: '1D', timeUnit: TimeUnit.DAY, period: 1, interval: '1', description: '1 day' },
  { label: '1W', timeUnit: TimeUnit.WEEK, period: 1, interval: '1', description: '1 week' },
  { label: '1M', timeUnit: TimeUnit.MONTH, period: 1, interval: '1', description: '1 month' },

  { label: '1m', timeUnit: TimeUnit.MINUTE, period: 1, interval: '1', description: '1 minute' },
  { label: '5m', timeUnit: TimeUnit.MINUTE, description: '5 minute', interval: '1', period: 5 },
  { label: '10m', timeUnit: TimeUnit.MINUTE, description: '10 minute', interval: '1', period: 10 },
  { label: '15m', timeUnit: TimeUnit.MINUTE, description: '15 minute', interval: '1', period: 15 },
  { label: '30m', timeUnit: TimeUnit.MINUTE, description: '30 minute', interval: '1', period: 30 },
  { label: '1h', timeUnit: TimeUnit.MINUTE, description: '1 hour', interval: '60', period: 1 },
  { label: '4h', timeUnit: TimeUnit.MINUTE, description: '4 hour', interval: '60', period: 4 },

  { label: '30s', timeUnit: TimeUnit.SECOND, description: '30 second', interval: '1', period: 30 },
];

interface IntervalSelectorProps {
  onChange: (interval: IntervalItem) => void;
  selectedInterval: IntervalItem | null;
}

const IntervalSelector = forwardRef<BottomSheetMethods, IntervalSelectorProps>(
  ({ onChange, selectedInterval }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const { translations } = useTranslations();

    const handleClose = () => {
      bottomSheetRef.current?.dismiss();
    };

    useImperativeHandle(ref, () => bottomSheetRef.current ?? ({} as BottomSheetMethods));

    const handleChange = (interval: IntervalItem) => {
      onChange(interval);
      handleClose();
    };

    return (
      <BottomSheet ref={bottomSheetRef}>
        <SelectorHeader
          title="Intervals"
          leftActionTitle={translations.cancel}
          handleLeftAction={handleClose}
        />
        <BottomSheetFlatList
          data={intervals}
          contentContainerStyle={styles.contentContainer}
          style={styles.contentContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.label}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity onPress={() => handleChange(item)} style={styles.itemContainer}>
                  <Text style={styles.description}>{item.description}</Text>
                  {selectedInterval?.label === item.label ? (
                    <Icons.check fill={theme.colors.colorPrimary} />
                  ) : null}
                </TouchableOpacity>
                {index === 2 || index === 9 || index === 10 ? (
                  <View style={styles.space50} />
                ) : null}
              </>
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    space50: {
      height: 50,
    },
  });

IntervalSelector.displayName = 'IntervalSelector';

export default IntervalSelector;
