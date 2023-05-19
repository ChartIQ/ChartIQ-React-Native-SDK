import { Study } from '../study';

import { Condition } from './condition';

export enum SignalJoiner {
  AND = 'AND',
  OR = 'OR',
}

export interface Signal {
  uniqueId: string;
  name: string;
  conditions: Condition[];
  joiner: SignalJoiner;
  disabled: boolean;
  study: Study;
}
