import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ChartIQ, StudyParameter } from 'react-native-chartiq';
import { SafeAreaView } from 'react-native-safe-area-context';

import { defaultHitSlop, edges } from '~/constants';
import { formatStudyName } from '~/shared/helpers';
import { useTranslations } from '~/shared/hooks/use-translations';
import { SignalsStack, SignalsStackParamList } from '~/shared/navigation.types';
import { Theme, useTheme } from '~/theme';
import { ChangeStudyParameters } from '~/ui/change-study-parameters';
import { ChangeStudyParameterMethods } from '~/ui/change-study-parameters/change-study-parameters.component';

export interface SignalParametersProps
  extends NativeStackScreenProps<SignalsStackParamList, SignalsStack.ChangeStudyParameters> {}

const StudyParameters: React.FC<SignalParametersProps> = ({
  route: {
    params: { study, isEdit },
  },
  navigation,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { translations } = useTranslations();
  const changeStudyParametersRef = useRef<ChangeStudyParameterMethods>(null);
  const [inputParams, setInputParams] = useState<Array<StudyParameter>>([]);
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: formatStudyName(study.display) });
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

  const handleSave = useCallback(() => {
    const inputParameters =
      changeStudyParametersRef.current?.getInputParamsData().map((item) => ({
        ...item,
        fieldSelectedValue: item.fieldSelectedValue.toString(),
      })) || [];
    const outputParameters =
      changeStudyParametersRef.current?.getOutputParamsData().map((item) => ({
        ...item,
        fieldSelectedValue: item.fieldSelectedValue.toString(),
      })) || [];

    if (inputParameters.length === 0 && outputParameters.length === 0) {
      navigation.navigate(SignalsStack.AddSignal, {
        changeStudy: {
          study: study,
        },
        isEdit,
      });
    }

    ChartIQ.setStudyParameters(study, [...inputParameters, ...outputParameters]).then((data) => {
      navigation.navigate(SignalsStack.AddSignal, {
        changeStudy: {
          study: {
            ...study,
            ...data,
          },
        },
        isEdit,
      });
    });
  }, [isEdit, navigation, study]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={defaultHitSlop} onPress={handleSave}>
          <Text style={styles.buttonText}>{translations.Save}</Text>
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable hitSlop={defaultHitSlop} onPress={handleSave}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </Pressable>
      ),
    });
  }, [handleSave, navigation, study, styles.buttonText, translations.Save, translations.cancel]);

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <ChangeStudyParameters
        ref={changeStudyParametersRef}
        inputParameters={inputParams}
        outputParameters={outputParams}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    box: {
      width: 24,
      height: 24,
    },
    footerContainer: {
      paddingTop: 24,
    },
    buttonText: {
      color: theme.colors.colorPrimary,
      textTransform: 'capitalize',
    },
    input: {
      padding: 0,
    },
  });

export default StudyParameters;
