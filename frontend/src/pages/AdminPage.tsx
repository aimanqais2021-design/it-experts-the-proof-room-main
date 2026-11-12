import React, { useEffect, useState } from 'react';
import {
  Lock,
  LogOut,
  CheckCircle2,
  FolderKanban,
  Users,
  FileCheck,
  RefreshCw,
  ShieldAlert,
  BarChart3,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_PROJECTS, FALLBACK_SERVICES } from '../data/fallbackData';
import { LeadItem, ProjectItem, RevisionRequestItem } from '../types';

const LEAD_STATUSES = [
  'NEW',
  'UNDER_REVIEW',
  'QUOTED',
  'ACCEPTED',
  'IN_PROGRESS',
  'REVISION',
  'COMPLETED',
  'CLOSED',
];

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ite_admin_token'));
  const [email, setEmail] = useState('admin@itexperts.dev');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads' | 'projects' | 'revisions' | 'services'
  >('overview');

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>(FALLBACK_PROJECTS);
  const [revisions, setRevisions] = useState<RevisionRequestItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [quoteInputs, setQuoteInputs] = useState<Record<number, string>>({});
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});

  const fetchAdminData = async (authToken: string) => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      const [leadsRes, projRes, revRes] = await Promise.all([
        fetch('/api/admin/leads', { headers }),
        fetch('/api/projects'),
        fetch('/api/admin/revisions', { headers }),
      ]);

      if (leadsRes.status === 401) {
        handleLogout();
        return;
      }

      if (leadsRes.ok) {
        const lData = await leadsRes.json();
        setLeads(lData);
      }
      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData);
      }
      if (revRes.ok) {
        const rData = await revRes.json();
        setRevisions(rData);
      }
    } catch {
      // Keep local state if backend is offline
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Invalid administrator credentials.');
      }

      const data = await res.json();
      localStorage.setItem('ite_admin_token', data.access_token);
      setToken(data.access_token);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ite_admin_token');
    setToken(null);
  };

  const handleUpdateLeadStatus = async (leadId: number, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          quoted_amount: quoteInputs[leadId],
          admin_notes: noteInputs[leadId],
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      }
    } catch {}
  };

  const handleToggleFeatured = async (projectId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/toggle-featured`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      }
    } catch {}
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="luxury-card rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A45C] text-[#090B10]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#F1E9D8]">
                {t('IT EXPERTS // ADMIN PORTAL', 'بوابة الإدارة المحمية')}
              </h1>
              <p className="text-xs text-gray-400">
                {t('Role-Based JWT Authentication Required', 'مطلوب تسجيل دخول المشرف المعتمد')}
              </p>
            </div>
          </div>

          {loginError && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#F1E9D8] mb-1">
                {t('Administrator Email', 'البريد الإلكتروني للمشرف')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F1E9D8] mb-1">
                {t('Password', 'كلمة المرور')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#C9A45C] py-3 text-xs font-bold text-[#090B10] hover:bg-[#E4C580] transition"
            >
              {t('Sign In to Administration Suite', 'تسجيل الدخول إلى لوحة الإدارة')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredLeads =
    statusFilter === 'ALL' ? leads : leads.filter((l) => l.status === statusFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar */}
      <div className="luxury-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
            {t('EXECUTIVE ADMINISTRATION SUITE', 'لوحة التحكم الإدارية التنفيذية')}
          </span>
          <h1 className="font-display text-2xl font-bold text-[#F1E9D8]">
            IT EXPERTS — THE PROOF ROOM ADMIN
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminData(token)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#090B10] px-3.5 py-2 text-xs font-semibold text-gray-300 hover:border-[#C9A45C]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('Refresh', 'تحديث')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t('Sign Out', 'خروج')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="luxury-card rounded-2xl p-5">
          <div className="text-xs text-gray-400">{t('Verified Projects', 'المشاريع الموثقة')}</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-[#C9A45C]">
            {projects.length} / 12
          </div>
          <div className="mt-1 text-[11px] text-emerald-400">36 SHA-256 Screenshots Active</div>
        </div>

        <div className="luxury-card rounded-2xl p-5">
          <div className="text-xs text-gray-400">{t('Active Leads & Inquiries', 'طلبات الفحص والعملاء')}</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-[#F1E9D8]">
            {leads.length}
          </div>
          <div className="mt-1 text-[11px] text-[#C9A45C]">8-Stage Workflow Enabled</div>
        </div>

        <div className="luxury-card rounded-2xl p-5">
          <div className="text-xs text-gray-400">{t('Free Revision Requests', 'طلبات التعديل المجاني')}</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-emerald-400">
            {revisions.length}
          </div>
          <div className="mt-1 text-[11px] text-gray-400">100% Scope-Protected</div>
        </div>

        <div className="luxury-card rounded-2xl p-5">
          <div className="text-xs text-gray-400">{t('Active Services', 'الخدمات المتاحة')}</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-[#C9A45C]">
            {FALLBACK_SERVICES.length}
          </div>
          <div className="mt-1 text-[11px] text-gray-400">Bilingual EN / AR Catalog</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'overview', label: t('01. Lead Workflow & CRM', '01. إدارة العملاء وحالات الطلبات') },
          { id: 'projects', label: t('02. Portfolio & Evidence (12)', '02. إدارة المشاريع والأدلة (12)') },
          { id: 'revisions', label: t('03. Free Revision Tracker', '03. متابعة التعديلات المجانية') },
          { id: 'services', label: t('04. Services & Analytics', '04. الخدمات والإحصائيات') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-[#C9A45C] text-[#090B10]'
                : 'bg-[#171A20] text-gray-300 hover:text-[#C9A45C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LEADS WORKFLOW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                statusFilter === 'ALL'
                  ? 'bg-[#C9A45C] text-[#090B10]'
                  : 'bg-[#171A20] text-gray-400'
              }`}
            >
              ALL ({leads.length})
            </button>
            {LEAD_STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold ${
                  statusFilter === st
                    ? 'bg-[#C9A45C] text-[#090B10]'
                    : 'bg-[#171A20] text-gray-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="luxury-card rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-[#C9A45C]/15 border border-[#C9A45C]/40 px-2.5 py-1 font-mono text-xs font-bold text-[#C9A45C]">
                      {lead.reference_code}
                    </span>
                    <h3 className="text-base font-bold text-[#F1E9D8]">{lead.full_name}</h3>
                    <span className="text-xs text-gray-400">({lead.email})</span>
                  </div>

                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
                    {lead.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
                  <div>
                    <strong className="text-gray-400">Category:</strong> {lead.request_category}
                  </div>
                  <div>
                    <strong className="text-gray-400">Field:</strong> {lead.academic_or_tech_field}
                  </div>
                  <div>
                    <strong className="text-gray-400">WhatsApp:</strong>{' '}
                    <span className="font-mono">{lead.phone_whatsapp}</span>
                  </div>
                </div>

                <p className="rounded-xl bg-[#090B10] p-3.5 text-xs text-gray-300 border border-white/10">
                  {lead.project_description}
                </p>

                {/* Status Transition Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-[#C9A45C]">Transition Status:</span>
                  {LEAD_STATUSES.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateLeadStatus(lead.id, st)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                        lead.status === st
                          ? 'bg-[#C9A45C] text-[#090B10]'
                          : 'border border-white/15 bg-[#090B10] text-gray-300 hover:border-[#C9A45C]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS & EVIDENCE */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="luxury-card rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`/evidence/${proj.slug}/overview.png`}
                  alt={proj.title_en}
                  className="h-16 w-24 rounded-lg object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#C9A45C]">
                      {proj.project_code}
                    </span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {proj.verification_status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F1E9D8]">{proj.title_en}</h3>
                  <p className="text-xs text-gray-400">
                    Upstream: {proj.repository_source?.repo_name} ({proj.repository_source?.license?.spdx_id})
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggleFeatured(proj.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  proj.is_featured
                    ? 'bg-[#C9A45C] text-[#090B10]'
                    : 'border border-white/15 bg-[#090B10] text-gray-400'
                }`}
              >
                {proj.is_featured ? 'Tier-1 Featured' : 'Set Featured'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: REVISIONS */}
      {activeTab === 'revisions' && (
        <div className="space-y-4">
          {revisions.length === 0 ? (
            <div className="luxury-card rounded-2xl p-8 text-center text-xs text-gray-400">
              No active revision requests.
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="luxury-card rounded-2xl p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#C9A45C]">
                    Revision #{rev.revision_number} (Lead ID: {rev.lead_id})
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    {rev.is_free_revision ? 'FREE IN-SCOPE REVISION' : 'QUOTED EXPANSION'} — {rev.status}
                  </span>
                </div>
                <p className="text-xs text-gray-200">{rev.description}</p>
                {rev.resolution_notes && (
                  <p className="text-xs text-emerald-400">Resolution: {rev.resolution_notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SERVICES */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FALLBACK_SERVICES.map((srv) => (
            <div key={srv.slug} className="luxury-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F1E9D8]">{srv.title_en}</h3>
                <span className="font-mono text-xs text-[#C9A45C]">{srv.starting_timeline}</span>
              </div>
              <p className="text-xs text-gray-400">{srv.description_en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
