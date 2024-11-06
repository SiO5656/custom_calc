"use client";

import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import { Calculator as CalculatorIcon, History as HistoryIcon, BookOpen, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { CalcButton } from "./calc-button";
import { History } from "./history";
import { CustomFormulas } from "./custom-formulas";
import type { HistoryItem, CustomFormula } from "@/lib/types";

// LocalStorageのキー
const VARIABLE_VALUES_KEY = "calculator_variable_values";

export default function Calculator() {
  const [showHistory, setShowHistory] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [formulas, setFormulas] = useState<CustomFormula[]>([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [resultUnit, setResultUnit] = useState<string>("");
  const [isDegrees, setIsDegrees] = useState(true);
  const [variableValues, setVariableValues] = useState<Record<string, Record<string, string>>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(VARIABLE_VALUES_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // 変数の値が変更されたときにLocalStorageに保存
  useEffect(() => {
    localStorage.setItem(VARIABLE_VALUES_KEY, JSON.stringify(variableValues));
  }, [variableValues]);

  const calculate = (expression: string, customFormula?: CustomFormula) => {
    try {
      const calculatedResult = evaluate(expression);
      const formattedResult = Number.isInteger(calculatedResult) 
        ? calculatedResult.toString()
        : Number(calculatedResult.toFixed(8)).toString();
      setResult(formattedResult);
      if (customFormula?.resultUnit) {
        setResultUnit(customFormula.resultUnit);
      }
      setHistory(prev => [...prev, {
        expression: input || expression,
        result: formattedResult,
        unit: customFormula?.resultUnit,
        timestamp: new Date()
      }]);
      setShowFormulas(false);
      setSelectedFormulaId(null);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult("Error");
    }
  };

  const handleSaveFormula = (formula: CustomFormula) => {
    setFormulas(prev => {
      const index = prev.findIndex(f => f.id === formula.id);
      if (index >= 0) {
        const newFormulas = [...prev];
        newFormulas[index] = formula;
        return newFormulas;
      }
      return [...prev, formula];
    });
  };

  const handleDeleteFormula = (id: string) => {
    setFormulas(prev => prev.filter(f => f.id !== id));
    // 数式が削除されたら、その変数の値も削除
    setVariableValues(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (selectedFormulaId === id) {
      setSelectedFormulaId(null);
    }
  };

  const handleUseFormula = (formula: CustomFormula) => {
    setInput(formula.formula);
    calculate(formula.formula, formula);
  };

  const handleVariableValueChange = (formulaId: string, variableId: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [formulaId]: {
        ...(prev[formulaId] || {}),
        [variableId]: value
      }
    }));
  };

  const handleSelectFormula = (formulaId: string) => {
    setSelectedFormulaId(formulaId);
  };

  const handleBackToFormulas = () => {
    setSelectedFormulaId(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">関数電卓</h1>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-700/50 transition-colors"
            title="カスタム数式"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-700/50 transition-colors"
            title="履歴"
          >
            <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="relative">
        <CalcButton
          input={input}
          setInput={setInput}
          result={result}
          setResult={setResult}
          calculate={calculate}
          isDegrees={isDegrees}
          setIsDegrees={setIsDegrees}
          resultUnit={resultUnit}
        />

        {showHistory && (
          <div className="absolute top-0 right-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl p-3 sm:p-4 z-10 border border-gray-200 dark:border-slate-700">
            <History
              history={history}
              setInput={setInput}
              setResult={setResult}
              setShowHistory={setShowHistory}
            />
          </div>
        )}

        {showFormulas && (
          <div className="absolute top-0 right-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl p-3 sm:p-4 z-10 border border-gray-200 dark:border-slate-700">
            {selectedFormulaId ? (
              <div>
                <button
                  onClick={handleBackToFormulas}
                  className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </button>
                <CustomFormulas
                  formulas={formulas.filter(f => f.id === selectedFormulaId)}
                  onSaveFormula={handleSaveFormula}
                  onDeleteFormula={handleDeleteFormula}
                  onUseFormula={handleUseFormula}
                  variableValues={variableValues}
                  onVariableValueChange={handleVariableValueChange}
                  onSelectFormula={handleSelectFormula}
                  selectedFormulaId={selectedFormulaId}
                />
              </div>
            ) : (
              <CustomFormulas
                formulas={formulas}
                onSaveFormula={handleSaveFormula}
                onDeleteFormula={handleDeleteFormula}
                onUseFormula={handleUseFormula}
                variableValues={variableValues}
                onVariableValueChange={handleVariableValueChange}
                onSelectFormula={handleSelectFormula}
                selectedFormulaId={selectedFormulaId}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}