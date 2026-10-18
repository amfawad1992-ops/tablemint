import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useStaff } from '../context/StaffContext';
import {
  STAFF_ROLES,
  STAFF_ROLE_STYLES,
  STAFF_SHIFT_STYLES,
} from '../data/demoData';
import StaffFormModal from '../components/staff/StaffFormModal';
import StaffDetailDrawer from '../components/staff/StaffDetailDrawer';

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

export default function StaffPage() {
  const { staff } = useStaff();

  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Stat strip
  const stats = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.active).length;
    const onShift = staff.filter(
      (s) => s.active && s.shift !== 'Off Today'
    ).length;
    const managersPlus = staff.filter((s) =>
      ['Owner', 'Admin', 'Manager'].includes(s.role)
    ).length;
    return { total, active, onShift, managersPlus };
  }, [staff]);

  // Role counts
  const roleCounts = useMemo(() => {
    const counts = { All: staff.length };
    STAFF_ROLES.forEach((r) => {
      counts[r] = staff.filter((s) => s.role === r).length;
    });
    return counts;
  }, [staff]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff
      .filter((s) => {
        if (roleFilter !== 'All' && s.role !== roleFilter) return false;
        if (statusFilter === 'Active' && !s.active) return false;
        if (statusFilter === 'Inactive' && s.active) return false;

        if (q) {
          const matches =
            s.name.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q) ||
            (s.email || '').toLowerCase().includes(q) ||
            (s.phone || '').toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [staff, roleFilter, statusFilter, search]);

  const selected = staff.find((s) => s.id === selectedId) ?? null;

  return (
    <>
      <div className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">Staff</h1>
            <p className="text-sm text-brand-mutedText">
              Manage team members, roles, and shifts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total staff',
              value: stats.total,
              Icon: Users,
              accent: 'text-brand-darkText',
              bg: 'bg-brand-content',
            },
            {
              label: 'Active',
              value: stats.active,
              Icon: UserCheck,
              accent: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
            {
              label: 'On shift',
              value: stats.onShift,
              Icon: Clock,
              accent: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Managers+',
              value: stats.managersPlus,
              Icon: ShieldCheck,
              accent: 'text-purple-600',
              bg: 'bg-purple-50',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-brand-border rounded-xl px-4 py-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] text-brand-mutedText truncate">
                  {s.label}
                </p>
                <span
                  className={`w-7 h-7 rounded-lg ${s.bg} ${s.accent} flex items-center justify-center`}
                >
                  <s.Icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className={`text-xl font-bold ${s.accent}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Role chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', ...STAFF_ROLES].map((r) => {
            const active = roleFilter === r;
            return (
              <button
                type="button"
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  active
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white text-brand-mutedText border-brand-border hover:border-gray-300'
                }`}
              >
                {r} ({roleCounts[r] ?? 0})
              </button>
            );
          })}
        </div>

        {/* Status chips + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-brand-mutedText border-brand-border hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-content text-left text-xs uppercase tracking-wide text-brand-mutedText">
                <tr>
                  <th className="px-4 py-3 font-medium">Staff</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Shift</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-brand-mutedText"
                    >
                      No staff match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((s) => {
                  const roleStyle =
                    STAFF_ROLE_STYLES[s.role] ?? 'bg-gray-100 text-gray-700';
                  const shiftStyle =
                    STAFF_SHIFT_STYLES[s.shift] ??
                    'bg-gray-50 text-gray-600 border-gray-200';
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`border-t border-brand-border cursor-pointer transition ${
                        s.active
                          ? 'hover:bg-brand-content/60'
                          : 'bg-gray-50/40 hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`font-semibold truncate ${
                                s.active
                                  ? 'text-brand-darkText'
                                  : 'text-brand-mutedText'
                              }`}
                            >
                              {s.name}
                            </div>
                            <div className="text-[10px] text-brand-mutedText">
                              {s.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-brand-mutedText text-xs truncate max-w-[200px]">
                          {s.email || '—'}
                        </div>
                        <div className="text-brand-mutedText text-[11px] truncate">
                          {s.phone || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${roleStyle}`}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border ${shiftStyle}`}
                        >
                          {s.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            s.active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              s.active ? 'bg-emerald-600' : 'bg-gray-400'
                            }`}
                          />
                          {s.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <StaffFormModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <StaffFormModal
          staffMember={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}

      {/* Drawer */}
      {selected && (
        <StaffDetailDrawer
          staffMember={selected}
          onEdit={() => {
            setEditing(selected);
            setSelectedId(null);
          }}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}