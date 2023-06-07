import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { PropsWithChildren, forwardRef, useImperativeHandle, useRef, useState } from 'react';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { Input } from '../input';
import { ListItem } from '../list-item';
import { SelectorHeader } from '../selector-header';

interface SelectOptionFromListProps extends PropsWithChildren {
  onChange: (result: { value: string; key: string }, id: string) => void;
  title?: string;
  filtered?: boolean;
}

type Data = { [key: string]: string } | Array<{ key: string; value: string }>;

export interface SelectOptionFromListMethods extends BottomSheetMethods {
  open: (data: Data, selected: string, id: string) => void;
}

const SelectOptionFromList = forwardRef<SelectOptionFromListMethods, SelectOptionFromListProps>(
  ({ onChange, title, filtered = false }, ref) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const idRef = useRef<string>('');
    const [flatListData, setFlatListData] = useState<Array<{ key: string; value: string }>>([]);
    const [selectedItem, setSelectedItem] = useState('');
    const { translationMap, translations } = useTranslations();
    const [filter, setFilter] = useState('');

    const handleSelect = (value: string, key: string) => {
      onChange({ key, value }, idRef.current);
      bottomSheetRef.current?.dismiss();
    };

    const onExpand = (data: Data, selected: string, id: string) => {
      idRef.current = id;
      if (Array.isArray(data)) {
        setFlatListData(data);
      } else {
        setFlatListData(Object.entries(data).map(([key, value]) => ({ key, value })));
      }
      setSelectedItem(selected);
      bottomSheetRef.current?.present(id);
    };

    useImperativeHandle(ref, () => ({
      ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
      open: onExpand,
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
            handleLeftAction={() => bottomSheetRef.current?.dismiss()}
          />
        ) : null}
        {filtered ? <Input bottomSheet onChange={setFilter} /> : null}
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
