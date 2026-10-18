import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoCustomers, generateCustomerId } from '../data/demoData';
import { api } from '../services/api';

const CustomersContext = createContext(null);

export function CustomersProvider({ children }) {
  const [customers, setCustomers] = useState(demoCustomers);

  // Fetch from DB on load
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const dbCustomers = await api.getCustomers();
        if (dbCustomers && dbCustomers.length > 0) {
          setCustomers(dbCustomers);
        } else {
          setCustomers([]); // If DB is empty, show empty
        }
      } catch (err) {
        console.error('Failed to fetch customers. Using demo data.', err);
      }
    }
    fetchCustomers();
  }, []);

  const addCustomer = useCallback(async (draft) => {
    try {
      const newCustomer = await api.createCustomer({
        name: draft.name?.trim() || 'Unnamed',
        phone: draft.phone?.trim() || null,
        email: draft.email?.trim() || null,
        notes: draft.notes?.trim() || null,
        loyaltyPoints: Number(draft.loyaltyPoints) || 0,
      });
      setCustomers((prev) => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      console.error('Failed to add customer:', err);
      return null;
    }
  }, []);

  const updateCustomer = useCallback(async (id, patch) => {
    // UI update first
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );

    // DB update
    try {
      const payload = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.phone !== undefined) payload.phone = patch.phone;
      if (patch.email !== undefined) payload.email = patch.email;
      if (patch.notes !== undefined) payload.notes = patch.notes;
      if (patch.loyaltyPoints !== undefined) payload.loyaltyPoints = Number(patch.loyaltyPoints);

      if (Object.keys(payload).length > 0) {
        await api.updateCustomer(id, payload);
      }
    } catch (err) {
      console.error('Failed to update customer in DB:', err);
    }
  }, []);

  const removeCustomer = useCallback(async (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.deleteCustomer(id);
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  }, []);

  const value = useMemo(
    () => ({ customers, addCustomer, updateCustomer, removeCustomer }),
    [customers, addCustomer, updateCustomer, removeCustomer]
  );

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error('useCustomers must be used inside CustomersProvider');
  return ctx;
}