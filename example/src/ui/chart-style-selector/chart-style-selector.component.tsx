import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getChartAggregationType, getChartType } from 'react-native-chart-iq-wrapper';
import { FlatList } from 'react-native-gesture-handler';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

import { BottomSheet } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';

import {
  ChartStyleItem,
  chartStyleSelectorData,
  ChartStyleSelectorMethods,
  ChartStyleSelectorProps,
} from './chart-style-selector.data';

const ChartStyleSelector = forwardRef<ChartStyleSelectorMethods, ChartStyleSelectorProps>(
  ({ onChange }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [selectedChartStyle, setSelectedChartStyle] = React.useState<ChartStyleItem | null>(null);
    const translations = useTranslations();
    const [data, setData] = React.useState<ChartStyleItem[]>(chartStyleSelectorData);

    const handleClose = () => {
      bottomSheetRef.current?.close();
      Keyboard.dismiss();
    };

    useEffect(() => {
      setData(
        chartStyleSelectorData.map((item) => ({
          ...item,
          label: translations[item.label] ?? item.label,
        })),
      );
    }, [translations]);

    const handleOpen = async () => {
      bottomSheetRef.current?.expand();
      const aggregationType = await getChartAggregationType();
      const chartType = await getChartType();

      if (aggregationType) {
        setSelectedChartStyle((prevState) => {
          return (
            chartStyleSelectorData.find(
              (chartType) => chartType?.aggregationType === aggregationType,
            ) ?? prevState
          );
        });

        return;
      }

      setSelectedChartStyle((prevState) => {
        return (
          chartStyleSelectorData.find(
            (type) => type?.value.toLocaleLowerCase() === chartType.toLocaleLowerCase(),
          ) ?? prevState
        );
      });
    };

    useImperativeHandle(ref, () => ({
      open: handleOpen,
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
          data={data}
          contentContainerStyle={styles.contentContainer}
          style={styles.contentContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: { icon: Icon, ...item } }) => {
            return (
              <TouchableOpacity
                onPress={() => handleChange({ ...item, icon: Icon })}
                style={styles.itemContainer}
              >
                <View style={styles.typeItem}>
                  <Icon
                    width={24}
                    height={24}
                    color={theme.colors.cardTitle}
                    fill={theme.colors.buttonText}
                  />
                  <Text style={styles.description}>{item.label}</Text>
                </View>
                {selectedChartStyle?.value === item.value ? (
                  <Icons.check width={16} height={16} fill={theme.colors.colorPrimary} />
                ) : null}
              </TouchableOpacity>
            );
          }}
          extraData={selectedChartStyle}
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
      justifyContent: 'space-between',
    },
    typeItem: {
      flexDirection: 'row',
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
