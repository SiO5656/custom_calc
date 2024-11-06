"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Edit2, Variable as VariableIcon, AlertCircle } from "lucide-react";
import type { CustomFormula, Variable } from "@/lib/types";

interface CustomFormulasProps {
  formulas: CustomFormula[];
  onSaveFormula: (formula: CustomFormula) => void;
  onDeleteFormula: (id: string) => void;
  onUseFormula: (formula: CustomFormula) => void;
  variableValues: Record<string, Record<string, string>>;
  onVariableValueChange: (formulaId: string, variableId: string, value: string) => void;
  onSelectFormula: (formulaId: string) => void;
  selectedFormulaId: string | null;
}

const createVariable = (): Variable => ({
  id: crypto.randomUUID(),
  name: "",
  value: "",
  unit: ""
});

const emptyFormula: CustomFormula = {
  id: "",
  name: "",
  variables: [createVariable()],
  formula: "",
  resultUnit: ""
};

// Helper function to check if all variables in a formula have values
const areAllVariablesFilled = (
  formula: CustomFormula,
  variableValues: Record<string, Record<string, string>>
): boolean => {
  return formula.variables.every(variable => {
    const value = variableValues[formula.id]?.[variable.id];
    return value !== undefined && value.trim() !== "";
  });
};

// Helper function to get button style based on variable state
const getUseButtonStyle = (
  formula: CustomFormula,
  variableValues: Record<string, Record<string, string>>
): string => {
  const baseStyle = "px-3 py-1 rounded-md text-sm transition-colors duration-200";
  return areAllVariablesFilled(formula, variableValues)
    ? `${baseStyle} bg-indigo-500 text-white hover:bg-indigo-600`
    : `${baseStyle} bg-gray-300 text-gray-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed`;
};

export function CustomFormulas({
  formulas,
  onSaveFormula,
  onDeleteFormula,
  onUseFormula,
  variableValues,
  onVariableValueChange,
  onSelectFormula,
  selectedFormulaId
}: CustomFormulasProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFormula, setNewFormula] = useState<CustomFormula>(emptyFormula);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddVariable = () => {
    setNewFormula(prev => ({
      ...prev,
      variables: [...prev.variables, createVariable()]
    }));
  };

  const handleRemoveVariable = (id: string) => {
    setNewFormula(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v.id !== id)
    }));
  };

  const handleSave = () => {
    if (!newFormula.name || !newFormula.formula) return;
    
    const formulaToSave = {
      ...newFormula,
      id: newFormula.id || crypto.randomUUID()
    };
    
    onSaveFormula(formulaToSave);
    setIsAdding(false);
    setEditingId(null);
    setNewFormula(emptyFormula);
  };

  const handleEdit = (formula: CustomFormula) => {
    setNewFormula(formula);
    setEditingId(formula.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewFormula(emptyFormula);
  };

  const handleUseWithValues = (formula: CustomFormula) => {
    if (!areAllVariablesFilled(formula, variableValues)) return;

    const values = variableValues[formula.id] || {};
    let expression = formula.formula;
    
    // Sort variables by length (longest first) to avoid partial replacements
    const sortedVariables = [...formula.variables].sort(
      (a, b) => b.name.length - a.name.length
    );
    
    sortedVariables.forEach(variable => {
      const value = values[variable.id] || "0";
      const regex = new RegExp(variable.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      expression = expression.replace(regex, `(${value})`);
    });
    
    onUseFormula({ ...formula, formula: expression });
  };

  const handleFormulaClick = (formula: CustomFormula) => {
    if (!selectedFormulaId) {
      onSelectFormula(formula.id);
      setExpandedId(formula.id);
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId) {
      onDeleteFormula(deletingId);
      setDeletingId(null);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          {selectedFormulaId ? formulas.find(f => f.id === selectedFormulaId)?.name : "カスタム数式"}
        </h2>
        {!isAdding && !selectedFormulaId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 space-y-4">
          <input
            type="text"
            placeholder="数式の名前"
            value={newFormula.name}
            onChange={e => setNewFormula(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          
          <div className="space-y-2">
            {newFormula.variables.map((variable) => (
              <div key={variable.id} className="flex gap-2">
                <input
                  placeholder="変数名"
                  value={variable.name}
                  onChange={e => {
                    const newVariables = newFormula.variables.map(v =>
                      v.id === variable.id ? { ...v, name: e.target.value } : v
                    );
                    setNewFormula(prev => ({ ...prev, variables: newVariables }));
                  }}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  placeholder="単位"
                  value={variable.unit}
                  onChange={e => {
                    const newVariables = newFormula.variables.map(v =>
                      v.id === variable.id ? { ...v, unit: e.target.value } : v
                    );
                    setNewFormula(prev => ({ ...prev, variables: newVariables }));
                  }}
                  className="w-24 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                  onClick={() => handleRemoveVariable(variable.id)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddVariable}
            className="text-indigo-500 hover:text-indigo-600 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            変数を追加
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              数式を入力
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newFormula.variables.map(variable => (
                <button
                  key={variable.id}
                  onClick={() => setNewFormula(prev => ({
                    ...prev,
                    formula: prev.formula + (prev.formula && " ") + variable.name
                  }))}
                  className="px-2 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800/30"
                >
                  {variable.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="数式 (例: a * b)"
              value={newFormula.formula}
              onChange={e => setNewFormula(prev => ({ ...prev, formula: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              計算結果の単位
            </label>
            <input
              type="text"
              placeholder="単位 (例: m/s)"
              value={newFormula.resultUnit || ""}
              onChange={e => setNewFormula(prev => ({ ...prev, resultUnit: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
            >
              <Save className="w-4 h-4" />
              {editingId ? "更新" : "保存"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {formulas.map(formula => (
          <div
            key={formula.id}
            className="bg-white dark:bg-slate-700 rounded-lg p-4 cursor-pointer"
            onClick={() => handleFormulaClick(formula)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-slate-800 dark:text-white">
                {formula.name}
                {formula.resultUnit && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    結果: {formula.resultUnit}
                  </span>
                )}
              </h3>
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleUseWithValues(formula)}
                  disabled={!areAllVariablesFilled(formula, variableValues)}
                  className={getUseButtonStyle(formula, variableValues)}
                  title={areAllVariablesFilled(formula, variableValues) ? "数式を使用" : "すべての変数に値を入力してください"}
                >
                  使用
                </button>
                <button
                  onClick={() => handleEdit(formula)}
                  className="p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-md"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {!selectedFormulaId && (
                  <button
                    onClick={() => setExpandedId(expandedId === formula.id ? null : formula.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-md text-slate-600 dark:text-slate-300"
                  >
                    {expandedId === formula.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteClick(formula.id, e)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {deletingId === formula.id && (
              <div 
                className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">この数式を削除しますか？</p>
                    <p className="text-sm mt-1">この操作は取り消せません。</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}

            {(expandedId === formula.id || selectedFormulaId === formula.id) && (
              <div className="mt-4 space-y-4">
                <div className="text-sm text-slate-700 dark:text-slate-300 p-2 bg-gray-100 dark:bg-slate-800 rounded-md font-mono">
                  {formula.formula}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">変数の値を入力</h4>
                  {formula.variables.map(variable => (
                    <div
                      key={variable.id}
                      className="flex items-center gap-2"
                      onClick={e => e.stopPropagation()}
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[100px] flex items-center gap-1">
                        <VariableIcon className="w-3 h-3" />
                        {variable.name} {variable.unit && `(${variable.unit})`}
                      </span>
                      <input
                        type="number"
                        value={variableValues[formula.id]?.[variable.id] || ""}
                        onChange={(e) => onVariableValueChange(formula.id, variable.id, e.target.value)}
                        placeholder="値を入力"
                        className="flex-1 px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}