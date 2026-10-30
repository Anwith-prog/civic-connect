import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Settings as SettingsIcon,
  Globe,
  Sun,
  Moon,
  Type,
  ChevronDown,
  CheckCircle2,
  X,
  ExternalLink,
  Download,
} from 'lucide-react';
import { LanguageCode, Role, NotificationItem } from '../types';
import { translations } from '../data/translations';
import { useAuth } from '../context/AuthContext';
import { LogOut, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lang: LanguageCode;
  onLanguageChange: (l: LanguageCode) => void;
  currentRole: Role;
  onRoleChange: (r: Role) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isLargeText: boolean;
  onToggleLargeText: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onSelectComplaint: (id: string) => void;
  onOpenSettings: () => void;
  onToggleFolderDrawer: () => void;
  onOpenLogoutModal: () => void;
  onOpenSessionManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title,
  searchQuery,
  onSearchChange,
  lang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  isDarkMode,
  onToggleDarkMode,
  isLargeText,
  onToggleLargeText,
  notifications,
  onMarkNotificationsRead,
  onSelectComplaint,
  onOpenSettings,
  onToggleFolderDrawer,
  onOpenLogoutModal,
  onOpenSessionManager,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const t = translations[lang] || translations.en;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<Role, string> = {
    citizen: t.roleCitizen || 'Citizen',
    volunteer: t.roleVolunteer || 'Volunteer',
    worker: t.roleWorker || 'Field Worker',
    guest: 'Guest Citizen',
  };

  const handleRoleSelect = (role: Role) => {
    onRoleChange(role);
    setShowRoleDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Hamburger & Overview Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
      </div>

      {/* Center: Search input matching screenshot pill */}
      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-xs transition-colors focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Right Controls: Notifications, Settings, Role switch, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowNotifications(false);
              setShowRoleDropdown(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            title="Switch Language"
          >
            <Globe className="h-4 w-4 text-slate-500" />
            <span className="hidden uppercase sm:inline font-semibold">{lang}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <button
                onClick={() => {
                  onLanguageChange('en');
                  setShowLangDropdown(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium ${
                  lang === 'en' ? 'text-blue-600 bg-blue-50 dark:bg-slate-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                English {lang === 'en' && '✓'}
              </button>
              <button
                onClick={() => {
                  onLanguageChange('kn');
                  setShowLangDropdown(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium ${
                  lang === 'kn' ? 'text-blue-600 bg-blue-50 dark:bg-slate-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                ಕನ್ನಡ (Kannada) {lang === 'kn' && '✓'}
              </button>
              <button
                onClick={() => {
                  onLanguageChange('hi');
                  setShowLangDropdown(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium ${
                  lang === 'hi' ? 'text-blue-600 bg-blue-50 dark:bg-slate-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                हिंदी (Hindi) {lang === 'hi' && '✓'}
              </button>
            </div>
          )}
        </div>

        {/* Direct Download ZIP Button */}
        <a
          href="/api/download-zip"
          download="civicconnect-project.zip"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors"
          title="Download full project folder (.ZIP)"
        >
          <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Download ZIP</span>
        </a>

        {/* Pull/Drag Folder Drawer Button */}
        <button
          onClick={onToggleFolderDrawer}
          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
          title="Pull open project folder drawer"
        >
          <span>📁</span>
          <span className="hidden sm:inline">Folder Drawer</span>
        </button>

        {/* Accessibility Large Text */}
        <button
          onClick={onToggleLargeText}
          className={`rounded-lg p-2 transition-colors ${
            isLargeText
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
          title="Toggle Large Text Accessibility"
        >
          <Type className="h-4 w-4" />
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell matching screenshot with yellow counter badge "12" */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
              setShowLangDropdown(false);
            }}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-slate-900 shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadCount > 9 ? '12' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t.notifications}
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {unreadCount} unread
                  </span>
                </div>
                <button
                  onClick={onMarkNotificationsRead}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {t.markAllRead}
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">No new notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.complaintId) {
                          onSelectComplaint(item.complaintId);
                          setShowNotifications(false);
                        }
                      }}
                      className={`flex flex-col gap-1 p-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl ${
                        !item.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          onClick={onOpenSettings}
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>

        {/* Authenticated Profile or Guest Sign In */}
        {isAuthenticated && currentUser ? (
          <div className="relative ml-1 sm:ml-2 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifications(false);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500 shadow-xs"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                  {roleLabels[currentUser.role] || currentUser.role}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Direct Logout Button dedicated to this profile */}
            <button
              onClick={onOpenLogoutModal}
              className="flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-rose-50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-rose-600 shadow-2xs hover:bg-rose-100 hover:border-rose-300 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950 transition-all active:scale-95"
              title="Logout session"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Account Details & Sessions Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 top-12 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-800 z-50 space-y-2">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 px-1">
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      ★ {currentUser.points} Civic Points · {currentUser.ward?.split('-')[0] || 'Indiranagar'}
                    </div>
                  </div>
                </div>

                {/* Session Security Action */}
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenSessionManager();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Active Sessions & Devices</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Manage</span>
                </button>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Role Switch
                  </div>
                  {(['citizen', 'volunteer', 'worker'] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        currentUser.role === r
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="capitalize">{roleLabels[r]}</span>
                      {currentUser.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>

                {/* Sign Out CTA in Dropdown */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenLogoutModal();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>End Active Session (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-1">
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 rounded-xl border border-blue-600 bg-white px-3.5 py-2 text-xs font-bold text-blue-600 shadow-xs hover:bg-blue-50 dark:bg-slate-800 dark:border-blue-500 dark:text-blue-300 transition-all"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all"
            >
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
