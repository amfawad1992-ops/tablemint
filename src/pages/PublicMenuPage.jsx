import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrdersContext';
import { useTables } from '../context/TablesContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import {
  ShoppingBag,
  UtensilsCrossed,
  X,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  Edit3,
  Star,
  ChefHat,
  CheckCheck,
  Loader2,
  Bell,
} from 'lucide-react';

// --- LIVE ORDER TRACKER COMPONENT ---
function OrderTracker({ orderNumber, table, onNewOrder }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status steps
  const steps = [
    { key: 'New', label: 'Order Placed', icon: CheckCircle2 },
    { key: 'Confirmed', label: 'Confirmed by Staff', icon: CheckCheck },
    { key: 'In Kitchen', label: 'Cooking', icon: ChefHat },
    { key: 'Ready', label: 'Ready to Serve', icon: Bell },
    { key: 'Served', label: 'Served', icon: UtensilsCrossed },
  ];

  useEffect(() => {
    let interval;
    async function fetchStatus() {
      try {
        const data = await api.getOrderByNumber(orderNumber);
        setOrder(data);
        setLoading(false);
        
        // Stop polling if order is served or completed
        if (data.status === 'Served' || data.status === 'Completed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Tracking error:", err);
      }
    }

    fetchStatus();
    interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  const currentStatus = order?.status || 'New';
  const currentIndex = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4 pb-10 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-brand-primary text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <p className="text-[10px] uppercase tracking-widest opacity-90 font-bold mb-1 relative z-10">Live Order Status</p>
          <h1 className="text-3xl font-extrabold mb-2 relative z-10">{orderNumber}</h1>
          <p className="text-sm opacity-90 font-medium relative z-10">Table {table}</p>
        </div>

        {/* Tracker Steps */}
        <div className="p-8">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 -z-0"></div>

            <div className="space-y-8 relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-center gap-4">
                    {/* Icon circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : 'bg-white border-gray-200 text-gray-300'
                    } ${isCurrent ? 'ring-4 ring-brand-primary/20 scale-110' : ''}`}>
                      <Icon className={`w-5 h-5 ${isCurrent && step.key === 'In Kitchen' ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    {/* Text */}
                    <div>
                      <p className={`text-sm font-bold transition-colors ${
                        isCompleted ? 'text-brand-darkText' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[11px] text-brand-primary font-semibold mt-0.5">
                          Currently here...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-4">It usually takes 15-20 mins for food to be ready.</p>
          <button
            onClick={onNewOrder}
            className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-brand-darkText hover:bg-gray-100 transition shadow-sm"
          >
            Order Something Else
          </button>
        </div>
      </div>
    </div>
  );
}
// ------------------------------------


export default function PublicMenuPage() {
  const { menu } = useMenu();
  const { addOrder } = useOrders();
  const { tables } = useTables();
  const { settings } = useSettings();

  const [searchParams] = useSearchParams();
  const tableFromUrl = searchParams.get('table') || '';

  const [selectedTable, setSelectedTable] = useState(tableFromUrl);
  const [showTableChanger, setShowTableChanger] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Tracking states
  const [placedOrderNumber, setPlacedOrderNumber] = useState(null); 
  const [isPlacing, setIsPlacing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const restaurantName = settings?.restaurantName || 'TableMint';
  const tagline = settings?.tagline || 'Smart Orders. Smooth Service.';
  
  const availableItems = menu.filter((m) => m.available);
  const categories = ['All', ...new Set(availableItems.map((m) => m.category))];
  const filtered =
    activeCategory === 'All'
      ? availableItems
      : availableItems.filter((m) => m.category === activeCategory);

  const selectedTableObj = tables.find((t) => t.id === selectedTable);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.qty + delta;
            return newQty > 0 ? { ...i, qty: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const getQtyInCart = (id) => cart.find((i) => i.id === id)?.qty || 0;

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handlePlaceOrderClick = () => {
    if (!selectedTable) {
      alert('Please select your table number before placing the order.');
      return;
    }
    if (cart.length === 0) return;
    setShowConfirm(true);
  };

  const confirmPlaceOrder = async () => {
    setShowConfirm(false);
    setIsPlacing(true);

    try {
      const itemsPayload = cart.map((item) => ({
        foodId: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const newOrder = await addOrder({
        type: 'Dine In',
        table: selectedTable,
        people: 1,
        items: itemsPayload,
        notes: `Ordered via QR Menu (Table ${selectedTable})`,
      });

      setCart([]);
      setIsCartOpen(false);
      
      if (newOrder && newOrder.id) {
         setPlacedOrderNumber(newOrder.id);
      }

    } catch (err) {
      console.error(err);
      alert('Failed to place order. Check console.');
    } finally {
      setIsPlacing(false);
    }
  };

  // --- IF ORDER IS PLACED, SHOW LIVE TRACKER ---
  if (placedOrderNumber) {
    return (
      <OrderTracker 
        orderNumber={placedOrderNumber} 
        table={selectedTable} 
        onNewOrder={() => setPlacedOrderNumber(null)} 
      />
    );
  }

  // --- MENU PAGE ---
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 font-sans">
      
      {/* HERO BANNER */}
      <div className="relative h-72 w-full bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
          alt="Restaurant Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/90 text-sm font-semibold tracking-wide uppercase">
              {restaurantName}
            </span>
          </div>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition hover:bg-white/30"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4 pb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Welcome to {restaurantName}
          </h1>
          <p className="text-white/80 text-sm mb-6 max-w-xs">
            {tagline}
          </p>
          
          <div
            onClick={() => setShowTableChanger(true)}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-white/20 transition-all"
          >
            <MapPin className="w-4 h-4 text-brand-primary" />
            {selectedTable ? `Table ${selectedTable}` : 'Select Table'}
            <Edit3 className="w-3.5 h-3.5 ml-1 opacity-70" />
          </div>
        </div>
      </div>

      {/* MENU CONTENT */}
      <main className="max-w-5xl mx-auto px-4 -mt-6 relative z-20">
        
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-2 mb-8 overflow-hidden">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <h2 className="text-lg font-extrabold text-brand-darkText tracking-wide uppercase">
            {activeCategory === 'All' ? 'Our Menu' : activeCategory}
          </h2>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const qty = getQtyInCart(item.id);
            return (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.featured && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-950" /> Featured
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-base font-bold text-brand-darkText leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-lg font-extrabold text-brand-primary shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {item.description || 'Delicious item prepared fresh.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full py-2.5 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-bold hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        Add to Order
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-brand-primary rounded-xl p-1 text-white shadow-inner">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-lg transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-extrabold w-8 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-lg transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FLOATING CART BAR */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-4 right-4 z-30 max-w-md mx-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gray-900 text-white rounded-full px-6 py-4 shadow-2xl flex items-center justify-between hover:bg-black transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
                {cartItemCount}
              </div>
              <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform">View your order</span>
            </div>
            <span className="text-base font-extrabold text-brand-primary">
              ${cartTotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-brand-darkText">
                Your Order
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-brand-primary/70 uppercase tracking-wider">
                    Delivering to
                  </p>
                  <p className="text-lg font-extrabold text-brand-primary">
                    {selectedTable ? `Table ${selectedTable}` : 'No table selected'}
                  </p>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center mt-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-darkText truncate">
                          {item.name}
                        </p>
                        <p className="text-sm font-extrabold text-brand-primary mt-0.5">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-brand-darkText py-1">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-extrabold text-brand-darkText">
                    <span>Total</span>
                    <span className="text-2xl text-brand-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrderClick}
                  disabled={isPlacing}
                  className="w-full py-4 rounded-2xl bg-brand-primary text-white font-extrabold text-lg hover:bg-brand-primaryHover shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50"
                >
                  {isPlacing ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* TABLE CHANGER MODAL */}
      {showTableChanger && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-brand-darkText">
                Select Your Table
              </h2>
              <button
                onClick={() => setShowTableChanger(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTable(t.id);
                    setShowTableChanger(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                    selectedTable === t.id
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                      : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">Table {t.id}</span>
                  <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                    {t.seats} seats
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM ORDER MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-brand-darkText mb-2">
                Confirm Order
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to place this order for <strong className="text-brand-primary">Table {selectedTable}</strong>?
              </p>
              
              <div className="bg-gray-50 rounded-2xl px-5 py-4 mb-8 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Total Items</p>
                  <p className="text-lg font-extrabold text-brand-darkText">{cartItemCount}</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Total Amount</p>
                  <p className="text-lg font-extrabold text-brand-primary">${cartTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPlaceOrder}
                  className="flex-1 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryHover shadow-lg shadow-brand-primary/30 transition"
                >
                  Yes, Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}