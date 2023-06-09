import { Corrective, Decoration, Impulse, Template } from './elliotwave';

export interface DrawingSettings {
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
  lineWidth1: number;
  lineWidth2: number;
  lineWidth3: number;
  pattern1: string;
  pattern2: string;
  pattern3: string;
  color1: string;
  color2: string;
  color3: string;
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

  active1: boolean;
  active2: boolean;
  active3: boolean;
  axisLabel: boolean;
}
