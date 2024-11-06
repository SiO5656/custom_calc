import React, { ReactNode } from 'react';

interface ButtonProps {
  value: string;
  onClick: () => void;
  icon?: ReactNode;
  isDegrees?: boolean;
  isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({ value, onClick, icon, isActive }) => {
  const getButtonStyle = () => {
    switch (value) {
      case '=':
        return 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30';
      case 'C':
      case 'DEL':
        return 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30';
      case '+':
      case '-':
      case '×':
      case '÷':
      case '^':
        return 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 hover:from-indigo-200 hover:to-indigo-300 dark:hover:from-indigo-800 dark:hover:to-indigo-700 text-indigo-600 dark:text-indigo-300 shadow-lg shadow-indigo-500/10';
      case 'sin':
      case 'cos':
      case 'tan':
      case '(':
      case ')':
      case 'π':
      case 'e':
        return 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-700 dark:text-slate-200 shadow-lg shadow-gray-500/10';
      case 'DEG':
        return isActive
          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
          : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-lg shadow-gray-500/10';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-800 dark:text-white shadow-lg shadow-gray-500/10';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${getButtonStyle()}`}
    >
      {icon || value}
    </button>
  );
};

export default Button;