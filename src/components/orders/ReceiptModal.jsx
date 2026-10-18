import { useState } from 'react';
import { X, Printer, Banknote, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSettings } from '../../context/SettingsContext';
import { computeTotals } from '../../data/demoData';

export default function ReceiptModal({ order, onClose }) {
  const { settings } = useSettings();
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  const totals = computeTotals(order.items, order.discount);
  
  const restaurantName = settings?.restaurantName || 'TableMint';
  const address = settings?.address || '123 Main Boulevard';
  const phone = settings?.phone || '+92 000 0000000';
  const footerText = settings?.receiptFooter || 'Thank you for dining with us!';

  const paymentUrl = `https://pay.tablemint.com/order/${order.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90mm] overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="no-print flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">Print Receipt</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto receipt-print-area p-5">
          
          <div className="text-center mb-4 border-b-2 border-dashed border-gray-300 pb-4">
            <h1 className="text-2xl font-extrabold uppercase tracking-widest text-gray-900">{restaurantName}</h1>
            <p className="text-[10px] text-gray-500 font-medium">{address}</p>
            <p className="text-[10px] text-gray-500 font-medium">Tel: {phone}</p>
          </div>

          <div className="text-xs text-gray-700 mb-4 space-y-1">
            <div className="flex justify-between"><span className="text-gray-500">Order ID:</span><span className="font-bold">{order.id}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Table:</span><span className="font-bold">{order.table === '—' ? 'Takeaway' : `Table ${order.table}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Guests:</span><span className="font-medium">{order.people}</span></div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 pb-1 mb-2">
              <span className="w-1/2">Item</span>
              <span className="w-1/4 text-center">Qty</span>
              <span className="w-1/4 text-right">Amount</span>
            </div>
            <div className="space-y-1.5">
              {order.items.map((it) => (
                <div key={it.foodId} className="flex justify-between text-xs text-gray-800">
                  <span className="w-1/2 truncate pr-2 font-medium">{it.name}</span>
                  <span className="w-1/4 text-center font-bold">{it.qty}</span>
                  <span className="w-1/4 text-right font-bold">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-4 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-600"><span>Subtotal</span><span>${totals.subtotal}</span></div>
            {Number(totals.discount) > 0 && (
               <div className="flex justify-between text-xs text-gray-600"><span>Discount</span><span>-${totals.discount}</span></div>
            )}
            <div className="flex justify-between text-xs text-gray-600"><span>Tax (1%)</span><span>${totals.tax}</span></div>
            <div className="flex justify-between text-xs text-gray-600"><span>Donation</span><span>${totals.donation}</span></div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 mt-2 pt-2 border-t border-gray-200">
              <span>Total Payable</span>
              <span>${totals.total}</span>
            </div>
          </div>

          <div className="no-print border-t-2 border-dashed border-gray-300 pt-4 mb-4">
            <p className="text-xs font-bold text-gray-800 mb-2">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentMethod('Cash')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold transition ${paymentMethod === 'Cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                <Banknote className="w-4 h-4" /> Cash
              </button>
              <button onClick={() => setPaymentMethod('Online')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold transition ${paymentMethod === 'Online' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                <QrCode className="w-4 h-4" /> Online
              </button>
            </div>
          </div>

          {paymentMethod === 'Online' && (
            <div className="flex flex-col items-center justify-center mb-4 py-3 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50">
              <p className="text-[10px] font-bold text-blue-800 mb-2 uppercase tracking-wide">Scan to Pay Online</p>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCodeSVG value={paymentUrl} size={100} level="M" />
              </div>
              <p className="text-[9px] text-blue-600 mt-2 font-medium">Amount: ${totals.total}</p>
            </div>
          )}

          {paymentMethod === 'Cash' && (
            <div className="flex flex-col items-center justify-center mb-4 py-3 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/50">
              <div className="no-print text-center">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Paid via Cash</p>
                <p className="text-[10px] text-emerald-600 mt-1 font-medium">Please collect ${totals.total} from guest</p>
              </div>
              <div className="hidden print:block text-center py-1">
                <p className="text-sm font-black text-black uppercase tracking-widest border-2 border-black px-4 py-1 rounded-md inline-block">PAID</p>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">{footerText}</p>
            <p className="text-[8px] text-gray-400 mt-1">Powered by TableMint POS</p>
          </div>

        </div>

        <div className="no-print p-4 bg-gray-50 border-t border-gray-200">
          <button onClick={handlePrint} className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-primaryHover transition shadow-md">
            <Printer className="w-4 h-4" /> Print Now
          </button>
        </div>
      </div>
    </div>
  );
}