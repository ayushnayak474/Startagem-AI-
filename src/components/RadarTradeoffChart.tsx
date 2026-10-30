import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface RadarComparisonItem {
  optionName: string;
  costEfficiency: number;
  strategicAlignment: number;
  speedToValue: number;
  riskResilience: number;
  scalability: number;
}

interface RadarTradeoffChartProps {
  radarData: RadarComparisonItem[];
}

const OPTION_COLORS = [
  { stroke: '#6366f1', fill: '#6366f1' }, // Indigo
  { stroke: '#06b6d4', fill: '#06b6d4' }, // Cyan
  { stroke: '#10b981', fill: '#10b981' }, // Emerald
  { stroke: '#f59e0b', fill: '#f59e0b' }, // Amber
  { stroke: '#ec4899', fill: '#ec4899' }, // Pink
  { stroke: '#8b5cf6', fill: '#8b5cf6' }  // Purple
];

export const RadarTradeoffChart: React.FC<RadarTradeoffChartProps> = ({ radarData }) => {
  if (!radarData || radarData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-500 text-xs">
        No radar trade-off data available.
      </div>
    );
  }

  // Dimensions
  const dimensions = [
    { key: 'costEfficiency', label: 'Cost Efficiency' },
    { key: 'strategicAlignment', label: 'Strategic Alignment' },
    { key: 'speedToValue', label: 'Speed to Value' },
    { key: 'riskResilience', label: 'Risk Resilience' },
    { key: 'scalability', label: 'Scalability' }
  ];

  // Pivot data so each dimension is a row, with columns for each option
  const chartData = dimensions.map(dim => {
    const row: Record<string, any> = { dimension: dim.label };
    radarData.forEach(opt => {
      row[opt.optionName] = (opt as any)[dim.key] ?? 50;
    });
    return row;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
          <span>Multi-Option Trade-off Radar</span>
          <span className="text-[11px] font-medium text-slate-400">Normalized 0–100 Scale</span>
        </h3>
        <p className="text-xs text-slate-400">
          Comparing candidate alternatives across the 5 core strategic vectors.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              stroke="#334155"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
            />
            {radarData.map((opt, idx) => {
              const color = OPTION_COLORS[idx % OPTION_COLORS.length];
              return (
                <Radar
                  key={opt.optionName}
                  name={opt.optionName}
                  dataKey={opt.optionName}
                  stroke={color.stroke}
                  fill={color.fill}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarTradeoffChart;
