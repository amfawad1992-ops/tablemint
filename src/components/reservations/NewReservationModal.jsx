import { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useReservations } from '../../context/ReservationsContext';
import { useTables } from '../../context/TablesContext';
import {
  RESERVATION_STATUSES,
  RESERVATION_TIME_SLOTS,
  hasReservationConflict,
} from '../../data/demoData';

const todayISO = () => new Date().toISOString().slice(0, 10);

const empty = {
  name: '',
  phone: '',
  date: todayISO(),
  time: '19:00',
  guests: 2,
  tableId: '',
  request: '',
  status: 'Pending',
};

export default function NewReservationModal({ reservation, onClose, onSaved }) {
  const { reservations, addReservation, updateReservation } = useReservations();
  const { tables } = useTables();
  const isEditing = !!reservation;

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);

  useEffect(() => {
    if (reservation) {
      setForm({
        name: reservation.name || '',
        phone: reservation.phone || '',
        date: reservation.date || todayISO(),
        time: reservation.time || '19:00',
        guests: reservation.guests ?? 2,
        tableId: reservation.tableId || '',
        request: reservation.request || '',
        status: reservation.status || 'Pending',
      });
    } else {
      setForm({ ...empty, date: todayISO() });
    }
  }, [reservation]);

  // Live conflict check whenever table/date/time changes
  useEffect(() => {
    if (!form.tableId) {
      setConflict(null);
      return;
    }
    const c = hasReservationConflict(
      {
        tableId: form.tableId,
        date: form.date,
        time: form.time,
      },
      reservations,
      reservation?.id ?? null
    );
    setConflict(c);
  }, [form.tableId, form.date, form.time, reservations, reservation]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!form.date) {
      setError('Date is required.');
      return;
    }
    if (!form.time) {
      setError('Time is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      date: form.date,
      time: form.time,
      guests: Math.max(1, Number(form.guests) || 1),
      tableId: form.tableId || null,
      request: form.request.trim(),
      status: form.status,
    };

    if (isEditing) {
      updateReservation(reservation.id, payload);
    } else {
      addReservation(payload);
    }
    onSaved?.();
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <h2 className="text-base font-bold text-brand-darkText">
            {isEditing ? `Edit — ${reservation.name}` : 'New Reservation'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-brand-mutedText" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Name + phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Guest name"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+92 ..."
                className={inputCls}
              />
            </div>
          </div>

          {/* Date + time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Time *
              </label>
              <select
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
                className={inputCls}
              >
                {RESERVATION_TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests + status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Guests
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.guests}
                onChange={(e) => set('guests', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className={inputCls}
              >
                {RESERVATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Assign table (optional)
            </label>
            <select
              value={form.tableId}
              onChange={(e) => set('tableId', e.target.value)}
              className={inputCls}
            >
              <option value="">— No table assigned —</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.id} · {t.seats} seats · {t.floor}
                </option>
              ))}
            </select>
          </div>

          {/* Conflict warning */}
          {conflict && (
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Possible conflict</p>
                <p className="mt-0.5">
                  Table {conflict.tableId} is already booked at{' '}
                  {conflict.time} on this date for {conflict.name}. You can
                  still save, but double-check the timing.
                </p>
              </div>
            </div>
          )}

          {/* Request */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Special request (optional)
            </label>
            <textarea
              value={form.request}
              onChange={(e) => set('request', e.target.value)}
              rows={2}
              placeholder="e.g. Window seat, birthday, allergies..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-brand-border text-sm font-medium text-brand-mutedText hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
            >
              {isEditing ? 'Save changes' : 'Create reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}