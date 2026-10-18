import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import OrderLineSection from '../components/pos/OrderLineSection';
import FoodMenuSection from '../components/pos/FoodMenuSection';
import BillingPanel from '../components/pos/BillingPanel';
import { useOrders } from '../context/OrdersContext';
import { useMenu } from '../context/MenuContext';
import { usePayments } from '../context/PaymentsContext';
import { useTables } from '../context/TablesContext';
import { orderTabs, computeTotals } from '../data/demoData';

function matchesTab(order, tab) {
  if (tab === 'All') return true;
  if (tab === 'Dine in') return order.type === 'Dine In';
  if (tab === 'Take Away') return order.type === 'Takeaway';
  if (tab === 'Wait List') return ['New', 'Confirmed', 'Wait List'].includes(order.status);
  if (tab === 'Served') return ['Served', 'Completed'].includes(order.status);
  return false;
}

export default function POSPage() {
  const { searchQuery } = useOutletContext();
  const { orders, updateItemQty, changeStatus, updateOrderDiscount } = useOrders();
  const { menu, categories } = useMenu();
  const { addPayment } = usePayments();
  const { clearTable } = useTables();

  const [selectedOrderId, setSelectedOrderId] = useState('F0030');
  const [activeOrderTab, setActiveOrderTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const availableItems = useMemo(() => menu.filter((m) => m.available !== false), [menu]);

  const tabCounts = useMemo(() => {
    const counts = {};
    orderTabs.forEach((t) => {
      counts[t] = orders.filter((o) => matchesTab(o, t)).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => matchesTab(o, activeOrderTab)),
    [orders, activeOrderTab]
  );

  const foodTabs = useMemo(() => ['All Menu', ...categories.map((c) => c.name)], [categories]);

  const categoryCounts = useMemo(() => {
    const counts = { 'All Menu': availableItems.length };
    categories.forEach((c) => {
      counts[c.name] = availableItems.filter((m) => m.category === c.name).length;
    });
    return counts;
  }, [availableItems, categories]);

  const filteredMenu = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return availableItems.filter((item) => {
      const catMatch = activeCategory === 'All Menu' || item.category === activeCategory;
      const searchMatch = q === '' || item.name.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [availableItems, activeCategory, searchQuery]);

  const getQty = (foodId) => {
    if (!selectedOrder) return 0;
    const item = selectedOrder.items.find((i) => i.foodId === foodId);
    return item ? item.qty : 0;
  };

  const handleQty = (foodItem, delta) => {
    if (!selectedOrder) return;
    updateItemQty(selectedOrder.id, foodItem, delta);
  };

  const totals = computeTotals(selectedOrder?.items ?? [], selectedOrder?.discount ?? 0);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  };

  const handleProcessPayment = async () => {
    if (!selectedOrder || selectedOrder.items.length === 0) {
      showToast('error', 'No items in this order to pay.');
      return;
    }
    
    setIsProcessing(true);

    try {
      const paymentResult = await addPayment({
        orderId: selectedOrder.id,
        table: selectedOrder.table,
        amount: Number(totals.total),
        method: paymentMethod,
        status: 'Paid',
      });

      if (!paymentResult) {
         throw new Error("Payment API failed");
      }

      await changeStatus(selectedOrder.id, 'Completed');

      if (selectedOrder.type === 'Dine In' && selectedOrder.table !== '—') {
        await clearTable(selectedOrder.table);
      }

      showToast('success', `Payment of $${totals.total} recorded successfully!`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to process payment. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedOrder) {
    return (
      <div className="p-8 text-sm text-brand-mutedText">
        No orders available. Create one from the Orders page.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-5 px-5 py-5">
        <div className="min-w-0 space-y-7">
          <OrderLineSection
            tabs={orderTabs}
            tabCounts={tabCounts}
            activeTab={activeOrderTab}
            onTabChange={setActiveOrderTab}
            orders={filteredOrders}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
          />

          <FoodMenuSection
            categories={foodTabs}
            categoryCounts={categoryCounts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            items={filteredMenu}
            getQty={getQty}
            onUpdateQty={handleQty}
          />
        </div>

        <BillingPanel
          order={selectedOrder}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onProcessPayment={handleProcessPayment}
          isProcessing={isProcessing}
          onDiscountChange={(val) => updateOrderDiscount(selectedOrder.id, val)}
          subtotal={totals.subtotal}
          discount={totals.discount}
          tax={totals.tax}
          donation={totals.donation}
          total={totals.total}
        />
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-toast ${
            toast.type === 'success' ? 'bg-brand-primary' : 'bg-red-500'
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </>
  );
}