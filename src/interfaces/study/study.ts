export interface Study {
  name: string;
  /** IOS specific */
  fullName: string;
  /** IOS specific */
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
  name: string;
  shortName: string;
  type: string;
  outputs: { [key: string]: string };
  /** IOS specific */
  fullName?: string;
};

export type StudyParameterType = 'Inputs' | 'Outputs' | 'Parameters';
