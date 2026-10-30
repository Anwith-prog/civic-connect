import React, { useState } from 'react';
import { Settings, X, Bell, Globe, Shield, Smartphone, Check, Database, KeyRound, UserCheck } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import { useAuth } from '../context/AuthContext';
import { getFirebaseSyncStatus } from '../services/firebaseService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onLanguageChange: (l: LanguageCode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const syncStatus = getFirebaseSyncStatus();

  if (!isOpen) return null;
  const t = translations[lang] || translations.en;

  const [channels, setChannels] = useState({
    inApp: true,
    sms: true,
    whatsapp: true,
    email: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              System, Database & Session Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-5">
          {/* Active Session & Account Status */}
          {currentUser && (
            <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Session Profile
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Authenticated
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name} ({currentUser.role})
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Database & Realtime Backend Status */}
          <div className="rounded-2xl bg-blue-50/50 p-3.5 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                <Database className="h-4 w-4 text-blue-600" />
                <span>Backend Database Engine</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Realtime Active
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
              Express full-stack API with persistent in-memory database store & Firebase integration ready.
            </p>
          </div>
          {/* Language preference */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 block">
              Default Interface Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
                { code: 'hi', label: 'हिंदी' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onLanguageChange(item.code as LanguageCode)}
                  className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                    lang === item.code
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 block">
              Real-time Alert Delivery Channels
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 cursor-pointer">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  In-App Notification Center
                </span>
                <input
                  type="checkbox"
                  checked={channels.inApp}
                  onChange={(e) => setChannels({ ...channels, inApp: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 cursor-pointer">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  SMS Text Notifications
                </span>
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 cursor-pointer">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  WhatsApp Status Alerts
                </span>
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-md"
            >
              {savedSuccess ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
