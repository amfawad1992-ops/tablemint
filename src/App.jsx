import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import LoginPage from './pages/LoginPage';

// ProtectedRoute: If not logged in, redirect to /login
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// PublicRoute: If logged in, redirect away from /login
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/pos" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
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
                            {/* Public Auth Route */}
                            <Route
                              path="/login"
                              element={
                                <PublicOnlyRoute>
                                  <LoginPage />
                                </PublicOnlyRoute>
                              }
                            />

                            {/* Customer QR Menu Route (No Auth) */}
                            <Route path="/menu" element={<PublicMenuPage />} />

                            {/* Protected Admin Routes */}
                            <Route element={<ProtectedRoute />}>
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
    </AuthProvider>
  );
}