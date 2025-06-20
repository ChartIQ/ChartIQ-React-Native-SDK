import {
  Orientation,
  OrientationChangeEvent,
  addOrientationChangeListener,
  getOrientationAsync,
} from 'expo-screen-orientation';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Icons from '~/assets/icons';
import { colorPickerColors } from '~/constants';
import { Theme, useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';

interface ColorSelectorProps {
  onChange: (input: string, id: string) => void;
}

const HORIZONTAL_LIST_NUM_COLUMNS = 10;
const VERTICAL_LIST_NUM_COLUMNS = 5;

export interface ColorSelectorMethods extends BottomSheetMethods {
  present: (id: string, color?: string) => void;
}

const ColorSelector = forwardRef<ColorSelectorMethods, ColorSelectorProps>(({ onChange }, ref) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [width, setWidth] = React.useState(0);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const [numberOfColumns, setNumberOfColumns] = React.useState<number>(VERTICAL_LIST_NUM_COLUMNS);
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const colorBoxWidth = (width - 24) / numberOfColumns - 12;

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

  const handleDismiss = () => {
    bottomSheetRef.current?.dismiss();
    setSelectedColor('');
  };

  useImperativeHandle(ref, () => ({
    ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
    dismiss: handleDismiss,
    present: (id: string, color?: string) => {
      bottomSheetRef.current?.present(id);
      setSelectedColor(color ?? '');
    },
  }));

  const handleChange = (input: string) => {
    onChange(input, bottomSheetRef.current?.id ?? '');
    handleDismiss();
  };

  useEffect(() => {
    if (isLandscape) {
      setNumberOfColumns(HORIZONTAL_LIST_NUM_COLUMNS);
    } else {
      setNumberOfColumns(VERTICAL_LIST_NUM_COLUMNS);
    }
  }, [isLandscape]);

  return (
    <>
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
          title="Select color"
          leftActionTitle="Cancel"
          handleLeftAction={handleDismiss}
        />
        <BottomSheetFlatList
          data={colorPickerColors}
          numColumns={numberOfColumns}
          key={numberOfColumns === HORIZONTAL_LIST_NUM_COLUMNS ? 'horizontal' : 'vertical'}
          scrollEnabled={false}
          contentContainerStyle={[
            styles.contentContainer,
            { alignItems: 'center', justifyContent: 'center' },
          ]}
          style={styles.contentContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChange(item)}
              style={[
                styles.item,
                { backgroundColor: item },
                selectedColor === item ? styles.selectedBorder : null,
                { width: colorBoxWidth, height: colorBoxWidth },
              ]}
            >
              {selectedColor === item ? (
                <View style={styles.selected}>
                  <Icons.check fill={theme.colors.white} />
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </>
  );
});

ColorSelector.displayName = 'ColorSelector';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contentContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
    },
    item: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
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

    selected: {
      backgroundColor: theme.colors.selectedColorBackground,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedBorder: {
      borderColor: theme.colors.colorPrimary,
      borderWidth: 2,
      borderRadius: 8,
    },
  });

export default ColorSelector;
