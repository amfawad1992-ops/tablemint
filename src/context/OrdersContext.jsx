import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoOrders } from '../data/demoData';
import { api } from '../services/api';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(demoOrders);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const dbOrders = await api.getOrders();
        if (dbOrders && dbOrders.length > 0) {
          const formatted = dbOrders.map((o) => ({
            id: o.orderNumber,
            dbId: o.id,
            type: o.type,
            table: o.table || '—',
            people: o.people,
            status: o.status,
            createdAt: o.createdAt,
            cardBg: 'mint',
            notes: o.notes || '',
            discount: o.discount || 0,
            items: o.items.map((it) => ({
              foodId: it.menuItemId,
              name: it.name,
              price: it.price,
              qty: it.qty,
            })),
            statusHistory: [{ status: o.status, at: o.createdAt }],
          }));
          setOrders(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch orders. Using demo data.', err);
      }
    }
    fetchOrders();
  }, []);

  const addOrder = useCallback(async (draft) => {
    try {
      const newOrderResponse = await api.createOrder({
        type: draft.type,
        table: draft.table,
        people: draft.people,
        notes: draft.notes,
        items: draft.items,
        discount: draft.discount || 0,
      });

      const newOrder = {
        id: newOrderResponse.orderNumber,
        dbId: newOrderResponse.id,
        type: newOrderResponse.type,
        table: newOrderResponse.table || '—',
        people: newOrderResponse.people,
        status: newOrderResponse.status,
        createdAt: newOrderResponse.createdAt,
        cardBg: 'mint',
        notes: newOrderResponse.notes || '',
        discount: newOrderResponse.discount || 0,
        items: newOrderResponse.items.map((it) => ({
          foodId: it.menuItemId,
          name: it.name,
          price: it.price,
          qty: it.qty,
        })),
        statusHistory: [{ status: 'New', at: newOrderResponse.createdAt }],
      };

      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error('Failed to create order:', err);
      return null;
    }
  }, []);

  const updateOrder = useCallback((orderId, updater) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? typeof updater === 'function' ? updater(o) : { ...o, ...updater }
          : o
      )
    );
  }, []);

  const removeOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const changeStatus = useCallback(async (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: nextStatus,
          statusHistory: [...(o.statusHistory ?? []), { status: nextStatus, at: new Date().toISOString() }],
        };
      })
    );

    try {
      await api.updateOrder(orderId, { status: nextStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }, []);

  const updateOrderDiscount = useCallback(async (orderId, discount) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, discount: Number(discount) } : o))
    );
    try {
      await api.updateOrder(orderId, { discount: Number(discount) });
    } catch (err) {
      console.error('Failed to update discount:', err);
    }
  }, []);

  const updateItemQty = useCallback(async (orderId, foodItem, delta) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const existing = order.items.find((i) => i.foodId === foodItem.id);
    let updatedItems;

    if (existing) {
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        updatedItems = order.items.filter((i) => i.foodId !== foodItem.id);
      } else {
        updatedItems = order.items.map((i) =>
          i.foodId === foodItem.id ? { ...i, qty: newQty } : i
        );
      }
    } else {
      if (delta <= 0) return;
      updatedItems = [
        ...order.items,
        { foodId: foodItem.id, name: foodItem.name, price: foodItem.price, qty: 1 },
      ];
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, items: updatedItems } : o))
    );

    try {
      await api.updateOrderItems(orderId, updatedItems);
    } catch (err) {
      console.error('Failed to update items:', err);
    }
  }, [orders]);

  const updateNotes = useCallback((orderId, notes) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, notes } : o)));
  }, []);

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      updateOrder,
      removeOrder,
      changeStatus,
      updateItemQty,
      updateNotes,
      updateOrderDiscount,
    }),
    [orders, addOrder, updateOrder, removeOrder, changeStatus, updateItemQty, updateNotes, updateOrderDiscount]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
}