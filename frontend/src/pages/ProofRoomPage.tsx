import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_CATEGORIES, FALLBACK_PROJECTS } from '../data/fallbackData';
import { CategoryInfo, ProjectItem } from '../types';

export const ProofRoomPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(FALLBACK_PROJECTS);
  const [categories, setCategories] = useState<CategoryInfo[]>(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetch('/api/projects').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/projects/categories').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([projData, catData]) => {
        if (!active) return;
        if (Array.isArray(projData) && projData.length > 0) setProjects(projData);
        if (Array.isArray(catData) && catData.length > 0) setCategories(catData);
      })
      .catch(() => {
        // Keep fallback
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      if (selectedCategory !== 'all' && proj.category?.slug !== selectedCategory) {
        return false;
      }
      if (tierFilter === 'featured' && !proj.is_featured) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = [
          proj.project_code,
          proj.title_en,
          proj.title_ar,
          proj.short_description_en,
          proj.short_description_ar,
          ...(proj.tech_stack || []),
          proj.repository_source?.repo_name || '',
        ]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [projects, selectedCategory, tierFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="rounded-2xl border border-[#C9A45C]/30 bg-gradient-to-r from-[#171A20] via-[#12151C] to-[#090B10] p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-3.5 py-1 text-xs font-bold text-[#C9A45C]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t('THE PROOF ROOM // 12 VERIFIED EXHIBITS', 'غرفة الإثبات // 12 مشروعاً موثقاً بالأدلة')}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
          {t(
            "DON'T TAKE OUR WORD FOR IT. SEE WHAT WE CAN BUILD.",
            'لا تكتفِ بكلامنا.. شاهد ما نبنيه بالأدلة الموثقة.'
          )}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-300">
          {t(
            'Every project below has been executed in an isolated environment, benchmarked with real data, attributed to its open-source license, and verified with 3 high-resolution screenshots (overview.png, execution-result.png, detailed-view.png).',
            'تم تنفيذ كل مشروع أدناه فعلياً واختباره ببيانات حقيقية وتوثيق ترخيصه ومصادره مع 3 لقطات شاشة عالية الدقة وموقعة رقمياً.'
          )}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="luxury-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'Search by title, tech stack (PyTorch, FastAPI, SQL)...',
                'ابحث بعنوان المشروع أو التقنية (PyTorch, FastAPI, SQL)...'
              )}
              className="w-full rounded-xl border border-white/15 bg-[#090B10] pl-10 pr-4 py-2.5 text-xs text-[#F1E9D8] placeholder-gray-500 focus:border-[#C9A45C] focus:outline-none"
            />
          </div>

          {/* Launch Tier Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setTierFilter('all')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                tierFilter === 'all'
                  ? 'bg-[#C9A45C] text-[#090B10]'
                  : 'border border-white/15 bg-[#090B10] text-gray-300 hover:border-[#C9A45C]/50'
              }`}
            >
              {t('All 12 Verified Projects', 'جميع المشاريع (12)')}
            </button>
            <button
              onClick={() => setTierFilter('featured')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                tierFilter === 'featured'
                  ? 'bg-[#C9A45C] text-[#090B10]'
                  : 'border border-white/15 bg-[#090B10] text-gray-300 hover:border-[#C9A45C]/50'
              }`}
            >
              {t('Tier-1 Launch Featured (6)', 'مشاريع الإطلاق المميزة (6)')}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]'
                : 'bg-[#090B10] text-gray-400 border border-white/10 hover:text-[#F1E9D8]'
            }`}
          >
            {t('All Domains', 'كل المجالات')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat.slug
                  ? 'bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]'
                  : 'bg-[#090B10] text-gray-400 border border-white/10 hover:text-[#F1E9D8]'
              }`}
            >
              {lang === 'ar' ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="luxury-card rounded-2xl p-12 text-center space-y-4">
          <Filter className="mx-auto h-10 w-10 text-[#C9A45C]" />
          <h3 className="text-lg font-bold text-[#F1E9D8]">
            {t('No matching projects found', 'لم يتم العثور على مشاريع مطابقة لبحثك')}
          </h3>
          <p className="text-xs text-gray-400">
            {t(
              'Try clearing your search filter or switching to All Domains.',
              'جرب مسح كلمة البحث أو اختيار جميع المجالات.'
            )}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setTierFilter('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C9A45C] px-5 py-2.5 text-xs font-bold text-[#090B10]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('Reset Filters', 'إعادة ضبط الفلاتر')}</span>
          </button>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((proj) => (
            <div
              key={proj.slug}
              className="luxury-card flex flex-col justify-between rounded-2xl overflow-hidden"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-[#090B10]">
                  <img
                    src={proj.evidence_items?.[0]?.image_url || `/evidence/${proj.slug}/overview.png`}
                    alt={lang === 'ar' ? proj.title_ar : proj.title_en}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded bg-[#090B10]/90 border border-[#C9A45C]/50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#C9A45C]">
                      {proj.project_code}
                    </span>
                    <span className="rounded bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      {proj.verification_status}
                    </span>
                    {proj.is_featured && (
                      <span className="rounded bg-[#C9A45C] px-2 py-0.5 text-[10px] font-extrabold text-[#090B10]">
                        {t('FEATURED', 'مميز')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#C9A45C]">
                      {lang === 'ar' ? proj.category?.name_ar : proj.category?.name_en}
                    </span>
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-gray-400">
                      {proj.repository_source?.license?.spdx_id}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#F1E9D8]">
                    {lang === 'ar' ? proj.title_ar : proj.title_en}
                  </h2>

                  <p className="line-clamp-3 text-xs leading-relaxed text-gray-300">
                    {lang === 'ar' ? proj.short_description_ar : proj.short_description_en}
                  </p>

                  {/* Metrics Preview */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {Object.entries(proj.metrics || {})
                      .slice(0, 2)
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="rounded-lg border border-white/10 bg-[#090B10]/80 p-2"
                        >
                          <div className="text-[10px] uppercase text-gray-400">{k}</div>
                          <div className="font-mono text-xs font-bold text-[#F1E9D8]">
                            {String(v)}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/10 bg-[#090B10] px-2 py-0.5 text-[11px] text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-[#090B10]/60 px-5 py-3.5 flex items-center justify-between text-xs">
                <a
                  href={proj.repository_source?.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-[#C9A45C]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{proj.repository_source?.repo_name}</span>
                </a>

                <Link
                  to={`/projects/${proj.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#C9A45C]/15 border border-[#C9A45C]/40 px-3 py-1.5 font-bold text-[#C9A45C] hover:bg-[#C9A45C] hover:text-[#090B10] transition"
                >
                  <span>{t('Inspect Proof', 'فحص الإثبات')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
