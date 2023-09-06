import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, SectionListRenderItem } from 'react-native';
import { TimeUnit } from 'react-native-chartiq';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { ListItem } from '../list-item';
import { SelectorHeader } from '../selector-header';

export type IntervalItem = {
  label: string;
  timeUnit: TimeUnit;
  period: number;
  interval: string;
  description: string;
};

interface IntervalsSectionListData {
  first: IntervalItem[];
  second: IntervalItem[];
  third: IntervalItem[];
}

export const intervals: IntervalsSectionListData = {
  first: [
    { label: '1D', timeUnit: TimeUnit.DAY, period: 1, interval: '1', description: '1 day' },
    { label: '1W', timeUnit: TimeUnit.WEEK, period: 1, interval: '1', description: '1 week' },
    { label: '1M', timeUnit: TimeUnit.MONTH, period: 1, interval: '1', description: '1 month' },
  ],
  second: [
    { label: '1m', timeUnit: TimeUnit.MINUTE, period: 1, interval: '1', description: '1 minute' },
    { label: '5m', timeUnit: TimeUnit.MINUTE, description: '5 minute', interval: '5', period: 1 },
    {
      label: '10m',
      timeUnit: TimeUnit.MINUTE,
      description: '10 minute',
      interval: '10',
      period: 1,
    },
    { label: '15m', timeUnit: TimeUnit.MINUTE, description: '15 minute', interval: '5', period: 3 },
    {
      label: '30m',
      timeUnit: TimeUnit.MINUTE,
      description: '30 minute',
      interval: '30',
      period: 1,
    },
    { label: '1h', timeUnit: TimeUnit.MINUTE, description: '1 hour', interval: '30', period: 2 },
    { label: '4h', timeUnit: TimeUnit.MINUTE, description: '4 hour', interval: '30', period: 8 },
  ],

  third: [
    {
      label: '30s',
      timeUnit: TimeUnit.SECOND,
      description: '30 second',
      interval: '30',
      period: 1,
    },
  ],
};

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

    const keyExtractor: (item: IntervalItem, index: number) => string = (item: IntervalItem) =>
      item.label;
    const renderItem: SectionListRenderItem<
      IntervalItem,
      {
        title: string;
        data: IntervalItem[];
      }
    > = ({ item, index, section }) => {
      return (
        <>
          <ListItem
            topBorder={index === 0}
            title={item.description}
            bottomBorderStyles={section.data.length - 1 !== index ? styles.bottomBorderStyles : {}}
            onPress={() => handleChange(item)}
            containerStyle={{ backgroundColor: theme.colors.backgroundSecondary }}
          >
            {selectedInterval?.label === item.label ? (
              <Icons.check fill={theme.colors.colorPrimary} />
            ) : null}
          </ListItem>
        </>
      );
    };

    const sections = [
      { title: 'first', data: intervals.first },
      { title: 'second', data: intervals.second },
      { title: 'third', data: intervals.third },
    ];

    return (
      <BottomSheet ref={bottomSheetRef}>
        <SelectorHeader
          title="Intervals"
          leftActionTitle={translations.cancel}
          handleLeftAction={handleClose}
        />
        <BottomSheetSectionList
          sections={sections}
          contentContainerStyle={styles.contentContainer}
          style={styles.contentContainer}
          SectionSeparatorComponent={() => <View style={styles.space24} />}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
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
    itemContainer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.backgroundSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    space24: {
      height: 24,
    },
    bottomBorderStyles: {
      marginLeft: 16,
    },
  });

IntervalSelector.displayName = 'IntervalSelector';

export default IntervalSelector;
