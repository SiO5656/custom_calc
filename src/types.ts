export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

export interface Variable {
  id: string;
  name: string;
  value: string;
  unit: string;
}

export interface CustomFormula {
  id: string;
  name: string;
  variables: Variable[];
  formula: string;
}