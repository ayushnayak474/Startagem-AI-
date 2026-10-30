import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Eye, Search, Filter } from 'lucide-react';

export interface RiskItem {
  riskId: string;
  riskTitle: string;
  affectedOption: string;
  category: 'FINANCIAL' | 'TECHNICAL' | 'OPERATIONAL' | 'MARKET' | 'REGULATORY' | string;
  likelihood: number; // 1 to 5
  impact: number;     // 1 to 5
  mitigationStrategy: string;
  earlyWarningIndicator: string;
}

interface RiskHeatmapMatrixProps {
  risks: RiskItem[];
}

export const RiskHeatmapMatrix: React.FC<RiskHeatmapMatrixProps> = ({ risks }) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(risks[0] || null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredRisks = categoryFilter === 'ALL'
    ? risks
    : risks.filter(r => r.category.toUpperCase() === categoryFilter);

  // Helper for cell severity level
  const getSeverityLevel = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 15) return { label: 'CRITICAL', bg: 'bg-rose-500/20 border-rose-500/40 text-rose-300' };
    if (score >= 9) return { label: 'HIGH', bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300' };
    if (score >= 5) return { label: 'MEDIUM', bg: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' };
    return { label: 'LOW', bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' };
  };

  const getCellBg = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 16) return 'bg-rose-950/60 border-rose-800/40';
    if (score >= 10) return 'bg-orange-950/50 border-orange-800/30';
    if (score >= 6) return 'bg-amber-950/40 border-amber-800/30';
    return 'bg-emerald-950/30 border-emerald-800/20';
  };

  const likelihoodLabels = [
    { val: 5, label: '5 - Almost Certain' },
    { val: 4, label: '4 - Likely' },
    { val: 3, label: '3 - Moderate' },
    { val: 2, label: '2 - Unlikely' },
    { val: 1, label: '1 - Rare' }
  ];

  const impactLabels = [
    { val: 1, label: '1 - Negligible' },
    { val: 2, label: '2 - Minor' },
    { val: 3, label: '3 - Moderate' },
    { val: 4, label: '4 - Major' },
    { val: 5, label: '5 - Catastrophic' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Probabilistic Risk Exposure Matrix (5×5)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Interactive Likelihood vs. Impact Severity grid plotted across all candidate alternatives.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories ({risks.length})</option>
            <option value="FINANCIAL">Financial</option>
            <option value="TECHNICAL">Technical</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="REGULATORY">Regulatory</option>
            <option value="MARKET">Market</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 5x5 Matrix Canvas */}
        <div className="lg:col-span-7 bg-slate-950/80 p-4 sm:p-5 rounded-xl border border-slate-800/80 overflow-x-auto">
          <div className="min-w-[420px]">
            {/* Top Y-Axis Label */}
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center justify-between">
              <span>Likelihood (Vertical) vs Impact (Horizontal)</span>
              <span className="text-rose-400 text-[10px] font-semibold">High Severity Corner ↗</span>
            </div>

            {/* Matrix Grid */}
            <div className="space-y-1.5">
              {likelihoodLabels.map(l => (
                <div key={l.val} className="flex items-center gap-1.5">
                  <div className="w-24 text-[10px] font-semibold text-slate-400 truncate text-right pr-2">
                    {l.label}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {[1, 2, 3, 4, 5].map(imp => {
                      const cellRisks = filteredRisks.filter(
                        r => r.likelihood === l.val && r.impact === imp
                      );
                      const cellBg = getCellBg(l.val, imp);
                      return (
                        <div
                          key={imp}
                          className={`h-12 rounded-lg border p-1 flex flex-wrap gap-1 items-center justify-center transition-all ${cellBg}`}
                        >
                          {cellRisks.map(r => (
                            <button
                              key={r.riskId}
                              onClick={() => setSelectedRisk(r)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold shadow-sm transition-transform hover:scale-110 ${
                                selectedRisk?.riskId === r.riskId
                                  ? 'bg-white text-slate-950 ring-2 ring-indigo-400'
                                  : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                              }`}
                              title={`${r.riskId}: ${r.riskTitle}`}
                            >
                              {r.riskId}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom X-Axis Labels */}
            <div className="flex items-center gap-1.5 mt-2 pl-24">
              {impactLabels.map(imp => (
                <div
                  key={imp.val}
                  className="flex-1 text-center text-[10px] font-semibold text-slate-400 truncate"
                >
                  {imp.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Risk Protocol Details Card */}
        <div className="lg:col-span-5 bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[300px]">
          {selectedRisk ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedRisk.riskId}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {selectedRisk.category} RISK
                  </span>
                </div>
                {(() => {
                  const sev = getSeverityLevel(selectedRisk.likelihood, selectedRisk.impact);
                  return (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${sev.bg}`}>
                      {sev.label} SEVERITY
                    </span>
                  );
                })()}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                  {selectedRisk.riskTitle}
                </h4>
                <div className="text-xs text-indigo-400 font-medium">
                  Affected Option: <span className="text-slate-200">{selectedRisk.affectedOption}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Likelihood</span>
                  <span className="font-extrabold text-slate-100">{selectedRisk.likelihood} / 5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Impact Severity</span>
                  <span className="font-extrabold text-slate-100">{selectedRisk.impact} / 5</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Actionable Mitigation Protocol</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {selectedRisk.mitigationStrategy}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Early Warning Indicator</span>
                </span>
                <p className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                  {selectedRisk.earlyWarningIndicator}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs py-10">
              <AlertTriangle className="w-8 h-8 mb-2 opacity-40" />
              <span>Select any risk in the matrix to view mitigation protocols.</span>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Risk Register Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-bold">ID</th>
              <th className="py-3 px-4 font-bold">Risk Title</th>
              <th className="py-3 px-4 font-bold">Option</th>
              <th className="py-3 px-4 font-bold">Category</th>
              <th className="py-3 px-4 font-bold text-center">Likelihood</th>
              <th className="py-3 px-4 font-bold text-center">Impact</th>
              <th className="py-3 px-4 font-bold">Mitigation Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {filteredRisks.map(r => {
              const sev = getSeverityLevel(r.likelihood, r.impact);
              return (
                <tr
                  key={r.riskId}
                  onClick={() => setSelectedRisk(r)}
                  className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                    selectedRisk?.riskId === r.riskId ? 'bg-indigo-950/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                    {r.riskId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-100 max-w-xs truncate">
                    {r.riskTitle}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {r.affectedOption}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-200">
                    {r.likelihood}/5
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-200">
                    {r.impact}/5
                  </td>
                  <td className="py-3 px-4 text-slate-400 line-clamp-1 max-w-md">
                    {r.mitigationStrategy}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskHeatmapMatrix;
