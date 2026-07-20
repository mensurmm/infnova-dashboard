// src/components/FilterBar.tsx
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="w-full space-y-3 mb-8">
      {/* 1. Sleek Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          // Updated placeholder to reflect ID search
          placeholder="Search applicants by name, email, or ID..."
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* 2. Unified Controls Bar (Filters & Sorting Combined) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Left Side: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter By</span>
          </div>

          {/* Track Filter */}
          <div className="relative min-w-[130px] w-full sm:w-auto">
            <select
              // FIXED: Changed filters.track to filters.role
              value={filters.role || ''}
              onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 transition-colors cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="">All Tracks</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="ui-ux">UI/UX</option>
              <option value="data-analytics">Data-Analytics</option>
              <option value="mobile">Mobile-Developer</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[130px] w-full sm:w-auto">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 transition-colors cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Experience Level Filter */}
          {/* <div className="relative min-w-[130px] w-full sm:w-auto">
            <select
              // FIXED: Changed filters.experience to filters.experienceLevel
              value={filters.experienceLevel || ''}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value, page: 1 })}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 transition-colors cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="">All Experience</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div> */}
        </div>

        {/* Subtle separator on desktop layout */}
        

        {/* Right Side: Sorting Suite */}
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort By</span>
          </div>

          {/* Sort Field */}
          <div className="relative min-w-[145px] w-full sm:w-auto">
            <select
              value={filters.sortBy || 'applicationDate'}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 transition-colors cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
              <option value="applicationDate">Application Date</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Order */}
          <div className="relative min-w-[100px] w-full sm:w-auto">
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 transition-colors cursor-pointer outline-none focus:border-orange-500"
            >
              <option value="desc">Desc (↓)</option>
              <option value="asc">Asc (↑)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
}