import { useState } from 'react';
import { X, Pencil, Trash2, Check, Plus, AlertCircle } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';

export default function CategoryManagerModal({ onClose }) {
  const { categories, menu, addCategory, renameCategory, removeCategory } =
    useMenu();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  const itemCount = (name) =>
    menu.filter((i) => i.category === name).length;

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');
    const clean = newName.trim();
    if (!clean) return;
    if (
      categories.some((c) => c.name.toLowerCase() === clean.toLowerCase())
    ) {
      setError('That category already exists.');
      return;
    }
    const created = addCategory(clean);
    if (created) setNewName('');
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.name);
    setError('');
  };

  const commitEdit = (c) => {
    const clean = editName.trim();
    if (!clean) return;
    if (
      categories.some(
        (x) => x.id !== c.id && x.name.toLowerCase() === clean.toLowerCase()
      )
    ) {
      setError('That name is already used by another category.');
      return;
    }
    renameCategory(c.id, clean);
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (c) => {
    const count = itemCount(c.name);
    if (count > 0) {
      setError(
        `Cannot delete "${c.name}" — ${count} item${count === 1 ? '' : 's'} still use it. Move them first.`
      );
      return;
    }
    if (window.confirm(`Delete category "${c.name}"?`)) {
      removeCategory(c.id);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <h2 className="text-base font-bold text-brand-darkText">
            Manage Categories
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

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Add new */}
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name..."
              className="flex-1 px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* List */}
          <ul className="divide-y divide-brand-border border border-brand-border rounded-xl overflow-hidden">
            {categories.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-brand-mutedText">
                No categories yet — add the first one above.
              </li>
            )}
            {categories.map((c) => {
              const count = itemCount(c.name);
              const isEditing = editingId === c.id;
              return (
                <li
                  key={c.id}
                  className="flex items-center gap-2 px-3 py-2.5 bg-white"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit(c);
                          if (e.key === 'Escape') {
                            setEditingId(null);
                            setError('');
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-brand-primary bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      />
                      <button
                        type="button"
                        onClick={() => commitEdit(c)}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setError('');
                        }}
                        className="p-2 rounded-lg text-brand-mutedText hover:bg-gray-100 transition"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-brand-darkText truncate">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-brand-mutedText whitespace-nowrap">
                        {count} item{count === 1 ? '' : 's'}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="p-2 rounded-lg text-brand-mutedText hover:bg-gray-100 transition"
                        title="Rename"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className={`p-2 rounded-lg transition ${
                          count > 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                        title={
                          count > 0
                            ? 'Cannot delete while items use this category'
                            : 'Delete category'
                        }
                        disabled={count > 0}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="text-[11px] text-brand-mutedText">
            Renaming a category updates every item that uses it automatically.
          </p>
        </div>
      </div>
    </div>
  );
}