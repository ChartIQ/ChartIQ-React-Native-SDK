import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { RootStack } from '~/shared/navigation.types';
import { useTheme } from '~/theme';

const TestRig: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const handleOpenChart = () => {
    navigation.navigate(RootStack.Main as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Test Rig</Text>
        <Text style={styles.description}>
          You can open the chart from here. The chart has a back button to return to this screen.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleOpenChart}>
          <Text style={styles.buttonText}>Open Chart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.buttonText,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: theme.colors.buttonText,
      textAlign: 'center',
      marginBottom: 32,
    },
    button: {
      backgroundColor: theme.colors.colorPrimary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default TestRig;
