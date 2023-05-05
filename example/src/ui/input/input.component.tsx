import { Theme, useTheme } from '~/theme';
// import { EvilIcons } from '@expo/vector-icons';
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
  handleClose: () => void;
}

const InputField = forwardRef<TextInput, InputFieldProps>(({ onChange, handleClose }, ref) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const inputRef = useRef<TextInput>(null);

  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    onChange(event.nativeEvent.text);
  };

  const onClose = () => {
    inputRef.current?.clear();
    onChange('');
  };

  useImperativeHandle(ref, () => inputRef.current);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.input}>
        {/* <EvilIcons name="search" size={24} color={theme.colors.placeholder} /> */}
        <BottomSheetTextInput
          ref={inputRef}
          onChange={handleChange}
          style={styles.textInput}
          placeholderTextColor={theme.colors.placeholder}
          placeholder="Search"
        />

        <Pressable onPress={onClose} style={styles.close}>
          <Icons.close width={12} height={12} fill={theme.colors.background} />
        </Pressable>
      </View>
      <TouchableOpacity onPress={handleClose}>
        <Text style={styles.text}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
});

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
    },
    close: {
      backgroundColor: theme.colors.cardSubtitle,
      borderRadius: 32,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
      width: 16,
      height: 16,
    },
  });
