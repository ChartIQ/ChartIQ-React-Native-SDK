import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { QuoteFeedEvent } from 'react-native-chart-iq';
import uuid from 'react-native-uuid';

import { RequestHandler } from '~/api';
import { asyncStorageKeys } from '~/constants/async-storage-keys';

export const usePullData = () => {
  const requestHandler = React.useRef<RequestHandler>(new RequestHandler());

  useEffect(() => {
    const interval = setInterval(() => {
      requestHandler.current.processRequests();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem(asyncStorageKeys.session)
      .then((session) => {
        if (!session) {
          const newSession = uuid.v4();
          AsyncStorage.setItem(asyncStorageKeys.session, newSession as string);
          requestHandler.current.initSession(newSession as string);
          return;
        }
        requestHandler.current.initSession(session as string);
      })
      .catch(() => {
        const newSession = uuid.v4();
        AsyncStorage.setItem(asyncStorageKeys.session, newSession as string);
        requestHandler.current.initSession(newSession as string);
      });
  }, []);
  const onPullInitialData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    // console.log('onPullInitialData', id);
    requestHandler.current.add(id, params, 'initial');
  };

  const onPullUpdateData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    // console.log('onPullUpdateData', id);
    requestHandler.current.add(id, params, 'update');
  };

  const onPullPagingData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    // console.log('onPullPagingData', id);
    requestHandler.current.add(id, params, 'paging');
  };

  return {
    onPullInitialData,
    onPullUpdateData,
    onPullPagingData,
  };
};
