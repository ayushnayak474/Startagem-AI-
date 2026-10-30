import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionsAPI } from '../services/api.js';
import PresetScenarioSelector from '../components/PresetScenarioSelector.js';
import DecisionWizardForm from '../components/DecisionWizardForm.js';
import { PresetScenario } from '../constants/presetScenarios.js';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewDecisionPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedPreset, setSelectedPreset] = useState<PresetScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (scenario: PresetScenario) => {
    setSelectedPreset(scenario);
    setError(null);
  };

  const handleFormSubmit = async (formData: any) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await decisionsAPI.analyze(formData);
      if (res.success && res.data?.decision?.id) {
        navigate(`/decisions/${res.data.decision.id}`);
      } else {
        setError(res.error || 'Failed to analyze decision scenario.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Decision Intelligence Engine failed to compute report. Check Gemini API key configuration.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Guided Decision Intelligence Wizard
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MCDA Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Frame your strategic dilemma, configure weighted criteria, set hard ceilings, and run multi-dimensional trade-off discovery.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      {/* Preset Scenario Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <PresetScenarioSelector
          onSelectScenario={handleSelectPreset}
          selectedId={selectedPreset?.id}
        />
      </div>

      {/* Decision Builder Form Wizard */}
      <DecisionWizardForm
        initialData={selectedPreset}
        onSubmit={handleFormSubmit}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default NewDecisionPage;
