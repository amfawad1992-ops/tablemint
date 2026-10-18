import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoStaff, generateStaffId } from '../data/demoData';
import { api } from '../services/api';

const StaffContext = createContext(null);

export function StaffProvider({ children }) {
  const [staff, setStaff] = useState(demoStaff);

  // Fetch from DB on load
  useEffect(() => {
    async function fetchStaff() {
      try {
        const dbStaff = await api.getStaff();
        if (dbStaff && dbStaff.length > 0) {
          setStaff(dbStaff);
        } else {
          setStaff([]);
        }
      } catch (err) {
        console.error('Failed to fetch staff. Using demo data.', err);
      }
    }
    fetchStaff();
  }, []);

  const addStaff = useCallback(async (draft) => {
    try {
      const newStaff = await api.createStaff({
        name: draft.name?.trim() || 'Unnamed',
        email: draft.email?.trim() || '',
        phone: draft.phone?.trim() || null,
        role: draft.role || 'Waiter',
        shift: draft.shift || 'Morning',
        active: draft.active !== false,
      });
      setStaff((prev) => [newStaff, ...prev]);
      return newStaff;
    } catch (err) {
      console.error('Failed to add staff:', err);
      return null;
    }
  }, []);

  const updateStaff = useCallback(async (id, patch) => {
    // UI update first
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );

    // DB update
    try {
      const payload = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.email !== undefined) payload.email = patch.email;
      if (patch.phone !== undefined) payload.phone = patch.phone;
      if (patch.role !== undefined) payload.role = patch.role;
      if (patch.shift !== undefined) payload.shift = patch.shift;
      if (patch.active !== undefined) payload.active = patch.active;

      if (Object.keys(payload).length > 0) {
        await api.updateStaff(id, payload);
      }
    } catch (err) {
      console.error('Failed to update staff in DB:', err);
    }
  }, []);

  const removeStaff = useCallback(async (id) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.deleteStaff(id);
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  }, []);

  const toggleActive = useCallback(async (id) => {
    const member = staff.find((s) => s.id === id);
    if (!member) return;
    await updateStaff(id, { active: !member.active });
  }, [staff, updateStaff]);

  const value = useMemo(
    () => ({ staff, addStaff, updateStaff, removeStaff, toggleActive }),
    [staff, addStaff, updateStaff, removeStaff, toggleActive]
  );

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used inside StaffProvider');
  return ctx;
}