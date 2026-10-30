import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  MapPin,
  Mic,
  MicOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  Send,
  Upload,
} from 'lucide-react';
import { ComplaintCategory, Priority, LanguageCode, Complaint } from '../types';
import { translations } from '../data/translations';

interface ReportComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<string | undefined>;
  existingComplaints: Complaint[];
  onVoteExisting: (id: string) => void;
  lang: LanguageCode;
  onTrackCreatedComplaint: (id: string) => void;
}

const CATEGORIES: { name: ComplaintCategory; icon: string }[] = [
  { name: 'Road Damage', icon: '🛣️' },
  { name: 'Garbage', icon: '🗑️' },
  { name: 'Streetlight', icon: '💡' },
  { name: 'Drainage/Sewage', icon: '🚰' },
  { name: 'Water Supply', icon: '💧' },
  { name: 'Electricity', icon: '⚡' },
  { name: 'Public Safety', icon: '🛡️' },
  { name: 'Amenities Petitions', icon: '🏛️' },
  { name: 'Borewell & Watersupply', icon: '🚿' },
  { name: 'Bus Stand Maintenance', icon: '🚌' },
  { name: 'Canel Cleaning', icon: '🌊' },
  { name: 'Other', icon: '📍' },
];

export const ReportComplaintModal: React.FC<ReportComplaintModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingComplaints,
  onVoteExisting,
  lang,
  onTrackCreatedComplaint,
}) => {
  if (!isOpen) return null;

  const t = translations[lang] || translations.en;

  // Form states
  const [name, setName] = useState('Anwith');
  const [phone, setPhone] = useState('+91 98450 11223');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory>('Road Damage');
  const [locationAddress, setLocationAddress] = useState('');
  const [ward, setWard] = useState('Ward 112 - Indiranagar');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  ]);
  const [isListening, setIsListening] = useState(false);
  const [aiSuggestedCat, setAiSuggestedCat] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdComplaintId, setCreatedComplaintId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Duplicate detection list
  const [nearbyDuplicates, setNearbyDuplicates] = useState<Complaint[]>([]);

  // Check for similar complaints nearby
  useEffect(() => {
    if (locationAddress.length > 3 || category) {
      const matches = existingComplaints.filter((c) => {
        const catMatch = c.category === category;
        const locMatch =
          locationAddress.length > 2 &&
          (c.location.address.toLowerCase().includes(locationAddress.toLowerCase()) ||
            locationAddress.toLowerCase().includes(c.location.address.toLowerCase().slice(0, 5)));
        return catMatch || locMatch;
      });
      setNearbyDuplicates(matches.slice(0, 2));
    } else {
      setNearbyDuplicates([]);
    }
  }, [category, locationAddress, existingComplaints]);

  // Voice to text simulation
  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setDescription(
          (prev) =>
            (prev ? prev + ' ' : '') +
            'Large crater in road near junction causing traffic slowdown and scooter hazard.'
        );
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  // Simulate GPS Geolocation
  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationAddress('80ft Road, 4th Block, Koramangala, Bengaluru');
          setWard('Ward 151 - Koramangala');
        },
        () => {
          setLocationAddress('12th Main Road, HAL 2nd Stage, Indiranagar');
          setWard('Ward 112 - Indiranagar');
        }
      );
    } else {
      setLocationAddress('12th Main Road, HAL 2nd Stage, Indiranagar');
    }
  };

  // Simulate AI Category Detection from photo upload
  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev.slice(0, 4), fakeUrl]);

      // Trigger AI Detection suggestion
      setAiSuggestedCat('Road Damage');
      setCategory('Road Damage');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() && !isAnonymous) errs.name = 'Please provide your name or toggle Anonymous.';
    if (!locationAddress.trim()) errs.location = 'Please provide the street address or GPS pin.';
    if (!description.trim() || description.length < 10)
      errs.description = 'Please write at least 10 characters describing the problem.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newId = await onSubmit({
        title: description.slice(0, 50) + (description.length > 50 ? '...' : ''),
        category,
        description,
        location: {
          address: locationAddress,
          ward,
          lat: 12.9352,
          lng: 77.6245,
        },
        priority,
        images,
        reporterName: isAnonymous ? 'Anonymous Citizen' : name,
        reporterPhone: isAnonymous ? undefined : phone,
        isAnonymous,
      });

      setCreatedComplaintId(newId || 'CC-2026-00123');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
              +
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.reportNewProblem}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Screen after submission */}
        {createdComplaintId ? (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Complaint Registered!
              </h3>
              <p className="text-xs text-slate-500">
                Your ticket has been dispatched to the municipal ward officer for triage.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Tracking Ticket Number
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {createdComplaintId}
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Estimated Resolution: <strong>Within 48–72 hours</strong> · +20 Civic Points Earned!
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onTrackCreatedComplaint(createdComplaintId);
                  onClose();
                }}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
              >
                Track My Complaint Now
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 1. Name and Anonymous switch */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Citizen Information
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t.anonymousReport}</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile Phone Number"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Category selection with icons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Problem Category *
                </label>
                {aiSuggestedCat && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    AI Detected: {aiSuggestedCat}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Location with GPS and Ward selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Location & Ward *
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <span>Use my current GPS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="E.g. 12th Main Road, HAL 2nd Stage, Indiranagar"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  {errors.location && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="Ward 112 - Indiranagar">Ward 112 - Indiranagar</option>
                    <option value="Ward 151 - Koramangala">Ward 151 - Koramangala</option>
                    <option value="Ward 45 - Malleshwaram">Ward 45 - Malleshwaram</option>
                    <option value="Ward 153 - Jayanagar">Ward 153 - Jayanagar</option>
                    <option value="Ward 24 - Kadri, Mangaluru">Ward 24 - Kadri, Mangaluru</option>
                    <option value="Ward 85 - Whitefield">Ward 85 - Whitefield</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* DUPLICATE WARNING CARD (Prevents duplicate complaints)      */}
            {/* ----------------------------------------------------------- */}
            {nearbyDuplicates.length > 0 && (
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 dark:border-amber-700 dark:bg-amber-950/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>{t.duplicateWarning}</span>
                </div>

                <div className="space-y-2">
                  {nearbyDuplicates.map((dup) => (
                    <div
                      key={dup.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-xs dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={dup.images[0]}
                          alt={dup.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {dup.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {dup.location.address} · {dup.votes} votes
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onVoteExisting(dup.id)}
                        className="shrink-0 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Support This</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Description with voice-to-text option */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Problem Description *
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isListening
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  <span>{isListening ? 'Listening...' : 'Voice Input (Kannada/Hindi/English)'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give details about the problem (e.g. depth of pothole, pole number, duration of blockage)..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Min 10 characters</span>
                <span>{description.length} chars</span>
              </div>
              {errors.description && (
                <p className="text-[11px] text-red-500">{errors.description}</p>
              )}
            </div>

            {/* 5. Photo Upload with AI Categorizer preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload Photos (Max 5 photos)
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative h-20 rounded-xl overflow-hidden bg-slate-100">
                    <img src={img} alt="Upload preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/40">
                    <Camera className="h-5 w-5 text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-500 mt-1">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulatePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 6. Priority Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Urgency / Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Low', 'Medium', 'High', 'Emergency'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isSelected
                          ? p === 'Emergency'
                            ? 'bg-red-600 text-white shadow-md'
                            : p === 'High'
                            ? 'bg-rose-500 text-white shadow-md'
                            : p === 'Medium'
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {p} Priority
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Big Green Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Registering Ticket...' : t.submitReport}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
