import React from 'react';
import {
  LayoutDashboard,
  Radio,
  FileSpreadsheet,
  BarChart3,
  FileCheck2,
  PhoneCall,
  Settings,
  LogOut,
  Users,
  Award,
  AlertTriangle,
  PlusCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onOpenReportModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  lang,
  onOpenReportModal,
}) => {
  const t = translations[lang] || translations.en;

  const mainNavItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'live-monitoring', label: t.liveMonitoring, icon: Radio, hasLiveBadge: true },
    { id: 'complaints', label: t.complaints, icon: FileSpreadsheet },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'abs-reports', label: t.absReports, icon: FileCheck2 },
    { id: 'call-recordings', label: t.callRecordings, icon: PhoneCall },
  ];

  const communityNavItems = [
    { id: 'volunteer', label: t.volunteer, icon: Users },
    { id: 'rewards', label: t.rewards, icon: Award },
    { id: 'emergency', label: t.emergencyHelpline, icon: AlertTriangle, isAlert: true },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0b51c5] text-white shadow-xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-blue-400/20">
          <div className="flex items-center gap-3">
            {/* Civic Emblem Ring */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700/60 ring-2 ring-amber-300/60 shadow-md">
              <ShieldCheck className="h-6 w-6 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-white">GIS</span>
              <span className="text-[10px] uppercase tracking-widest text-blue-200/80 font-semibold">
                CivicConnect
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-blue-200 hover:bg-blue-600/40 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Quick Report CTA Button for all users */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              onOpenReportModal();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="truncate">{t.reportNewProblem}</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/70 px-3 py-1">
            GIS Core
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#0b51c5] font-semibold shadow-md'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#0b51c5]' : 'text-blue-200 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.hasLiveBadge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${
                      isActive
                        ? 'bg-red-500 text-white'
                        : 'bg-red-500/80 text-white group-hover:bg-red-500'
                    }`}
                  >
                    LIVE
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 text-[11px] font-semibold uppercase tracking-wider text-blue-200/70 px-3 py-1">
            Community & Aid
          </div>

          {communityNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#0b51c5] font-semibold shadow-md'
                    : item.isAlert
                    ? 'text-amber-200 hover:bg-amber-500/20 hover:text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#0b51c5]'
                        : item.isAlert
                        ? 'text-amber-300'
                        : 'text-blue-200 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation: Settings */}
        <div className="border-t border-blue-400/20 p-4">
          <button
            onClick={() => handleNavClick('settings')}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              currentTab === 'settings'
                ? 'bg-white text-[#0b51c5] font-semibold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="h-5 w-5 text-blue-200" />
            <span>{t.settings}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
