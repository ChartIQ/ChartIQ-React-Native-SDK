import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native-svg';

import {
  SignalMarkerType,
  SignalPosition,
  SignalShape,
  SignalSize,
} from '~/model/signals/marker-option';
import { ColorSelector } from '~/ui/color-selector';
import { ColorSelectorMethods } from '~/ui/color-selector/color-selector.component';
import { ListItem } from '~/ui/list-item';
import { SelectFromList } from '~/ui/select-from-list';
import { SelectOptionFromListMethods } from '~/ui/select-from-list/select-from-list.component';

interface MarkerOptionsFormProps {
  color: string;
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

const MarkerOptionsForm: React.FC<MarkerOptionsFormProps> = ({ color: colorProp }) => {
  const fromListSelectRef = React.useRef<SelectOptionFromListMethods>(null);
  const colorSelectorRef = React.useRef<ColorSelectorMethods>(null);

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
    fromListSelectRef.current?.open(
      Array.from(DATA.markerType),
      markType.key,
      SELECTOR_KEYS.markerType,
    );
  };
  const handleColor = () => {
    colorSelectorRef.current?.open();
  };
  const handleShape = () => {
    fromListSelectRef.current?.open(Array.from(DATA.shape), shape.key, SELECTOR_KEYS.shape);
  };
  const handleTagMark = (text: string) => {
    setTagMark(text);
  };
  const handleSize = () => {
    fromListSelectRef.current?.open(Array.from(DATA.size), size.key, SELECTOR_KEYS.size);
  };
  const handlePosition = () => {
    fromListSelectRef.current?.open(
      Array.from(DATA.position),
      position.key,
      SELECTOR_KEYS.position,
    );
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
        setPosition((prevState) => DATA.position.find((item) => item.value === value) ?? prevState);
        break;
      }
    }
  };

  const handleColorChange = (input: string) => {
    setColor(input);
  };

  return (
    <View>
      <ListItem onPress={handleMarkerType} title="Marker Type" value={markType.value} />
      <ListItem onPress={handleColor} title="Color">
        <View style={[styles.colorBox, { backgroundColor: color }]} />
      </ListItem>
      <ListItem onPress={handleShape} title="Shape" value={shape.value} />
      <ListItem title="Tag Mark">
        <TextInput style={styles.input} defaultValue="x" onChangeText={handleTagMark} />
      </ListItem>
      <ListItem onPress={handleSize} title="Size" value={size.value} />
      <ListItem onPress={handlePosition} title="Position" value={position.value} />
      <SelectFromList ref={fromListSelectRef} onChange={onChange} />
      <ColorSelector onChange={handleColorChange} ref={colorSelectorRef} />
    </View>
  );
};

const styles = StyleSheet.create({
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
