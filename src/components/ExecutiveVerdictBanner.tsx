import React from 'react';
import {
  Trophy,
  Award,
  ShieldCheck,
  Bookmark,
  Share2,
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ExecutiveVerdictBannerProps {
  decision: any;
  onOpenWhatIf: () => void;
  onOpenExport: () => void;
  onToggleBookmark: () => void;
  isBookmarking: boolean;
}

export const ExecutiveVerdictBanner: React.FC<ExecutiveVerdictBannerProps> = ({
  decision,
  onOpenWhatIf,
  onOpenExport,
  onToggleBookmark,
  isBookmarking
}) => {
  const report = decision.ai_report || {};
  const winner = report.recommendedOptionName || decision.recommended_option_name || 'Option A';
  const runnerUp = report.runnerUpOptionName || 'None identified';
  const confidence = decision.confidence_score ?? report.confidenceScore ?? 85;

  const getDomainLabel = (domain: string) => {
    const map: Record<string, string> = {
      TECH_ARCH: 'Technology & Cloud Architecture',
      PRODUCT_GTM: 'Product & Go-To-Market',
      FINANCE_INVEST: 'Capital Allocation & Investment',
      OPERATIONS_SUPPLY: 'Supply Chain & Operations',
      TALENT_ORG: 'Talent & Workforce',
      POLICY_ESG: 'Public Policy & ESG'
    };
    return map[domain] || domain;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 border border-indigo-700/60 text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{getDomainLabel(decision.domain)}</span>
            </span>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(decision.urgency)}`}>
              {decision.urgency} URGENCY
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Risk: {decision.risk_appetite}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              disabled={isBookmarking}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium ${
                decision.is_bookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Bookmark Decision"
            >
              <Bookmark className={`w-4 h-4 ${decision.is_bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{decision.is_bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={onOpenExport}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Executive Memo</span>
            </button>

            <button
              onClick={onOpenWhatIf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>What-If Copilot</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <span className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase">
            AI DECISION VERDICT & SYNTHESIS
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {decision.title}
          </h1>
        </div>

        {/* Recommended Verdict Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Winner Showcase */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/80 border border-indigo-500/40 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Recommended Primary Choice
                  </span>
                </div>
                {runnerUp && runnerUp !== 'None identified' && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Runner-Up: <strong className="text-slate-300">{runnerUp}</strong></span>
                  </div>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-2">
                {winner}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {report.executiveSummary || decision.problem_statement}
              </p>
            </div>

            {report.confidenceRationale && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{report.confidenceRationale}</span>
              </div>
            )}
          </div>

          {/* Confidence Score Dial / Meter */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - confidence / 100)}
                  strokeLinecap="round"
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{confidence}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confidence</span>
              </div>
            </div>

            <span className="text-xs font-semibold text-indigo-300">
              Calibrated Analytical Certainty
            </span>
            <span className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Derived from constraint margins, sensitivity testing, and risk exposure.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveVerdictBanner;
