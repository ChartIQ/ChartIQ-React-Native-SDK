import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import {
  ChartQuery,
  ChartSymbol,
  OHLCParams,
  SymbolLookupResponse,
  SymbolParams,
  SymbolQueryParams,
} from 'react-native-chart-iq';

import { HOST_SIMULATOR, HOST_SYMBOLS } from '../constants/network.constants';

const customAxiosApi: AxiosInstance = axios.create({});

interface RetryConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

const globalConfig: RetryConfig = {
  retry: 3,
  retryDelay: 1000,
};

customAxiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;

    if (!config || !config.retry) {
      return Promise.reject(`Retry error: ${error}`);
    }
    config.retry -= 1;
    const delayRetryRequest = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1000);
    });
    return delayRetryRequest.then(() => customAxiosApi(config));
  },
);

export const fetchDataFeedAsync = async (input: ChartQuery) => {
  const { data } = await customAxiosApi.get<OHLCParams[]>(`${HOST_SIMULATOR}/datafeed`, {
    params: {
      ...input,
      identifier: input.identifier,
    },
    ...globalConfig,
  });

  return data;
};

export const fetchSymbolsAsync = async (input: SymbolParams) => {
  const { data } = await customAxiosApi.get<SymbolLookupResponse>(
    `${HOST_SYMBOLS}/chiq.symbolserver.SymbolLookup.service`,
    {
      params: {
        t: input.symbol,
        m: input.maxResult,
        x: input.fund,
        e: input.filter,
      } satisfies SymbolQueryParams,
      ...globalConfig,
    },
  );

  if (data?.http_status === 200 && data.payload.symbols.length > 0) {
    return data.payload.symbols.map((item) => {
      const [symbol, description, ...funds] = item.split('|');
      return { symbol, description, funds };
    }) as ChartSymbol[];
  }

  return [];
};

export const handleRetry = (onRetry: () => void) => {
  Alert.alert('Something went wrong', 'The internet connection appears to be offline.', [
    {
      text: 'Cancel',
    },
    {
      text: 'Retry',
      onPress: () => {
        onRetry();
      },
    },
  ]);
};
