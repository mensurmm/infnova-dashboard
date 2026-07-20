// src/types/index.ts

export type ApplicantStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';

export interface ApplicantSummary {
  id: string;
  fullName: string;
  email: string;
  country: string;
  track: string;
  status: ApplicantStatus;
  applicationDate: string;
}

export interface Applicant extends ApplicantSummary {
  phoneNumber: string;
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  motivation: string | null;
  notes: string | null;
  updatedAt: string;
}

export interface FilterState {
  page: number;
  limit: number;
  status?: ApplicantStatus;
  track?: string;
}