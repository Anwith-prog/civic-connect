import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  UserCheck,
  Wrench,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  Share2,
  Star,
  RotateCcw,
  Send,
  Phone,
  Building2,
  Calendar,
  MapPin,
  QrCode,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Complaint, ComplaintStage, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { getPriorityBadge, getStatusBadgeStyle } from '../utils/helpers';

interface ComplaintTrackerModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onVote: (id: string) => void;
  onVerify: (id: string, vote: 'yes' | 'no') => void;
  onRate: (id: string, rating: number, feedback: string) => void;
  onReopen: (id: string, reason: string) => void;
  onAddComment: (id: string, text: string) => void;
  lang: LanguageCode;
}

export const ComplaintTrackerModal: React.FC<ComplaintTrackerModalProps> = ({
  complaint,
  onClose,
  onVote,
  onVerify,
  onRate,
  onReopen,
  onAddComment,
  lang,
}) => {
  if (!complaint) return null;

  const t = translations[lang] || translations.en;
  const [activePhotoTab, setActivePhotoTab] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [starRating, setStarRating] = useState<number>(complaint.rating || 5);
  const [feedbackText, setFeedbackText] = useState(complaint.feedback || '');
  const [hasRated, setHasRated] = useState(Boolean(complaint.rating));
  const [isReopening, setIsReopening] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // 5 standard progression stages
  const STAGES: { stage: ComplaintStage; label: string; desc: string; icon: any }[] = [
    { stage: 'Submitted', label: t.stageSubmitted, desc: t.stageSubmittedDesc, icon: Clock },
    { stage: 'Under Review', label: t.stageUnderReview, desc: t.stageUnderReviewDesc, icon: CheckCircle2 },
    { stage: 'Assigned', label: t.stageAssigned, desc: t.stageAssignedDesc, icon: UserCheck },
    { stage: 'In Progress', label: t.stageInProgress, desc: t.stageInProgressDesc, icon: Wrench },
    { stage: 'Resolved', label: t.stageResolved, desc: t.stageResolvedDesc, icon: CheckCircle },
  ];

  const stageIndexMap: Record<ComplaintStage, number> = {
    'Submitted': 0,
    'Under Review': 1,
    'Assigned': 2,
    'In Progress': 3,
    'Resolved': 4,
    'Cannot be solved': -1,
  };

  const currentStageIndex = stageIndexMap[complaint.status];
  const progressPercent =
    complaint.status === 'Cannot be solved'
      ? 100
      : Math.min(100, Math.max(20, (currentStageIndex + 1) * 20));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRate(complaint.id, starRating, feedbackText);
    setHasRated(true);
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    onReopen(complaint.id, reopenReason);
    setIsReopening(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(complaint.id, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-mono font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {complaint.id}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadge(complaint.priority)}`}>
              {complaint.priority} Priority
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {complaint.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Show QR Code"
            >
              <QrCode className="h-4 w-4" />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8">
          {/* QR Modal Card if toggled */}
          {showQr && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl bg-white p-2 shadow-xs flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${i % 3 === 0 ? 'bg-white' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Scan to Track Ticket On Mobile
                  </h4>
                  <p className="text-xs text-slate-500">
                    Share with neighbors to track repair progress or support with photos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQr(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
          )}

          {/* Title & Location Banner */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
              {complaint.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                {complaint.location.address}
              </span>
              <span>·</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {complaint.location.ward}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {complaint.createdAt}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* COMMUNITY UPVOTE ACTION BAR                                */}
          {/* ----------------------------------------------------------- */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <ThumbsUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {complaint.votes} citizens face this issue
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300">
                  Higher community votes trigger fast-track municipal dispatch
                </div>
              </div>
            </div>

            <button
              onClick={() => onVote(complaint.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-95 ${
                complaint.userVoted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-300 dark:bg-slate-800 dark:text-emerald-300'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${complaint.userVoted ? 'fill-white' : ''}`} />
              <span>{complaint.userVoted ? 'Supported by You' : t.communitySupport}</span>
            </button>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* CANNOT BE SOLVED STATE CARD (If marked)                     */}
          {/* ----------------------------------------------------------- */}
          {complaint.status === 'Cannot be solved' && (
            <div className="rounded-2xl border-2 border-red-300 bg-red-50/70 p-6 dark:border-red-900/60 dark:bg-red-950/30">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-md">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-red-900 dark:text-red-200">
                    Complaint Status: Cannot be resolved by current Municipal Cell
                  </h3>
                  <div className="rounded-xl bg-white p-4 text-xs font-medium text-slate-700 shadow-xs border border-red-200 dark:bg-slate-900 dark:border-red-950 dark:text-slate-300">
                    <span className="font-bold text-red-600">Official Municipal Reason: </span>
                    {complaint.cannotSolveReason || 'Jurisdiction constraint or major capital project requirement.'}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                      What you can do next:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {complaint.nextSteps?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setIsReopening(true)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700"
                    >
                      Request Formal Re-review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 5-STAGE PROGRESSION TRACKER (Desktop Horizontal / Mobile)   */}
          {/* ----------------------------------------------------------- */}
          {complaint.status !== 'Cannot be solved' && (
            <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between pb-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Live Resolution Stepper
                  </h3>
                  <p className="text-xs text-slate-500">
                    Stage {currentStageIndex + 1} of 5 · Expected Completion: {complaint.estimatedResolutionDate || 'In 48h'}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {progressPercent}% Complete
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="relative mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Stepper Grid (Horizontal on lg, vertical on sm) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                {STAGES.map((s, idx) => {
                  const Icon = s.icon;
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isFuture = idx > currentStageIndex;

                  return (
                    <div
                      key={s.stage}
                      className={`relative flex flex-col rounded-xl p-3 transition-all ${
                        isCurrent
                          ? 'bg-white shadow-md ring-2 ring-emerald-500 dark:bg-slate-800'
                          : isCompleted
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                        </div>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {isFuture ? `Expected by ${complaint.estimatedResolutionDate || 'soon'}` : s.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Assigned Worker Card if Assigned/In Progress/Resolved */}
              {complaint.assignedWorker && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-xs dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={complaint.assignedWorker.avatar}
                      alt={complaint.assignedWorker.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t.assignedTo}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {complaint.assignedWorker.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Building2 className="h-3 w-3" />
                        <span>{complaint.assignedWorker.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${complaint.assignedWorker.phone}`}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{complaint.assignedWorker.phone}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* BEFORE AND AFTER PHOTOS SHOWCASE                            */}
          {/* ----------------------------------------------------------- */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.beforeAndAfter}
                </h3>
                <p className="text-xs text-slate-500">
                  Civic verification photos captured with GPS & timestamp
                </p>
              </div>

              {complaint.afterImage && (
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    onClick={() => setActivePhotoTab('side-by-side')}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                      activePhotoTab === 'side-by-side' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    onClick={() => setActivePhotoTab('slider')}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                      activePhotoTab === 'slider' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Slider
                  </button>
                </div>
              )}
            </div>

            {/* Display Comparison */}
            <div className="pt-4">
              {complaint.afterImage && activePhotoTab === 'slider' ? (
                /* Interactive Split Slider */
                <div className="relative h-72 w-full overflow-hidden rounded-2xl select-none">
                  <img
                    src={complaint.afterImage}
                    alt="After repair"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={complaint.beforeImage || complaint.images[0]}
                      alt="Before repair"
                      className="absolute inset-0 h-full w-full object-cover max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-white uppercase">
                      Before
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 rounded-md bg-emerald-600 px-2 py-1 text-xs font-bold text-white uppercase">
                    After
                  </span>
                  {/* Slider drag control */}
                  <div
                    className="absolute inset-y-0 w-1 bg-white shadow-xl cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg text-slate-700 text-xs font-bold">
                      ↔
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize h-full w-full"
                  />
                </div>
              ) : (
                /* Side-by-side or Single View */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={complaint.beforeImage || complaint.images[0]}
                      alt="Problem reported"
                      className="h-56 w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 rounded-md bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      BEFORE ISSUE
                    </div>
                  </div>

                  {complaint.afterImage ? (
                    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={complaint.afterImage}
                        alt="Problem fixed"
                        className="h-56 w-full object-cover"
                      />
                      <div className="absolute top-3 left-3 rounded-md bg-emerald-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                        AFTER WORK COMPLETED
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/40">
                      <Wrench className="h-8 w-8 text-slate-400 mb-2" />
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Work in progress
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 max-w-xs">
                        Field staff will upload the geocoded completion photograph upon finishing repair.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Community Verification Voting for Solved Work */}
              {complaint.status === 'Resolved' && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        {t.verifiedByCommunity}:
                      </span>
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {complaint.communityVerifiedVotes.yes} Yes · {complaint.communityVerifiedVotes.no} No
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Did the field staff truly resolve this problem in your neighborhood?
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVerify(complaint.id, 'yes')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold shadow-xs transition-colors ${
                        complaint.communityVerifiedVotes.userVote === 'yes'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 dark:bg-slate-700 dark:text-emerald-300'
                      }`}
                    >
                      👍 Yes, Fixed!
                    </button>
                    <button
                      onClick={() => onVerify(complaint.id, 'no')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold shadow-xs transition-colors ${
                        complaint.communityVerifiedVotes.userVote === 'no'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 dark:bg-slate-700 dark:text-rose-300'
                      }`}
                    >
                      👎 Still not fixed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* RESOLUTION RATING & REOPEN OPTION (If Resolved)             */}
          {/* ----------------------------------------------------------- */}
          {complaint.status === 'Resolved' && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 dark:border-emerald-800/40 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.rateResolution}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your feedback impacts the worker and department performance index
                  </p>
                </div>

                <button
                  onClick={() => setIsReopening(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t.reopenComplaint}</span>
                </button>
              </div>

              {isReopening ? (
                <form onSubmit={handleReopenSubmit} className="space-y-3 pt-2">
                  <textarea
                    rows={2}
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder="Describe why the resolution is incomplete (e.g. road still has bumps, garbage pile returned)..."
                    className="w-full rounded-xl border border-rose-300 bg-white p-3 text-xs text-slate-800 focus:outline-rose-500 dark:bg-slate-800 dark:text-white"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReopening(false)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      Submit Reopen Petition
                    </button>
                  </div>
                </form>
              ) : hasRated ? (
                <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-emerald-200 dark:bg-slate-800">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < starRating ? 'fill-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    "{feedbackText || 'Thank you for prompt municipal action!'}"
                  </span>
                </div>
              ) : (
                <form onSubmit={handleRatingSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStarRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${s <= starRating ? 'fill-amber-400' : 'text-slate-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                      {starRating} out of 5 Stars
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share a short note about the repair quality..."
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-emerald-500 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Submit Rating
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* COMMUNITY COMMENTS & TIMELINE FEED                         */}
          {/* ----------------------------------------------------------- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official Activity Audit Trail
            </h3>

            <div className="space-y-3">
              {complaint.timeline.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.stage}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {item.note}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400">
                      By: {item.updatedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Supporter Comments */}
            {complaint.comments.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Citizen Observations ({complaint.comments.length})
                </h4>
                {complaint.comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl bg-white p-3 text-xs border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{c.userName}</span>
                      <span className="text-[10px] font-normal text-slate-400">{c.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add an update or confirm condition at the location..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-blue-500 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
