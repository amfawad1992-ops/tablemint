import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { usePayments } from '../context/PaymentsContext';
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_STYLES,
  formatTimeAgo,
} from '../data/demoData';
import PaymentDetailDrawer from '../components/payments/PaymentDetailDrawer';

const DATE_FILTERS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'all', label: 'All time' },
];

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export default function PaymentsPage() {
  const { payments } = usePayments();

  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  };

  // Stat calculations
  const stats = useMemo(() => {
    const paid = payments.filter(
      (p) => p.status === 'Paid' || p.status === 'Partially Refunded'
    );
    const todayStart = startOfToday();
    const todayPaid = paid.filter(
      (p) => new Date(p.createdAt).getTime() >= todayStart
    );

    const todayRevenue = todayPaid.reduce(
      (s, p) => s + (Number(p.total) - (p.refundedAmount || 0)),
      0
    );
    const totalCollected = paid.reduce(
      (s, p) => s + (Number(p.total) - (p.refundedAmount || 0)),
      0
    );
    const cashTotal = paid
      .filter((p) => p.method === 'Cash')
      .reduce((s, p) => s + (Number(p.total) - (p.refundedAmount || 0)), 0);
    const cardTotal = paid
      .filter((p) => p.method === 'Card')
      .reduce((s, p) => s + (Number(p.total) - (p.refundedAmount || 0)), 0);
    const scanTotal = paid
      .filter((p) => p.method === 'Scan')
      .reduce((s, p) => s + (Number(p.total) - (p.refundedAmount || 0)), 0);
    const refunds = payments.reduce(
      (s, p) => s + (p.refundedAmount || 0),
      0
    );

    return {
      todayRevenue,
      totalCollected,
      cashTotal,
      cardTotal,
      scanTotal,
      refunds,
      todayCount: todayPaid.length,
    };
  }, [payments]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = Date.now();
    const cutoff =
      dateFilter === 'today'
        ? startOfToday()
        : dateFilter === 'week'
        ? startOfWeek()
        : dateFilter === 'month'
        ? startOfMonth()
        : 0;

    return payments
      .filter((p) => {
        if (statusFilter !== 'All' && p.status !== statusFilter) return false;
        if (methodFilter !== 'All' && p.method !== methodFilter) return false;
        const t = new Date(p.createdAt).getTime();
        if (t < cutoff || t > now) return false;
        if (q) {
          const matches =
            p.id.toLowerCase().includes(q) ||
            p.orderId.toLowerCase().includes(q) ||
            (p.table || '').toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [payments, statusFilter, methodFilter, dateFilter, search]);

  const selected = payments.find((p) => p.id === selectedId) ?? null;

  const statusCounts = useMemo(() => {
    const counts = { All: payments.length };
    PAYMENT_STATUSES.forEach((s) => {
      counts[s] = payments.filter((p) => p.status === s).length;
    });
    return counts;
  }, [payments]);

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">
              Payments
            </h1>
            <p className="text-sm text-brand-mutedText">
              Track every transaction, method split, and refund.
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Today's revenue",
              value: `$${stats.todayRevenue.toFixed(2)}`,
              sub: `${stats.todayCount} payment${stats.todayCount === 1 ? '' : 's'}`,
              accent: 'text-emerald-600',
            },
            {
              label: 'Total collected',
              value: `$${stats.totalCollected.toFixed(2)}`,
              sub: 'Net of refunds',
              accent: 'text-brand-primary',
            },
            {
              label: 'Cash',
              value: `$${stats.cashTotal.toFixed(2)}`,
              sub: 'via Cash',
              accent: 'text-emerald-600',
            },
            {
              label: 'Card',
              value: `$${stats.cardTotal.toFixed(2)}`,
              sub: 'via Card',
              accent: 'text-blue-600',
            },
            {
              label: 'Scan / QR',
              value: `$${stats.scanTotal.toFixed(2)}`,
              sub: 'via Scan',
              accent: 'text-violet-600',
            },
            {
              label: 'Refunds',
              value: `$${stats.refunds.toFixed(2)}`,
              sub: 'Total refunded',
              accent: 'text-red-600',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-brand-border rounded-xl px-3 py-2.5"
            >
              <p className="text-[11px] text-brand-mutedText mb-1 truncate">
                {s.label}
              </p>
              <p className={`text-lg font-bold ${s.accent}`}>{s.value}</p>
              <p className="text-[10px] text-brand-mutedText mt-0.5 truncate">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', ...PAYMENT_STATUSES].map((s) => {
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

        {/* Method + date filters + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {['All', ...PAYMENT_METHODS].map((m) => {
              const active = methodFilter === m;
              return (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethodFilter(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-brand-mutedText border-brand-border hover:border-gray-300'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {DATE_FILTERS.map((f) => {
              const active = dateFilter === f.key;
              return (
                <button
                  type="button"
                  key={f.key}
                  onClick={() => setDateFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-brand-mutedText border-brand-border hover:border-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search receipt, order, or table"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-content text-left text-xs uppercase tracking-wide text-brand-mutedText">
                <tr>
                  <th className="px-4 py-3 font-medium">Receipt</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-brand-mutedText"
                    >
                      No payments match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => {
                  const refunded = p.refundedAmount || 0;
                  const net = Number(p.total) - refunded;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className="border-t border-brand-border hover:bg-brand-content/60 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 font-semibold text-brand-darkText">
                        {p.id}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        #{p.orderId}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {p.table === '—' ? '—' : `Table ${p.table}`}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-darkText">
                        ${net.toFixed(2)}
                        {refunded > 0 && (
                          <div className="text-[10px] text-violet-600 font-normal">
                            −${refunded.toFixed(2)} refunded
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {p.method}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            PAYMENT_STATUS_STYLES[p.status] ??
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText whitespace-nowrap">
                        {formatTimeAgo(p.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <PaymentDetailDrawer
          payment={selected}
          onClose={() => setSelectedId(null)}
          onToast={showToast}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-toast ${
            toast.type === 'success' ? 'bg-brand-primary' : 'bg-red-500'
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </>
  );
}