import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoPayments } from '../data/demoData';
import { api } from '../services/api';

const PaymentsContext = createContext(null);

export function PaymentsProvider({ children }) {
  const [payments, setPayments] = useState(demoPayments);

  // Fetch from DB on load
  useEffect(() => {
    async function fetchPayments() {
      try {
        const dbPayments = await api.getPayments();
        if (dbPayments && dbPayments.length > 0) {
          setPayments(dbPayments);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error('Failed to fetch payments. Using demo data.', err);
      }
    }
    fetchPayments();
  }, []);

  const addPayment = useCallback(async (draft) => {
    try {
      const newPayment = await api.createPayment({
        orderId: draft.orderId || null,
        table: draft.table || null,
        amount: Number(draft.amount) || 0,
        method: draft.method || 'Cash',
        status: draft.status || 'Paid',
      });
      setPayments((prev) => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      console.error('Failed to add payment:', err);
      throw err; // <-- Ye line important hai, error aage bhejega
    }
  }, []);

  const markAsPaid = useCallback(async (id, method) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Paid', method: method || p.method } : p))
    );
    try {
      await api.updatePayment(id, { status: 'Paid', method });
    } catch (err) {
      console.error('Failed to mark as paid:', err);
    }
  }, []);

  const refundPayment = useCallback(async (id, amount) => {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return;

    const total = Number(payment.amount);
    const refund = Math.min(Math.max(0, Number(amount) || 0), total);
    const newRefunded = Math.min(total, (payment.refundedAmount || 0) + refund);
    
    let status = payment.status;
    if (newRefunded >= total) status = 'Refunded';
    else if (newRefunded > 0) status = 'Partially Refunded';

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, refundedAmount: newRefunded, status } : p
      )
    );

    try {
      await api.updatePayment(id, { status, refundedAmount: newRefunded });
    } catch (err) {
      console.error('Failed to process refund:', err);
    }
  }, [payments]);

  const value = useMemo(
    () => ({ payments, markAsPaid, refundPayment, addPayment }),
    [payments, markAsPaid, refundPayment, addPayment]
  );

  return (
    <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error('usePayments must be used inside PaymentsProvider');
  return ctx;
}