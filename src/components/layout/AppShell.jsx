import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import OrderReminder from '../notifications/OrderReminder';

export default function AppShell() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen p-3 md:p-5 lg:p-6 bg-brand-bg">
      <div className="mx-auto max-w-[1440px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2.5rem)] lg:h-[calc(100vh-3rem)] flex flex-col">
        <TopHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex-1 flex min-h-0">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto bg-brand-content">
            <OrderReminder />
            <Outlet context={{ searchQuery }} />
          </main>
        </div>
      </div>
    </div>
  );
}