import OrderCard from './OrderCard';

export default function OrderLineSection({
  tabs,
  tabCounts,
  activeTab,
  onTabChange,
  orders,
  selectedOrderId,
  onSelectOrder,
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-brand-darkText mb-3">Order Line</h2>

      <div className="flex items-center gap-6 border-b border-brand-border mb-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              type="button"
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative pb-3 whitespace-nowrap text-sm font-medium transition ${
                active
                  ? 'text-brand-primary'
                  : 'text-brand-mutedText hover:text-brand-darkText'
              }`}
            >
              {tab}{' '}
              <span className="text-xs opacity-80">
                ({String(tabCounts[tab] ?? 0).padStart(2, '0')})
              </span>
              {active && (
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-brand-mutedText py-4">
          No orders in this tab.
        </p>
      ) : (
        /* UPDATED: Ab 4 cards sirf large screens pe dikhenge, choti screen pe squish nahi honge */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isActive={selectedOrderId === order.id}
              onClick={() => onSelectOrder(order.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}