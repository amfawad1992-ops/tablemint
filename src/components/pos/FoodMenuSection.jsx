import FoodCard from './FoodCard';

export default function FoodMenuSection({
  categories,
  categoryCounts,
  activeCategory,
  onCategoryChange,
  items,
  getQty,
  onUpdateQty,
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-brand-darkText mb-3">Food Menu</h2>

      <div className="flex items-center gap-6 border-b border-brand-border mb-5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              type="button"
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`relative pb-3 whitespace-nowrap text-sm font-medium transition ${
                active
                  ? 'text-brand-primary'
                  : 'text-brand-mutedText hover:text-brand-darkText'
              }`}
            >
              {cat}{' '}
              <span className="text-xs opacity-80">
                ({categoryCounts[cat] ?? 0})
              </span>
              {active && (
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-brand-mutedText py-4">
          No items match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => {
            const qty = getQty(item.id);
            return (
              <FoodCard
                key={item.id}
                item={item}
                qty={qty}
                onIncrement={() => onUpdateQty(item, 1)}
                onDecrement={() => onUpdateQty(item, -1)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}