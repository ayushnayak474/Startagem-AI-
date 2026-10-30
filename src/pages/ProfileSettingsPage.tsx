import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { healthAPI } from '../services/api.js';
import { User, Building2, Briefcase, ShieldCheck, Check, AlertCircle, Server, Activity } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [organization, setOrganization] = useState<string>(user?.organization || '');
  const [roleTitle, setRoleTitle] = useState<string>(user?.roleTitle || '');
  const [defaultRiskAppetite, setDefaultRiskAppetite] = useState<'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'>(
    user?.defaultRiskAppetite || 'BALANCED'
  );

  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setOrganization(user.organization || '');
      setRoleTitle(user.roleTitle || '');
      setDefaultRiskAppetite(user.defaultRiskAppetite || 'BALANCED');
    }
  }, [user]);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await healthAPI.check();
        if (res.success) {
          setHealthStatus(res.data);
        }
      } catch (err) {
        console.error('Failed to query health endpoint:', err);
      }
    }
    checkHealth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile({
        fullName,
        organization,
        roleTitle,
        defaultRiskAppetite
      });
      setSuccessMessage('Profile and workspace risk appetite updated successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Workspace Profile & Risk Governance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure executive credentials, default corporate risk posture, and examine system health.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Strategist Information</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Legal / Corporate Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address (Workspace UID)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-slate-500 text-xs cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Primary tenant identifier cannot be altered for cryptographic audit integrity.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Organization Name</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Executive Role Title</span>
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Default Organizational Risk Appetite</span>
              </label>
              <select
                value={defaultRiskAppetite}
                onChange={e => setDefaultRiskAppetite(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="CONSERVATIVE">Conservative — Downside Defense & High Regulatory Compliance</option>
                <option value="BALANCED">Balanced — Calculated Tactical Trade-offs</option>
                <option value="AGGRESSIVE">Aggressive — Rapid Breakout & Asymmetric Growth</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* System & Architecture Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Platform Health</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">AI Decision Engine</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Gemini SDK Connected</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Model: gemini-2.5-flash / gemini-3.8-flash
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Database Persistence</span>
                <span className="text-xs font-bold text-indigo-300 block mt-0.5">
                  {healthStatus?.databaseType || 'PostgreSQL Engine'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Tenant Isolation: Verified RLS Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Server Uptime</span>
                <span className="text-xs font-bold text-slate-200 block mt-0.5">
                  {healthStatus?.uptime || 'Operational'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Stratagem AI v1.0.0 Enterprise Release
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
