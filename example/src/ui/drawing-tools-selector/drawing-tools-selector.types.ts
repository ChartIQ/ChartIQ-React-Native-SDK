import { SectionListData } from 'react-native';

import { DrawingItem } from './drawing-tools-selector.data';

export interface DrawingToolSelectorProps {
  onChange: (symbol: DrawingItem) => void;
  handleRestoreDrawingParams: (tool: DrawingItem) => Promise<void>;
}

export type RenderSectionHeader = (info: {
  section: SectionListData<
    DrawingItem,
    {
      title: string;
      data: DrawingItem[];
      renderItem: (item: {
        item: DrawingItem;
        index: number;
        section: {
          data: DrawingItem[];
        };
      }) => Element;
    }
  >;
}) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
