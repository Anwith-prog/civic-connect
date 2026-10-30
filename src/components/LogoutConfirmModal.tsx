import React, { useState } from 'react';
import { LogOut, X, AlertTriangle, Shield, Smartphone, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, logout, logoutAllSessions, activeSessions } = useAuth();
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleConfirmLogout = async () => {
    setIsProcessing(true);
    if (logoutAllDevices) {
      await logoutAllSessions();
    } else {
      await logout();
    }
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60">
              <LogOut className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              End Active Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current User Card */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-500">{currentUser.email}</div>
              <span className="inline-block mt-1 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300 uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to log out of CivicConnect? Any unsaved complaint draft will remain locally on this device.
        </p>

        {/* Logout from all devices option */}
        <div className="mt-4 rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={logoutAllDevices}
              onChange={(e) => setLogoutAllDevices(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 mt-0.5"
            />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200">
                Terminate all active sessions across all devices
              </span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                Revokes credentials on mobile apps and other browsers immediately.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={isProcessing}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition-all disabled:opacity-50"
          >
            {isProcessing ? 'Ending Session...' : 'Confirm Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};
