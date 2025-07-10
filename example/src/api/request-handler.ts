import { Alert } from 'react-native';
import { ChartIQ, ChartIQDatafeedParams, ChartQuery } from 'react-native-chartiq';

import { fetchDataFeedAsync } from '~/api';

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
  private session: string | null = null;
  private requestMap = new Map<string, RequestConfig & { type: CallbackType }>();
  private error = false;

  private processing = false;

  public initSession: (session: string) => void = (session) => {
    this.session = session;
  };

  public add(id: string, config: RequestConfig, type: CallbackType) {
    this.requestMap.set(id, { ...config, type });
    return this;
  }

  private remove(id: string) {
    this.requestMap.delete(id);
  }

  public handleRetry(onRetry: () => void) {
    this.error = true;

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
  }

  private async handle(id: string) {
    const config = this.requestMap.get(id);

    if (!config || !this.session) {
      return;
    }

    try {
      const response = await handleRequest(config, this.session || '');
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
      if (this.error) {
        return;
      }

      this.handleRetry(() => {
        this.error = false;
        this.handle(id);
      });
    }
  }

  async processRequests() {
    if (this.processing || this.requestMap.size === 0) {
      return;
    }

    const keys = Array.from(this.requestMap.keys());

    for (const key of keys) {
      this.processing = true;
      await this.handle(key);
    }

    this.processing = false;
  }
}
