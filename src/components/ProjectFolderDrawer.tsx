import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  Download,
  Copy,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Terminal,
} from 'lucide-react';

interface ProjectFolderDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: FileNode[];
}

export const ProjectFolderDrawer: React.FC<ProjectFolderDrawerProps> = ({
  isOpen,
  onToggle,
}) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('server.ts');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/components': true,
    'src/data': true,
    'src/types': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const fileTree: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            { name: 'Sidebar.tsx', type: 'file', path: 'src/components/Sidebar.tsx' },
            { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx' },
            { name: 'DashboardView.tsx', type: 'file', path: 'src/components/DashboardView.tsx' },
            { name: 'ComplaintTrackerModal.tsx', type: 'file', path: 'src/components/ComplaintTrackerModal.tsx' },
            { name: 'ReportComplaintModal.tsx', type: 'file', path: 'src/components/ReportComplaintModal.tsx' },
            { name: 'LiveMonitoringView.tsx', type: 'file', path: 'src/components/LiveMonitoringView.tsx' },
            { name: 'ComplaintsListView.tsx', type: 'file', path: 'src/components/ComplaintsListView.tsx' },
            { name: 'VolunteerConnectView.tsx', type: 'file', path: 'src/components/VolunteerConnectView.tsx' },
            { name: 'RewardsView.tsx', type: 'file', path: 'src/components/RewardsView.tsx' },
            { name: 'CivicChatbotModal.tsx', type: 'file', path: 'src/components/CivicChatbotModal.tsx' },
            { name: 'EmergencyHelplineModal.tsx', type: 'file', path: 'src/components/EmergencyHelplineModal.tsx' },
            { name: 'SettingsModal.tsx', type: 'file', path: 'src/components/SettingsModal.tsx' },
          ],
        },
        {
          name: 'data',
          type: 'folder',
          path: 'src/data',
          children: [
            { name: 'seedData.ts', type: 'file', path: 'src/data/seedData.ts' },
            { name: 'translations.ts', type: 'file', path: 'src/data/translations.ts' },
          ],
        },
        {
          name: 'types',
          type: 'folder',
          path: 'src/types',
          children: [{ name: 'index.ts', type: 'file', path: 'src/types/index.ts' }],
        },
        { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
        { name: 'main.tsx', type: 'file', path: 'src/main.tsx' },
        { name: 'index.css', type: 'file', path: 'src/index.css' },
      ],
    },
    { name: 'server.ts', type: 'file', path: 'server.ts' },
    { name: 'index.html', type: 'file', path: 'index.html' },
    { name: 'package.json', type: 'file', path: 'package.json' },
    { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json' },
    { name: 'vite.config.ts', type: 'file', path: 'vite.config.ts' },
    { name: 'metadata.json', type: 'file', path: 'metadata.json' },
    { name: '.env.example', type: 'file', path: '.env.example' },
  ];

  const handleCopyPath = (path: string) => {
    navigator.clipboard?.writeText(path);
    setCopiedFile(path);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const renderTree = (nodes: FileNode[]) => {
    return (
      <ul className="space-y-1 pl-2 text-xs font-mono">
        {nodes.map((node) => {
          if (node.type === 'folder') {
            const isExpanded = expandedFolders[node.path];
            return (
              <li key={node.path}>
                <button
                  onClick={() => toggleFolder(node.path)}
                  className="flex w-full items-center gap-1.5 rounded-lg py-1 px-1.5 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Folder className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="font-semibold text-slate-900 dark:text-white font-sans">
                    {node.name}/
                  </span>
                </button>
                {isExpanded && node.children && (
                  <div className="border-l border-slate-200 dark:border-slate-800 ml-3 pl-1">
                    {renderTree(node.children)}
                  </div>
                )}
              </li>
            );
          }

          const isSelected = selectedFilePath === node.path;
          return (
            <li key={node.path}>
              <button
                onClick={() => setSelectedFilePath(node.path)}
                className={`flex w-full items-center justify-between rounded-lg py-1 px-2 transition-all ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{node.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">
                  {node.name.split('.').pop()}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* 1. Pull/Drag Tab on Right Edge */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 -right-1 z-40 -translate-y-1/2 flex items-center gap-2 rounded-l-2xl bg-[#0b51c5] px-3.5 py-4 text-white shadow-2xl transition-all duration-300 hover:px-5 hover:bg-blue-700 active:scale-95 ${
          isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
        title="Pull open project folder"
      >
        <FolderOpen className="h-5 w-5 text-amber-300 animate-bounce" />
        <span className="[writing-mode:vertical-rl] font-bold text-xs tracking-wider uppercase">
          📂 PULL PROJECT FOLDER
        </span>
      </button>

      {/* 2. Backdrop when open */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* 3. Sliding Folder Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <FolderOpen className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CivicConnect Project Folder
              </h3>
              <p className="text-xs text-slate-500">
                Full-Stack Source Package (React + Express + Tailwind)
              </p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Download Card */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-linear-to-b from-blue-50/60 to-transparent dark:from-blue-950/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                📦 Complete Project Package (.ZIP)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Ready to drag into VS Code, Cursor, or your local workspace.
              </div>
            </div>

            <a
              href="/api/download-zip"
              download="civicconnect-project.zip"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Download ZIP Package</span>
            </a>
          </div>

          {/* Quick Terminal Guide */}
          <div className="mt-4 rounded-xl bg-slate-900 p-3 text-slate-200 font-mono text-[11px] space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
              <Terminal className="h-3 w-3 text-emerald-400" />
              <span>How to drag & run locally:</span>
            </div>
            <p className="text-slate-300">1. Extract <code className="text-amber-400">civicconnect-project.zip</code></p>
            <p className="text-slate-300">2. Drag unzipped folder into VS Code</p>
            <p className="text-slate-300">3. Run: <code className="text-emerald-400">npm install && npm run dev</code></p>
          </div>
        </div>

        {/* Directory Explorer */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <span>Project File Tree</span>
            <span className="text-[10px] font-normal text-slate-400 lowercase">
              click file to select
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            {renderTree(fileTree)}
          </div>

          {/* Selected File Details */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 flex items-center justify-between">
            <div className="truncate">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Selected File Path</div>
              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                /{selectedFilePath}
              </div>
            </div>

            <button
              onClick={() => handleCopyPath(selectedFilePath)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200"
            >
              {copiedFile === selectedFilePath ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Path</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            All Express routes & Vite settings included.
          </span>
          <a
            href="/civicconnect-project.zip"
            download="civicconnect-project.zip"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Direct Download</span>
            <Download className="h-3 w-3" />
          </a>
        </div>
      </div>
    </>
  );
};
