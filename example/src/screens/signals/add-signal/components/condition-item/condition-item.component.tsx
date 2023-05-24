import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Icons from '~/assets/icons';
import { Condition } from '~/model/signals/condition';
import { SignalOperatorValues } from '~/model/signals/signal-operator';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

interface ConditionProps {
  condition: Condition;
  studyName: string;
  index: number;
  onPress: () => void;
}

const ConditionItem: React.FC<ConditionProps> = ({ condition, studyName, onPress, index }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const signalOperator = SignalOperatorValues.find(
    (item) => item.key === condition.signalOperator,
  )?.description;
  return (
    <>
      <ListItem
        onPress={onPress}
        titleComponent={
          <View style={styles.row}>
            <View style={[styles.colorBox, { backgroundColor: condition.markerOption.color }]}>
              <Text style={styles.boxText}>
                {condition.markerOption.label.length > 1 ? '...' : condition.markerOption.label}
              </Text>
            </View>
            <View>
              <View>
                <Text style={styles.cardTitle}>{`${index} Condition`}</Text>
              </View>
              <Text style={styles.cardDescription}>
                {`${condition.leftIndicator}  Is ${signalOperator} ${condition.rightIndicator} ${studyName}`}
              </Text>
            </View>
          </View>
        }
      >
        <Icons.chevronRight fill={theme.colors.cardSubtitle} />
      </ListItem>
      <View></View>
    </>
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
      justifyContent: 'center',
      marginRight: 8,
      borderRadius: 4,
    },
    boxText: {
      lineHeight: 24,
      fontSize: 24,
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
