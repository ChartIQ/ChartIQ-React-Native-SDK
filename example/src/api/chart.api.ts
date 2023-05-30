import axios from 'axios';

import { HOST_SIMULATOR, HOST_SYMBOLS } from '../constants/network.constants';
import type { OHLCParams } from '../model/ohlc-param';

import type {
  ChartQuery,
  ChartSymbol,
  SymbolLookupResponse,
  SymbolParams,
  SymbolQueryParams,
} from './chart-api.types';

export const fetchDataFeedAsync = async (input: ChartQuery) => {
  const { data } = await axios.get<OHLCParams[]>(`${HOST_SIMULATOR}/datafeed`, {
    params: input,
  });

  return data;
};

export const fetchSymbolsAsync = async (input: SymbolParams) => {
  const { data } = await axios.get<SymbolLookupResponse>(
    `${HOST_SYMBOLS}/chiq.symbolserver.SymbolLookup.service`,
    {
      params: {
        t: input.symbol,
        m: input.maxResult,
        x: input.fund,
        e: input.filter,
      } satisfies SymbolQueryParams,
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
