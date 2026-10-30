import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface OptionEvaluation {
  optionName: string;
  overallWeightedScore: number;
  rank: number;
  constraintCompliance: string;
}

interface ScenarioSensitivity {
  optionName: string;
  baseCaseScore: number;
  optimisticCaseScore: number;
  stressTestScore: number;
  stressVulnerabilityNote?: string;
}

interface WeightedScoreBarChartProps {
  evaluations: OptionEvaluation[];
  scenarios: ScenarioSensitivity[];
}

export const WeightedScoreBarChart: React.FC<WeightedScoreBarChartProps> = ({
  evaluations,
  scenarios
}) => {
  const [viewMode, setViewMode] = useState<'overall' | 'scenarios'>('overall');

  // Overall MCDA Scores Data
  const overallData = evaluations.map(ev => ({
    name: ev.optionName.length > 24 ? ev.optionName.slice(0, 22) + '...' : ev.optionName,
    fullName: ev.optionName,
    score: ev.overallWeightedScore,
    rank: ev.rank,
    compliance: ev.constraintCompliance
  }));

  // Scenario Sensitivity Data
  const scenarioData = scenarios.map(sc => ({
    name: sc.optionName.length > 24 ? sc.optionName.slice(0, 22) + '...' : sc.optionName,
    fullName: sc.optionName,
    Base: sc.baseCaseScore,
    Optimistic: sc.optimisticCaseScore,
    'Stress-Test': sc.stressTestScore,
    note: sc.stressVulnerabilityNote
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Option Utility & Scenario Stress-Testing</span>
          </h3>
          <p className="text-xs text-slate-400">
            {viewMode === 'overall'
              ? 'Multi-Criteria Decision Analysis (MCDA) normalized weighted utility (0–100)'
              : 'Sensitivity simulation: Base vs. Optimistic vs. Stress-Test Black Swan conditions'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setViewMode('overall')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'overall'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MCDA Score
          </button>
          <button
            onClick={() => setViewMode('scenarios')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'scenarios'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scenario Sensitivity
          </button>
        </div>
      </div>

      <div className="h-80 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'overall' ? (
            <BarChart
              data={overallData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 500 }}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                        <div className="font-bold text-white mb-1">{data.fullName}</div>
                        <div className="text-indigo-400 font-semibold">
                          Score: {data.score} / 100
                        </div>
                        <div className="text-slate-400">Rank: #{data.rank}</div>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              data.compliance === 'FULL_COMPLIANCE'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : data.compliance === 'PARTIAL_RISK'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {data.compliance}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          ) : (
            <BarChart
              data={scenarioData}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Base" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Optimistic" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Stress-Test" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightedScoreBarChart;
