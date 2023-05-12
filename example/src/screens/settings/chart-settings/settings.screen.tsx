import React, { useCallback, useEffect, useState } from 'react';

import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  getChartScale,
  getExtendedHours,
  getIsInvertYAxis,
  setChartScale,
  setIsInvertYAxis,
  setExtendedHours as setChartExtendedHours,
} from 'react-native-chart-iq-wrapper';

import Icons from '~/assets/icons';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const Settings: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [logScale, setLogScale] = useState(false);
  const [invertYAxis, setInvertYAxis] = useState(false);
  const [extendedHours, setExtendedHours] = useState(false);

  const getValues = useCallback(async () => {
    const logScale = await getChartScale();
    const invertYAxis = await getIsInvertYAxis();
    const extendedHours = await getExtendedHours();

    setLogScale(JSON.parse(logScale).toLowerCase() === 'log');
    setInvertYAxis(invertYAxis);
    setExtendedHours(extendedHours);
  }, [setLogScale, setInvertYAxis, setExtendedHours]);

  useEffect(() => {
    getValues();
  }, [getValues]);

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
        <ListItem title="Language">
          <View style={styles.row}>
            <Text style={{ color: theme.colors.buttonText }}>English</Text>
            <Icons.chevronRight fill={theme.colors.buttonText} width={24} height={24} />
          </View>
        </ListItem>
      </ScrollView>
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
