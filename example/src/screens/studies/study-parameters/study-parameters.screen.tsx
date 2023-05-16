import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { getStudyParameters, removeStudy, setStudyParameter } from 'react-native-chart-iq-wrapper';

import { StudyParameterType } from '~/model/study';
import { StudiesStack, StudiesStackParamList } from '~/shared/navigation.types';
import { useTheme } from '~/theme';
import { ColorSelector } from '~/ui/color-selector';
import { ColorSelectorMethods } from '~/ui/color-selector/color-selector.component';
import { ListItem } from '~/ui/list-item';

export interface StudyParametersProps
  extends NativeStackScreenProps<StudiesStackParamList, StudiesStack.StudyParameters> {}

interface StudyParameter {
  defaultValue: number | string;
  heading: string;
  name: string;
  parameterType: StudyParameterType;
  value: number | string;
}

const StudyParameters: React.FC<StudyParametersProps> = ({
  route: {
    params: { study },
  },
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const colorSelectorRef = useRef<ColorSelectorMethods>(null);

  const [inputParams, setInputParams] = useState<Array<StudyParameter>>([]);
  const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);

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
    // NOTE: it might be worth to check current value on equality to default and skip call to SDK
    inputParams.forEach(({ name, defaultValue }) => {
      setStudyParameter(study, {
        fieldName: name,
        fieldSelectedValue: defaultValue as string,
      });
    });
    outputParams.forEach(({ name, defaultValue }) => {
      setStudyParameter(study, {
        fieldName: name,
        fieldSelectedValue: defaultValue as string,
      });
    });
    get();
  };

  const handleRemoveStudy = () => {
    removeStudy(study);
  };

  const onColorChange = (input: string, id: string) => {
    setStudyParameter(study, {
      fieldName: id,
      fieldSelectedValue: input,
    });
    get();
  };

  const handleChangeColor = (paramName: string) => {
    colorSelectorRef.current?.open(paramName);
  };

  return (
    <>
      <SectionList
        sections={[
          {
            data: inputParams,
            key: 'section.input-params',
          },
          {
            data: outputParams,
            key: 'section.output-params',
            renderItem: ({ item }) => (
              <Pressable onPress={() => handleChangeColor(item.name)}>
                <ListItem title={item.name}>
                  <View style={[styles.box, { backgroundColor: item.value as string }]} />
                </ListItem>
              </Pressable>
            ),
          },
        ]}
        style={{}}
        renderItem={({ item }) => (
          <ListItem title={item.name}>
            <Text>{item.value}</Text>
          </ListItem>
        )}
        keyExtractor={(item) => item.name}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Pressable onPress={handleResetToDefaults}>
              <ListItem
                textStyle={{ color: theme.colors.colorPrimary }}
                title="Reset to Defaults"
              />
            </Pressable>
            <Pressable onPress={handleRemoveStudy}>
              <ListItem textStyle={{ color: theme.colors.error }} title="Remove Study" />
            </Pressable>
          </View>
        }
      />
      <ColorSelector ref={colorSelectorRef} onChange={onColorChange} />
    </>
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
  });

export default StudyParameters;
