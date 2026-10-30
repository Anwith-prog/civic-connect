import React from 'react';
import { Phone, ShieldAlert, AlertTriangle, X, Flame, Waves, HeartPulse } from 'lucide-react';

interface EmergencyHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelplineModal: React.FC<EmergencyHelplineModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const emergencyContacts = [
    { name: 'All-in-One National Emergency', number: '112', desc: 'Police, Fire, Ambulance coordination', icon: ShieldAlert, color: 'bg-red-500' },
    { name: 'Fire & Rescue Services', number: '101', desc: 'Gas leaks, fire outbreak, building collapse', icon: Flame, color: 'bg-orange-500' },
    { name: 'Medical Emergency Ambulance', number: '108', desc: 'Life support & trauma transport', icon: HeartPulse, color: 'bg-emerald-600' },
    { name: 'BESCOM Electricity Emergency', number: '1912', desc: 'Snapped high tension wires & transformer fire', icon: AlertTriangle, color: 'bg-amber-500' },
    { name: 'BWSSB Water & Sewage Board', number: '1916', desc: 'Major main water pipe burst & sewage overflow', icon: Waves, color: 'bg-blue-600' },
    { name: 'Disaster Management Control Room', number: '080-22221188', desc: 'Monsoon flooding & tree falling emergency', icon: ShieldAlert, color: 'bg-indigo-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="h-6 w-6" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Emergency & Civic Helplines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {emergencyContacts.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.number}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.color} text-white shadow-xs`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{c.desc}</div>
                  </div>
                </div>

                <a
                  href={`tel:${c.number}`}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-mono font-bold text-red-600 shadow-xs border border-red-200 hover:bg-red-50 dark:bg-slate-900 dark:border-slate-700"
                >
                  <Phone className="h-3 w-3" />
                  <span>{c.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl bg-amber-50 p-3 text-center text-xs font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          ⚠️ For immediate threat to life, call <strong>112</strong> instantly.
        </div>
      </div>
    </div>
  );
};
