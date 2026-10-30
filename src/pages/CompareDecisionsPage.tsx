import React, { useState, useEffect } from 'react';
import { decisionsAPI } from '../services/api.js';
import { GitCompare, Trophy, ShieldCheck, AlertTriangle, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompareDecisionsPage: React.FC = () => {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [idA, setIdA] = useState<string>('');
  const [idB, setIdB] = useState<string>('');

  useEffect(() => {
    async function loadDecisions() {
      try {
        const res = await decisionsAPI.getAll();
        if (res.success && res.data?.decisions) {
          const list = res.data.decisions;
          setDecisions(list);
          if (list.length >= 2) {
            setIdA(list[0].id);
            setIdB(list[1].id);
          } else if (list.length === 1) {
            setIdA(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load decisions for comparison:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDecisions();
  }, []);

  const decA = decisions.find(d => d.id === idA);
  const decB = decisions.find(d => d.id === idB);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Side-by-Side Decision Matrix Compare
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Compare strategic premises, multi-criteria trade-offs, and risk profiles across two historical analyses.
          </p>
        </div>

        <Link
          to="/decisions/new"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          + Create Another Decision
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
          <span>Loading decisions for comparison...</span>
        </div>
      ) : decisions.length < 2 ? (
        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <GitCompare className="w-10 h-10 text-indigo-400/50 mx-auto" />
          <h3 className="text-base font-bold text-white">Minimum 2 Decisions Required</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You need at least two analyzed decisions in your workspace to execute side-by-side comparative audits.
          </p>
          <Link
            to="/decisions/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            <span>Run New Decision Analysis</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                Primary Workspace (Decision A)
              </label>
              <select
                value={idA}
                onChange={e => setIdA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {decisions.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.domain})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Comparison Workspace (Decision B)
              </label>
              <select
                value={idB}
                onChange={e => setIdB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {decisions.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards */}
          {decA && decB && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Decision A Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {decA.domain}
                  </span>
                  <span className="text-xs font-bold text-white">{decA.confidence_score}% Confidence</span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">
                  {decA.title}
                </h3>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Winning Choice</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-300 mt-0.5">
                    {decA.recommended_option_name || decA.ai_report?.recommendedOptionName}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Urgency</span>
                    <span className="font-semibold text-white">{decA.urgency}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Risk Profile</span>
                    <span className="font-semibold text-white">{decA.risk_appetite}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Budget Ceiling</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{decA.budget_constraint}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Timeline Ceiling</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{decA.timeline_constraint}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Alternatives Evaluated</span>
                    <span className="font-semibold text-white">{decA.alternatives?.length || 0}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Executive Summary:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 line-clamp-4">
                    {decA.ai_report?.executiveSummary || decA.problem_statement}
                  </p>
                </div>

                <Link
                  to={`/decisions/${decA.id}`}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Full Analysis A</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Decision B Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {decB.domain}
                  </span>
                  <span className="text-xs font-bold text-white">{decB.confidence_score}% Confidence</span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">
                  {decB.title}
                </h3>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Winning Choice</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-300 mt-0.5">
                    {decB.recommended_option_name || decB.ai_report?.recommendedOptionName}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Urgency</span>
                    <span className="font-semibold text-white">{decB.urgency}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Risk Profile</span>
                    <span className="font-semibold text-white">{decB.risk_appetite}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Budget Ceiling</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{decB.budget_constraint}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Timeline Ceiling</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{decB.timeline_constraint}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Alternatives Evaluated</span>
                    <span className="font-semibold text-white">{decB.alternatives?.length || 0}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Executive Summary:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 line-clamp-4">
                    {decB.ai_report?.executiveSummary || decB.problem_statement}
                  </p>
                </div>

                <Link
                  to={`/decisions/${decB.id}`}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Full Analysis B</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompareDecisionsPage;
