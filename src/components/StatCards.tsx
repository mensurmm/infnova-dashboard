// src/components/StatCards.tsx
import { Users, Clock, Calendar, CheckCircle } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatCardsProps {
  stats: DashboardStats;
  loading: boolean;
}

export default function StatCards({ stats, loading }: StatCardsProps) {
  // Define each metric card with its specific colors from your mockup image
  const cardData = [
    { title: 'Total Applicants', value: stats.total, icon: Users, accent: 'border-l-orange-500 text-orange-500 bg-orange-50/50' },
    { title: 'Pending Review', value: stats.pending, icon: Clock, accent: 'border-l-amber-500 text-amber-500 bg-amber-50/50' },
    { title: 'Interviews Scheduled', value: stats.interviews, icon: Calendar, accent: 'border-l-blue-500 text-blue-500 bg-blue-50/50' },
    { title: 'Hired', value: stats.hired, icon: CheckCircle, accent: 'border-l-emerald-500 text-emerald-500 bg-emerald-50/50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      {cardData.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`bg-white border border-slate-200 border-l-4 ${card.accent.split(' ')[0]} rounded-xl p-5 shadow-sm flex items-center justify-between transition-all`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              
              {/* Handles the required dynamic UI Loading state seamlessly */}
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
                  {(card.value ?? 0).toLocaleString()}
                </h3>
              )}
            </div>

            {/* Right Side Icon Container matching mockup */}
            <div className={`p-3 rounded-xl ${card.accent.split(' ').slice(-1)[0]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}