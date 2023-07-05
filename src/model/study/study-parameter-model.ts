import { StudyParameterType } from './study';

export interface StudyParameterModel {
  fieldName: string;
  fieldSelectedValue: string;
}

type StudyParameterFieldType =
  | 'Select'
  | 'TextColor'
  | 'Number'
  | 'Text'
  | 'Checkbox';

export type StudyParameterResponse = {
  fieldType: StudyParameterFieldType;
  fieldValue: string;
};

export interface StudyParameter {
  defaultValue: number | string | boolean;
  heading: string;
  name: string;
  parameterType: StudyParameterType;
  value: number | string | boolean;
  options?: {
    [key: string]: string;
  };
  fieldType: StudyParameterFieldType;
}
