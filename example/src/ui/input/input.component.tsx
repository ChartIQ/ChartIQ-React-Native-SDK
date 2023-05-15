import { Theme, useTheme } from '~/theme';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';

import Icons from '~/assets/icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface InputFieldProps {
  onChange: (input: string) => void;
  handleClose?: () => void;
  bottomSheet?: boolean;
}

export interface InputFieldMethods {
  onClose: () => void;
  focus: () => void;
}

const InputField = forwardRef<InputFieldMethods, InputFieldProps>(
  ({ onChange, handleClose, bottomSheet = false }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [value, setValue] = useState('');
    const textInputRef = useRef<TextInput>(null);

    const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChange(event.nativeEvent.text);
      setValue(event.nativeEvent.text);
    };

    const onClose = () => {
      onChange('');
      setValue('');
    };

    useImperativeHandle(ref, () => ({
      onClose,
      focus: () => {
        textInputRef.current?.focus();
      },
    }));

    return (
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <Icons.search
            width={16}
            height={16}
            fill={theme.colors.placeholder}
            style={{ marginHorizontal: 4 }}
          />
          {bottomSheet ? (
            <BottomSheetTextInput
              //@ts-ignore
              ref={textInputRef}
              onChange={handleChange}
              style={styles.textInput}
              placeholderTextColor={theme.colors.placeholder}
              placeholder="Search"
              value={value}
            />
          ) : (
            <TextInput
              ref={textInputRef}
              onChange={handleChange}
              style={styles.textInput}
              placeholderTextColor={theme.colors.placeholder}
              placeholder="Search"
              value={value}
            />
          )}
          {value.length > 0 ? (
            <Pressable onPress={onClose} style={styles.close}>
              <Icons.close width={12} height={12} fill={theme.colors.background} />
            </Pressable>
          ) : null}
        </View>
        {handleClose ? (
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  },
);

InputField.displayName = 'InputField';

export default React.memo(InputField);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    inputContainer: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flexDirection: 'row',
      backgroundColor: theme.colors.inputBackground,
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 10,
      alignItems: 'center',
    },
    text: {
      color: theme.colors.colorPrimary,
      paddingHorizontal: 12,
    },

    textInput: {
      flex: 1,
      color: theme.colors.buttonText,
      fontSize: 16,
      padding: 0,
    },
    close: {
      backgroundColor: theme.colors.cardSubtitle,
      borderRadius: 32,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
      width: 16,
      height: 16,
    },
  });
