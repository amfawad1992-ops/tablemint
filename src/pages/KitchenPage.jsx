import { useEffect, useMemo, useState } from 'react';
import { ChefHat, RefreshCw } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import KitchenColumn from '../components/kitchen/KitchenColumn';
import KitchenTicket from '../components/kitchen/KitchenTicket';

export default function KitchenPage() {
  const { orders, changeStatus } = useOrders();
  const [, setTick] = useState(0);

  // Live-update elapsed time every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Newest first inside every column
  const byNewest = (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const incoming = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'New' || o.status === 'Confirmed')
        .sort(byNewest),
    [orders]
  );
  const inKitchen = useMemo(
    () => orders.filter((o) => o.status === 'In Kitchen').sort(byNewest),
    [orders]
  );
  const ready = useMemo(
    () => orders.filter((o) => o.status === 'Ready').sort(byNewest),
    [orders]
  );

  return (
    <div className="p-5 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">
              Kitchen Display
            </h1>
            <p className="text-sm text-brand-mutedText">
              Live tickets — {incoming.length + inKitchen.length + ready.length}{' '}
              active {incoming.length + inKitchen.length + ready.length === 1 ? 'order' : 'orders'}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-brand-mutedText bg-white border border-brand-border rounded-lg px-3 py-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Auto-refresh every 30s</span>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ---------- Incoming ---------- */}
        <KitchenColumn
          title="Incoming"
          subtitle="New & confirmed orders"
          count={incoming.length}
          accent="bg-slate-400"
          emptyMessage="No new orders right now."
        >
          {incoming.map((order) => {
            const primary =
              order.status === 'New'
                ? {
                    label: 'Accept',
                    onClick: () => changeStatus(order.id, 'Confirmed'),
                  }
                : {
                    label: 'Start Cooking',
                    onClick: () => changeStatus(order.id, 'In Kitchen'),
                  };
            return (
              <KitchenTicket key={order.id} order={order} primaryAction={primary} />
            );
          })}
        </KitchenColumn>

        {/* ---------- In Kitchen ---------- */}
        <KitchenColumn
          title="In Kitchen"
          subtitle="Currently being prepared"
          count={inKitchen.length}
          accent="bg-emerald-500"
          emptyMessage="Nothing cooking right now."
        >
          {inKitchen.map((order) => (
            <KitchenTicket
              key={order.id}
              order={order}
              primaryAction={{
                label: 'Mark Ready',
                onClick: () => changeStatus(order.id, 'Ready'),
              }}
            />
          ))}
        </KitchenColumn>

        {/* ---------- Ready ---------- */}
        <KitchenColumn
          title="Ready"
          subtitle="Waiting to be served"
          count={ready.length}
          accent="bg-violet-500"
          emptyMessage="No items ready yet."
        >
          {ready.map((order) => (
            <KitchenTicket
              key={order.id}
              order={order}
              primaryAction={{
                label: 'Mark Served',
                onClick: () => changeStatus(order.id, 'Served'),
              }}
            />
          ))}
        </KitchenColumn>
      </div>
    </div>
  );
}