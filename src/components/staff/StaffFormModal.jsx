import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';
import { STAFF_ROLES, STAFF_SHIFTS } from '../../data/demoData';

const empty = {
  name: '',
  email: '',
  phone: '',
  role: 'Waiter',
  shift: 'Morning',
  active: true,
};

export default function StaffFormModal({ staffMember, onClose, onSaved }) {
  const { addStaff, updateStaff } = useStaff();
  const isEditing = !!staffMember;

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (staffMember) {
      setForm({
        name: staffMember.name || '',
        email: staffMember.email || '',
        phone: staffMember.phone || '',
        role: staffMember.role || 'Waiter',
        shift: staffMember.shift || 'Morning',
        active: staffMember.active !== false,
      });
    } else {
      setForm(empty);
    }
  }, [staffMember]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Staff name is required.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setError('A valid email is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      shift: form.shift,
      active: form.active,
    };

    if (isEditing) updateStaff(staffMember.id, payload);
    else addStaff(payload);
    onSaved?.();
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <h2 className="text-base font-bold text-brand-darkText">
            {isEditing ? `Edit — ${staffMember.name}` : 'Add Staff Member'}
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Full name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Ali Raza"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="name@example.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+92 ..."
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                className={inputCls}
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Shift
              </label>
              <select
                value={form.shift}
                onChange={(e) => set('shift', e.target.value)}
                className={inputCls}
              >
                {STAFF_SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-brand-darkText cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set('active', e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/40"
              />
              Account is active
            </label>
            <p className="text-[11px] text-brand-mutedText mt-1 ml-6">
              Inactive staff cannot log in and are hidden from most views.
            </p>
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
              {isEditing ? 'Save changes' : 'Add staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}