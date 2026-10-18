import {
  X,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Clock,
  Power,
} from 'lucide-react';
import { useStaff } from '../../context/StaffContext';
import {
  STAFF_ROLES,
  STAFF_ROLE_STYLES,
  STAFF_SHIFT_STYLES,
  STAFF_SHIFTS,
} from '../../data/demoData';

export default function StaffDetailDrawer({
  staffMember,
  onEdit,
  onClose,
}) {
  const { updateStaff, removeStaff, toggleActive } = useStaff();

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete ${staffMember.name}? Their account and history will be permanently removed.`
      )
    ) {
      removeStaff(staffMember.id);
      onClose();
    }
  };

  const roleBadge = STAFF_ROLE_STYLES[staffMember.role] ?? 'bg-gray-100 text-gray-700';
  const shiftBadge =
    STAFF_SHIFT_STYLES[staffMember.shift] ?? 'bg-gray-50 text-gray-600';

  const memberSince = new Date(staffMember.joinedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

      <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-mutedText font-semibold">
              Staff Member
            </p>
            <h2 className="text-lg font-bold text-brand-darkText leading-tight">
              {staffMember.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge}`}
              >
                {staffMember.role}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  staffMember.active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
              >
                {staffMember.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit"
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <Pencil className="w-4 h-4 text-brand-mutedText" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4 text-brand-mutedText" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Contact */}
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-mutedText shrink-0" />
              <p className="text-sm text-brand-darkText truncate">
                {staffMember.email || '—'}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-mutedText shrink-0" />
              <p className="text-sm text-brand-darkText truncate">
                {staffMember.phone || '—'}
              </p>
            </div>
            <div className="rounded-lg bg-brand-content border border-brand-border px-3 py-2.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-mutedText shrink-0" />
              <p className="text-sm text-brand-darkText">
                Joined {memberSince}
              </p>
            </div>
          </div>

          {/* Role & shift */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Role
              </label>
              <select
                value={staffMember.role}
                onChange={(e) =>
                  updateStaff(staffMember.id, { role: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> Shift
              </label>
              <select
                value={staffMember.shift}
                onChange={(e) =>
                  updateStaff(staffMember.id, { shift: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              >
                {STAFF_SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active toggle */}
          <div className="rounded-xl border border-brand-border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-darkText inline-flex items-center gap-1.5">
                <Power className="w-4 h-4 text-brand-mutedText" />
                Account status
              </p>
              <p className="text-xs text-brand-mutedText mt-0.5">
                {staffMember.active
                  ? 'This user can log in and access the app.'
                  : 'Inactive — cannot log in.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleActive(staffMember.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                staffMember.active
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {staffMember.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* Danger zone */}
          <div className="pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete staff member
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}