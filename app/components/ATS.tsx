import React from 'react';
import { 
    LuCircleCheck, 
    LuTriangleAlert, 
    LuCircleX, 
    LuTrendingUp, 
    LuTarget,
    LuLoaderCircle
} from 'react-icons/lu';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Theme configuration for the auditor look
  const getTheme = (score: number) => {
    if (score > 69) return {
      label: 'Optimal',
      colorClass: 'text-emerald-600',
      borderClass: 'border-emerald-100',
      bgClass: 'bg-emerald-50/50',
      iconBg: 'bg-emerald-100',
      icon: LuCircleCheck,
    };
    if (score > 49) return {
      label: 'Sub-optimal',
      colorClass: 'text-amber-600',
      borderClass: 'border-amber-100',
      bgClass: 'bg-amber-50/50',
      iconBg: 'bg-amber-100',
      icon: LuTriangleAlert,
    };
    return {
      label: 'Critical Action Required',
      colorClass: 'text-rose-600',
      borderClass: 'border-rose-100',
      bgClass: 'bg-rose-50/50',
      iconBg: 'bg-rose-100',
      icon: LuCircleX,
    };
  };

  const theme = getTheme(score);
  const StatusIcon = theme.icon;

  return (
    <div className="w-full space-y-8">
        {/* Top Section: Score Hero */}
        <div className={`relative overflow-hidden rounded-[2rem] border ${theme.borderClass} ${theme.bgClass} p-8 lg:p-10`}>
            {/* Background Decorative Icon */}
            <LuTarget className={`absolute -right-8 -bottom-8 w-64 h-64 ${theme.colorClass} opacity-[0.03] rotate-12`} />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.iconBg} ${theme.colorClass} text-xs font-bold uppercase tracking-widest`}>
                        <LuTrendingUp className="w-4 h-4" /> ATS Compatibility Report
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                        System Score: <span className={theme.colorClass}>{score}%</span>
                    </h2>
                    <p className="text-slate-600 font-medium max-w-md">
                        Our algorithm simulates 40+ common Applicant Tracking Systems to predict your document's readability.
                    </p>
                </div>

                <div className="shrink-0 group">
                    <div className={`w-32 h-32 rounded-3xl ${theme.iconBg} flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <StatusIcon className={`w-16 h-16 ${theme.colorClass}`} />
                    </div>
                </div>
            </div>
        </div>

        {/* Actionable Insights Section */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    System Feedback <span className="text-slate-400 font-normal text-sm">({suggestions.length} findings)</span>
                </h3>
                <div className="h-px flex-1 bg-slate-100 mx-6 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                    <div 
                        key={index} 
                        className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                            suggestion.type === "good" 
                            ? "bg-white border-slate-100 hover:border-emerald-200" 
                            : "bg-white border-slate-100 hover:border-amber-200 shadow-sm"
                        }`}
                    >
                        <div className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            suggestion.type === "good" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                            {suggestion.type === "good" ? <LuCircleCheck className="w-5 h-5" /> : <LuLoaderCircle className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                suggestion.type === "good" ? "text-emerald-600" : "text-amber-600"
                            }`}>
                                {suggestion.type === "good" ? "Strength" : "Optimization"}
                            </span>
                            <p className="text-sm font-semibold text-slate-700 leading-relaxed group-hover:text-slate-900">
                                {suggestion.tip}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer Audit Note */}
        <div className="bg-slate-900 rounded-2xl p-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-xs font-medium max-w-sm">
                This audit is based on keyword density, structural parsing, and standard A4/Letter formatting rules used by Workday, Greenhouse, and Lever.
            </p>
            <button className="text-white text-xs font-bold uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                View Full Audit Log
            </button>
        </div>
    </div>
  )
}

export default ATS;