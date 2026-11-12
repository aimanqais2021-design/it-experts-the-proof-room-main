import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Cpu,
  Layers,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  FileCode2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_PROJECTS, getWhatsAppUrl } from '../data/fallbackData';
import { ProjectItem } from '../types';
import { RevisionBanner } from '../components/RevisionBanner';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();

  const [project, setProject] = useState<ProjectItem | null>(() => {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  });
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);

  useEffect(() => {
    const found = FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    setProject(found);
    setSelectedImageIdx(0);

    if (slug) {
      fetch(`/api/projects/${slug}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && data.slug) setProject(data);
        })
        .catch(() => {
          // Use fallback
        });
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#F1E9D8]">
          {t('Project Not Found in The Proof Room', 'المشروع غير موجود في غرفة الإثبات')}
        </h1>
        <Link
          to="/proof-room"
          className="inline-flex items-center gap-2 rounded-xl bg-[#C9A45C] px-5 py-2.5 text-xs font-bold text-[#090B10]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('Back to The Proof Room', 'العودة إلى غرفة الإثبات')}</span>
        </Link>
      </div>
    );
  }

  const activeEvidence =
    project.evidence_items?.[selectedImageIdx] || project.evidence_items?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/proof-room"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A45C] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('Back to The Proof Room (12 Exhibits)', 'العودة إلى غرفة الإثبات')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="rounded border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#C9A45C]">
            {project.project_code}
          </span>
          <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
            {project.verification_status}
          </span>
        </div>
      </div>

      {/* Title & Summary */}
      <div className="luxury-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              {lang === 'ar' ? project.category?.name_ar : project.category?.name_en}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
              {lang === 'ar' ? project.title_ar : project.title_en}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
              {lang === 'ar' ? project.short_description_ar : project.short_description_en}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/free-review"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9A45C] px-5 py-3 text-xs font-bold text-[#090B10] shadow-goldGlow hover:bg-[#E4C580] transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t('Request Similar Project', 'اطلب مشروعاً مشابهاً')}</span>
            </Link>
            <a
              href={getWhatsAppUrl(
                `Hello IT EXPERTS! I inspected ${project.project_code} (${project.title_en}) in The Proof Room and want to request a similar build.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t('Discuss on WhatsApp', 'ناقش المشروع عبر واتساب')}</span>
            </a>
          </div>
        </div>

        {/* Quantitative Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-4 border-t border-white/10">
          {Object.entries(project.metrics || {}).map(([label, val]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#090B10] p-4">
              <div className="text-[11px] font-semibold uppercase text-gray-400">{label}</div>
              <div className="mt-1 font-mono text-lg font-extrabold text-[#C9A45C]">
                {String(val)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCREENSHOT EVIDENCE GALLERY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              {t('AUTHENTIC EXECUTION EVIDENCE GALLERY', 'معرض أدلة التنفيذ الفعلي الموثقة')}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#F1E9D8]">
              {t(
                'Verified Workbench Captures (overview / execution-result / detailed-view)',
                'لقطات الإثبات المعتمدة (نظرة عامة / نتيجة التنفيذ / التحليل التفصيلي)'
              )}
            </h2>
          </div>

          <div className="flex gap-2">
            {(project.evidence_items || []).map((ev, idx) => (
              <button
                key={ev.id || idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  selectedImageIdx === idx
                    ? 'bg-[#C9A45C] text-[#090B10]'
                    : 'border border-white/15 bg-[#171A20] text-gray-300 hover:border-[#C9A45C]'
                }`}
              >
                {idx === 0
                  ? '01 // overview.png'
                  : idx === 1
                  ? '02 // execution-result.png'
                  : '03 // detailed-view.png'}
              </button>
            ))}
          </div>
        </div>

        {activeEvidence && (
          <div className="luxury-card rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-[#090B10]">
              <img
                src={activeEvidence.image_url}
                alt={lang === 'ar' ? activeEvidence.title_ar : activeEvidence.title_en}
                className="w-full object-contain max-h-[640px] mx-auto"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs">
              <div>
                <h3 className="font-bold text-[#C9A45C] text-sm">
                  {lang === 'ar' ? activeEvidence.title_ar : activeEvidence.title_en}
                </h3>
                <p className="text-gray-300 mt-0.5">
                  {lang === 'ar' ? activeEvidence.caption_ar : activeEvidence.caption_en}
                </p>
              </div>
              <div className="shrink-0 rounded-lg border border-white/10 bg-[#090B10] px-3 py-2 font-mono text-[11px] text-gray-400">
                <div>Hardware: {activeEvidence.hardware_info}</div>
                <div className="text-emerald-400">
                  SHA-256: {activeEvidence.sha256_hash.slice(0, 28)}...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PROBLEM, TECHNICAL APPROACH & ARCHITECTURE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
            {t('01. Problem Statement', '01. المشكلة الهندسية والبحثية')}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
            {lang === 'ar' ? project.problem_statement_ar : project.problem_statement_en}
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
            {t('02. Technical Solution & Approach', '02. المنهجية والحل التقني')}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
            {lang === 'ar' ? project.technical_approach_ar : project.technical_approach_en}
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
            {t('03. System Architecture Pipeline', '03. معمارية النظام وخط المعالجة')}
          </h3>
          <p className="font-mono text-xs leading-relaxed text-[#F1E9D8] bg-[#090B10] p-3.5 rounded-xl border border-white/10">
            {lang === 'ar' ? project.architecture_ar : project.architecture_en}
          </p>
        </div>
      </div>

      {/* TECH STACK & OPEN-SOURCE ATTRIBUTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="luxury-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
            {t('Technology Stack & Dependencies', 'حزمة التقنيات والمكتبات المعتمدة')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-[#C9A45C]/30 bg-[#090B10] px-3.5 py-1.5 text-xs font-semibold text-[#F1E9D8]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
            {t('Source Attribution & Open-Source License', 'توثيق المصدر والترخيص مفتوح المصدر')}
          </h3>
          <div className="text-xs space-y-1.5 text-gray-300">
            <div>
              <strong>{t('Upstream Reference:', 'المستودع المرجعي:')}</strong>{' '}
              <a
                href={project.repository_source?.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A45C] hover:underline inline-flex items-center gap-1"
              >
                <span>{project.repository_source?.repo_name}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div>
              <strong>{t('Original Owner:', 'المالك الأصلي:')}</strong>{' '}
              {project.repository_source?.original_owner}
            </div>
            <div>
              <strong>{t('License:', 'الترخيص:')}</strong>{' '}
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-emerald-400">
                {project.repository_source?.license?.spdx_id} ({project.repository_source?.license?.name})
              </span>
            </div>
            <p className="text-gray-400 pt-1">
              {project.repository_source?.selection_rationale}
            </p>
          </div>
        </div>
      </div>

      <RevisionBanner />
    </div>
  );
};
