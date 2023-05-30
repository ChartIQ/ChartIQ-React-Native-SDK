import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { PropsWithChildren, forwardRef, useImperativeHandle, useRef, useState } from 'react';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { useTheme } from '~/theme';

import { BottomSheet } from '../bottom-sheet';
import { Input } from '../input';
import { ListItem } from '../list-item';
import { SelectorHeader } from '../selector-header';

interface SelectOptionFromListProps extends PropsWithChildren {
  onChange: (result: { value: string; key: string }, id: string) => void;
  title?: string;
}

type Data = { [key: string]: string } | Array<{ key: string; value: string }>;

export interface SelectOptionFromListMethods {
  open: (data: Data, selected: string, id: string) => void;
  close: () => void;
}

const SelectOptionFromList = forwardRef<SelectOptionFromListMethods, SelectOptionFromListProps>(
  ({ onChange, title }, ref) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const idRef = useRef<string>('');
    const [flatListData, setFlatListData] = useState<Array<{ key: string; value: string }>>([]);
    const [selectedItem, setSelectedItem] = useState('');
    const { translationMap, translations } = useTranslations();
    const [filter, setFilter] = useState('');

    const onClose = () => {
      bottomSheetRef.current?.close();
    };

    const handleSelect = (value: string, key: string) => {
      onChange({ key, value }, idRef.current);
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

    const filteredData = flatListData.filter(({ value }) =>
      value.toLowerCase().includes(filter.toLowerCase()),
    );

    return (
      <BottomSheet ref={bottomSheetRef}>
        {title ? (
          <SelectorHeader
            title={translationMap[title] || title}
            leftActionTitle={translations.close}
            handleLeftAction={onClose}
          />
        ) : null}
        <Input bottomSheet onChange={setFilter} />
        <BottomSheetFlatList
          data={filteredData}
          renderItem={({ item: { value, key } }) => (
            <ListItem onPress={() => handleSelect(value, key)} title={value}>
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
