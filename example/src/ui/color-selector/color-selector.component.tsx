import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '../bottom-sheet';
import { SelectorHeader } from '../selector-header';
import { Theme, useTheme } from '~/theme';
import { colorPickerColors } from '~/constants';

interface ColorSelectorProps {
  onChange: (input: string, id?: string) => void;
  selectedColor?: string;
}

export interface ColorSelectorMethods {
  open: (id?: string) => void;
  close: () => void;
}

const ColorSelector = forwardRef<ColorSelectorMethods, ColorSelectorProps>(
  ({ onChange, selectedColor }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const idRef = useRef<string | null>(null);

    const handleClose = () => {
      bottomSheetRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
      open: (id?: string) => {
        bottomSheetRef.current?.expand();
        if (id) {
          idRef.current = id;
        }
      },
      close: handleClose,
    }));

    const handleChange = (input: string) => {
      onChange(input, idRef.current ?? undefined);
      handleClose();
      idRef.current = null;
    };

    return (
      <>
        <BottomSheet ref={bottomSheetRef}>
          <SelectorHeader title="Select color" />
          <FlatList
            data={colorPickerColors}
            numColumns={5}
            scrollEnabled={false}
            contentContainerStyle={[
              styles.contentContainer,
              { alignItems: 'center', justifyContent: 'center' },
            ]}
            style={styles.contentContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleChange(item)}
                style={[styles.item, { backgroundColor: item }]}
              >
                {selectedColor === item ? <View style={styles.selected} /> : null}
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      </>
    );
  },
);

ColorSelector.displayName = 'ColorSelector';

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
    item: {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 6,
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
    selectedColor: {
      width: 22,
      height: 22,
    },
    selected: {
      backgroundColor: theme.colors.background,
      width: 30,
      height: 30,
      borderRadius: 15,
    },
  });

export default ColorSelector;
