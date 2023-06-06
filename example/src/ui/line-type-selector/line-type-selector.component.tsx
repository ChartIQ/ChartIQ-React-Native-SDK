import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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

const LineTypeSelector = forwardRef<BottomSheetMethods, LineTypeSelectorProps>(
  ({ onChange, selectedItem }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    const handleClose = () => {
      bottomSheetRef.current?.dismiss();
    };

    useImperativeHandle(ref, () => bottomSheetRef.current ?? ({} as BottomSheetMethods));

    const handleChange = (input: LineTypeItem) => {
      onChange(input, bottomSheetRef?.current?.id ?? undefined);
      handleClose();
    };

    return (
      <BottomSheet ref={bottomSheetRef}>
        <SelectorHeader title="Select line type" />
        <FlatList
          data={lineTypePickerData}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={[styles.contentContainer]}
          style={styles.container}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChange(item)}
              style={[styles.item, selectedItem.name === item.name && styles.selected]}
            >
              <item.Icon
                width={56}
                height={56}
                fill={theme.colors.buttonText}
                stroke={theme.colors.buttonText}
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
      width: 78,
      height: 58,
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
