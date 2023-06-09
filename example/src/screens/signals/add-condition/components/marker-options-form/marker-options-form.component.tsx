import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  MarkerOption,
  SignalMarkerType,
  SignalPosition,
  SignalShape,
  SignalSize,
} from '~/model/signals/marker-option';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

interface MarkerOptionsFormProps {
  color: string;
  onColorPressed: () => void;
  showAppearance?: boolean;
}
export interface MarkerOptionsFormMethods {
  getMarkerOptions: () => MarkerOption;
}
const DATA = {
  markerType: [
    {
      key: SignalMarkerType.MARKER,
      value: 'Chart Marker',
    },
    {
      key: SignalMarkerType.PAINTBAR,
      value: 'Paintbar',
    },
  ],
  shape: [
    {
      key: SignalShape.CIRCLE,
      value: 'Circle',
    },
    {
      key: SignalShape.SQUARE,
      value: 'Square',
    },
    {
      key: SignalShape.DIAMOND,
      value: 'Diamond',
    },
  ],
  size: [
    {
      key: SignalSize.SMALL,
      value: 'Small',
    },
    {
      key: SignalSize.MEDIUM,
      value: 'Medium',
    },
    {
      key: SignalSize.LARGE,
      value: 'Large',
    },
  ],
  position: [
    {
      key: SignalPosition.ABOVE_CANDLE,
      value: 'Above Line',
    },
    {
      key: SignalPosition.BELOW_CANDLE,
      value: 'Below Line',
    },
    {
      key: SignalPosition.ON_CANDLE,
      value: 'On Line',
    },
  ],
} as const;

const SELECTOR_KEYS = {
  markerType: 'markerType',
  shape: 'shape',
  size: 'size',
  position: 'position',
};

type Data = {
  key: SignalMarkerType | SignalShape | SignalPosition | SignalSize | string;
  value: string;
};

const MarkerOptionsForm = forwardRef<MarkerOptionsFormMethods, MarkerOptionsFormProps>(
  ({ color: colorProp, onColorPressed, showAppearance = true }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const fromListSelectRef = React.useRef<SelectOptionFromListMethods>(null);

    const [markType, setMarkType] = useState<Data>(DATA.markerType[0]);
    const [shape, setShape] = useState<Data>(DATA.shape[0]);
    const [tagMark, setTagMark] = useState<string>('x');
    const [size, setSize] = useState<Data>(DATA.size[0]);
    const [position, setPosition] = useState<Data>(DATA.position[0]);
    const [color, setColor] = useState<string>('');

    useEffect(() => {
      setColor(colorProp);
    }, [colorProp]);

    const handleMarkerType = () => {
      fromListSelectRef.current?.open({
        data: Array.from(DATA.markerType),
        selected: markType.key,
        id: SELECTOR_KEYS.markerType,
        title: 'Select Option',
      });
    };

    const handleShape = () => {
      fromListSelectRef.current?.open({
        data: Array.from(DATA.shape),
        selected: shape.key,
        id: SELECTOR_KEYS.shape,
        title: 'Select Option',
      });
    };
    const handleTagMark = (text: string) => {
      setTagMark(text);
    };
    const handleSize = () => {
      fromListSelectRef.current?.open({
        data: Array.from(DATA.size),
        selected: size.key,
        id: SELECTOR_KEYS.size,
        title: 'Select Option',
      });
    };
    const handlePosition = () => {
      fromListSelectRef.current?.open({
        data: Array.from(DATA.position),
        selected: position.key,
        id: SELECTOR_KEYS.position,
        title: 'Select Option',
      });
    };

    const onChange = ({ value }: { value: string; key: string }, id: string) => {
      switch (id) {
        case SELECTOR_KEYS.markerType: {
          setMarkType(
            (prevState) => DATA.markerType.find((item) => item.value === value) ?? prevState,
          );
          break;
        }
        case SELECTOR_KEYS.shape: {
          setShape((prevState) => DATA.shape.find((item) => item.value === value) ?? prevState);
          break;
        }
        case SELECTOR_KEYS.size: {
          setSize((prevState) => DATA.size.find((item) => item.value === value) ?? prevState);
          break;
        }
        case SELECTOR_KEYS.position: {
          setPosition(
            (prevState) => DATA.position.find((item) => item.value === value) ?? prevState,
          );
          break;
        }
      }
    };
    useImperativeHandle(ref, () => ({
      getMarkerOptions: () => {
        const markerOptions: MarkerOption = {
          color: color,
          signalPosition: position.key as SignalPosition,
          signalShape: shape.key as SignalShape,
          signalSize: size.key as SignalSize,
          type: markType.key as SignalMarkerType,
          label: tagMark,
        };
        return markerOptions;
      },
    }));

    return (
      <View style={{ display: showAppearance ? 'flex' : 'none' }}>
        <Text style={styles.title}>Appearance Settings</Text>
        <View>
          <ListItem onPress={handleMarkerType} title="Marker Type" value={markType.value} />
          <ListItem onPress={onColorPressed} title="Color">
            <View style={[styles.colorBox, { backgroundColor: color }]} />
          </ListItem>
          <ListItem onPress={handleShape} title="Shape" value={shape.value} />
          <ListItem title="Tag Mark">
            <TextInput style={styles.input} defaultValue="x" onChangeText={handleTagMark} />
          </ListItem>
          <ListItem onPress={handleSize} title="Size" value={size.value} />
          <ListItem onPress={handlePosition} title="Position" value={position.value} />
        </View>
        <SelectFromList ref={fromListSelectRef} onChange={onChange} />
      </View>
    );
  },
);

MarkerOptionsForm.displayName = 'MarkerOptionsForm';

const createStyles = ({ colors: { cardSubtitle } }: Theme) =>
  StyleSheet.create({
    title: {
      paddingVertical: 8,
      paddingLeft: 16,
      textTransform: 'uppercase',
      color: cardSubtitle,
    },
    input: {
      padding: 0,
      fontSize: 16,
    },
    colorBox: {
      width: 24,
      height: 24,
    },
  });

export default MarkerOptionsForm;
