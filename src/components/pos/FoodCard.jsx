import { Plus, Minus } from 'lucide-react';

export default function FoodCard({ item, qty, onIncrement, onDecrement }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-100 mb-4 ring-1 ring-brand-border">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-sm font-semibold text-brand-darkText min-h-[40px] flex items-center justify-center px-2">
        {item.name}
      </h3>

      <p className="text-base font-bold text-brand-darkText mt-1 mb-4">
        ${item.price.toFixed(2)}
      </p>

      <div className="flex items-center justify-center gap-3 mt-auto">
        <button
          type="button"
          onClick={onDecrement}
          disabled={qty === 0}
          aria-label={`Remove one ${item.name}`}
          className="w-9 h-9 rounded-lg bg-gray-100 text-brand-darkText flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-6 text-center text-sm font-bold text-brand-darkText">
          {qty}
        </span>

        <button
          type="button"
          onClick={onIncrement}
          aria-label={`Add one ${item.name}`}
          className="w-9 h-9 rounded-lg bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primaryHover transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}