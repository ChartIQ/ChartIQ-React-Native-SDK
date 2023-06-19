export interface Study {
  name: string;
  attributes: {
    [key: string]: any;
  };
  centerLine: number;
  customRemoval: boolean;
  deferUpdate: boolean;
  display: string;
  inputs: {
    [key: string]: any;
  };
  outputs: {
    [key: string]: any;
  };
  overlay: boolean;
  parameters: {
    [key: string]: any;
  };
  range: string;
  shortName: string;
  type: string;
  yAxis: {
    [key: string]: any;
  };
  signalIQExclude: boolean;
}

export type StudySimplified = {
  studyName: string;
  type: string | null;
  outputs: { [key: string]: string };
};

export type StudyParameterType = 'Inputs' | 'Outputs' | 'Parameters';
