import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChartIQ } from 'react-native-chart-iq';
import { FlatList } from 'react-native-gesture-handler';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { Theme, useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';

import {
  ChartStyleItem,
  chartStyleSelectorData,
  ChartStyleSelectorProps,
} from './chart-style-selector.data';

const ChartStyleSelector = forwardRef<BottomSheetMethods, ChartStyleSelectorProps>(
  ({ onChange }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [selectedChartStyle, setSelectedChartStyle] = React.useState<ChartStyleItem | null>(null);
    const { translationMap, translations } = useTranslations();
    const [data, setData] = React.useState<ChartStyleItem[]>(chartStyleSelectorData);

    const handleClose = () => {
      bottomSheetRef.current?.dismiss();
      Keyboard.dismiss();
    };

    useEffect(() => {
      setData(
        chartStyleSelectorData.map((item) => ({
          ...item,
          label: translationMap[item.label] ?? item.label,
        })),
      );
    }, [translationMap]);

    const handleOpen = async () => {
      bottomSheetRef.current?.present('');
      const aggregationType = await ChartIQ.getChartAggregationType();
      const chartType = await ChartIQ.getChartType();

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
      ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
      present: handleOpen,
      dismiss: handleClose,
    }));

    const handleChange = (chartStyle: ChartStyleItem) => {
      onChange(chartStyle);
      handleClose();
    };

    const isItemSelected = (item: ChartStyleItem, selectedItem: ChartStyleItem | null) => {
      if (!selectedItem) return false;

      if (!selectedItem.aggregationType) {
        return selectedItem?.value === item.value;
      } else {
        return selectedItem?.aggregationType === item?.aggregationType;
      }
    };

    return (
      <BottomSheet ref={bottomSheetRef}>
        <SelectorHeader
          leftActionTitle={translations.cancel}
          handleLeftAction={handleClose}
          title={translations['Chart Style']}
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
                    style={styles.image}
                  />
                  <Text style={styles.description}>{item.label}</Text>
                </View>
                {isItemSelected({ ...item, icon: Icon }, selectedChartStyle) ? (
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
      backgroundColor: theme.colors.backgroundSecondary,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginLeft: 40,
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
      marginRight: 16,
    },
  });

ChartStyleSelector.displayName = 'ChartStyleSelector';

export default ChartStyleSelector;
