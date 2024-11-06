import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Edit2 } from 'lucide-react';
import { CustomFormula, Variable } from '../types';

interface CustomFormulasProps {
  formulas: CustomFormula[];
  onSaveFormula: (formula: CustomFormula) => void;
  onDeleteFormula: (id: string) => void;
  onUseFormula: (formula: CustomFormula) => void;
}

const createVariable = (): Variable => ({
  id: crypto.randomUUID(),
  name: '',
  value: '',
  unit: ''
});

const emptyFormula: CustomFormula = {
  id: '',
  name: '',
  variables: [createVariable()],
  formula: ''
};

const CustomFormulas: React.FC<CustomFormulasProps> = ({
  formulas,
  onSaveFormula,
  onDeleteFormula,
  onUseFormula
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFormula, setNewFormula] = useState<CustomFormula>(emptyFormula);
  const [variableValues, setVariableValues] = useState<Record<string, Record<string, string>>>({});

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
    const values = variableValues[formula.id] || {};
    let expression = formula.formula;
    
    formula.variables.forEach(variable => {
      const value = values[variable.id] || '0';
      expression = expression.replace(
        new RegExp(variable.name, 'g'),
        value
      );
    });
    
    onUseFormula({ ...formula, formula: expression });
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">カスタム数式</h2>
        {!isAdding && (
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

          <input
            type="text"
            placeholder="数式 (例: a * b)"
            value={newFormula.formula}
            onChange={e => setNewFormula(prev => ({ ...prev, formula: e.target.value }))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />

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
              {editingId ? '更新' : '保存'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {formulas.map(formula => (
          <div
            key={formula.id}
            className="bg-white dark:bg-slate-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-slate-800 dark:text-white">
                {formula.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUseWithValues(formula)}
                  className="px-3 py-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 text-sm"
                >
                  使用
                </button>
                <button
                  onClick={() => handleEdit(formula)}
                  className="p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-md"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
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
                <button
                  onClick={() => onDeleteFormula(formula.id)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedId === formula.id && (
              <div className="mt-4 space-y-2">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  数式: {formula.formula}
                </div>
                <div className="space-y-2">
                  {formula.variables.map(variable => (
                    <div
                      key={variable.id}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[100px]">
                        {variable.name} {variable.unit && `(${variable.unit})`}
                      </span>
                      <input
                        type="number"
                        value={variableValues[formula.id]?.[variable.id] || ''}
                        onChange={(e) => handleVariableValueChange(formula.id, variable.id, e.target.value)}
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
};

export default CustomFormulas;