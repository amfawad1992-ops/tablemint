import {
  Users,
  Edit,
  Trash2,
  Wallet,
  CreditCard,
  QrCode,
} from 'lucide-react';

export default function BillingPanel({
  order,
  paymentMethod,
  onPaymentMethodChange,
  onProcessPayment,
  isProcessing,
  onDiscountChange,
  subtotal,
  discount,
  tax,
  donation,
  total,
}) {
  return (
    <aside className="bg-white rounded-xl border border-brand-border p-5 h-fit lg:sticky lg:top-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-brand-darkText">
            Table No #{order.table}
          </h3>
          <p className="text-xs text-brand-mutedText mt-0.5">
            Order ID: #{order.id}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Edit order" className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <Edit className="w-4 h-4 text-brand-mutedText" />
          </button>
          <button type="button" aria-label="Delete order" className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-brand-border">
        <Users className="w-4 h-4 text-brand-mutedText" />
        <span className="text-sm text-brand-mutedText">
          {order.people} People
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-bold text-brand-darkText mb-3">
          Ordered Items
        </h4>
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {order.items.length === 0 && (
            <p className="text-xs text-brand-mutedText">
              No items yet. Add from the menu.
            </p>
          )}
          {order.items.map((it) => (
            <div key={it.foodId} className="flex items-center justify-between text-sm">
              <span className="text-brand-darkText truncate pr-2">
                <span className="font-semibold">{it.qty}x</span> {it.name}
              </span>
              <span className="font-semibold text-brand-darkText whitespace-nowrap">
                ${(it.price * it.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-brand-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-mutedText">Subtotal</span>
          <span className="text-brand-darkText font-medium">${subtotal}</span>
        </div>
        
        {/* Discount Input */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-mutedText">Discount ($)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={order.discount || 0}
            onChange={(e) => onDiscountChange(e.target.value)}
            className="w-20 px-2 py-1 text-right rounded border border-brand-border bg-white text-brand-darkText focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-mutedText">Tax (1%)</span>
          <span className="text-brand-darkText font-medium">${tax}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-mutedText">Donation</span>
          <span className="text-brand-darkText font-medium">${donation}</span>
        </div>
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-brand-border">
          <span className="text-sm font-bold text-brand-darkText">
            Total Payable
          </span>
          <span className="text-lg font-bold text-brand-primary">
            ${total}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-bold text-brand-darkText mb-3">
          Payment Method
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'Cash', Icon: Wallet },
            { key: 'Card', Icon: CreditCard },
            { key: 'Scan', Icon: QrCode },
          ].map(({ key, Icon }) => {
            const active = paymentMethod === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => onPaymentMethodChange(key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition ${
                  active
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                    : 'border-brand-border bg-white text-brand-mutedText hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onProcessPayment}
        disabled={isProcessing}
        className="w-full mt-5 py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primaryHover transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Process Payment'}
      </button>

      <p className="text-[10px] text-center text-brand-mutedText mt-3">
        Payments are now saved to the database.
      </p>
    </aside>
  );
}