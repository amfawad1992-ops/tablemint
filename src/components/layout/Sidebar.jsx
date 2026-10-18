import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  Grid3x3,
  CalendarDays,
  CreditCard,
  BookOpen,
  Package,
  Users,
  UserCog,
  BarChart3,
  Settings,
  UtensilsCrossed,
} from 'lucide-react';

const navItems = [
  { to: '/pos', label: 'POS', Icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', Icon: ClipboardList },
  { to: '/kitchen', label: 'Kitchen', Icon: ChefHat },
  { to: '/tables', label: 'Tables', Icon: Grid3x3 },
  { to: '/reservations', label: 'Reservations', Icon: CalendarDays },
  { to: '/payments', label: 'Payments', Icon: CreditCard },
  { to: '/menu-management', label: 'Menu', Icon: BookOpen },
  { to: '/inventory', label: 'Inventory', Icon: Package },
  { to: '/customers', label: 'Customers', Icon: Users },
  { to: '/staff', label: 'Staff', Icon: UserCog },
  { to: '/reports', label: 'Reports', Icon: BarChart3 },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-14 lg:w-48 shrink-0 border-r border-brand-border bg-white flex flex-col overflow-y-auto no-scrollbar">
      {/* Logo Section */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-5 border-b border-brand-border">
        {/* Fixed Logo Container - larger box, perfectly centered icon */}
        <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
          <UtensilsCrossed className="w-4.5 h-4.5" strokeWidth={2.5} />
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-sm font-bold text-brand-darkText truncate">
            TableMint
          </p>
          <p className="text-[10px] text-brand-mutedText truncate">
            POS & Operations
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-brand-mutedText hover:bg-gray-50 hover:text-brand-darkText'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}