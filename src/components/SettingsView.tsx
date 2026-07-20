// src/components/SettingsView.tsx
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Loader2, 
  UserCheck 
} from 'lucide-react';
import { Applicant } from '../../types';
import { api } from '../services/api';

interface SettingsViewProps {
  applicants: Applicant[];
  totalApplicantsCount?: number;
  activeTrackFilter?: string;
  activeStatusFilter?: string;
}

interface AdminProfile {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function SettingsView({ 
  applicants, 
  totalApplicantsCount = 52,
  activeTrackFilter = 'all',
  activeStatusFilter = 'all'
}: SettingsViewProps) {
  
  // 1. Dynamic Admin Profile State
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // 2. Export Full Dataset Loading State
  const [exportingFull, setExportingFull] = useState<boolean>(false);

  // Fetch real authenticated admin profile from /auth/me
 // Fetch real authenticated admin profile from /auth/me
  useEffect(() => {
    let isMounted = true;
    api.get('/auth/me')
      .then((res: any) => {
        if (isMounted) {
          setAdminUser(res.data);
          setLoadingUser(false);
        }
      })
      .catch((err: any) => {
        console.error('Failed to fetch authenticated admin profile:', err);
        if (isMounted) setLoadingUser(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Handler: Fetch all 52 candidates directly from API for Full Dataset Export
 // Handler: Fetch ALL candidates across all API pages for Full Dataset Export
  const handleExportFullDataset = async () => {
    try {
      setExportingFull(true);
      let allRecords: Applicant[] = [];
      let currentPage = 1;
      let hasMore = true;

      // Loop through API pages until no more candidates are returned
      while (hasMore) {
        const response: any = await api.get('/applicants', {
          params: { page: currentPage, limit: 50 },
        });

        const pageItems: Applicant[] =
          response.data.data || response.data.applicants || response.data || [];

        if (Array.isArray(pageItems) && pageItems.length > 0) {
          allRecords = [...allRecords, ...pageItems];

          // If the page returned less than 50 items, we've reached the end of the database!
          if (pageItems.length < 50) {
            hasMore = false;
          } else {
            currentPage++;
          }
        } else {
          hasMore = false;
        }
      }

      // Export the combined list containing all 52 candidates
      downloadCSV(allRecords, `infnova_all_applicants_${new Date().toISOString().slice(0, 10)}`);
    } catch (error: any) {
      console.error('Failed to export full dataset:', error);
      // Fallback: download currently loaded applicants if full fetch fails
      downloadCSV(applicants, `infnova_all_applicants_${new Date().toISOString().slice(0, 10)}`);
    } finally {
      setExportingFull(false);
    }
  };

  const isFiltered = activeTrackFilter !== 'all' || activeStatusFilter !== 'all';
  const displayName = adminUser?.fullName || adminUser?.name || 'System Administrator';
  const displayEmail = adminUser?.email || 'admin@infnova.tech';
  const displayRole = adminUser?.role || 'Admin Role';

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      
      {/* 1. Dynamic Admin Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md border border-slate-700 shrink-0">
            {loadingUser ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              displayName[0]?.toUpperCase() || 'A'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                {loadingUser ? 'Loading Profile...' : displayName}
              </h2>
              <span className="bg-orange-100 text-orange-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {displayRole}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{displayEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Session Status</p>
            <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1.5 mt-0.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              Active Session
            </p>
          </div>
        </div>
      </div>

      {/* 2. Data Export Utilities */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
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
          Export candidate profiles directly to a `.csv` spreadsheet. You can download either your active filtered selection or the complete database from the server.
        </p>

        {isFiltered && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 font-medium">
            <span>⚡ Active Filters:</span>
            <span className="font-bold capitalize">{activeTrackFilter} track</span> | 
            <span className="font-bold capitalize">{activeStatusFilter} status</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button A: Export Loaded / Filtered Records */}
          <button
            onClick={() => downloadCSV(applicants, `infnova_filtered_applicants_${new Date().toISOString().slice(0, 10)}`)}
            disabled={applicants.length === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-white" />
            <span>
              {isFiltered 
                ? `Export Filtered (${applicants.length} records)` 
                : `Export Loaded Records (${applicants.length} records)`}
            </span>
          </button>

          {/* Button B: Export Full Dataset (Fetches all 52 records directly from backend) */}
          <button
            onClick={handleExportFullDataset}
            disabled={exportingFull}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {exportingFull ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>Fetching Full Dataset...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-orange-400" />
                <span>Export Full Dataset ({totalApplicantsCount} candidates)</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}