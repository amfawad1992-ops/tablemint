import { useEffect, useState } from 'react';
import { X, ArrowDownToLine, ArrowUpFromLine, Settings2, AlertTriangle } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { MOVEMENT_TYPES, MOVEMENT_STYLES } from '../../data/demoData';

const TYPE_ICONS = {
  received: ArrowDownToLine,
  consumed: ArrowUpFromLine,
  adjustment: Settings2,
  waste: AlertTriangle,
};

const TYPE_LABELS = {
  received: 'Stock received',
  consumed: 'Stock consumed',
  adjustment: 'Manual adjustment',
  waste: 'Waste / spoilage',
};

export default function StockMovementModal({
  ingredient,
  initialType = 'received',
  onClose,
  onSaved,
}) {
  const { applyMovement } = useInventory();
  const [type, setType] = useState(initialType);
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const numericQty = Number(qty) || 0;
  const computedNext = (() => {
    if (type === 'received') return ingredient.currentStock + numericQty;
    if (type === 'consumed') return Math.max(0, ingredient.currentStock - numericQty);
    if (type === 'waste') return Math.max(0, ingredient.currentStock - numericQty);
    if (type === 'adjustment') return Math.max(0, ingredient.currentStock + numericQty);
    return ingredient.currentStock;
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!numericQty || numericQty === 0) {
      setError('Quantity must be a non-zero number.');
      return;
    }
    if (type !== 'adjustment' && numericQty < 0) {
      setError('Quantity must be positive for this movement type.');
      return;
    }
    if (type === 'adjustment' && !note.trim()) {
      setError('Please add a note explaining the adjustment.');
      return;
    }
    if (
      (type === 'consumed' || type === 'waste') &&
      numericQty > ingredient.currentStock
    ) {
      setError(
        `Cannot ${type} more than available stock (${ingredient.currentStock} ${ingredient.unit}).`
      );
      return;
    }

    applyMovement(ingredient.id, { type, qty: numericQty, note });
    onSaved?.();
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div>
            <h2 className="text-base font-bold text-brand-darkText">
              Stock Movement
            </h2>
            <p className="text-xs text-brand-mutedText mt-0.5">
              {ingredient.name} · {ingredient.currentStock} {ingredient.unit} in stock
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-brand-mutedText" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Movement type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOVEMENT_TYPES.map((t) => {
                const active = type === t;
                const Icon = TYPE_ICONS[t];
                const styles = MOVEMENT_STYLES[t];
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition ${
                      active
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-2 ring-brand-primary/20'
                        : 'border-brand-border bg-white text-brand-mutedText hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{styles.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty + unit */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Quantity ({ingredient.unit})
              {type === 'adjustment' && ' — use minus for negative'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                className={inputCls}
              />
              <div className="px-3 py-2.5 rounded-lg bg-brand-content border border-brand-border text-sm text-brand-mutedText shrink-0">
                {ingredient.unit}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-brand-border bg-brand-content px-3 py-2.5 text-xs">
            <div className="flex justify-between text-brand-mutedText">
              <span>Current</span>
              <span className="font-medium text-brand-darkText">
                {ingredient.currentStock} {ingredient.unit}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-brand-mutedText">After</span>
              <span className="font-bold text-brand-primary">
                {computedNext.toFixed(2)} {ingredient.unit}
              </span>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Note {type === 'adjustment' && '*'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. Morning delivery, Kitchen use, Spoiled..."
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
              Record movement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}