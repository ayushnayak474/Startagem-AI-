import React from 'react';
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  HelpCircle,
  Shuffle,
  Compass
} from 'lucide-react';

interface DecisionPattern {
  patternTitle: string;
  insight: string;
  strategicImplication: string;
}

interface ExplainabilityAudit {
  whyWinnerWon: string;
  whyRunnerUpLost: string;
  keyAssumptions: string[];
  reversalTriggers: string[];
}

interface ExplainabilityAuditPanelProps {
  audit: ExplainabilityAudit;
  patterns?: DecisionPattern[];
}

export const ExplainabilityAuditPanel: React.FC<ExplainabilityAuditPanelProps> = ({
  audit,
  patterns = []
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-7">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Explainable AI (XAI) Audit Trail & Strategic Reasoning
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Transparent, auditable justification explaining why the winning alternative outperformed competitors,
          underlying assumptions, and reversal thresholds.
        </p>
      </div>

      {/* Why Winner Won & Why Runner Up Lost */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Decisive Factors: Why Winner Won</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {audit.whyWinnerWon}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4" />
              <span>Deficit Analysis: Why Runner-Up Fell Short</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {audit.whyRunnerUpLost}
            </p>
          </div>
        </div>
      </div>

      {/* Discovered Decision Patterns & Second-Order Effects */}
      {patterns && patterns.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <span>Discovered Dynamics & Second-Order Consequences</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {patterns.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <h5 className="text-xs font-bold text-white mb-1.5 leading-snug">
                    {p.patternTitle}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {p.insight}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Strategic Implication
                  </span>
                  <p className="text-[11px] text-indigo-300 font-medium">
                    {p.strategicImplication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions & Reversal Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Assumptions */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Key Assumptions Required to Hold True</span>
          </h4>
          <ul className="space-y-2">
            {audit.keyAssumptions.map((asm, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>{asm}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reversal Triggers */}
        <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-amber-400" />
            <span>Decision Reversal Triggers (Flip Conditions)</span>
          </h4>
          <ul className="space-y-2">
            {audit.reversalTriggers.map((trig, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{trig}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityAuditPanel;
