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

/* 
end: "2023-04-27T09:41:16.052Z"
interval: "day"
meta: "{"func":"pullInitialData","symbol":"AAPL","period":1,"timeUnit":"day","start":"2022-12-20T23:00:00.000Z","end":"2023-04-27T09:41:16.052Z"}"
period: 1
start: "2022-12-20T23:00:00.000Z"
symbol: "AAPL"
*/

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
  meta: ChartIQDatafeedParamsMeta;
  start: string;
  end: string;
  interval: string;
}
