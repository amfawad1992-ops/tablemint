import { useState } from 'react';
import { X } from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { useTables } from '../../context/TablesContext';
import { ORDER_TYPES } from '../../data/demoData';

export default function NewOrderModal({ onClose, onCreated }) {
  const { addOrder } = useOrders();
  const { tables, setTableOccupied } = useTables();

  const [type, setType] = useState('Dine In');
  const [tableId, setTableId] = useState(tables[0]?.id ?? '01');
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState('');

  const isDineIn = type === 'Dine In';

  const handleCreate = (e) => {
    e.preventDefault();
    const order = addOrder({
      type,
      table: isDineIn ? tableId : '—',
      people: Number(people) || 1,
      notes,
    });
    if (isDineIn && tableId) {
      setTableOccupied(tableId, order.id, Number(people) || 1);
    }
    onCreated(order);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h2 className="text-base font-bold text-brand-darkText">
            New Order
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

        <form onSubmit={handleCreate} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Order type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ORDER_TYPES.map((t) => {
                const active = type === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 rounded-lg border text-xs font-medium transition ${
                      active
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-brand-border bg-white text-brand-mutedText hover:border-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {isDineIn && (
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Table
              </label>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.id} · {t.seats} seats · {t.floor} · {t.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Guests
            </label>
            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Kitchen notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. No onions, extra spicy..."
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
            />
          </div>

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
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}