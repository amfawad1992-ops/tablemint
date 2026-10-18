import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultMenuItems, defaultCategories } from '../data/demoData';
import { api } from '../services/api';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(defaultMenuItems);
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from backend on mount
  useEffect(() => {
    async function fetchBackendData() {
      try {
        setIsLoading(true);
        const dbMenu = await api.getMenu();
        
        if (dbMenu && dbMenu.length > 0) {
          // Map DB format to Frontend format
          const formattedMenu = dbMenu.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category,
            image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=400&q=80',
            prepTime: item.prepTime,
            available: item.available,
            featured: item.featured,
          }));
          
          setMenu(formattedMenu);

          // Automatically extract unique categories from the menu
          const uniqueCats = [...new Set(formattedMenu.map((m) => m.category))];
          setCategories(uniqueCats.map((c) => ({ id: c, name: c })));
        }
      } catch (err) {
        console.error('Failed to fetch menu from backend. Using demo data.', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBackendData();
  }, []);

  // ---------- Menu items (Local UI updates for now) ----------

  const addMenuItem = useCallback((draft) => {
    setMenu((prev) => {
      const nums = prev.map((i) => Number(i.id)).filter((n) => !Number.isNaN(n));
      const nextId = (nums.length ? Math.max(...nums) : 0) + 1;
      const item = {
        id: nextId,
        name: draft.name?.trim() || 'Untitled item',
        description: draft.description?.trim() || '',
        price: Number(draft.price) || 0,
        category: draft.category || categories[0]?.name || 'Special',
        image: draft.image?.trim() || '',
        prepTime: Number(draft.prepTime) || 10,
        available: draft.available !== false,
        featured: !!draft.featured,
      };
      return [item, ...prev];
    });
  }, [categories]);

  const updateMenuItem = useCallback((id, patch) => {
    setMenu((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              ...patch,
              price: patch.price !== undefined ? Number(patch.price) || 0 : i.price,
              prepTime: patch.prepTime !== undefined ? Number(patch.prepTime) || 0 : i.prepTime,
            }
          : i
      )
    );
  }, []);

  const removeMenuItem = useCallback((id) => {
    setMenu((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleAvailability = useCallback((id) => {
    setMenu((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    );
  }, []);

  const toggleFeatured = useCallback((id) => {
    setMenu((prev) =>
      prev.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i))
    );
  }, []);

  // ---------- Categories ----------

  const addCategory = useCallback((name) => {
    const clean = name?.trim();
    if (!clean) return null;
    let created = null;
    setCategories((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === clean.toLowerCase())) {
        return prev;
      }
      created = { id: `cat_${Date.now()}`, name: clean };
      return [...prev, created];
    });
    return created;
  }, []);

  const renameCategory = useCallback((id, newName) => {
    const clean = newName?.trim();
    if (!clean) return;
    setCategories((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target || target.name === clean) return prev;
      const oldName = target.name;
      setMenu((items) =>
        items.map((it) => (it.category === oldName ? { ...it, category: clean } : it))
      );
      return prev.map((c) => (c.id === id ? { ...c, name: clean } : c));
    });
  }, []);

  const removeCategory = useCallback((id) => {
    setCategories((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target) return prev;
      const inUse = menu.some((i) => i.category === target.name);
      if (inUse) return prev;
      return prev.filter((c) => c.id !== id);
    });
  }, [menu]);

  const value = useMemo(
    () => ({
      menu,
      categories,
      isLoading,
      addMenuItem,
      updateMenuItem,
      removeMenuItem,
      toggleAvailability,
      toggleFeatured,
      addCategory,
      renameCategory,
      removeCategory,
    }),
    [
      menu,
      categories,
      isLoading,
      addMenuItem,
      updateMenuItem,
      removeMenuItem,
      toggleAvailability,
      toggleFeatured,
      addCategory,
      renameCategory,
      removeCategory,
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used inside MenuProvider');
  return ctx;
}