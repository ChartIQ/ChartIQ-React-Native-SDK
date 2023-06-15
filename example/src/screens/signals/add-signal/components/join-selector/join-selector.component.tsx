import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SignalJoiner } from '~/model/signals/signal';
import { Theme, useTheme } from '~/theme';

interface JoinSelectorProps {
  onPress?: (value: SignalJoiner) => void;
  value?: string;
}

const JoinSelector: React.FC<JoinSelectorProps> = ({ onPress, value }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [selected, setSelected] = useState<SignalJoiner>(SignalJoiner.OR);

  const handlePress = (value: SignalJoiner) => {
    setSelected(value);
    onPress && onPress(value);
  };

  if (onPress) {
    return (
      <View style={styles.container}>
        <Text
          onPress={() => handlePress(SignalJoiner.OR)}
          style={[
            styles.textBorder,
            selected === SignalJoiner.OR ? styles.selectedText : styles.text,
          ]}
        >
          Or
        </Text>
        <Text
          onPress={() => handlePress(SignalJoiner.AND)}
          style={[
            styles.textBorder,
            selected === SignalJoiner.AND ? styles.selectedText : styles.text,
          ]}
        >
          And
        </Text>
      </View>
    );
  } else if (value) {
    return (
      <View style={styles.container}>
        <Text>{value}</Text>
      </View>
    );
  }

  return null;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 40,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    textBorder: {
      borderWidth: 1,
      paddingVertical: 4,
      paddingHorizontal: 16,
      color: theme.colors.buttonText,
    },
    selectedText: {
      borderColor: theme.colors.colorPrimary,
    },
    text: {
      borderColor: theme.colors.cardSubtitle,
    },
  });

export default JoinSelector;
