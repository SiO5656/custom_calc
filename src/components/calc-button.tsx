"use client";

import React from "react";
import { Divide, X, Minus, Plus, Delete } from "lucide-react";

interface CalcButtonProps {
  input: string;
  setInput: (value: string) => void;
  result: string;
  setResult: (value: string) => void;
  calculate: (expression: string) => void;
  isDegrees: boolean;
  setIsDegrees: (value: boolean) => void;
  resultUnit?: string;
}

export function CalcButton({
  input,
  setInput,
  result,
  setResult,
  calculate,
  isDegrees,
  setIsDegrees,
  resultUnit
}: CalcButtonProps) {
  const buttons = [
    [
      { id: "leftParen", value: "(" },
      { id: "rightParen", value: ")" },
      { id: "sqrt", value: "sqrt" },
      { id: "deg", value: "DEG" }
    ],
    [
      { id: "sin", value: "sin" },
      { id: "cos", value: "cos" },
      { id: "tan", value: "tan" },
      { id: "divide", value: "÷" }
    ],
    [
      { id: "7", value: "7" },
      { id: "8", value: "8" },
      { id: "9", value: "9" },
      { id: "multiply", value: "×" }
    ],
    [
      { id: "4", value: "4" },
      { id: "5", value: "5" },
      { id: "6", value: "6" },
      { id: "minus", value: "-" }
    ],
    [
      { id: "1", value: "1" },
      { id: "2", value: "2" },
      { id: "3", value: "3" },
      { id: "plus", value: "+" }
    ],
    [
      { id: "0", value: "0" },
      { id: "decimal", value: "." },
      { id: "equals", value: "=" },
      { id: "clear", value: "C" }
    ],
    [
      { id: "pi", value: "π" },
      { id: "e", value: "e" },
      { id: "power", value: "^" },
      { id: "empty2", value: "" }
    ]
  ];

  const handleClick = (value: string) => {
    if (value === "") return;

    switch (value) {
      case "C":
        setInput("");
        setResult("");
        break;
      case "DEG":
        setIsDegrees(!isDegrees);
        break;
      case "DEL":
        setInput(prev => prev.slice(0, -1));
        break;
      case "=":
        if (input) {
          let expression = input;
          expression = expression.replace(/sqrt\s*(\d+(\.\d+)?|\([^)]+\))/g, "sqrt($1)");
          if (isDegrees) {
            expression = expression
              .replace(/sin\(/g, "sin(pi/180*")
              .replace(/cos\(/g, "cos(pi/180*")
              .replace(/tan\(/g, "tan(pi/180*");
          }
          calculate(expression);
        }
        break;
      case "×":
        setInput(prev => prev + "*");
        break;
      case "÷":
        setInput(prev => prev + "/");
        break;
      case "π":
        setInput(prev => prev + "pi");
        break;
      case "e":
        setInput(prev => prev + "e");
        break;
      case "sqrt":
        setInput(prev => prev + "sqrt");
        break;
      case "sin":
      case "cos":
      case "tan":
        setInput(prev => prev + value + "(");
        break;
      default:
        setInput(prev => prev + value);
    }
  };

  const getOperatorIcon = (op: string) => {
    switch (op) {
      case "÷":
        return <div className="flex justify-center w-full"><Divide className="w-4 h-4" /></div>;
      case "×":
        return <div className="flex justify-center w-full"><X className="w-4 h-4" /></div>;
      case "-":
        return <div className="flex justify-center w-full"><Minus className="w-4 h-4" /></div>;
      case "+":
        return <div className="flex justify-center w-full"><Plus className="w-4 h-4" /></div>;
      case "sqrt":
        return <div className="flex justify-center w-full text-sm">sqrt</div>;
      default:
        return op;
    }
  };

  const getButtonStyle = (value: string, isActive?: boolean) => {
    const baseStyle = "p-2 sm:p-3 text-sm sm:text-base rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95";
    
    switch (value) {
      case "=":
        return `${baseStyle} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30`;
      case "C":
      case "DEL":
        return `${baseStyle} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30`;
      case "+":
      case "-":
      case "×":
      case "÷":
      case "^":
      case "sqrt":
        return `${baseStyle} bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 hover:from-indigo-200 hover:to-indigo-300 dark:hover:from-indigo-800 dark:hover:to-indigo-700 text-indigo-600 dark:text-indigo-300 shadow-lg shadow-indigo-500/10`;
      case "sin":
      case "cos":
      case "tan":
      case "(":
      case ")":
      case "π":
      case "e":
        return `${baseStyle} bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-700 dark:text-slate-200 shadow-lg shadow-gray-500/10`;
      case "DEG":
        return isActive
          ? `${baseStyle} bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30`
          : `${baseStyle} bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-lg shadow-gray-500/10`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-800 dark:text-white shadow-lg shadow-gray-500/10`;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 sm:p-6">
      <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
            {isDegrees ? "DEG" : "RAD"}
          </span>
          <button
            onClick={() => handleClick("DEL")}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="text-right text-base sm:text-lg text-gray-600 dark:text-gray-300 min-h-[1.5rem] font-mono break-all">
          {input || "0"}
        </div>
        <div className="text-right text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white min-h-[2.5rem] font-mono break-all flex justify-end items-baseline gap-2">
          <span>{result || "0"}</span>
          {resultUnit && (
            <span className="text-base sm:text-lg font-normal text-gray-500 dark:text-gray-400">
              {resultUnit}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {buttons.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleClick(btn.value)}
                className={getButtonStyle(
                  btn.value,
                  btn.value === "DEG" && isDegrees
                )}
              >
                {getOperatorIcon(btn.value)}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {isDegrees ? "角度は度数法(360°)で計算" : "角度はラジアン(2π)で計算"}
      </div>
    </div>
  );
}