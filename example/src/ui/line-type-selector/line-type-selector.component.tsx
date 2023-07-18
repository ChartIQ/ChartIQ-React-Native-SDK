import {
  Orientation,
  OrientationChangeEvent,
  addOrientationChangeListener,
  getOrientationAsync,
} from 'expo-screen-orientation';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { LineTypeItem, lineTypePickerData } from '~/assets/icons/line-types/line-types';
import { Theme, useTheme } from '~/theme';

import { BottomSheet } from '../bottom-sheet';
import { BottomSheetMethods } from '../bottom-sheet/bottom-sheet.component';
import { SelectorHeader } from '../selector-header';

interface LineTypeSelectorProps {
  onChange: (input: LineTypeItem, id?: string) => void;
  selectedItem: LineTypeItem;
}

const HORIZONTAL_LIST_NUM_COLUMNS = 7;
const VERTICAL_LIST_NUM_COLUMNS = 4;
const BOX_WIDTH = 48;

const LineTypeSelector = forwardRef<BottomSheetMethods, LineTypeSelectorProps>(
  ({ onChange, selectedItem }, ref) => {
    const [width, setWidth] = React.useState(0);
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
    const [numberOfColumns, setNumberOfColumns] = React.useState<number>(VERTICAL_LIST_NUM_COLUMNS);
    const lineBoxWidth = (width - BOX_WIDTH) / numberOfColumns - 12;

    React.useEffect(() => {
      const callback = (orientation: Orientation) => {
        setIsLandscape(
          orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT,
        );
      };
      getOrientationAsync().then(callback);

      const subscription = addOrientationChangeListener(
        ({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
          callback(orientation);
        },
      );

      return () => {
        subscription.remove();
      };
    }, [setIsLandscape]);

    const handleClose = () => {
      bottomSheetRef.current?.dismiss();
    };

    useImperativeHandle(ref, () => bottomSheetRef.current ?? ({} as BottomSheetMethods));

    const handleChange = (input: LineTypeItem) => {
      onChange(input, bottomSheetRef?.current?.id ?? undefined);
      handleClose();
    };

    useEffect(() => {
      if (isLandscape) {
        setNumberOfColumns(HORIZONTAL_LIST_NUM_COLUMNS);
      } else {
        setNumberOfColumns(VERTICAL_LIST_NUM_COLUMNS);
      }
    }, [isLandscape]);

    return (
      <BottomSheet
        onLayout={({
          nativeEvent: {
            layout: { width: containerWidth },
          },
        }) => {
          setWidth(containerWidth);
        }}
        ref={bottomSheetRef}
      >
        <SelectorHeader
          leftActionTitle="Cancel"
          handleLeftAction={handleClose}
          title="Select line type"
        />
        <FlatList
          data={lineTypePickerData}
          numColumns={numberOfColumns}
          key={numberOfColumns === HORIZONTAL_LIST_NUM_COLUMNS ? 'horizontal' : 'vertical'}
          scrollEnabled={false}
          contentContainerStyle={[styles.contentContainer]}
          style={styles.container}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChange(item)}
              style={[
                styles.item,
                selectedItem.name === item.name && styles.selected,
                { width: lineBoxWidth, height: lineBoxWidth - 6 },
              ]}
            >
              <item.Icon
                width={56}
                height={56}
                fill={theme.colors.buttonText}
                stroke={theme.colors.buttonText}
                strokeWidth={item.lineWidth}
              />
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    );
  },
);

LineTypeSelector.displayName = 'LineTypeSelector';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
      flex: 1,
    },
    contentContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 32,
    },
    item: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 6,
    },
    selected: {
      borderWidth: 2,
      borderColor: theme.colors.colorPrimary,
    },
  });

export default LineTypeSelector;
