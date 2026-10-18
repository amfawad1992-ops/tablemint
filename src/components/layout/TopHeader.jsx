import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopHeader({ searchQuery, onSearchChange }) {
  const { user, logout } = useAuth();

  const initial = (user?.name || 'S').charAt(0).toUpperCase();

  return (
    <header className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3.5 border-b border-brand-border bg-white shrink-0">
      <div className="relative w-full max-w-sm md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search menu, orders and more"
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
        />
      </div>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5 text-brand-darkText" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold text-sm">
          {initial}
        </div>
        <div className="hidden sm:block leading-tight">
          <p className="text-sm font-semibold text-brand-darkText">
            {user?.name || 'Admin'}
          </p>
          <p className="text-xs text-brand-mutedText">
            {user?.role || 'Admin'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        aria-label="Logout"
        title="Logout"
        className="ml-1 p-2 rounded-full text-brand-mutedText hover:text-red-500 hover:bg-red-50 transition"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </header>
  );
}