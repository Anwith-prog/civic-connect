import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ThumbsUp,
  UserCheck,
  CheckCircle,
  MoreHorizontal,
  ExternalLink,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { Complaint, WorkerInfo, LanguageCode, Role } from '../types';
import { translations } from '../data/translations';
import { getPriorityBadge, getStatusBadgeStyle } from '../utils/helpers';

interface ComplaintsListViewProps {
  complaints: Complaint[];
  workers: WorkerInfo[];
  onSelectComplaint: (id: string) => void;
  onUpdateStatus: (id: string, stage: any, workerId?: string) => void;
  onVote: (id: string) => void;
  onMergeDuplicates: (masterId: string, duplicateId: string) => void;
  currentRole: Role;
  lang: LanguageCode;
}

export const ComplaintsListView: React.FC<ComplaintsListViewProps> = ({
  complaints,
  workers,
  onSelectComplaint,
  onUpdateStatus,
  onVote,
  onMergeDuplicates,
  currentRole,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedWorkerForAssign, setSelectedWorkerForAssign] = useState<Record<string, string>>({});
  const [mergeMasterId, setMergeMasterId] = useState<string>('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [duplicateIdToMerge, setDuplicateIdToMerge] = useState<string>('');

  const filtered = complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.location.address.toLowerCase().includes(q);
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    return matchesSearch && matchesCat && matchesStatus && matchesPriority;
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Location', 'Votes', 'Date'];
    const rows = filtered.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      `"${c.location.address.replace(/"/g, '""')}"`,
      c.votes,
      c.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicConnect_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergeMasterId || !duplicateIdToMerge || mergeMasterId === duplicateIdToMerge) return;
    onMergeDuplicates(mergeMasterId, duplicateIdToMerge);
    setShowMergeModal(false);
    setDuplicateIdToMerge('');
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-1 items-center gap-3 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, keyword, street..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          {/* Quick Filters */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Cannot be solved">Cannot be solved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <option value="All">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Export & Merge button */}
        <div className="flex items-center gap-2">
          {currentRole === 'worker' && (
            <button
              onClick={() => setShowMergeModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Merge Duplicates</span>
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Complaints Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3.5 pl-6 font-semibold">Complaint ID & Photo</th>
                <th className="py-3.5 font-semibold">Title & Category</th>
                <th className="py-3.5 font-semibold">Location / Ward</th>
                <th className="py-3.5 font-semibold">Priority</th>
                <th className="py-3.5 font-semibold">Status</th>
                <th className="py-3.5 font-semibold">Assigned Specialist</th>
                <th className="py-3.5 text-center font-semibold">Upvotes</th>
                <th className="py-3.5 pr-6 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => {
                const badgeStyle = getStatusBadgeStyle(item.status);
                return (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    {/* ID and thumbnail */}
                    <td className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {item.id}
                          </div>
                          <div className="text-[10px] text-slate-400">{item.createdAt}</div>
                        </div>
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="py-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        {item.category}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {item.location.ward}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {item.location.address}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeStyle.pill}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Assigned Worker / Dropdown for Field Staff */}
                    <td className="py-3.5">
                      {currentRole === 'worker' && item.status !== 'Resolved' && item.status !== 'Cannot be solved' ? (
                        <select
                          value={item.assignedWorker?.id || ''}
                          onChange={(e) => {
                            const newWorkerId = e.target.value;
                            if (newWorkerId) {
                              onUpdateStatus(item.id, 'Assigned', newWorkerId);
                            }
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        >
                          <option value="">-- Assign Specialist --</option>
                          {workers.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name} ({w.department.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                      ) : item.assignedWorker ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={item.assignedWorker.avatar}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {item.assignedWorker.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Votes */}
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => onVote(item.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                          item.userVoted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                        title="I also face this issue"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span className="tabular-nums">{item.votes}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-6 text-right">
                      <button
                        onClick={() => onSelectComplaint(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Duplicate Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Merge Duplicate Complaints
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Combine multiple complaints about the same street problem into one master ticket. Upvotes and supporters will be aggregated.
            </p>

            <form onSubmit={handleMergeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Master Complaint (Keeps active status & updates)
                </label>
                <select
                  value={mergeMasterId}
                  onChange={(e) => setMergeMasterId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required
                >
                  <option value="">-- Select Master Complaint --</option>
                  {complaints.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.title.slice(0, 40)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Duplicate Complaint to Merge
                </label>
                <select
                  value={duplicateIdToMerge}
                  onChange={(e) => setDuplicateIdToMerge(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required
                >
                  <option value="">-- Select Duplicate --</option>
                  {complaints
                    .filter((c) => c.id !== mergeMasterId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.title.slice(0, 40)}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMergeModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Merge into Master Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
