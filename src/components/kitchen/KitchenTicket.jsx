import { Users, StickyNote, Clock, MapPin } from 'lucide-react';
import {
  formatElapsed,
  getPriority,
  PRIORITY_STYLES,
  statusStyles,
} from '../../data/demoData';

export default function KitchenTicket({ order, primaryAction, secondaryAction }) {
  const priority = getPriority(order.createdAt);
  const styles = PRIORITY_STYLES[priority];
  const totalItems = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <article
      className={`bg-white rounded-2xl ring-2 ${styles.ring} shadow-sm overflow-hidden flex flex-col`}
    >
      {/* Header band */}
      <div className={`${styles.headerBg} px-4 py-3 flex items-center justify-between gap-3`}>
        <div className="min-w-0">
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${styles.headerText}`}>
            Order
          </p>
          <p className="text-lg font-bold text-brand-darkText leading-tight truncate">
            #{order.id}
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${styles.timeBg}`}>
          <Clock className="inline-block w-3 h-3 mr-1 -mt-0.5" />
          {formatElapsed(order.createdAt)}
        </span>
      </div>

      {/* Meta row */}
      <div className="px-4 pt-3 flex items-center justify-between gap-2 text-[12px] text-brand-mutedText">
        <span className="inline-flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {order.table === '—' ? order.type : `Table ${order.table}`}
        </span>
        <span className="inline-flex items-center gap-1.5 shrink-0">
          <Users className="w-3.5 h-3.5" />
          {order.people}
        </span>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
            statusStyles[order.status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Notes */}
      {order.notes ? (
        <div className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 flex gap-2">
          <StickyNote className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[12px] font-medium text-amber-800 leading-snug">
            {order.notes}
          </p>
        </div>
      ) : null}

      {/* Items list */}
      <div className="px-4 py-3 mt-1 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-mutedText mb-2">
          {totalItems} item{totalItems === 1 ? '' : 's'}
        </p>
        <ul className="space-y-1.5">
          {order.items.map((it) => (
            <li
              key={it.foodId}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="text-brand-darkText leading-snug">
                <span className="inline-block min-w-[24px] text-brand-primary font-bold">
                  {it.qty}×
                </span>
                {it.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="p-3 pt-0 flex items-center gap-2">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-3 py-2.5 rounded-xl border border-brand-border text-xs font-medium text-brand-mutedText hover:bg-gray-50 transition whitespace-nowrap"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="flex-1 px-3 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      )}
    </article>
  );
}