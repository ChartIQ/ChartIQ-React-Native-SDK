import { ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { ActiveImageType } from '~/assets/images/active-image/active-image.types';
import { CrosshairSharedValues } from '~/model';

import { ChartStyleItem } from '../chart-style-selector/chart-style-selector.data';

export interface HeaderItem {
  onPress: () => void;
  Icon?: React.FC<SvgProps> | React.FC | null;
  key: string;
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  fill?: string;
  stroke?: string;
  activeImageType?: ActiveImageType;
  active?: boolean;
}

export interface HeaderProps {
  interval: string | null;
  chartStyle: ChartStyleItem | null;
  symbol: string | null;
  handleSymbolSelector: () => void;
  handleIntervalSelector: () => void;
  handleChartStyleSelector: () => void;
  handleCompareSymbolSelector: () => void;
  handleDrawingTool: () => void;
  handleFullScreen: () => void;
  crosshairState: CrosshairSharedValues;
  isDrawing: boolean;
  isLandscape: boolean;
}
