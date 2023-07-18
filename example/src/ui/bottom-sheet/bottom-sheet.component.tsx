import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { PropsWithChildren, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, LayoutChangeEvent, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Theme, useTheme } from '~/theme';

interface BottomSheetSelectorProps extends PropsWithChildren {
  snapPoints?: string[];
  onClose?: () => void;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}

export interface BottomSheetMethods extends BottomSheetModalMethods {
  present: (id: string) => void;
  id: string | null;
}

const DEFAULT_SNAP_POINTS = ['100%'];

const BottomSheetSelector = forwardRef<BottomSheetMethods, BottomSheetSelectorProps>(
  ({ children, snapPoints = DEFAULT_SNAP_POINTS, onClose, onLayout }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const idRef = useRef<string | null>(null);

    const theme = useTheme();
    const styles = createStyles(theme);

    useImperativeHandle(ref, () => ({
      ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
      present: (id: string) => {
        idRef.current = id;
        bottomSheetRef.current?.present();
      },
      get id() {
        return idRef.current;
      },
      dismiss: () => {
        idRef.current = null;
        bottomSheetRef.current?.dismiss();
      },
    }));

    const onDismiss = (index: number) => {
      if (index === -1) {
        idRef.current = null;
        bottomSheetRef.current?.dismiss();
      }
    };

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        enableOverDrag={true}
        onChange={onDismiss}
        onDismiss={onClose}
        handleComponent={() => null}
        style={styles.bottomSheet}
        animateOnMount
      >
        <SafeAreaView style={styles.container}>
          <View onLayout={onLayout} style={styles.container}>
            {children}
          </View>
        </SafeAreaView>
      </BottomSheetModal>
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
