import { Users, MapPin } from 'lucide-react';
import {
  TABLE_STATUS_STYLES,
  TABLE_STATUS_PILL,
  computeTotals,
} from '../../data/demoData';

export default function TableCard({ table, order, isActive, onClick }) {
  const cardBg = TABLE_STATUS_STYLES[table.status] ?? 'bg-gray-50';
  const pillStyle = TABLE_STATUS_PILL[table.status] ?? 'bg-gray-100 text-gray-600';
  const isOccupied = table.status === 'Occupied';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border-2 p-4 transition hover:shadow-md flex flex-col gap-3 ${cardBg} ${
        isActive ? 'ring-2 ring-brand-primary' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-brand-mutedText font-semibold">
            Table
          </p>
          <p className="text-2xl font-bold text-brand-darkText leading-tight">
            #{table.id}
          </p>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${pillStyle}`}
        >
          {table.status}
        </span>
      </div>

      {/* Seats + floor */}
      <div className="flex items-center gap-3 text-[11px] text-brand-mutedText">
        <span className="inline-flex items-center gap-1">
          <Users className="w-3 h-3" />
          {table.seats} seats
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{table.floor}</span>
        </span>
      </div>

      {/* Order summary (if occupied with order) */}
      {isOccupied && order && (
        <div className="border-t border-white/70 pt-2.5 mt-auto">
          <p className="text-[12px] font-bold text-brand-darkText truncate">
            Order #{order.id}
          </p>
          <p className="text-[11px] text-brand-mutedText truncate">
            {table.guestCount || order.people} guests · ${computeTotals(order.items).total}
          </p>
        </div>
      )}

      {isOccupied && !order && (
        <div className="border-t border-white/70 pt-2.5 mt-auto">
          <p className="text-[11px] text-brand-mutedText">
            Occupied — no linked order
          </p>
        </div>
      )}

      {/* Note (if not occupied) */}
      {!isOccupied && table.note && (
        <div className="border-t border-white/70 pt-2.5 mt-auto">
          <p className="text-[11px] text-brand-mutedText line-clamp-2">
            {table.note}
          </p>
        </div>
      )}

      {/* Empty spacer so all cards look equal height when nothing else */}
      {!isOccupied && !table.note && (
        <div className="mt-auto" />
      )}
    </button>
  );
}