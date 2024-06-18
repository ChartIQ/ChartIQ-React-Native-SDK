import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { PropsWithChildren, forwardRef, useImperativeHandle, useRef, useState } from 'react';

import Icons from '../../assets/icons';
import { useTranslations } from '../../shared/hooks/use-translations';
import { useTheme } from '../../theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { Input } from '../input';
import { ListItem } from '../list-item';
import { SelectorHeader } from '../selector-header';

interface SelectOptionFromListProps extends PropsWithChildren {
  onChange: (result: { value: string; key: string }, id: string) => void;
  filtered?: boolean;
  showHeader?: boolean;
  withSaveButton?: boolean;
  compare?: (a: string, b: string) => boolean;
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

type Item = { key: string; value: string };

const SelectOptionFromList = forwardRef<SelectOptionFromListMethods, SelectOptionFromListProps>(
  (
    {
      onChange,
      filtered = false,
      showHeader = true,
      withSaveButton = false,
      compare = (a, b) => a === b,
    },
    ref,
  ) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [flatListData, setFlatListData] = useState<Array<Item>>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const { translationMap, translations } = useTranslations();
    const [filter, setFilter] = useState('');
    const [title, setTitle] = useState('');

    const handleSelect = (item: Item) => {
      onChange(item, bottomSheetRef.current?.id ?? '');
      bottomSheetRef.current?.dismiss();
    };

    const handleSave = () => {
      if (selectedItem) {
        onChange(selectedItem, bottomSheetRef.current?.id ?? '');
        bottomSheetRef.current?.dismiss();
      }
    };

    const onExpand = ({ data, id, selected, title }: Params) => {
      if (Array.isArray(data)) {
        setFlatListData(data);
      } else {
        setFlatListData(Object.entries(data).map(([key, value]) => ({ key, value })));
      }
      setTitle(title);
      setSelectedItem({ key: selected, value: selected });
      bottomSheetRef.current?.present(id);
    };

    const onDismiss = () => {
      setFilter('');
      setSelectedItem(null);
      setTitle('');
      bottomSheetRef.current?.dismiss();
    };

    useImperativeHandle(ref, () => ({
      ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
      open: onExpand,
      dismiss: onDismiss,
    }));

    const filteredData = flatListData.filter(({ value }) =>
      value.toLowerCase().includes(filter.toLowerCase()),
    );

    const onPress = (item: Item) => {
      if (withSaveButton) {
        setSelectedItem(item);
        return;
      }

      handleSelect(item);
    };

    return (
      <BottomSheet ref={bottomSheetRef} onClose={onDismiss}>
        {title && showHeader ? (
          <SelectorHeader
            title={translationMap[title] || title}
            leftActionTitle={translations.close}
            handleLeftAction={() => bottomSheetRef.current?.dismiss()}
            rightActionTitle={withSaveButton && selectedItem ? 'Save' : undefined}
            handleRightAction={withSaveButton && selectedItem ? handleSave : undefined}
          />
        ) : null}
        {filtered ? (
          <Input
            bottomSheet
            onChange={setFilter}
            handleClear={() => setFilter('')}
            handleClose={showHeader ? undefined : bottomSheetRef.current?.dismiss}
            autofocus={false}
          />
        ) : null}
        <BottomSheetFlatList
          data={filteredData}
          renderItem={({ item }) => (
            <ListItem onPress={() => onPress(item)} title={item.value}>
              {compare(selectedItem?.key ?? '', item.key) ? (
                <Icons.check width={18} height={18} fill={theme.colors.colorPrimary} />
              ) : null}
            </ListItem>
          )}
        />
      </BottomSheet>
    );
  },
);

SelectOptionFromList.displayName = 'SelectOptionFromList';

export default SelectOptionFromList;
