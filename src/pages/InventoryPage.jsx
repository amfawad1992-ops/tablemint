import { useMemo, useState } from 'react';
import { Plus, Search, Package, AlertTriangle, XCircle, DollarSign, Download } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import {
  INVENTORY_CATEGORIES,
  STOCK_STATUS_STYLES,
  getStockStatus,
} from '../data/demoData';
import { exportToCSV } from '../utils/csvExport';
import IngredientFormModal from '../components/inventory/IngredientFormModal';
import IngredientDetailDrawer from '../components/inventory/IngredientDetailDrawer';

const STATUS_FILTERS = ['All', 'OK', 'Low stock', 'Out of stock'];

export default function InventoryPage() {
  const { ingredients } = useInventory();

  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  };

  const stats = useMemo(() => {
    let low = 0;
    let out = 0;
    let totalValue = 0;
    ingredients.forEach((i) => {
      const s = getStockStatus(i);
      if (s === 'low') low++;
      if (s === 'out') out++;
      totalValue += i.currentStock * i.costPerUnit;
    });
    return {
      total: ingredients.length,
      low,
      out,
      totalValue,
    };
  }, [ingredients]);

  const statusCounts = useMemo(() => {
    const counts = { All: ingredients.length, OK: 0, 'Low stock': 0, 'Out of stock': 0 };
    ingredients.forEach((i) => {
      const s = getStockStatus(i);
      if (s === 'ok') counts.OK++;
      else if (s === 'low') counts['Low stock']++;
      else if (s === 'out') counts['Out of stock']++;
    });
    return counts;
  }, [ingredients]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients.filter((i) => {
      const s = getStockStatus(i);

      if (statusFilter !== 'All') {
        if (statusFilter === 'OK' && s !== 'ok') return false;
        if (statusFilter === 'Low stock' && s !== 'low') return false;
        if (statusFilter === 'Out of stock' && s !== 'out') return false;
      }

      if (categoryFilter !== 'All' && i.category !== categoryFilter) return false;

      if (q) {
        const matches =
          i.name.toLowerCase().includes(q) ||
          (i.sku || '').toLowerCase().includes(q) ||
          (i.supplier || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [ingredients, statusFilter, categoryFilter, search]);

  const selected = ingredients.find((i) => i.id === selectedId) ?? null;

  const handleExport = () => {
    const exportData = filtered.map((i) => ({
      'ID': i.id,
      'Name': i.name,
      'SKU': i.sku || '',
      'Category': i.category,
      'Stock': i.currentStock,
      'Unit': i.unit,
      'Reorder Level': i.reorderLevel,
      'Unit Cost': i.costPerUnit.toFixed(2),
      'Total Value': (i.currentStock * i.costPerUnit).toFixed(2),
      'Supplier': i.supplier || '',
      'Status': getStockStatus(i).toUpperCase(),
    }));
    exportToCSV(exportData, `Inventory_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">
              Inventory
            </h1>
            <p className="text-sm text-brand-mutedText">
              Track ingredients, stock levels, and movement history.
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
              Add Ingredient
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total items',
              value: stats.total,
              Icon: Package,
              accent: 'text-brand-darkText',
              bg: 'bg-brand-content',
            },
            {
              label: 'Low stock',
              value: stats.low,
              Icon: AlertTriangle,
              accent: 'text-amber-600',
              bg: 'bg-amber-50',
            },
            {
              label: 'Out of stock',
              value: stats.out,
              Icon: XCircle,
              accent: 'text-red-600',
              bg: 'bg-red-50',
            },
            {
              label: 'Total value',
              value: `$${stats.totalValue.toFixed(2)}`,
              Icon: DollarSign,
              accent: 'text-emerald-600',
              bg: 'bg-emerald-50',
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
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            <option value="All">All categories</option>
            {INVENTORY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or supplier"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-content text-left text-xs uppercase tracking-wide text-brand-mutedText">
                <tr>
                  <th className="px-4 py-3 font-medium">Ingredient</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                  <th className="px-4 py-3 font-medium text-right">Reorder</th>
                  <th className="px-4 py-3 font-medium text-right">Unit cost</th>
                  <th className="px-4 py-3 font-medium text-right">Value</th>
                  <th className="px-4 py-3 font-medium">Supplier</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-brand-mutedText"
                    >
                      No ingredients match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((i) => {
                  const status = getStockStatus(i);
                  const value = i.currentStock * i.costPerUnit;
                  return (
                    <tr
                      key={i.id}
                      onClick={() => setSelectedId(i.id)}
                      className="border-t border-brand-border hover:bg-brand-content/60 cursor-pointer transition"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-brand-darkText">
                          {i.name}
                        </div>
                        {i.sku && (
                          <div className="text-[10px] text-brand-mutedText">
                            {i.sku}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText">
                        {i.category}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-darkText whitespace-nowrap">
                        {i.currentStock}{' '}
                        <span className="text-[11px] text-brand-mutedText font-normal">
                          {i.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-brand-mutedText whitespace-nowrap">
                        {i.reorderLevel} {i.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-brand-mutedText whitespace-nowrap">
                        ${i.costPerUnit.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-brand-darkText whitespace-nowrap">
                        ${value.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-brand-mutedText truncate max-w-[140px]">
                        {i.supplier || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            STOCK_STATUS_STYLES[status]
                          }`}
                        >
                          {status === 'ok'
                            ? 'OK'
                            : status === 'low'
                            ? 'Low'
                            : 'Out'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <IngredientFormModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            showToast('success', 'Ingredient added.');
          }}
        />
      )}

      {editing && (
        <IngredientFormModal
          ingredient={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            showToast('success', 'Ingredient updated.');
          }}
        />
      )}

      {selected && (
        <IngredientDetailDrawer
          ingredient={selected}
          onEdit={() => {
            setEditing(selected);
            setSelectedId(null);
          }}
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