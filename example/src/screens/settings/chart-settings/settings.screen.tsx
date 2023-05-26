import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  getChartScale,
  getExtendedHours,
  getIsInvertYAxis,
  setChartScale,
  setIsInvertYAxis,
  setExtendedHours as setChartExtendedHours,
  setLanguage,
} from 'react-native-chart-iq-wrapper';

import Icons from '~/assets/icons';
import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { ChartIQLanguages } from '~/constants/languages';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

const Settings: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const selectFromListRef = React.useRef<SelectOptionFromListMethods>(null);
  const [logScale, setLogScale] = useState(false);
  const [invertYAxis, setInvertYAxis] = useState(false);
  const [extendedHours, setExtendedHours] = useState(false);
  const [languageName, setLanguageName] = useState(ChartIQLanguages.EN.title);

  const getValues = useCallback(async () => {
    const logScale = await getChartScale();
    const invertYAxis = await getIsInvertYAxis();
    const extendedHours = await getExtendedHours();
    let userLanguageCode =
      (await AsyncStorage.getItem(asyncStorageKeys.languageCode)) ?? ChartIQLanguages.EN.code;

    setLanguageName(
      Object.values(ChartIQLanguages).find((item) => item.code === userLanguageCode)?.title ??
        ChartIQLanguages.EN.title,
    );

    setLogScale(JSON.parse(logScale).toLowerCase() === 'log');
    setInvertYAxis(invertYAxis);
    setExtendedHours(extendedHours);
  }, [setLogScale, setInvertYAxis, setExtendedHours]);

  useEffect(() => {
    getValues();
  }, [getValues]);

  const onLanguage = () => {
    const data = Object.values(ChartIQLanguages).map((item) => ({
      key: item.code,
      value: item.title,
    }));
    selectFromListRef.current?.open(
      data,
      data.find((item) => item.value === languageName)?.key || '',
      'language',
    );
  };

  const handleLanguageChange = ({ key, value }: { key: string; value: string }) => {
    setLanguageName(value);
    setLanguage(key);
    AsyncStorage.setItem(asyncStorageKeys.languageCode, key);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>Chart Preferences</Text>
        <ListItem title="Log Scale">
          <Switch
            value={logScale}
            onChange={({ nativeEvent: { value } }) => {
              setChartScale(value ? 'log' : 'linear');
              setLogScale(value);
            }}
          />
        </ListItem>
        <ListItem title="Invert Y-Axis">
          <Switch
            value={invertYAxis}
            onChange={({ nativeEvent: { value } }) => {
              setIsInvertYAxis(value);
              setInvertYAxis(value);
            }}
          />
        </ListItem>
        <ListItem title="Extended Hours">
          <Switch
            value={extendedHours}
            onChange={({ nativeEvent: { value } }) => {
              setChartExtendedHours(value);
              setExtendedHours(value);
            }}
          />
        </ListItem>
        <Text style={styles.sectionTitle}>Language Preferences</Text>
        <ListItem title="Language" onPress={onLanguage} value={languageName} />
      </ScrollView>
      <SelectFromList ref={selectFromListRef} onChange={handleLanguageChange} />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      textTransform: 'uppercase',
      fontSize: 12,
      color: theme.colors.buttonText,
      paddingTop: 24,
      paddingLeft: 16,
      paddingBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default Settings;
