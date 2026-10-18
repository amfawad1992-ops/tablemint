export default function KitchenColumn({
  title,
  subtitle,
  count,
  accent,
  children,
  emptyMessage,
}) {
  return (
    <section className="flex flex-col min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${accent}`} />
            <h2 className="text-base font-bold text-brand-darkText truncate">
              {title}
            </h2>
            <span className="text-xs font-semibold text-brand-mutedText bg-white border border-brand-border rounded-full px-2 py-0.5 shrink-0">
              {count}
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-brand-mutedText mt-1 ml-4">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Column body */}
      <div className="flex-1 space-y-3 min-h-[200px]">
        {count === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white/50 py-12 flex items-center justify-center">
            <p className="text-xs text-brand-mutedText text-center px-4">
              {emptyMessage}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}