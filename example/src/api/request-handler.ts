import { ChartIQ, ChartIQDatafeedParams, ChartQuery } from 'react-native-chart-iq';

import { fetchDataFeedAsync, handleRetry } from '~/api';

const handleRequest = async (input: Omit<ChartIQDatafeedParams, 'id'>, session: string) => {
  const params = {
    identifier: input.symbol,
    enddate: input.end,
    startdate: input.start,
    interval: input.interval,
    period: input.period.toString(),
    extended: 1,
    session,
  } as ChartQuery;

  return await fetchDataFeedAsync(params);
};

type CallbackType = 'initial' | 'update' | 'paging';
type RequestConfig = Omit<ChartIQDatafeedParams, 'id'>;

export class RequestHandler {
  private session: string;
  private requestMap = new Map<string, RequestConfig & { type: CallbackType }>();
  constructor(session: string) {
    this.session = session;
  }
  private processing = false;

  add(id: string, config: RequestConfig, type: CallbackType) {
    this.requestMap.set(id, { ...config, type });
    return this;
  }

  remove(id: string) {
    this.requestMap.delete(id);
  }

  async handle(id: string) {
    const config = this.requestMap.get(id);

    if (!config) {
      return;
    }

    try {
      const response = await handleRequest(config, this.session);
      switch (config.type) {
        case 'initial':
          ChartIQ.setInitialData(response, id);
          break;
        case 'update':
          ChartIQ.setUpdateData(response, id);
          break;
        case 'paging':
          ChartIQ.setPagingData(response, id);
          break;
      }
      this.remove(id);
    } catch (e) {
      handleRetry(() => {
        this.handle(id);
        this.remove(id);
      });
    }
  }

  async processRequests() {
    if (this.processing) return;

    const keys = Array.from(this.requestMap.keys());
    for (const key of keys) {
      this.processing = true;
      await this.handle(key);
    }
    this.processing = false;
  }
}
