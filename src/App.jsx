import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { OrdersProvider } from './context/OrdersContext';
import { TablesProvider } from './context/TablesContext';
import { MenuProvider } from './context/MenuContext';
import { ReservationsProvider } from './context/ReservationsContext';
import { PaymentsProvider } from './context/PaymentsContext';
import { InventoryProvider } from './context/InventoryContext';
import { CustomersProvider } from './context/CustomersContext';
import { StaffProvider } from './context/StaffContext';
import AppShell from './components/layout/AppShell';

// Pages
import POSPage from './pages/POSPage';
import OrdersPage from './pages/OrdersPage';
import KitchenPage from './pages/KitchenPage';
import TablesPage from './pages/TablesPage';
import ReservationsPage from './pages/ReservationsPage';
import PaymentsPage from './pages/PaymentsPage';
import MenuManagementPage from './pages/MenuManagementPage';
import InventoryPage from './pages/InventoryPage';
import CustomersPage from './pages/CustomersPage';
import StaffPage from './pages/StaffPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import PublicMenuPage from './pages/PublicMenuPage';
import LoginPage from './pages/LoginPage'; // <-- Import Login

export default function App() {
  return (
    <SettingsProvider>
      <MenuProvider>
        <OrdersProvider>
          <TablesProvider>
            <ReservationsProvider>
              <PaymentsProvider>
                <InventoryProvider>
                  <CustomersProvider>
                    <StaffProvider>
                      <BrowserRouter>
                        <Routes>
                          {/* Auth & Public Routes (No Sidebar) */}
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/menu" element={<PublicMenuPage />} />

                          {/* Admin Routes (With Sidebar) */}
                          <Route element={<AppShell />}>
                            <Route path="/" element={<Navigate to="/pos" replace />} />
                            <Route path="/pos" element={<POSPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/kitchen" element={<KitchenPage />} />
                            <Route path="/tables" element={<TablesPage />} />
                            <Route path="/reservations" element={<ReservationsPage />} />
                            <Route path="/payments" element={<PaymentsPage />} />
                            <Route path="/menu-management" element={<MenuManagementPage />} />
                            <Route path="/inventory" element={<InventoryPage />} />
                            <Route path="/customers" element={<CustomersPage />} />
                            <Route path="/staff" element={<StaffPage />} />
                            <Route path="/reports" element={<ReportsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="/pos" replace />} />
                          </Route>
                        </Routes>
                      </BrowserRouter>
                    </StaffProvider>
                  </CustomersProvider>
                </InventoryProvider>
              </PaymentsProvider>
            </ReservationsProvider>
          </TablesProvider>
        </OrdersProvider>
      </MenuProvider>
    </SettingsProvider>
  );
}