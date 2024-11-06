"use client";

import React from "react";
import { X } from "lucide-react";
import type { HistoryItem } from "@/lib/types";

interface HistoryProps {
  history: HistoryItem[];
  setInput: (value: string) => void;
  setResult: (value: string) => void;
  setShowHistory: (value: boolean) => void;
}

export function History({
  history,
  setInput,
  setResult,
  setShowHistory
}: HistoryProps) {
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">履歴</h2>
        <button
          onClick={() => setShowHistory(false)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
      <div className="space-y-2 overflow-y-auto max-h-[400px]">
        {history.slice().reverse().map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="p-3 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer"
          >
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {item.expression}
            </div>
            <div className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              {item.result}
              {item.unit && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {item.unit}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}