import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Theme, useTheme } from '~/theme';
import React, { PropsWithChildren, useRef, forwardRef, useImperativeHandle } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BottomSheetSelectorProps extends PropsWithChildren {
  snapPoints?: string[];
  onClose?: () => void;
}

const DEFAULT_SNAP_POINTS = ['100%'];

const BottomSheetSelector = forwardRef<BottomSheetMethods, BottomSheetSelectorProps>(
  ({ children, snapPoints = DEFAULT_SNAP_POINTS, onClose }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useTheme();
    const styles = createStyles(theme);

    useImperativeHandle(ref, () => bottomSheetRef.current);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        enableOverDrag
        onChange={(index) => {
          if (index === -1) {
            Keyboard.dismiss();
          }
        }}
        onClose={onClose}
        handleComponent={() => null}
        style={styles.bottomSheet}
      >
        <SafeAreaView style={styles.container}>{children}</SafeAreaView>
      </BottomSheet>
    );
  },
);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    bottomSheet: {
      backgroundColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.39,
      shadowRadius: 8.3,

      elevation: 13,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderTopColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
  });

BottomSheetSelector.displayName = 'BottomSheetSelector';

export default BottomSheetSelector;
