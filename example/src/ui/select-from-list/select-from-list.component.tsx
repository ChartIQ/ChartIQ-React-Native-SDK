import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import Icons from '~/assets/icons';
import { useTheme } from '~/theme';

import { BottomSheet } from '../bottom-sheet';
import { ListItem } from '../list-item';

interface SelectOptionFromListProps {
  onChange: (value: string, id: string) => void;
}

type Data = { [key: string]: string } | Array<{ key: string; value: string }>;

export interface SelectOptionFromListMethods {
  open: (data: Data, selected: string, id: string) => void;
  close: () => void;
}

const SelectOptionFromList = forwardRef<SelectOptionFromListMethods, SelectOptionFromListProps>(
  ({ onChange }, ref) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const idRef = useRef<string>('');
    const [flatListData, setFlatListData] = useState<Array<{ key: string; value: string }>>([]);
    const [selectedItem, setSelectedItem] = useState('');

    const onClose = () => {
      bottomSheetRef.current?.close();
    };

    const handleSelect = (fieldSelectedValue: string) => {
      onChange(fieldSelectedValue, idRef.current);
      onClose();
    };

    const onExpand = (data: Data, selected: string, id: string) => {
      idRef.current = id;
      if (Array.isArray(data)) {
        setFlatListData(data);
      } else {
        setFlatListData(Object.entries(data).map(([key, value]) => ({ key, value })));
      }
      setSelectedItem(selected);
      bottomSheetRef.current?.expand();
    };

    useImperativeHandle(ref, () => ({
      open: onExpand,
      close: onClose,
    }));

    return (
      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetFlatList
          data={flatListData}
          renderItem={({ item: { value, key } }) => (
            <ListItem onPress={() => handleSelect(value)} title={value}>
              {key === selectedItem ? <Icons.check fill={theme.colors.colorPrimary} /> : null}
            </ListItem>
          )}
        />
      </BottomSheet>
    );
  },
);

SelectOptionFromList.displayName = 'SelectOptionFromList';

export default SelectOptionFromList;
