import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { getStudyParameters } from 'react-native-chart-iq-wrapper';

import { StudyParameterType } from '~/model/study';
import { StudiesStack, StudiesStackParamList } from '~/shared/navigation.types';
import { ListItem } from '~/ui/list-item';

export interface StudyParametersProps
  extends NativeStackScreenProps<StudiesStackParamList, StudiesStack.StudyParameters> {}

interface StudyParameter {
  defaultValue: number | string;
  heading: string;
  name: string;
  parameterType: StudyParameterType;
  value: number | string;
}

const StudyParameters: React.FC<StudyParametersProps> = ({
  route: {
    params: { study },
  },
}) => {
  const [params, setParams] = useState<Array<StudyParameter>>([]);

  const get = useCallback(async () => {
    const asd = await getStudyParameters(study, 'Inputs');
    setParams(asd);
  }, [study]);

  useEffect(() => {
    get();
  }, [get]);

  console.log('Study params', params);

  return <FlatList data={params} renderItem={({ item }) => <ListItem title={item.name} />} />;
};

export default StudyParameters;
