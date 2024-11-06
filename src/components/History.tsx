import React from 'react';
import { HistoryItem } from '../types';

interface HistoryProps {
  history: HistoryItem[];
  setInput: (value: string) => void;
  setResult: (value: string) => void;
  setShowHistory: (value: boolean) => void;
}

const History: React.FC<HistoryProps> = ({ history, setInput, setResult, setShowHistory }) => {
  const handleClick = (item: HistoryItem) => {
    setInput(item.expression);
    setResult(item.result);
    setShowHistory(false);
  };

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        履歴がありません
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      {history.slice().reverse().map((item, index) => (
        <div
          key={index}
          onClick={() => handleClick(item)}
          className="p-3 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer"
        >
          <div className="text-sm text-gray-600 dark:text-gray-300">{item.expression}</div>
          <div className="text-lg font-semibold text-slate-800 dark:text-white">{item.result}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(item.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;