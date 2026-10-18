import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoReservations, generateReservationId } from '../data/demoData';
import { api } from '../services/api';

const ReservationsContext = createContext(null);

export function ReservationsProvider({ children }) {
  const [reservations, setReservations] = useState(demoReservations);

  // Fetch from DB on load
  useEffect(() => {
    async function fetchReservations() {
      try {
        const dbReservations = await api.getReservations();
        if (dbReservations && dbReservations.length > 0) {
          setReservations(dbReservations);
        } else {
          setReservations([]);
        }
      } catch (err) {
        console.error('Failed to fetch reservations. Using demo data.', err);
      }
    }
    fetchReservations();
  }, []);

  const addReservation = useCallback(async (draft) => {
    try {
      const newRes = await api.createReservation({
        name: draft.name?.trim() || 'Unnamed',
        phone: draft.phone?.trim() || null,
        date: draft.date,
        time: draft.time,
        guests: Number(draft.guests) || 1,
        tableId: draft.tableId || null,
        request: draft.request?.trim() || null,
        status: draft.status || 'Pending',
      });
      setReservations((prev) => [newRes, ...prev]);
      return newRes;
    } catch (err) {
      console.error('Failed to add reservation:', err);
      return null;
    }
  }, []);

  const updateReservation = useCallback(async (id, patch) => {
    // UI update first
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );

    // DB update
    try {
      await api.updateReservation(id, patch);
    } catch (err) {
      console.error('Failed to update reservation:', err);
    }
  }, []);

  const removeReservation = useCallback(async (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    try {
      await api.deleteReservation(id);
    } catch (err) {
      console.error('Failed to delete reservation:', err);
    }
  }, []);

  const changeReservationStatus = useCallback(async (id, status) => {
    await updateReservation(id, { status });
  }, [updateReservation]);

  const value = useMemo(
    () => ({
      reservations,
      addReservation,
      updateReservation,
      removeReservation,
      changeReservationStatus,
    }),
    [reservations, addReservation, updateReservation, removeReservation, changeReservationStatus]
  );

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used inside ReservationsProvider');
  return ctx;
}