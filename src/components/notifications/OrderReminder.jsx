import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Minimize2,
  Maximize2,
  MapPin,
  Clock,
} from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { statusStyles } from '../../data/demoData';

const THRESHOLD_MINS = 2;      // 2 min se zyada purane order reminder me aayenge
const URGENT_MINS = 5;         // 5 min se zyada purane order urgent (red) ho jayenge
const CHECK_INTERVAL_MS = 15000; // har 15 second me refresh

export default function OrderReminder() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const [, setTick] = useState(0);              // to force re-render for time updates
  const [dismissed, setDismissed] = useState(new Set());
  const [minimized, setMinimized] = useState(false);
  const lastBeepIds = useRef(new Set());

  // Periodic refresh so time counters update
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Stale orders: New/Confirmed and older than threshold
  const staleOrders = orders.filter((o) => {
    if (!['New', 'Confirmed'].includes(o.status)) return false;
    if (dismissed.has(o.id)) return false;
    const mins = (Date.now() - new Date(o.createdAt).getTime()) / 60000;
    return mins >= THRESHOLD_MINS;
  });

  // Beep only when a NEW stale order appears
  const staleKey = staleOrders.map((o) => o.id).join(',');
  useEffect(() => {
    const currentIds = new Set(staleOrders.map((o) => o.id));
    const newIds = [...currentIds].filter((id) => !lastBeepIds.current.has(id));
    if (newIds.length > 0) {
      playBeep();
    }
    lastBeepIds.current = currentIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staleKey]);

  if (staleOrders.length === 0) return null;

  const handleDismiss = (orderId) => {
    setDismissed((prev) => new Set([...prev, orderId]));
  };

  const handleDismissAll = () => {
    setDismissed(new Set(staleOrders.map((o) => o.id)));
  };

  const handleOpenOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] w-full max-w-sm animate-toast">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-400 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <Bell className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-bold">
              {staleOrders.length} Pending Order
              {staleOrders.length > 1 ? 's' : ''}!
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized((m) => !m)}
              className="p-1 rounded hover:bg-white/20 transition"
              aria-label={minimized ? 'Expand' : 'Minimize'}
            >
              {minimized ? (
                <Maximize2 className="w-3.5 h-3.5" />
              ) : (
                <Minimize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        {!minimized && (
          <>
            <div className="max-h-64 overflow-y-auto p-2 space-y-1.5">
              {staleOrders.map((order) => {
                const mins = Math.floor(
                  (Date.now() - new Date(order.createdAt).getTime()) / 60000
                );
                const isUrgent = mins >= URGENT_MINS;

                return (
                  <div
                    key={order.id}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs ${
                      isUrgent
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-8 rounded-full shrink-0 ${
                        isUrgent ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-brand-darkText">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                            statusStyles[order.status] ?? 'bg-gray-100'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-brand-mutedText">
                        <span className="inline-flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {order.table === '—' ? 'Takeaway' : `Table ${order.table}`}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 font-semibold ${
                            isUrgent ? 'text-red-600' : 'text-amber-700'
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          {mins}m ago
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenOrders}
                      className="text-[10px] font-bold text-brand-primary hover:underline shrink-0"
                    >
                      View →
                    </button>
                    <button
                      onClick={() => handleDismiss(order.id)}
                      className="p-1 rounded hover:bg-white/60 shrink-0"
                      aria-label="Dismiss"
                      title="Dismiss this reminder"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-brand-border bg-gray-50">
              <p className="text-[10px] text-brand-mutedText">
                Pending for {THRESHOLD_MINS}+ mins
              </p>
              <button
                onClick={handleDismissAll}
                className="text-[10px] font-semibold text-brand-mutedText hover:text-brand-darkText"
              >
                Dismiss all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio errors (e.g., if user hasn't interacted with page)
  }
}