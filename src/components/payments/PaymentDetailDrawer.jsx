import { useState } from 'react';
import {
  X,
  Printer,
  Receipt,
  RotateCcw,
  CheckCircle2,
  CreditCard,
  Banknote,
  QrCode,
} from 'lucide-react';
import { usePayments } from '../../context/PaymentsContext';
import {
  PAYMENT_STATUS_STYLES,
  formatTimeAgo,
} from '../../data/demoData';

const METHOD_ICON = {
  Cash: Banknote,
  Card: CreditCard,
  Scan: QrCode,
};

export default function PaymentDetailDrawer({ payment, onClose, onToast }) {
  const { markAsPaid, refundPayment } = usePayments();
  const [refundAmount, setRefundAmount] = useState('');
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [markMethod, setMarkMethod] = useState(payment.method);

  const MethodIcon = METHOD_ICON[payment.method] ?? Receipt;
  const total = Number(payment.total);
  const refunded = payment.refundedAmount || 0;
  const net = total - refunded;
  const canRefund =
    payment.status === 'Paid' || payment.status === 'Partially Refunded';
  const canMarkPaid =
    payment.status === 'Unpaid' || payment.status === 'Failed';

  const handleRefund = () => {
    const amount = Number(refundAmount);
    if (Number.isNaN(amount) || amount <= 0) return;
    refundPayment(payment.id, amount);
    setRefundAmount('');
    setShowRefundForm(false);
    onToast?.('success', `Refund of $${amount.toFixed(2)} recorded.`);
  };

  const handleMarkPaid = () => {
    markAsPaid(payment.id, markMethod);
    onToast?.('success', `Marked as paid via ${markMethod}.`);
  };

  const handlePrint = () => {
    window.print();
    onToast?.('success', 'Demo: Print dialog opened (browser print).');
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

      <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-mutedText font-semibold">
              Receipt
            </p>
            <h2 className="text-lg font-bold text-brand-darkText leading-tight">
              {payment.id}
            </h2>
            <p className="text-xs text-brand-mutedText mt-0.5">
              Order #{payment.orderId} · {formatTimeAgo(payment.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-brand-mutedText" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status + method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-brand-border p-3.5">
              <p className="text-[11px] text-brand-mutedText mb-1">Status</p>
              <span
                className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  PAYMENT_STATUS_STYLES[payment.status] ??
                  'bg-gray-100 text-gray-600'
                }`}
              >
                {payment.status}
              </span>
            </div>
            <div className="rounded-xl border border-brand-border p-3.5">
              <p className="text-[11px] text-brand-mutedText mb-1">Method</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-darkText">
                <MethodIcon className="w-4 h-4 text-brand-primary" />
                {payment.method}
              </span>
            </div>
          </div>

          {/* Receipt card */}
          <div className="rounded-xl border border-dashed border-brand-border bg-brand-content p-4">
            <div className="text-center mb-4 pb-3 border-b border-dashed border-brand-border">
              <p className="text-sm font-bold text-brand-darkText">TableMint</p>
              <p className="text-[10px] text-brand-mutedText">
                Smart Orders. Smooth Service.
              </p>
              <p className="text-[10px] text-brand-mutedText mt-1">
                {payment.table === '—' ? 'Takeaway' : `Table #${payment.table}`}
              </p>
            </div>

            {/* Items */}
            <ul className="space-y-1.5 mb-3 pb-3 border-b border-dashed border-brand-border">
              {payment.items.map((it, idx) => (
                <li key={idx} className="flex justify-between text-xs">
                  <span className="text-brand-darkText">
                    <span className="font-semibold">{it.qty}×</span> {it.name}
                  </span>
                  <span className="text-brand-darkText font-medium">
                    ${(it.price * it.qty).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-mutedText">Subtotal</span>
                <span className="text-brand-darkText">${payment.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-mutedText">Tax (1%)</span>
                <span className="text-brand-darkText">${payment.tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-mutedText">Donation</span>
                <span className="text-brand-darkText">${payment.donation}</span>
              </div>
              <div className="flex justify-between pt-2 mt-1 border-t border-dashed border-brand-border">
                <span className="font-bold text-brand-darkText">
                  Total Payable
                </span>
                <span className="font-bold text-brand-primary">
                  ${payment.total}
                </span>
              </div>
              {payment.cashReceived != null && (
                <>
                  <div className="flex justify-between pt-1">
                    <span className="text-brand-mutedText">Cash received</span>
                    <span className="text-brand-darkText">
                      ${payment.cashReceived.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-mutedText">Change due</span>
                    <span className="text-brand-darkText">
                      ${payment.changeDue.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              {refunded > 0 && (
                <>
                  <div className="flex justify-between pt-1 text-violet-700">
                    <span>Refunded</span>
                    <span>− ${refunded.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-violet-700">
                    <span>Net collected</span>
                    <span>${net.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-border text-brand-darkText text-sm font-medium hover:bg-brand-content transition"
            >
              <Printer className="w-4 h-4" />
              Print receipt (demo)
            </button>

            {canMarkPaid && (
              <div className="rounded-lg border border-brand-border p-3 space-y-2">
                <p className="text-xs font-medium text-brand-mutedText">
                  Mark as paid via
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'Card', 'Scan'].map((m) => {
                    const active = markMethod === m;
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMarkMethod(m)}
                        className={`py-2 rounded-lg border text-xs font-medium transition ${
                          active
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                            : 'border-brand-border bg-white text-brand-mutedText hover:border-gray-300'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={handleMarkPaid}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark paid
                </button>
              </div>
            )}

            {canRefund && !showRefundForm && (
              <button
                type="button"
                onClick={() => setShowRefundForm(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 text-sm font-medium hover:bg-violet-100 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Issue refund
              </button>
            )}

            {showRefundForm && (
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 space-y-2">
                <p className="text-xs font-medium text-violet-700">
                  Refund amount (max ${(total - refunded).toFixed(2)})
                </p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  max={total - refunded}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-lg border border-violet-200 bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRefundForm(false);
                      setRefundAmount('');
                    }}
                    className="flex-1 py-2.5 rounded-lg border border-brand-border bg-white text-xs font-medium text-brand-mutedText hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRefund}
                    className="flex-1 py-2.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
                  >
                    Confirm refund
                  </button>
                </div>
              </div>
            )}

            {payment.status === 'Refunded' && (
              <p className="text-xs text-violet-700 text-center bg-violet-50 border border-violet-200 rounded-lg py-2.5">
                Fully refunded.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}