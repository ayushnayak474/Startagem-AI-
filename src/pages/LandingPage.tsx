import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Radar,
  Sliders,
  Scale,
  Zap,
  Lock,
  GitBranch,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-xs font-semibold text-indigo-300 mb-6 shadow-sm shadow-indigo-950">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Decision Intelligence Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          Transform Ambiguous Dilemmas into{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
            Auditable, Strategic Decisions.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
          Stratagem AI unifies qualitative constraints, quantitative Multi-Criteria Decision Analysis (MCDA),
          probabilistic risk modeling, and real-time parameter perturbation simulations into an explainable boardroom intelligence system.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to Strategy Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>One-Click Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
              >
                Create Free Workspace
              </Link>
            </>
          )}
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-900">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-white">4.2×</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Decision Velocity</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">MCDA Auditability</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">5×5</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Probabilistic Matrix</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 10s</div>
            <div className="text-xs text-slate-400 font-medium mt-1">What-If Shock Engine</div>
          </div>
        </div>
      </section>

      {/* Visual Analytics Showcase Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-2">
            RIGOROUS ARCHITECTURE
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for High-Stakes Capital & Architectural Dilemmas
          </h3>
          <p className="text-sm text-slate-400 mt-3">
            Replace gut feelings and confirmation bias with multi-dimensional utility scoring and transparent reversal thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Radar className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Multi-Dimensional Trade-off Radar</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically maps competing alternatives across 5 standardized vectors: Cost Efficiency, Strategic Alignment, Speed to Value, Risk Resilience, and Scalability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-cyan-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">5×5 Probabilistic Risk Register</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts hidden vulnerabilities, assigning quantitative Likelihood (1–5) and Impact Severity (1–5) coordinates with early warning triggers and mitigation protocols.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Interactive What-If Copilot</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stress-test decisions against real-time shocks—budget reductions, timeline compression, or regulatory hurdles—with exact mathematical score adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* Pre-Built Scenarios Preview */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Instant Evaluation Presets
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Calibrated Enterprise Scenarios Ready to Run
              </h3>
            </div>
            <button
              onClick={handleDemoClick}
              className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 group"
            >
              <span>Explore full library in Demo Mode</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Cloud & AI Architecture</span>
                <h4 className="text-sm font-bold text-white mt-1 mb-2">
                  Enterprise LLM Deployment: Self-Hosted GPU Cluster vs. Managed Cloud API vs. Hybrid RAG Gateway
                </h4>
                <p className="text-xs text-slate-400">
                  Resolves data sovereignty, latency, and 3-year TCO constraints across 4,200 knowledge workers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Confidence: 89%</span>
                <span className="text-emerald-400 font-semibold">Recommended: Hybrid RAG Gateway</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">Operations & Supply Chain</span>
                <h4 className="text-sm font-bold text-white mt-1 mb-2">
                  Semiconductor Sourcing: Single-Source Taiwan vs. Dual-Shore Mexico/Vietnam vs. Domestic Buffer
                </h4>
                <p className="text-xs text-slate-400">
                  De-risks critical automotive microcontroller supply chain against regional maritime embargoes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Confidence: 84%</span>
                <span className="text-emerald-400 font-semibold">Recommended: Dual-Shore Mexico/Vietnam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-300">Stratagem AI</span>
          <span>— Enterprise Decision Intelligence & Strategic Knowledge Discovery</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Powered by @google/genai</span>
          <span>Zero Placeholders</span>
          <span>Multi-Tenant RLS Isolated</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
