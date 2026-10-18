import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@tablemint.local');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo Login Logic (Frontend Only for now)
    setTimeout(() => {
      if (email === 'admin@tablemint.local' && password === 'admin123') {
        // Success - Redirect to POS
        navigate('/pos');
      } else {
        setError('Invalid credentials. Please use the demo credentials below.');
        setIsLoading(false);
      }
    }, 800); // Fake network delay for realistic feel
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient (Same as app) */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-[#7ed6d0] to-brand-softBg -z-10" />

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Header section with brand */}
        <div className="p-8 pb-6 text-center border-b border-brand-border">
          <div className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/30">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-brand-darkText mb-1">
            Welcome to TableMint
          </h1>
          <p className="text-sm text-brand-mutedText">
            Sign in to manage your restaurant
          </p>
        </div>

        {/* Form section */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-mutedText mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mutedText" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border bg-white text-sm text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-mutedText hover:text-brand-darkText transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 text-brand-mutedText cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/40"
              />
              Remember me
            </label>
            <button type="button" className="font-medium text-brand-primary hover:text-brand-primaryHover transition">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-primaryHover transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials helper */}
        <div className="bg-brand-content px-8 py-4 border-t border-brand-border text-center">
          <p className="text-[11px] text-brand-mutedText mb-1">Demo Credentials:</p>
          <p className="text-xs font-medium text-brand-darkText">
            admin@tablemint.local / admin123
          </p>
        </div>
      </div>
    </div>
  );
}