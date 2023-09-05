import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ChartQuery,
  ChartSymbol,
  OHLCParams,
  SymbolLookupResponse,
  SymbolParams,
  SymbolQueryParams,
} from 'react-native-chart-iq';

import { HOST_SIMULATOR, HOST_SYMBOLS } from '../constants/network.constants';

const customAxiosApi: AxiosInstance = axios.create({
  timeout: 5000,
});

interface RetryConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

const globalConfig: RetryConfig = {
  retry: 3,
  retryDelay: 1000,
  timeout: 5000,
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
    params: input,
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
