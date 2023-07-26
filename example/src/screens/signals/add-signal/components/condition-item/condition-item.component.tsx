import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Condition,
  SignalJoiner,
  SignalOperator,
  SignalOperatorValues,
} from 'react-native-chart-iq';

import Icons from '~/assets/icons';
import { textOnColor } from '~/shared/helpers';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

interface ConditionProps {
  condition: Condition;
  index: number;
  onPress: () => void;
  joiner: SignalJoiner;
}

const ConditionItem: React.FC<ConditionProps> = ({ condition, onPress, index, joiner }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const signalOperator = SignalOperatorValues.find(
    (item) => item.key === condition.signalOperator,
  )?.description;

  const rightIndicatorValue = condition.rightIndicator ? condition.rightIndicator : '';
  const rightIndicator =
    condition.signalOperator === SignalOperator.TURNS_UP ||
    condition.signalOperator === SignalOperator.TURNS_DOWN ||
    condition.signalOperator === SignalOperator.INCREASES ||
    condition.signalOperator === SignalOperator.DECREASES ||
    condition.signalOperator === SignalOperator.DOES_NOT_CHANGE
      ? ''
      : rightIndicatorValue.split(' (')[0];
  const fallbackColor = theme.isDark ? '#fff' : '#000';

  const color =
    condition.markerOption.color !== null ? condition.markerOption.color : fallbackColor;

  return (
    <ListItem
      topBorder={index === 0}
      onPress={onPress}
      titleComponent={
        <View style={styles.row}>
          {index === 0 || joiner === SignalJoiner.OR ? (
            <View style={[styles.colorBox, { backgroundColor: color }]}>
              <Text style={[styles.boxText, { color: textOnColor(color) }]}>
                {condition.markerOption.label.length > 1 ? '...' : condition.markerOption.label}
              </Text>
            </View>
          ) : null}
          <View>
            <View>
              <Text style={styles.cardTitle}>{`${index + 1} Condition`}</Text>
            </View>
            <Text style={styles.cardDescription}>
              {`${condition.leftIndicator.split(' (')[0]} Is ${signalOperator} ${rightIndicator}`}
            </Text>
          </View>
        </View>
      }
    >
      <Icons.chevronRight fill={theme.colors.cardSubtitle} />
    </ListItem>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    colorBox: {
      width: 24,
      height: 24,
      alignItems: 'center',
      marginRight: 8,
      borderRadius: 4,
    },
    boxText: {
      lineHeight: 24,
      fontSize: 20,
    },
    cardTitle: {
      color: theme.colors.cardTitle,
      fontSize: 16,
    },
    cardDescription: {
      color: theme.colors.cardSubtitle,
      fontSize: 12,
    },
  });

export default ConditionItem;
