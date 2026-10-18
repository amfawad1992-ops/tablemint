import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [dbIngredients, dbMovements] = await Promise.all([
          api.getInventory(),
          api.getMovements(),
        ]);
        setIngredients(dbIngredients);
        setMovements(dbMovements);
      } catch (err) {
        console.error('Failed to fetch inventory data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const addIngredient = useCallback(async (draft) => {
    try {
      const newItem = await api.createIngredient(draft);
      setIngredients((prev) => [newItem, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      return newItem;
    } catch (err) {
      console.error('Failed to add ingredient:', err);
      return null;
    }
  }, []);

  const updateIngredient = useCallback(async (id, patch) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );

    try {
      await api.updateIngredient(id, patch);
    } catch (err) {
      console.error('Failed to update ingredient:', err);
    }
  }, []);

  const removeIngredient = useCallback(async (id) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    try {
      await api.deleteIngredient(id);
    } catch (err) {
      console.error('Failed to delete ingredient:', err);
    }
  }, []);

  const applyMovement = useCallback(async (ingredientId, { type, qty, note }) => {
    try {
      const response = await api.addMovement(ingredientId, {
        type,
        qty,
        note,
        user: 'Sohan', // Hardcoded for demo
      });

      // Update UI with response
      setIngredients((prev) =>
        prev.map((i) => (i.id === ingredientId ? response.ingredient : i))
      );
      setMovements((prev) => [response.movement, ...prev]);

      return response.movement;
    } catch (err) {
      console.error('Failed to record movement:', err);
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      ingredients,
      movements,
      isLoading,
      addIngredient,
      updateIngredient,
      removeIngredient,
      applyMovement,
    }),
    [ingredients, movements, isLoading, addIngredient, updateIngredient, removeIngredient, applyMovement]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}