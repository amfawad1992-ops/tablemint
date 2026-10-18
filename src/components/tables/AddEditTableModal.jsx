import { useState } from 'react';
import { X } from 'lucide-react';
import { useTables } from '../../context/TablesContext';
import { FLOORS, TABLE_STATUSES } from '../../data/demoData';

export default function AddTableModal({ onClose, onCreated }) {
  const { addTable } = useTables();

  const [tableId, setTableId] = useState('');
  const [seats, setSeats] = useState(4);
  const [floor, setFloor] = useState(FLOORS[0]);
  const [status, setStatus] = useState('Available');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = addTable({
      id: tableId.trim(),
      seats: Number(seats) || 2,
      floor,
      status,
      note,
    });
    if (created) onCreated?.(created);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h2 className="text-base font-bold text-brand-darkText">
            Add Table
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Table number (leave blank to auto-generate)
            </label>
            <input
              type="text"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Seats
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Floor
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              >
                {FLOORS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Initial status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            >
              {TABLE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. Near window, kid-friendly..."
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
              Add Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}