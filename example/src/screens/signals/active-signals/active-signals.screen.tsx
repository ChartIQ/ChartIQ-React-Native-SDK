import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { getActiveSignals, removeSignal, toggleSignal } from 'react-native-chart-iq-wrapper';

import images from '~/assets/images';
import { Signal } from '~/model/signals';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SwipableItem } from '~/ui/swipable-item';

interface SignalsProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.Signals> {}

const Signals: React.FC<SignalsProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeSignals, setActiveSignal] = useState<Signal[]>([]);

  const handleAddSignal = useCallback(() => {
    navigation.navigate(SignalsStack.AddSignal, {});
  }, [navigation]);

  const get = useCallback(async () => {
    const response = await getActiveSignals();

    setActiveSignal(response);
  }, []);

  useFocusEffect(
    useCallback(() => {
      get();
    }, [get]),
  );

  useEffect(() => {
    if (activeSignals.length !== 0) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={handleAddSignal}>
            <Text style={styles.headerButton}>Add</Text>
          </Pressable>
        ),
      });
    }
  }, [activeSignals.length, handleAddSignal, navigation, styles.headerButton]);

  const handleToggleSignal = (value: boolean, signal: Signal) => {
    toggleSignal(signal);
    get();
  };

  const handleEditSignal = (signal: Signal) => {
    navigation.navigate(SignalsStack.AddSignal, { signalForEdit: { signal } });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={activeSignals}
        contentContainerStyle={{ flex: 1 }}
        renderItem={({ item }) => (
          <SwipableItem
            rightActionButtons={[
              {
                key: 'delete-signal-item',
                onPress: () => {
                  removeSignal(item);
                  get();
                },
                title: 'Delete',
                backgroundColor: theme.colors.error,
                color: theme.colors.primaryButtonText,
              },
            ]}
          >
            <ListItem onPress={() => handleEditSignal(item)} title={item.name}>
              <Switch
                value={!item.disabled}
                onValueChange={(value) => handleToggleSignal(value, item)}
              />
            </ListItem>
          </SwipableItem>
        )}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Image
              style={styles.image}
              source={
                theme.isDark ? images.activeStudiesEmpty.dark : images.activeStudiesEmpty.light
              }
            />
            <Text style={styles.description}>No Signals to display yet</Text>
            <Pressable onPress={handleAddSignal} style={styles.button}>
              <Text style={styles.buttonText}>Add Signal</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'space-between',
    },
    image: {
      marginBottom: 32,
    },
    emptyView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    description: {
      fontSize: 20,
      color: theme.colors.cardSubtitle,
      marginBottom: 40,
    },
    button: {
      backgroundColor: theme.colors.colorPrimary,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      width: '80%',
    },
    buttonText: {
      fontSize: 16,
      color: theme.colors.primaryButtonText,
    },
    headerButton: {
      color: theme.colors.colorPrimary,
    },
    studyName: {
      fontSize: 16,
    },
    studyValue: {
      fontSize: 14,
      color: theme.colors.cardSubtitle,
    },
  });

export default Signals;