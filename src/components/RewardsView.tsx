import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Trophy,
  Medal,
  CheckCircle2,
  Download,
  Share2,
  Shield,
  Star,
  Users,
  X,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeaderboardUser, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface RewardsViewProps {
  leaderboard: LeaderboardUser[];
  userPoints: number;
  lang: LanguageCode;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  leaderboard,
  userPoints,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'monthly'>('all');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleOpenCertificate = () => {
    setShowCertificateModal(true);
    triggerConfetti();
  };

  const badges = [
    {
      title: 'First Report',
      description: 'Submitted first verified civic problem',
      icon: '🌱',
      unlocked: true,
      points: '+20 pts',
    },
    {
      title: 'Street Hero',
      description: 'Reached 100+ points supporting neighborhood issues',
      icon: '🛡️',
      unlocked: userPoints >= 100,
      points: '+50 pts',
    },
    {
      title: 'Green Guardian',
      description: 'Participated in certified environmental cleanups',
      icon: '🌿',
      unlocked: userPoints >= 200,
      points: '+75 pts',
    },
    {
      title: 'Community Champion',
      description: 'Top 5 citizen contributor of the month',
      icon: '🏆',
      unlocked: userPoints >= 300,
      points: '+150 pts',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. My Impact Summary Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              My Civic Points
            </span>
            <Trophy className="h-6 w-6 text-amber-200" />
          </div>
          <div className="mt-4 text-4xl font-black tabular-nums tracking-tight">
            {userPoints}
          </div>
          <div className="mt-1 text-xs text-amber-100">
            Ranked #4 in Indiranagar Ward
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Complaints Reported
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            11
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">
            9 verified and repaired
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Issues Supported
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            41
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Avoided 34 duplicate filings
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.citizenOfTheMonth}
            </div>
            <div className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              Nominated for October 2026
            </div>
          </div>
          <button
            onClick={handleOpenCertificate}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
          >
            <Award className="h-4 w-4" />
            <span>View Certificate</span>
          </button>
        </div>
      </div>

      {/* 2. Badges Showcase */}
      <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Civic Honor Badges
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Unlocked automatically when community members report and verify civic actions.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <div
              key={b.title}
              className={`flex flex-col items-center justify-between rounded-2xl p-5 text-center transition-all ${
                b.unlocked
                  ? 'bg-emerald-50/60 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
                  : 'bg-slate-50 border border-slate-200/60 opacity-50 dark:bg-slate-800/40 dark:border-slate-700'
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-slate-800">
                {b.icon}
              </div>

              <div className="my-3">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {b.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b.description}
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                  b.unlocked
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {b.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Community Leaderboard */}
      <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Civic Impact Leaderboard
            </h3>
            <p className="text-xs text-slate-500">
              Recognizing citizens making Bangalore and Mangalore cleaner & safer
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-md px-3 py-1 ${activeTab === 'all' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
            >
              Overall
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`rounded-md px-3 py-1 ${activeTab === 'monthly' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
            >
              This Month
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-2">
          {leaderboard.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    user.rank === 1
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold ring-2 ring-amber-400'
                      : user.rank === 2
                      ? 'bg-slate-200 text-slate-700'
                      : user.rank === 3
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-slate-400'
                  }`}
                >
                  #{user.rank}
                </span>

                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                />

                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{user.name}</span>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {user.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{user.area}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.solvedCount} Solved · {user.supportedCount} Supported
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
                    {user.points} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Digital Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900 border-4 border-amber-300/80">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate Artwork */}
            <div className="rounded-2xl border-2 border-dashed border-amber-400/80 p-8 text-center space-y-4 bg-amber-50/20 dark:bg-slate-800/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
                <Trophy className="h-8 w-8" />
              </div>

              <div className="text-xs font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">
                Official Municipal Commendation
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-wide">
                Certificate of Civic Excellence
              </h2>

              <p className="text-xs text-slate-500 italic max-w-md mx-auto">
                This digital citation is awarded to
              </p>

              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 underline decoration-amber-400 underline-offset-8">
                Anwith
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                In recognition of outstanding dedication as <strong>Citizen of the Month (October 2026)</strong>.
                Through prompt reporting, community upvoting, and active volunteer hours, your leadership
                has made your neighborhood safer and cleaner.
              </p>

              <div className="pt-6 flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Municipal Commissioner</div>
                  <div>Urban Infrastructure & Citizen Engagement</div>
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Smart City Mission</div>
                  <div>BBMP / MCC Government Portal</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  alert('Certificate saved to your device!');
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" />
                <span>Download High-Res PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
