import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChartIQ, StudyParameter } from 'react-native-chart-iq-wrapper';

import { formatStudyName } from '~/shared/helpers';
import { StudiesStack, StudiesStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ChangeStudyParameters } from '~/ui/change-study-parameters';
import { ChangeStudyParameterMethods } from '~/ui/change-study-parameters/change-study-parameters.component';
import { ListItem } from '~/ui/list-item';

export interface StudyParametersProps
  extends NativeStackScreenProps<StudiesStackParamList, StudiesStack.StudyParameters> {}

const StudyParameters: React.FC<StudyParametersProps> = ({
  route: {
    params: { study },
  },
  navigation,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const changeStudyParametersRef = useRef<ChangeStudyParameterMethods>(null);
  const [inputParams, setInputParams] = useState<Array<StudyParameter>>([]);
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: formatStudyName(study.display), headerTitleAlign: 'center' });
  }, [navigation, study.display]);

  const get = useCallback(async () => {
    const inputs = await ChartIQ.getStudyParameters(study, 'Inputs');
    const outputs = await ChartIQ.getStudyParameters(study, 'Outputs');

    setInputParams(inputs);
    setOutputParams(outputs);
  }, [study]);

  useEffect(() => {
    get();
  }, [get]);

  const handleResetToDefaults = () => {
    Alert.alert(
      'Do You Want To Reset This Study To Defaults?',
      'This study will be reset to default options',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            const inputParameters = inputParams.map(({ name, defaultValue }) => ({
              fieldName: name,
              fieldSelectedValue: defaultValue.toString(),
            }));
            const outputParameters = outputParams.map(({ name, defaultValue }) => ({
              fieldName: name,
              fieldSelectedValue: defaultValue.toString(),
            }));

            ChartIQ.setStudyParameters(study, [...inputParameters, ...outputParameters]);
            setInputParams((prevState) =>
              prevState.map((item) => ({ ...item, value: item.defaultValue })),
            );
            setOutputParams((prevState) =>
              prevState.map((item) => ({ ...item, value: item.defaultValue })),
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleRemoveStudy = () => {
    Alert.alert(
      'Do You Want To Remove This Study?',
      'This study will be removed from the current chart',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            ChartIQ.removeStudy(study);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleSave = useCallback(() => {
    const inputParameters =
      changeStudyParametersRef.current
        ?.getInputParamsData()
        .map((item) => ({ ...item, fieldSelectedValue: item.fieldSelectedValue.toString() })) || [];
    const outputParameters =
      changeStudyParametersRef.current
        ?.getOutputParamsData()
        .map((item) => ({ ...item, fieldSelectedValue: item.fieldSelectedValue.toString() })) || [];

    ChartIQ.setStudyParameters(study, [...inputParameters, ...outputParameters]);

    navigation.goBack();
  }, [navigation, study]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      ),
    });
  }, [handleSave, navigation, study, styles.buttonText]);

  return (
    <ChangeStudyParameters
      ref={changeStudyParametersRef}
      inputParameters={inputParams}
      outputParameters={outputParams}
    >
      <View style={styles.footerContainer}>
        <ListItem
          onPress={handleResetToDefaults}
          textStyle={{ color: theme.colors.colorPrimary }}
          title="Reset to Defaults"
        />
        <ListItem
          onPress={handleRemoveStudy}
          textStyle={{ color: theme.colors.error }}
          title="Remove Study"
        />
      </View>
    </ChangeStudyParameters>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    box: {
      width: 24,
      height: 24,
    },
    footerContainer: {
      paddingTop: 24,
    },
    buttonText: {
      color: theme.colors.colorPrimary,
    },
    input: {
      padding: 0,
    },
  });

export default StudyParameters;
