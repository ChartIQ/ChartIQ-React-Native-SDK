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

export type SignalOperatorListItem = {
  key: SignalOperator;
  description: string;
  value: string;
};

export const SignalOperatorValues: Array<SignalOperatorListItem> = [
  {
    description: 'Greater Than',
    key: SignalOperator.GREATER_THAN,
    value: '>',
  },
  {
    description: 'Less Than',
    key: SignalOperator.LESS_THAN,
    value: '<',
  },
  {
    description: 'Equal To',
    key: SignalOperator.EQUAL_TO,
    value: '=',
  },
  {
    description: 'Crosses',
    key: SignalOperator.CROSSES,
    value: 'x',
  },
  {
    description: 'Crosses Above',
    key: SignalOperator.CROSSES_ABOVE,
    value: 'x+',
  },
  {
    description: 'Crosses Below',
    key: SignalOperator.CROSSES_BELOW,
    value: 'x-',
  },
  {
    description: 'Turns Up',
    key: SignalOperator.TURNS_UP,
    value: 't+',
  },
  {
    description: 'Turns Down',
    key: SignalOperator.TURNS_DOWN,
    value: 't-',
  },
  {
    description: 'Increases',
    key: SignalOperator.INCREASES,
    value: '>p',
  },

  {
    description: 'Decreases',
    key: SignalOperator.DECREASES,
    value: '<p',
  },
  {
    description: 'Does Not Change',
    key: SignalOperator.DOES_NOT_CHANGE,
    value: 'nc',
  },
];
