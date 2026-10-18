import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Star,
  DollarSign,
  ShoppingBag,
  Download,
} from 'lucide-react';
import { useCustomers } from '../context/CustomersContext';
import { useOrders } from '../context/OrdersContext';
import {
  CUSTOMER_TIERS,
  CUSTOMER_TIER_STYLES,
  computeTotals,
  formatTimeAgo,
  getCustomerTier,
} from '../data/demoData';
import { exportToCSV } from '../utils/csvExport';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import CustomerDetailDrawer from '../components/customers/CustomerDetailDrawer';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name A → Z' },
  { key: 'spend', label: 'Total spent' },
  { key: 'recent', label: 'Most recent' },
  { key: 'orders', label: 'Orders count' },
];

export default function CustomersPage() {
  const { customers } = useCustomers();
  const { orders } = useOrders();

  const [tierFilter, setTierFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [selectedId, setSelectedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const enriched = useMemo(() => {
    return customers.map((c) => {
      const customerOrders = orders.filter((o) => o.customerId === c.id);
      
      const totalSpent = customerOrders.reduce(
        (s, o) => s + Number(computeTotals(o.items).total),
        0
      );

      let lastOrderAt = null;
      if (customerOrders.length > 0) {
        lastOrderAt = customerOrders.reduce(
          (latest, o) =>
            new Date(o.createdAt).getTime() > new Date(latest).getTime()
              ? o.createdAt
              : latest,
          customerOrders[0].createdAt
        );
      }

      const tier = getCustomerTier(customerOrders.length, totalSpent);
      
      return { 
        ...c, 
        orderCount: customerOrders.length, 
        totalSpent, 
        lastOrderAt, 
        tier 
      };
    });
  }, [customers, orders]);

  const stats = useMemo(() => {
    const total = enriched.length;
    const withOrders = enriched.filter((c) => c.orderCount > 0).length;
    const vips = enriched.filter((c) => c.tier === 'VIP').length;
    const totalSpend = enriched.reduce((s, c) => s + c.totalSpent, 0);
    return { total, withOrders, vips, totalSpend };
  }, [enriched]);

  const tierCounts = useMemo(() => {
    const counts = { All: enriched.length };
    CUSTOMER_TIERS.forEach((t) => {
      counts[t] = enriched.filter((c) => c.tier === t).length;
    });
    return counts;
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = enriched.filter((c) => {
      if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
      if (q) {
        const matches =
          c.name.toLowerCase().includes(q) ||
          (c.phone || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sortKey) {
        case 'spend':
          return b.totalSpent - a.totalSpent;
        case 'recent': {
          const at = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0;
          const bt = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0;
          return bt - at;
        }
        case 'orders':
          return b.orderCount - a.orderCount;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [enriched, tierFilter, search, sortKey]);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const handleExport = () => {
    const exportData = filtered.map((c) => ({
      'ID': c.id,
      'Name': c.name,
      'Phone': c.phone || '',
      'Email': c.email || '',
      'Total Spent': c.totalSpent.toFixed(2),
      'Orders Count': c.orderCount,
      'Loyalty Points': c.loyaltyPoints,
      'Tier': c.tier,
      'Last Order': c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleString() : '',
    }));
    exportToCSV(exportData, `Customers_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">Customers</h1>
            <p className="text-sm text-brand-mutedText">
              Track guests, purchase history, and loyalty.
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
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total customers',
              value: stats.total,
              Icon: Users,
              accent: 'text-brand-darkText',
              bg: 'bg-brand-content',
            },
            {
              label: 'With orders',
              value: stats.withOrders,
              Icon: ShoppingBag,
              accent: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
            {
              label: 'VIP customers',
              value: stats.vips,
              Icon: Star,
              accent: 'text-amber-600',
              bg: 'bg-amber-50',
            },
            {
              label: 'Total spent',
              value: `$${stats.totalSpend.toFixed(2)}`,
              Icon: DollarSign,
              accent: 'text-brand-primary',
              bg: 'bg-brand-primary/10',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-brand-border rounded-xl px-4 py-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] text-brand-mutedText truncate">
                  {s.label}
                </p>
                <span
                  className={`w-7 h-7 rounded-lg ${s.bg} ${s.accent} flex items-center justify-center`}
                >
                  <s.Icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className={`text-xl font-bold ${s.accent}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', ...CUSTOMER_TIERS].map((t) => {
            const active = tierFilter === t;
            return (
              <button
                type="button"
                key={t}
                onClick={() => setTierFilter(t)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  active
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white text-brand-mutedText border-brand-border hover:border-gray-300'
                }`}
              >
                {t} ({tierCounts[t] ?? 0})
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
              placeholder="Search by name, phone, email, or ID"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-content text-left text-xs uppercase tracking-wide text-brand-mutedText">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium text-right">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Total spent
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Points</th>
                  <th className="px-4 py-3 font-medium">Tier</th>
                  <th className="px-4 py-3 font-medium">Last order</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-brand-mutedText"
                    >
                      No customers match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="border-t border-brand-border hover:bg-brand-content/60 cursor-pointer transition"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-brand-darkText">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-brand-mutedText">
                        {c.id}
                        {c.email ? ` · ${c.email}` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-mutedText whitespace-nowrap">
                      {c.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-brand-darkText">
                      {c.orderCount}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-primary whitespace-nowrap">
                      ${c.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">
                      {c.loyaltyPoints}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          CUSTOMER_TIER_STYLES[c.tier]
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-mutedText whitespace-nowrap">
                      {c.lastOrderAt ? formatTimeAgo(c.lastOrderAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <CustomerFormModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => setShowAddModal(false)}
        />
      )}

      {editing && (
        <CustomerFormModal
          customer={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}

      {selected && (
        <CustomerDetailDrawer
          customer={selected}
          onEdit={() => {
            setEditing(selected);
            setSelectedId(null);
          }}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}