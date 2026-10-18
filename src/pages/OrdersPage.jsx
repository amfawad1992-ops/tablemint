import { useMemo, useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import {
  computeTotals,
  formatTimeAgo,
  statusStyles,
  ORDER_TYPES,
} from '../data/demoData';
import { exportToCSV } from '../utils/csvExport';
import NewOrderModal from '../components/orders/NewOrderModal';
import OrderDetailDrawer from '../components/orders/OrderDetailDrawer';

const STATUS_FILTERS = [
  'All',
  'New',
  'Confirmed',
  'In Kitchen',
  'Ready',
  'Served',
  'Completed',
  'Cancelled',
];

export default function OrdersPage() {
  const { orders } = useOrders();

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_FILTERS.slice(1).forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const statusMatch = statusFilter === 'All' || o.status === statusFilter;
      const typeMatch = typeFilter === 'All' || o.type === typeFilter;
      const searchMatch =
        q === '' ||
        o.id.toLowerCase().includes(q) ||
        String(o.table).toLowerCase().includes(q);
      return statusMatch && typeMatch && searchMatch;
    });
  }, [orders, statusFilter, typeFilter, search]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const handleExport = () => {
    const exportData = filtered.map((o) => {
      const totals = computeTotals(o.items);
      const itemCount = o.items.reduce((s, i) => s + i.qty, 0);
      return {
        'Order ID': o.id,
        'Type': o.type,
        'Table': o.table === '—' ? 'Takeaway' : o.table,
        'Items Count': itemCount,
        'Subtotal': totals.subtotal,
        'Tax': totals.tax,
        'Donation': totals.donation,
        'Total': totals.total,
        'Status': o.status,
        'Date': new Date(o.createdAt).toLocaleString(),
      };
    });
    exportToCSV(exportData, `Orders_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">Orders</h1>
            <p className="text-sm text-brand-mutedText">
              Create, edit, filter and track every order.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border bg-white text-brand-mutedText text-sm font-medium hover:border-gray-300 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s;
            return (
              <button
                type="button"
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  active
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white text-brand-mutedText border-brand-border hover:border-gray-300'
                }`}
              >
                {s} ({statusCounts[s] ?? 0})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order # or table"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            <option value="All">All types</option>
            {ORDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-content text-left text-xs uppercase tracking-wide text-brand-mutedText">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-brand-mutedText"
                    >
                      No orders match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((o) => {
                  const totals = computeTotals(o.items);
                  const itemCount = o.items.reduce((s, i) => s + i.qty, 0);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className="border-t border-brand-border hover:bg-brand-content/60 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 font-semibold text-brand-darkText">
                        #{o.id}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {o.type}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {o.table === '—' ? '—' : `Table ${o.table}`}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {itemCount}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-darkText">
                        ${totals.total}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            statusStyles[o.status] ??
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {formatTimeAgo(o.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showNewModal && (
        <NewOrderModal
          onClose={() => setShowNewModal(false)}
          onCreated={(order) => {
            setShowNewModal(false);
            setSelectedOrderId(order.id);
          }}
        />
      )}

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </>
  );
}