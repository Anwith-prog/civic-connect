import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Award,
  Sparkles,
  TreePine,
  Trash2,
  ShieldCheck,
  X,
  HeartHandshake,
} from 'lucide-react';
import { VolunteerEvent, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface VolunteerConnectViewProps {
  events: VolunteerEvent[];
  onRegister: (eventId: string, details: any) => Promise<void>;
  lang: LanguageCode;
}

export const VolunteerConnectView: React.FC<VolunteerConnectViewProps> = ({
  events,
  onRegister,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [volunteerName, setVolunteerName] = useState('Anwith');
  const [volunteerPhone, setVolunteerPhone] = useState('+91 98450 11223');
  const [skills, setSkills] = useState('First Aid, Tree Planting, Neighborhood Coordination');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsSubmitting(true);
    await onRegister(selectedEvent.id, { volunteerName, volunteerPhone, skills });
    setIsSubmitting(false);
    setJoinedSuccess(true);
    setTimeout(() => {
      setJoinedSuccess(false);
      setSelectedEvent(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 to-teal-700 p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <HeartHandshake className="h-4 w-4" />
            <span>Civic Volunteer Brigade</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Build a Cleaner, Greener City Together
          </h2>
          <p className="text-xs text-emerald-100 sm:text-sm leading-relaxed">
            Join community lake restorations, tree plantation drives, and drain desilting missions.
            Earn civic volunteer credits, digital badges, and official certificates of appreciation.
          </p>
        </div>

        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Users className="h-80 w-80 text-white" />
        </div>
      </div>

      {/* Upcoming Events Grid */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Community Drives ({events.length})
          </h3>
          <span className="text-xs text-slate-500">
            Certified by BBMP & City Environmental Cell
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const isUserRegistered = ev.registeredUsers.includes('USR-CURRENT') || ev.registeredUsers.includes('USR-1');
            const percentFilled = Math.min(100, Math.round((ev.registeredCount / ev.neededVolunteers) * 100));

            return (
              <div
                key={ev.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-xs transition-all hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-[11px] font-bold text-white uppercase backdrop-blur-xs">
                      {ev.category}
                    </div>
                    <div className="absolute top-3 right-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-slate-900 shadow-sm">
                      +{ev.pointsReward} Points
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {ev.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold">{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{ev.time} ({ev.hoursCredit} hrs credit)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {ev.description}
                    </p>

                    {/* Progress of registrations */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <span>
                          {ev.registeredCount} / {ev.neededVolunteers} Volunteers
                        </span>
                        <span className="text-emerald-600 font-mono">{percentFilled}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    disabled={isUserRegistered}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold shadow-xs transition-all ${
                      isUserRegistered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isUserRegistered ? '✓ You Are Confirmed' : 'Join as Volunteer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Volunteer Registration
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {joinedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Registration Confirmed!
                </h4>
                <p className="text-xs text-slate-500">
                  See you at {selectedEvent.location}. Notification reminder sent to your profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-4">
                <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Event: {selectedEvent.title} · +{selectedEvent.pointsReward} Civic Points
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number for WhatsApp Updates
                  </label>
                  <input
                    type="tel"
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Relevant Skills or Gear
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
