import { QRCodeSVG } from 'qrcode.react';
import { UtensilsCrossed, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function QRCodeCard({ table }) {
  const { settings } = useSettings();
  const menuUrl = `${window.location.origin}/menu?table=${table.id}`;
  
  const restaurantName = settings?.restaurantName || 'TableMint';
  const tagline = settings?.tagline || 'Smart Orders. Smooth Service.';
  const address = settings?.address || '123 Main Boulevard, Gulberg III';
  const phone = settings?.phone || '+92 42 111 000 111';

  return (
    <div
      className="print-area bg-white relative overflow-hidden flex flex-col"
      style={{ 
        width: '105mm', 
        height: '148mm', 
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
    >
      {/* Top Colorful Header */}
      <div 
        className="w-full flex flex-col items-center justify-center py-6 px-4 shrink-0"
        style={{ backgroundColor: '#16B8AC' }}
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
          <UtensilsCrossed className="w-6 h-6" style={{ color: '#16B8AC' }} />
        </div>
        <h1 className="text-2xl font-extrabold text-white uppercase tracking-widest text-center leading-tight">
          {restaurantName}
        </h1>
        <p className="text-[9px] text-white/90 tracking-widest uppercase font-semibold mt-1 text-center">
          {tagline}
        </p>
      </div>

      {/* Middle Content (QR & Text) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 bg-white relative">
        <p className="text-[11px] text-gray-500 font-medium text-center mb-1">
          Welcome! Scan to view our menu
        </p>
        <p className="text-[10px] text-gray-400 text-center mb-4">
          and place your order directly from your phone.
        </p>

        {/* QR Code Container */}
        <div className="p-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white shadow-sm mb-4">
          <QRCodeSVG value={menuUrl} size={110} level="H" />
        </div>

        {/* Table Badge */}
        <div 
          className="px-8 py-2 rounded-full font-black text-xl tracking-wider shadow-sm border"
          style={{ backgroundColor: '#E8FAF6', color: '#109F95', borderColor: '#16B8AC' }}
        >
          TABLE {table.id}
        </div>
      </div>

      {/* Bottom Footer */}
      <div 
        className="w-full py-4 px-4 flex flex-col items-center justify-center gap-1.5 shrink-0"
        style={{ backgroundColor: '#F8F9FB', borderTop: '1px solid #E6E8EC' }}
      >
        <div className="flex items-center gap-1.5 text-[8px] text-gray-500 font-medium">
          <MapPin className="w-3 h-3" style={{ color: '#16B8AC' }} /> 
          {address}
        </div>
        <div className="flex items-center gap-1.5 text-[8px] text-gray-500 font-medium">
          <Phone className="w-3 h-3" style={{ color: '#16B8AC' }} /> 
          {phone}
        </div>
        <p className="text-[7px] text-gray-400 mt-1 uppercase tracking-widest">
          Powered by TableMint POS
        </p>
      </div>
    </div>
  );
}