import {
  X,
  Phone,
  Users,
  CalendarDays,
  Clock,
  StickyNote,
  Trash2,
  Pencil,
  Table2,
} from 'lucide-react';
import { useReservations } from '../../context/ReservationsContext';
import { useTables } from '../../context/TablesContext';
import {
  RESERVATION_STATUSES,
  RESERVATION_STATUS_STYLES,
  formatDateLabel,
} from '../../data/demoData';

export default function ReservationDetailDrawer({
  reservation,
  onEdit,
  onClose,
}) {
  const { changeReservationStatus, removeReservation, updateReservation } =
    useReservations();
  const { tables } = useTables();

  const currentTable = reservation.tableId
    ? tables.find((t) => t.id === reservation.tableId) ?? null
    : null;

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete reservation for "${reservation.name}"? This cannot be undone.`
      )
    ) {
      removeReservation(reservation.id);
      onClose();
    }
  };

  const handleTableChange = (e) => {
    const value = e.target.value;
    updateReservation(reservation.id, { tableId: value || null });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

      <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-mutedText font-semibold">
              Reservation
            </p>
            <h2 className="text-lg font-bold text-brand-darkText leading-tight">
              {reservation.name}
            </h2>
            <p className="text-xs text-brand-mutedText mt-0.5">
              ID: {reservation.id}
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
          {/* Status card */}
          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-brand-mutedText">
                Current status
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  RESERVATION_STATUS_STYLES[reservation.status] ??
                  'bg-gray-100 text-gray-600'
                }`}
              >
                {reservation.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {RESERVATION_STATUSES.map((s) => {
                const active = reservation.status === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() =>
                      changeReservationStatus(reservation.id, s)
                    }
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                      active
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-2 ring-brand-primary/20'
                        : 'border-brand-border bg-white text-brand-mutedText hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[11px] text-brand-mutedText mb-0.5 inline-flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Date
              </p>
              <p className="font-semibold text-brand-darkText">
                {formatDateLabel(reservation.date)}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[11px] text-brand-mutedText mb-0.5 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time
              </p>
              <p className="font-semibold text-brand-darkText">
                {reservation.time}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[11px] text-brand-mutedText mb-0.5 inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> Guests
              </p>
              <p className="font-semibold text-brand-darkText">
                {reservation.guests}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5">
              <p className="text-[11px] text-brand-mutedText mb-0.5 inline-flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </p>
              <p className="font-semibold text-brand-darkText truncate">
                {reservation.phone || '—'}
              </p>
            </div>
          </div>

          {/* Table assignment */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1.5">
              <Table2 className="w-3.5 h-3.5" />
              Assigned table
            </label>
            <select
              value={reservation.tableId || ''}
              onChange={handleTableChange}
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            >
              <option value="">— No table assigned —</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.id} · {t.seats} seats · {t.floor}
                </option>
              ))}
            </select>
            {currentTable && (
              <p className="mt-2 text-[11px] text-brand-mutedText">
                Seats: {currentTable.seats} · Floor: {currentTable.floor} ·
                Status: {currentTable.status}
              </p>
            )}
          </div>

          {/* Request */}
          {reservation.request ? (
            <div>
              <p className="text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Special request
              </p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <p className="text-sm text-amber-800 leading-snug">
                  {reservation.request}
                </p>
              </div>
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
              Delete reservation
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}