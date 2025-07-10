import { useActionSheet } from '@expo/react-native-action-sheet';
import { BottomSheetFlatList, BottomSheetSectionList } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { View, Image, Text, Pressable, Alert, SafeAreaView } from 'react-native';
import { ChartIQ } from 'react-native-chartiq';
import { TextInput } from 'react-native-gesture-handler';

import icons from '~/assets/icons';
import images from '~/assets/images';
import { defaultHitSlop } from '~/constants';
import { asyncStorageKeys } from '~/constants/async-storage-keys';
import { useTranslations } from '~/shared/hooks/use-translations';
import { useTheme } from '~/theme';

import { BottomSheet, BottomSheetMethods } from '../bottom-sheet';
import { FilterSelector } from '../selector-filters';
import { SelectorHeader } from '../selector-header';

import SwipableToolItem from './components/swipable-tool-item/swipable-tool-item.component';
import {
  DrawingItem,
  drawingTools,
  DrawingToolTags,
  drawingFilters,
  allDrawingFilter,
  specialTools,
} from './drawing-tools-selector.data';
import { DrawingToolSelectorProps } from './drawing-tools-selector.types';
import { createStyles } from './drawing-tools.styles';

const DrawingToolSelector = forwardRef<BottomSheetMethods, DrawingToolSelectorProps>(
  ({ onChange, handleRestoreDrawingParams }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const textInputRef = useRef<TextInput>(null);
    const [selectedFilter, setSelectedFilter] = React.useState<string>(allDrawingFilter.value);
    const [tools, setTools] = useState(() =>
      drawingTools.map((item) => ({ ...item, favorite: false })),
    );
    const { showActionSheetWithOptions } = useActionSheet();
    const [tool, setTool] = useState<DrawingItem | null>(null);
    const { translationMap } = useTranslations();
    const [canDismiss, setCanDismiss] = useState(true);

    useEffect(() => {
      const getFavoriteItems = async () => {
        const storageFavoriteItems =
          (await AsyncStorage.getItem(asyncStorageKeys.drawingToolsFavorite)) ?? '[]';

        const favoriteItems = JSON.parse(storageFavoriteItems) as DrawingItem[];
        const translated = drawingTools.map((item) => {
          return {
            ...item,
            title: translationMap[item.title] ?? item.title,
          };
        });
        const newDrawingTools = translated.map((tool) => {
          if (favoriteItems.find((item) => item.name === tool.name)) {
            return {
              ...tool,
              favorite: true,
            };
          }

          return { ...tool, favorite: false };
        });
        setTools(newDrawingTools);
      };

      getFavoriteItems();
    }, [translationMap]);

    const handleClose = () => {
      if (canDismiss) {
        bottomSheetRef.current?.dismiss();
      }
    };

    useImperativeHandle(ref, () => ({
      ...(bottomSheetRef.current ?? ({} as BottomSheetMethods)),
      present: (id) => {
        setCanDismiss(false);
        bottomSheetRef.current?.present(id);

        setTimeout(() => {
          setCanDismiss(true);
          textInputRef.current?.focus();
        }, 100);
      },
      close: handleClose,
    }));

    const handleSymbolChange = (drawingItem: DrawingItem) => {
      setTool(drawingItem);
      onChange(drawingItem);
      handleClose();
    };

    const handleFilterChange = (filter: string) => {
      if (filter !== selectedFilter) {
        setSelectedFilter(filter);
      }
    };

    const filteredData = useMemo(
      () =>
        tools.filter((item) => {
          if (selectedFilter === DrawingToolTags.all) {
            return true;
          }

          if (selectedFilter === DrawingToolTags.favorites) {
            return item.favorite;
          }

          return item.tags.find((tag) => tag === selectedFilter);
        }),
      [selectedFilter, tools],
    );

    const handleAddToFavorites = async (item: DrawingItem) => {
      const storageFavoriteItems =
        (await AsyncStorage.getItem(asyncStorageKeys.drawingToolsFavorite)) ?? '[]';

      const favoriteItems = JSON.parse(storageFavoriteItems) as DrawingItem[];

      AsyncStorage.setItem(
        asyncStorageKeys.drawingToolsFavorite,
        JSON.stringify([...favoriteItems, item]),
      );

      setTools((prevTools) => {
        return prevTools.map((tool) => {
          if (tool.name === item.name) {
            return {
              ...tool,
              favorite: true,
            };
          }

          return tool;
        });
      });
    };

    const handleRemoveFromFavorites = async (item: DrawingItem) => {
      const storageFavoriteItems =
        (await AsyncStorage.getItem(asyncStorageKeys.drawingToolsFavorite)) ?? '[]';

      const favoriteItems = JSON.parse(storageFavoriteItems) as DrawingItem[];

      AsyncStorage.setItem(
        asyncStorageKeys.drawingToolsFavorite,
        JSON.stringify(favoriteItems.filter((i) => i.name !== item.name)),
      );
      setTools((prevTools) => {
        return prevTools.map((tool) => {
          if (tool.name === item.name) {
            return {
              ...tool,
              favorite: false,
            };
          }

          return tool;
        });
      });
    };

    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;

    const onMore = () => {
      showActionSheetWithOptions(
        {
          options: ['Restore Default Parameters', 'Clear Existing Drawings', 'Cancel'],
          cancelButtonIndex,
          destructiveButtonIndex,
          userInterfaceStyle: theme.isDark ? 'dark' : 'light',
          containerStyle: {
            backgroundColor: theme.colors.background,
          },
          textStyle: {
            color: theme.colors.buttonText,
          },
        },
        (selectedIndex) => {
          switch (selectedIndex) {
            case 0:
              Alert.alert(
                'Do You Want To Restore Default Parameters?',
                'All your drawing parameters will be restored to defaults.',
                [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Restore',
                    onPress: () => {
                      if (tool) {
                        handleRestoreDrawingParams(tool);
                      }
                    },
                  },
                ],
              );

              break;

            case destructiveButtonIndex:
              Alert.alert(
                'Do You Want To Clear All Existing Drawings?',
                'All your drawing will be cleared on the current chart.',
                [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Clear',
                    onPress: () => {
                      ChartIQ.clearDrawing();
                    },
                  },
                ],
              );
              break;

            case cancelButtonIndex:
          }
        },
      );
    };

    const renderEmptyComponent = () => (
      <View style={styles.listEmptyContainer}>
        <View style={styles.space64} />
        <Image source={theme.isDark ? images.favoritesEmpty.dark : images.favoritesEmpty.light} />
        <View style={styles.space32} />
        <Text style={styles.emptyListTextTitle}>No Favorite Drawing Tools yet</Text>
        <View style={styles.space16} />
        <Text style={styles.emptyListTextDescription}>
          Swipe left to Add/Remove Drawing Tool to Favorites
        </Text>
      </View>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
      <Text style={styles.sectionHeaderText}>{title}</Text>
    );

    const renderSectionItem = ({
      item,
      index,
      section,
    }: {
      item: DrawingItem;
      index: number;
      section: { title: string; data: DrawingItem[] };
    }) => (
      <SwipableToolItem
        addToFavorites={handleAddToFavorites}
        item={item}
        onPress={handleSymbolChange}
        removeFromFavorites={handleRemoveFromFavorites}
        active={item.name === tool?.name}
        enabled={section.title !== 'Other tools'}
        listItemProps={{
          topBorder: index === 0,
          containerStyle: { backgroundColor: theme.colors.backgroundSecondary },
        }}
      />
    );

    const renderFlatListItem = ({ item, index }: { item: DrawingItem; index: number }) => (
      <SwipableToolItem
        addToFavorites={handleAddToFavorites}
        item={item}
        onPress={handleSymbolChange}
        removeFromFavorites={handleRemoveFromFavorites}
        active={item.name === tool?.name}
        listItemProps={{
          topBorder: index === 0,
          containerStyle: { backgroundColor: theme.colors.backgroundSecondary },
        }}
      />
    );

    return (
      <BottomSheet ref={bottomSheetRef} snapPoints={['90%']}>
        <SafeAreaView style={styles.flexOne}>
          <View style={styles.filterView}>
            <SelectorHeader
              title="Drawing Tools"
              leftActionTitle="Cancel"
              handleLeftAction={handleClose}
              RightActionIcon={
                <Pressable hitSlop={defaultHitSlop} onPress={onMore} style={styles.moreContainer}>
                  <icons.moreVertical fill={theme.colors.colorPrimary} style={styles.more} />
                </Pressable>
              }
            />
            <FilterSelector
              handleFilterChange={handleFilterChange}
              selectedFilter={selectedFilter}
              filters={drawingFilters}
            />
          </View>

          {selectedFilter === DrawingToolTags.all ? (
            <BottomSheetSectionList
              style={styles.flexOne}
              sections={[
                { title: 'Other tools', data: specialTools },
                { title: 'Main Tools', data: filteredData },
              ]}
              renderItem={renderSectionItem}
              keyExtractor={(item) => item.name}
              renderSectionHeader={renderSectionHeader}
              ListEmptyComponent={renderEmptyComponent}
              stickySectionHeadersEnabled={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.flatListBottomPadding}
              nestedScrollEnabled
            />
          ) : (
            <BottomSheetFlatList
              style={styles.flexOne}
              data={filteredData}
              renderItem={renderFlatListItem}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={renderEmptyComponent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.flatListBottomPadding}
              nestedScrollEnabled
            />
          )}
        </SafeAreaView>
      </BottomSheet>
    );
  },
);

DrawingToolSelector.displayName = 'DrawingToolSelector';

export default DrawingToolSelector;
