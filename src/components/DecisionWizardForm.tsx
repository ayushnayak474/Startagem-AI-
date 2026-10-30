import React, { useState } from 'react';
import {
  DOMAIN_CRITERIA_DEFAULTS,
  EvaluationCriterion,
  CandidateAlternative,
  PresetScenario
} from '../constants/presetScenarios.js';
import {
  CheckCircle2,
  Sliders,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Layers,
  Scale
} from 'lucide-react';

interface DecisionFormData {
  title: string;
  domain: 'TECH_ARCH' | 'PRODUCT_GTM' | 'FINANCE_INVEST' | 'OPERATIONS_SUPPLY' | 'TALENT_ORG' | 'POLICY_ESG';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskAppetite: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  stakeholders: string;
  problemStatement: string;
  budgetConstraint: string;
  timelineConstraint: string;
  nonNegotiables: string[];
  criteria: EvaluationCriterion[];
  alternatives: CandidateAlternative[];
}

interface DecisionWizardFormProps {
  initialData?: PresetScenario | null;
  onSubmit: (data: DecisionFormData) => void;
  isAnalyzing: boolean;
}

export const DecisionWizardForm: React.FC<DecisionWizardFormProps> = ({
  initialData,
  onSubmit,
  isAnalyzing
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newNonNegotiable, setNewNonNegotiable] = useState<string>('');

  const [formData, setFormData] = useState<DecisionFormData>(() => {
    if (initialData) {
      return {
        title: initialData.title,
        domain: initialData.domain,
        urgency: initialData.urgency,
        riskAppetite: initialData.riskAppetite,
        stakeholders: initialData.stakeholders,
        problemStatement: initialData.problemStatement,
        budgetConstraint: initialData.budgetConstraint,
        timelineConstraint: initialData.timelineConstraint,
        nonNegotiables: [...initialData.nonNegotiables],
        criteria: [...initialData.criteria],
        alternatives: [...initialData.alternatives]
      };
    }
    return {
      title: '',
      domain: 'TECH_ARCH',
      urgency: 'HIGH',
      riskAppetite: 'BALANCED',
      stakeholders: 'Executive Leadership, VP Engineering, CFO',
      problemStatement: '',
      budgetConstraint: '$500,000 maximum budget cap',
      timelineConstraint: 'Production ready within 12 weeks',
      nonNegotiables: ['Zero data leakage', 'SOC2 Type II compliance'],
      criteria: [...DOMAIN_CRITERIA_DEFAULTS.TECH_ARCH],
      alternatives: [
        {
          name: 'Option A: Modern Managed Platform Architecture',
          summary: 'Leverage managed cloud-native services with automated horizontal scaling and enterprise SLAs.',
          estimatedCost: '$280,000 / year',
          estimatedTimeline: '8 weeks',
          knownNotes: 'High velocity and low maintenance overhead.'
        },
        {
          name: 'Option B: Self-Hosted Dedicated Infrastructure',
          summary: 'Deploy open-source modular components on dedicated bare-metal or private VPC instances.',
          estimatedCost: '$450,000 initial + $180k/yr',
          estimatedTimeline: '16 weeks',
          knownNotes: 'Complete infrastructure sovereignty but higher operational complexity.'
        }
      ]
    };
  });

  // When initialData changes (e.g. user selected another preset)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        domain: initialData.domain,
        urgency: initialData.urgency,
        riskAppetite: initialData.riskAppetite,
        stakeholders: initialData.stakeholders,
        problemStatement: initialData.problemStatement,
        budgetConstraint: initialData.budgetConstraint,
        timelineConstraint: initialData.timelineConstraint,
        nonNegotiables: [...initialData.nonNegotiables],
        criteria: [...initialData.criteria],
        alternatives: [...initialData.alternatives]
      });
    }
  }, [initialData]);

  // Handle Domain Change: Optionally reset criteria to that domain's defaults
  const handleDomainChange = (newDomain: DecisionFormData['domain']) => {
    setFormData(prev => ({
      ...prev,
      domain: newDomain,
      criteria: DOMAIN_CRITERIA_DEFAULTS[newDomain] || prev.criteria
    }));
  };

  // Step 1 Validation
  const isStep1Valid =
    formData.title.trim().length >= 5 &&
    formData.problemStatement.trim().length >= 30;

  // Step 2 Validation
  const isStep2Valid =
    formData.budgetConstraint.trim().length >= 2 &&
    formData.timelineConstraint.trim().length >= 2;

  // Step 3 Validation
  const isStep3Valid =
    formData.criteria.length >= 2 &&
    formData.criteria.every(c => c.name.trim().length >= 2 && c.weight >= 1 && c.weight <= 10);

  // Step 4 Validation
  const isStep4Valid =
    formData.alternatives.length >= 2 &&
    formData.alternatives.every(
      a => a.name.trim().length >= 2 && a.summary.trim().length >= 10
    );

  // Criteria Weight Management
  const totalWeight = formData.criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...formData.criteria];
    updated[index].weight = newWeight;
    setFormData({ ...formData, criteria: updated });
  };

  const addCriterion = () => {
    if (formData.criteria.length >= 8) return;
    setFormData({
      ...formData,
      criteria: [
        ...formData.criteria,
        { name: `Criterion ${formData.criteria.length + 1}`, weight: 5, description: '' }
      ]
    });
  };

  const removeCriterion = (index: number) => {
    if (formData.criteria.length <= 2) return;
    setFormData({
      ...formData,
      criteria: formData.criteria.filter((_, i) => i !== index)
    });
  };

  // Alternatives Management
  const addAlternative = () => {
    if (formData.alternatives.length >= 6) return;
    const letter = String.fromCharCode(65 + formData.alternatives.length);
    setFormData({
      ...formData,
      alternatives: [
        ...formData.alternatives,
        {
          name: `Option ${letter}: Alternative Solution`,
          summary: 'Detailed description of this proposed alternative strategy and implementation scope.',
          estimatedCost: '$250,000',
          estimatedTimeline: '12 weeks',
          knownNotes: ''
        }
      ]
    });
  };

  const removeAlternative = (index: number) => {
    if (formData.alternatives.length <= 2) return;
    setFormData({
      ...formData,
      alternatives: formData.alternatives.filter((_, i) => i !== index)
    });
  };

  const updateAlternative = (index: number, field: keyof CandidateAlternative, value: string) => {
    const updated = [...formData.alternatives];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, alternatives: updated });
  };

  // Non-negotiables
  const addNonNegotiable = () => {
    if (!newNonNegotiable.trim()) return;
    setFormData({
      ...formData,
      nonNegotiables: [...formData.nonNegotiables, newNonNegotiable.trim()]
    });
    setNewNonNegotiable('');
  };

  const removeNonNegotiable = (index: number) => {
    setFormData({
      ...formData,
      nonNegotiables: formData.nonNegotiables.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid) {
      return;
    }
    onSubmit(formData);
  };

  const steps = [
    { number: 1, title: 'Context & Scope', desc: 'Domain, Urgency & Problem' },
    { number: 2, title: 'Ceilings & Appetite', desc: 'Budget, Time & Risk' },
    { number: 3, title: 'Weighted Criteria', desc: 'Evaluation Priorities' },
    { number: 4, title: 'Candidate Options', desc: '2 to 6 Alternatives' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Step Progress Header */}
      <div className="border-b border-slate-800 bg-slate-950/60 p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map(step => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-indigo-950/50 border-indigo-500 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-900 border-emerald-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">{step.title}</div>
                  <div className="text-[10px] text-slate-400 truncate hidden sm:block">{step.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
        {/* STEP 1: CONTEXT & SCOPE */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Decision Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Enterprise Cloud Migration: Serverless vs. Kubernetes vs. Managed PaaS"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Give your strategic dilemma a concise, high-impact executive title (5-180 chars).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Strategic Domain *
                </label>
                <select
                  value={formData.domain}
                  onChange={e => handleDomainChange(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="TECH_ARCH">Technology & Cloud Architecture</option>
                  <option value="PRODUCT_GTM">Product & Go-To-Market Strategy</option>
                  <option value="FINANCE_INVEST">Capital Allocation & Investment</option>
                  <option value="OPERATIONS_SUPPLY">Supply Chain & Operations</option>
                  <option value="TALENT_ORG">Organizational Talent & Workforce</option>
                  <option value="POLICY_ESG">Public Policy, Sustainability & ESG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Decision Urgency *
                </label>
                <select
                  value={formData.urgency}
                  onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="LOW">Low (Exploratory / Roadmap)</option>
                  <option value="MEDIUM">Medium (Planned Quarter)</option>
                  <option value="HIGH">High (Immediate Strategic Priority)</option>
                  <option value="CRITICAL">Critical (Existential / Urgent Crisis)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Key Decision Stakeholders
              </label>
              <input
                type="text"
                value={formData.stakeholders}
                onChange={e => setFormData({ ...formData, stakeholders: e.target.value })}
                placeholder="e.g. Board of Directors, CTO, VP Engineering, CFO"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Problem Statement & Strategic Context *
              </label>
              <textarea
                rows={4}
                value={formData.problemStatement}
                onChange={e => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="Describe the operational background, market forces, technical bottlenecks, or business inflection point driving this decision..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm leading-relaxed"
                required
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Provide rich context for the AI engine to evaluate nuances accurately.</span>
                <span>{formData.problemStatement.length} / 4000 chars</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CEILINGS & RISK APPETITE */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Budget Ceiling / Capital Cap *</span>
                </label>
                <input
                  type="text"
                  value={formData.budgetConstraint}
                  onChange={e => setFormData({ ...formData, budgetConstraint: e.target.value })}
                  placeholder="e.g. $250,000 annual run-rate ceiling"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Timeline Deadline / Delivery Ceiling *</span>
                </label>
                <input
                  type="text"
                  value={formData.timelineConstraint}
                  onChange={e => setFormData({ ...formData, timelineConstraint: e.target.value })}
                  placeholder="e.g. Must be live in production within Q3 (14 weeks)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Executive Risk Appetite Profile *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: 'CONSERVATIVE',
                    label: 'Conservative',
                    desc: 'Prioritizes downside mitigation, strict compliance, and proven resilience over raw speed or maximum upside.'
                  },
                  {
                    value: 'BALANCED',
                    label: 'Balanced',
                    desc: 'Weighs calculated operational trade-offs; accepts moderate managed uncertainty for competitive velocity.'
                  },
                  {
                    value: 'AGGRESSIVE',
                    label: 'Aggressive',
                    desc: 'Optimizes for breakthrough growth, rapid time to market, and asymmetric upside with elevated tolerance.'
                  }
                ].map(r => (
                  <div
                    key={r.value}
                    onClick={() => setFormData({ ...formData, riskAppetite: r.value as any })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.riskAppetite === r.value
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">{r.label}</span>
                      {formData.riskAppetite === r.value && (
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Non-Negotiables & Hard Regulatory Constraints</span>
                <span className="text-[11px] text-slate-400">Up to 10 mandatory rules</span>
              </label>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={newNonNegotiable}
                  onChange={e => setNewNonNegotiable(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addNonNegotiable();
                    }
                  }}
                  placeholder="e.g. Zero corporate data retention, SOC2 Type II, 99.99% SLA"
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
                <button
                  type="button"
                  onClick={addNonNegotiable}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.nonNegotiables.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeNonNegotiable(idx)}
                      className="ml-1 text-slate-400 hover:text-rose-400"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {formData.nonNegotiables.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No non-negotiables added yet.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WEIGHTED EVALUATION CRITERIA */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <span>Multi-Criteria Weights (Scale 1–10)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Assign relative weights. Stratagem AI normalizes these into exact percentage influence scores.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, criteria: DOMAIN_CRITERIA_DEFAULTS[prev.domain] }))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={addCriterion}
                  disabled={formData.criteria.length >= 8}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Criterion</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.criteria.map((criterion, idx) => {
                const normalizedPct = totalWeight > 0 ? Math.round((criterion.weight / totalWeight) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <input
                        type="text"
                        value={criterion.name}
                        onChange={e => {
                          const updated = [...formData.criteria];
                          updated[idx].name = e.target.value;
                          setFormData({ ...formData, criteria: updated });
                        }}
                        placeholder="Criterion Name"
                        className="font-semibold text-sm text-slate-100 bg-transparent border-b border-slate-700/60 focus:border-indigo-400 focus:outline-none pb-0.5"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/80">
                          {normalizedPct}% impact
                        </span>
                        <span className="text-xs font-semibold text-slate-300 w-16 text-right">
                          Weight: {criterion.weight}/10
                        </span>
                        {formData.criteria.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeCriterion(idx)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={criterion.weight}
                        onChange={e => handleWeightChange(idx, parseInt(e.target.value, 10))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <input
                      type="text"
                      value={criterion.description || ''}
                      onChange={e => {
                        const updated = [...formData.criteria];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, criteria: updated });
                      }}
                      placeholder="Optional judgment guidelines for AI scoring..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CANDIDATE ALTERNATIVES */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Candidate Alternatives to Evaluate ({formData.alternatives.length}/6)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Define 2 to 6 realistic options with estimated budget, delivery timeline, and strategic notes.
                </p>
              </div>
              <button
                type="button"
                onClick={addAlternative}
                disabled={formData.alternatives.length >= 6}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Alternative</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-300 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={alt.name}
                        onChange={e => updateAlternative(idx, 'name', e.target.value)}
                        placeholder="Option Name"
                        className="font-bold text-sm text-slate-100 bg-transparent border-b border-slate-700/60 focus:border-indigo-400 focus:outline-none pb-0.5 flex-1"
                        required
                      />
                    </div>
                    {formData.alternatives.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeAlternative(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Summary & Architectural / Operational Approach *
                    </label>
                    <textarea
                      rows={2}
                      value={alt.summary}
                      onChange={e => updateAlternative(idx, 'summary', e.target.value)}
                      placeholder="Detailed strategy, technologies, logistics, or operational model involved in this option..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Estimated Cost / Budget Impact
                      </label>
                      <input
                        type="text"
                        value={alt.estimatedCost}
                        onChange={e => updateAlternative(idx, 'estimatedCost', e.target.value)}
                        placeholder="e.g. $180,000 / year"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Estimated Time to Value
                      </label>
                      <input
                        type="text"
                        value={alt.estimatedTimeline}
                        onChange={e => updateAlternative(idx, 'estimatedTimeline', e.target.value)}
                        placeholder="e.g. 10 weeks"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Known Notes / Caveats / Internal Assumptions
                    </label>
                    <input
                      type="text"
                      value={alt.knownNotes || ''}
                      onChange={e => updateAlternative(idx, 'knownNotes', e.target.value)}
                      placeholder="e.g. Depends on existing team AWS certification, vendor price guarantees..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  (currentStep === 3 && !isStep3Valid)
                }
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStep4Valid || isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing Gemini Decision Analysis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Decision Intelligence Engine</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DecisionWizardForm;
