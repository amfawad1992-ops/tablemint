import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTables } from '../context/TablesContext';
import { useOrders } from '../context/OrdersContext';
import TableCard from '../components/tables/TableCard';
import TableDetailDrawer from '../components/tables/TableDetailDrawer';
import AddTableModal from '../components/tables/AddEditTableModal';
import {
  TABLE_STATUSES,
  TABLE_STATUS_PILL,
  FLOORS,
} from '../data/demoData';

export default function TablesPage() {
  const { tables } = useTables();
  const { orders } = useOrders();

  const [statusFilter, setStatusFilter] = useState('All');
  const [floorFilter, setFloorFilter] = useState('All');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { All: tables.length };
    TABLE_STATUSES.forEach((s) => {
      counts[s] = tables.filter((t) => t.status === s).length;
    });
    return counts;
  }, [tables]);

  // Filtered tables
  const filtered = useMemo(() => {
    return tables.filter((t) => {
      const statusMatch = statusFilter === 'All' || t.status === statusFilter;
      const floorMatch = floorFilter === 'All' || t.floor === floorFilter;
      return statusMatch && floorMatch;
    });
  }, [tables, statusFilter, floorFilter]);

  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null;

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">Tables</h1>
            <p className="text-sm text-brand-mutedText">
              Live view of every table — status, guests, and linked orders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
          >
            <Plus className="w-4 h-4" />
            Add Table
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TABLE_STATUSES.map((s) => (
            <div
              key={s}
              className="bg-white border border-brand-border rounded-xl px-3 py-2.5"
            >
              <p className="text-[11px] text-brand-mutedText mb-1 truncate">
                {s}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-brand-darkText">
                  {statusCounts[s] ?? 0}
                </p>
                <span
                  className={`w-2 h-2 rounded-full ${
                    TABLE_STATUS_PILL[s]?.split(' ')[0] ?? 'bg-gray-300'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', ...TABLE_STATUSES].map((s) => {
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

        {/* Floor filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-brand-mutedText">Floor</label>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            <option value="All">All floors</option>
            {FLOORS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-xl py-14 text-center">
            <p className="text-sm text-brand-mutedText">
              No tables match the current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((t) => {
              const order = t.currentOrderId
                ? orders.find((o) => o.id === t.currentOrderId) ?? null
                : null;
              return (
                <TableCard
                  key={t.id}
                  table={t}
                  order={order}
                  isActive={selectedTableId === t.id}
                  onClick={() => setSelectedTableId(t.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedTable && (
        <TableDetailDrawer
          table={selectedTable}
          onClose={() => setSelectedTableId(null)}
        />
      )}

      {/* Add modal */}
      {showAdd && (
        <AddTableModal
          onClose={() => setShowAdd(false)}
          onCreated={(t) => {
            setShowAdd(false);
            setSelectedTableId(t.id);
          }}
        />
      )}
    </>
  );
}