import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChartIQ, QuoteFeedEvent } from '@chartiq/react-native-chartiq';
import uuid from 'react-native-uuid';
import { RequestHandler } from '../../api';
import { asyncStorageKeys } from '../../constants/async-storage-keys';
import { useEffect, useRef } from 'react';
import { intervalVal, runOnItervalChange } from '../../constants/Constants';

export const usePullData = (isFocused: any, interval: any) => {
  const requestHandler = useRef<RequestHandler>(new RequestHandler());
  let intervalApi: any = useRef();

  // useEffect(() => {
  //   console.log('==========', JSON.stringify(interval))
  //   if (isFocused) {
  //     setTimeout(async () => {
  //       const periodicity = await ChartIQ.getPeriodicity();
  //       console.log("api hitted === " + JSON.stringify(periodicity));
  //       clearInterval(intervalVal.current);
  //       runOnItervalChange(periodicity, () => {
  //         console.log("api hitted 2");
  //         setTimeout(() => {
  //           requestHandler.current.processRequests();
  //         }, 2000);
  //       });
  //     }, 4000);
  //   }
  // }, [JSON.stringify(interval), isFocused]);

  // UserEffect for Interval
  useEffect(() => {
    if (isFocused) {
      const interval = setInterval(() => {

        requestHandler.current.processRequests();
      }, 1500);
      intervalApi.current = interval;


      // setTimeout(() => {
      //   requestHandler.current.processRequests();
      // }, 500);
      // setTimeout(() => {
      //   requestHandler.current.processRequests();
      // }, 1500);

    } else {
      // try {
      //   if (intervalApi.current) {
      //     clearInterval(intervalApi.current)
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    }
  }, [isFocused]);

  // UseEffect for Session
  useEffect(() => {
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


  // Getting Inital Data from the Server
  const onPullInitialData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {

    requestHandler.current.add(id, params, 'initial');
  };

  // Load Updated data for new data
  const onPullUpdateData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    requestHandler.current.add(id, params, 'update');
  };
  // Pagging Data Historical data
  const onPullPagingData = async ({
    nativeEvent: {
      quoteFeedParam: { id, ...params },
    },
  }: QuoteFeedEvent) => {
    // console.log('onPullPagingData', id, ' params::', params);
    requestHandler.current.add(id, params, 'paging');
  };
  // 
  return {
    onPullInitialData,
    onPullUpdateData,
    onPullPagingData,
    intervalApi
  };
};
