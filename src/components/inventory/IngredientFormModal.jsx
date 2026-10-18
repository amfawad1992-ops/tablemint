import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from '../../data/demoData';

const empty = {
  name: '',
  sku: '',
  category: 'Dry Goods',
  unit: 'kg',
  currentStock: 0,
  reorderLevel: 5,
  costPerUnit: 0,
  supplier: '',
  note: '',
};

export default function IngredientFormModal({ ingredient, onClose, onSaved }) {
  const { addIngredient, updateIngredient } = useInventory();
  const isEditing = !!ingredient;

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ingredient) {
      setForm({
        name: ingredient.name || '',
        sku: ingredient.sku || '',
        category: ingredient.category || 'Dry Goods',
        unit: ingredient.unit || 'kg',
        currentStock: ingredient.currentStock ?? 0,
        reorderLevel: ingredient.reorderLevel ?? 5,
        costPerUnit: ingredient.costPerUnit ?? 0,
        supplier: ingredient.supplier || '',
        note: ingredient.note || '',
      });
    } else {
      setForm(empty);
    }
  }, [ingredient]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Ingredient name is required.');
      return;
    }
    if (Number(form.costPerUnit) < 0) {
      setError('Unit cost cannot be negative.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      unit: form.unit,
      currentStock: Number(form.currentStock) || 0,
      reorderLevel: Number(form.reorderLevel) || 0,
      costPerUnit: Number(form.costPerUnit) || 0,
      supplier: form.supplier.trim(),
      note: form.note.trim(),
    };

    if (isEditing) {
      updateIngredient(ingredient.id, payload);
    } else {
      addIngredient(payload);
    }
    onSaved?.();
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <h2 className="text-base font-bold text-brand-darkText">
            {isEditing ? `Edit — ${ingredient.name}` : 'Add Ingredient'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-brand-mutedText" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Chicken Breast"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                placeholder="MEAT-001"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls}
              >
                {INVENTORY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => set('unit', e.target.value)}
                className={inputCls}
              >
                {INVENTORY_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Current stock
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.currentStock}
                onChange={(e) => set('currentStock', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Reorder at
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.reorderLevel}
                onChange={(e) => set('reorderLevel', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Cost / unit ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.costPerUnit}
                onChange={(e) => set('costPerUnit', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Supplier
            </label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => set('supplier', e.target.value)}
              placeholder="e.g. Fresh Farms"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Note (optional)
            </label>
            <textarea
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              rows={2}
              placeholder="Storage instructions, delivery day, etc."
              className={`${inputCls} resize-none`}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-brand-border text-sm font-medium text-brand-mutedText hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
            >
              {isEditing ? 'Save changes' : 'Add ingredient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}