import React from 'react';
import { Shield, Smartphone, Laptop, Globe, X, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SessionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionManagerModal: React.FC<SessionManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, activeSessions, logoutAllSessions } = useAuth();

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Login Sessions
              </h3>
              <p className="text-[11px] text-slate-500">
                Security audit & active device tokens for {currentUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
          {activeSessions.map((s, idx) => (
            <div
              key={s.token || idx}
              className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-xs dark:bg-slate-900 dark:text-slate-200">
                  {s.device.includes('Mobile') ? <Smartphone className="h-5 w-5" /> : <Laptop className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {s.device}
                    </span>
                    {idx === 0 && (
                      <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    IP: {s.ip} · Started: {s.createdAt}
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                Active
              </span>
            </div>
          ))}
        </div>

        {/* Security Summary & Revoke Action */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            {activeSessions.length} active device sessions
          </span>

          <button
            onClick={async () => {
              await logoutAllSessions();
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out All Other Sessions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
