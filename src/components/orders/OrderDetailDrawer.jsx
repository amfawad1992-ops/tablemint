import { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Users,
  Clock,
  ClipboardList,
  Trash2,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { useMenu } from '../../context/MenuContext';
import {
  computeTotals,
  formatTimeAgo,
  getNextStatus,
  statusStyles,
} from '../../data/demoData';
import ReceiptModal from './ReceiptModal';

export default function OrderDetailDrawer({ order, onClose }) {
  const { updateItemQty, updateNotes, changeStatus, removeOrder, updateOrderDiscount } = useOrders();
  const { menu } = useMenu();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const addableItems = menu.filter((m) => m.available !== false);
  const totals = computeTotals(order.items, order.discount);
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);
  const next = getNextStatus(order.status);
  const isCancelled = order.status === 'Cancelled';
  const isCompleted = order.status === 'Completed';

  const handleCancel = () => {
    if (window.confirm(`Cancel order #${order.id}? This cannot be undone.`)) {
      changeStatus(order.id, 'Cancelled');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete order #${order.id}? It will be removed from the list.`)) {
      removeOrder(order.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end">
        <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

        <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
          <div className="flex items-start justify-between px-5 py-4 border-b border-brand-border shrink-0">
            <div>
              <h2 className="text-base font-bold text-brand-darkText">Order #{order.id}</h2>
              <p className="text-xs text-brand-mutedText mt-0.5">{order.type} · {formatTimeAgo(order.createdAt)}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-gray-100 transition">
              <X className="w-4 h-4 text-brand-mutedText" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-12 space-y-5">
            
            <button onClick={() => setShowReceipt(true)} className="w-full py-3 rounded-lg bg-gray-900 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition shadow-sm">
              <Printer className="w-4 h-4" /> Print Receipt & Pay
            </button>

            <div className="rounded-xl border border-brand-border p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-brand-mutedText">Current status</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status] ?? 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
              </div>

              {next && !isCancelled && (
                <button type="button" onClick={() => changeStatus(order.id, next)} className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition">
                  Move to {next} <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {isCompleted && <p className="text-xs text-brand-mutedText text-center">Order completed.</p>}
              {isCancelled && <p className="text-xs text-red-500 text-center">Order cancelled.</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
                <p className="text-[11px] text-brand-mutedText mb-0.5">Table</p>
                <p className="font-semibold text-brand-darkText">{order.table === '—' ? '—' : `#${order.table}`}</p>
              </div>
              <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
                <p className="text-[11px] text-brand-mutedText mb-0.5">Guests</p>
                <p className="font-semibold text-brand-darkText inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-mutedText" />{order.people}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">Kitchen notes</label>
              <textarea value={order.notes} onChange={(e) => updateNotes(order.id, e.target.value)} rows={2} placeholder="No notes yet." className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-brand-darkText">Items ({itemCount})</h3>
                {!isCancelled && !isCompleted && (
                  <button type="button" onClick={() => setShowAddMenu((v) => !v)} className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-primaryHover">
                    <Plus className="w-3.5 h-3.5" /> {showAddMenu ? 'Hide menu' : 'Add item'}
                  </button>
                )}
              </div>

              {showAddMenu && (
                <div className="mb-3 border border-brand-border rounded-lg max-h-56 overflow-y-auto">
                  {addableItems.map((item) => (
                    <button key={item.id} type="button" onClick={() => updateItemQty(order.id, item, 1)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-brand-content transition text-left border-b border-brand-border last:border-b-0">
                      <img src={item.image} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-darkText truncate">{item.name}</p>
                        <p className="text-xs text-brand-mutedText">${item.price.toFixed(2)}</p>
                      </div>
                      <Plus className="w-4 h-4 text-brand-primary shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {order.items.length === 0 ? (
                <p className="text-xs text-brand-mutedText py-3">No items yet. Use "Add item" above.</p>
              ) : (
                <div className="space-y-2">
                  {order.items.map((it) => (
                    <div key={it.foodId} className="flex items-center gap-2 border border-brand-border rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-darkText truncate">{it.name}</p>
                        <p className="text-xs text-brand-mutedText">${it.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button type="button" onClick={() => updateItemQty(order.id, { id: it.foodId, name: it.name, price: it.price }, -1)} className="w-7 h-7 rounded-md bg-gray-100 text-brand-darkText flex items-center justify-center hover:bg-gray-200 transition" aria-label={`Remove one ${it.name}`}><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-sm font-semibold text-brand-darkText">{it.qty}</span>
                        <button type="button" onClick={() => updateItemQty(order.id, { id: it.foodId, name: it.name, price: it.price }, 1)} className="w-7 h-7 rounded-md bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primaryHover transition" aria-label={`Add one ${it.name}`}><Plus className="w-3 h-3" /></button>
                      </div>
                      <p className="w-14 text-right text-sm font-semibold text-brand-darkText shrink-0">${(it.price * it.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-3 border-t border-brand-border text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-mutedText">Subtotal</span>
                <span className="text-brand-darkText font-medium">${totals.subtotal}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-brand-mutedText">Discount ($)</span>
                <input type="number" min="0" step="0.01" value={order.discount || 0} onChange={(e) => updateOrderDiscount(order.id, e.target.value)} className="w-20 px-2 py-1 text-right rounded border border-brand-border bg-white text-brand-darkText focus:outline-none focus:border-brand-primary" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-brand-mutedText">Tax (1%)</span>
                <span className="text-brand-darkText font-medium">${totals.tax}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-mutedText">Donation</span>
                <span className="text-brand-darkText font-medium">${totals.donation}</span>
              </div>
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-brand-border">
                <span className="font-bold text-brand-darkText">Total Payable</span>
                <span className="text-lg font-bold text-brand-primary">${totals.total}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-darkText mb-2 inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-mutedText" />Status history</h3>
              <ol className="border-l-2 border-brand-border ml-1.5 pl-4 space-y-3">
                {(order.statusHistory ?? []).map((h, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-primary" />
                    <p className="text-xs font-medium text-brand-darkText">{h.status}</p>
                    <p className="text-[11px] text-brand-mutedText">{formatTimeAgo(h.at)}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-brand-border">
              {!isCancelled && !isCompleted && (
                <button type="button" onClick={handleCancel} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition">
                  <ClipboardList className="w-4 h-4" /> Cancel order
                </button>
              )}
              <button type="button" onClick={handleDelete} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-brand-border text-brand-mutedText text-sm font-medium hover:bg-gray-50 transition">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showReceipt && <ReceiptModal order={order} onClose={() => setShowReceipt(false)} />}
    </>
  );
}