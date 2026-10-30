import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { LiveMonitoringView } from './components/LiveMonitoringView';
import { ComplaintsListView } from './components/ComplaintsListView';
import { VolunteerConnectView } from './components/VolunteerConnectView';
import { RewardsView } from './components/RewardsView';
import { ComplaintTrackerModal } from './components/ComplaintTrackerModal';
import { ReportComplaintModal } from './components/ReportComplaintModal';
import { CivicChatbotModal } from './components/CivicChatbotModal';
import { EmergencyHelplineModal } from './components/EmergencyHelplineModal';
import { SettingsModal } from './components/SettingsModal';
import { ProjectFolderDrawer } from './components/ProjectFolderDrawer';
import { AuthModal } from './components/AuthModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { SessionManagerModal } from './components/SessionManagerModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  Complaint,
  WorkerInfo,
  VolunteerEvent,
  NotificationItem,
  EmergencyAlert,
  LeaderboardUser,
  Role,
  LanguageCode,
  ComplaintStage,
} from './types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_WORKERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_VOLUNTEER_EVENTS,
  INITIAL_LEADERBOARD,
} from './data/seedData';
import { translations } from './data/translations';
import { Bot, PhoneCall, BarChart3, FileCheck2, Clock, CheckCircle } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <CivicConnectApp />
    </AuthProvider>
  );
}

function CivicConnectApp() {
  const { currentUser, quickSwitchRole, openAuthModal, isAuthenticated } = useAuth();

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Role & i18n & Theme
  const currentRole: Role = currentUser?.role || 'guest';
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  // Data states
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [workers, setWorkers] = useState<WorkerInfo[]>(INITIAL_WORKERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [volunteerEvents, setVolunteerEvents] = useState<VolunteerEvent[]>(INITIAL_VOLUNTEER_EVENTS);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(INITIAL_EMERGENCY_ALERTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [userPoints, setUserPoints] = useState<number>(currentUser?.points || 340);

  // Modals & Drawers
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFolderDrawerOpen, setIsFolderDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch initial data from backend if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [compRes, notifRes, alertsRes, volRes] = await Promise.all([
          fetch('/api/complaints'),
          fetch('/api/notifications'),
          fetch('/api/emergency-alerts'),
          fetch('/api/volunteer/events'),
        ]);

        if (compRes.ok) {
          const cData = await compRes.json();
          if (cData.data) setComplaints(cData.data);
        }
        if (notifRes.ok) {
          const nData = await notifRes.json();
          if (nData.data) setNotifications(nData.data);
        }
        if (alertsRes.ok) {
          const aData = await alertsRes.json();
          if (aData.data) setEmergencyAlerts(aData.data);
        }
        if (volRes.ok) {
          const vData = await volRes.json();
          if (vData.data) setVolunteerEvents(vData.data);
        }
      } catch (err) {
        console.warn('Backend fetch failed, utilizing enriched local civic store', err);
      }
    }
    loadBackendData();
  }, []);

  // Handler: Upvote ("I also face this issue")
  const handleVote = async (id: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/vote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  votes: data.votes,
                  userVoted: data.userVoted,
                  priority: data.priority || c.priority,
                }
              : c
          )
        );
        setUserPoints((p) => p + 5);
      }
    } catch {
      // Local fallback
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const nextVoted = !c.userVoted;
            return {
              ...c,
              votes: nextVoted ? c.votes + 1 : Math.max(1, c.votes - 1),
              userVoted: nextVoted,
            };
          }
          return c;
        })
      );
      setUserPoints((p) => p + 5);
    }
  };

  // Handler: Community verification of solved work
  const handleVerify = async (id: string, vote: 'yes' | 'no') => {
    try {
      const res = await fetch(`/api/complaints/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, communityVerifiedVotes: data.communityVerifiedVotes } : c))
        );
        setUserPoints((p) => p + 10);
      }
    } catch {
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              communityVerifiedVotes: {
                yes: vote === 'yes' ? c.communityVerifiedVotes.yes + 1 : c.communityVerifiedVotes.yes,
                no: vote === 'no' ? c.communityVerifiedVotes.no + 1 : c.communityVerifiedVotes.no,
                userVote: vote,
              },
            };
          }
          return c;
        })
      );
      setUserPoints((p) => p + 10);
    }
  };

  // Handler: Rate resolution
  const handleRate = async (id: string, rating: number, feedback: string) => {
    try {
      await fetch(`/api/complaints/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback }),
      });
    } catch (e) {
      console.warn(e);
    }
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, rating, feedback } : c))
    );
  };

  // Handler: Reopen complaint
  const handleReopen = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) => prev.map((c) => (c.id === id ? data.data : c)));
      }
    } catch {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'Under Review',
                timeline: [
                  ...c.timeline,
                  {
                    stage: 'Under Review',
                    timestamp: 'Just now',
                    note: `Citizen reopened ticket: ${reason}`,
                    updatedBy: 'Citizen',
                  },
                ],
              }
            : c
        )
      );
    }
  };

  // Handler: Add comment
  const handleAddComment = async (id: string, text: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userName: currentUser?.name || 'Anwith' }),
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, comments: [...c.comments, data.data] } : c))
        );
      }
    } catch {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                comments: [
                  ...c.comments,
                  { id: `c-${Date.now()}`, userName: currentUser?.name || 'Anwith', text, timestamp: 'Just now' },
                ],
              }
            : c
        )
      );
    }
  };

  // Handler: Update complaint status & worker
  const handleUpdateStatus = async (id: string, stage: ComplaintStage, workerId?: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, workerId }),
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) => prev.map((c) => (c.id === id ? data.data : c)));
      }
    } catch {
      const worker = workers.find((w) => w.id === workerId);
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: stage,
                assignedWorker: worker || c.assignedWorker,
              }
            : c
        )
      );
    }
  };

  // Handler: Merge duplicate tickets
  const handleMergeDuplicates = async (masterId: string, duplicateId: string) => {
    try {
      const res = await fetch('/api/complaints/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterId, duplicateId }),
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) =>
          prev.map((c) => (c.id === masterId ? data.master : c.id === duplicateId ? data.duplicate : c))
        );
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Handler: Create new complaint
  const handleCreateComplaint = async (formData: any) => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) => [data.data, ...prev]);
        setUserPoints((p) => p + 20);
        return data.data.id;
      }
    } catch (e) {
      console.warn(e);
    }

    const fakeId = `CC-2026-${String(complaints.length + 101).padStart(5, '0')}`;
    const newComp: Complaint = {
      id: fakeId,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      location: formData.location,
      priority: formData.priority,
      status: 'Submitted',
      createdAt: 'Just now',
      estimatedResolutionDate: 'In 48h',
      images: formData.images,
      beforeImage: formData.images[0],
      reportedBy: { id: 'USR-1', name: formData.reporterName || 'Citizen' },
      votes: 1,
      userVoted: true,
      communityVerifiedVotes: { yes: 0, no: 0 },
      timeline: [
        { stage: 'Submitted', timestamp: 'Just now', note: 'Complaint logged in system.', updatedBy: 'Citizen' },
      ],
      comments: [],
    };
    setComplaints([newComp, ...complaints]);
    setUserPoints((p) => p + 20);
    return fakeId;
  };

  // Handler: Volunteer registration
  const handleVolunteerRegister = async (eventId: string, details: any) => {
    try {
      await fetch(`/api/volunteer/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
    } catch (e) {
      console.warn(e);
    }

    setVolunteerEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              registeredCount: ev.registeredCount + 1,
              registeredUsers: [...ev.registeredUsers, 'USR-CURRENT'],
            }
          : ev
      )
    );
    setUserPoints((p) => p + 50);
  };

  // Handler: Mark all notifications read
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (e) {
      console.warn(e);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Tab labels for top header
  const tabTitles: Record<string, string> = {
    'dashboard': translations[lang]?.overview || 'Overview',
    'live-monitoring': translations[lang]?.liveMonitoring || 'Live Monitoring (GIS)',
    'complaints': translations[lang]?.complaints || 'Complaints Repository',
    'reports': 'Municipal SLA & Performance Reports',
    'abs-reports': 'Automated Biometric & Sanitation (ABS) Reports',
    'call-recordings': 'Citizen Helpline Audio Logs',
    'volunteer': translations[lang]?.volunteer || 'Volunteer Connect',
    'rewards': translations[lang]?.rewards || 'Rewards & Impact',
    'emergency': translations[lang]?.emergencyHelpline || 'Emergency Helpline',
  };

  const activeComplaint = complaints.find((c) => c.id === activeComplaintId) || null;

  return (
    <div
      className={`min-h-screen bg-[#f4f7fb] text-slate-800 dark:bg-slate-950 dark:text-slate-100 ${
        isLargeText ? 'text-base' : 'text-sm'
      }`}
    >
      <div className="flex h-screen overflow-hidden">
        {/* 1. Left Royal Blue GIS Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'emergency') {
              setIsEmergencyModalOpen(true);
            } else if (tab === 'settings') {
              setIsSettingsOpen(true);
            } else if (tab === 'logout') {
              setIsLogoutModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          lang={lang}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />

        {/* 2. Main Content Canvas */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Top Bar Header */}
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            title={tabTitles[currentTab] || 'Overview'}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            lang={lang}
            onLanguageChange={setLang}
            currentRole={currentRole}
            onRoleChange={(r) => quickSwitchRole(r)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            isLargeText={isLargeText}
            onToggleLargeText={() => setIsLargeText(!isLargeText)}
            notifications={notifications}
            onMarkNotificationsRead={handleMarkNotificationsRead}
            onSelectComplaint={(id) => setActiveComplaintId(id)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleFolderDrawer={() => setIsFolderDrawerOpen(!isFolderDrawerOpen)}
            onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
            onOpenSessionManager={() => setIsSessionManagerOpen(true)}
          />

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {currentTab === 'dashboard' && (
              <DashboardView
                complaints={complaints}
                onSelectComplaint={(id) => setActiveComplaintId(id)}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                lang={lang}
              />
            )}

            {currentTab === 'live-monitoring' && (
              <LiveMonitoringView
                complaints={complaints}
                emergencyAlerts={emergencyAlerts}
                onSelectComplaint={(id) => setActiveComplaintId(id)}
                lang={lang}
              />
            )}

            {currentTab === 'complaints' && (
              <ComplaintsListView
                complaints={complaints}
                workers={workers}
                onSelectComplaint={(id) => setActiveComplaintId(id)}
                onUpdateStatus={handleUpdateStatus}
                onVote={handleVote}
                onMergeDuplicates={handleMergeDuplicates}
                currentRole={currentRole}
                lang={lang}
              />
            )}

            {/* Reports View */}
            {currentTab === 'reports' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    Department Service Level Agreement (SLA) Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Real-time monitoring of average ticket turnaround times against target benchmark (48 hours).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                      <div className="text-xs font-bold text-slate-400">Roads Division</div>
                      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">28.4 hrs</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">✓ 19.6 hrs ahead of SLA</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                      <div className="text-xs font-bold text-slate-400">Solid Waste Management</div>
                      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">14.1 hrs</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">✓ 33.9 hrs ahead of SLA</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                      <div className="text-xs font-bold text-slate-400">Electrical & Lighting</div>
                      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">22.8 hrs</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">✓ 25.2 hrs ahead of SLA</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABS Reports View */}
            {currentTab === 'abs-reports' && (
              <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Automated Biometric & Sanitation (ABS) Reports
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Verified field muster rolls, geo-fenced sanitation truck check-ins, and automated compactor logs.
                </p>
                <div className="space-y-3">
                  {workers.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <img src={w.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{w.name}</div>
                          <div className="text-[11px] text-slate-500">{w.department}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-bold text-emerald-600">Geo-checkin: 07:45 AM (Verified)</div>
                        <div className="text-[10px] text-slate-400">Active assignments: {w.activeTasks}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call Recordings View */}
            {currentTab === 'call-recordings' && (
              <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Citizen Helpline (1912 / 1916 / 112) Audio Archives
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Encrypted inbound voice recordings and automated speech-to-text transcripts with sentiment index.
                </p>

                <div className="space-y-4">
                  {[
                    { caller: 'Devadatta Naik', category: 'Water Supply Leakage', duration: '1m 42s', time: 'Today 08:32 AM', transcript: 'Water gushing from main Cauvery line near Kadri gate. Please dispatch valve technician immediately.' },
                    { caller: 'Ananya Hegde', category: 'BESCOM Street Light', duration: '2m 10s', time: 'Yesterday 07:15 PM', transcript: 'Pole number 442 in Indiranagar dark for 3 days. Students passing through unlit cross road.' },
                    { caller: 'Balu', category: 'Bus Stand Maintenance', duration: '1m 05s', time: '28 Oct 04:20 PM', transcript: 'Jayanagar bus stand bench broken with sharp metal edges.' },
                  ].map((call, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                        <span>{call.caller} ({call.category})</span>
                        <span className="font-mono text-slate-400">{call.duration} · {call.time}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 italic">
                        "{call.transcript}"
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => alert(`Playing simulated encrypted audio track for ${call.caller}`)}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                        >
                          ▶ Play Audio Log
                        </button>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          ✓ Auto-converted to Ticket ID
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'volunteer' && (
              <VolunteerConnectView
                events={volunteerEvents}
                onRegister={handleVolunteerRegister}
                lang={lang}
              />
            )}

            {currentTab === 'rewards' && (
              <RewardsView
                leaderboard={leaderboard}
                userPoints={userPoints}
                lang={lang}
              />
            )}
          </main>

          {/* Footer Bar */}
          <footer className="border-t border-slate-200/80 bg-white/70 px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>
                © 2026 CivicConnect · Smart Community Complaint Management System · Ministry of Urban Affairs
              </span>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <button onClick={() => setIsEmergencyModalOpen(true)} className="text-red-600 hover:underline">
                  Helplines (112)
                </button>
                <span>·</span>
                <button onClick={() => setCurrentTab('volunteer')} className="hover:text-slate-900 dark:hover:text-white">
                  Volunteer
                </button>
                <span>·</span>
                <button onClick={() => setIsSettingsOpen(true)} className="hover:text-slate-900 dark:hover:text-white">
                  Privacy & Settings
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Civic Assistant Button */}
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 ring-4 ring-white dark:ring-slate-900"
        title="Open Civic Assistant"
      >
        <Bot className="h-7 w-7" />
      </button>

      {/* ------------------------------------------------------------- */}
      {/* ALL INTERACTIVE MODALS                                        */}
      {/* ------------------------------------------------------------- */}
      <ComplaintTrackerModal
        complaint={activeComplaint}
        onClose={() => setActiveComplaintId(null)}
        onVote={handleVote}
        onVerify={handleVerify}
        onRate={handleRate}
        onReopen={handleReopen}
        onAddComment={handleAddComment}
        lang={lang}
      />

      <ReportComplaintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateComplaint}
        existingComplaints={complaints}
        onVoteExisting={(id) => {
          handleVote(id);
          setActiveComplaintId(id);
          setIsReportModalOpen(false);
        }}
        lang={lang}
        onTrackCreatedComplaint={(id) => setActiveComplaintId(id)}
      />

      <CivicChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        lang={lang}
      />

      <EmergencyHelplineModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onLanguageChange={setLang}
      />

      {/* Authentication & Session Modals */}
      <AuthModal />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      <SessionManagerModal
        isOpen={isSessionManagerOpen}
        onClose={() => setIsSessionManagerOpen(false)}
      />

      {/* Floating Pull/Drag Project Folder Drawer */}
      <ProjectFolderDrawer
        isOpen={isFolderDrawerOpen}
        onToggle={() => setIsFolderDrawerOpen(!isFolderDrawerOpen)}
      />
    </div>
  );
}
