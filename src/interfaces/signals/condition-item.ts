import { Condition } from './condition';

export interface ConditionItem {
  condition: Condition;
  title: string;
  description: string;
  displayedColor: string;
  UUID: string;
}
