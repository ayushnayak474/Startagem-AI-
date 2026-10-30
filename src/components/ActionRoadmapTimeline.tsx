import React from 'react';
import { Calendar, CheckSquare, Target, Rocket } from 'lucide-react';

interface RoadmapPhase {
  phase: string;
  objective: string;
  actionItems: string[];
  successMetric: string;
}

interface ActionRoadmapTimelineProps {
  roadmap: RoadmapPhase[];
}

export const ActionRoadmapTimeline: React.FC<ActionRoadmapTimelineProps> = ({ roadmap }) => {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              30-60-90 Day Execution & Governance Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Phased tactical implementation schedule to operationalize the winning alternative.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roadmap.map((phase, idx) => {
          const phaseColors = [
            { border: 'border-indigo-500/40', badge: 'bg-indigo-500/20 text-indigo-300' },
            { border: 'border-cyan-500/40', badge: 'bg-cyan-500/20 text-cyan-300' },
            { border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' }
          ];
          const color = phaseColors[idx % phaseColors.length];

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl bg-slate-950 border ${color.border} flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color.badge}`}>
                    Phase {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{idx === 0 ? 'Days 1-30' : idx === 1 ? 'Days 31-60' : 'Days 61-90'}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  {phase.phase}
                </h4>

                <p className="text-xs text-slate-300 italic border-l-2 border-slate-700 pl-2.5 py-0.5">
                  "{phase.objective}"
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5">
                    {phase.actionItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Target Success KPI
                    </span>
                    <span className="text-xs font-semibold text-emerald-300 leading-tight">
                      {phase.successMetric}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionRoadmapTimeline;
