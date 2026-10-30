import React, { useState } from 'react';
import {
  Clock,
  RefreshCw,
  Puzzle,
  Smile,
  ChevronDown,
  MoreVertical,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Complaint, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface DashboardViewProps {
  complaints: Complaint[];
  onSelectComplaint: (id: string) => void;
  onOpenReportModal: () => void;
  lang: LanguageCode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  complaints,
  onSelectComplaint,
  onOpenReportModal,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [activeDateRange, setActiveDateRange] = useState('Feb 01 - Feb 14');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(9); // Default highlight Feb 10 like screenshot

  // Chart coordinate data matching the screenshot
  const chartDays = [
    { day: 'Feb 01', pending: 150, inProgress: 120 },
    { day: 'Feb 02', pending: 240, inProgress: 185 },
    { day: 'Feb 03', pending: 220, inProgress: 170 },
    { day: 'Feb 04', pending: 260, inProgress: 190 },
    { day: 'Feb 05', pending: 380, inProgress: 340 },
    { day: 'Feb 06', pending: 350, inProgress: 310 },
    { day: 'Feb 07', pending: 390, inProgress: 325 },
    { day: 'Feb 08', pending: 330, inProgress: 260 },
    { day: 'Feb 09', pending: 330, inProgress: 260 },
    { day: 'Feb 10', pending: 220, inProgress: 175 },
    { day: 'Feb 11', pending: 290, inProgress: 240 },
    { day: 'Feb 12', pending: 390, inProgress: 300 },
    { day: 'Feb 13', pending: 440, inProgress: 360 },
  ];

  // Map values to 0-500 SVG coordinates
  // SVG viewBox: 0 0 1000 320
  // Left margin: 60, Right margin: 960, Top: 30, Bottom: 260
  const chartWidth = 900;
  const chartHeight = 230;
  const xOffset = 60;
  const yOffset = 30;

  const pointsPending = chartDays.map((d, i) => {
    const x = xOffset + (i / (chartDays.length - 1)) * chartWidth;
    const y = yOffset + chartHeight - (d.pending / 500) * chartHeight;
    return { x, y, val: d.pending, day: d.day };
  });

  const pointsInProgress = chartDays.map((d, i) => {
    const x = xOffset + (i / (chartDays.length - 1)) * chartWidth;
    const y = yOffset + chartHeight - (d.inProgress / 500) * chartHeight;
    return { x, y, val: d.inProgress, day: d.day };
  });

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const pendingPath = createSmoothPath(pointsPending);
  const inProgressPath = createSmoothPath(pointsInProgress);

  // Recent complaints table entries from screenshot
  const screenshotTableRows = [
    {
      id: 'CC-2026-00109',
      date: '01 Feb, 2026, 08:21 AM',
      name: 'B. Rajkumar',
      category: 'Amenities Petitions',
      status: 'Open',
      statusType: 'open',
    },
    {
      id: 'CC-2026-00105',
      date: '02 Feb, 2026, 12:01 PM',
      name: 'Dev',
      category: 'Borewell & Watersupply',
      status: 'Closed',
      statusType: 'closed',
    },
    {
      id: 'CC-2026-00106',
      date: '04 Feb, 2026, 06:45 PM',
      name: 'Balu',
      category: 'Bus Stand Maintenance',
      status: 'In Progress',
      statusType: 'inProgress',
    },
    {
      id: 'CC-2026-00107',
      date: '05 Feb, 2026, 10:52 AM',
      name: 'Stepen',
      category: 'Canel Cleaning',
      status: 'Open',
      statusType: 'open',
    },
  ];

  // Radial progress calculations for Service Level 76.5%
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (76.5 / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP KPI METRIC CARDS ROW                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Pending */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-xs transition-all hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-base font-bold text-slate-800 dark:text-white">
                {t.pending}
              </div>
              <div className="text-xs text-slate-400">{t.last7Days}</div>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              9
            </span>
            <span className="inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
              +70%
            </span>
          </div>
          {/* Bottom green accent line */}
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#10b981]" />
        </div>

        {/* Card 2: In Progress */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-xs transition-all hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/60">
                <RefreshCw className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-base font-bold text-slate-800 dark:text-white">
                {t.inProgress}
              </div>
              <div className="text-xs text-slate-400">{t.last7Days}</div>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              2
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
              +20%
            </span>
          </div>
          {/* Bottom light blue accent line */}
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#38bdf8]" />
        </div>

        {/* Card 3: Solved */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-xs transition-all hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-500">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/60">
                <Puzzle className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-base font-bold text-slate-800 dark:text-white">
                {t.solved}
              </div>
              <div className="text-xs text-slate-400">{t.last7Days}</div>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              1
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
              +1%
            </span>
          </div>
          {/* Bottom yellow/amber accent line */}
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#fbbf24]" />
        </div>

        {/* Card 4: Service Level Radial Ring */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.serviceLevel}
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-[#10b981] transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                76.5%
              </span>
            </div>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            {t.target} 75%
          </div>
        </div>

        {/* Card 5: Feedback Rating */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Smile className="h-7 w-7" />
          </div>

          <div className="mt-3 text-center">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.feedbackRating}
            </div>
            <div className="text-[11px] text-slate-400">{t.allTime}</div>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
              4.6
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              of 5
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MIDDLE CHART SECTION: TOTAL COMPLAINTS                     */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.totalComplaints}
          </h2>

          <div className="flex items-center gap-4">
            {/* Legend matching screenshot */}
            <div className="hidden sm:flex items-center gap-6 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#0284c7]" />
                <span className="text-slate-700 dark:text-slate-300">{t.pending}</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">231</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#38bdf8]" />
                <span className="text-slate-700 dark:text-slate-300">{t.inProgress}</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">43</span>
              </div>
            </div>

            {/* Date filter dropdown */}
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span>{activeDateRange}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* High-Fidelity SVG Dual-Line Chart */}
        <div className="relative w-full overflow-x-auto pt-2">
          <svg
            viewBox="0 0 1000 320"
            className="w-full min-w-[650px] overflow-visible text-slate-300 dark:text-slate-700"
          >
            {/* Grid horizontal lines */}
            {[0, 100, 200, 300, 400, 500].map((val) => {
              const y = yOffset + chartHeight - (val / 500) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1="60"
                    y1={y}
                    x2="960"
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="2 3"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                  <text
                    x="45"
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[11px] font-mono tabular-nums"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {chartDays.map((d, i) => {
              const x = xOffset + (i / (chartDays.length - 1)) * chartWidth;
              return (
                <text
                  key={d.day}
                  x={x}
                  y={yOffset + chartHeight + 25}
                  textAnchor="middle"
                  className="fill-slate-400 text-[11px] font-medium"
                >
                  {d.day}
                </text>
              );
            })}

            {/* In Progress Curve (Light Cyan) */}
            <path
              d={inProgressPath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Pending Curve (Dark Blue) */}
            <path
              d={pendingPath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Highlighted active point (Feb 10 in screenshot) */}
            {pointsPending.map((pt, i) => {
              const isHovered = hoveredPointIndex === i;
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                >
                  {/* Invisible broad hitbox */}
                  <rect
                    x={pt.x - 20}
                    y={yOffset}
                    width="40"
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Vertical guideline on hover */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={yOffset}
                      x2={pt.x}
                      y2={yOffset + chartHeight}
                      stroke="#0284c7"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                  )}

                  {/* Points on lines */}
                  {isHovered && (
                    <>
                      {/* In Progress Dot */}
                      <circle
                        cx={pointsInProgress[i].x}
                        cy={pointsInProgress[i].y}
                        r="6"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {/* Pending Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="7"
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="filter drop-shadow-md"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. BOTTOM SECTION: RECENT COMPLAINTS & CATEGORIES             */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Recent Complaints Table (7 cols on lg) */}
        <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800 lg:col-span-7">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.recentComplaints}
            </h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="pb-3 pl-1 font-semibold">{t.date}</th>
                  <th className="pb-3 font-semibold">{t.name}</th>
                  <th className="pb-3 font-semibold">{t.category}</th>
                  <th className="pb-3 text-right pr-1 font-semibold">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {screenshotTableRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onSelectComplaint(row.id)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3.5 pl-1 font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                      {row.date}
                    </td>
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">
                      {row.name}
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">
                      {row.category}
                    </td>
                    <td className="py-3.5 text-right pr-1">
                      {row.statusType === 'open' && (
                        <span className="inline-flex items-center rounded-full border border-sky-400 bg-sky-50 px-3 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          Open
                        </span>
                      )}
                      {row.statusType === 'closed' && (
                        <span className="inline-flex items-center rounded-full bg-emerald-600 px-3.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                          Closed
                        </span>
                      )}
                      {row.statusType === 'inProgress' && (
                        <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50/50 px-3 py-0.5 text-[11px] font-semibold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                          In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Complaints in Category (5 cols on lg) */}
        <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.complaintsInCategory}
              </h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 pt-2">
              {/* Category 1: Amenities Petitions 82% */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <span>Amenities Petitions</span>
                  <span className="text-slate-400 font-mono tabular-nums">82%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#2563eb] transition-all duration-700"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>

              {/* Category 2: Borewell & Watersupply 32% */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <span>Borewell & Watersupply</span>
                  <span className="text-slate-400 font-mono tabular-nums">32%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#ea580c] transition-all duration-700"
                    style={{ width: '32%' }}
                  />
                </div>
              </div>

              {/* Category 3: Bus Stand Maintenance 32% */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <span>Bus Stand Maintenance</span>
                  <span className="text-slate-400 font-mono tabular-nums">32%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#10b981] transition-all duration-700"
                    style={{ width: '32%' }}
                  />
                </div>
              </div>

              {/* Category 4: Canel Cleaning 32% */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <span>Canel Cleaning</span>
                  <span className="text-slate-400 font-mono tabular-nums">32%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#06b6d4] transition-all duration-700"
                    style={{ width: '32%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Top category holds 82% of public amenities requests
            </span>
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <span>{t.reportNewProblem}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
