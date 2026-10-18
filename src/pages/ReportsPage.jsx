import { useMemo, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  CalendarDays,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useOrders } from '../context/OrdersContext';
import { useMenu } from '../context/MenuContext';
import { useCustomers } from '../context/CustomersContext';
import { computeTotals } from '../data/demoData';

const DATE_FILTERS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'all', label: 'All time' },
];

const COLORS = ['#16B8AC', '#59C8C0', '#8EE6E0', '#3B82F6', '#8B5CF6', '#F59E0B'];

export default function ReportsPage() {
  const { orders } = useOrders();
  const { menu } = useMenu();
  const { customers } = useCustomers();

  const [dateFilter, setDateFilter] = useState('week');

  // Helper to filter orders by date range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      if (dateFilter === 'today') return t >= startOfToday;
      if (dateFilter === 'week') return t >= startOfWeek.getTime();
      if (dateFilter === 'month') return t >= startOfMonth;
      return true; // all
    });
  }, [orders, dateFilter]);

  // --- Aggregations ---

  const stats = useMemo(() => {
    let revenue = 0;
    filteredOrders.forEach((o) => {
      revenue += Number(computeTotals(o.items).total);
    });
    const totalOrders = filteredOrders.length;
    const aov = totalOrders > 0 ? revenue / totalOrders : 0;
    return { revenue, totalOrders, aov };
  }, [filteredOrders]);

  // 1. Sales Trend (Revenue by day)
  const trendData = useMemo(() => {
    const grouped = {};
    filteredOrders.forEach((o) => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      const total = Number(computeTotals(o.items).total);
      if (!grouped[dateStr]) grouped[dateStr] = 0;
      grouped[dateStr] += total;
    });

    return Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }))
      .reverse(); // oldest to newest for chart
  }, [filteredOrders]);

  // 2. Sales by Category (Donut)
  const categoryData = useMemo(() => {
    const grouped = {};
    // Pre-fill with 0 to ensure all categories appear if needed, but just mapping is fine.
    filteredOrders.forEach((o) => {
      o.items.forEach((it) => {
        const menuItem = menu.find((m) => m.id === it.foodId);
        const categoryName = menuItem ? menuItem.category : 'Other';
        const total = it.price * it.qty;
        if (!grouped[categoryName]) grouped[categoryName] = 0;
        grouped[categoryName] += total;
      });
    });
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));
  }, [filteredOrders, menu]);

  // 3. Top Selling Items
  const topItemsData = useMemo(() => {
    const counts = {};
    filteredOrders.forEach((o) => {
      o.items.forEach((it) => {
        if (!counts[it.name]) counts[it.name] = 0;
        counts[it.name] += it.qty;
      });
    });
    return Object.entries(counts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5); // top 5
  }, [filteredOrders]);

  // 4. Payment Method Distribution
  const paymentData = useMemo(() => {
    // Since payments aren't strictly tied to filtered orders in this demo, we mock
    // a proportional split based on the filtered order totals to keep charts realistic.
    const totalRevenue = stats.revenue;
    if (totalRevenue === 0) return [];
    
    // Approximate distribution from demo data
    return [
      { name: 'Cash', value: Number((totalRevenue * 0.4).toFixed(2)) },
      { name: 'Card', value: Number((totalRevenue * 0.35).toFixed(2)) },
      { name: 'Scan', value: Number((totalRevenue * 0.25).toFixed(2)) },
    ];
  }, [stats.revenue]);

  return (
    <div className="p-5 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-darkText">
            Reports & Analytics
          </h1>
          <p className="text-sm text-brand-mutedText">
            Live overview of your restaurant's performance.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl p-1 shadow-sm">
          {DATE_FILTERS.map((f) => {
            const active = dateFilter === f.key;
            return (
              <button
                type="button"
                key={f.key}
                onClick={() => setDateFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  active
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-mutedText hover:bg-brand-content'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Sales',
            value: `$${stats.revenue.toFixed(2)}`,
            Icon: DollarSign,
            accent: 'text-brand-primary',
            bg: 'bg-brand-primary/10',
          },
          {
            label: 'Total Orders',
            value: stats.totalOrders,
            Icon: ShoppingBag,
            accent: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Avg Order Value',
            value: `$${stats.aov.toFixed(2)}`,
            Icon: TrendingUp,
            accent: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Total Customers',
            value: customers.length,
            Icon: Users,
            accent: 'text-purple-600',
            bg: 'bg-purple-50',
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Sales Trend (Area) */}
        <div className="bg-white border border-brand-border rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-brand-darkText mb-4">
            Sales Trend
          </h3>
          <div className="h-64">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-brand-mutedText">
                No sales data for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16B8AC" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16B8AC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#757B86' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#757B86' }} tickFormatter={(val) => `$${val}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E8EC" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#16B8AC" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Payment Methods (Pie) */}
        <div className="bg-white border border-brand-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-brand-darkText mb-4">
            Payment Methods
          </h3>
          <div className="h-64 flex flex-col items-center">
            {paymentData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-brand-mutedText">
                No payment data.
              </div>
            ) : (
              <>
                <div className="w-full h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`$${value}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-2 space-y-1">
                  {paymentData.map((entry, index) => (
                    <div key={entry.name} className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-brand-mutedText">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {entry.name}
                      </span>
                      <span className="font-semibold text-brand-darkText">${entry.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Sales by Category (Donut) */}
        <div className="bg-white border border-brand-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-brand-darkText mb-4">
            Sales by Category
          </h3>
          <div className="h-64">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-brand-mutedText">
                No category data.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value}`, 'Sales']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Top Selling Items (Bar) */}
        <div className="bg-white border border-brand-border rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-brand-darkText mb-4">
            Top Selling Items
          </h3>
          <div className="h-64">
            {topItemsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-brand-mutedText">
                No item sales yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItemsData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6E8EC" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#757B86' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#151923', fontWeight: 500 }} width={100} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} sold`, 'Quantity']}
                    cursor={{ fill: '#F8F9FB' }}
                  />
                  <Bar dataKey="qty" fill="#16B8AC" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}