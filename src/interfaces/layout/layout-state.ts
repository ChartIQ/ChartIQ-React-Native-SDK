interface SymbolState {
  symbol: string;
  parameters?: SymbolParameters;
}

interface SymbolParameters {
  color: string;
}

export interface LayoutState {
  interval: string;
  periodicity: number;
  timeUnit: string;
  chartType: string;
  symbols: SymbolState[];
}
