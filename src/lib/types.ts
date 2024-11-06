export interface HistoryItem {
  expression: string;
  result: string;
  unit?: string;
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
  resultUnit?: string; // 計算結果の単位
}