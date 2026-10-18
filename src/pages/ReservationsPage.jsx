import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useReservations } from '../context/ReservationsContext';
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_STYLES,
  formatDateLabel,
} from '../data/demoData';
import NewReservationModal from '../components/reservations/NewReservationModal';
import ReservationDetailDrawer from '../components/reservations/ReservationDetailDrawer';

const todayISO = () => new Date().toISOString().slice(0, 10);
const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const DATE_FILTERS = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'all', label: 'All' },
];

export default function ReservationsPage() {
  const {
    reservations,
    changeReservationStatus,
  } = useReservations();

  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const today = todayISO();
  const tomorrow = tomorrowISO();

  // Stat counts
  const statCounts = useMemo(() => {
    return {
      Total: reservations.length,
      Pending: reservations.filter((r) => r.status === 'Pending').length,
      Confirmed: reservations.filter((r) => r.status === 'Confirmed').length,
      Seated: reservations.filter((r) => r.status === 'Seated').length,
      Cancelled: reservations.filter((r) => r.status === 'Cancelled').length,
    };
  }, [reservations]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations
      .filter((r) => {
        // Date filter
        if (dateFilter === 'today' && r.date !== today) return false;
        if (dateFilter === 'tomorrow' && r.date !== tomorrow) return false;
        if (dateFilter === 'upcoming' && r.date < today) return false;
        if (dateFilter === 'past' && r.date >= today) return false;

        // Status filter
        if (statusFilter !== 'All' && r.status !== statusFilter) return false;

        // Search
        if (q) {
          const matches =
            r.name.toLowerCase().includes(q) ||
            (r.phone || '').toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by date, then time
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        return a.time < b.time ? -1 : 1;
      });
  }, [reservations, dateFilter, statusFilter, search, today, tomorrow]);

  const selected = reservations.find((r) => r.id === selectedId) ?? null;

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">
              Reservations
            </h1>
            <p className="text-sm text-brand-mutedText">
              Manage bookings, seating, and table allocation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
          >
            <Plus className="w-4 h-4" />
            New Reservation
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: statCounts.Total, dot: 'bg-slate-400' },
            { label: 'Pending', value: statCounts.Pending, dot: 'bg-amber-500' },
            { label: 'Confirmed', value: statCounts.Confirmed, dot: 'bg-blue-500' },
            { label: 'Seated', value: statCounts.Seated, dot: 'bg-emerald-500' },
            { label: 'Cancelled', value: statCounts.Cancelled, dot: 'bg-red-500' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-brand-border rounded-xl px-3 py-2.5"
            >
              <p className="text-[11px] text-brand-mutedText mb-1 truncate">
                {s.label}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-brand-darkText">
                  {s.value}
                </p>
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Date filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {DATE_FILTERS.map((f) => {
            const active = dateFilter === f.key;
            return (
              <button
                type="button"
                key={f.key}
                onClick={() => setDateFilter(f.key)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${
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

        {/* Status chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', ...RESERVATION_STATUSES].map((s) => {
            const active = statusFilter === s;
            const count =
              s === 'All'
                ? reservations.length
                : reservations.filter((r) => r.status === s).length;
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
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or reservation ID"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-content text-left text-xs uppercase tracking-wide text-brand-mutedText">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-brand-mutedText"
                    >
                      No reservations match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className="border-t border-brand-border hover:bg-brand-content/60 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 font-semibold text-brand-darkText">
                      #{r.id}
                    </td>
                    <td className="px-4 py-3 text-brand-darkText">
                      <div className="font-medium">{r.name}</div>
                      {r.request && (
                        <div className="text-[11px] text-brand-mutedText truncate max-w-[220px]">
                          {r.request}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-mutedText">
                      <div>{formatDateLabel(r.date)}</div>
                      <div className="text-[11px]">{r.time}</div>
                    </td>
                    <td className="px-4 py-3 text-brand-mutedText">
                      {r.guests}
                    </td>
                    <td className="px-4 py-3 text-brand-mutedText">
                      {r.tableId ? `Table ${r.tableId}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          RESERVATION_STATUS_STYLES[r.status] ??
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-mutedText whitespace-nowrap">
                      {r.phone || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions from row context — only if selection exists */}
        {selected && (
          <div className="text-[11px] text-brand-mutedText">
            Tip: click a row to open details, or use the drawer to change
            status.
          </div>
        )}
      </div>

      {/* New modal */}
      {showNewModal && (
        <NewReservationModal
          onClose={() => setShowNewModal(false)}
          onSaved={() => setShowNewModal(false)}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <NewReservationModal
          reservation={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}

      {/* Detail drawer */}
      {selected && (
        <ReservationDetailDrawer
          reservation={selected}
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