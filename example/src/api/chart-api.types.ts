export type ChartQuery = {
  identifier?: string;
  startdate?: string;
  enddate?: string;
  interval?: string;
  period?: string;
  extended?: string;
  session?: string;
};

export interface SymbolQueryParams {
  t: string;
  m: string;
  x: string;
  e?: string;
}

export interface SymbolParams {
  symbol: string;
  maxResult: string;
  fund: string;
  filter?: string;
}

export interface SymbolLookupResponse {
  http_status: number;
  payload: {
    symbols: string[];
  };
}

export interface ChartSymbol {
  symbol: string;
  description: string;
  funds: string[];
}

export interface ChartIQDatafeedParamsMeta {
  func: string;
  symbol: string;
  period: number;
  timeUnit: string;
  start: string;
  end: string;
}

export interface ChartIQDatafeedParams {
  symbol: string;
  period: number;
  meta?: ChartIQDatafeedParamsMeta;
  start: string;
  end: string;
  interval: string;
}
