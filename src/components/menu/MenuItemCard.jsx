import { Pencil, Trash2, Star, Eye, EyeOff, Clock } from 'lucide-react';
import { DEFAULT_MENU_IMAGE } from '../../data/demoData';

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
}) {
  const img = item.image || DEFAULT_MENU_IMAGE;

  return (
    <article className="bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={img}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {!item.available && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-white text-[11px] font-bold bg-red-500 px-2.5 py-1 rounded-full">
              SOLD OUT
            </span>
          </div>
        )}

        {item.featured && item.available && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm inline-flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-900" />
            FEATURED
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex-1 flex flex-col gap-2.5">
        <div>
          <h3 className="text-sm font-semibold text-brand-darkText truncate">
            {item.name}
          </h3>
          <p className="text-[11px] text-brand-mutedText line-clamp-2 min-h-[28px] mt-0.5">
            {item.description || 'No description'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-brand-darkText">
            ${item.price.toFixed(2)}
          </span>
          <span className="text-[10px] bg-gray-100 text-brand-mutedText px-2 py-0.5 rounded-full whitespace-nowrap">
            {item.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-brand-mutedText">
          <Clock className="w-3 h-3" />
          {item.prepTime} min prep
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-1 pt-2 mt-auto border-t border-brand-border">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleAvailability}
              title={item.available ? 'Mark as sold out' : 'Mark as available'}
              className={`p-1.5 rounded-lg transition ${
                item.available
                  ? 'text-emerald-600 hover:bg-emerald-50'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              {item.available ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onToggleFeatured}
              title={item.featured ? 'Remove featured' : 'Mark as featured'}
              className={`p-1.5 rounded-lg transition ${
                item.featured
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-500' : ''}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              title="Edit item"
              className="p-1.5 rounded-lg text-brand-mutedText hover:bg-gray-100 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Delete item"
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}