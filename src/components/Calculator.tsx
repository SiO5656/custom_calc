import React, { useState } from 'react';
import Button from './Button';
import { Divide, X, Minus, Plus, Delete, RotateCcw } from 'lucide-react';

interface CalculatorProps {
  input: string;
  setInput: (value: string) => void;
  result: string;
  setResult: (value: string) => void;
  calculate: (expression: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({
  input,
  setInput,
  result,
  setResult,
  calculate
}) => {
  const [isDegrees, setIsDegrees] = useState(true);

  const buttons = [
    [
      { id: 'leftParen', value: '(' },
      { id: 'rightParen', value: ')' },
      { id: 'power', value: '^' },
      { id: 'deg', value: 'DEG' }
    ],
    [
      { id: 'sin', value: 'sin' },
      { id: 'cos', value: 'cos' },
      { id: 'tan', value: 'tan' },
      { id: 'divide', value: '÷' }
    ],
    [
      { id: '7', value: '7' },
      { id: '8', value: '8' },
      { id: '9', value: '9' },
      { id: 'multiply', value: '×' }
    ],
    [
      { id: '4', value: '4' },
      { id: '5', value: '5' },
      { id: '6', value: '6' },
      { id: 'minus', value: '-' }
    ],
    [
      { id: '1', value: '1' },
      { id: '2', value: '2' },
      { id: '3', value: '3' },
      { id: 'plus', value: '+' }
    ],
    [
      { id: '0', value: '0' },
      { id: 'decimal', value: '.' },
      { id: 'equals', value: '=' },
      { id: 'clear', value: 'C' }
    ],
    [
      { id: 'pi', value: 'π' },
      { id: 'e', value: 'e' },
      { id: 'empty1', value: '' },
      { id: 'empty2', value: '' }
    ]
  ];

  const handleClick = (value: string) => {
    if (value === '') return;

    switch (value) {
      case 'C':
        setInput('');
        setResult('');
        break;
      case 'DEG':
        setIsDegrees(!isDegrees);
        break;
      case 'DEL':
        setInput(prev => prev.slice(0, -1));
        break;
      case '=':
        if (input) {
          let expression = input;
          if (isDegrees) {
            expression = expression
              .replace(/sin\(/g, 'sin(pi/180*')
              .replace(/cos\(/g, 'cos(pi/180*')
              .replace(/tan\(/g, 'tan(pi/180*');
          }
          calculate(expression);
        }
        break;
      case '×':
        setInput(prev => prev + '*');
        break;
      case '÷':
        setInput(prev => prev + '/');
        break;
      case 'π':
        setInput(prev => prev + 'pi');
        break;
      case 'e':
        setInput(prev => prev + 'e');
        break;
      case 'sin':
      case 'cos':
      case 'tan':
        setInput(prev => prev + value + '(');
        break;
      default:
        setInput(prev => prev + value);
    }
  };

  const getOperatorIcon = (op: string) => {
    switch (op) {
      case '÷':
        return <Divide className="w-4 h-4" />;
      case '×':
        return <X className="w-4 h-4" />;
      case '-':
        return <Minus className="w-4 h-4" />;
      case '+':
        return <Plus className="w-4 h-4" />;
      default:
        return op;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isDegrees ? 'DEG' : 'RAD'}
          </span>
          <button
            onClick={() => handleClick('DEL')}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
        <div className="text-right text-lg text-gray-600 dark:text-gray-300 min-h-[1.5rem] font-mono">
          {input || '0'}
        </div>
        <div className="text-right text-3xl font-bold text-slate-800 dark:text-white min-h-[2.5rem] font-mono">
          {result || '0'}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((btn) => (
              <Button
                key={btn.id}
                value={btn.value}
                onClick={() => handleClick(btn.value)}
                icon={getOperatorIcon(btn.value)}
                isDegrees={isDegrees}
                isActive={btn.value === 'DEG' && isDegrees}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {isDegrees ? '角度は度数法(360°)で計算' : '角度はラジアン(2π)で計算'}
      </div>
    </div>
  );
};

export default Calculator;