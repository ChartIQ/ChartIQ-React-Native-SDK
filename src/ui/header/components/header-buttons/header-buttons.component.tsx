import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { ActiveImage } from '../../../../assets/images/active-image';
import { useTheme } from '../../../../theme';

import { createStyles } from '../../header.styles';
import { HeaderItem } from '../../header.types';

const HeaderButtons: React.FC<{ items: HeaderItem[]; open: boolean; type: 'main' | 'others' }> = ({
  items,
  open,
  type,
}) => {
  const displayStyle = { display: open ? 'flex' : 'none' } as ViewStyle;
  const theme = useTheme();
  const styles = createStyles(theme);

  const iconProps = {
    width: 24,
    height: 24,
    fill: theme.colors.buttonText,
  };

  return (
    <View style={styles.row}>
      {items.map(
        ({ key, onPress, Icon, active, activeImageType, containerStyle, fill, stroke, style }) => (
          <View key={key} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={onPress}
              style={[
                containerStyle ? containerStyle : styles.chartStyleButton,
                type === 'others' ? displayStyle : {},
              ]}
            >
              {Icon ? (
                <Icon
                  {...iconProps}
                  fill={fill || theme.colors.buttonText}
                  stroke={stroke || undefined}
                  style={style}
                />
              ) : null}
              {activeImageType ? (
                <ActiveImage type={activeImageType} active={active ?? false} />
              ) : null}
            </TouchableOpacity>
          </View>
        ),
      )}
    </View>
  );
};

export default React.memo(HeaderButtons);
