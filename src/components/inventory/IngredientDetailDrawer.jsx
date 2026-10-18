import { useMemo, useState } from 'react';
import {
  X,
  Pencil,
  Trash2,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import {
  MOVEMENT_STYLES,
  STOCK_STATUS_STYLES,
  formatTimeAgo,
  getStockStatus,
} from '../../data/demoData';
import StockMovementModal from './StockMovementModal';

const TYPE_ICONS = {
  received: ArrowDownToLine,
  consumed: ArrowUpFromLine,
  adjustment: Settings2,
  waste: AlertTriangle,
};

export default function IngredientDetailDrawer({
  ingredient,
  onEdit,
  onClose,
  onToast,
}) {
  const { movements, removeIngredient } = useInventory();
  const [movementType, setMovementType] = useState(null);

  const status = getStockStatus(ingredient);
  const statusStyle = STOCK_STATUS_STYLES[status];
  const totalValue = ingredient.currentStock * ingredient.costPerUnit;

  // % of stock vs (reorder * 2) for progress bar
  const barMax = Math.max(ingredient.reorderLevel * 2, 1);
  const barPercent = Math.min(
    100,
    Math.round((ingredient.currentStock / barMax) * 100)
  );
  const reorderPercent = Math.min(
    100,
    Math.round((ingredient.reorderLevel / barMax) * 100)
  );

  const barColor =
    status === 'out'
      ? 'bg-red-500'
      : status === 'low'
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  // Movements for this ingredient (newest first)
  const history = useMemo(
    () =>
      movements
        .filter((m) => m.ingredientId === ingredient.id)
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [movements, ingredient.id]
  );

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${ingredient.name}"? All its movement history will be removed.`
      )
    ) {
      removeIngredient(ingredient.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end">
        <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

        <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-brand-border shrink-0">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-brand-mutedText font-semibold">
                {ingredient.sku || 'INGREDIENT'}
              </p>
              <h2 className="text-lg font-bold text-brand-darkText leading-tight">
                {ingredient.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-gray-100 text-brand-mutedText px-2 py-0.5 rounded-full">
                  {ingredient.category}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle}`}
                >
                  {status === 'ok'
                    ? 'In stock'
                    : status === 'low'
                    ? 'Low stock'
                    : 'Out of stock'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                aria-label="Edit"
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <Pencil className="w-4 h-4 text-brand-mutedText" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 text-brand-mutedText" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Stock card */}
            <div className="rounded-xl border border-brand-border p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-brand-mutedText inline-flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Current stock
                </span>
                <span className="text-2xl font-bold text-brand-darkText">
                  {ingredient.currentStock}{' '}
                  <span className="text-sm font-medium text-brand-mutedText">
                    {ingredient.unit}
                  </span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all`}
                  style={{ width: `${barPercent}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                  style={{ left: `${reorderPercent}%` }}
                  title="Reorder level"
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-brand-mutedText">
                <span>0</span>
                <span>Reorder at {ingredient.reorderLevel}</span>
                <span>{barMax} {ingredient.unit}</span>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
                <p className="text-[11px] text-brand-mutedText mb-0.5">
                  Unit cost
                </p>
                <p className="font-semibold text-brand-darkText">
                  ${ingredient.costPerUnit.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
                <p className="text-[11px] text-brand-mutedText mb-0.5 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Total value
                </p>
                <p className="font-semibold text-brand-darkText">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5 col-span-2">
                <p className="text-[11px] text-brand-mutedText mb-0.5">
                  Supplier
                </p>
                <p className="font-semibold text-brand-darkText truncate">
                  {ingredient.supplier || '—'}
                </p>
              </div>
            </div>

            {ingredient.note && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <p className="text-xs text-amber-800 leading-snug">
                  {ingredient.note}
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div>
              <p className="text-xs font-medium text-brand-mutedText mb-2">
                Quick actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { t: 'received', label: 'Receive', color: 'emerald' },
                  { t: 'consumed', label: 'Consume', color: 'blue' },
                  { t: 'adjustment', label: 'Adjust', color: 'amber' },
                  { t: 'waste', label: 'Waste', color: 'red' },
                ].map(({ t, label }) => {
                  const Icon = TYPE_ICONS[t];
                  const colorMap = {
                    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                    blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
                    amber: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
                    red: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
                  };
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setMovementType(t)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-medium transition ${colorMap[color]}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Movement history */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-brand-darkText">
                  Movement history
                </h3>
                <span className="text-[11px] text-brand-mutedText">
                  {history.length} record{history.length === 1 ? '' : 's'}
                </span>
              </div>

              {history.length === 0 ? (
                <div className="border-2 border-dashed border-brand-border rounded-lg py-8 text-center">
                  <p className="text-xs text-brand-mutedText">
                    No movements recorded yet.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {history.map((m) => {
                    const styles = MOVEMENT_STYLES[m.type];
                    const Icon = TYPE_ICONS[m.type];
                    const isNeg = m.qty < 0 || m.type === 'consumed' || m.type === 'waste';
                    const displayQty = m.qty < 0 ? m.qty : m.qty;
                    return (
                      <li
                        key={m.id}
                        className="border border-brand-border rounded-lg px-3 py-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg ${styles.bg} ${styles.text} flex items-center justify-center shrink-0`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-brand-darkText">
                                {styles.label}
                              </p>
                              <p className="text-[10px] text-brand-mutedText truncate">
                                {m.note || '—'} · {m.user}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p
                              className={`text-sm font-bold ${
                                isNeg ? 'text-red-600' : 'text-emerald-600'
                              }`}
                            >
                              {isNeg ? '−' : '+'}
                              {Math.abs(displayQty)} {ingredient.unit}
                            </p>
                            <p className="text-[10px] text-brand-mutedText">
                              {formatTimeAgo(m.at)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Danger zone */}
            <div className="pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete ingredient
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Movement modal */}
      {movementType && (
        <StockMovementModal
          ingredient={ingredient}
          initialType={movementType}
          onClose={() => setMovementType(null)}
          onSaved={() => {
            setMovementType(null);
            onToast?.('success', 'Stock movement recorded.');
          }}
        />
      )}
    </>
  );
}