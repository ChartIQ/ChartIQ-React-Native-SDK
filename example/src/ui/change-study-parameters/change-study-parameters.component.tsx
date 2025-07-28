import React, {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { SectionList, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { StudyParameter, StudyParameterFieldType, StudyParameterModel } from 'react-native-chartiq';

import { formatNumber } from '~/shared/helpers';
import { Theme, useTheme } from '~/theme';

import { ColorSelector } from '../color-selector';
import { ColorSelectorMethods } from '../color-selector/color-selector.component';
import { ListItem } from '../list-item';
import { SelectFromList } from '../select-from-list';
import { SelectOptionFromListMethods } from '../select-from-list/select-from-list.component';

interface ChangeStudyParametersProps extends PropsWithChildren {
  inputParameters: Array<StudyParameter>;
  outputParameters: Array<StudyParameter>;
}

export interface ChangeStudyParameterMethods {
  getInputParamsData: () => StudyParameterModel[];
  getOutputParamsData: () => StudyParameterModel[];
  resetToDefault: () => void;
}

const ChangeStudyParameters = forwardRef<ChangeStudyParameterMethods, ChangeStudyParametersProps>(
  ({ inputParameters, outputParameters, children }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const colorSelectorRef = useRef<ColorSelectorMethods>(null);
    const fromListSelectorRef = useRef<SelectOptionFromListMethods>(null);

    const [inputParams, setInputParams] = useState<Array<StudyParameter>>([]);
    const [outputParams, setOutputParams] = useState<Array<StudyParameter>>([]);

    const [inputParamsData, setInputParamsData] = useState<Array<StudyParameterModel>>([]);
    const [outputParamsData, setOutputParamsData] = useState<Array<StudyParameterModel>>([]);

    useEffect(() => {
      setInputParams(
        inputParameters.map((item) => {
          if (item.fieldType === 'Number') {
            return {
              ...item,
              value: formatNumber(item.value.toString()),
            };
          }
          return item;
        }),
      );
      setOutputParams(outputParameters);
      setInputParamsData((prevState) =>
        prevState.map((item) => {
          return {
            ...item,
            fieldSelectedValue: inputParameters.find((param) => param.name === item.fieldName)
              ?.value as string,
          };
        }),
      );

      setOutputParamsData((prevState) =>
        prevState.map((item) => ({
          ...item,
          fieldSelectedValue: outputParameters.find((param) => param.name === item.fieldName)
            ?.value as string,
        })),
      );
    }, [inputParameters, outputParameters]);

    const onColorChange = (input: string, id: string) => {
      if (!id) return;
      const itemToChange = outputParamsData.find((item) => item.fieldName === id);

      if (itemToChange) {
        setOutputParamsData((prevState) => {
          return prevState.map((item) => {
            if (item.fieldName === id) {
              return {
                ...item,
                fieldSelectedValue: input,
              };
            }
            return item;
          });
        });
      } else {
        setOutputParamsData((prevState) => {
          return [...prevState, { fieldName: id, fieldSelectedValue: input }];
        });
      }

      setOutputParams((prevState) => {
        return prevState.map((item) => {
          if (item.name === id) {
            return {
              ...item,
              value: input,
            };
          }
          return item;
        });
      });
    };

    const handleChangeColor = (paramName: string, value: string) => {
      colorSelectorRef.current?.present(paramName, value);
    };

    const handleSelectOption = (
      options: { [key: string]: string },
      selected: string,
      fieldName: string,
    ) => {
      fromListSelectorRef.current?.open({
        data: options,
        selected,
        id: fieldName,
        title: fieldName,
      });
    };

    const onOptionChange = ({ key }: { key: string }, id: string) => {
      const itemToChange = inputParamsData.find((item) => item.fieldName === id);
      if (itemToChange) {
        setInputParamsData((prevState) =>
          prevState.map((item) =>
            item.fieldName === id
              ? {
                  ...item,
                  fieldSelectedValue: key,
                }
              : item,
          ),
        );
      } else {
        setInputParamsData((prevState) => [
          ...prevState,
          { fieldName: id, fieldSelectedValue: key },
        ]);
      }

      setInputParams((prevState) =>
        prevState.map((item) =>
          item.name === id
            ? {
                ...item,
                value: key,
              }
            : item,
        ),
      );
    };

    const onValueChange = (
      fieldName: string,
      fieldSelectedValue: string | number | boolean,
      type?: StudyParameterFieldType,
    ) => {
      const value = type === 'Number' && !fieldSelectedValue ? '0.0' : fieldSelectedValue;
      const itemToChange = inputParamsData.find((item) => item.fieldName === fieldName);
      if (itemToChange) {
        setInputParamsData((prevState) => {
          return prevState.map((item) => {
            if (item.fieldName === fieldName) {
              return {
                ...item,
                fieldSelectedValue: value,
              };
            }
            return item;
          });
        });
      } else {
        setInputParamsData((prevState) => {
          return [...prevState, { fieldName, fieldSelectedValue: value }];
        });
      }

      setInputParams((prevState) => {
        return prevState.map((item) => {
          if (item.name === fieldName) {
            return {
              ...item,
              value: value,
            };
          }
          return item;
        });
      });
    };

    useImperativeHandle(ref, () => ({
      getInputParamsData: () => inputParamsData,
      getOutputParamsData: () => outputParamsData,
      resetToDefault: () => {
        setInputParamsData(
          inputParameters.map((item) => {
            if (item.fieldType === 'Number') {
              return {
                fieldName: item.name,
                fieldSelectedValue: formatNumber(item.defaultValue.toString()),
              };
            }
            return {
              fieldName: item.name,
              fieldSelectedValue:
                item.fieldType === 'Checkbox' ? item.defaultValue : item.defaultValue.toString(),
            };
          }),
        );
        setOutputParamsData(
          outputParameters.map((item) => ({
            fieldName: item.name,
            fieldSelectedValue: item.defaultValue.toString(),
          })),
        );
      },
    }));

    const inputData = inputParams.map((item) => ({
      ...item,
      value:
        inputParamsData.find((param) => param.fieldName === item.name)?.fieldSelectedValue ??
        item.value,
    }));
    const outputData = outputParams.map((item) => ({
      ...item,
      value:
        outputParamsData.find((param) => param.fieldName === item.name)?.fieldSelectedValue ??
        item.value,
    }));

    const handleNumberChange = (text: string, name: string) => {
      onValueChange(name, formatNumber(text));
    };

    const getStudyLabel = (item: StudyParameter) => {
      return item.options?.[item.value as string] || item.value;
    };

    return (
      <>
        <SectionList
          sections={[
            {
              data: inputData,
              key: 'section.input-params',
              renderItem: ({ item }) => {
                if (item.fieldType === 'Select') {
                  return (
                    <ListItem
                      onPress={() =>
                        handleSelectOption(
                          item.options as { [key: string]: string },
                          item.value as string,
                          item.name,
                        )
                      }
                      title={item.name}
                    >
                      <Text style={styles.input}>{getStudyLabel(item)}</Text>
                    </ListItem>
                  );
                }
                if (item.fieldType === 'Text') {
                  return (
                    <ListItem title={item.name}>
                      <TextInput
                        style={styles.input}
                        defaultValue={item.value.toString()}
                        onChangeText={(text) => onValueChange(item.name, text)}
                        value={item.value.toString()}
                      />
                    </ListItem>
                  );
                }
                if (item.fieldType === 'Number') {
                  return (
                    <ListItem title={item.name}>
                      <TextInput
                        style={styles.input}
                        keyboardType="numbers-and-punctuation"
                        defaultValue={Number(item.value).toFixed(1)}
                        placeholder="0.0"
                        onChangeText={(text) => onValueChange(item.name, text, 'Number')}
                        onEndEditing={({ nativeEvent: { text } }) =>
                          handleNumberChange(text, item.name)
                        }
                        value={item.value.toString()}
                      />
                    </ListItem>
                  );
                }
                if (item.fieldType === 'Checkbox') {
                  return (
                    <ListItem title={item.name}>
                      <Switch
                        trackColor={{
                          false: theme.colors.border,
                          true: theme.colors.colorPrimary,
                        }}
                        value={item.value as boolean}
                        onValueChange={(value) => onValueChange(item.name, value)}
                      />
                    </ListItem>
                  );
                }

                return null;
              },
            },
            {
              data: outputData,
              key: 'section.output-params',
              renderItem: ({ item }) => {
                return (
                  <ListItem
                    onPress={() => {
                      handleChangeColor(item.name, item.value as string);
                    }}
                    title={item.name}
                  >
                    <View style={[styles.box, { backgroundColor: item.value as string }]} />
                  </ListItem>
                );
              },
            },
          ]}
          keyExtractor={(item) => item.name}
          ListFooterComponent={() => {
            return children ? <>{children}</> : null;
          }}
        />
        <ColorSelector ref={colorSelectorRef} onChange={onColorChange} />
        <SelectFromList ref={fromListSelectorRef} onChange={onOptionChange} />
      </>
    );
  },
);

ChangeStudyParameters.displayName = 'ChangeStudyParameters';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    box: {
      width: 24,
      height: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    footerContainer: {
      paddingTop: 24,
    },
    buttonText: {
      color: theme.colors.colorPrimary,
    },
    input: {
      padding: 0,
      color: theme.colors.cardSubtitle,
      fontSize: 16,
      minWidth: 100,
      textAlign: 'right',
    },
  });

export default ChangeStudyParameters;
