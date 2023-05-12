import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getStudyList } from 'react-native-chart-iq-wrapper';
import { FlatList } from 'react-native-gesture-handler';
import { Study } from '~/model/study';
import { Theme, useTheme } from '~/theme';
import { ListItem } from '~/ui/list-item';

const AddStudies: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [studies, setStudies] = useState<Study[]>([]);

  useEffect(() => {
    getStudyList().then((studies) => {
      setStudies(studies);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={studies}
        renderItem={({ item: { name } }) => <ListItem title={name} />}
        keyExtractor={({ name }) => name}
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

export default AddStudies;
