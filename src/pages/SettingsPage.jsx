import { useState } from 'react';
import {
  Store,
  Receipt,
  Clock,
  RotateCcw,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  CalendarClock,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleHourChange = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value },
      },
    }));
  };

  const handleSave = () => {
    updateSettings(form);
    showToast('Settings saved successfully.');
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset all settings to default? This will overwrite your current configuration.'
      )
    ) {
      resetSettings();
      setForm(settings);
      showToast('Settings reset to defaults.');
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-darkText placeholder:text-brand-mutedText focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary';

  return (
    <>
      <div className="p-5 md:p-6 space-y-5 max-w-4xl pb-20">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <h1 className="text-xl font-bold text-brand-darkText">Settings</h1>
            <p className="text-sm text-brand-mutedText">
              Manage your restaurant profile, billing preferences, and opening
              hours.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-mutedText text-sm font-medium hover:border-gray-300 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* --- Section 1: Restaurant Profile --- */}
        <section className="bg-white border border-brand-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
            <Store className="w-4 h-4 text-brand-primary" />
            <h2 className="text-sm font-bold text-brand-darkText">
              Restaurant Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={form.restaurantName}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1">
                <Phone className="w-3 h-3" /> Contact Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-mutedText mb-2 inline-flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* --- Section 2: Preferences --- */}
        <section className="bg-white border border-brand-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
            <Receipt className="w-4 h-4 text-brand-primary" />
            <h2 className="text-sm font-bold text-brand-darkText">
              Billing Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className={inputCls}
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Timezone
              </label>
              <select
                value={form.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className={inputCls}
              >
                <option value="Asia/Karachi (UTC+05:00)">
                  Asia/Karachi (UTC+05:00)
                </option>
                <option value="Asia/Dubai (UTC+04:00)">
                  Asia/Dubai (UTC+04:00)
                </option>
                <option value="Europe/London (UTC+00:00)">
                  Europe/London (UTC+00:00)
                </option>
                <option value="America/New_York (UTC-05:00)">
                  America/New_York (UTC-05:00)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Default Tax (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.taxRate}
                onChange={(e) =>
                  handleChange('taxRate', Number(e.target.value))
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Default Donation Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.donationAmount}
                onChange={(e) =>
                  handleChange('donationAmount', Number(e.target.value))
                }
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-mutedText mb-2">
                Receipt Footer Text
              </label>
              <textarea
                value={form.receiptFooter}
                onChange={(e) =>
                  handleChange('receiptFooter', e.target.value)
                }
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </section>

        {/* --- Section 3: Opening Hours --- */}
        <section className="bg-white border border-brand-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
            <Clock className="w-4 h-4 text-brand-primary" />
            <h2 className="text-sm font-bold text-brand-darkText">
              Opening Hours
            </h2>
          </div>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const hours = form.openingHours[day];
              return (
                <div
                  key={day}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-content/50 transition"
                >
                  <div className="w-24 text-sm font-medium text-brand-darkText shrink-0">
                    {day}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        handleHourChange(day, 'open', e.target.value)
                      }
                      disabled={hours.closed}
                      className={`w-32 px-2.5 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary ${
                        hours.closed
                          ? 'bg-gray-100 border-gray-200 text-gray-400'
                          : 'bg-white border-brand-border text-brand-darkText'
                      }`}
                    />
                    <span className="text-xs text-brand-mutedText">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        handleHourChange(day, 'close', e.target.value)
                      }
                      disabled={hours.closed}
                      className={`w-32 px-2.5 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary ${
                        hours.closed
                          ? 'bg-gray-100 border-gray-200 text-gray-400'
                          : 'bg-white border-brand-border text-brand-darkText'
                      }`}
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-xs text-brand-mutedText cursor-pointer w-20 shrink-0">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) =>
                        handleHourChange(day, 'closed', e.target.checked)
                      }
                      className="w-3.5 h-3.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/40"
                    />
                    Closed
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- Section 4: User Profile --- */}
        <section className="bg-white border border-brand-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
            <User className="w-4 h-4 text-brand-primary" />
            <h2 className="text-sm font-bold text-brand-darkText">
              User Profile
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-darkText">Sohan</p>
              <p className="text-xs text-brand-mutedText">
                Admin · sohan@tablemint.local
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                showToast(
                  'Profile editing will be available in the next release.'
                )
              }
              className="px-3 py-1.5 rounded-lg border border-brand-border text-xs font-medium text-brand-mutedText hover:bg-gray-50 transition shrink-0"
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
            <CalendarClock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-snug">
              Login credentials and password management will be fully
              integrated once authentication is connected in a future update.
            </p>
          </div>
        </section>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-brand-primary animate-toast"
          role="status"
        >
          {toast}
        </div>
      )}
    </>
  );
}