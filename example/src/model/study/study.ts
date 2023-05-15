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
  underlay: boolean;
  yAxis: {
    [key: string]: any;
  };
  signalIQExclude: boolean;
}

export type StudyParameterType = 'Inputs' | 'Outputs' | 'Parameters';
