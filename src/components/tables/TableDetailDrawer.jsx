import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Users,
  Trash2,
  ArrowUpRight,
  StickyNote,
  QrCode,
  Printer,
} from 'lucide-react';
import { useTables } from '../../context/TablesContext';
import { useOrders } from '../../context/OrdersContext';
import {
  computeTotals,
  FLOORS,
  TABLE_STATUSES,
  TABLE_STATUS_PILL,
  TABLE_STATUS_STYLES,
} from '../../data/demoData';
import QRPrintModal from './QRPrintModal';

export default function TableDetailDrawer({ table, onClose }) {
  const navigate = useNavigate();
  const { updateTable, removeTable } = useTables();
  const { orders } = useOrders();
  
  const [showPrintModal, setShowPrintModal] = useState(false);

  const currentOrder = table.currentOrderId
    ? orders.find((o) => o.id === table.currentOrderId) ?? null
    : null;

  const handleDelete = () => {
    if (window.confirm(`Delete table #${table.id}? This cannot be undone.`)) {
      removeTable(table.id);
      onClose();
    }
  };

  const handleStatus = (status) => {
    updateTable(table.id, { status });
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
                Table
              </p>
              <h2 className="text-xl font-bold text-brand-darkText leading-tight">
                #{table.id}
              </h2>
              <p className="text-xs text-brand-mutedText mt-0.5">{table.floor}</p>
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* PROFESSIONAL QR BUTTON */}
            <div className="rounded-xl border border-brand-border bg-brand-content p-4">
              <button
                onClick={() => setShowPrintModal(true)}
                className="w-full py-3 rounded-lg bg-brand-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-primaryHover transition shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                Generate & Print QR Menu Card
              </button>
              <p className="text-center text-[10px] text-brand-mutedText mt-2">
                Print a beautiful A6 card to place on Table {table.id}
              </p>
            </div>

            {/* Status selector */}
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TABLE_STATUSES.map((s) => {
                  const active = table.status === s;
                  const style = TABLE_STATUS_STYLES[s];
                  const pill = TABLE_STATUS_PILL[s];
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => handleStatus(s)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition ${
                        active
                          ? `${style} ring-2 ring-brand-primary/30`
                          : 'bg-white border-brand-border text-brand-mutedText hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          active ? pill.split(' ')[0] : 'bg-gray-300'
                        }`}
                      />
                      <span className="truncate">{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seats + floor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-brand-mutedText mb-2">
                  Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={table.seats}
                  onChange={(e) =>
                    updateTable(table.id, {
                      seats: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-mutedText mb-2">
                  Floor
                </label>
                <select
                  value={table.floor}
                  onChange={(e) =>
                    updateTable(table.id, { floor: e.target.value })
                  }
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

            {/* Guests */}
            {table.status === 'Occupied' && (
              <div>
                <label className="block text-xs font-medium text-brand-mutedText mb-2">
                  Guests seated
                </label>
                <input
                  type="number"
                  min="1"
                  value={table.guestCount || 1}
                  onChange={(e) =>
                    updateTable(table.id, {
                      guestCount: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Note
              </label>
              <textarea
                value={table.note}
                onChange={(e) =>
                  updateTable(table.id, { note: e.target.value })
                }
                rows={2}
                placeholder="Add a note about this table..."
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
              />
            </div>

            {/* Current order */}
            {currentOrder ? (
              <div className="rounded-xl border border-brand-border p-4 bg-brand-content">
                <p className="text-[11px] uppercase tracking-wider text-brand-mutedText font-semibold mb-2">
                  Current order
                </p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-brand-darkText">
                    #{currentOrder.id}
                  </p>
                  <p className="text-sm font-bold text-brand-primary">
                    ${computeTotals(currentOrder.items).total}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-brand-mutedText mb-3">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {currentOrder.people} people
                  </span>
                  <span>·</span>
                  <span>{currentOrder.status}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/orders');
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white border border-brand-border text-brand-primary text-xs font-semibold hover:bg-brand-primary/5 transition"
                >
                  View in Orders
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : table.status === 'Occupied' ? (
              <div className="rounded-xl border border-brand-border p-4 bg-brand-content text-xs text-brand-mutedText">
                Occupied, but no linked order. Open a new order from the POS
                and assign this table.
              </div>
            ) : null}

            {/* Danger zone */}
            <div className="pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete table
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal */}
      {showPrintModal && (
        <QRPrintModal table={table} onClose={() => setShowPrintModal(false)} />
      )}
    </>
  );
}