export interface Study {
  name: string;
  fullName: string;
  originalName?: string;
  attributes: {
    [key: string]: unknown;
  };
  centerLine: number;
  customRemoval: boolean;
  deferUpdate: boolean;
  display: string;
  inputs: {
    [key: string]: unknown;
  };
  outputs: {
    [key: string]: unknown;
  };
  overlay: boolean;
  parameters: {
    [key: string]: unknown;
  };
  range: string;
  shortName: string;
  type: string;
  yAxis: {
    [key: string]: unknown;
  };
  signalIQExclude: boolean;
  uniqueId?: string;
}

export type StudySimplified = {
  studyName: string;
  type: string | null;
  outputs: { [key: string]: string };
};

export type StudyParameterType = 'Inputs' | 'Outputs' | 'Parameters';
