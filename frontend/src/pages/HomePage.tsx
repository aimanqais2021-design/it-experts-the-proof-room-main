import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Terminal,
  MessageCircle,
  ExternalLink,
  Code2,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_PROJECTS, FALLBACK_SERVICES, getWhatsAppUrl } from '../data/fallbackData';
import { ProjectItem, ServiceItem } from '../types';
import { RevisionBanner } from '../components/RevisionBanner';

export const HomePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>(
    FALLBACK_PROJECTS.filter((p) => p.is_featured)
  );
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetch('/api/projects?featured=true').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/services').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([projData, srvData]) => {
        if (!active) return;
        if (Array.isArray(projData) && projData.length > 0) setFeaturedProjects(projData);
        if (Array.isArray(srvData) && srvData.length > 0) setServices(srvData);
      })
      .catch(() => {
        // Fallback data already loaded
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#C9A45C]/20 bg-gradient-to-b from-[#090B10] via-[#11151E] to-[#090B10] pt-14 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#C9A45C]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('IT EXPERTS // THE PROOF ROOM', 'خبراء التقنية // غرفة الإثبات الموثقة')}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#F1E9D8]">
                {t('YOUR IT WORLD.', 'عالمك التقني.')}{' '}
                <span className="luxury-gradient-text block mt-1">
                  {t('OUR EXPERTISE.', 'خبرتنا الموثقة.')}
                </span>
              </h1>

              <p className="text-lg sm:text-xl font-bold text-[#C9A45C]">
                {t(
                  "DON'T TAKE OUR WORD FOR IT. SEE WHAT WE CAN BUILD.",
                  'لا تكتفِ بكلامنا.. شاهد ما نبنيه بالأدلة الفعلية.'
                )}
              </p>

              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-gray-300">
                {t(
                  'Welcome to The Proof Room — an interactive engineering platform where every AI, Computer Vision, NLP, Full-Stack, Networking, Database, and Scientific Simulation project is executed on real hardware and documented with SHA-256 verified screenshots.',
                  'مرحباً بك في غرفة الإثبات — المنصة الهندسية التفاعلية التي توثق مشاريع الذكاء الاصطناعي، الرؤية الحاسوبية، معالجة اللغات، تطبيقات الويب، الشبكات، والمحاكاة العلمية بأدلة تشغيل حقيقية ومخرجات موثقة.'
                )}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/proof-room"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E4C580] px-6 py-3.5 text-sm font-bold text-[#090B10] shadow-goldGlow hover:brightness-110 transition"
                >
                  <span>{t('Explore The Proof Room', 'استكشف غرفة الإثبات')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/free-review"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#C9A45C]/50 bg-[#171A20] px-6 py-3.5 text-sm font-bold text-[#F1E9D8] hover:border-[#C9A45C] hover:text-[#C9A45C] transition"
                >
                  <span>{t('Free Initial Tech Check', 'اطلب فحصاً تقنياً مجانياً')}</span>
                </Link>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t('WhatsApp Direct', 'تواصل عبر واتساب')}</span>
                </a>
              </div>

              {/* Trust Strip */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <div className="font-display text-2xl font-extrabold text-[#C9A45C]">12 / 12</div>
                  <div className="text-xs text-gray-400">
                    {t('Verified Executed Projects', 'مشاريع منفذة وموثقة بالكامل')}
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-[#C9A45C]">36 PNGs</div>
                  <div className="text-xs text-gray-400">
                    {t('SHA-256 Signed Screenshots', 'لقطات إثبات موقعة رقمياً')}
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-emerald-400">100% Free</div>
                  <div className="text-xs text-gray-400">
                    {t('Revisions Within Agreed Scope', 'تعديلات مجانية ضمن النطاق')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase Preview */}
            <div className="lg:col-span-5">
              <div className="luxury-card rounded-2xl p-4 shadow-goldGlow">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-[#C9A45C]">
                      LIVE EVIDENCE // PROJ-01
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                    RTX 5070 Ti VERIFIED
                  </span>
                </div>
                <img
                  src="/evidence/real-time-object-detection/overview.png"
                  alt="IT EXPERTS Real-Time Object Detection Proof"
                  className="w-full rounded-xl border border-white/10 object-cover"
                />
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">
                    {t('VisionSentinel Real-Time Detection (185 FPS)', 'نظام الكشف الفوري عن الأجسام (185 إطار/ثانية)')}
                  </span>
                  <Link
                    to="/projects/real-time-object-detection"
                    className="font-bold text-[#C9A45C] hover:underline"
                  >
                    {t('Inspect Evidence →', 'افحص الدليل ←')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED TIER-1 VERIFIED PROJECTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              {t('VERIFIED TECHNICAL PORTFOLIO', 'معرض المشاريع الموثقة بالأدلة')}
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#F1E9D8]">
              {t('Tier-1 Featured Proof Room Exhibits', 'أبرز المشاريع المعتمدة في غرفة الإثبات')}
            </h2>
          </div>
          <Link
            to="/proof-room"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C9A45C] hover:underline"
          >
            <span>{t('View All 12 Verified Projects', 'عرض جميع المشاريع الـ 12 الموثقة')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading && featuredProjects.length === 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 animate-pulse rounded-2xl bg-[#171A20]" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(0, 6).map((proj) => (
              <div key={proj.slug} className="luxury-card flex flex-col justify-between rounded-2xl overflow-hidden">
                <div>
                  <div className="relative h-48 overflow-hidden bg-[#090B10]">
                    <img
                      src={proj.evidence_items?.[0]?.image_url || `/evidence/${proj.slug}/overview.png`}
                      alt={lang === 'ar' ? proj.title_ar : proj.title_en}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded bg-[#090B10]/90 border border-[#C9A45C]/50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#C9A45C]">
                        {proj.project_code}
                      </span>
                      <span className="rounded bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                        {proj.verification_status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-semibold text-[#C9A45C]">
                      {lang === 'ar' ? proj.category?.name_ar : proj.category?.name_en}
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-[#F1E9D8]">
                      {lang === 'ar' ? proj.title_ar : proj.title_en}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-300">
                      {lang === 'ar' ? proj.short_description_ar : proj.short_description_en}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.tech_stack.slice(0, 4).map((tech) => (
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

                <div className="border-t border-white/10 bg-[#090B10]/50 px-5 py-3.5 flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {t('License:', 'الترخيص:')}{' '}
                    <strong className="text-[#F1E9D8]">
                      {proj.repository_source?.license?.spdx_id || 'MIT'}
                    </strong>
                  </span>
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[#C9A45C] hover:underline"
                  >
                    <span>{t('View Evidence', 'فحص الأدلة')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
            {t('END-TO-END ENGINEERING CAPABILITIES', 'قدرات هندسية وأكاديمية متكاملة')}
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#F1E9D8]">
            {t('Specialized Technology & Academic Domains', 'مجالات التخصص التقني والبحثي')}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((srv) => (
            <div key={srv.slug} className="luxury-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A45C]/15 text-[#C9A45C]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-[#C9A45C]/30 bg-[#C9A45C]/10 px-3 py-0.5 text-[11px] font-semibold text-[#C9A45C]">
                    {srv.starting_timeline}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#F1E9D8]">
                  {lang === 'ar' ? srv.title_ar : srv.title_en}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">
                  {lang === 'ar' ? srv.description_ar : srv.description_en}
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                  {(lang === 'ar' ? srv.deliverables_ar : srv.deliverables_en).map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  to="/free-review"
                  className="text-xs font-bold text-[#C9A45C] hover:underline"
                >
                  {t('Request Free Assessment →', 'اطلب تقييماً مجانياً ←')}
                </Link>
                <a
                  href={getWhatsAppUrl(
                    `Hello IT EXPERTS! I am inquiring about: ${srv.title_en}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-400 hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVISION POLICY BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevisionBanner />
      </div>

      {/* INTERACTIVE CHALLENGES TEASER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="luxury-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A45C]">
              <Terminal className="h-4 w-4" />
              <span>{t('INTERACTIVE TECHNICAL SANDBOX', 'مختبر التحديات التقنية التفاعلية')}</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#F1E9D8]">
              {t(
                'Test Our Engineering Depth Across 5 Live Challenges',
                'اختبر عمقنا الهندسي عبر 5 تحديات تقنية تفاعلية مباشرة'
              )}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              {t(
                'Explore real diagnostic scenarios in Python concurrency, PostgreSQL B-Tree indexing, AI class imbalance, OSPF routing, and algorithmic complexity — with instant architectural explanations.',
                'جرب سيناريوهات حقيقية في تصحيح أخطاء بايثون، فهرسة قواعد البيانات، تقييم نماذج الذكاء الاصطناعي، توجيه الشبكات، وتعقيد الخوارزميات مع شرح فوري.'
              )}
            </p>
          </div>
          <Link
            to="/challenges"
            className="shrink-0 rounded-xl border border-[#C9A45C] bg-[#C9A45C]/15 px-6 py-3.5 text-sm font-bold text-[#C9A45C] hover:bg-[#C9A45C] hover:text-[#090B10] transition"
          >
            {t('Launch Interactive Challenges', 'ابدأ التحديات التفاعلية')}
          </Link>
        </div>
      </section>
    </div>
  );
};
