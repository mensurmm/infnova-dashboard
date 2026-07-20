// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCards from '../components/StatCards';
import FilterBar from '../components/FilterBar';
import ApplicantTable from '../components/ApplicantTable';
import ProfileDrawer from '../components/ProfileDrawer';
import SettingsView from '../components/SettingsView';
import { useApplicants } from '../hooks/useApplicants';
import { Applicant, ApplicantSummary, ApplicantStatus } from '../types';

export default function Page() {
  const router = useRouter();

  // Navigation & Collapse state
  const [activeTab, setActiveTab] = useState<string>('applicants');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Separation of concerns: One state for viewing, one for modifying
  const [viewedApplicant, setViewedApplicant] = useState<Applicant | null>(null);
  const [statusModifyApplicant, setStatusModifyApplicant] = useState<ApplicantSummary | null>(null);

  const { applicants, stats, meta, loading, filters, setFilters, updateStatus } = useApplicants();

  // Route Protection Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('infnova_token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  // Handle actual status update submission
  const handleStatusUpdate = async (newStatus: ApplicantStatus) => {
    if (!statusModifyApplicant) return;
    await updateStatus(statusModifyApplicant.id, newStatus);
    setStatusModifyApplicant(null); // Close modal on success
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      {/* 1. Sidebar (Handles Desktop Sidebar & Mobile Topbar/Drawer) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* 2. Main Workspace Content */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col overflow-x-hidden relative">
        {/* Dynamic Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            {activeTab === 'applicants' ? 'Applicant Management' : 'System & Portal Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 font-medium leading-relaxed">
            {activeTab === 'applicants'
              ? 'Manage internship applicants, review progress, and update hiring status.'
              : 'Manage system preferences, export candidate data, and monitor system health.'}
          </p>
        </div>

        {/* Tab View Switcher */}
        {activeTab === 'applicants' ? (
          <div className="space-y-6 sm:space-y-8 w-full min-w-0">
            <FilterBar filters={filters} setFilters={setFilters} />
            
            <StatCards stats={stats} loading={loading} />


            <div className="w-full min-w-0 overflow-hidden">
              <ApplicantTable
                applicants={applicants}
                loading={loading}
                meta={meta}
                filters={filters}
                onFilterChange={setFilters}
                onViewProfile={(app) => setViewedApplicant(app as Applicant)}
                onModifyStatus={(app) => setStatusModifyApplicant(app)}
                selectedId={viewedApplicant?.id}
              />
            </div>
          </div>
        ) : (
          /* Render full Settings View */
          <div className="w-full min-w-0">
            <SettingsView applicants={applicants} />
          </div>
        )}
      </main>

      {/* 3. View Profile Drawer (Read Only) */}
      <ProfileDrawer
        applicant={viewedApplicant}
        isOpen={!!viewedApplicant}
        onClose={() => setViewedApplicant(null)}
      />

      {/* 4. Modify Status Modal (Action Only) */}
      {statusModifyApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-5 sm:p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setStatusModifyApplicant(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-5 sm:mb-6 mt-1 sm:mt-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800">Update Status</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                For <span className="font-bold text-slate-700">{statusModifyApplicant.fullName}</span>
              </p>
            </div>
            
            {/* Options matching exactly the Enum */}
            <div className="space-y-2.5">
              {(['pending', 'shortlisted', 'accepted', 'rejected'] as ApplicantStatus[]).map((status) => (
                <button 
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-sm sm:text-base font-bold capitalize transition-all flex items-center justify-between
                    ${statusModifyApplicant.status === status 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  {status}
                  {statusModifyApplicant.status === status && (
                    <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">Current</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}