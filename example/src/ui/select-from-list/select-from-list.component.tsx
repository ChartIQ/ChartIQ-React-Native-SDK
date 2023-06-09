import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { PropsWithChildren, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { set } from 'react-native-reanimated';

import Icons from '~/assets/icons';
import { useTranslations } from '~/shared/hooks/use-translations';
import { useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { Input } from '../input';
import { ListItem } from '../list-item';
import { SelectorHeader } from '../selector-header';

interface SelectOptionFromListProps extends PropsWithChildren {
  onChange: (result: { value: string; key: string }, id: string) => void;
  filtered?: boolean;
}

type Data = { [key: string]: string } | Array<{ key: string; value: string }>;

type Params = {
  id: string;
  data: Data;
  selected: string;
  title: string;
};
export interface SelectOptionFromListMethods extends BottomSheetMethods {
  open: (params: Params) => void;
}

const SelectOptionFromList = forwardRef<SelectOptionFromListMethods, SelectOptionFromListProps>(
  ({ onChange, filtered = false }, ref) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [flatListData, setFlatListData] = useState<Array<{ key: string; value: string }>>([]);
    const [selectedItem, setSelectedItem] = useState('');
    const { translationMap, translations } = useTranslations();
    const [filter, setFilter] = useState('');
    const [title, setTitle] = useState('');

    const handleSelect = (value: string, key: string) => {
      onChange({ key, value }, bottomSheetRef.current?.id ?? '');
      bottomSheetRef.current?.dismiss();
    };

    const onExpand = ({ data, id, selected, title }: Params) => {
      if (Array.isArray(data)) {
        setFlatListData(data);
      } else {
        setFlatListData(Object.entries(data).map(([key, value]) => ({ key, value })));
      }
      setTitle(title);
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
