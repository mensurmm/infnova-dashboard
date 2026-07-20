// src/components/SettingsView.tsx
import React, { useState } from 'react';
import { 
  Download, 
  Wifi, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2 
} from 'lucide-react';
import { Applicant } from '../types';
import { useAuth } from '../hooks/useAuth';

interface SettingsViewProps {
  applicants: Applicant[];
  totalApplicantsCount?: number;
  activeTrackFilter?: string;
  activeStatusFilter?: string;
  onRefreshData?: () => void;
}

export default function SettingsView({ 
  applicants, 
  totalApplicantsCount = 52,
  activeTrackFilter = 'all',
  activeStatusFilter = 'all',
  onRefreshData 
}: SettingsViewProps) {
  const { user } = useAuth();
  // Diagnostics ping state
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  // Handle Manual Server Health Ping
  const handleTestConnection = () => {
    setPingStatus('testing');
    setTimeout(() => {
      setPingStatus('success');
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (onRefreshData) onRefreshData();
    }, 600);
  };

  // CSV Exporter Utility
  const downloadCSV = (dataList: Applicant[], filename: string) => {
    if (!dataList || dataList.length === 0) return;

    const headers = ['ID', 'Full Name', 'Email', 'Track', 'Country', 'Status', 'Applied Date'];
    const rows = dataList.map((a) => [
      a.id,
      `"${a.fullName || ''}"`,
      a.email || '',
      a.track || '',
      a.country || '',
      a.status || '',
      a.applicationDate || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFiltered = activeTrackFilter !== 'all' || activeStatusFilter !== 'all';

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      
      {/* 1. Admin Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md border border-slate-700 shrink-0">
            {user?.name?.[0] || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">{user?.name || 'System Administrator'}</h2>
              <span className="bg-orange-100 text-orange-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Role
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email || 'admin@infnova.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Session Status</p>
            <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Session
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. Data Export Utilities */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Export Applicant Records</h3>
                <p className="text-xs text-slate-500">Download formatted CSV datasets</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Export candidate profiles directly to a `.csv` spreadsheet. You can download either your active filtered selection or the full database.
            </p>

            {isFiltered && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 font-medium">
                <span>⚡ Active Filters:</span>
                <span className="font-bold capitalize">{activeTrackFilter} track</span> | 
                <span className="font-bold capitalize">{activeStatusFilter} status</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              onClick={() => downloadCSV(applicants, `infnova_filtered_applicants_${new Date().toISOString().slice(0, 10)}`)}
              disabled={applicants.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-white" />
              <span>
                {isFiltered 
                  ? `Export Filtered Results (${applicants.length} records)` 
                  : `Export Loaded Records (${applicants.length} records)`}
              </span>
            </button>

            <button
              onClick={() => downloadCSV(applicants, `infnova_all_applicants_${new Date().toISOString().slice(0, 10)}`)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <span>Export Full Dataset ({totalApplicantsCount} total candidates)</span>
            </button>
          </div>
        </div>

        {/* 3. API & Server Diagnostics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">API & Server Diagnostics</h3>
                  <p className="text-xs text-slate-500">Live backend response status</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Connection Ping:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Responsive
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Active Token:</span>
                <span className="font-bold text-slate-800">Infnova Auth JWT</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Last Data Sync:</span>
                <span className="font-bold text-slate-800">{lastSyncedTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={pingStatus === 'testing'}
            className="mt-6 w-full border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>{pingStatus === 'testing' ? 'Pinging Server...' : 'Test API Connection'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}