import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { decisionsAPI } from '../services/api.js';
import ExecutiveVerdictBanner from '../components/ExecutiveVerdictBanner.js';
import RadarTradeoffChart from '../components/RadarTradeoffChart.js';
import WeightedScoreBarChart from '../components/WeightedScoreBarChart.js';
import RiskHeatmapMatrix from '../components/RiskHeatmapMatrix.js';
import ExplainabilityAuditPanel from '../components/ExplainabilityAuditPanel.js';
import ActionRoadmapTimeline from '../components/ActionRoadmapTimeline.js';
import WhatIfCopilotDrawer from '../components/WhatIfCopilotDrawer.js';
import ExportDecisionMemoModal from '../components/ExportDecisionMemoModal.js';
import {
  ArrowLeft,
  Share2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DecisionReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [decision, setDecision] = useState<any>(null);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [expandedOption, setExpandedOption] = useState<number | null>(0);

  const fetchDecisionReport = async () => {
    if (!id) return;
    try {
      const res = await decisionsAPI.getById(id);
      if (res.success && res.data?.decision) {
        setDecision(res.data.decision);
        setSimulations(res.data.simulations || []);
      } else {
        setError(res.error || 'Decision record not found or unauthorized.');
      }
    } catch (err: any) {
      console.error('Failed to load decision report:', err);
      setError(err.response?.data?.error || err.message || 'Failed to retrieve decision workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisionReport();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!decision) return;
    setIsBookmarking(true);
    try {
      const res = await decisionsAPI.toggleBookmark(decision.id);
      if (res.success) {
        setDecision((prev: any) => ({ ...prev, is_bookmarked: !prev.is_bookmarked }));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleDelete = async () => {
    if (!decision) return;
    if (!window.confirm('Are you sure you want to permanently delete this decision workspace?')) return;
    try {
      await decisionsAPI.delete(decision.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete decision:', err);
    }
  };

  const handleSimulationAdded = (newSim: any) => {
    setSimulations(prev => [...prev, newSim]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-slate-400">Loading AI Decision Intelligence Synthesis...</span>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Decision Workspace Unavailable</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const report = decision.ai_report || {};
  const optionEvals = report.optionEvaluations || [];
  const radarComparison = report.radarComparison || [];
  const scenarioSensitivity = report.scenarioSensitivity || [];
  const riskMatrix = report.riskMatrix || [];
  const explainabilityAudit = report.explainabilityAudit || {
    whyWinnerWon: 'Demonstrated superior multi-criteria score.',
    whyRunnerUpLost: 'Fell short on critical constraint criteria.',
    keyAssumptions: ['Stable market conditions'],
    reversalTriggers: ['Significant budget cuts']
  };
  const executionRoadmap = report.executionRoadmap || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Back breadcrumb and quick action bar */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Decisions Library</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Decision Workspace"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Executive Verdict Banner */}
      <ExecutiveVerdictBanner
        decision={decision}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleBookmark={handleToggleBookmark}
        isBookmarking={isBookmarking}
      />

      {/* 2. Visual Analytics Grid: Radar & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarTradeoffChart radarData={radarComparison} />
        <WeightedScoreBarChart
          evaluations={optionEvals}
          scenarios={scenarioSensitivity}
        />
      </div>

      {/* 3. In-Depth Option-by-Option Evaluation Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Multi-Criteria Option-by-Option Breakdown
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Granular scoring for every candidate alternative against user-defined weights and hard constraints.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {optionEvals.map((opt: any, idx: number) => {
            const isWinner = opt.rank === 1;
            const isExpanded = expandedOption === idx;

            return (
              <div
                key={opt.optionName}
                className={`rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-indigo-950/30 border-indigo-500/50'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedOption(isExpanded ? null : idx)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        isWinner
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{opt.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {opt.optionName}
                        </h4>
                        {isWinner && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            WINNER
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Compliance:{' '}
                        <strong
                          className={
                            opt.constraintCompliance === 'FULL_COMPLIANCE'
                              ? 'text-emerald-400'
                              : opt.constraintCompliance === 'PARTIAL_RISK'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {opt.constraintCompliance}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-black text-white">
                        {opt.overallWeightedScore} <span className="text-xs text-slate-500">/ 100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Weighted Score</span>
                    </div>

                    <div className="text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 space-y-4 pt-2 border-t border-slate-800/80">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Strengths */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Key Strategic Strengths</span>
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {opt.strengths?.map((s: string, sIdx: number) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/20">
                        <span className="font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                          <XCircle className="w-4 h-4" />
                          <span>Identified Vulnerabilities & Trade-offs</span>
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {opt.weaknesses?.map((w: string, wIdx: number) => (
                            <li key={wIdx} className="flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {opt.tradeOffSummary && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-bold text-indigo-300 block mb-1">Executive Trade-off Summary:</span>
                        <p className="text-slate-300 leading-relaxed">{opt.tradeOffSummary}</p>
                      </div>
                    )}

                    {/* Criteria Sub-Scores Table */}
                    {opt.criteriaScores && (
                      <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-900 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="py-2.5 px-3">Criterion</th>
                              <th className="py-2.5 px-3 text-center">Weight</th>
                              <th className="py-2.5 px-3 text-center">Raw Score</th>
                              <th className="py-2.5 px-3">Analytical Justification</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                            {opt.criteriaScores.map((c: any, cIdx: number) => (
                              <tr key={cIdx}>
                                <td className="py-2.5 px-3 font-semibold text-slate-200">
                                  {c.criterionName}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-indigo-400">
                                  {c.weight}/10
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-100">
                                  {c.rawScore}/100
                                </td>
                                <td className="py-2.5 px-3 text-slate-400">
                                  {c.justification}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Probabilistic 5x5 Risk Heatmap & Register */}
      <RiskHeatmapMatrix risks={riskMatrix} />

      {/* 5. Explainable AI Audit Trail & Patterns */}
      <ExplainabilityAuditPanel
        audit={explainabilityAudit}
        patterns={report.decisionPatterns}
      />

      {/* 6. Action Roadmap Timeline */}
      <ActionRoadmapTimeline roadmap={executionRoadmap} />

      {/* What-If Copilot Slide-Over Drawer */}
      <WhatIfCopilotDrawer
        decisionId={decision.id}
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        simulations={simulations}
        onSimulationAdded={handleSimulationAdded}
      />

      {/* Export Executive Memo Modal */}
      <ExportDecisionMemoModal
        decision={decision}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};

export default DecisionReportPage;
