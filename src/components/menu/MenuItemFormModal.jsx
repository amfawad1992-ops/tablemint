import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { DEFAULT_MENU_IMAGE } from '../../data/demoData';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  prepTime: 10,
  available: true,
  featured: false,
};

export default function MenuItemFormModal({ item, onClose, onSaved }) {
  const { categories, addMenuItem, updateMenuItem } = useMenu();
  const isEditing = !!item;

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: String(item.price ?? ''),
        category: item.category || categories[0]?.name || '',
        image: item.image || '',
        prepTime: item.prepTime ?? 10,
        available: item.available !== false,
        featured: !!item.featured,
      });
    } else {
      setForm({
        ...emptyForm,
        category: categories[0]?.name || '',
      });
    }
  }, [item, categories]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Item name is required.');
      return;
    }
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      setError('Price must be a valid number (0 or greater).');
      return;
    }
    if (!form.category) {
      setError('Please pick a category.');
      return;
    }

    if (isEditing) {
      updateMenuItem(item.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        image: form.image.trim(),
        prepTime: Number(form.prepTime) || 0,
        available: form.available,
        featured: form.featured,
      });
    } else {
      addMenuItem({
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        image: form.image.trim(),
        prepTime: Number(form.prepTime) || 0,
        available: form.available,
        featured: form.featured,
      });
    }
    onSaved?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <h2 className="text-base font-bold text-brand-darkText">
            {isEditing ? `Edit — ${item.name}` : 'Add Menu Item'}
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

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto"
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Item name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Grilled Salmon Steak"
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Short description shown on the menu..."
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
            />
          </div>

          {/* Price + Prep time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Prep time (min)
              </label>
              <input
                type="number"
                min="0"
                value={form.prepTime}
                onChange={(e) => set('prepTime', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            >
              {categories.length === 0 && (
                <option value="">No categories yet</option>
              )}
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Image URL (optional)
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
            <div className="mt-2 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={form.image || DEFAULT_MENU_IMAGE}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_MENU_IMAGE;
                  }}
                />
              </div>
              <p className="text-[11px] text-brand-mutedText">
                Preview · falls back to a default if the URL is broken.
              </p>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-brand-darkText cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => set('available', e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/40"
              />
              Available
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-brand-darkText cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/40"
              />
              Featured
            </label>
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
              {isEditing ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}