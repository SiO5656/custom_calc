"use client";

import React from "react";
import { Divide, X, Minus, Plus, Delete } from "lucide-react";

interface ButtonProps {
  input: string;
  setInput: (value: string) => void;
  result: string;
  setResult: (value: string) => void;
  calculate: (expression: string) => void;
  isDegrees: boolean;
  setIsDegrees: (value: boolean) => void;
}

export default function Button({
  input,
  setInput,
  result,
  setResult,
  calculate,
  isDegrees,
  setIsDegrees
}: ButtonProps) {
  const buttons = [
    [
      { id: "leftParen", value: "(" },
      { id: "rightParen", value: ")" },
      { id: "power", value: "^" },
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
      { id: "empty1", value: "" },
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
        return <Divide className="w-4 h-4" />;
      case "×":
        return <X className="w-4 h-4" />;
      case "-":
        return <Minus className="w-4 h-4" />;
      case "+":
        return <Plus className="w-4 h-4" />;
      default:
        return op;
    }
  };

  const getButtonStyle = (value: string, isActive?: boolean) => {
    switch (value) {
      case "=":
        return "bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30";
      case "C":
      case "DEL":
        return "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30";
      case "+":
      case "-":
      case "×":
      case "÷":
      case "^":
        return "bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 hover:from-indigo-200 hover:to-indigo-300 dark:hover:from-indigo-800 dark:hover:to-indigo-700 text-indigo-600 dark:text-indigo-300 shadow-lg shadow-indigo-500/10";
      case "sin":
      case "cos":
      case "tan":
      case "(":
      case ")":
      case "π":
      case "e":
        return "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-700 dark:text-slate-200 shadow-lg shadow-gray-500/10";
      case "DEG":
        return isActive
          ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
          : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-lg shadow-gray-500/10";
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-800 dark:text-white shadow-lg shadow-gray-500/10";
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {buttons.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleClick(btn.value)}
              className={`p-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${getButtonStyle(
                btn.value,
                btn.value === "DEG" && isDegrees
              )}`}
            >
              {getOperatorIcon(btn.value)}
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}