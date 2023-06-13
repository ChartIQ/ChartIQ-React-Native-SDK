import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getStudyParameters, removeStudy, setStudyParameters } from 'react-native-chart-iq-wrapper';

import { StudyParameter } from '~/model';
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
    navigation.setOptions({ title: study.name, headerTitleAlign: 'center' });
  }, [navigation, study.name]);

  const get = useCallback(async () => {
    const inputs = await getStudyParameters(study, 'Inputs');
    const outputs = await getStudyParameters(study, 'Outputs');

    setInputParams(inputs);
    setOutputParams(outputs);
  }, [study]);

  useEffect(() => {
    get();
  }, [get]);

  const handleResetToDefaults = () => {
    const inputParameters = inputParams.map(({ name, defaultValue }) => ({
      fieldName: name,
      fieldSelectedValue: defaultValue as string,
    }));
    const outputParameters = outputParams.map(({ name, defaultValue }) => ({
      fieldName: name,
      fieldSelectedValue: defaultValue as string,
    }));

    setStudyParameters(study, [...inputParameters, ...outputParameters]);
    navigation.goBack();
  };

  const handleRemoveStudy = () => {
    removeStudy(study);
  };

  const handleSave = useCallback(() => {
    const inputParameters = changeStudyParametersRef.current?.getInputParamsData() || [];
    const outputParameters = changeStudyParametersRef.current?.getOutputParamsData() || [];

    setStudyParameters(study, [...inputParameters, ...outputParameters]);

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
