import React from 'react';
import { PRESET_SCENARIOS, PresetScenario } from '../constants/presetScenarios.js';
import { Cpu, Truck, BadgePercent, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface PresetScenarioSelectorProps {
  onSelectScenario: (scenario: PresetScenario) => void;
  selectedId?: string;
}

export const PresetScenarioSelector: React.FC<PresetScenarioSelectorProps> = ({
  onSelectScenario,
  selectedId
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-emerald-400" />;
      case 'BadgePercent':
        return <BadgePercent className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">{urgency}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>One-Click Real-World Scenarios</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select a calibrated enterprise case to pre-fill all criteria, weights, and competing options for immediate AI analysis.
          </p>
        </div>
        <span className="text-[11px] font-medium text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/60 w-fit">
          4 Boardroom Templates Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {PRESET_SCENARIOS.map(scenario => {
          const isSelected = selectedId === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between group ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                      {getIcon(scenario.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                        {scenario.domainLabel}
                      </span>
                    </div>
                  </div>
                  {getUrgencyBadge(scenario.urgency)}
                </div>

                <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
                  {scenario.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {scenario.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{scenario.alternatives.length} Options</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scenario.criteria.length} Criteria</span>
                  </span>
                </div>

                <button
                  type="button"
                  className={`inline-flex items-center gap-1 font-semibold text-xs transition-colors ${
                    isSelected ? 'text-indigo-300' : 'text-slate-400 group-hover:text-white'
                  }`}
                >
                  <span>{isSelected ? 'Loaded' : 'Load Preset'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresetScenarioSelector;
