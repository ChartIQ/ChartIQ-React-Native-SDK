import { StudyParameterType } from './study';

export interface StudyParameterModel {
  fieldName: string;
  fieldSelectedValue: string | number | boolean;
}

export interface ChartIQStudyParameterModel {
  fieldName: string;
  fieldSelectedValue: string;
}

export type StudyParameterFieldType =
  | 'Select'
  | 'TextColor'
  | 'Number'
  | 'Text'
  | 'Checkbox';

export interface StudyParameterResponse {
  fieldType: StudyParameterFieldType;
  fieldValue: string;
}

export interface StudyParameter {
  defaultValue: number | string | boolean;
  /**IOS specific */
  defaultInput?: number | string | boolean;
  /**IOS specific */
  defaultOutput?: number | string | boolean;
  heading: string;
  name: string;
  parameterType: StudyParameterType;
  value: number | string | boolean;
  options?: {
    [key: string]: string;
  };
  fieldType: StudyParameterFieldType;
}
