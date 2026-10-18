import { useMemo } from 'react';
import {
  X,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Star,
  ShoppingBag,
  Receipt,
  StickyNote,
} from 'lucide-react';
import { useCustomers } from '../../context/CustomersContext';
import { useOrders } from '../../context/OrdersContext';
import {
  CUSTOMER_TIER_STYLES,
  computeTotals,
  formatTimeAgo,
  getCustomerTier,
  statusStyles,
} from '../../data/demoData';

export default function CustomerDetailDrawer({ customer, onEdit, onClose }) {
  const { updateCustomer, removeCustomer } = useCustomers();
  const { orders } = useOrders();

  // Orders linked to this customer
  const customerOrders = useMemo(
    () =>
      orders
        .filter((o) => o.customerId === customer.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [orders, customer.id]
  );

  const totalSpent = customerOrders.reduce(
    (sum, o) => sum + Number(computeTotals(o.items).total),
    0
  );
  const avgOrder =
    customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;
  const lastOrderAt = customerOrders[0]?.createdAt ?? null;
  const tier = getCustomerTier(customerOrders.length, totalSpent);
  const tierStyle = CUSTOMER_TIER_STYLES[tier];

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${customer.name}"? Their ${customerOrders.length} linked order(s) will remain in the Orders list but lose the customer link.`
      )
    ) {
      removeCustomer(customer.id);
      onClose();
    }
  };

  const handlePointsChange = (val) => {
    updateCustomer(customer.id, {
      loyaltyPoints: Math.max(0, Number(val) || 0),
    });
  };

  const handleNotesChange = (val) => {
    updateCustomer(customer.id, { notes: val });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

      <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-mutedText font-semibold">
              Customer
            </p>
            <h2 className="text-lg font-bold text-brand-darkText leading-tight">
              {customer.name}
            </h2>
            <p className="text-xs text-brand-mutedText mt-0.5">
              ID: {customer.id} · Since{' '}
              {new Date(customer.createdAt).toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })}
            </p>
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
          {/* Tier + loyalty */}
          <div className="rounded-xl border border-brand-border p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-brand-mutedText mb-1">Tier</p>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierStyle}`}
              >
                {tier}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-brand-mutedText mb-1">
                Loyalty points
              </p>
              <p className="text-lg font-bold text-amber-600 inline-flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {customer.loyaltyPoints}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-mutedText shrink-0" />
              <p className="text-sm text-brand-darkText truncate">
                {customer.phone || '—'}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-mutedText shrink-0" />
              <p className="text-sm text-brand-darkText truncate">
                {customer.email || '—'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[10px] text-brand-mutedText mb-0.5">
                Orders
              </p>
              <p className="font-bold text-brand-darkText">
                {customerOrders.length}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[10px] text-brand-mutedText mb-0.5">
                Total
              </p>
              <p className="font-bold text-brand-primary">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[10px] text-brand-mutedText mb-0.5">
                Avg
              </p>
              <p className="font-bold text-brand-darkText">
                ${avgOrder.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Loyalty editor */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              Adjust loyalty points
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePointsChange((customer.loyaltyPoints || 0) - 10)
                }
                className="w-9 h-9 rounded-lg bg-gray-100 text-brand-darkText text-sm font-bold hover:bg-gray-200 transition"
              >
                −
              </button>
              <input
                type="number"
                min="0"
                value={customer.loyaltyPoints}
                onChange={(e) => handlePointsChange(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText text-center font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
              <button
                type="button"
                onClick={() =>
                  handlePointsChange((customer.loyaltyPoints || 0) + 10)
                }
                className="w-9 h-9 rounded-lg bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryHover transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5" />
              Notes
            </label>
            <textarea
              value={customer.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={3}
              placeholder="Add customer notes..."
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
            />
          </div>

          {/* Order history */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-brand-darkText inline-flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-brand-mutedText" />
                Order history
              </h3>
              <span className="text-[11px] text-brand-mutedText">
                {customerOrders.length} order{customerOrders.length === 1 ? '' : 's'}
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="border-2 border-dashed border-brand-border rounded-lg py-6 text-center">
                <p className="text-xs text-brand-mutedText">
                  No orders linked yet.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {customerOrders.map((o) => {
                  const total = computeTotals(o.items).total;
                  return (
                    <li
                      key={o.id}
                      className="border border-brand-border rounded-lg px-3 py-2.5"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-brand-darkText">
                          #{o.id}
                        </p>
                        <p className="text-sm font-bold text-brand-primary">
                          ${total}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-brand-mutedText">
                        <span>
                          {o.type} · {o.table === '—' ? 'Takeaway' : `Table ${o.table}`}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            statusStyles[o.status] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-mutedText mt-1">
                        {formatTimeAgo(o.createdAt)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
            {lastOrderAt && (
              <p className="text-[11px] text-brand-mutedText mt-3 inline-flex items-center gap-1">
                <Receipt className="w-3 h-3" />
                Last visit: {formatTimeAgo(lastOrderAt)}
              </p>
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
              Delete customer
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}