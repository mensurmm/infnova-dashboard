// src/components/ApplicantTable.tsx
import { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Eye, UserCheck, Calendar } from 'lucide-react';
import { ApplicantSummary, FilterState } from '../types';

interface ApplicantTableProps {
  applicants: ApplicantSummary[];
  loading: boolean;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  filters: FilterState;
  onFilterChange: (updated: FilterState) => void;
  onViewProfile: (applicant: ApplicantSummary) => void; 
  onModifyStatus: (applicant: ApplicantSummary) => void; 
  selectedId?: string;
}

export default function ApplicantTable({ 
  applicants, 
  loading, 
  meta, 
  filters, 
  onFilterChange, 
  onViewProfile, 
  onModifyStatus,
  selectedId 
}: ApplicantTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]';
      case 'accepted': return 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]';
      case 'rejected': return 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]';
      case 'pending': default: return 'bg-[#FFEFE2] text-[#E66200] border-[#FFE0C2]';
    }
  };

  const startItem = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const endItem = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Applicant Profile</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Track</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : applicants.map((app) => (
              <tr key={app.id} className={`hover:bg-slate-50/50 transition-colors ${selectedId === app.id ? 'bg-orange-50/20' : ''}`}>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">{app.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight">{app.fullName}</h4>
                    <span className="text-xs text-slate-400 block mt-0.5">{app.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-500">{app.country}</td>
                <td className="px-6 py-4 capitalize text-xs font-bold text-slate-500">{app.track}</td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize select-none border ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-all inline-block"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Actions Popup Menu Content */}
                  {activeMenuId === app.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                      <div className="absolute right-6 top-10 bg-white border border-slate-200 rounded-xl shadow-xl p-1 w-40 text-left z-20 space-y-0.5">
                        <button 
                          onClick={() => { onViewProfile(app); setActiveMenuId(null); }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" /> View Profile
                        </button>
                        <button 
                          onClick={() => { onModifyStatus(app); setActiveMenuId(null); }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-orange-500" /> Modify Status
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* DYNAMIC PAGINATION LAYOUT */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
        
        {(() => {
          const limit = filters.limit || 10;
          const page = filters.page || 1;
          const total = meta?.total !== undefined ? meta.total : applicants.length;
          const startItem = total === 0 ? 0 : ((page - 1) * limit) + 1;
          const endItem = Math.min(page * limit, total);

          return (
            <>
              <p className="text-xs font-semibold text-slate-400">
                Showing <span className="text-slate-700 font-bold">{startItem}-{endItem}</span> of{' '}
                <span className="text-slate-700 font-bold">{total}</span> applicants
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => onFilterChange({ ...filters, page: page - 1 })}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl flex items-center gap-1 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                {/* Current Page */}
                <button className="w-8 h-8 text-xs font-bold rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/10">
                  {page}
                </button>
                
                {/* Last Page Shortcut */}
                {meta?.totalPages && page < meta.totalPages && (
                  <>
                    <span className="text-slate-300 text-xs px-1 font-bold">...</span>
                    <button 
                      onClick={() => onFilterChange({ ...filters, page: meta.totalPages })}
                      className="w-8 h-8 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      {meta.totalPages}
                    </button>
                  </>
                )}

                <button
                  disabled={!meta?.totalPages || page >= meta.totalPages}
                  onClick={() => onFilterChange({ ...filters, page: page + 1 })}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl flex items-center gap-1 text-orange-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}