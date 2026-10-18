import { X, Printer } from 'lucide-react';
import QRCodeCard from './QRCodeCard';

export default function QRPrintModal({ table, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-4 py-8">
        
        {/* Top Controls (Hidden when printing) */}
        <div className="no-print flex items-center gap-3 mb-4 shrink-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primaryHover shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            Print QR Card
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 
          The Print Card. 
          "qr-preview-wrapper" class humne index.css me define ki hai 
          taake ye sirf screen par chhota ho, print me nahi.
        */}
        <div className="qr-preview-wrapper shadow-2xl rounded-xl print:shadow-none print:rounded-none bg-white">
          <QRCodeCard table={table} />
        </div>
        
        {/* Bottom Tip */}
        <p className="no-print text-white/60 text-xs mt-6 max-w-sm text-center shrink-0">
          Tip: Print settings me Paper Size <strong>A6</strong> select karein, aur Margins ko <strong>None</strong> rakhein. <strong>Background Graphics</strong> ka box zaroor tick karein.
        </p>
      </div>
    </div>
  );
}