import { formatTimeAgo } from '../../data/demoData';

const statusStyles = {
  'In Kitchen': 'bg-emerald-100 text-emerald-700',
  'Wait List': 'bg-orange-100 text-orange-700',
  Ready: 'bg-violet-100 text-violet-700',
  Served: 'bg-teal-100 text-teal-700',
  New: 'bg-slate-100 text-slate-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const cardBgStyles = {
  mint: 'bg-emerald-50',
  peach: 'bg-orange-50',
  lavender: 'bg-violet-50',
  blue: 'bg-sky-50',
  pink: 'bg-pink-50',
};

export default function OrderCard({ order, isActive, onClick }) {
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl p-2.5 border transition flex flex-col justify-between gap-1.5 ${
        cardBgStyles[order.cardBg] ?? 'bg-gray-50'
      } ${
        isActive
          ? 'border-brand-primary ring-2 ring-brand-primary/20'
          : 'border-transparent hover:border-brand-border'
      }`}
    >
      <div className="min-w-0">
        {/* Order ID */}
        <p className="text-[12px] font-bold text-brand-darkText truncate">
          Order #{order.id}
        </p>

        {/* Table and Items */}
        <div className="flex items-center justify-between gap-1 text-[10px] text-brand-mutedText mt-0.5">
          <span className="truncate">
            {order.table === '—' ? 'Takeaway' : `Table ${order.table}`}
          </span>
          <span className="shrink-0 font-medium">
            {itemCount}X
          </span>
        </div>
      </div>

      {/* Time and Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5">
        <span className="text-[9px] text-brand-mutedText whitespace-nowrap shrink-0">
          {formatTimeAgo(order.createdAt)}
        </span>
        <span
          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 ${
            statusStyles[order.status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {order.status}
        </span>
      </div>
    </button>
  );
}