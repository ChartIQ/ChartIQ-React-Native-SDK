export enum SignalOperator {
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  EQUAL_TO = 'equal_to',
  CROSSES = 'crosses',
  CROSSES_ABOVE = 'crosses_above',
  CROSSES_BELOW = 'crosses_below',
  TURNS_UP = 'turns_up',
  TURNS_DOWN = 'turns_down',
  INCREASES = 'increases',
  DECREASES = 'decreases',
  DOES_NOT_CHANGE = 'does_not_change',
}

export const SignalOperatorValues = {
  [SignalOperator.GREATER_THAN]: '>',
  [SignalOperator.LESS_THAN]: '<',
  [SignalOperator.EQUAL_TO]: '=',
  [SignalOperator.CROSSES]: 'x',
  [SignalOperator.CROSSES_ABOVE]: 'x+',
  [SignalOperator.CROSSES_BELOW]: 'x-',
  [SignalOperator.TURNS_UP]: 't+',
  [SignalOperator.TURNS_DOWN]: 't-',
  [SignalOperator.INCREASES]: '>p',
  [SignalOperator.DECREASES]: '<p',
  [SignalOperator.DOES_NOT_CHANGE]: '=p',
};
