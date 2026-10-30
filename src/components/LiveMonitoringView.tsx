import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  AlertTriangle,
  Flame,
  Waves,
  TreePine,
  Droplets,
  Layers,
  List,
  FlameKindling,
  ExternalLink,
  ThumbsUp,
  Filter,
} from 'lucide-react';
import { Complaint, EmergencyAlert, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { getCategoryColor, getStatusBadgeStyle } from '../utils/helpers';

interface LiveMonitoringViewProps {
  complaints: Complaint[];
  emergencyAlerts: EmergencyAlert[];
  onSelectComplaint: (id: string) => void;
  lang: LanguageCode;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  complaints,
  emergencyAlerts,
  onSelectComplaint,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'hotspots'>('map');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const catMatch = selectedCategory === 'All' || c.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || c.status === selectedStatus;
    const wardMatch = selectedWard === 'All' || c.location.ward.includes(selectedWard);
    return catMatch && statusMatch && wardMatch;
  });

  // Calculate ward hotspots
  const wardCountMap: Record<string, number> = {};
  complaints.forEach((c) => {
    wardCountMap[c.location.ward] = (wardCountMap[c.location.ward] || 0) + 1;
  });
  const hotspots = Object.entries(wardCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([ward, count]) => ({ ward, count }));

  // Initialize Leaflet map
  useEffect(() => {
    if (activeTab !== 'map' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = (await import('leaflet')).default;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        // Center between Bengaluru and Mangaluru
        const map = L.map(mapContainerRef.current!).setView([12.9716, 77.5946], 12);
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Add markers for filtered complaints with Problem Picture in Popup
        filteredComplaints.forEach((item) => {
          const color = getCategoryColor(item.category);
          const customHtml = `
            <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <span style="font-size: 11px; font-weight: bold; color: white;">${item.votes}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: customHtml,
            className: 'custom-civic-pin',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([item.location.lat, item.location.lng], { icon: customIcon }).addTo(map);

          // Popup with photo and details
          const popupContent = document.createElement('div');
          popupContent.className = 'civic-popup';
          popupContent.innerHTML = `
            <div style="width: 200px; font-family: inherit;">
              <img src="${item.images[0]}" alt="${item.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <div style="font-size: 10px; font-weight: bold; color: ${color}; text-transform: uppercase;">${item.category}</div>
              <div style="font-size: 12px; font-weight: bold; margin: 2px 0; color: #1e293b; line-height: 1.2;">${item.title}</div>
              <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">${item.location.address}</div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 9999px; font-weight: 600;">${item.status}</span>
                <span style="font-size: 10px; font-weight: bold; color: #059669;">👍 ${item.votes}</span>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('click', () => {
            setActiveComplaint(item);
          });
        });
      } catch (e) {
        console.error('Leaflet load error', e);
      }
    }

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [activeTab, filteredComplaints]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. EMERGENCY ALERTS HIGH-PRIORITY BANNER                      */}
      {/* ------------------------------------------------------------- */}
      {emergencyAlerts.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-4 shadow-sm dark:bg-red-950/40 dark:border-red-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-300">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
            <span>Active Smart City Emergency Broadcasts ({emergencyAlerts.length})</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {emergencyAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col justify-between rounded-xl bg-white p-3.5 shadow-xs dark:bg-slate-900 border border-red-200 dark:border-red-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {alert.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    {alert.actionRequired}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">{alert.location}</span>
                  <span className="font-mono font-bold text-red-600">{alert.helpline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MAP CONTROLS & FILTER BAR                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-white shadow-xs text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Interactive GIS Map</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-white shadow-xs text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Problem Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('hotspots')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'hotspots'
                  ? 'bg-white shadow-xs text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <FlameKindling className="h-3.5 w-3.5 text-orange-500" />
              <span>Complaint Hotspots</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Garbage">Garbage</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Drainage/Sewage">Drainage/Sewage</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electricity">Electricity</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {filteredComplaints.length} tickets pinned
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN MAP OR GALLERY DISPLAY                                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Leaflet Map Area (8 cols) */}
          <div className="relative h-[540px] overflow-hidden rounded-2xl bg-slate-100 shadow-xs border border-slate-200 dark:border-slate-800 lg:col-span-8">
            <div ref={mapContainerRef} className="h-full w-full" />
            <div className="absolute top-3 left-3 z-20 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-xs dark:bg-slate-900/95 dark:text-white">
              🗺️ Live Ward Grid View · Click pin to inspect
            </div>
          </div>

          {/* Active Complaint Inspector Card (4 cols) */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800 lg:col-span-4">
            {activeComplaint ? (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={activeComplaint.images[0]}
                    alt={activeComplaint.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    {activeComplaint.category}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                    👍 {activeComplaint.votes} votes
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{activeComplaint.id}</span>
                    <span>{activeComplaint.createdAt}</span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {activeComplaint.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span>{activeComplaint.location.address}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {activeComplaint.description}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                    <span>Current Stage:</span>
                    <span className="text-blue-600 dark:text-blue-400">{activeComplaint.status}</span>
                  </div>
                  {activeComplaint.assignedWorker && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      Assigned to: {activeComplaint.assignedWorker.name} ({activeComplaint.assignedWorker.department})
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">
                Select a marker on the map to inspect complaint
              </div>
            )}

            {activeComplaint && (
              <button
                onClick={() => onSelectComplaint(activeComplaint.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]"
              >
                <span>{t.viewDetails} & Track Stepper</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Gallery View (Shows problem picture on EVERY complaint card) */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item.id)}
              className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            >
              <div>
                {/* Mandatory problem image on every card as requested in Section 11 */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    {item.category}
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-slate-900 shadow-sm">
                    👍 {item.votes}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{item.id}</span>
                    <span className="font-semibold text-blue-600">{item.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.location.address}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 dark:border-slate-800">
                <span>{item.location.ward.split('-')[0]}</span>
                <span className="font-bold text-blue-600 group-hover:underline">Track →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hotspots View */}
      {activeTab === 'hotspots' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Top Complaint Areas (Hotspot Clusters)
            </h3>
            <div className="space-y-4">
              {hotspots.map((h, i) => (
                <div
                  key={h.ward}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800 text-xs dark:bg-blue-950 dark:text-blue-300">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {h.ward}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Suggested Action: Deploy specialized rapid road & sanitation patrol
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {h.count} issues
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Municipal Ward Health Index
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Real-time rating calculated from resolution rate and open citizen grievances.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Ward 112 - Indiranagar</span>
                    <span className="text-emerald-600 font-mono">88 / 100 (Optimal)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Ward 151 - Koramangala</span>
                    <span className="text-amber-500 font-mono">72 / 100 (Moderate Silt)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Ward 24 - Kadri, Mangaluru</span>
                    <span className="text-blue-500 font-mono">79 / 100 (Active Patrols)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '79%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-blue-50 p-4 text-xs font-medium text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              💡 <strong>Open Data Initiative:</strong> All GIS complaint coordinates are available for civic researchers and resident welfare associations to analyze urban infrastructure trends.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
