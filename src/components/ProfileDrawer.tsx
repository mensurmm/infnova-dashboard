import { X, Mail, Phone, MapPin, Globe, Calendar, Briefcase, FileText } from 'lucide-react';
import { Applicant } from '../../types';

interface ProfileDrawerProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ applicant, isOpen, onClose }: ProfileDrawerProps) {
  if (!isOpen || !applicant) return null;

  // Dynamic status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-100 text-green-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  // Format dates cleanly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Sliding Drawer Panel matching the clean white aesthetic */}
      <div className="relative w-full max-w-[480px] bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Applicant Profile</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Profile Identity Section */}
          <div className="px-6 py-8 border-b border-slate-100 flex items-start gap-5">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.fullName)}&background=F3F4F6&color=374151&size=128`} 
              alt={applicant.fullName}
              className="w-20 h-20 rounded-full object-cover border border-slate-200"
            />
            <div className="space-y-1.5 mt-1">
              <h1 className="text-2xl font-bold text-slate-900 leading-none">{applicant.fullName}</h1>
              <p className="text-slate-500 font-medium capitalize">{applicant.track} Intern</p>
              <div className="pt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(applicant.status)}`}>
                  {applicant.status}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="px-6 py-6 border-b border-slate-100">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Contact Information</h3>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${applicant.email}`} className="text-sm hover:text-blue-600 hover:underline">{applicant.email}</a>
              </div>
              
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{applicant.phoneNumber || 'Not provided'}</span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{applicant.country}</span>
              </div>

              {applicant.linkedInUrl && (
                <div className="flex items-center gap-3 text-slate-600">
                  {/* Embedded LinkedIn SVG to bypass Lucide version errors */}
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <a href={applicant.linkedInUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                    {applicant.linkedInUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}

              {applicant.githubUrl && (
                <div className="flex items-center gap-3 text-slate-600">
                  {/* Embedded GitHub SVG to bypass Lucide version errors */}
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <a href={applicant.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                    {applicant.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}

              {applicant.portfolioUrl && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={applicant.portfolioUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                    {applicant.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="px-6 py-6 border-b border-slate-100">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Professional Details</h3>
            
            <div className="mb-4">
              <span className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                <Briefcase className="w-4 h-4" /> Experience Level
              </span>
              <p className="text-sm font-semibold text-slate-800 capitalize pl-6">{applicant.experienceLevel}</p>
            </div>

            <div>
              <span className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                <FileText className="w-4 h-4" /> Core Skills
              </span>
              <div className="flex flex-wrap gap-2 pl-6">
                {applicant.skills?.length > 0 ? applicant.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                    {skill}
                  </span>
                )) : (
                  <span className="text-sm text-slate-400 italic">No skills listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Application Info */}
          <div className="px-6 py-6 bg-slate-50 min-h-full">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Application Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Applied on {formatDate(applicant.applicationDate)}</span>
              </div>

              {applicant.motivation && (
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Motivation</h4>
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{applicant.motivation}"</p>
                </div>
              )}

              {applicant.notes && (
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Internal Notes</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{applicant.notes}</p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 pt-4 font-mono text-center">
                Applicant ID: {applicant.id} <br/>
                Last Updated: {formatDate(applicant.updatedAt)}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}