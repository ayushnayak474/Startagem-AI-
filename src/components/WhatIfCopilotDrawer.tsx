import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Clock,
  History
} from 'lucide-react';
import { decisionsAPI } from '../services/api.js';

interface ScoreAdjustment {
  optionName: string;
  previousScore: number;
  simulatedScore: number;
  deltaReason: string;
}

interface SimulationResponse {
  simulationSummary: string;
  doesRecommendationChange: boolean;
  newRecommendedOption: string;
  updatedConfidenceScore: number;
  scoreAdjustments: ScoreAdjustment[];
  newRisksIntroduced: string[];
  tacticalAdvice: string;
}

interface SavedSimulation {
  id: string;
  decision_id: string;
  user_prompt: string;
  ai_simulation_response: SimulationResponse;
  created_at: string;
}

interface WhatIfCopilotDrawerProps {
  decisionId: string;
  isOpen: boolean;
  onClose: () => void;
  simulations: SavedSimulation[];
  onSimulationAdded: (newSim: SavedSimulation) => void;
}

export const WhatIfCopilotDrawer: React.FC<WhatIfCopilotDrawerProps> = ({
  decisionId,
  isOpen,
  onClose,
  simulations,
  onSimulationAdded
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  if (!isOpen) return null;

  const quickPrompts = [
    'What if our budget ceiling is cut by 35% due to a company-wide freeze?',
    'What if key delivery timeline must compress from Q3 to just 6 weeks?',
    'What if primary commercial vendor hikes API prices by 40% next quarter?'
  ];

  const handleSimulate = async (queryText?: string) => {
    const textToRun = queryText || prompt;
    if (!textToRun || textToRun.trim().length < 10) {
      setError('Please provide at least 10 characters describing the scenario shock.');
      return;
    }

    setError(null);
    setIsSimulating(true);

    try {
      const res = await decisionsAPI.runWhatIf(decisionId, textToRun.trim());
      if (res.success && res.data?.simulation) {
        onSimulationAdded(res.data.simulation);
        setPrompt('');
      } else {
        setError(res.error || 'Simulation failed to calculate delta.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Simulation engine error');
    } finally {
      setIsSimulating(false);
    }
  };

  const latestSim = simulations[simulations.length - 1];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>What-If Simulation Copilot</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Test dynamic parameter shocks and observe mathematical score reversals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {simulations.length > 0 && (
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('new')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  activeTab === 'new' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Simulator
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                <History className="w-3 h-3" />
                <span>{simulations.length}</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === 'history' ? (
          /* Past Simulations History */
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Simulation Log History ({simulations.length})
            </h4>
            {simulations.slice().reverse().map(sim => {
              const res = sim.ai_simulation_response;
              return (
                <div
                  key={sim.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(sim.created_at).toLocaleTimeString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.doesRecommendationChange
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {res.doesRecommendationChange ? 'DECISION FLIPPED' : 'RECOMMENDATION HELD'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 italic border-l-2 border-indigo-500 pl-2">
                    "{sim.user_prompt}"
                  </p>

                  <p className="text-xs text-slate-300">
                    {res.simulationSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300 font-medium">
                    New Winner: <strong>{res.newRecommendedOption}</strong> ({res.updatedConfidenceScore}% confidence)
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Active Simulator & Latest Output */
          <div className="space-y-6">
            {/* Quick suggested shock scenarios */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Simulate Pre-Configured Shocks:
              </span>
              <div className="flex flex-col gap-2">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(q);
                      handleSimulate(q);
                    }}
                    disabled={isSimulating}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-300 hover:text-white hover:border-indigo-500/60 transition-all flex items-center justify-between group disabled:opacity-50"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Simulation Result */}
            {latestSim && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Simulation Outcome
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      latestSim.ai_simulation_response.doesRecommendationChange
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {latestSim.ai_simulation_response.doesRecommendationChange
                      ? '⚠️ Recommendation Flipped'
                      : '✓ Original Winner Holds'}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {latestSim.ai_simulation_response.simulationSummary}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Simulated Recommended Option</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">
                    {latestSim.ai_simulation_response.newRecommendedOption}
                  </div>
                  <div className="text-xs text-indigo-400 mt-1">
                    Updated Confidence: <strong>{latestSim.ai_simulation_response.updatedConfidenceScore}%</strong>
                  </div>
                </div>

                {/* Score Adjustments */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Score Perturbation Deltas:
                  </span>
                  <div className="space-y-1.5">
                    {latestSim.ai_simulation_response.scoreAdjustments?.map((adj, i) => {
                      const diff = Math.round((adj.simulatedScore - adj.previousScore) * 10) / 10;
                      return (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-slate-200">{adj.optionName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">{adj.previousScore} → {adj.simulatedScore}</span>
                              <span
                                className={`font-bold flex items-center ${
                                  diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {diff >= 0 ? (
                                  <>
                                    <TrendingUp className="w-3 h-3 mr-0.5" />+{diff}
                                  </>
                                ) : (
                                  <>
                                    <TrendingDown className="w-3 h-3 mr-0.5" />{diff}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400">{adj.deltaReason}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* New Risks */}
                {latestSim.ai_simulation_response.newRisksIntroduced?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>New Risks Surfaced by Shock:</span>
                    </span>
                    <ul className="space-y-1">
                      {latestSim.ai_simulation_response.newRisksIntroduced.map((r, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tactical Advice */}
                {latestSim.ai_simulation_response.tacticalAdvice && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs">
                    <span className="font-bold text-indigo-300 block mb-1">Boardroom Tactical Advice:</span>
                    <p className="text-slate-200 leading-relaxed">
                      {latestSim.ai_simulation_response.tacticalAdvice}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawer Input Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/60">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSimulate();
          }}
          className="space-y-2.5"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. What if inflation forces our unit cost up by 20% while delivery timeline shrinks by 4 weeks?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed resize-none"
              disabled={isSimulating}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Powered by @google/genai structured simulation
            </span>
            <button
              type="submit"
              disabled={isSimulating || prompt.trim().length < 10}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Shock Delta...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Run Simulation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatIfCopilotDrawer;
