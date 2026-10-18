import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoTables, generateTableId } from '../data/demoData';
import { api } from '../services/api';

const TablesContext = createContext(null);

export function TablesProvider({ children }) {
  const [tables, setTables] = useState(demoTables);

  // Fetch real tables from Database on load
  useEffect(() => {
    async function fetchTables() {
      try {
        const dbTables = await api.getTables();
        if (dbTables && dbTables.length > 0) {
          const formatted = dbTables.map((t) => ({
            id: t.number, // "01", "02"
            dbId: t.id,
            seats: t.seats,
            floor: t.floor,
            status: t.status,
            currentOrderId: t.currentOrderId,
            guestCount: t.guestCount,
            note: t.note || '',
          }));
          setTables(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch tables. Using demo data.', err);
      }
    }
    fetchTables();
  }, []);

  const addTable = useCallback((draft) => {
    let created = null;
    setTables((prev) => {
      const id = draft.id?.trim() || generateTableId(prev);
      if (prev.some((t) => t.id === id)) return prev;
      created = {
        id,
        seats: Number(draft.seats) || 2,
        floor: draft.floor || 'Main Floor',
        status: draft.status || 'Available',
        currentOrderId: null,
        guestCount: 0,
        note: draft.note || '',
      };
      return [...prev, created].sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    });
    return created;
  }, []);

  const updateTable = useCallback(async (tableId, patch) => {
    // UI Update
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const next = { ...t, ...patch };
        if (patch.status !== undefined && patch.status !== 'Occupied' && t.status === 'Occupied') {
          next.currentOrderId = null;
          next.guestCount = 0;
        }
        return next;
      })
    );

    // DB Update
    try {
      const payload = {};
      if (patch.status !== undefined) payload.status = patch.status;
      if (patch.currentOrderId !== undefined) payload.currentOrderId = patch.currentOrderId;
      if (patch.guestCount !== undefined) payload.guestCount = patch.guestCount;
      if (patch.seats !== undefined) payload.seats = patch.seats;
      if (patch.floor !== undefined) payload.floor = patch.floor;
      if (patch.note !== undefined) payload.note = patch.note;

      if (Object.keys(payload).length > 0) {
        await api.updateTable(tableId, payload);
      }
    } catch (err) {
      console.error('Failed to update table in DB:', err);
    }
  }, []);

  const removeTable = useCallback((tableId) => {
    setTables((prev) => prev.filter((t) => t.id !== tableId));
  }, []);

  const setTableOccupied = useCallback(async (tableId, orderId, guestCount) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status: 'Occupied', currentOrderId: orderId, guestCount: guestCount || t.guestCount || 1 }
          : t
      )
    );
    try {
      await api.updateTable(tableId, { status: 'Occupied', currentOrderId: orderId, guestCount: guestCount || 1 });
    } catch (err) {
      console.error('Failed to mark table occupied:', err);
    }
  }, []);

  const clearTable = useCallback(async (tableId) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, status: 'Available', currentOrderId: null, guestCount: 0 } : t
      )
    );
    try {
      await api.updateTable(tableId, { status: 'Available', currentOrderId: null, guestCount: 0 });
    } catch (err) {
      console.error('Failed to clear table:', err);
    }
  }, []);

  const value = useMemo(
    () => ({ tables, addTable, updateTable, removeTable, setTableOccupied, clearTable }),
    [tables, addTable, updateTable, removeTable, setTableOccupied, clearTable]
  );

  return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>;
}

export function useTables() {
  const ctx = useContext(TablesContext);
  if (!ctx) throw new Error('useTables must be used inside TablesProvider');
  return ctx;
}