import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { Applicant, DashboardStats, FilterState, ApplicantStatus } from '../types';

const initialFilters: FilterState = {
  search: '',
  role: '', 
  status: undefined,
  experienceLevel: '',
  sortBy: 'applicationDate',
  sortOrder: 'desc',
  page: 1,
  limit: 10, // Added limit here to prevent NaN issues
};

export function useApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, interviews: 0, hired: 0 });
  
  // FIXED: Removed the hardcoded 1248 and 125 totalPages
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>(initialFilters); 
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const fetchApplicants = useCallback(async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('infnova_token')) return;

    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { 
        page: filters.page,
        limit: filters.limit || 10,
      };

      const listResponse = await api.get('/applicants', { params });
      const cleanData = listResponse.data.data || listResponse.data.applicants || listResponse.data;
      const fetchedApplicants = Array.isArray(cleanData) ? cleanData : [];
      setApplicants(fetchedApplicants);
      
      const statsResponse = await api.get('/dashboard/summary');
      const sData = statsResponse.data;
      
      setStats({
        total: sData.totalApplicants || 0,
        pending: sData.byStatus?.pending || 0,
        interviews: sData.byStatus?.['interview scheduled'] || 0, 
        hired: sData.byStatus?.accepted || 0,
      });

      // FIXED: Dynamically update meta using actual API data
      const actualTotal = listResponse.data.meta?.total || listResponse.data.total || sData.totalApplicants || fetchedApplicants.length;
      
      setMeta({
        total: actualTotal,
        page: filters.page,
        limit: filters.limit || 10,
        totalPages: Math.ceil(actualTotal / (filters.limit || 10)) || 1,
      });

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load records.');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit]); // Added filters.limit as a dependency

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (id: string, newStatus: ApplicantStatus) => {
    try {
      await api.patch(`/applicants/${id}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      if (selectedApplicant?.id === id) {
        setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  const filteredApplicants = useMemo(() => {
    let result = [...applicants];

   if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (app) => 
          app.fullName.toLowerCase().includes(query) || 
          app.email.toLowerCase().includes(query) ||
          app.id.toLowerCase().includes(query) // <-- Added this line for ID search
      );
    }

    if (filters.role) {
      result = result.filter((app) => app.track === filters.role);
    }

    if (filters.status) {
      result = result.filter((app) => app.status === filters.status);
    }

    // if (filters.experienceLevel) {
    //   result = result.filter((app) => app.experienceLevel === filters.experienceLevel);
    // }

    result.sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === 'fullName') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (filters.sortBy === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else {
        comparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [applicants, filters]);

  return {
    applicants: filteredApplicants,
    stats,
    meta,
    loading,
    error,
    filters,
    setFilters,
    selectedApplicant,
    setSelectedApplicant,
    updateStatus,
    refetch: fetchApplicants,
  };
}