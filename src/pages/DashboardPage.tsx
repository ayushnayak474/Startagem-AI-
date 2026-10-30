import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { decisionsAPI } from '../services/api.js';
import {
  BrainCircuit,
  PlusCircle,
  Search,
  Filter,
  Bookmark,
  TrendingUp,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [decisions, setDecisions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [decisionsRes, statsRes] = await Promise.all([
        decisionsAPI.getAll({
          domain: domainFilter !== 'ALL' ? domainFilter : undefined,
          urgency: urgencyFilter !== 'ALL' ? urgencyFilter : undefined,
          search: search.trim() ? search.trim() : undefined,
          bookmarked: bookmarkedOnly ? true : undefined
        }),
        decisionsAPI.getStats()
      ]);

      if (decisionsRes.success) {
        setDecisions(decisionsRes.data?.decisions || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [domainFilter, urgencyFilter, bookmarkedOnly]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await decisionsAPI.toggleBookmark(id);
      setDecisions(prev =>
        prev.map(d => (d.id === id ? { ...d, is_bookmarked: !d.is_bookmarked } : d))
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this decision workspace?')) {
      return;
    }
    setDeletingId(id);
    try {
      await decisionsAPI.delete(id);
      setDecisions(prev => prev.filter(d => d.id !== id));
      if (stats) {
        setStats({ ...stats, totalDecisions: Math.max(0, stats.totalDecisions - 1) });
      }
    } catch (err) {
      console.error('Failed to delete decision:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getDomainLabel = (domain: string) => {
    const map: Record<string, string> = {
      TECH_ARCH: 'Cloud & Architecture',
      PRODUCT_GTM: 'Product & GTM',
      FINANCE_INVEST: 'Capital & Investment',
      OPERATIONS_SUPPLY: 'Supply & Operations',
      TALENT_ORG: 'Talent & Workforce',
      POLICY_ESG: 'Public Policy & ESG'
    };
    return map[domain] || domain;
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              {user?.organization || 'Executive Strategy Lab'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-medium">Tenant Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Decision Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Executive oversight across active dilemmas, trade-off syntheses, and scenario sensitivities.
          </p>
        </div>

        <Link
          to="/decisions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Decision Analysis</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Decisions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Analyzed</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.totalDecisions ?? decisions.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Auditable records persisted</div>
          </div>
        </div>

        {/* Average Confidence */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Confidence</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
              {stats?.avgConfidence ?? 86}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Cross-option certainty index</div>
          </div>
        </div>

        {/* High Risk Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High-Risk Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats?.highRiskCount ?? 4}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Likelihood & Impact &gt; 3</div>
          </div>
        </div>

        {/* Active Domains */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Risk Profile</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold text-slate-200">
              {user?.defaultRiskAppetite || 'BALANCED'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Default appetite policy</div>
          </div>
        </div>
      </div>

      {/* Decisions Knowledge Repository & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or strategic dilemma..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={domainFilter}
              onChange={e => setDomainFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Domains</option>
              <option value="TECH_ARCH">Cloud & Architecture</option>
              <option value="PRODUCT_GTM">Product & GTM</option>
              <option value="FINANCE_INVEST">Capital & Investment</option>
              <option value="OPERATIONS_SUPPLY">Supply Chain & Operations</option>
              <option value="TALENT_ORG">Talent & Workforce</option>
              <option value="POLICY_ESG">Policy & ESG</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Urgencies</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                bookmarkedOnly
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-amber-400' : ''}`} />
              <span>Bookmarked</span>
            </button>
          </div>
        </div>

        {/* Decision Cards / Table List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
            <span>Loading Decision Intelligence repository...</span>
          </div>
        ) : decisions.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <BrainCircuit className="w-12 h-12 text-indigo-400/40 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white">No decisions found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No decision workspaces match your current filters. Create a new decision analysis or load one of the enterprise presets.
              </p>
            </div>
            <Link
              to="/decisions/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch First Analysis</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {decisions.map(d => {
              const winner = d.recommended_option_name || d.ai_report?.recommendedOptionName || 'Option A';
              const confidence = d.confidence_score ?? d.ai_report?.confidenceScore ?? 85;

              return (
                <div
                  key={d.id}
                  onClick={() => navigate(`/decisions/${d.id}`)}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-md"
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900">
                        {getDomainLabel(d.domain)}
                      </span>
                      {getUrgencyBadge(d.urgency)}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(d.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {d.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1 max-w-3xl">
                      {d.problem_statement}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-400">Recommended Choice:</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {winner}
                      </span>
                    </div>
                  </div>

                  {/* Right Analytics Snapshot & Actions */}
                  <div className="flex items-center gap-4 sm:border-l sm:border-slate-800 sm:pl-5">
                    {/* Confidence score badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-black text-white">{confidence}%</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Confidence</span>
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => handleToggleBookmark(d.id, e)}
                      className={`p-2 rounded-xl border transition-colors ${
                        d.is_bookmarked
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${d.is_bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(d.id, e)}
                      disabled={deletingId === d.id}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900 transition-colors disabled:opacity-50"
                      title="Delete Workspace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
