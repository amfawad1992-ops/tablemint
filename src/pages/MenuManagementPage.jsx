import { useMemo, useState } from 'react';
import { Plus, Search, FolderCog } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import MenuItemCard from '../components/menu/MenuItemCard';
import MenuItemFormModal from '../components/menu/MenuItemFormModal';
import CategoryManagerModal from '../components/menu/CategoryManagerModal';

const AVAILABILITY_FILTERS = ['All', 'Available', 'Sold out'];
const SORTS = [
  { key: 'name-asc', label: 'Name A → Z' },
  { key: 'name-desc', label: 'Name Z → A' },
  { key: 'price-asc', label: 'Price low → high' },
  { key: 'price-desc', label: 'Price high → low' },
];

export default function MenuManagementPage() {
  const { menu, categories, removeMenuItem, toggleAvailability, toggleFeatured } =
    useMenu();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [sortKey, setSortKey] = useState('name-asc');

  const [editingItem, setEditingItem] = useState(null); // menu item or null
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = menu.filter((it) => {
      const catOk = categoryFilter === 'All' || it.category === categoryFilter;
      const availOk =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'Available' && it.available) ||
        (availabilityFilter === 'Sold out' && !it.available);
      const searchOk =
        q === '' ||
        it.name.toLowerCase().includes(q) ||
        (it.description || '').toLowerCase().includes(q);
      return catOk && availOk && searchOk;
    });

    list = [...list];
    switch (sortKey) {
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [menu, search, categoryFilter, availabilityFilter, sortKey]);

  const availableCount = menu.filter((i) => i.available).length;
  const soldOutCount = menu.length - availableCount;

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      removeMenuItem(item.id);
    }
  };

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">
              Menu Management
            </h1>
            <p className="text-sm text-brand-mutedText">
              {menu.length} item{menu.length === 1 ? '' : 's'} across{' '}
              {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} ·{' '}
              {availableCount} available
              {soldOutCount > 0 ? ` · ${soldOutCount} sold out` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-mutedText text-sm font-medium hover:border-gray-300 transition"
            >
              <FolderCog className="w-4 h-4" />
              Manage Categories
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or description"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            {AVAILABILITY_FILTERS.map((a) => (
              <option key={a} value={a}>
                {a === 'All'
                  ? 'All availability'
                  : a === 'Available'
                  ? 'Available'
                  : 'Sold out'}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-xl py-14 text-center">
            <p className="text-sm text-brand-mutedText">
              {menu.length === 0
                ? 'No items yet. Click "Add Item" to create the first one.'
                : 'No items match the current filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDelete(item)}
                onToggleAvailability={() => toggleAvailability(item.id)}
                onToggleFeatured={() => toggleFeatured(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAddModal && (
        <MenuItemFormModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingItem && (
        <MenuItemFormModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => setEditingItem(null)}
        />
      )}

      {/* Category manager */}
      {showCategoryModal && (
        <CategoryManagerModal onClose={() => setShowCategoryModal(false)} />
      )}
    </>
  );
}