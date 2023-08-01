import { Corrective, Decoration, Impulse, Template } from './elliotwave';

export interface STDDeviationSettings {
  lineWidth1: number;
  lineWidth2: number;
  lineWidth3: number;
  pattern1: string;
  pattern2: string;
  pattern3: string;
  color1: string;
  color2: string;
  color3: string;
  active1: boolean;
  active2: boolean;
  active3: boolean;
}
export interface DrawingSettings extends STDDeviationSettings {
  pattern: string;
  lineWidth: number;
  fillColor: string;
  color: string;
  font: {
    style: string;
    size: string;
    weight: string;
    family: string;
  };
  fibs: {
    level: number;
    display: boolean;
  }[];

  volumeProfile: {
    priceBuckets: number;
  };

  waveParameters: {
    impulse: Impulse;
    corrective: Corrective;
    decoration: Decoration;
    template: Template;
    showLines: boolean;
  };
  axisLabel: boolean;
}
