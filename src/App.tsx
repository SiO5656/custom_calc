import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calculator as CalculatorIcon, History as HistoryIcon, X, BookOpen } from 'lucide-react';
import { evaluate } from 'mathjs';
import Calculator from './components/Calculator';
import History from './components/History';
import CustomFormulas from './components/CustomFormulas';
import { HistoryItem, CustomFormula } from './types';

function App() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showHistory, setShowHistory] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [formulas, setFormulas] = useState<CustomFormula[]>([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const calculate = (expression: string) => {
    try {
      const calculatedResult = evaluate(expression);
      const formattedResult = Number.isInteger(calculatedResult) 
        ? calculatedResult.toString()
        : Number(calculatedResult.toFixed(8)).toString();
      setResult(formattedResult);
      setHistory(prev => [...prev, {
        expression,
        result: formattedResult,
        timestamp: new Date()
      }]);
    } catch (error) {
      setResult('Error');
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
  };

  const handleUseFormula = (formula: CustomFormula) => {
    setInput(formula.formula);
    setShowFormulas(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">関数電卓</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFormulas(!showFormulas)}
              className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-700/50 transition-colors"
              title="カスタム数式"
            >
              <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-700/50 transition-colors"
              title="履歴"
            >
              <HistoryIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-700/50 transition-colors"
              title={isDark ? 'ライトモード' : 'ダークモード'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-slate-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <Calculator
            input={input}
            setInput={setInput}
            result={result}
            setResult={setResult}
            calculate={calculate}
          />

          {showHistory && (
            <div className="absolute top-0 right-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-10 border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">履歴</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <History
                history={history}
                setInput={setInput}
                setResult={setResult}
                setShowHistory={setShowHistory}
              />
            </div>
          )}

          {showFormulas && (
            <div className="absolute top-0 right-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-10 border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">カスタム数式</h2>
                <button
                  onClick={() => setShowFormulas(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <CustomFormulas
                formulas={formulas}
                onSaveFormula={handleSaveFormula}
                onDeleteFormula={handleDeleteFormula}
                onUseFormula={handleUseFormula}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;