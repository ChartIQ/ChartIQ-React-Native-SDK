import React, {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { SectionList, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { StudyParameter, StudyParameterModel } from '~/model';
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
      setInputParams(inputParameters);
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

    const onOptionChange = ({ value: input }: { value: string }, id: string) => {
      const itemToChange = inputParamsData.find((item) => item.fieldName === id);
      if (itemToChange) {
        setInputParamsData((prevState) => {
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
        setInputParamsData((prevState) => {
          return [...prevState, { fieldName: id, fieldSelectedValue: input }];
        });
      }

      setInputParams((prevState) => {
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

    const onValueChange = (fieldName: string, fieldSelectedValue: string | number | boolean) => {
      const itemToChange = inputParamsData.find((item) => item.fieldName === fieldName);
      if (itemToChange) {
        setInputParamsData((prevState) => {
          return prevState.map((item) => {
            if (item.fieldName === fieldName) {
              return {
                ...item,
                fieldSelectedValue: fieldSelectedValue.toString(),
              };
            }
            return item;
          });
        });
      } else {
        setInputParamsData((prevState) => {
          return [...prevState, { fieldName, fieldSelectedValue: fieldSelectedValue.toString() }];
        });
      }

      setInputParams((prevState) => {
        return prevState.map((item) => {
          if (item.name === fieldName) {
            return {
              ...item,
              value: fieldSelectedValue,
            };
          }
          return item;
        });
      });
    };

    useImperativeHandle(ref, () => ({
      getInputParamsData: () => inputParamsData,
      getOutputParamsData: () => {
        return outputParamsData;
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
      const number = Number(text);
      if (isNaN(number) || number === Infinity || number === -Infinity) {
        onValueChange(name, 0.0);
        return;
      }
      onValueChange(name, number);
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
                      <Text>{item.value}</Text>
                    </ListItem>
                  );
                }
                if (item.fieldType === 'Text') {
                  return (
                    <ListItem title={item.name}>
                      <TextInput
                        style={styles.input}
                        defaultValue={item.value.toString()}
                        onChange={({ nativeEvent: { text } }) => onValueChange(item.name, text)}
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
                        keyboardType="numeric"
                        defaultValue={item.value.toString()}
                        placeholder="0.0"
                        onChange={({ nativeEvent: { text } }) => onValueChange(item.name, text)}
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

export default ChangeStudyParameters;
